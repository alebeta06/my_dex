// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

/// @title Strategy interface for DAG‑Yield
interface IStrategy {
    /// @notice Token that this strategy accepts (e.g. USDC, WETH…)
    function want() external view returns (IERC20);

    /// @notice Deposit `_amount` of want into the strategy
    function deposit(uint256 _amount) external;

    /// @notice Withdraw `_amount` of want from the strategy back to the vault
    function withdraw(uint256 _amount) external;

    /// @notice Harvest any yield/rewards and reinvest into the strategy
    function harvest() external;
}
