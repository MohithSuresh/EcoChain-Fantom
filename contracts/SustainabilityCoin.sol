// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./EIP712MetaTransaction.sol";

contract SustainabilityCoin is
    ERC20,
    ERC20Burnable,
    Ownable,
    EIP712MetaTransaction("SustainabilityCoin", "1")
{
    constructor() ERC20("SustainabilityCoin", "SUSTAIN") {
        _mint(msgSender(), 21000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
