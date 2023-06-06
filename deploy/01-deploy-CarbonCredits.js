const { network } = require("hardhat");
require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log(deployer);
  const _ownerAddress = process.env.ACCOUNT_ADDRESS;
  console.log(_ownerAddress);

  const carbonCredits = await deploy("CarbonCredits", {
    contract: "CarbonCredits",
    from: deployer,
    log: true,
    args: [_ownerAddress],
  });

  console.log("CarbonCredits is deployed at ", carbonCredits.address);
};

module.exports.tags = ["all", "carbonCredits"];
