// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import { DeployVault } from "./DeployVault.s.sol";

contract DeployScript is ScaffoldETHDeploy {
    function run() external {

        DeployVault deployVault = new DeployVault();
        deployVault.run();
    }
}
