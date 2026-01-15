// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LSP7DigitalAsset } from "@lukso/lsp7-contracts/contracts/LSP7DigitalAsset.sol";
import {
  _LSP4_METADATA_KEY,
  _LSP4_TOKEN_TYPE_TOKEN
} from "@lukso/lsp4-contracts/contracts/LSP4Constants.sol";

/**
 * UP-only:
 * - owner del contratto = UP (contract address)
 * - mint iniziale = UP (contract address)
 * - solo l'UP può fare set metadata / freeze (onlyOwner)
 */
contract First10Purchases2026_V2 is LSP7DigitalAsset {
  uint256 public constant MAX_SUPPLY = 10;

  bool public metadataFrozen;

  event MetadataUpdated(address indexed by, string jsonUrl);
  event MetadataFrozen(address indexed by);

  error MetadataIsFrozen();
  error InvalidUP(address up);
  error StrictForceRuleViolation(address to, bool force);

  constructor(
    string memory name_,
    string memory symbol_,
    address up_,                    // l'UP (0x...) — deve essere un contract
    string memory lsp4MetadataJsonUrl_
  )
    // newOwner = up_ (quindi owner del contratto è l'UP)
    LSP7DigitalAsset(name_, symbol_, up_, _LSP4_TOKEN_TYPE_TOKEN, true)
  {
    if (up_ == address(0)) revert InvalidUP(up_);
    if (up_.code.length == 0) revert InvalidUP(up_); // vogliamo SOLO UP (contract)

    _setLSP4Metadata(lsp4MetadataJsonUrl_);

    // UP è contract => force = false
    _mint(up_, MAX_SUPPLY, false, "");
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

    // JSONURL: bytes4(0) + bytes32(hash) + bytes(url)
    bytes memory encoded = abi.encodePacked(bytes4(0), bytes32(0), bytes(jsonUrl));
    _setData(_LSP4_METADATA_KEY, encoded);
  }

  // -----------------------
  // STRICT rule trasferimenti (opzionale, ma la mantengo come nel tuo)
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

  function strictTransfer(address to, uint256 amount, bytes memory data) external {
    bool isContract = to.code.length > 0;
    bool force = !isContract; // EOA => true, Contract => false
    transfer(msg.sender, to, amount, force, data);
  }
}
