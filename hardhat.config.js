require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");

const MUMBAI_RPC_URL =
  process.env.MUMBAI_RPC_URL ||
  "https://eth-mainnet.alchemyapi.io/v2/your-api-key";

const AURORA_TESTNET_PRIVATE_KEY = process.env.AURORA_TESTNET_PRIVATE_KEY;
const AURORA_RPC_URL = process.env.AURORA_RPC_URL;

const SEPOLIA_RPC_URL =
  process.env.SEPOLIA_RPC_URL ||
  "https://eth-sepolia.g.alchemy.com/v2/SqB6tlKLNG4Vw5_FtTfKtdnoUJwjblk-";
const PRIVATE_KEY =
  process.env.PRIVATE_KEY ||
  "0x11ee3108a03081fe260ecdc106554d09d9d1209bcafd46942b10e02943effc4a";
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      chainId: 31337,
      // accounts: [
      //   {
      //     privateKey: PRIVATE_KEY,
      //     balance: "10000000000000000000000", // optional
      //   },
      // ],
      // gasPrice: 130000000000,
    },

    mumbai: {
      url: MUMBAI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 80001,
      blockConfirmations: 6,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
      blockConfirmations: 6,
    },
    aurora_testnet: {
      url: "https://testnet.aurora.dev",
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 1313161555,
    },
    aurora_mainnet: {
      url: AURORA_RPC_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 1313161554,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0,
      // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
  },
};
