const { network } = require("hardhat");
const { verify } = require("../utils/verify");

require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const _carbonCredits = await deployments.get("CarbonCredits");
  const _sustainabilityCoin = await deployments.get("SustainabilityCoin");

  let _carbonCreditsAddress = _carbonCredits.address;
  let _ownerAddress = process.env.ACCOUNT_ADDRESS;
  let _sustainabilityCoinAddress = _sustainabilityCoin.address;

  const carbonCreditDEX = await deploy("CarbonCreditDEX", {
    from: deployer,
    args: [_carbonCreditsAddress, _ownerAddress, _sustainabilityCoinAddress],
    log: true,

    waitConfirmations: network.config.blockConfirmations || 1,
  });

  await verify(carbonCreditDEX.address, [
    _carbonCreditsAddress,
    _ownerAddress,
    _sustainabilityCoinAddress,
  ]);

  log(`CarbonCreditDEX deployed at ${carbonCreditDEX.address}`);
};

module.exports.tags = ["all", "carbonCreditDEX"];
