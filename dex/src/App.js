import "./App.css";
import Header from "./components/Header";
import Swap from "./components/Swap";
import Companies from "./components/Companies";
import Tokens from "./components/Tokens";
import Footer from "./components/Footer";
import VerifyOrganizationForm from "./components/Verify";
import AuthorizedOrgs from "./components/AuthorizedOrgs";
import { Routes, Route } from "react-router-dom";
import { useConnect, useAccount } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { useLocation } from 'react-router-dom';
import { ethers } from 'ethers';


function App() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });
  
  const location = useLocation();

  return (

    <div className="App">
      <Header connect={connect} isConnected={isConnected} address={address} />
      <div className="mainWindow">
        <Routes>
          <Route path="/" element={<Swap isConnected={isConnected} address={address} />} />
          <Route path="/tokens" element={<Tokens />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/verify" element={<VerifyOrganizationForm isConnected={isConnected} address={address}/>} />
          <Route path="/auth_orgs" element={<AuthorizedOrgs />} />
        </Routes>
      </div>
      {location.pathname !== '/verify' && <Footer />}

    </div>
  )
}

export default App;
