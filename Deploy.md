# Deployment Record  
**Birra20Venti — First 10 Purchases 2026 (LSP7)**  
**Versions: V1 + V2 (canonical history)**

Canonical deployment record of the Birra20Venti *First 10 Purchases 2026* digital asset on the LUKSO blockchain (Testnet).

This document covers:
- V1 deployment (initial)
- V2 deployment (UP-owned revision)
- metadata (LSP4 JSONURL) storage and updates
- Blockscout verification references

---

## Network

- **Chain:** LUKSO Testnet  
- **Chain ID:** 4201  
- **RPC:** https://rpc.testnet.lukso.network  
- **Explorer:** Blockscout (LUKSO Testnet)

---

# V2 (Current / Recommended)

## Contract

- **Name:** `First10Purchases2026_V2`  
- **Standard:** LSP7 (non-divisible) + LSP4 metadata (ERC725Y JSONURL)  
- **Source:** `contracts/First10Purchases2026_V2.sol`  
- **MAX_SUPPLY:** 10  
- **UP-only ownership:** owner del contratto = Universal Profile (contract address)  
- **Initial mint:** 10 tokens minted to the UP in the constructor

## Deployment

- **Contract:** `0x4aDA9428ae1D621B2C4059e0d800737B036bc44A`  
- **Deployed on:** 2026-01-15  
- **Deployer (EOA signer):** `0x84B883180265948505BFe49F0b78e1dAaECa0156`  
- **Owner (UP):** `0x83cBE526D949A3AaaB4EF9a03E48dd862e81472C`  
- **Key Manager:** `0xEb3e9d0f64e5C349aece82A013cA5ce78BB66Ca3`

## Constructor

- **Name:** Birra20Venti — First 10 Purchases 2026  
- **Symbol:** B20V-10-2026  
- **UP (owner + initial holder):** `0x83cBE526D949A3AaaB4EF9a03E48dd862e81472C`  
- **Metadata (LSP4 JSONURL):** set at deploy time, then updated on-chain (see Metadata section)

Initial supply of **10 tokens** minted in the constructor.

## Token model

- **Supply:** 10  
- **Decimals:** 0  
- **Minting:** Fixed (constructor only)  
- **Burn:** Disabled  
- **Inflation:** Impossible  

## Metadata (V2)

Metadata is stored via **LSP4 JSONURL** under `_LSP4_METADATA_KEY`.

- **On-chain key (ERC725Y):**  
  `0x9afb95cacc9f95858ec44aa8c3b685511002e30ae54415823f406128b85b238e`

### Metadata JSON (CID)

- **Metadata JSON CID:** `bafkreidhcyl3cx3mguiqc5n6pksyldt2ai4o4zrp4u3pp77eo4mdpxckza`  
- **Metadata JSONURL (canonical):**  
  `ipfs://bafkreidhcyl3cx3mguiqc5n6pksyldt2ai4o4zrp4u3pp77eo4mdpxckza`  
- **Gateway (Pinata):**  
  `https://moccasin-solid-starfish-627.mypinata.cloud/ipfs/bafkreidhcyl3cx3mguiqc5n6pksyldt2ai4o4zrp4u3pp77eo4mdpxckza`

### Image (CID referenced by metadata)

- **Image CID:** `bafkreidmpg26cn3ocdadm2zyeuqarrrc76dqbfa5wuexnlqbbwyvs62e4a`  
- **Image URL (canonical):**  
  `ipfs://bafkreidmpg26cn3ocdadm2zyeuqarrrc76dqbfa5wuexnlqbbwyvs62e4a`  
- **Gateway (Pinata):**  
  `https://moccasin-solid-starfish-627.mypinata.cloud/ipfs/bafkreidmpg26cn3ocdadm2zyeuqarrrc76dqbfa5wuexnlqbbwyvs62e4a`

### Metadata update transaction (V2)

Metadata updated on-chain via `setLSP4Metadata(...)` executed by the UP through its Key Manager:

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

## Deployment

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

## Metadata (V1)

Metadata is stored via **LSP4 JSONURL** under `_LSP4_METADATA_KEY`.  
It can be updated by the owner until `freezeMetadata()` is called.  
After freezing, it becomes permanently immutable.

---

## Summary / Rationale

- **V1** was deployed as an initial version owned directly by the deployer EOA.  
- **V2** is the revised, UP-owned version:
  - contract ownership and initial custody are assigned to the Universal Profile
  - metadata management is performed via UP (Key Manager execution flow)
  - intended as the canonical “brand-grade” deployment going forward


---

## Purpose

This token represents the **first ten Birra20Venti purchases of 2026** and acts as:

- Proof of purchase  
- Loyalty badge  
- Early supporter collectible  

Part of the **Birra20Venti on-chain loyalty and traceability system**.

