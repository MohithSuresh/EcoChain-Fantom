const { network } = require("hardhat");
const { verify } = require("../utils/verify");

require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const _ownerAddress = process.env.ACCOUNT_ADDRESS;
  console.log("deployer: ", deployer);

  const carbonCredits = await deploy("CarbonCredits", {
    contract: "CarbonCredits",
    from: deployer,
    log: true,
    args: [_ownerAddress],
  });
  await verify(carbonCredits.address, [_ownerAddress]);

  console.log("CarbonCredits is deployed at ", carbonCredits.address);
};

module.exports.tags = ["all", "carbonCredits"];
