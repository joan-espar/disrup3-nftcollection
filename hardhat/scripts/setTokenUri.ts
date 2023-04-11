import { ethers } from "hardhat";
import fs from "fs";


// no fa falta si ho hem fet el deploy
async function main() {

  const BASE_URI = "https://apinft.racksmafia.com/api/"

  const [owner] = await ethers.getSigners();

  const CONTRACT_ADDRESS = "0x96c819d8556AF29487416266572B32ea3FcFb062"

  const NFT = await ethers.getContractFactory("NFT");
  const nft = await NFT.attach(CONTRACT_ADDRESS);

  // MISC after deploy
  await nft.connect(owner).setBaseURI(BASE_URI)
  await nft.connect(owner).reveal()

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
