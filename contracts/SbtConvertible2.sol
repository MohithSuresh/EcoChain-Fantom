// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "./Institutes.sol";

import {Functions, FunctionsClient} from "@chainlink/contracts/src/v0.8/dev/functions/FunctionsClient.sol"; // Once published
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract ProfessionalValidation is
    ERC721URIStorage,
    Institutes,
    FunctionsClient,
    ConfirmedOwner
{
    address private _owner;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    using Functions for Functions.Request;

    bytes32 public latestRequestId;
    bytes public latestResponse;
    bytes public latestError;

    uint32 public gasLimit = 250000;
    uint64 public subscriptionId = 0;
    string source =
        string(
            abi.encodePacked(
                "let jsonObject = JSON.parse(args[0]);",
                "const principalAmount = parseInt(jsonObject.carbon_credits);",
                "return Functions.encodeUint256(Math.round(principalAmount));"
            )
        );

    function setGasLimit(uint32 _gasLimit) public onlyAllOwner returns (bool) {
        gasLimit = _gasLimit;
        return true;
    }

    function setSubscriptionId(
        uint64 _subscriptionId
    ) public onlyAllOwner returns (bool) {
        subscriptionId = _subscriptionId;
        return true;
    }

    event OCRResponse(bytes32 indexed requestId, bytes result, bytes err);

    constructor(
        address oracle
    )
        ERC721("Convertible Carbon-Credits SBT", "CCCSBT")
        FunctionsClient(oracle)
        ConfirmedOwner(msg.sender)
    {}

    function executeRequest(
        string memory source,
        bytes memory secrets,
        string[] memory args,
        uint64 subscriptionId,
        uint32 gasLimit
    ) public onlyOwner returns (bytes32) {
        Functions.Request memory req;
        req.initializeRequest(
            Functions.Location.Inline,
            Functions.CodeLanguage.JavaScript,
            source
        );
        if (secrets.length > 0) {
            req.addRemoteSecrets(secrets);
        }
        if (args.length > 0) req.addArgs(args);

        bytes32 assignedReqID = sendRequest(req, subscriptionId, gasLimit);
        latestRequestId = assignedReqID;
        return assignedReqID;
    }

    /**
     * @notice Callback that is invoked once the DON has resolved the request or hit an error
     *
     * @param requestId The request ID, returned by sendRequest()
     * @param response Aggregated response from the user code
     * @param err Aggregated error from the user code or from the execution pipeline
     * Either response or error parameter will be set, but never both
     */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        latestResponse = response;
        latestError = err;
        emit OCRResponse(requestId, response, err);
    }

    /**
     * @notice Allows the Functions oracle address to be updated
     *
     * @param oracle New oracle address
     */
    function updateOracleAddress(address oracle) public onlyOwner {
        setOracle(oracle);
    }

    function addSimulatedRequestId(
        address oracleAddress,
        bytes32 requestId
    ) public onlyOwner {
        addExternalRequest(oracleAddress, requestId);
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
        string[] memory tokenArray = new string[](1);
        tokenArray[0] = tokenData;

        // check if token is already burned
        require(bytes(tokenData).length > 0, "Token already burned");

        executeRequest(source, "", tokenArray, subscriptionId, gasLimit);

        _burn(tokenId);
    }
}
