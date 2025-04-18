// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../contracts/Vault.sol";
import "../contracts/Controller.sol";
import "../contracts/MockERC20.sol";
import "../contracts/MockStrategy.sol";

/// @notice Redeclare the event so tests can `emit` it
event Rebalanced(address indexed caller);

contract ControllerTest is Test {
    Vault vault;
    Controller controller;
    MockERC20 want;
    MockStrategy strategy;

    function setUp() public {
        want = new MockERC20("Mock", "MCK", 18);
        strategy = new MockStrategy(IERC20(address(want)));
        vault = new Vault(IERC20(address(want)), strategy);
        controller = new Controller(vault);
        // Hacemos que el Controller sea el owner del Vault
        vault.transferOwnership(address(controller));
    }

    function testOnlyOwnerCanHarvest() public {
        // esperamos el error custom de OpenZeppelin Ownable
        vm.expectRevert(
          abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", address(2))
        );
        vm.prank(address(2));
        controller.harvest();
    }

    function testRebalanceEmitsEvent() public {
        vm.prank(controller.owner());
        vm.expectEmit(true, true, true, true);
        emit Rebalanced(controller.owner());
        controller.rebalance();
    }
}
