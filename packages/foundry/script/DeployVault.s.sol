// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../contracts/MockERC20.sol";
import "../contracts/MockStrategy.sol";
import "../contracts/Vault.sol";
import "../contracts/Controller.sol";

contract DeployVault is Script {
    function run() external {
        vm.startBroadcast();
        // 1. Desplegar token mock (o el real WETH/USDC en testnet)
        MockERC20 want = new MockERC20("Mock", "MCK", 18);
        // 2. Desplegar estrategia
        MockStrategy strat = new MockStrategy(IERC20(address(want)));
        // 3. Desplegar vault
        Vault vault = new Vault(IERC20(address(want)), strat);
        // 4. Desplegar controller
        new Controller(vault);
        vm.stopBroadcast();
    }
}
