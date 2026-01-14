// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LSP7DigitalAsset } from "@lukso/lsp7-contracts/contracts/LSP7DigitalAsset.sol";
import {
  _LSP4_METADATA_KEY,
  _LSP4_TOKEN_TYPE_TOKEN
} from "@lukso/lsp4-contracts/contracts/LSP4Constants.sol";

/**
 * Birra20Venti — First 10 Purchases 2026 (LSP7 fungible, non-divisible)
 * - totalSupply max: 10 (emessi una sola volta nel constructor)
 * - decimals() = 0 (non-divisible)
 * - owner del contratto = creatore (EOA deployer)
 * - metadata LSP4: JSONURL su ERC725Y (ipfs://.../metadata.json)
 * - freeze metadata: blocca aggiornamenti JSONURL per sempre
 * - trasferimenti compatibili:
 *    - to EOA  => force MUST be true
 *    - to contract (UP incluso) => force MUST be false
 */
contract First10Purchases2026 is LSP7DigitalAsset {
  uint256 public constant MAX_SUPPLY = 10;

  bool public metadataFrozen;

  event MetadataUpdated(address indexed by, string jsonUrl);
  event MetadataFrozen(address indexed by);

  error MetadataIsFrozen();
  error StrictForceRuleViolation(address to, bool force);

  constructor(
    string memory name_,
    string memory symbol_,
    address ownerEOA_,            // owner = creatore (EOA)
    string memory lsp4MetadataJsonUrl_
  )
    // (name, symbol, newOwner, lsp4TokenType, isNonDivisible)
    LSP7DigitalAsset(name_, symbol_, ownerEOA_, _LSP4_TOKEN_TYPE_TOKEN, true)
  {
    _setLSP4Metadata(lsp4MetadataJsonUrl_);

    // Emissione unica: 10 token all'owner (creatore).
    // force = true perché l'owner qui è un EOA.
    _mint(owner(), MAX_SUPPLY, true, "");
  }

  // -----------------------
  // LSP4 Metadata (JSONURL) + freeze
  // -----------------------

  function setLSP4Metadata(string calldata jsonUrl) external onlyOwner {
    _setLSP4Metadata(jsonUrl);
    emit MetadataUpdated(msg.sender, jsonUrl);
  }

  function freezeMetadata() external onlyOwner {
    metadataFrozen = true;
    emit MetadataFrozen(msg.sender);
  }

  function _setLSP4Metadata(string memory jsonUrl) internal {
    if (metadataFrozen) revert MetadataIsFrozen();

    // JSONURL (LSP2-style): bytes4(0) + bytes32(hash) + bytes(url)
    // hash = 0x0 perché CID IPFS già incorpora integrità.
    bytes memory encoded = abi.encodePacked(bytes4(0), bytes32(0), bytes(jsonUrl));
    _setData(_LSP4_METADATA_KEY, encoded);
  }

  // -----------------------
  // STRICT rule compatibile con EOA/UP
  // -----------------------

  function transfer(
    address from,
    address to,
    uint256 amount,
    bool force,
    bytes memory data
  ) public virtual override {
    bool isContract = to.code.length > 0;

    // contract (UP) => force=false
    if (isContract) {
      if (force) revert StrictForceRuleViolation(to, force);
    }
    // EOA => force=true
    else {
      if (!force) revert StrictForceRuleViolation(to, force);
    }

    super.transfer(from, to, amount, force, data);
  }

  function transferBatch(
    address[] memory from,
    address[] memory to,
    uint256[] memory amount,
    bool[] memory force,
    bytes[] memory data
  ) public virtual override {
    for (uint256 i = 0; i < to.length; i++) {
      bool isContract = to[i].code.length > 0;

      if (isContract) {
        if (force[i]) revert StrictForceRuleViolation(to[i], force[i]);
      } else {
        if (!force[i]) revert StrictForceRuleViolation(to[i], force[i]);
      }
    }

    super.transferBatch(from, to, amount, force, data);
  }

  /**
   * Helper: trasferisce calcolando force automaticamente:
   * - EOA => force=true
   * - Contract/UP => force=false
   *
   * Chi chiama deve essere il token-holder (msg.sender) o un operator autorizzato.
   */
  function strictTransfer(address to, uint256 amount, bytes memory data) external {
    bool isContract = to.code.length > 0;
    bool force = !isContract; // EOA => true, Contract => false
    transfer(msg.sender, to, amount, force, data);
  }
}
