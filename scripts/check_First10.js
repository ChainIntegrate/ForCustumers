const hre = require("hardhat");

async function main() {
  const ADDRESS = "0x8C9DDFe56C42b58F142b81A3cA36Aa2ea6438a12";

  const c = await hre.ethers.getContractAt("First10Purchases2026", ADDRESS);

  console.log("contract:", ADDRESS);
  console.log("owner():", await c.owner());
  console.log("totalSupply():", (await c.totalSupply()).toString());
  console.log("metadataFrozen:", await c.metadataFrozen());

  const [deployer] = await hre.ethers.getSigners();
  console.log("deployer:", deployer.address);
  console.log("deployer balance:", (await c.balanceOf(deployer.address)).toString());
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
