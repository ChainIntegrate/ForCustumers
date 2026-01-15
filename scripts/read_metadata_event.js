const hre = require("hardhat");

const ASSET = "0x4aDA9428ae1D621B2C4059e0d800737B036bc44A";
const TX = "0x380701953bbe1c3612c3e8669671a0aade33307cee5ae62098fb6b1f13a937ae";

const ABI = [
  "event MetadataUpdated(address indexed by, string jsonUrl)"
];

async function main() {
  const receipt = await hre.ethers.provider.getTransactionReceipt(TX);
  const iface = new hre.ethers.Interface(ABI);

  for (const log of receipt.logs) {
    try {
      const parsed = iface.parseLog(log);
      if (parsed && parsed.name === "MetadataUpdated") {
        console.log("MetadataUpdated.by:", parsed.args.by);
        console.log("MetadataUpdated.jsonUrl:", parsed.args.jsonUrl);
      }
    } catch (_) {}
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
