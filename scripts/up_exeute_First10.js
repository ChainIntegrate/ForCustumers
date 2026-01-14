const hre = require("hardhat");

// ABI minimale per Universal Profile (ERC725Account)
const UP_ABI = [
  "function execute(uint256 operationType, address to, uint256 value, bytes data) public payable returns (bytes)",
];

async function main() {
  const [signer] = await hre.ethers.getSigners();
  console.log("Signer (controller EOA):", signer.address);

  // Inserisci il tuo UP e il contratto deployato
  const UP_ADDRESS = "0x________________________________________";
  const ASSET_ADDRESS = "0x________________________________________";

  // Interfaccia al tuo LSP7
  const asset = await hre.ethers.getContractAt("First10Purchases2026", ASSET_ADDRESS);

  // Calcolo calldata per preMintAllToOwner()
  const data = asset.interface.encodeFunctionData("preMintAllToOwner", []);

  // Chiama UP.execute(OP_CALL=0, to=asset, value=0, data=calldata)
  const up = new hre.ethers.Contract(UP_ADDRESS, UP_ABI, signer);

  const OP_CALL = 0;
  const tx = await up.execute(OP_CALL, ASSET_ADDRESS, 0, data);
  console.log("TX sent:", tx.hash);

  const rc = await tx.wait();
  console.log("Confirmed. Status:", rc.status);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
