// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import { DeploySE2Token } from "./DeploySE2Token.s.sol";
import { DeployVault } from "./DeployVault.s.sol";

contract DeployScript is ScaffoldETHDeploy {
    function run() external {
        DeploySE2Token deploySE2Token = new DeploySE2Token();
        deploySE2Token.run();

        DeployVault deployVault = new DeployVault();
        deployVault.run();
    }
}
