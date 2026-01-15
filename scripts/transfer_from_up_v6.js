// scripts/transfer_from_up_v6.js
require("dotenv").config();
const { ethers } = require("ethers");

// ======================
// CONFIG (senza cambiare .env)
// ======================
const RPC_URL = process.env.RPC_URL || process.env.LUKSO_TESTNET_RPC;

let PRIVATE_KEY = String(process.env.PRIVATE_KEY || "").trim();
if (PRIVATE_KEY && !PRIVATE_KEY.startsWith("0x")) PRIVATE_KEY = "0x" + PRIVATE_KEY;

// UP che possiede i token
const UP_ADDRESS = "0x83cBE526D949A3AaaB4EF9a03E48dd862e81472C";
const KEYMANAGER_ADDRESS = "0xEb3e9d0f64e5C349aece82A013cA5ce78BB66Ca3";

// LSP7 V3
const TOKEN_ADDRESS = "0x74b6191F22bCe2D7b3e4BA504D2E7825A5978d32";

// destinatario (metti qui EOA o UP)
const TO_ADDRESS = "0x6C5d0fa04aE90371e809114E9C3932ea7a3715C9";

// LSP7 non-divisible => 1 token
const AMOUNT = 1n;

// data opzionale
const DATA = "0x";

// ======================
// ABIs minimi
// ======================
const UP_ABI = [
  "function execute(uint256 operationType, address to, uint256 value, bytes data) public payable returns (bytes)",
];

const KEYMANAGER_ABI = [
  "function execute(bytes payload) public payable returns (bytes)",
];

const TOKEN_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function strictTransfer(address to, uint256 amount, bytes data) external",
];

async function main() {
  if (!RPC_URL) throw new Error("RPC mancante: usa LUKSO_TESTNET_RPC nel .env (o RPC_URL).");
  if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY mancante in .env");

  if (!ethers.isAddress(TOKEN_ADDRESS)) throw new Error("TOKEN_ADDRESS non valido");
  if (!ethers.isAddress(TO_ADDRESS)) throw new Error("TO_ADDRESS non valido");
  if (!ethers.isAddress(UP_ADDRESS)) throw new Error("UP_ADDRESS non valido");
  if (!ethers.isAddress(KEYMANAGER_ADDRESS)) throw new Error("KEYMANAGER_ADDRESS non valido");

  const provider = new ethers.JsonRpcProvider(RPC_URL);

  // check rete
  const net = await provider.getNetwork();
  console.log("ChainId:", Number(net.chainId));
  if (Number(net.chainId) !== 4201) {
    console.warn("ATTENZIONE: chainId diverso da 4201. Controlla RPC:", RPC_URL);
  }

  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log("Controller EOA:", wallet.address);
  console.log("UP owner tokens:", UP_ADDRESS);
  console.log("KeyManager:", KEYMANAGER_ADDRESS);
  console.log("Token:", TOKEN_ADDRESS);
  console.log("To:", TO_ADDRESS);

  const tokenRead = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, provider);
  const km = new ethers.Contract(KEYMANAGER_ADDRESS, KEYMANAGER_ABI, wallet);

  // 1) check balance UP
  const bal = await tokenRead.balanceOf(UP_ADDRESS);
  console.log("Balance UP:", bal.toString());
  if (bal < AMOUNT) throw new Error("UP non ha abbastanza token per trasferire l’importo richiesto");

  // 2) Encode call: token.strictTransfer(to, amount, data)
  const tokenIface = new ethers.Interface(TOKEN_ABI);
  const callTokenStrictTransfer = tokenIface.encodeFunctionData("strictTransfer", [
    TO_ADDRESS,
    AMOUNT,
    DATA,
  ]);

  // 3) Encode call: UP.execute(CALL=0, token, 0, callTokenStrictTransfer)
  const OP_CALL = 0;
  const upIface = new ethers.Interface(UP_ABI);
  const callUpExecute = upIface.encodeFunctionData("execute", [
    OP_CALL,
    TOKEN_ADDRESS,
    0,
    callTokenStrictTransfer,
  ]);

  // 4) dry-run staticCall sul KeyManager (ethers v6)
  console.log("Dry-run staticCall su KeyManager...");
  try {
    await km.getFunction("execute").staticCall(callUpExecute);
    console.log("Dry-run OK.");
  } catch (e) {
    console.error("Dry-run REVERT (permessi o regole):");
    console.error(e?.shortMessage || e?.reason || e?.message || e);
    throw e;
  }

  // 5) send tx: KeyManager.execute(payload)
  console.log("Invio transazione...");
  const tx = await km.getFunction("execute")(callUpExecute, { gasLimit: 1_500_000 });
  console.log("Tx hash:", tx.hash);

  const receipt = await tx.wait();
  console.log("Confermata in block:", receipt.blockNumber);

  // 6) re-check balances
  const balAfter = await tokenRead.balanceOf(UP_ADDRESS);
  const toAfter = await tokenRead.balanceOf(TO_ADDRESS);

  console.log("Balance UP after:", balAfter.toString());
  console.log("Balance To after:", toAfter.toString());
}

main().catch((e) => {
  console.error("ERRORE:", e?.shortMessage || e?.reason || e?.message || e);
  process.exit(1);
});
