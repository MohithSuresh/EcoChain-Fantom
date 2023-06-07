import { ethers } from 'ethers';

const getCarbonCreditContractInstance = async () => {
  // Initialize ethers provider
  const provider = new ethers.providers.JsonRpcProvider('https://eth-sepolia-public.unifra.io/'); // Replace with your Ethereum node URL

  // Load contract ABI and address
  const contractABI = require('../contracts/CarbonCredits.json').abi;
  const contractAddress = '0x191bB131265246cF7EFc238755cbA14e0607eA7E'; // Replace with your actual contract address

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


export { getCarbonCreditContractInstance};
