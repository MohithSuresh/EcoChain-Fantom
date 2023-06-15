# About

EcoChain is a transformative blockchain-based platform for the carbon credits marketplace. It leverages blockchain's transparency and smart contract efficiency to ensure verifiable, secure transactions. Our unique model offers standardized, industry-specific carbon credits on a unified trading platform, enhancing price transparency and market accessibility. EcoChain aims to propel the carbon market forward and drive global sustainability. Join us in our journey to streamline the carbon market and accelerate the world's transition towards sustainable development!

# Technologies Used

Several advanced technologies have been utilised in this project to provide a seamless and efficient system for carbon credits certification and trading:

- **Soul-Bound Tokens (SBT)**: We used Soul-Bound Tokens as a verifiable certification system for carbon credits. This mechanism enhances the transparency and reliability in the carbon credits market.

- **Bancor Formula**: We have implemented a Decentralized Exchange (DEX) using the Bancor formula. This DEX houses liquidity pools, enabling efficient trading of carbon credit tokens.

- **Chainlink**: We used Chainlink functions for burning SBT (used as a carbon credit issue certificate) and minting the appropriate type and amount of carbon credit tokens for that account. This functionality helps maintain a fair and balanced carbon credits ecosystem.

- **ERC1155 Tokens**: Different types of carbon credit tokens are maintained using the ERC1155 token standard. This multi-token standard allows us to efficiently manage, transfer, and trade a variety of carbon credits within a single contract.

- **ERC20 Sustainability Coin**: We are using the ERC20 Sustainability Coin as the platform's native token. This token serves several functions, including incentivizing specific activities and facilitating token swaps.

# Use the Hosted Site

To fully leverage the functionality of EcoChain, you need to import a Metamask account using a provided private key. This gives you access to operations like swapping tokens, minting new tokens, and creating new institutes and companies.

### Step 1: Import Metamask Account

Import a Metamask account with the following private key:

```plaintext
   PRIVATE_KEY=c9b614607cb9e77dd574f66eb01ac0d23d967b1b91aa721f2d077716d555793c
```

### Step 2: Use EcoChain Functionality

Once you've imported the Metamask account, you'll be able to access all of EcoChain's features, including:

- Swapping tokens
- Minting new tokens
- Creating new institutes
- Creating new companies

The private key of MetaMask account has been provided in order to facilitate a smooth and efficient testing process for the hackathon. By granting access to the private key, you are granted special permissions such as utilizing the sepoliaETH faucet for testing transactions, as well as the ability to create new institutes and companies without having to go through the lengthy approval process typically required when using one's own wallet. This enables participants to quickly engage in the testing phase and fully explore the capabilities of the platform during the hackathon.

### Step 3: Visit the EcoChain Website

Finally, to start using EcoChain, visit our site at:

