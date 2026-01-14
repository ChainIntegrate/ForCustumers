# Deployment Record  
Birra20Venti — First 10 Purchases 2026 (LSP7)

This document records the canonical deployment of the Birra20Venti “First 10 Purchases 2026” digital asset on the LUKSO blockchain.

It provides full reproducibility for:
- contract bytecode
- constructor arguments
- metadata handling
- Blockscout verification

------------------------------------------------------------

1. Smart Contract

File:
contracts/First10Purchases2026.sol

Contract name:
First10Purchases2026

Standard:
- LSP7 Digital Asset (non-divisible)
- LSP4 Metadata (ERC725Y JSONURL)

------------------------------------------------------------

2. Network

Network: LUKSO Testnet  
Chain ID: 4201  
RPC: https://rpc.testnet.lukso.network  
Explorer: Blockscout (LUKSO)

------------------------------------------------------------

3. Deployment

Deployed contract address:
0x8C9DDFe56C42b58F142b81A3cA36Aa2ea6438a12

Deployment date:
2026-01-14

Deployer / Contract owner (EOA):
0x84B883180265948505BFe49F0b78e1dAaECa0156

------------------------------------------------------------

4. Constructor arguments

name:
Birra20Venti — First 10 Purchases 2026

symbol:
B20V-10-2026

owner:
0x84B883180265948505BFe49F0b78e1dAaECa0156

metadataUrl:
ipfs://<CID>/metadata.json

The initial mint of 10 units was executed inside the constructor.

------------------------------------------------------------

5. Token economics

Total supply: 10  
Decimals: 0 (non-divisible)  
Minting: One-time (constructor only)  
Burn: Disabled  
Inflation: Impossible  

All tokens were initially assigned to the deployer and are distributed manually to customers.

------------------------------------------------------------

6. Metadata model

Metadata is stored on-chain via LSP4 JSONURL under ERC725Y key _LSP4_METADATA_KEY.

Encoding format:
bytes4(0x00000000) + bytes32(0x00…) + bytes(metadataUrl)

The metadata can be updated by the contract owner until freezeMetadata() is called.  
Once frozen, the metadata becomes permanently immutable.

------------------------------------------------------------

7. Transfer rules

The contract enforces strict compatibility rules:

- EOA wallets → force = true  
- Contracts and Universal Profiles → force = false and must support LSP1  

This prevents accidental loss of tokens and guarantees safe Universal Profile delivery.

A helper function strictTransfer() is provided for user-facing transfers.

------------------------------------------------------------

8. Source code verification (Blockscout)

The contract is verified on Blockscout using Solidity Standard JSON Input.

Build info file:
artifacts/build-info/0b0f04c8cc95f02c3c722f3ea175b0f6.json

Standard JSON Input generated with:
jq '.input' artifacts/build-info/0b0f04c8cc95f02c3c722f3ea175b0f6.json > standard-json-input.json

Contract name for verification:
contracts/First10Purchases2026.sol:First10Purchases2026

------------------------------------------------------------

9. Cryptographic integrity

The on-chain bytecode matches the compiled output of this repository.  
Constructor arguments match the deployment parameters.  
The metadata URL is stored under _LSP4_METADATA_KEY.  
Once frozen, metadata becomes permanently immutable.

This establishes a cryptographically verifiable digital asset tied to a real-world commercial event.

------------------------------------------------------------

10. Business context

This contract represents the first ten purchases of Birra20Venti in 2026 as a verifiable digital asset.

Each token acts as:
- proof of purchase  
- loyalty badge  
- early supporter recognition  
- transferable digital collectible  

It is part of the Birra20Venti blockchain-based loyalty and traceability system built by ChainIntegrate.
