// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

import { LSP8IdentifiableDigitalAsset } from
  "@lukso/lsp8-contracts/contracts/LSP8IdentifiableDigitalAsset.sol";
import { _LSP4_TOKEN_TYPE_NFT } from "@lukso/lsp4-contracts/contracts/LSP4Constants.sol";
import { _LSP8_TOKENID_FORMAT_HASH } from "@lukso/lsp8-contracts/contracts/LSP8Constants.sol";

/**
 * Supplier Evaluation LSP8 — Rev1
 * Weights: 30 / 40 / 20 / 10
 */
contract SupplierQualityLSP8_Rev1 is LSP8IdentifiableDigitalAsset {

  uint16 public constant MAX_NOTE_BYTES = 150;

  // Rev1 weights
  uint16 public constant W_PUNCTUALITY   = 300; // 30%
  uint16 public constant W_QUALITY       = 400; // 40%
  uint16 public constant W_DOCUMENTATION = 200; // 20%
  uint16 public constant W_REACTIVITY    = 100; // 10%

  address public qualityOffice;

  modifier onlyQualityOffice() {
    require(msg.sender == qualityOffice, "Not Quality Office");
    _;
  }

  enum Level {
    Unknown,
    Critical,
    Sufficient,
    Good,
    Excellent
  }

  struct Scores {
    Level punctuality;
    Level quality;
    Level documentation;
    Level reactivity;
  }

  struct Evaluation {
    uint32 period;
    uint64 createdAt;
    Scores scores;
    uint16 overall;
    string note;
  }

  struct SupplierIdentity {
    bytes32 supplierRef;
    string name;
    uint64 createdAt;
    bool exists;
  }

  struct SupplierStats {
    uint16 currentOverall;
    uint64 sumOverall;
    uint32 count;
    uint32 lastPeriod;
  }

  mapping(bytes32 => SupplierIdentity) private _supplier;
  mapping(bytes32 => SupplierStats) private _stats;
  mapping(bytes32 => Evaluation[]) private _evaluations;
  mapping(bytes32 => mapping(uint32 => uint256)) private _periodIndexPlusOne;

  event QualityOfficeSet(address indexed newQualityOffice);
  event SupplierMinted(bytes32 indexed tokenId, address indexed supplierWallet, bytes32 supplierRef, string name);
  event EvaluationAdded(bytes32 indexed tokenId, uint32 period, uint16 overall, Level punctuality, Level quality, Level documentation, Level reactivity, string note);

  constructor(
    string memory name_,
    string memory symbol_,
    address chainIntegrateOwner_,
    address qualityOffice_
  )
    LSP8IdentifiableDigitalAsset(
      name_,
      symbol_,
      chainIntegrateOwner_,
      _LSP4_TOKEN_TYPE_NFT,
      _LSP8_TOKENID_FORMAT_HASH
    )
  {
    require(chainIntegrateOwner_ != address(0), "Owner=0");
    require(qualityOffice_ != address(0), "QualityOffice=0");
    qualityOffice = qualityOffice_;
    emit QualityOfficeSet(qualityOffice_);
  }

  function setQualityOffice(address newQualityOffice) external onlyOwner {
    require(newQualityOffice != address(0), "QualityOffice=0");
    qualityOffice = newQualityOffice;
    emit QualityOfficeSet(newQualityOffice);
  }

  function _levelToPoints(Level v) internal pure returns (uint16) {
    if (v == Level.Unknown) return 0;
    if (v == Level.Critical) return 250;
    if (v == Level.Sufficient) return 500;
    if (v == Level.Good) return 750;
    return 1000;
  }

  function _calcOverall(Scores calldata s) internal pure returns (uint16) {
    uint256 p = _levelToPoints(s.punctuality);
    uint256 q = _levelToPoints(s.quality);
    uint256 d = _levelToPoints(s.documentation);
    uint256 r = _levelToPoints(s.reactivity);

    uint256 overall =
      (p * W_PUNCTUALITY +
       q * W_QUALITY +
       d * W_DOCUMENTATION +
       r * W_REACTIVITY) / 1000;

    return uint16(overall);
  }
}