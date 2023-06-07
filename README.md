# About(mohit)

EcoChain is a transformative blockchain-based platform for the carbon credits marketplace. It leverages blockchain's transparency and smart contract efficiency to ensure verifiable, secure transactions. Our unique model offers standardized, industry-specific carbon credits on a unified trading platform, enhancing price transparency and market accessibility. EcoChain aims to propel the carbon market forward and drive global sustainability. Join us in our journey to streamline the carbon market and accelerate the world's transition towards sustainable development!

# Run the Repo Locally(Adidev)

## File Structure (Mohith)

Our repository is organized as follows:

- **contracts**: This directory contains all the Solidity smart contracts that underpin EcoChain. These contracts define the mechanisms for carbon-credit creation, management and the trading platform logic.

- **deploy**: This directory is home to scripts designed for deploying our smart contracts to the Ethereum network. Post-deployment, these scripts carry out necessary transactions to configure the platform ready for use.

- **tests**: This directory houses a suite of tests intended to verify the functionality of our smart contracts. The tests ensure EcoChain's robustness and reliability by checking edge cases and critical functionalities.

Please refer to individual directories for a more detailed understanding of EcoChain.

# User Flow Diagram(Adidev)

<iframe src="https://www.canva.com/design/DAFlm4x1e24/cly-U1mSgSpEArQnSXDwVQ/view?utm_content=DAFlm4x1e24&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink" width="100%" height="500px"></iframe>

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
   cd ..
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

2. **Deploying Smart Contracts on the local network**: To deploy the smart contracts on your local network, run the following command in your terminal:

   ```shell
   npx hardhat deploy
   ```

   You should see the deployment scripts running, indicating that the contracts are being deployed on the local network.

3. **Deploying Smart Contracts on the Sepolia Testnet**: If you want to deploy the smart contracts on the Sepolia Testnet, you need to run the following command:

   ```shell
   npx hardhat deploy --network sepolia
   ```

   This will deploy the smart contracts on the Sepolia Testnet. Please ensure that you have the necessary testnet Ether for deployment.

Remember to replace the PRIVATE_KEY and ACCOUNT_ADDRESS in your `.env` file with your own details that you're going to use when deploying to any testnet or the mainnet.

Enjoy building with EcoChain!
