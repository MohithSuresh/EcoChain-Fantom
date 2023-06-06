// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "./EIP712MetaTransaction.sol";
error NotOwner_PLAYERS();

//Need to add DEXAddress by calling the function setDEXAddress for the contract to mint and burn

contract CarbonCredits is
    ERC1155,
    Ownable,
    ERC1155Burnable,
    ERC1155Supply,
    EIP712MetaTransaction("CarbonCredits", "1")
{
    address public carbonCreditsOwner; //TODO make private
    address public DEXAddress;

    constructor(address _owner) ERC1155("SomeURL") {
        carbonCreditsOwner = _owner;
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function setOwner(address newOwner) public onlyContractOwner {
        carbonCreditsOwner = newOwner;
    }

    function mint(
        address account,
        uint256 id, //id is mapped to industry
        uint256 amount,
        bytes memory data //TODO add a modifier so that only DEX can access this method
    ) public onlyDEXOrOwner {
        _mint(account, id, amount, data);
    }

    function burn(
        address account,
        uint256 id,
        uint256 value
    ) public override onlyDEXOrOwner {
        //TODO add a modifier so that only DEX can access this method
        _burn(account, id, value);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function getPortfolio(
        address account,
        uint256[] memory ids
    ) public view returns (uint256[] memory) {
        // uint256[][] memory batchPortfolios;
        uint256[] memory _portfolio = new uint256[](ids.length);

        for (uint256 i = 0; i < ids.length; ++i) {
            _portfolio[i] = balanceOf(account, ids[i]);
        }

        return _portfolio;
    }

    function setDEXAddress(address _DEXAddress) external onlyContractOwner {
        DEXAddress = _DEXAddress;
    }

    modifier onlyContractOwner() {
        require(
            msg.sender == carbonCreditsOwner,
            "Only owner can call this function"
        );
        _;
    }

    modifier onlyDEXOrOwner() {
        require(
            msg.sender == DEXAddress || msg.sender == carbonCreditsOwner,
            "Only DEX or carbonCreditsOwner can call this function"
        );
        _;
    }
}
