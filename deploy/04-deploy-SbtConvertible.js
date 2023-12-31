const { network } = require("hardhat");
const { verify } = require("../utils/verify");

require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const oracleAddress = process.env.ORACLE_ADDRESS;
  const sbtConvertible = await deploy("SbtConvertible", {
    contract: "SbtConvertible",
    from: deployer,
    log: true,
    args: [oracleAddress],
  });

  await verify(sbtConvertible.address, [oracleAddress]);

  console.log("SbtConvertible is deployed at ", sbtConvertible.address);
};

module.exports.tags = ["all", "sbtConvertible"];
