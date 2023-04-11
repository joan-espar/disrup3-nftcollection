import { ethers } from "hardhat";
import fs from "fs";
import { verify } from "../utils/verify";

async function main() {

  const NAME = 'Mr.Grypto';
  const SYMBOL = 'MRG';
  const TOTAL_SUPPLY = 1000;
  const PRICE_PER_NFT = ethers.utils.parseEther("0.001");
  const MAX_NFT_PER_ADDRESS = 10;
  const BASE_URI = "https://apinft.racksmafia.com/api/"

  const [owner] = await ethers.getSigners();

  const NFT = await ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(NAME, SYMBOL, TOTAL_SUPPLY);
  await nft.deployed();

  console.log(
    `NFT with name: ${NAME} and symbol ${SYMBOL} - supply: ${TOTAL_SUPPLY},  deployed to ${nft.address}`
  );

  // this generates the address and abi of the contract deployed
  const constants = {
    address: nft.address,
    abi: nft.interface.format(ethers.utils.FormatTypes.json)
  }
  fs.writeFileSync(
    "../frontend/web3Constants/constants.json",
    JSON.stringify(constants)
  )

  try {
    await verify(nft.address, [NAME, SYMBOL, TOTAL_SUPPLY]); 
  } catch(err) {
    console.log(err);
  }

  // MISC after deploy
  await nft.connect(owner).setPricePerNft(PRICE_PER_NFT)
  await nft.connect(owner).setMaxNftPerAddress(MAX_NFT_PER_ADDRESS)

  await nft.connect(owner).setBaseURI(BASE_URI)
  await nft.connect(owner).reveal()

  await nft.connect(owner).addToWhitelist(owner.address)
  await nft.connect(owner).unpause()
  
  const tx1 = await nft.connect(owner).mint(1, {value: PRICE_PER_NFT})
  await tx1.wait(1)
  const tx2 = await nft.connect(owner).withdraw()
  await tx2.wait(1)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
