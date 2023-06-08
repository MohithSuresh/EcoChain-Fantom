import React from "react";
import Logo from "../OhebTvWUlzsiooY.png";
import Eth from "../eth.svg";
import { Link } from "react-router-dom";
import  {useState, useEffect } from "react";
import { ethers } from 'ethers';


function Header(props) {

  const {address, isConnected, connect} = props;
  const [resolvedNetwork, setResolvedNetwork] = useState(null);

  const fetchNetworkName = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      return network.name;
    } catch (error) {
      console.error('Error fetching network name:', error);
      return null;
    }
  };

  useEffect(() => {
    const updateNetworkName = async () => {
      const networkName = await fetchNetworkName();
      setResolvedNetwork(networkName);
    };

    updateNetworkName();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    window.ethereum.on("networkChanged", async () => {
      updateNetworkName();
    });

    return () => {
      window.ethereum.removeListener("networkChanged", () => {
        updateNetworkName();
      });
    };
  }, []);

  return (
    <header>
      <div className="leftH">
        <img src={Logo} width="3000" height="5000" alt="logo" className="logo" />
        <Link to="/" className="link">
          <div className="headerItem">Swap</div>
        </Link>
        <Link to="/tokens" className="link">
          <div className="headerItem">Carbon Credits</div>
        </Link>
        <Link to="/companies" className="link">
          <div className="headerItem">Verified Companies</div>
        </Link>
        <Link to="/auth_orgs" className="link">
          <div className="headerItem">Authorized Organizations</div>
        </Link>
      </div>
      <div className="rightH">
        <div className="headerItem">
          <img src={Eth} alt="eth" className="eth" />
          {resolvedNetwork}
        </div>
        <div className="connectButton" onClick={connect}>
          {isConnected ? (address.slice(0,4) +"..." +address.slice(38)) : "Connect"}
        </div>
      </div>
    </header>
  );
}

export default Header;
