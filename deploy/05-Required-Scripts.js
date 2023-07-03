// const { network, ethers } = require("hardhat");
// require("dotenv").config();
// const { assert, expect } = require("chai");

// module.exports = async ({ getNamedAccounts, deployments }) => {
//   let rr = 200_000,
//     id = 1; //9007000000000001~= 2**53 is the limit for id;
//   _fee = 4;
//   initialSupply = 1_000_000e18;
//   initialPrice = ethers.utils.parseEther("0.00000001");
//   _depositAmount = ethers.utils.parseEther("100");
//   _sellAmount = 6;
//   const SENT_AMOUNT = ethers.utils.parseEther("300000");

//   const [deployer] = await ethers.getSigners();
//   //   const { deployer } = await getNamedAccounts();
//   //   const deployer =
//   //     process.env.PRIVATE_KEY ||
//   //     "0x11ee3108a03081fe260ecdc106554d09d9d1209bcafd46942b10e02943effc4a";

//   console.log("Deploying contracts with the account:", deployer.address);
//   const carbonCreditDEXDeployment = await deployments.get("CarbonCreditDEX");
//   const carbonCreditDEX = await ethers.getContractAt(
//     carbonCreditDEXDeployment.abi,
//     carbonCreditDEXDeployment.address
//   );

//   const sbtConvertibleDeployment = await deployments.get("SbtConvertible");
//   const sbtConvertible = await ethers.getContractAt(
//     sbtConvertibleDeployment.abi,
//     sbtConvertibleDeployment.address
//   );

//   const carbonCreditsDeployment = await deployments.get("CarbonCredits");
//   const carbonCredits = await ethers.getContractAt(
//     carbonCreditsDeployment.abi,
//     carbonCreditsDeployment.address
//   );

//   const sustainabilityCoinDeployment = await deployments.get(
//     "SustainabilityCoin"
//   );
//   const sustainabilityCoin = await ethers.getContractAt(
//     sustainabilityCoinDeployment.abi,
//     sustainabilityCoinDeployment.address
//   );

//   await sustainabilityCoin
//     .connect(deployer)
//     .approve(carbonCreditDEX.address, SENT_AMOUNT);

//   await carbonCredits.setDEXAddress(carbonCreditDEX.address);

//   let allowed = await sustainabilityCoin.allowance(
//     deployer.address,
//     carbonCreditDEX.address
//   );

//   console.log("allowed", allowed.toString());
//   for (let i = 1; i < 4; i++) {
//     await expect(
//       carbonCreditDEX.connect(deployer).createNewIndustry(
//         i,
//         _fee,
//         initialSupply.toLocaleString("fullwide", {
//           useGrouping: false,
//         }),
//         initialPrice,
//         rr,
//         0x0
//       )
//     ).to.emit(sustainabilityCoin, "Transfer");
//     let _totalSupply = await carbonCredits.totalSupply(i);
//     console.log("totalSupply :", _totalSupply.toString());

//     console.log("id :", i);
//   }

//   await sbtConvertible
//     .connect(deployer)
//     .addIndustry("Our Team", "Owners of CCDEX", deployer.address);

//   let result = await _isInstitute(deployer.address);
//   console.log("result", result);

// };
// module.exports.tags = ["all", "deployScripts"];

const { network, ethers } = require("hardhat");
require("dotenv").config();
const { assert, expect } = require("chai");

