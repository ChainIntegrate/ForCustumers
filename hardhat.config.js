// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

function accounts() {
  const raw = String(process.env.PRIVATE_KEY || "").trim();
  if (!raw) return [];
  return [raw.startsWith("0x") ? raw : ("0x" + raw)];
}

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    // LUKSO Testnet
    luksoTestnet: {
      url: process.env.LUKSO_TESTNET_RPC || "https://rpc.testnet.lukso.network",
      chainId: Number(process.env.LUKSO_TESTNET_CHAIN_ID || "4201"),
      accounts: accounts(),
    },

    // LUKSO Mainnet
    luksoMainnet: {
      url: process.env.LUKSO_MAINNET_RPC || "https://rpc.mainnet.lukso.network",
      chainId: Number(process.env.LUKSO_MAINNET_CHAIN_ID || "42"),
      accounts: accounts(),
    },
  },
};


