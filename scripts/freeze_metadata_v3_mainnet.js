// scripts/freeze_metadata_v3_mainnet.js
const hre = require("hardhat");
require("dotenv").config();

const ASSET = "0xA3142be617B9B0cc0A6a41979557D3D8627De362"; // V3 MAINNET
const UP = "0x4a2605796e0d91A9667d6E30365aEEC384C48c27";     // UP ChainIntegrate MAINNET

// ABI minimale Asset V3
const ASSET_ABI = [
  "function freezeMetadata() external",
  "function metadataFrozen() view returns (bool)"
];

// ABI minimale UP (ERC725Account)
const UP_ABI = [
  "function owner() view returns (address)",
  "function execute(uint256 operation, address to, uint256 value, bytes data) external payable returns (bytes)"
];

// ABI minimale Key Manager (LSP6)
const KEY_MANAGER_ABI = [
  "function execute(bytes payload) external payable returns (bytes)"
];

function isAddress(addr) {
  return /^0x[0-9a-fA-F]{40}$/.test(addr);
}

async function main() {
  const [signer] = await hre.ethers.getSigners();

  console.log("Signer (EOA):", signer.address);
  console.log("UP:", UP);
  console.log("Asset (V3):", ASSET);

  // 0) safety: chainId
  const net = await hre.ethers.provider.getNetwork();
  const chainId = Number(net.chainId);
  console.log("Chain ID:", chainId);
  if (chainId !== 42) throw new Error(`ChainId non atteso: ${chainId}. Atteso 42 (LUKSO Mainnet).`);

  // 1) Key Manager = owner() dell'UP
  const upRead = new hre.ethers.Contract(UP, UP_ABI, hre.ethers.provider);
  const keyManager = await upRead.owner();

  console.log("Key Manager:", keyManager);
  if (!isAddress(keyManager)) throw new Error(`Key Manager non valido: ${keyManager}`);

  // 2) Stato freeze attuale
  const assetRead = new hre.ethers.Contract(ASSET, ASSET_ABI, hre.ethers.provider);
  const alreadyFrozen = await assetRead.metadataFrozen();
  console.log("metadataFrozen (before):", alreadyFrozen);
  if (alreadyFrozen) {
    console.log("Già freezato. Nessuna azione necessaria.");
    return;
  }

  // 3) Calldata per ASSET.freezeMetadata()
  const assetCallData = assetRead.interface.encodeFunctionData("freezeMetadata", []);

  // 4) WRAP: UP.execute(OP_CALL=0, to=ASSET, value=0, data=assetCallData)
  const OP_CALL = 0;
  const upIface = new hre.ethers.Interface(UP_ABI);
  const upExecutePayload = upIface.encodeFunctionData("execute", [OP_CALL, ASSET, 0, assetCallData]);

  // 5) Esegui via Key Manager
  const km = new hre.ethers.Contract(keyManager, KEY_MANAGER_ABI, signer);

  console.log("Dry-run staticCall (KeyManager.execute)...");
  await km.getFunction("execute").staticCall(upExecutePayload);
  console.log("Dry-run OK.");

  console.log("Sending tx via Key Manager (UP.execute -> Asset.freezeMetadata) ...");
  const tx = await km.getFunction("execute")(upExecutePayload, { gasLimit: 1_800_000 });
  console.log("Tx hash:", tx.hash);

  const receipt = await tx.wait();
  console.log("Confirmed in block:", receipt.blockNumber);

  const frozenAfter = await assetRead.metadataFrozen();
  console.log("metadataFrozen (after):", frozenAfter);

  console.log("OK: metadata frozen (V3 hard-freeze attivo).");
}

main().catch((e) => {
  console.error("FAILED");
  console.error("message:", e?.message);
  console.error("reason:", e?.reason);
  console.error("shortMessage:", e?.shortMessage);
  console.error("data:", e?.data);
  process.exit(1);
});
