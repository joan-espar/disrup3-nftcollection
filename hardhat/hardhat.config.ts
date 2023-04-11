import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
import "@nomiclabs/hardhat-etherscan";
import "solidity-coverage";
import "hardhat-gas-reporter";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.1",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    }
  },
  networks: {
    goerli: {
      accounts: [process.env.PRIVATE_KEY!, process.env.PRIVATE_KEY_2!],
      url: process.env.URL_GOERLI!,
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY!,
  },
  gasReporter: {
    enabled: false,
    currency: 'USD',
  },
};

export default config;
