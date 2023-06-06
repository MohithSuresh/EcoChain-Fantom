const { network } = require("hardhat");
require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const sustainabilityCoin = await deploy("SustainabilityCoin", {
    contract: "SustainabilityCoin",
    from: deployer,
    log: true,
    args: [],
  });

  console.log("SustainabilityCoin is deployed at ", sustainabilityCoin.address);
};

module.exports.tags = ["all", "sustainabilityCoin"];
