# Deployment Record  
**Birra20Venti — First 10 Purchases 2026 (LSP7)**  
**Versions: V1 + V2 + V3 (canonical history)**

Canonical deployment record of the Birra20Venti *First 10 Purchases 2026* digital asset on the LUKSO blockchain.

This document covers:
- V1 deployment (initial / legacy)
- V2 deployment (UP-owned revision)
- V3 deployment (UP-owned + hard metadata freeze)
- Testnet history (development + verification)
- Mainnet deployment (production)
- metadata (LSP4 JSONURL) storage and updates
- Blockscout verification references

---

## Networks

### LUKSO Testnet (History / Development)
- **Chain:** LUKSO Testnet  
- **Chain ID:** 4201  
- **RPC:** https://rpc.testnet.lukso.network  
- **Explorer:** Blockscout (LUKSO Testnet)

### LUKSO Mainnet (Production)
- **Chain:** LUKSO Mainnet  
- **Chain ID:** 42  
- **RPC:** https://rpc.mainnet.lukso.network  
- **Explorer:** Blockscout (LUKSO Mainnet)

---

# V3 (Current / Recommended)

## Contract
- **Name:** `First10Purchases2026_V3`  
- **Standard:** LSP7 (non-divisible) + LSP4 metadata (ERC725Y JSONURL)  
- **Source:** `contracts/First10Purchases2026_V3.sol`  
- **MAX_SUPPLY:** 10  
- **UP-only ownership:** owner del contratto = Universal Profile (contract address)  
- **Initial mint:** 10 tokens minted to the UP in the constructor  
- **Hard metadata freeze:** blocks metadata updates both via `setLSP4Metadata(...)` and via direct `setData/setDataBatch` on `_LSP4_METADATA_KEY` once frozen

## Token model
- **Supply:** 10  
- **Decimals:** 0  
- **Minting:** Fixed (constructor only)  
- **Burn:** Disabled  
- **Inflation:** Impossible  

## Metadata key (V3)
Metadata is stored via **LSP4 JSONURL** under `_LSP4_METADATA_KEY`.

- **On-chain key (ERC725Y):**  
  `0x9afb95cacc9f95858ec44aa8c3b685511002e30ae54415823f406128b85b238e`

---

## V3 — Mainnet Deployment (Production / Canonical)

- **Contract:** `0xA3142be617B9B0cc0A6a41979557D3D8627De362`  
- **Deployed on:** 2026-01-15  
- **Owner (UP):** `0x4a2605796e0d91A9667d6E30365aEEC384C48c27` (ChainIntegrate UP)  
- **Deployer / signer (controller EOA):** `0x9C8Fd044A4C777f9f97c6cFC127C91f86b795C9c`  
- **Key Manager:** *(to be recorded)*

### Constructor (Mainnet V3)
- **Name:** Birra20Venti — Primi 10 Acquisti 2026  
- **Symbol:** B20V-10-2026  
- **UP (owner + initial holder):** `0x4a2605796e0d91A9667d6E30365aEEC384C48c27`  
- **Metadata (LSP4 JSONURL):** set at deploy time (final CID)

Initial supply of **10 tokens** minted in the constructor to the UP.

### Metadata (Mainnet V3)
- **Metadata JSON CID (final):** `bafkreiaqqppgm2o2ljk76ek4gyxqsienglxdf7bindgwhp4wudhojktiae`  
- **Metadata JSONURL (canonical):**  
  `ipfs://bafkreiaqqppgm2o2ljk76ek4gyxqsienglxdf7bindgwhp4wudhojktiae`

### Image (CID referenced by metadata)
- **Image CID:** `bafybeic5isfqqe7evfbdvqksrnskn7ucv7oolaahkfnvlleqcvnbac5nsi`  
- **Image URL (canonical):**  
  `ipfs://bafybeic5isfqqe7evfbdvqksrnskn7ucv7oolaahkfnvlleqcvnbac5nsi`

### Metadata freeze status (Mainnet V3)

- `freezeMetadata()` **CALLED** ✅ (hard-freeze attivo)
- **Freeze tx hash:** `0x65949d91e87b769382e2033e3971e298a7bc8d355fd74422bbe46f5fb47a5af4`
- **Freeze block:** `6740720`

After freeze, `_LSP4_METADATA_KEY` is permanently immutable (hard-freeze).


