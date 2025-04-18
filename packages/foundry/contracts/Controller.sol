// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "openzeppelin-contracts/contracts/access/Ownable.sol";
import "./Vault.sol";

/// @title Controller sencillo para orquestar harvests y rebalances
contract Controller is Ownable {
    Vault public vault;

    event Rebalanced(address indexed caller);

    /// @param _vault Vault a controlar
    constructor(Vault _vault) Ownable(msg.sender) {
        vault = _vault;
    }

    /// @notice Llama a harvest en la estrategia
    function harvest() external onlyOwner {
        vault.harvest();
    }

    /// @notice Ejemplo de rebalance (podrías rotar estrategias aquí)
    function rebalance() external onlyOwner {
        vault.harvest();
        // …lógica extra de rebalanceo…
        emit Rebalanced(msg.sender);
    }
}
