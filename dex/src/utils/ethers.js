import { ethers } from 'ethers';

const getContractInstance = async () => {
  // Initialize ethers provider
  const provider = new ethers.providers.JsonRpcProvider('https://eth-sepolia-public.unifra.io/'); // Replace with your Ethereum node URL

  // Load contract ABI and address
  const contractABI = require('../contracts/CarbonCreditDEX.json').abi;
  const contractAddress = '0xce890031711cd9A080dA5f4Fde93dF2725C03608'; // Replace with your actual contract address

  // Create contract instance
  const contractInstance = new ethers.Contract(contractAddress, contractABI, provider);

  return contractInstance;
};

const getProvider = async () => {
  // Check if MetaMask is available
  if (window.ethereum) {
    await window.ethereum.enable(); // Request access to the user's MetaMask accounts
    return new ethers.providers.Web3Provider(window.ethereum);
  } else {
    console.error('MetaMask is not available');
    return null;
  }
};

export const connectToMetamask = async () => {
  try {
    // Check if MetaMask is available
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' }); // Request access to the user's MetaMask accounts
      return provider.getSigner();
    } else {
      console.error('MetaMask is not available');
      return null;
    }
  } catch (error) {
    console.error('Error connecting to MetaMask:', error);
    return null;
  }
};


export { getContractInstance};