### Verification (Mainnet V3)
- Contract source published and verified on Blockscout for:  
  `0xA3142be617B9B0cc0A6a41979557D3D8627De362` *(status: to be confirmed)*
- Contract verified automatically via Blockscout bytecode database
  (bytecode matches canonical First10Purchases2026_V3 build)


---

## V3 — Testnet Deployment (History)

- **Contract:** `0x74b6191F22bCe2D7b3e4BA504D2E7825A5978d32`  
- **Deployed on:** 2026-01-15  
- **Deployer (EOA signer):** `0x84B883180265948505BFe49F0b78e1dAaECa0156`  
- **Owner (UP):** `0x83cBE526D949A3AaaB4EF9a03E48dd862e81472C`  
- **Key Manager:** `0xEb3e9d0f64e5C349aece82A013cA5ce78BB66Ca3`

### Constructor (Testnet V3)
- **Name:** Birra20Venti — First 10 Purchases 2026  
- **Symbol:** B20V-10-2026  
- **UP (owner + initial holder):** `0x83cBE526D949A3AaaB4EF9a03E48dd862e81472C`  
- **Metadata JSONURL (transit placeholder):**  
  `ipfs://bafkreihdwdcefgh4dqkjv67uzcmw7ojee6xedzdetojuzjevtenxquvyku`

### Freeze status (Testnet V3)
- `freezeMetadata()` **NOT CALLED** (metadata still editable by the UP owner)

### Verification (Testnet V3)
- Contract source published and verified on Blockscout for:  
  `0x74b6191F22bCe2D7b3e4BA504D2E7825A5978d32`

---

# V2 (Previous canonical)

## Contract
- **Name:** `First10Purchases2026_V2`  
- **Standard:** LSP7 (non-divisible) + LSP4 metadata (ERC725Y JSONURL)  
- **Source:** `contracts/First10Purchases2026_V2.sol`  
- **MAX_SUPPLY:** 10  
- **UP-only ownership:** owner del contratto = Universal Profile (contract address)  
- **Initial mint:** 10 tokens minted to the UP in the constructor  
- **Note:** V2 does not hard-block direct writes to `_LSP4_METADATA_KEY` via ERC725Y `setData` if performed by the owner

## Deployment (Testnet)
- **Contract:** `0x4aDA9428ae1D621B2C4059e0d800737B036bc44A`  
- **Deployed on:** 2026-01-15  
- **Deployer (EOA signer):** `0x84B883180265948505BFe49F0b78e1dAaECa0156`  
- **Owner (UP):** `0x83cBE526D949A3AaaB4EF9a03E48dd862e81472C`  
- **Key Manager:** `0xEb3e9d0f64e5C349aece82A013cA5ce78BB66Ca3`

## Metadata (V2)
- **On-chain key (ERC725Y):**  
  `0x9afb95cacc9f95858ec44aa8c3b685511002e30ae54415823f406128b85b238e`

### Metadata JSON (CID)
- **Metadata JSON CID:** `bafkreidhcyl3cx3mguiqc5n6pksyldt2ai4o4zrp4u3pp77eo4mdpxckza`  
- **Metadata JSONURL (canonical):**  
  `ipfs://bafkreidhcyl3cx3mguiqc5n6pksyldt2ai4o4zrp4u3pp77eo4mdpxckza`  

### Image (CID referenced by metadata)
- **Image CID:** `bafkreidmpg26cn3ocdadm2zyeuqarrrc76dqbfa5wuexnlqbbwyvs62e4a`  
- **Image URL (canonical):**  
  `ipfs://bafkreidmpg26cn3ocdadm2zyeuqarrrc76dqbfa5wuexnlqbbwyvs62e4a`

### Metadata update transaction (V2)
- **Tx hash:** `0x380701953bbe1c3612c3e8669671a0aade33307cee5ae62098fb6b1f13a937ae`  
- **Block:** `6848968`  
- **Event:** `MetadataUpdated(by, jsonUrl)`  
  - `by` = `0x83cBE526D949A3AaaB4EF9a03E48dd862e81472C`  
  - `jsonUrl` = `ipfs://bafkreidhcyl3cx3mguiqc5n6pksyldt2ai4o4zrp4u3pp77eo4mdpxckza`

### Freeze status (V2)
- `freezeMetadata()` **NOT CALLED** (metadata still editable by the UP owner)

## Verification (V2)
- Contract source published and verified on Blockscout for:  
  `0x4aDA9428ae1D621B2C4059e0d800737B036bc44A`

