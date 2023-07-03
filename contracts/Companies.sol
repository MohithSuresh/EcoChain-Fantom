pragma solidity >=0.8.0;

contract Companies {
    // Add owner constructor
    struct Company {
        string name;
        string description;
        bool active;
    }
    address private owner;
    uint256 companies_count;
    address[] internal companies_list;

    mapping(address => Company) internal companies;

    constructor() {
        owner = msg.sender;
        // companies_count = 0;
    }

    function addCompany(
        string memory name,
        string memory description,
        address company_adress
    ) external {
        Company memory _company = Company(name, description, true);
        companies[company_adress] = _company;
        companies_list.push(company_adress);
        companies_count++;
    }

    function removeCompany(address company_adress) external {
        require(owner == msg.sender, "No sufficient right");
        companies[company_adress].active = false;
        companies_count--;
    }

    function companyInfo(
        address company_adress
    ) external view returns (Company memory) {
        return companies[company_adress];
    }

    function companyCount() public view returns (uint256) {
        return companies_count;
    }

    function companyList() external view returns (address[] memory) {
        return companies_list;
    }

    modifier onlyCompany() {
        require(
            companies[msg.sender].active == true,
            "Needs to be valid company"
        );
        _;
    }

    // modifier onlyAllOwner() {
    //     require(owner == msg.sender, "No sufficient right as owner");
    //     _;
    // }

    // function is_admin(address _admin) public view returns (bool) {
    //     if (_admin == owner) return true;
    //     return false;
    // }

    function is_company(address _company) public view returns (bool) {
        if (companies[_company].active) return true;
        return false;
    }
}
