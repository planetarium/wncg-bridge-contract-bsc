// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;
pragma abicoder v2;

import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { IERC20Upgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import { SafeERC20Upgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

/**
 * @title BridgeBSC
 * @author Planetarium
 * @notice Contract to send token to the LibPlanet( NCG )
 */
contract BridgeBSC is Initializable {
  using SafeERC20Upgradeable for IERC20Upgradeable;

  IERC20Upgradeable public TRANSFER_TOKEN;

  uint private totalSupply;

  address public OPERATOR;

  /// @dev Balances for each accounts
  mapping(address => uint256) private balances;

  /* ========== EVENTS ========== */
  event OperatorChanged(address indexed _from, address indexed _to);
  event SendToLibPlanet(address indexed _user, uint256 _amount, bytes32 _to);
  event TransferAssetByOperator(address indexed _to, uint256 _amount);

  /* ========== INITIALIZE ========== */
  function initialize(
    IERC20Upgradeable _transferToken,
    address _operator
  ) external initializer {
    TRANSFER_TOKEN = _transferToken;
    OPERATOR = _operator;
  }

  modifier onlyOperator {
    require(msg.sender == OPERATOR, 'ONLY_OPERATOR');
    _;
  }

  /**
   * @dev Change Operator
   * @param to new opertor address
   */ 
  function changeOperator(
    address to
  ) external onlyOperator {
    OPERATOR = to;
    emit OperatorChanged(msg.sender, to);
  }

  /**
   * @dev send to LibPlanet
   * @param amount Amount to send
   * @param to Libplanet(9c) address
   */
  function sendToLibPlanet(uint256 amount, bytes32 to) external {
    require(amount != 0, 'INVALID_ZERO_AMOUNT');
    require(amount % 1e16 == 0, 'INVALID_AMOUNT');

    totalSupply += amount;
    balances[msg.sender] += amount;

    // transfer transfer_token to this contract
    IERC20Upgradeable(TRANSFER_TOKEN).safeTransferFrom(msg.sender, address(this), amount);
    emit SendToLibPlanet(msg.sender, amount, to);
  }

  /**
   * @dev send balance to other address by operator
   * @param amount Amount to send
   * @param to address to send
   */
  function transferAssetByOperator(uint256 amount, address to) external onlyOperator {
    require(to != address(0), "INVALID_ADDRESS");
    require(amount > 0, "INVALID_AMOUNT");
    require(amount <= totalSupply, "INSUFFICIENT_BALANCE");

    totalSupply -= amount;
    TRANSFER_TOKEN.safeTransfer(to, amount);
    emit TransferAssetByOperator(to, amount);
  }

  /**
 * @dev Return total amount for this contact
   */
  function totalTransferAmount() external view returns (uint256) {
    return totalSupply;
  }

  /**
 * @dev Return user's transferred amount
   */
  function transferredTokenBalance(address _user) external view returns (uint256) {
    return balances[_user];
  }
}
