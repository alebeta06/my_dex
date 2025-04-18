// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../contracts/Vault.sol";
import "../contracts/IStrategy.sol";
import "../contracts/MockERC20.sol";
import "../contracts/MockStrategy.sol";


contract VaultTest is Test {
    MockERC20 want;
    MockStrategy strategy;
    Vault vault;
    address user = address(1);

    function setUp() public {
        // 1. Desplegar un token mock y estrategia mock
        want = new MockERC20("Mock", "MCK", 18);
        strategy = new MockStrategy(IERC20(address(want)));
        // 2. Desplegar el vault apuntando al mock
        vault = new Vault(IERC20(address(want)), strategy);
        // 3. Dar a user 1 000 tokens
        want.mint(user, 1_000 ether);
    }

    function testDepositAndWithdraw(uint256 amt) public {
        // fuzz: msg.value → amt
        vm.assume(amt > 0 && amt <= 1_000 ether);
        // user aprueba y deposita
        vm.startPrank(user);
        want.approve(address(vault), amt);
        vault.deposit(amt);
        // share minted = amt (primer depósito)
        assertEq(vault.balanceOf(user), amt);
        // ahora retiro
        vault.withdraw(amt);
        // ahora el user recupera su depósito
        assertEq(want.balanceOf(user), 1_000 ether);
        vm.stopPrank();
    }

    function testHarvestOnlyOwner() public {
        // Simulamos que un address distinto al owner llama a harvest
    vm.prank(address(2));
    vm.expectRevert(
      abi.encodeWithSignature("OwnableUnauthorizedAccount(address)", address(2))
    );
    vault.harvest();
    }
}
