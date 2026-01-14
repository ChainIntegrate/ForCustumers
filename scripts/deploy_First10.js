const hre = require("hardhat");

async function main() {
  const NAME = "Birra20Venti — First 10 Purchases 2026";
  const SYMBOL = "B20V-10-2026";
  const METADATA_URL = "ipfs://__________________________________/metadata.json";

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer (owner):", deployer.address);

  const Factory = await hre.ethers.getContractFactory("First10Purchases2026");
  const contract = await Factory.deploy(NAME, SYMBOL, deployer.address, METADATA_URL);

  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log("Deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
