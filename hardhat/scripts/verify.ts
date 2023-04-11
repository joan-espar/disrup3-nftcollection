import { ethers } from "hardhat";
import { verify } from "../utils/verify";

// no fa falta si ja ho hem fet al deploy
async function main() {

  const NAME = 'Mr.Grypto';
  const SYMBOL = 'MRG';
  const TOTAL_SUPPLY = 1000;

  const CONTRACT_ADDRESS = "0xea648ca28a27682c6d2069e52c7f5fdaaa48be3e"

  await verify(CONTRACT_ADDRESS, [NAME, SYMBOL, TOTAL_SUPPLY]);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
