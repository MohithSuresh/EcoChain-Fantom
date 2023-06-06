const { assert, expect } = require("chai");
const { network, deployments, ethers } = require("hardhat");
const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { BigNumber } = require("ethers");

//initialization
let rr = 200_000,
  id = 1; //9007000000000001~= 2**53 is the limit for id;
_fee = 4;
initialSupply = 1_000_000e18;
initialPrice = ethers.utils.parseEther("0.00000001");
_depositAmount = ethers.utils.parseEther("100");
_sellAmount = 6;
const SENT_AMOUNT = ethers.utils.parseEther("300000");

describe("Unit Tests", function () {
  let carbonCreditDEX, carbonCredits, sustainabilityCoin;
  let deployer, addr1, addr2;

  async function deployFixtures() {
    // Contracts are deployed using the first signer/account by default
    [deployer, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract
    const CarbonCredits = await ethers.getContractFactory("CarbonCredits");
    const CarbonCreditDEX = await ethers.getContractFactory("CarbonCreditDEX");
    const SustainabilityCoin = await ethers.getContractFactory(
      "SustainabilityCoin"
    );

    sustainabilityCoin = await SustainabilityCoin.connect(deployer).deploy(); //deployer has all the initial minted dense okens
    carbonCredits = await CarbonCredits.connect(deployer).deploy(
      deployer.address
    );
    carbonCreditDEX = await CarbonCreditDEX.connect(deployer).deploy(
      carbonCredits.address,
      deployer.address,
      sustainabilityCoin.address
    );
    //setting DEX Address in CarbonCredits
    await carbonCredits.setDEXAddress(carbonCreditDEX.address);

    //TESTING
    let carbonCreditsOwner = await carbonCredits.carbonCreditsOwner();
    console.log(
      " owner of CarbonCredits is ",
      carbonCreditDEX.address,
      "=",
      carbonCreditsOwner
    );

    //transfering tokens to each account     (using deployer as it has all initially minted Dense tokens)
    await sustainabilityCoin
      .connect(deployer)
      .transfer(deployer.address, SENT_AMOUNT);
    await sustainabilityCoin
      .connect(deployer)
      .transfer(addr1.address, SENT_AMOUNT);
    await sustainabilityCoin
      .connect(deployer)
      .transfer(addr2.address, SENT_AMOUNT);

    //TESTING
    let addr1Balance = await sustainabilityCoin.balanceOf(addr1.address);
    let deployerbalance = await sustainabilityCoin.balanceOf(deployer.address);
    console.log("addr1 balance is ", addr1Balance);

    //transfering tokens to DEX initially
    // await sustainabilityCoin
    //   .connect(deployer)
    //   .transfer(carbonCreditDEX.address, ethers.utils.parseEther("10000"));

    //TESTING
    let dexBalance = await sustainabilityCoin.balanceOf(
      carbonCreditDEX.address
    );
    console.log("carbonCreditDEX balance is ", dexBalance);

    //approving DEX to spend tokens
    await sustainabilityCoin
      .connect(deployer)
      .approve(carbonCreditDEX.address, SENT_AMOUNT);
    await sustainabilityCoin
      .connect(addr1)
      .approve(carbonCreditDEX.address, SENT_AMOUNT);
    await sustainabilityCoin
      .connect(addr2)
      .approve(carbonCreditDEX.address, SENT_AMOUNT);

    //TESTING
    let allowed = await sustainabilityCoin.allowance(
      deployer.address,
      carbonCreditDEX.address
    );
    console.log("Allowance is ", allowed);
    console.log("deployer balance =", deployerbalance);

    //creating new player
    await carbonCreditDEX.connect(deployer).createNewIndustry(
      id,
      _fee,
      initialSupply.toLocaleString("fullwide", {
        useGrouping: false,
      }),
      initialPrice,
      rr,
      0x0
    );

    //returning all the contracts objects
    return {
      carbonCreditDEX,
      carbonCredits,
      sustainabilityCoin,
    };
  }

  describe("CarbonCreditDEX Unit Tests", function () {
    //All Unit tests
    describe("Check if CarbonCreditDEX is deployed successfully", function () {
      it("sets  carbonCredits correctly", async () => {
        await loadFixture(deployFixtures);

        const valueFromContract = await carbonCreditDEX.carbonCredits(); //upon calling the player contract object we get the address of the contract

        await assert.equal(carbonCredits.address, valueFromContract);
      });
      it("sets  owner correctly", async () => {
        await loadFixture(deployFixtures);
        //checking the owner address
        const valueFromContract = await carbonCreditDEX.owner();

        assert.equal(deployer.address, valueFromContract);
      });
      it("sets  sustainabilityCoin Address correctly", async () => {
        await loadFixture(deployFixtures);
        //checking the sustainabilityCoin address
        const valueFromContract = await carbonCreditDEX.sustainabilityCoin();
        assert.equal(valueFromContract, sustainabilityCoin.address);
      });
    });

    describe("Create New Player", function () {
      //setting new variables for creating new player for testing purposes.
      let rr = 200_000,
        _id = 2;
      _fee = 4;
      let _initialSupply = 1_000 * 10 ** 18;
      let _initialPrice = ethers.utils.parseEther("0.00001");

      it("transfers balances correctly", async () => {
        await loadFixture(deployFixtures);
        //approving exactly how much is necessary to create a new player
        let valueCalculated = (initialPrice * initialSupply * rr) / 1e18;
        await sustainabilityCoin.connect(deployer).approve(
          carbonCreditDEX.address,
          valueCalculated.toLocaleString("fullwide", {
            useGrouping: false,
          })
        );

        //checking emmission of transfer event from densCoin
        await expect(
          carbonCreditDEX.connect(deployer).createNewIndustry(
            _id,
            _fee,
            _initialSupply.toLocaleString("fullwide", {
              useGrouping: false,
            }),
            _initialPrice.toLocaleString("fullwide", {
              useGrouping: false,
            }),
            rr,
            0x0
          )
        ).to.emit(sustainabilityCoin, "Transfer");
      });

      it("mints initial player tokens properly", async () => {
        await loadFixture(deployFixtures);
        //approving exactly how much is necessary to create a new player
        let valueCalculated = (_initialPrice * _initialSupply * rr) / 1e18;
        await sustainabilityCoin.connect(deployer).approve(
          carbonCreditDEX.address,
          valueCalculated.toLocaleString("fullwide", {
            useGrouping: false,
          })
        );

        //checking emmission of transferSingle event from carbonCredits
        await expect(
          carbonCreditDEX.createNewIndustry(
            _id,
            _fee,
            _initialSupply.toLocaleString("fullwide", {
              useGrouping: false,
            }),
            _initialPrice.toLocaleString("fullwide", {
              useGrouping: false,
            }),
            rr,
            0x0
          )
        ).to.emit(carbonCredits, "TransferSingle");
      });
      it("sets  reserveBalances correctly", async () => {
        await loadFixture(deployFixtures);
        //createNewIndustry function
        carbonCreditDEX.createNewIndustry(
          _id,
          _fee,
          _initialSupply.toLocaleString("fullwide", {
            useGrouping: false,
          }),
          _initialPrice.toLocaleString("fullwide", {
            useGrouping: false,
          }),
          rr,
          0x0
        );
        //compare the value from contract with the value calculated
        let valueFromContract = await carbonCreditDEX.reserveBalances(id);
        let valueCalculated = (_initialPrice * _initialSupply * rr) / 1e18;
        assert.equal(valueFromContract, valueCalculated);
      });
    });

    describe("buy", function () {
      it("Transfers Dense coins", async () => {
        await loadFixture(deployFixtures);

        //checking Transfer event from sustainabilityCoin
        await expect(
          carbonCreditDEX.buy(
            id,
            addr1.address,
            _depositAmount.toLocaleString("fullwide", { useGrouping: false }),
            0x0
          )
        ).to.emit(sustainabilityCoin, "Transfer");
      });

      it("Updates ReserveBalances", async () => {
        await loadFixture(deployFixtures);

        //getting previous reserve balance
        let previousReserveBalance = await carbonCreditDEX.reserveBalances(id);

        //TESTING
        console.log(
          "The balance now is ",
          previousReserveBalance.toLocaleString("fullwide", {
            useGrouping: false,
          })
        );

        //calling buy function
        let txResponse = await carbonCreditDEX.buy(
          id,
          addr1.address,
          _depositAmount.toLocaleString("fullwide", { useGrouping: false }),
          0x0
        );
        let txReceipt = await txResponse.wait();

        console.log("txReceipt:", txReceipt);
        console.log(
          "txReceiptAnswer",
          parseInt(txReceipt.logs[2].data.toString().slice(-63), 16)
        ); //the last 64 characters of the data string is the answer.

        let newValue = await carbonCreditDEX.amount();
        console.log("newValue:", newValue);
        console.log("carbonCredits:", carbonCredits.address);

        //getting new reserve balance
        let newReserveBalance = await carbonCreditDEX.reserveBalances(id);

        //TESTING
        console.log(
          "balance = ",
          newReserveBalance.toLocaleString("fullwide", { useGrouping: false })
        ) -
          previousReserveBalance.toLocaleString("fullwide", {
            useGrouping: false,
          });

        //checking if the difference between the two is equal to the deposit amount
        assert.equal(
          (newReserveBalance - previousReserveBalance).toLocaleString(
            "fullwide",
            { useGrouping: false }
          ),
          _depositAmount.toLocaleString("fullwide", { useGrouping: false })
        );
      });

      it("Mints correctly", async () => {
        await loadFixture(deployFixtures);

        //checking TransferSingle event from carbonCredits
        await expect(
          carbonCreditDEX.buy(
            id,
            addr1.address,
            _depositAmount.toLocaleString("fullwide", { useGrouping: false }),
            0x0
          )
        ).to.emit(carbonCredits, "TransferSingle");
      });
    });

    describe("CalculatePurchaseReturn", function () {
      it("Calculation of number of player Tokens that can be bought from the deposited amount is right", async () => {
        await loadFixture(deployFixtures);

        //getting the number of player tokens that can be bought from the deposit amount
        let valueFromCalculation =
          await carbonCreditDEX.calculatePurchaseReturn(
            id,
            _depositAmount.toLocaleString("fullwide", { useGrouping: false })
          );

        //calling buy function
        await carbonCreditDEX.buy(
          id,
          addr1.address,
          _depositAmount.toLocaleString("fullwide", { useGrouping: false }),
          0x0
        );

        //calculate the number of player tokens that are ACTUALLY BOUGHT from the deposit amount
        let valueFromContract = await carbonCreditDEX.amount();

        assert.equal(
          valueFromContract.toLocaleString("fullwide", {
            useGrouping: false,
          }),
          valueFromCalculation.toLocaleString("fullwide", {
            useGrouping: false,
          })
        );
      });
    });

    describe("CalculateDepositAmount", function () {
      //FORMULA: _depositAmount = [ exp{ log((Number/_supply) + 1) / (_connectorWeight / 1000000) } - 1  ] * _connectorBalance

      it("Calculation of deposit amount is right", async () => {
        await loadFixture(deployFixtures);

        //TESTING
        console.log("Id =", id);

        //getting the number of player tokens that can be bought from the _depositAmount
        let _buyNumber = await carbonCreditDEX.calculatePurchaseReturn(
          id,
          _depositAmount.toLocaleString("fullwide", { useGrouping: false })
        );

        //TESTING
        console.log("_buyNumber =", _buyNumber);
        let _supply = await carbonCredits.totalSupply(id);
        console.log("_supply =", _supply);
        let _balance = await carbonCreditDEX.reserveBalances(id);
        console.log("_balance =", _balance);

        //calculating the deposit amount from Formula by inputing the _buyNumber calculated above
        let amountFromCalculation =
          (10 ** (Math.log10(_buyNumber / _supply + 1) / (rr / 1000000)) - 1) *
          _balance;

        //comparing the amountFromCalculation with  _depositAmount

        expect(
          amountFromCalculation.toLocaleString("fullwide", {
            useGrouping: false,
          }) - _depositAmount.toLocaleString("fullwide", { useGrouping: false })
        ).lessThan(100000);
      });
    });

    describe("sell", function () {
      it("burns correctly", async () => {
        await loadFixture(deployFixtures);

        //TESTING
        let _balance = await carbonCredits.balanceOf(addr1.address, id);
        console.log("balance before buying", _balance);

        let valueFromCalculation =
          await carbonCreditDEX.calculatePurchaseReturn(
            id,
            _depositAmount.toLocaleString("fullwide", { useGrouping: false })
          );

        //calling buy function to have some balance of tokens
        carbonCreditDEX.buy(
          id,
          addr1.address,
          _depositAmount.toLocaleString("fullwide", { useGrouping: false }),
          0x0
        );

        //TESTING
        _balance = await carbonCredits.balanceOf(addr1.address, id);
        console.log("balance before burning", _balance);
        console.log("valueFromCalculation", valueFromCalculation);

        let newSellAmount = valueFromCalculation;

        //checking TransferSingle event from carbonCredits
        await expect(
          carbonCreditDEX
            .connect(addr1)
            .sell(
              id,
              newSellAmount.toLocaleString("fullwide", { useGrouping: false })
            )
        ).to.emit(carbonCredits, "TransferSingle");
      });

      it("burns all the tokens", async () => {
        await loadFixture(deployFixtures);

        //TESTING
        let _balance = await carbonCredits.balanceOf(addr1.address, id);
        console.log("balance before buying", _balance);

        let valueFromCalculation =
          await carbonCreditDEX.calculatePurchaseReturn(
            id,
            _depositAmount.toLocaleString("fullwide", { useGrouping: false })
          );

        //calling buy function to have some balance of tokens
        carbonCreditDEX.buy(
          id,
          addr1.address,
          _depositAmount.toLocaleString("fullwide", { useGrouping: false }),
          0x0
        );

        //TESTING
        _balance = await carbonCredits.balanceOf(addr1.address, id);
        console.log("balance before burning", _balance);
        console.log("valueFromCalculation", valueFromCalculation);

        let newSellAmount = valueFromCalculation;

        //checking TransferSingle event from carbonCredits

        await carbonCreditDEX.connect(addr1).sell(
          id,
          newSellAmount.toLocaleString("fullwide", {
            useGrouping: false,
          })
        );

        _balance = await carbonCredits.balanceOf(addr1.address, id);
        console.log("balance after burning", _balance);

        assert.equal(_balance, 0);
      });
      // it("cannot burn more than total supply", async () => {
      //   const { carbonCreditDEX, carbonCredits } = await loadFixture(deployFixtures);

      //   await carbonCreditDEX.buy(
      //     addr1.address,
      //     _depositAmount.toLocaleString("fullwide", { useGrouping: false }),
      //     0x0
      //   );
      //   _balance = await carbonCredits.balanceOf(addr1.address, id);

      // await expect(
      //   carbonCreditDEX.connect(addr1).sell(BigNumber.from(_balance).add(1))
      // ).to.be.revertedWith("ERC1155: burn amount exceeds balance");
      // });

      it("Updates ReserveBalances", async () => {
        await loadFixture(deployFixtures);

        //calling buy function to have some balance of tokens
        await carbonCreditDEX.buy(
          id,
          addr1.address,
          _depositAmount.toLocaleString("fullwide", { useGrouping: false }),
          0x0
        );

        //storing the reserve balance before selling
        let previousReserveBalance = await carbonCreditDEX.reserveBalances(id);

        //TESTING
        console.log(
          "The balance now is ",
          previousReserveBalance.toLocaleString("fullwide", {
            useGrouping: false,
          })
        );

        //calling sell function
        await carbonCreditDEX
          .connect(addr1)
          .sell(
            id,
            _sellAmount.toLocaleString("fullwide", { useGrouping: false })
          );

        // transactionResponse = await sustainabilityCoin.transfer(
        //   addr1.address,
        //   valueFromContract
        // );
        // transactionReceipt = await transactionResponse.wait(1);
        // const { gasUsed, effectiveGasPrice } = transactionReceipt;
        // const gasCost = effectiveGasPrice.mul(gasUsed);
        // console.log("gas cost =", gasCost);

        //storing the reserve balance after selling
        let newReserveBalance = await carbonCreditDEX.reserveBalances(id);

        //TESTING
        console.log(
          "balance = ",
          newReserveBalance.toLocaleString("fullwide", {
            useGrouping: false,
          })
        );

        //getting the amount transfered to seller from contract
        let valueFromContract = await carbonCreditDEX.amount();
        console.log(
          "Value from Contract = ",
          valueFromContract.toLocaleString("fullwide", {
            useGrouping: false,
          })
        );

        //valueFromContract = previousReserveBalance - newReserveBalance
        await assert.equal(
          previousReserveBalance
            .sub(newReserveBalance)
            .toLocaleString("fullwide", { useGrouping: false }),
          valueFromContract.toLocaleString("fullwide", { useGrouping: false })
        );
      });

      it("Transfers the dense coin", async () => {
        await loadFixture(deployFixtures);

        //TESTING
        let _balance = await carbonCredits.balanceOf(addr1.address, id);
        console.log("balance before buying", _balance);

        //calling buy function to have some balance of tokens
        carbonCreditDEX.buy(
          id,
          addr1.address,
          _depositAmount.toLocaleString("fullwide", { useGrouping: false }),
          0x0
        );

        //TESTING
        _balance = await carbonCredits.balanceOf(addr1.address, id);
        console.log("balance before burning", _balance);

        //checking Transfer event from sustainabilityCoin
        await expect(
          carbonCreditDEX
            .connect(addr1)
            .sell(
              id,
              _sellAmount.toLocaleString("fullwide", { useGrouping: false })
            )
        ).to.emit(sustainabilityCoin, "Transfer");
      });
    });

    describe("CalculateSaleReturn", function () {
      it("Calculation is right", async () => {
        await loadFixture(deployFixtures);

        //calculating the amount of money we get from selling
        let valueFromCalculation = await carbonCreditDEX.calculateSaleReturn(
          id,
          _sellAmount.toLocaleString("fullwide", { useGrouping: false })
        );

        //calling sell function
        await carbonCreditDEX.sell(
          id,
          _sellAmount.toLocaleString("fullwide", { useGrouping: false })
        );

        //getting the ACTUAL AMOUNT transfered to seller from contract from selling
        let valueFromContract = await carbonCreditDEX.amount();

        assert.equal(
          valueFromContract.toLocaleString("fullwide", {
            useGrouping: false,
          }),
          valueFromCalculation.toLocaleString("fullwide", {
            useGrouping: false,
          })
        );
      });
    });

    describe("getRating", function () {
      //NOTE: CURRENTLY DUMMY LOGIC
      it("returns the correct rating", async () => {
        await loadFixture(deployFixtures);

        let valueFromContract = await carbonCreditDEX.getRating(id);

        //TESTING
        console.log("rating value from contract = ", valueFromContract);

        //since currently DUMMY LOGIC is used for rating, we are hardcoding the value
        let _rating = 10;

        assert.equal(
          valueFromContract.toLocaleString("fullwide", {
            useGrouping: false,
          }),
          _rating
        );
      });
    });

    describe("getPrice", function () {
      it("returns the correct price", async () => {
        await loadFixture(deployFixtures);

        //calculating and getting various values neeeded to determine price
        let _reserveBalance = (initialSupply * initialPrice * rr) / 1e18;
        let _supply = await carbonCredits.totalSupply(id);
        let _price = (_reserveBalance * 1e18) / (_supply * rr);

        //TESTING
        console.log("_reserveBalance = ", _reserveBalance);
        console.log("supply = ", _supply);

        let valueFromContract = await carbonCreditDEX.getPrice(id);

        assert.equal(valueFromContract, _price);
      });
    });

    describe("getPortfolio", function () {
      it("returns the correct portfolio", async () => {
        await loadFixture(deployFixtures);

        //creating new player with id = 5

        //setting parameters
        let _rr = 300_000,
          _id = 5;
        _fee = 4;
        let _initialSupply = 1_000e18;
        let _initialPrice = ethers.utils.parseEther("0.000000001");
        //creating new player
        await carbonCreditDEX.connect(deployer).createNewIndustry(
          _id,
          _fee,
          _initialSupply.toLocaleString("fullwide", {
            useGrouping: false,
          }),
          _initialPrice.toLocaleString("fullwide", {
            useGrouping: false,
          }),
          _rr,
          0x0
        );

        //buying id=2 tokens to deployer
        await carbonCreditDEX
          .connect(deployer)
          .buy(
            _id,
            deployer.address,
            _depositAmount.toLocaleString("fullwide", { useGrouping: false }),
            0x0
          );

        //buying id=3 tokens to deployer
        await carbonCreditDEX
          .connect(deployer)
          .buy(
            id,
            deployer.address,
            _depositAmount.toLocaleString("fullwide", { useGrouping: false }),
            0x0
          );

        //getting the portfolio of deployer
        let valueFromContract = await carbonCredits.getPortfolio(
          deployer.address,
          [_id, id]
        );

        //getting the balance of deployer
        let _balance1 = await carbonCredits.balanceOf(deployer.address, _id);
        let _balance2 = await carbonCredits.balanceOf(deployer.address, id);

        //TESTING
        console.log("getPortfoliosOfBatch is successful");
        console.log("portfolio = ", valueFromContract);
        console.log(
          "deployer balance id=2 and id=3 are ",
          _balance1,
          _balance2
        );

        assert.equal(
          valueFromContract[0].toLocaleString("fullwide", {
            useGrouping: false,
          }),
          _balance1.toLocaleString("fullwide", { useGrouping: false })
        );
      });
    });
  });
});
