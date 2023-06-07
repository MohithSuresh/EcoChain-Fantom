import { ethers } from 'ethers';

const getContractInstance = async () => {
  // Initialize ethers provider
  const provider = new ethers.providers.JsonRpcProvider('https://eth-sepolia-public.unifra.io/'); // Replace with your Ethereum node URL

  // Load contract ABI and address
  const contractABI = require('../contracts/SbtConvertible.json').abi;
  const contractAddress = '0x53921a42AF687ea445A773A7137Ef1A692756389'; // Replace with your actual contract address

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
