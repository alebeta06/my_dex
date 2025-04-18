// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";
import "./IStrategy.sol";

/// @title Vault para agrupar y auto‑compounding de yield
contract Vault is ERC20, Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable want;
    IStrategy public strategy;

    event Deposit(address indexed user, uint256 amount, uint256 shares);
    event Withdraw(address indexed user, uint256 amount, uint256 shares);
    event StrategyUpdated(address indexed newStrategy);

    /// @param _want Token que los usuarios depositan
    /// @param _strategy Estrategia inicial
    constructor(IERC20 _want, IStrategy _strategy)
        ERC20("DAG_Yield Vault", "vDAG")
        Ownable(msg.sender)
    {
        want = _want;
        strategy = _strategy;
    }

    function deposit(uint256 _amount) external {
        require(_amount > 0, "Vault: amount>0");

        uint256 assetsBefore = totalAssets();
        // traemos los tokens
        want.safeTransferFrom(msg.sender, address(this), _amount);

        // damos permiso a la estrategia
        require(
            want.approve(address(strategy), _amount),
            "Vault: approve failed"
        );
        strategy.deposit(_amount);

        // calculamos shares
        uint256 shares = totalSupply() == 0
            ? _amount
            : (_amount * totalSupply()) / assetsBefore;

        _mint(msg.sender, shares);
        emit Deposit(msg.sender, _amount, shares);
    }

    function withdraw(uint256 _shares) external {
        require(_shares > 0, "Vault: shares>0");

        uint256 assetsBefore = totalAssets();
        uint256 amount = (assetsBefore * _shares) / totalSupply();

        _burn(msg.sender, _shares);
        strategy.withdraw(amount);
        want.safeTransfer(msg.sender, amount);

        emit Withdraw(msg.sender, amount, _shares);
    }

    /// @notice Total de want que controla este vault (en vault + en strategy)
    function totalAssets() public view returns (uint256) {
         // sumamos lo que hay en el vault + lo que hay en la estrategia
         return want.balanceOf(address(this)) + want.balanceOf(address(strategy));
    }
    /// @notice Reclama rendimientos (solo owner)
    function harvest() external onlyOwner {
         strategy.harvest();
     }

    /// @notice Cambiar estrategia (solo owner)
    function updateStrategy(IStrategy _newStrategy) external onlyOwner {
        strategy = _newStrategy;
        emit StrategyUpdated(address(_newStrategy));
    }
}
