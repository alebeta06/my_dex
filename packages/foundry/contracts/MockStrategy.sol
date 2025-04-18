// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IStrategy.sol";
import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";

/// @dev Estrategia mock que simplemente guarda y devuelve el token
contract MockStrategy is IStrategy {
    using SafeERC20 for IERC20;

    IERC20 public immutable want;

    constructor(IERC20 _want) {
        want = _want;
    }

    /// @notice Toma `_amount` de tokens del vault (msg.sender) al strategy
    function deposit(uint256 _amount) external override {
        want.safeTransferFrom(msg.sender, address(this), _amount);
    }

    /// @notice Devuelve `_amount` de tokens al vault (msg.sender)
    function withdraw(uint256 _amount) external override {
        want.safeTransfer(msg.sender, _amount);
    }

    /// @notice No hace nada (sin yield real)
    function harvest() external override {
        // noop
    }
}
