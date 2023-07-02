pragma solidity >=0.8.0;

contract Institutes {
    // Add owner constructor
    struct Institute {
        string name;
        string description;
        bool active;
    }
    address private owner;
    uint256 institutes_count;
    // uint256 active_institutes_count;

    mapping(address => Institute) internal institutes;
    address[] internal institutes_list;

    constructor() {
        owner = msg.sender;
        // institutes_count = 0;
    }

    function addInstitute(
        string memory name,
        string memory description,
        address institute_adress
    ) external {
        require(owner == msg.sender, "No sufficient right");
        Institute memory _institute = Institute(name, description, true);
        institutes[institute_adress] = _institute;
        institutes_list.push(institute_adress);
        institutes_count++;
    }

    function removeInstitute(address institute_adress) external {
        require(owner == msg.sender, "No sufficient right");
        institutes[institute_adress].active = false;
        institutes_count--;
    }

    function instituteInfo(
        address institute_adress
    ) external view returns (Institute memory) {
        return institutes[institute_adress];
    }

    function instituteList() external view returns (address[] memory) {
        return institutes_list;
    }

    function instituteCount() public view returns (uint256) {
        return institutes_count;
    }

    modifier onlyInstitute() {
        require(
            institutes[msg.sender].active == true,
            "Needs to be valid institute"
        );
        _;
    }

    modifier onlyAllOwner() {
        require(owner == msg.sender, "No sufficient right as owner");
        _;
    }

    function is_admin(address _admin) public view returns (bool) {
        if (_admin == owner) return true;
        return false;
    }

    function is_institute(address _institute) public view returns (bool) {
        if (institutes[_institute].active) return true;
        return false;
    }
}
