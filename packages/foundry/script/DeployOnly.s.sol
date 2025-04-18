// script/DeployOnly.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/SE2Token.sol";

contract DeployOnly is Script {
    function run() external {
        vm.startBroadcast();
        new SE2Token();
        vm.stopBroadcast();
    }
}