module.exports = async ({ getNamedAccounts, deployments }) => {
  let rr = 200_000,
    id = 1; //9007000000000001~= 2**53 is the limit for id;
  _fee = 4;
  initialSupply = 1_000_000e18;
  initialPrice = ethers.utils.parseEther("0.00000001");
  _depositAmount = ethers.utils.parseEther("100");
  _sellAmount = 6;
  const SENT_AMOUNT = ethers.utils.parseEther("300000");
  const [deployer] = await ethers.getSigners();
  const RANDOM_ADDRESS_1 = process.env.RANDOM_ADDRESS_1;
  const RANDOM_ADDRESS_2 = process.env.RANDOM_ADDRESS_2;

  // const { deployer } = await getNamedAccounts();
  //   const deployer =
  //     process.env.PRIVATE_KEY ||
  //     "0x11ee3108a03081fe260ecdc106554d09d9d1209bcafd46942b10e02943effc4a";

  console.log("Deploying contracts with the account:", deployer.address);
  const carbonCreditDEXDeployment = await deployments.get("CarbonCreditDEX");
  const carbonCreditDEX = await ethers.getContractAt(
    carbonCreditDEXDeployment.abi,
    carbonCreditDEXDeployment.address
  );

  const sbtPermanentDeployment = await deployments.get("SbtPermanent");
  const sbtPermanent = await ethers.getContractAt(
    sbtPermanentDeployment.abi,
    sbtPermanentDeployment.address
  );

  const sbtConvertibleDeployment = await deployments.get("SbtConvertible");
  const sbtConvertible = await ethers.getContractAt(
    sbtConvertibleDeployment.abi,
    sbtConvertibleDeployment.address
  );

  const carbonCreditsDeployment = await deployments.get("CarbonCredits");
  const carbonCredits = await ethers.getContractAt(
    carbonCreditsDeployment.abi,
    carbonCreditsDeployment.address
  );

  const sustainabilityCoinDeployment = await deployments.get(
    "SustainabilityCoin"
  );
  const sustainabilityCoin = await ethers.getContractAt(
    sustainabilityCoinDeployment.abi,
    sustainabilityCoinDeployment.address
  );

  await sustainabilityCoin
    .connect(deployer)
    .approve(carbonCreditDEX.address, SENT_AMOUNT);

  await carbonCredits.setDEXAddress(carbonCreditDEX.address);

  let allowed = await sustainabilityCoin.allowance(
    deployer.address,
    carbonCreditDEX.address
  );

  let result6 = await sbtPermanent
    .connect(deployer)
    .is_company(RANDOM_ADDRESS_1);
  console.log("is_company :", result6);

  console.log("allowed", allowed.toString());
  for (let i = 1; i < 7; i++) {
    await expect(
      carbonCreditDEX.connect(deployer).createNewIndustry(
        i,
        _fee,
        initialSupply.toLocaleString("fullwide", {
          useGrouping: false,
        }),
        initialPrice * i,
        rr,
        0x0
      )
    ).to.emit(sustainabilityCoin, "Transfer");
    let _totalSupply = await carbonCredits.totalSupply(i);
    console.log("totalSupply :", _totalSupply.toString());

    console.log("id :", i);
  }
  await sbtConvertible
    .connect(deployer)
    .addInstitute(
      "Ecochain",
      "Carbon Credits Verification Team",
      deployer.address
    );
  let result = await sbtConvertible
    .connect(deployer)
    .is_institute(deployer.address);
  console.log("is_institute :", result);

  await sbtConvertible
    .connect(deployer)
    .addInstitute(
      "Environmental Protection Agency",
      "United States of America. The EPA is a US federal agency that protects human health and the environment. It enforces environmental regulations, conducts research, and promotes sustainability to address pollution and climate change.",
      RANDOM_ADDRESS_1
    );
  let result2 = await sbtConvertible
    .connect(deployer)
    .is_institute(RANDOM_ADDRESS_1);
  console.log("is_institute :", result2);

  await sbtConvertible
    .connect(deployer)
    .addInstitute(
      "Environment Agency",
      "United Kingdom. The Environment Agency is a regulatory body in the UK. It works to protect and improve the environment, including managing flood risks, regulating industries, and promoting sustainable practices for a greener future.",
      RANDOM_ADDRESS_2
    );
  let result3 = await sbtConvertible
    .connect(deployer)
    .is_institute(RANDOM_ADDRESS_2);
  console.log("is_institute :", result3);

  await sbtPermanent
    .connect(deployer)
    .addCompany(
      "Tesla",
      "American electric vehicle and clean energy company founded by Elon Musk, JB Straubel, Martin Eberhard, Marc Tarpenning, and Ian Wright. It was established in 2003 with the goal of accelerating the world's transition to sustainable energy.",
      RANDOM_ADDRESS_1
    );
  let result4 = await sbtPermanent
    .connect(deployer)
    .is_company(RANDOM_ADDRESS_1);
  console.log("is_company :", result4);

  await sbtPermanent
    .connect(deployer)
    .addCompany(
      "Apple",
      "American multinational technology company that specializes in consumer electronics, computer software, and online services. It is considered one of the Big Five companies in the U.S. information technology industry, along with Amazon, Google, Microsoft, and Facebook.",
      RANDOM_ADDRESS_2
    );
  let result5 = await sbtPermanent
    .connect(deployer)
    .is_company(RANDOM_ADDRESS_2);
  console.log("is_company :", result5);
};
module.exports.tags = ["all", "deployScripts"];
