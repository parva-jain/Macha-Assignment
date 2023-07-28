require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const INFURA_URL = process.env.INFURA_URL;

const PRIV_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    goerli: {
      url: INFURA_URL,
      accounts: [PRIV_KEY],
    },
  },
  etherscan: {
    apiKey: "I7E5M8GM57A34EWY8HIYJZD14TZETYTT8F",
  },
};
