// scripts/deploy_supplier_quality_rev2.js
const hre = require("hardhat");

async function main() {
  const { ethers, network } = hre;

  // === Parametri token (puoi anche passarli via env) ===
  // Default "Rev2" così su Blockscout distingui subito le versioni
  const TOKEN_NAME = process.env.TOKEN_NAME || "Supplier Quality (Rev2)";
  const TOKEN_SYMBOL = process.env.TOKEN_SYMBOL || "SQ2";

  // === Indirizzi (fissi) ===
  const CHAININTEGRATE_OWNER = "0x4a2605796e0d91A9667d6E30365aEEC384C48c27";
  const QUALITY_OFFICE = "0x2f2665D30DF1be87848cACb3185FCDe5D76F8ff7";

  // payer che DEVE firmare e pagare fee
  const EXPECTED_PAYER = "0x9C8Fd044A4C777f9f97c6cFC127C91f86b795C9c";

  if (!ethers.isAddress(CHAININTEGRATE_OWNER)) throw new Error("Owner address non valido");
  if (!ethers.isAddress(QUALITY_OFFICE)) throw new Error("QualityOffice address non valido");
  if (!ethers.isAddress(EXPECTED_PAYER)) throw new Error("Expected payer address non valido");

  const [deployer] = await ethers.getSigners();

  // blocca se la key in .env non è quella attesa
  if (deployer.address.toLowerCase() !== EXPECTED_PAYER.toLowerCase()) {
    throw new Error(
      `Signer inatteso. Atteso payer=${EXPECTED_PAYER} ma è ${deployer.address}. Controlla PRIVATE_KEY/.env`
    );
  }

  const chainId = Number(network.config.chainId || 0);
  const bal = await ethers.provider.getBalance(deployer.address);

  console.log("======================================");
  console.log("Contract:", "SupplierQualityLSP8_Rev2");
  console.log("Network:", network.name, "| chainId:", chainId);
  console.log("Payer (signer):", deployer.address);
  console.log("Payer balance:", ethers.formatEther(bal), "LYX");
  console.log("Token:", `${TOKEN_NAME} (${TOKEN_SYMBOL})`);
  console.log("Owner (UP):", CHAININTEGRATE_OWNER);
  console.log("QualityOffice:", QUALITY_OFFICE);
  console.log("Weights:", "P=400 Q=300 D=150 R=150 (per-mille)");
  console.log("======================================");

  if (chainId !== 42) {
    console.warn("⚠️  ChainId non è 42 (LUKSO Mainnet). Controlla --network e/o env.");
  }

  if (deployer.address.toLowerCase() !== CHAININTEGRATE_OWNER.toLowerCase()) {
    console.log("ℹ️  OK: payer diverso da owner (scelta voluta).");
  }

  // Deploy Rev2
  const Factory = await ethers.getContractFactory("SupplierQualityLSP8_Rev2");
  const contract = await Factory.deploy(
    TOKEN_NAME,
    TOKEN_SYMBOL,
    CHAININTEGRATE_OWNER,
    QUALITY_OFFICE
  );

  const tx = contract.deploymentTransaction();
  if (tx) console.log("Deploy tx hash:", tx.hash);

  await contract.waitForDeployment();
  const addr = await contract.getAddress();

  console.log("✅ Deployed SupplierQualityLSP8_Rev2 at:", addr);

  // Post-check: leggo owner e qualityOffice dal contratto
  const onChainOwner = await contract.owner();
  const onChainQO = await contract.qualityOffice();

  console.log("owner()         =", onChainOwner);
  console.log("qualityOffice() =", onChainQO);

  if (onChainOwner.toLowerCase() !== CHAININTEGRATE_OWNER.toLowerCase()) {
    console.warn("⚠️ owner on-chain diverso da quello atteso!");
  }
  if (onChainQO.toLowerCase() !== QUALITY_OFFICE.toLowerCase()) {
    console.warn("⚠️ qualityOffice on-chain diverso da quello atteso!");
  }

  // (extra) leggi weights/version se vuoi ulteriore prova
  try {
    const w = await contract.weights();
    console.log("weights() =", w);
  } catch (_) {
    // ok se non hai aggiunto weights() nella Rev2
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error("❌ Deploy failed:", err);
  process.exitCode = 1;
});