[EcoChain_Demo_Site](https://adidev-kgp.github.io/credit_le_dense_frontend/)

## File Structure

Our repository is organized as follows:

- **contracts**: This directory contains all the Solidity smart contracts that underpin EcoChain. These contracts define the mechanisms for carbon-credit creation, management and the trading platform logic.

- **deploy**: This directory is home to scripts designed for deploying our smart contracts to the Ethereum network. Post-deployment, these scripts carry out necessary transactions to configure the platform ready for use.

- **tests**: This directory houses a suite of tests intended to verify the functionality of our smart contracts. The tests ensure EcoChain's robustness and reliability by checking edge cases and critical functionalities.

- **dex**: This directory has the entire frontend code

Please refer to individual directories for a more detailed understanding of EcoChain.

# User Flow Diagram

![Image1](/dex/public/UFC1.png)
![Image2](/dex/public/UFC2.png)
![Image3](/dex/public/UFC3.png)
![Image4](/dex/public/UFC4.png)

<!-- <iframe src="https://www.canva.com/design/DAFlm4x1e24/cly-U1mSgSpEArQnSXDwVQ/view?utm_content=DAFlm4x1e24&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink" width="100%" height="500px"></iframe> -->

## Setting Up The Local Environment (without deploying new smart contracts)

Before proceeding, ensure that you have [MetaMask](https://metamask.io/) installed in your browser.

1. **Import account into MetaMask**: Click on the MetaMask extension icon in your browser and then click on the avatar in the top-right corner. Select "Import Account" from the dropdown. Enter the following private key when prompted:

   ```plaintext
   PRIVATE_KEY=c9b614607cb9e77dd574f66eb01ac0d23d967b1b91aa721f2d077716d555793c
   ```

   Once imported, this account will be your active account in MetaMask.

2. **Set network to Sepolia Testnet**: Ensure that MetaMask network is set to Sepolia Testnet. You can change the network by clicking on the network selection dropdown at the top of the MetaMask extension.

3. **Configure `.env` file**: Rename the `env.example` file in the root directory to `.env` and keep the data the same. This file will contain important configuration details for your local environment.

4. **Install dependencies in the root directory (EcoChain Folder)**: Navigate to the root directory in your terminal and run the following command:

   ```shell
   npm install
   ```

   This will install all necessary packages listed in the `package.json` file.

5. **Install dependencies in the dex directory**: Now, navigate to the dex directory and run the `npm install` command again:

   ```shell
   cd dex
   npm install
   ```

   This will install the dependencies needed for the dex component of our project.

6. **Start the project**: After all dependencies are installed, you can start the project using the `npm start` command in the root directory:

   ```shell
   npm start
   ```

   This will start the local development server, and you can view the project in your web browser.

Please note that you should have Node.js and npm installed on your system before running these commands. If not, you can download and install [Node.js and npm from here](https://nodejs.org/).

## Testing and Deploying Smart Contracts

Before running any testing or deploying commands, ensure that your `.env` file is configured correctly. You can use the same data as in `env.example` or modify it according to your requirements.

1. **Testing Smart Contracts**: To test the smart contracts, navigate to the root directory in your terminal and run the following command:

   ```shell
   npx hardhat test
   ```

   If everything is configured correctly, all tests should pass successfully.

![Image3](/dex/public/Tests.png)

2. **Deploying Smart Contracts on the Sepolia Testnet**: If you want to deploy the smart contracts on the Sepolia Testnet, you need to run the following command:

   ```shell
   npx hardhat deploy --network sepolia
   ```

   This will deploy the smart contracts on the Sepolia Testnet. Please ensure that you have the necessary testnet Ether for deployment.
   ![Image3](/dex/public/deploy.png)

Remember to replace the PRIVATE_KEY and ACCOUNT_ADDRESS in your `.env` file with your own details that you're going to use when deploying to any testnet or the mainnet.

## Running the project after deploying new smart contracts

1.  **Import your correct Ethereum node URL and contract address**:
    Inside `dex/src/utils` import the correct Ethereum node URL and contract address after deploying smart contracts. If you don't wish to deploy contract, you don't need to make changes to the code, things are already deployed but if you want to deploy on your own and test then follow these below steps:

    For carbonCredit.js

    ```
     const getCarbonCreditContractInstance = async () => {
     const provider = new ethers.providers.JsonRpcProvider('<Ethereum node URL>');

     const contractABI = require('../contracts/CarbonCredits.json').abi;
     const contractAddress = '<Actual address of deployed contract CarbonCredits>';

     const contractInstance = new ethers.Contract(contractAddress, contractABI, provider);

     return contractInstance;
    };

    ```

          For sbtEthers.js

    ```
     const getCarbonCreditContractInstance = async () => {
     const provider = new ethers.providers.JsonRpcProvider('<Ethereum node URL>');

     const contractABI = require('../contracts/SbtConvertible.json').abi;
     const contractAddress = '<Actual address of deployed contract SbtConvertible>';

     const contractInstance = new ethers.Contract(contractAddress, contractABI, provider);

     return contractInstance;
    };

    ```

          For ethers.js


    ```
     const getCarbonCreditContractInstance = async () => {
     const provider = new ethers.providers.JsonRpcProvider('<Ethereum node URL>');

     const contractABI = require('../contracts/CarbonCreditDEX.json').abi;
     const contractAddress = '<Actual address of deployed contract CarbonCreditDEX>';

     const contractInstance = new ethers.Contract(contractAddress, contractABI, provider);

     return contractInstance;
    };

    ```

2.  **Install dependencies**:

    ```
    cd dex/
    npm install
    ```

3.  **Running the project**:
    ```
    npm start
    ```

Enjoy building with EcoChain!
