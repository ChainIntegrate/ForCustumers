// scripts/deploy_first10_v3_mainnet.js
const hre = require("hardhat");
require("dotenv").config();

async function main() {
  // =========================
  // PARAMETRI ASSET
  // =========================
  const NAME = "Birra20Venti — Primi 10 Acquisti 2026";
  const SYMBOL = "B20V-10-2026";

  // JSON definitivo (LSP4 metadata)
  const METADATA_URL =
    "ipfs://bafkreiaqqppgm2o2ljk76ek4gyxqsienglxdf7bindgwhp4wudhojktiae";

  // UP ChainIntegrate (MAINNET) - riceve i 10 token
  const UP_OWNER = "0x4a2605796e0d91A9667d6E30365aEEC384C48c27";

  // Controller EOA (extension desktop) - deve essere il signer usato per il deploy
  const EXPECTED_CONTROLLER = "0x9C8Fd044A4C777f9f97c6cFC127C91f86b795C9c";

  // =========================
  // PRECHECK
  // =========================
  const [deployer] = await hre.ethers.getSigners();

  console.log("Network:", hre.network.name);
  console.log("Deployer (tx signer):", deployer.address);
  console.log("Expected controller:", EXPECTED_CONTROLLER);
  console.log("UP owner:", UP_OWNER);
  console.log("Metadata URL:", METADATA_URL);

  // Chain id mainnet LUKSO = 42
  const net = await hre.ethers.provider.getNetwork();
  const chainId = Number(net.chainId);
  console.log("Chain ID:", chainId);

  if (chainId !== 42) {
    throw new Error(
      `ChainId non atteso: ${chainId}. Atteso 42 (LUKSO Mainnet). Interrotto.`
    );
  }

  // Guardrail: signer deve essere il controller atteso
  if (deployer.address.toLowerCase() !== EXPECTED_CONTROLLER.toLowerCase()) {
    throw new Error(
      `Signer diverso dal controller atteso.\n` +
        `Signer: ${deployer.address}\n` +
        `Atteso: ${EXPECTED_CONTROLLER}\n` +
        `Rischio deploy con account sbagliato. Interrotto.`
    );
  }

  // Verifica che UP_OWNER sia un contratto (UP vero)
  const code = await hre.ethers.provider.getCode(UP_OWNER);
  if (!code || code === "0x") {
    throw new Error(
      "UP_OWNER non è un contratto (code=0x). Hai incollato un EOA, non un UP."
    );
  }

  // Check saldo controller
  const bal = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Controller balance (LYX):", hre.ethers.formatEther(bal));

  // Soglia prudenziale
  if (bal < hre.ethers.parseEther("0.05")) {
    throw new Error("Saldo controller troppo basso per un deploy sicuro su mainnet.");
  }

  // =========================
  // DEPLOY
  // =========================
  const Factory = await hre.ethers.getContractFactory("First10Purchases2026_V3");

  console.log("Deploying First10Purchases2026_V3 on LUKSO Mainnet...");
  const contract = await Factory.deploy(NAME, SYMBOL, UP_OWNER, METADATA_URL);

  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log("Deployed to:", address);

  const tx = contract.deploymentTransaction?.();
  if (tx?.hash) console.log("Deploy tx hash:", tx.hash);

  // sanity check: balance UP dovrebbe essere 10
  const b = await contract.balanceOf(UP_OWNER);
  console.log("balanceOf(UP_OWNER):", b.toString());

  // freeze flag (dovrebbe essere false)
  const frozen = await contract.metadataFrozen();
  console.log("metadataFrozen:", frozen);

  console.log(
    "OK: deploy completato. Prossimo step: verifica su explorer + check metadata rendering. NON congelare ancora."
  );
}

main().catch((error) => {
  console.error("DEPLOY ERROR:", error?.message || error);
  process.exitCode = 1;
});
