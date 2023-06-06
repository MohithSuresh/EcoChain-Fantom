// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "./Institutes.sol";
import "./CarbonCredits.sol";

contract ProfessionalValidation is ERC721URIStorage, Institutes {
    address private _owner;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    CarbonCredits private _carbonCredits;

    constructor(
        address carbonCreditsAddress
    ) ERC721("Convertible Carbon-Credits SBT", "CCCSBT") {
        _carbonCredits = CarbonCredits(carbonCreditsAddress);
    }

    struct SBT {
        string institute_name; // address of institute
        string company_name; //can be enum
        string carbon_credits;
        string issue_date;
        string industry_id;
        string description;
    }

    function SBT_to_string(
        SBT memory exp
    ) private pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '{"institute_name":',
                    exp.institute_name,
                    '"company_name":',
                    exp.company_name,
                    ', "carbon_credits":',
                    exp.carbon_credits,
                    ', "issue_date":',
                    exp.issue_date,
                    ', "industry_id":',
                    exp.industry_id,
                    ', "description":',
                    exp.description,
                    "}"
                )
            );
    }

    // already available in base class
    // function tokenURI(uint256 tokenId) public view virtual override returns (string memory)

    //overriding trasfer functions of ERC721 to make the token soulbound
    // this function is disabled since we don;t want to allow transfers
    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public virtual override {
        revert("Transfer not supported for soul bound token.");
    }

    // this function is disabled since we don;t want to allow transfers
    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes memory _data
    ) public virtual override {
        revert("Transfer not supported for soul bound token.");
    }

    // this function is disabled since we don;t want to allow transfers
    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public virtual override {
        revert("Transfer not supported for soul bound token.");
    }

    // this function is disabled since we don;t want to allow transfers
    function approve(address _to, uint256 _tokenId) public virtual override {
        revert("Transfer not supported for soul bound token.");
    }

    // this function is disabled since we don't want to allow transfers
    function setApprovalForAll(
        address _operator,
        bool _approved
    ) public virtual override {
        revert("Transfer not supported for soul bound token.");
    }

    // this function is disabled since we don;t want to allow transfers
    function getApproved(
        uint256 _tokenId
    ) public view override returns (address) {
        return address(0x0);
    }

    function mint(
        address receiver,
        string memory comp_name,
        string memory carb_credits,
        string memory description,
        string memory issue_date,
        string memory ind_id
    ) public onlyInstitute returns (bool) {
        address inst_address = msg.sender;
        string memory inst_name = institutes[inst_address].name;
        SBT memory credits_sbt = SBT(
            inst_name,
            comp_name,
            carb_credits,
            issue_date,
            ind_id,
            description
        );
        _tokenIds.increment();
        uint256 newNftTokenId = _tokenIds.current();
        _mint(receiver, newNftTokenId);
        _setTokenURI(newNftTokenId, SBT_to_string(credits_sbt));
        return true;
    }

    function burn(uint256 tokenId) public {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721Burnable: caller is not owner nor approved"
        );
        string memory tokenData = tokenURI(tokenId);
        // check if token is already burned
        require(bytes(tokenData).length > 0, "Token already burned");

        _burn(tokenId);
    }
}
