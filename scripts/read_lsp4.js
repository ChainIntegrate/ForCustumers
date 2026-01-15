const hre = require("hardhat");

const ASSET = "0x4aDA9428ae1D621B2C4059e0d800737B036bc44A";
const LSP4_METADATA_KEY =
  "0x9afb95cacc9f95858ec44aa8c3b685511002e30ae54415823f406128b85b238e";

const ERC725Y_ABI = ["function getData(bytes32 key) view returns (bytes)"];

function hexToBuf(hex) {
  const h = (hex || "").startsWith("0x") ? hex.slice(2) : hex;
  return Buffer.from(h, "hex");
}

async function main() {
  const c = new hre.ethers.Contract(ASSET, ERC725Y_ABI, hre.ethers.provider);

  const rawHex = await c.getData(LSP4_METADATA_KEY);
  console.log("Raw getData:", rawHex);

  const buf = hexToBuf(rawHex);
  console.log("Raw bytes length:", buf.length);

  if (buf.length === 0) {
    console.log("LSP4Metadata JSONURL: (EMPTY - key not set)");
    return;
  }
  if (buf.length < 36) {
    console.log("LSP4Metadata JSONURL: (INVALID - too short)");
    return;
  }

  const url = buf.slice(36).toString("utf8").replace(/\u0000+$/, "");
  console.log("LSP4Metadata JSONURL:", url);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
