import React, { useState, useEffect } from 'react';

function AuthorizedOrgs() {

  const companies = [
    {
      id : 1,
      url : "https://cdn.britannica.com/33/4833-004-828A9A84/Flag-United-States-of-America.jpg",
      organization: 'Environmental Protection Agency',
      description: "The EPA is a US federal agency that protects human health and the environment. It enforces environmental regulations, conducts research, and promotes sustainability to address pollution and climate change.",
      country : 'United States of America'
    },
    {
      id : 2,
      url : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJYdbeo33oP_-2ej092c4fn1TnJZ50uMEB2w&usqp=CAU",
      organization: 'Environment Agency',
      description: "The Environment Agency is a regulatory body in the UK. It works to protect and improve the environment, including managing flood risks, regulating industries, and promoting sustainable practices for a greener future.",
      country : 'United Kingdom'
    }
      
    // Add more companies here...
  ];

  return (
    <div className="companies-container">
      {companies.map((company) => (
        <div key={company.id} className="company-banner">
          <img src={company.url} alt={company.name} width="200" height="150"/>
          <h2>{company.organization}</h2>
          <h3>{company.country}</h3>
          <p>{company.description}</p>
        </div>
      ))}
    </div>
  );

};

export default AuthorizedOrgs;