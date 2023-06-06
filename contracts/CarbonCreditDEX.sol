// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "./CarbonCredits.sol";
import "./BancorFormula.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "./EIP712MetaTransaction.sol";

//TODO use Dense Token instead of native token
contract CarbonCreditDEX is
    BancorFormula,
    EIP712MetaTransaction("CarbonCreditDEX", "1")
{
    CarbonCredits public carbonCredits;
    address public immutable owner; //TODO change to private
    address public immutable sustainabilityCoin;

    struct TokenDetails {
        uint32 RESERVE_RATIO;
        uint256 _fee;
        uint256 initialSupply;
    }

    mapping(uint256 => uint256) public reserveBalances; //TODO change to private
    mapping(uint256 => TokenDetails) public tokenDetails;

    uint256 public amount; //TODO Remove later

    constructor(
        address _carbonCreditsContractAddress,
        address _owner,
        address _sustainabilityCoin
    ) payable {
        owner = _owner; //TODO check if we really need this
        carbonCredits = CarbonCredits(_carbonCreditsContractAddress);
        sustainabilityCoin = _sustainabilityCoin;
    }

    //TODO add create player contract
    function createNewIndustry(
        //TODO check if saame ID already doesn't exist
        uint256 id,
        uint256 fee,
        uint256 initialSupply,
        uint256 initialPrice,
        uint32 rr,
        bytes memory data
    ) public onlyOwner {
        console.log(initialSupply, initialPrice, rr);
        reserveBalances[id] = (initialSupply * initialPrice * rr) / 1e18;
        //(1 * 10 ** 18);
        console.log("reserve Balances =", reserveBalances[id]);
        IERC20(sustainabilityCoin).transferFrom(
            msgSender(),
            address(this),
            reserveBalances[id]
        );
        console.log("transfered");
        carbonCredits.mint(owner, id, initialSupply, data);
        tokenDetails[id] = TokenDetails(rr, fee, initialSupply);
    }

    //TODO add getPrice function

    function buy(
        uint256 id,
        address to,
        uint256 _depositAmount,
        bytes memory data
    ) public {
        IERC20(sustainabilityCoin).transferFrom(
            msgSender(),
            address(this),
            _depositAmount
        );
        console.log(
            carbonCredits.totalSupply(id),
            reserveBalances[id],
            tokenDetails[id].RESERVE_RATIO,
            _depositAmount
        );
        uint256 _number = _calculatePurchaseReturn(
            carbonCredits.totalSupply(id),
            reserveBalances[id],
            tokenDetails[id].RESERVE_RATIO,
            _depositAmount
        );
        reserveBalances[id] += _depositAmount; //msg.value in case of native currency
        console.log("computed return amount", _number);
        carbonCredits.mint(to, id, _number, data);
        amount = _number; //TODO Remove later

        //TESTING
        console.log("buy successful");
    }

    function calculatePurchaseReturn(
        uint256 _id,
        uint256 _depositAmount
    ) public view returns (uint256) {
        return
            _calculatePurchaseReturn(
                carbonCredits.totalSupply(_id),
                reserveBalances[_id],
                tokenDetails[_id].RESERVE_RATIO,
                _depositAmount
            );
    }

    // function calculateDepositAmount(
    //     uint256 _id,
    //     uint256 _buyNumber
    // ) public view returns (uint256) {
    //     return
    //         _calculateDepositAmount(
    //             carbonCredits.totalSupply(_id),
    //             reserveBalances[_id],
    //             tokenDetails[_id].RESERVE_RATIO,
    //             _buyNumber
    //         );
    // }

    function sell(uint256 id, uint256 _sellNumber) public {
        uint256 _amount = _calculateSaleReturn(
            carbonCredits.totalSupply(id),
            reserveBalances[id],
            tokenDetails[id].RESERVE_RATIO,
            _sellNumber
        );
        amount = _amount; //TODO Remove later
        reserveBalances[id] -= _amount;
        carbonCredits.burn(msgSender(), id, _sellNumber);
        IERC20(sustainabilityCoin).transfer(msgSender(), _amount);

        // payable(msgSender()).transfer(_amount);    //only for native currency like ETH, MATIC etc
    }

    function calculateSaleReturn(
        uint256 _id,
        uint256 _sellNumber
    ) public view returns (uint256) {
        return
            _calculateSaleReturn(
                carbonCredits.totalSupply(_id),
                reserveBalances[_id],
                tokenDetails[_id].RESERVE_RATIO,
                _sellNumber
            );
    }

    function getRating(uint256 /*_id*/) public pure returns (uint256) {
        return 10; //TODO: give logic to get rating. (Currently a dummy function)
    }

    function getPrice(uint256 _id) public view returns (uint256) {
        return
            (reserveBalances[_id] * (1e18)) /
            (carbonCredits.totalSupply(_id) * tokenDetails[_id].RESERVE_RATIO);
    }

    modifier onlyOwner() {
        require(msgSender() == owner, "Only owner can call the function");
        // if (msgSender() != owner) revert NotOwner();
        _;
    }
}
