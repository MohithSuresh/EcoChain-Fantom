import React from 'react';
import { Link } from "react-router-dom";


const Footer = () => {
  return (
    <footer>
      <div >
        <Link to="/verify" className="footer-content Link">
            <p>Get your company verified</p>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
