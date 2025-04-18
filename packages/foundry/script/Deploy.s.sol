// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import { DeployVault } from "./DeployVault.s.sol";

/**
 * @notice Main deployment script for all contracts
 * @dev Run this when you want to deploy múltiples contratos de una vez
 */
contract DeployScript is ScaffoldETHDeploy {
    function run() external {
        DeployVault deployVault = new DeployVault();
        deployVault.run();
    }
}
