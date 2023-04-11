import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect, assert } from "chai";
import { ethers } from "hardhat";

describe("NFT", function () {
  const NAME = 'Mr.Crypto';
  const SYMBOL = 'MRC';
  const MAX_SUPPLY = 1000;
  const PRICE_PER_NFT = ethers.utils.parseEther("0.001");
  const MAX_NFT_PER_ADDRESS = 10;
  const BASE_URI = "https://apinft.racksmafia.com/api/"

  async function deployFixture() {
  
    const [owner, addr1, addr2] = await ethers.getSigners();
  
    const NFT = await ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(NAME, SYMBOL, MAX_SUPPLY);

    return { nft, owner, addr1, addr2 };
  }

  describe("Full test", function () {
    it("Previous misc", async function () {
      const { nft, owner } = await loadFixture(deployFixture);

      const maxSupply = Number(await nft.maxSupply())
      assert(maxSupply == MAX_SUPPLY)
      const paused = await nft.paused()
      assert(paused == true)
    });

    it("Add whitelist", async function () {
      const { nft, owner, addr1, addr2 } = await loadFixture(deployFixture);
      
      await expect(nft.connect(addr2).addToWhitelist(addr1.address)).to.be.revertedWith("Ownable: caller is not the owner")
      await expect(nft.connect(owner).removeFromWhitelist(addr1.address)).to.be.revertedWith("Not whitelisted")

      assert(await nft.isWhitelisted(addr1.address) == false)
      await nft.connect(owner).addToWhitelist(addr1.address)
      assert(await nft.isWhitelisted(addr1.address) == true)
      await expect(nft.connect(owner).addToWhitelist(addr1.address)).to.be.revertedWith("Already whitelisted")
      await nft.connect(owner).removeFromWhitelist(addr1.address)
      assert(await nft.isWhitelisted(addr1.address) == false)
    });

    it("Mint", async function () {
      const { nft, owner, addr1, addr2 } = await loadFixture(deployFixture);

      await expect(nft.connect(addr1).mint(1)).to.be.revertedWith("You are not whitelisted")

      await nft.connect(owner).addToWhitelist(addr1.address)
      await nft.connect(owner).addToWhitelist(addr2.address)
      await expect(nft.connect(addr1).mint(1)).to.be.revertedWith("Contract paused")

      await expect(nft.connect(owner).unpause()).to.be.revertedWith("pricePerNft should be > 0")
      await nft.connect(owner).setPricePerNft(PRICE_PER_NFT)
      await expect(nft.connect(owner).unpause()).to.be.revertedWith("maxNftPerAddress should be > 0")
      await nft.connect(owner).setMaxNftPerAddress(MAX_NFT_PER_ADDRESS)

      const pricePerNft = Number(await nft.pricePerNft())
      assert(pricePerNft == Number(PRICE_PER_NFT))
      const maxNftPerAddress = Number(await nft.maxNftPerAddress())
      assert(maxNftPerAddress == Number(MAX_NFT_PER_ADDRESS))

      await expect(nft.connect(addr1).unpause()).to.be.revertedWith("Ownable: caller is not the owner")
      await nft.connect(owner).unpause()
      assert(await nft.paused() == false)

      await expect(nft.connect(addr1).mint(1)).to.be.revertedWith("Not enough ether")
      assert(Number(await nft.balanceOf(addr1.address)) == 0)

      await nft.connect(addr1).mint(1, {value: PRICE_PER_NFT})
      assert(Number(await nft.totalSupply()) == 1)
      assert(Number(await nft.balanceOf(addr1.address)) == 1)

      await nft.connect(addr2).mint(10, {value: ethers.utils.parseEther("0.01")})
      assert(Number(await nft.totalSupply()) == 11)
      assert(Number(await nft.balanceOf(addr1.address)) == 1)
      assert(Number(await nft.balanceOf(addr2.address)) == 10)

      await nft.connect(owner).pause()
      assert(await nft.paused() == true)

      const balance = await ethers.provider.getBalance(nft.address)
      assert(Number(balance) == Number(ethers.utils.parseEther("0.011")))
    });

    it("TokenURI", async function () {
      const { nft, owner, addr1, addr2 } = await loadFixture(deployFixture);

      const BASE_URI = "https://apinft.racksmafia.com/api/"

      await nft.connect(owner).setPricePerNft(PRICE_PER_NFT)
      await nft.connect(owner).setMaxNftPerAddress(MAX_NFT_PER_ADDRESS)

      await nft.connect(owner).addToWhitelist(addr1.address)
      await nft.connect(owner).unpause()
      await nft.connect(addr1).mint(1, {value: PRICE_PER_NFT})
    
      await nft.connect(owner).setBaseURI(BASE_URI)
      assert(await nft.baseURI() == BASE_URI)

      expect(await nft.revealed()).to.equal(false)
      assert(await nft.tokenURI(1) == BASE_URI + "0.json")
      await nft.connect(owner).reveal()
      expect(await nft.revealed()).to.equal(true)
      assert(await nft.tokenURI(1) == BASE_URI + "1.json")
      await expect(nft.tokenURI(2)).to.be.revertedWith("ERC721Metadata: URI query for nonexistent token")
    });

    it("Withdraw", async function () {
      const { nft, owner, addr1, addr2 } = await loadFixture(deployFixture);

      await nft.connect(owner).setPricePerNft(PRICE_PER_NFT)
      await nft.connect(owner).setMaxNftPerAddress(MAX_NFT_PER_ADDRESS)

      await nft.connect(owner).addToWhitelist(addr1.address)
      await nft.connect(owner).unpause()

      expect(await nft.getNftsMinted(addr1.address)).to.be.equal(0)
      const tx0 = await nft.connect(addr1).mint(10, {value: ethers.utils.parseEther("0.01")})
      tx0.wait(1)
      expect(await nft.getNftsMinted(addr1.address)).to.be.equal(10)

      await expect(nft.connect(addr1).mint(1, {value: ethers.utils.parseEther("0.001")})).to.be.revertedWith("Limit of nft exceeded")


      const balanceNFT = Number(await ethers.provider.getBalance(nft.address))
      assert(balanceNFT == Number(ethers.utils.parseEther("0.01")))

      await expect(nft.connect(addr1).withdraw()).to.be.revertedWith("Ownable: caller is not the owner")
      const balanceOwner1 = Number(await ethers.provider.getBalance(owner.address))
      const tx = await nft.connect(owner).withdraw()

      // gas used in transaction IMPORTANT!!!!!! //
      const receipt = await tx.wait();
      const totalGasUsed = Number(receipt.gasUsed) * Number(receipt.effectiveGasPrice);
      /////////////////////////////////////////////

      const balanceOwner2 = Number(await ethers.provider.getBalance(owner.address))
      assert(Number(await ethers.provider.getBalance(nft.address)) == 0)

      assert(balanceOwner1 + balanceNFT == balanceOwner2 + totalGasUsed)
    });

  });
});
