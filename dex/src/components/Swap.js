import { BigNumber, ethers } from 'ethers';
import React, { useState, useEffect } from "react";
import { Input, Popover, Radio, Modal, message } from "antd";
import {
  ArrowDownOutlined,
  DownOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {getContractInstance, connectToMetamask} from '../utils/ethers';
import CarbonCreditDEX from '../contracts/CarbonCreditDEX.json'; 
import CarbontokenList from "../CarbontokenList.json";
import SustainibilityToken from "../SustainibilityToken.json";
import axios from "axios";
import { useSendTransaction, useWaitForTransaction } from "wagmi";
const bigInt = require('big-integer');



function Swap(props) {
  const { address, isConnected } = props;


  const [contractInstance, setContractInstance] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [slippage, setSlippage] = useState(2.5);
  const [tokenOneAmount, setTokenOneAmount] = useState(null);
  const [tokenTwoAmount, setTokenTwoAmount] = useState(null);
  const [tokenOne, setTokenOne] = useState(CarbontokenList[0]);
  const [tokenTwo, setTokenTwo] = useState(SustainibilityToken);
  const [isOpen, setIsOpen] = useState(false);
  const [changeToken, setChangeToken] = useState(1);
  const [prices, setPrices] = useState(null);
  const [txDetails, setTxDetails] = useState({
    to:null,
    data: null,
    value: null,
  }); 

  const {data, sendTransaction} = useSendTransaction({
    request: {
      from: address,
      to: String(txDetails.to),
      data: String(txDetails.data),
      value: String(txDetails.value),
    }
  })

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  function handleSlippageChange(e) {
    setSlippage(e.target.value);
  }

  async function changeAmount(e) {
    if(tokenOne.hasOwnProperty("id")){
      console.log(tokenOne, "---------", tokenTwo);
      let noOfToken = e.target.value;
      setTokenOneAmount(noOfToken);
    }

    if(!tokenOne.hasOwnProperty("id")){
      console.log(e.target.value)
      let noOfToken = e.target.value;
      setTokenOneAmount(noOfToken);
    }
  }

  function switchTokens() {
    setPrices(null);
    setTokenOneAmount(null);
    setTokenTwoAmount(null);
    const one = tokenOne;
    const two = tokenTwo;
    setTokenOne(two);
    setTokenTwo(one);
  }

  function openModal(asset) {
    setChangeToken(asset);
    setIsOpen(true);
  }

  function modifyToken(i){
    setPrices(null);
    setTokenOneAmount(null);
    setTokenTwoAmount(null);
    if (changeToken === 1) {
      setTokenOne(CarbontokenList[i]);
      setTokenTwo(SustainibilityToken);
    } else {
      setTokenTwo(CarbontokenList[i]);
      setTokenOne(SustainibilityToken);
    }
    setIsOpen(false);
  }

  async function SustainibilityToCarbon(one, two){
      try {
        if (!contractInstance) {
          console.error('Contract instance not initialized');
          return;
        }
        // tok1-> sus
        // tok2-> carbon
        const SusTokNum = ethers.BigNumber.from(tokenOneAmount)
        const result = await contractInstance.calculatePurchaseReturn(tokenTwo.id, SusTokNum);
        let CarbonCoinsReceived = ethers.BigNumber.from(result._hex);
        setTokenTwoAmount(CarbonCoinsReceived);
      } catch (error) {
        console.error('Error calling contract method:', error);
      }
  }

  async function CarbonToSustainibility(one, two){
    try {
      if (!contractInstance) {
        console.error('Contract instance not initialized');
        return;
      }
      // tok1-> carbon
      // tok2-> sus
      const CarbonTokNum = ethers.BigNumber.from(tokenOneAmount)
      const result = await contractInstance.calculateSaleReturn(tokenOne.id, CarbonTokNum);
      let SusCoinsReceived = ethers.BigNumber.from(result._hex);
      setTokenTwoAmount(SusCoinsReceived);
    } catch (error) {
      console.error('Error calling contract method:', error);
    }
}

  async function fetchDexSwap(){

    if(tokenOne.hasOwnProperty("id")){

      try {
        if (!contractInstance) {
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
    
          // Prepare the transaction data for the buy function
          const sellFunctionData = contractInstance.interface.encodeFunctionData('sell', [
            tokenOne.id,
            tokenOneAmount,
          ]);
    
          // Prepare the transaction object
          const transactionObject = {
            to: contractInstance.address,
            data: sellFunctionData,
            value: ethers.utils.parseEther('0'), // Replace with the desired value if necessary
          };
    
          // Sign and send the transaction using MetaMask
          const transactionResponse = await signer.sendTransaction(transactionObject);
          const transactionReceipt = await transactionResponse.wait();
    
          console.log('Transaction successful:', transactionReceipt);
        } else {
          console.error('MetaMask not found or not connected');
        }
      } catch (error) {
        console.error('Error executing transaction:', error);
      }

    }

    if(!tokenOne.hasOwnProperty("id")){

      try {
        if (!contractInstance) {
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
    
          // Prepare the transaction data for the buy function
          const buyFunctionData = contractInstance.interface.encodeFunctionData('buy', [
            tokenTwo.id,
            address,
            tokenOneAmount,
            ethers.constants.HashZero, // Replace null with your desired value for the 'data' parameter
          ]);
    
          // Prepare the transaction object
          const transactionObject = {
            to: contractInstance.address,
            data: buyFunctionData,
            value: ethers.utils.parseEther('0'), // Replace with the desired value if necessary
          };
    
          // Sign and send the transaction using MetaMask
          const transactionResponse = await signer.sendTransaction(transactionObject);
          const transactionReceipt = await transactionResponse.wait();
    
          console.log('Transaction successful:', transactionReceipt);
        } else {
          console.error('MetaMask not found or not connected');
        }
      } catch (error) {
        console.error('Error executing transaction:', error);
      }

    }

  }


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

    initializeContract();
    loadWallet();

    if (!tokenOne.hasOwnProperty("id")) {
      SustainibilityToCarbon(tokenOne, tokenTwo);
    }

    if(tokenOne.hasOwnProperty("id")){
      CarbonToSustainibility(tokenOne, tokenTwo);
    }

  }, [tokenOneAmount, tokenTwoAmount, tokenOne, tokenTwo]);

  useEffect(()=>{

      if(txDetails.to && isConnected){
        sendTransaction();
      }
  }, [txDetails])

  useEffect(()=>{

    messageApi.destroy();

    if(isLoading){
      messageApi.open({
        type: 'loading',
        content: 'Transaction is Pending...',
        duration: 0,
      })
    }    

  },[isLoading])

  useEffect(()=>{
    messageApi.destroy();
    if(isSuccess){
      messageApi.open({
        type: 'success',
        content: 'Transaction Successful',
        duration: 1.5,
      })
    }else if(txDetails.to){
      messageApi.open({
        type: 'error',
        content: 'Transaction Failed',
        duration: 1.50,
      })
    }


  },[isSuccess])


  const settings = (
    <>
      <div>Slippage Tolerance</div>
      <div>
        <Radio.Group value={slippage} onChange={handleSlippageChange}>
          <Radio.Button value={0.5}>0.5%</Radio.Button>
          <Radio.Button value={2.5}>2.5%</Radio.Button>
          <Radio.Button value={5}>5.0%</Radio.Button>
        </Radio.Group>
      </div>
    </>
  );

  return (
    <>
      {contextHolder}
      <Modal
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
        title="Select a token"
      >
        <div className="modalContent">
          {CarbontokenList?.map((e, i) => {
            return (
              <div
                className="tokenChoice"
                key={i}
                onClick={() => modifyToken(i)}
              >
                <img src={e.img} alt={e.ticker} className="tokenLogo" />
                <div className="tokenChoiceNames">
                  <div className="tokenName">{e.name}</div>
                  <div className="tokenTicker">{e.ticker}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
      <div className="tradeBox">
        <div className="tradeBoxHeader">
          <h4>Swap</h4>
          <Popover
            content={settings}
            title="Settings"
            trigger="click"
            placement="bottomRight"
          >
            <SettingOutlined className="cog" />
          </Popover>
        </div>
        <div className="inputs">
          <Input
            placeholder="0"
            onChange={changeAmount}
            
            // disabled={!prices}
          />
          <Input placeholder="0" value={tokenTwoAmount} disabled={true} />
          <div className="switchButton" onClick={switchTokens}>
            <ArrowDownOutlined className="switchArrow" />
          </div>
          <div className="assetOne" onClick={() => openModal(1)}>
            <img src={tokenOne.img} alt="assetOneLogo" className="assetLogo" />
            {tokenOne.ticker}
            <DownOutlined />
          </div>
          <div className="assetTwo" onClick={() => openModal(2)}>
            <img src={tokenTwo.img} alt="assetOneLogo" className="assetLogo" />
            {tokenTwo.ticker}
            <DownOutlined />
          </div>
        </div>
        <div className="swapButton" disabled={!tokenOneAmount || !isConnected} onClick={fetchDexSwap}>Swap</div>
      </div>
    </>
  );
}

export default Swap;
