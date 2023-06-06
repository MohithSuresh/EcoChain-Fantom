const { network } = require("hardhat");
require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const carbonCredits = await deployments.get("CarbonCredits");
  const _carbonCreditsAddress = carbonCredits.address;
  const sbtPermanent = await deploy("SbtPermanent", {
    contract: "SbtPermanent",
    from: deployer,
    log: true,
    args: [_carbonCreditsAddress],
  });

  console.log("SbtPermanent is deployed at ", sbtPermanent.address);
};

module.exports.tags = ["all", "sbtPermanent"];
