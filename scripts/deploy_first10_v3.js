// scripts/deploy_first10_v3.js
const hre = require("hardhat");
require("dotenv").config();

async function main() {
  // =========================
  // PARAMETRI ASSET
  // =========================
  const NAME = "Birra20Venti — First 10 Purchases 2026";
  const SYMBOL = "B20V-10-2026";

  // IPFS di transito (placeholder)
  const METADATA_URL = "ipfs://bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku";

  // Owner = Universal Profile (UP) (riceve i 10 token)
  const UP_OWNER = "0x83cBE526D949A3AaaB4EF9a03E48dd862e81472C";

  // =========================
  // PRECHECK
  // =========================
  const [deployer] = await hre.ethers.getSigners();

  console.log("Network:", hre.network.name);
  console.log("Deployer (tx signer):", deployer.address);
  console.log("UP owner:", UP_OWNER);

  const net = await hre.ethers.provider.getNetwork();
  const chainId = Number(net.chainId);
  console.log("Chain ID:", chainId);

  if (chainId !== 4201) {
    throw new Error(
      `ChainId non atteso: ${chainId}. Atteso 4201 (LUKSO Testnet). Interrotto.`
    );
  }

  // Verifica che UP_OWNER sia un contratto (UP vero)
  const code = await hre.ethers.provider.getCode(UP_OWNER);
  if (!code || code === "0x") {
    throw new Error("UP_OWNER non è un contratto (code=0x). Hai incollato un EOA, non un UP.");
  }

  // (opzionale) check saldo deployer
  const bal = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance (LYXt):", hre.ethers.formatEther(bal));

  // =========================
  // DEPLOY
  // =========================
  const Factory = await hre.ethers.getContractFactory("First10Purchases2026_V3");

  console.log("Deploying First10Purchases2026_V3...");
  const contract = await Factory.deploy(NAME, SYMBOL, UP_OWNER, METADATA_URL);

  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log("Deployed to:", address);

  const tx = contract.deploymentTransaction?.();
  if (tx?.hash) console.log("Deploy tx hash:", tx.hash);

  // sanity check: balance UP dovrebbe essere 10
  try {
    const b = await contract.balanceOf(UP_OWNER);
    console.log("balanceOf(UP_OWNER):", b.toString());
  } catch (e) {
    console.log("balanceOf check skipped:", e?.message || String(e));
  }

  // flag freeze (dovrebbe essere false)
  try {
    const frozen = await contract.metadataFrozen();
    console.log("metadataFrozen:", frozen);
  } catch (e) {
    console.log("metadataFrozen check skipped:", e?.message || String(e));
  }
}

main().catch((error) => {
  console.error("DEPLOY ERROR:", error?.message || error);
  process.exitCode = 1;
});
