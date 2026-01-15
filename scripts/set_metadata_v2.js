const hre = require("hardhat");
require("dotenv").config();

const ASSET = "0x4aDA9428ae1D621B2C4059e0d800737B036bc44A";
const UP = "0x83cBE526D949A3AaaB4EF9a03E48dd862e81472C";
const METADATA_URL = "ipfs://bafkreidhcyl3cx3mguiqc5n6pksyldt2ai4o4zrp4u3pp77eo4mdpxckza";

// ABI minimale per chiamare il tuo asset
const ASSET_ABI = [
  "function setLSP4Metadata(string jsonUrl) external"
];

// ABI minimale UP (ERC725Account)
const UP_ABI = [
  "function owner() view returns (address)",
  "function execute(uint256 operation, address to, uint256 value, bytes calldata data) external payable returns (bytes memory)"
];

// ABI minimale Key Manager (LSP6)
const KEY_MANAGER_ABI = [
  "function execute(bytes calldata payload) external payable returns (bytes memory)"
];

function isAddress(addr) {
  return /^0x[0-9a-fA-F]{40}$/.test(addr);
}

async function main() {
  const [signer] = await hre.ethers.getSigners();

  console.log("Signer (EOA):", signer.address);
  console.log("UP:", UP);
  console.log("Asset:", ASSET);
  console.log("Metadata URL:", METADATA_URL);

  // 1) Key Manager = owner() dell'UP
  const upRead = new hre.ethers.Contract(UP, UP_ABI, hre.ethers.provider);
  const keyManager = await upRead.owner();

  console.log("Key Manager:", keyManager);
  if (!isAddress(keyManager)) throw new Error(`Key Manager non valido: ${keyManager}`);

  // 2) Calldata per ASSET.setLSP4Metadata(url)
  const asset = new hre.ethers.Contract(ASSET, ASSET_ABI, hre.ethers.provider);
  const assetCallData = asset.interface.encodeFunctionData("setLSP4Metadata", [METADATA_URL]);

  // 3) WRAP: UP.execute(OP_CALL=0, to=ASSET, value=0, data=assetCallData)
  const OP_CALL = 0;
  const upIface = new hre.ethers.Interface(UP_ABI);
  const upExecutePayload = upIface.encodeFunctionData("execute", [OP_CALL, ASSET, 0, assetCallData]);

  // 4) Esegui via Key Manager (firmato dall’EOA controller)
  const km = new hre.ethers.Contract(keyManager, KEY_MANAGER_ABI, signer);

  console.log("Sending tx via Key Manager (UP.execute -> Asset.setLSP4Metadata) ...");

  try {
    const tx = await km.execute(upExecutePayload);
    console.log("Tx hash:", tx.hash);
    const receipt = await tx.wait();
    console.log("Confirmed in block:", receipt.blockNumber);
    console.log("OK: metadata updated (not frozen).");
  } catch (e) {
    console.error("FAILED");
    console.error("message:", e?.message);
    console.error("reason:", e?.reason);
    console.error("shortMessage:", e?.shortMessage);
    console.error("data:", e?.data);
    throw e;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
