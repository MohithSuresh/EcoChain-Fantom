import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import {getContractInstance, connectToMetamask} from '../utils/sbtEthers';
import { getCarbonCreditContractInstance} from '../utils/carbonCredit';
import { BigNumber, ethers } from 'ethers';


const VerifyOrganizationForm = (props) => {

  const { address, isConnected } = props;

  const [contractInstanceCarbon, setContractInstanceCarbon] = useState(null);
  const [contractInstance, setContractInstance] = useState(null);
  const [organization, setOrganization] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state
  const [CarbonCredit, setCarbonCredit] = useState(0);
  const [Minting, setMinting] = useState(0);
  const [toMintSBT,  setToMintSBT] = useState(false);
  const [toMintCarbon, setToMintCarbon] = useState(false);
  const [MintingCarbon, setMintingCarbon] = useState(false);
  const [CategoryId, SetCategoryId] = useState(0);

  const handleCarbonCreditChange = (e) =>{
    setCarbonCredit(e.target.value);
  }

  const handleOrganizationChange = (e) => {
    setOrganization(e.target.value);
  };

  const handleCategoryChange =  (e) => {
    console.log("1", e.target.value);
    setCategory(e.target.value);
    compareCategory(e.target.value)
    console.log("2", category);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    console.log(description)
  };

  const handleCertificateChange = (e) => {
    setCertificate(e.target.files[0]);
  };

  function compareCategory(category){

    if (category === "Waste Management"){
      SetCategoryId(1)
    }
    else if (category === "Energy and Power Generation"){
      SetCategoryId(2)
    }
    else if (category === "Transportation"){
      SetCategoryId(3)
    }
    else if (category === "Forestry and Land Use"){
      SetCategoryId(4)
    }
    else if (category === "Buildings and Construction"){
      SetCategoryId(5)
    }
    else if (category === "Agriculture"){
      SetCategoryId(6)
    }
  }

  async function MintSBTs() {

    // compareCategory();
    // Perform the minting operation here
    // Set Minting state to true while minting is in progress

    try {
      if (!contractInstance) {
        console.error('Contract instance not initialized');
        return;
      }
  
      const currentDate = new Date();

      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
  
      const dateString = `${year}-${month}-${day}`;

      // Check if MetaMask is installed and connected
      if (window.ethereum && isConnected) {
        // Request user account access through MetaMask
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
  
        // Prepare the transaction data for the mint function
        const mintFunctionData = contractInstance.interface.encodeFunctionData('mint', [
          address,
          organization,
          CarbonCredit,
          description,
          dateString,
          CategoryId,
        ]);
  
        // Prepare the transaction object
        const transactionObject = {
          to: contractInstance.address,
          data: mintFunctionData,
          value: ethers.utils.parseEther('0'), // Replace with the desired value if necessary
        };
  
        // Sign and send the transaction using MetaMask
        const transactionResponse = await signer.sendTransaction(transactionObject);
        const transactionReceipt = await transactionResponse.wait();

        console.log('Transaction successful:', transactionReceipt);

        setMinting(true);

        setTimeout(() => {
          setMinting(false);
          setToMintCarbon(true);
        }, 3000);
      } else {
        console.error('MetaMask not found or not connected');
      }
    } catch (error) {
      console.error('Error executing transaction:', error);
    }

  }

  async function MintCarbon(){

    try {
      if (!contractInstanceCarbon) {
        console.error('Contract instance not initialized');
        return;
      }

      // Check if MetaMask is installed and connected
      if (window.ethereum && isConnected) {
        // Request user account access through MetaMask
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
  
        // Prepare the transaction data for the mint function
        const mintFunctionData = contractInstanceCarbon.interface.encodeFunctionData('mint', [
          address,
          CategoryId,
          CarbonCredit,
          ethers.constants.HashZero,
        ]);
  
        // Prepare the transaction object
        const transactionObject = {
          to: contractInstanceCarbon.address,
          data: mintFunctionData,
          value: ethers.utils.parseEther('0'), // Replace with the desired value if necessary
        };
  
        // Sign and send the transaction using MetaMask
        const transactionResponse = await signer.sendTransaction(transactionObject);
        const transactionReceipt = await transactionResponse.wait();

        console.log('Transaction successful:', transactionReceipt);

        setMintingCarbon(true);

        setTimeout(() => {
          setMintingCarbon(false);
        }, 3000);
      } else {
        console.error('MetaMask not found or not connected');
      }
    } catch (error) {
      console.error('Error executing transaction:', error);
    }


  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsLoading(true); // Set isLoading to true

    // Simulate an API call with a delay
    setTimeout(() => {
      const existingData = JSON.parse(localStorage.getItem('Company')) || [];

      function getRandomInteger(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      let id = getRandomInteger(1, 100000);

      // Create a new form object
      const formData = {
        id,
        organization,
        description,
        category,
      };

      // Append the new form data to the existing array
      existingData.push(formData);

      // Store the updated array back in localStorage
      localStorage.setItem('Company', JSON.stringify(existingData));

      // Clear the form fields
      setOrganization('');
      setCategory('');
      setDescription('');

      setIsLoading(false); // Set isLoading back to false
      setToMintSBT(true);
    }, 6000); // Delay of 2 seconds (adjust as needed);
  };

  useEffect(()=>{

    const loadWallet = async () => {
      // Connect to MetaMask
      const signer = await connectToMetamask();
      if (!signer) return;
    }

    const initializeContract = async () => {
      try {
        const instance = await getContractInstance();
        setContractInstance(instance);
      } catch (error) {
        console.error('Error initializing contract', error);
      }
    };

    const initializeCarbonContract = async () => {
      try {
        const instance = await getCarbonCreditContractInstance();
          setContractInstanceCarbon(instance);
      } catch (error) {
        console.error('Error initializing contract', error);
      }
    };

    initializeContract();
    initializeCarbonContract();
    loadWallet();

    if (toMintSBT) {
      // compareCategory();
      MintSBTs();
      setToMintSBT(false);
    }

    if (toMintCarbon) {
      MintCarbon();
      setToMintCarbon(false);
    }

  }, [toMintSBT, toMintCarbon, category])

  if (isLoading) {
    // Render the loading page while isLoading is true
    return (
      <div className="loading-container">
        <ClipLoader color="#ffffff"  size={50} />
        <h1>Verifying</h1>
      </div>
    );
  }

  if (Minting){
    return (
      <div className="loading-container">
        <ClipLoader color="#ffffff"  size={50} />
        <h1>Minting SBTs to your account </h1>
      </div>
    );
  }

  if (MintingCarbon){
    return (
      <div className="loading-container">
        <ClipLoader color="#ffffff"  size={50} />
        <h1>Minting Carbon Tokens to your account </h1>
      </div>
    );
  }


  return (
    <form onSubmit={handleSubmit}  className="form-container">
      <div>
        <label htmlFor="organization" style={{ fontSize: '20px', fontWeight: 'bold' }} >Name of Organization </label>
        <input
          type="text"
          id="organization"
          value={organization}
          onChange={handleOrganizationChange}
          style={{ fontSize: '15px', fontWeight: 'bold', width : '380px' }}
        />
      </div>
      <div>
        <label htmlFor="category" style={{ fontSize: '20px', fontWeight: 'bold' }}>Industry</label>
        <select
          id="category"
          value={category}
          onChange={handleCategoryChange}
          style={{ fontSize: '15px', fontWeight: 'bold' }}
        >
          <option value="">Select Category</option>
          <option value="Waste Management">Waste Management</option>
          <option value="Energy and Power Generation">Energy and Power Generation</option>
          <option value="Transportation">Transportation</option>
          <option value="Forestry and Land Use">Forestry and Land Use</option>
          <option value="Buildings and Construction">Buildings and Construction</option>
          <option value="Agriculture">Agriculture</option>
        </select>
      </div>
      <div>
        <label htmlFor="description" style={{ fontSize: '20px', fontWeight: 'bold' }}>Description of Organization</label>
        <textarea
          id="description"
          value={description}
          onChange={handleDescriptionChange}
          style={{ fontSize: '20px', fontWeight: 'bold', height: '90px', width:'380px'  }}
        ></textarea>
      </div>

      <div>
        <label htmlFor="organization" style={{ fontSize: '20px', fontWeight: 'bold' }} > Carbon Credits Required </label>
        <input
          type="text"
          id="organization"
          value={CarbonCredit}
          onChange={handleCarbonCreditChange}
          style={{ fontSize: '15px', fontWeight: 'bold', width : '380px' }}
        />
      </div>

      <div>
        <label htmlFor="certificate" style={{ fontSize: '20px', fontWeight: 'bold' }}>Upload Certificate</label>
        <input
          type="file"
          id="certificate"
          accept=".pdf"
          onChange={handleCertificateChange}
          style={{ fontSize: '20px', fontWeight: 'bold' }}
        />
        {certificate && <p>Selected certificate: {certificate.name}</p>}
      </div>
      <button type="submit" style={{ fontSize: '20px', fontWeight: 'bold' }} disabled={!organization || !description || !category || !certificate || !CarbonCredit}>
        Submit
      </button>
    </form>
  );
};

export default VerifyOrganizationForm;