---

# V1 (Legacy / Historical)

## Contract
- **Name:** `First10Purchases2026`  
- **Standard:** LSP7 (non-divisible) + LSP4 metadata  
- **Source:** `contracts/First10Purchases2026.sol`

## Deployment (Testnet)
- **Contract:** `0x8C9DDFe56C42b58F142b81A3cA36Aa2ea6438a12`  
- **Deployed on:** 2026-01-14  
- **Owner:** `0x84B883180265948505BFe49F0b78e1dAaECa0156`

## Constructor
- **Name:** Birra20Venti — First 10 Purchases 2026  
- **Symbol:** B20V-10-2026  
- **Owner:** `0x84B883180265948505BFe49F0b78e1dAaECa0156`  
- **Metadata:** `ipfs://<CID>/metadata.json`

Initial supply of **10 tokens** minted in the constructor.

## Token model
- **Supply:** 10  
- **Decimals:** 0  
- **Minting:** Fixed (constructor only)  
- **Burn:** Disabled  
- **Inflation:** Impossible  

---

## Summary / Rationale
- **V1** was deployed as an initial version owned directly by the deployer EOA.  
- **V2** introduced the UP-owned model (brand-grade custody and control).  
- **V3** is the recommended canonical deployment:
  - UP-owned custody and governance
  - metadata management via UP/KeyManager execution flow
  - hard-freeze protection to prevent metadata bypass via direct ERC725Y `setData/setDataBatch`

---

## Purpose
This token represents the **first ten Birra20Venti purchases of 2026** and acts as:
- Proof of purchase  
- Loyalty badge  
- Early supporter collectible  

Part of the **Birra20Venti on-chain loyalty and traceability system**.

Infrastruttura di emissione: **ChainIntegrate**.

# SupplierQualityLSP8 — Rev2 (Current / Canonical)

## Contract

- **Name:** `SupplierQualityLSP8_Rev2`
- **Standard:** LSP8 Identifiable Digital Asset
- **Source:** `contracts/SupplierQualityLSP8_Rev2.sol`
- **Network:** LUKSO Mainnet
- **Chain ID:** 42

## Deployment (Mainnet)

- **Contract:** `0x54492a659C8CbBf21c16Fb296f6AE72e6dC9F7fD`
- **Deployed on:** 2026-03-02
- **Owner (Universal Profile):** `0x4a2605796e0d91A9667d6E30365aEEC384C48c27`
- **QualityOffice:** `0x2f2665D30DF1be87848cACb3185FCDe5D76F8ff7`
- **Deployer / Fee Payer:** `0x9C8Fd044A4C777f9f97c6cFC127C91f86b795C9c`

---

## Scoring Model (Rev2)

Weights (per mille — sum = 1000):

- **Punctuality:** 400 (40%)
- **Quality:** 300 (30%)
- **Documentation:** 150 (15%)
- **Reactivity:** 150 (15%)

### Level → Points Mapping

| Level      | Points |
|------------|--------|
| Unknown    | 0      |
| Critical   | 250    |
| Sufficient | 500    |
| Good       | 750    |
| Excellent  | 1000   |

### Overall Formula
overall = (p × 400 + q × 300 + d × 150 + r × 150) / 1000

Scale: 0–1000


# SupplierQualityLSP8 — Rev1 (Historical Version)

## Contract

- **Name:** `SupplierQualityLSP8`
- **Standard:** LSP8 Identifiable Digital Asset
- **Source:** `contracts/SupplierQualityLSP8.sol`
- **Network:** LUKSO Mainnet

## Deployment (Mainnet)

- **Contract:** *(insert Rev1 address if retained)*
- **Owner:** `0x4a2605796e0d91A9667d6E30365aEEC384C48c27`
- **QualityOffice:** `0x2f2665D30DF1be87848cACb3185FCDe5D76F8ff7`
- **Deployer / Fee Payer:** `0x9C8Fd044A4C777f9f97c6cFC127C91f86b795C9c`

---

## Scoring Model (Rev1)

Weights (per mille — sum = 1000):

- **Punctuality:** 300 (30%)
- **Quality:** 400 (40%)
- **Documentation:** 200 (20%)
- **Reactivity:** 100 (10%)

### Overall Formula
overall = (p * 400 + q * 300 + d * 150 + r * 150) / 1000


Scale: 0–1000
