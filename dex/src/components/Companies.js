import React from 'react';
import Companies from "../Companies.json"

const HandleCompanies = () => {
  // Dummy data for companies (replace with your actual data)

  const storedCompanies = localStorage.getItem('Company');
  const companiesFromStorage = storedCompanies ? JSON.parse(storedCompanies) : [];

  const companies = [
    ...companiesFromStorage,
    {
      id : 1,
      organization: 'SunGard Data Systems Inc.',
      description: "SunGard Data Systems Inc. is a power and energy company that provides innovative solutions for the industry's data management needs.",
      category : 'Energy and Power Generation'
    }
      
    // Add more companies here...
  ];

  console.log(companies);

  function getRandomInteger(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  let imageId = getRandomInteger(1, 3);

  console.log(imageId, "---------", Companies[imageId].imager_URL);


  return (
    <div className="companies-container">
      {companies.map((company) => (
        <div key={company.id} className="company-banner">
          <img src={Companies[company.id%10].imager_URL} alt={company.name} />
          <h2>{company.organization}</h2>
          <h3>{company.category}</h3>
          <p>{company.description}</p>
        </div>
      ))}
    </div>
  );
};

export default HandleCompanies;
