// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

/// @dev Token ERC‑20 de prueba con función mint() y decimals configurable
contract MockERC20 is ERC20 {
    uint8 private _decimals;

    /// @param name Nombre del token
    /// @param symbol Símbolo del token
    /// @param decimals_ Número de decimales
    constructor(string memory name, string memory symbol, uint8 decimals_) ERC20(name, symbol) {
        _decimals = decimals_;
    }

    /// @notice Devuelve los decimales configurados
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    /// @notice Crea nuevos tokens para `to`
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
