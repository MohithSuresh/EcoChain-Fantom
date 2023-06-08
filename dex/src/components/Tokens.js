import React from 'react'
import Companies from "../Token.json"


function Tokens() {
  
  const companies = [
    {
      id : 1,
      organization: 'Waste Management Token',
      description: "Waste Management carbon credits drive sustainable waste practices, reducing emissions through recycling, renewable energy, and landfill gas capture.",
    },
    {
      id : 2,
      organization: 'Energy and Power Generation Token',
      description: "Energy and Power Generation carbon credits incentivize clean energy production, reducing emissions and promoting sustainability in the power sector.",
    },
    {
      id : 3,
      organization: 'Transportation Token',
      description: "Transportation carbon credits encourage emission reductions in the transportation sector, promoting cleaner fuels, energy-efficient vehicles, and sustainable transportation practices.",
    },
    {
      id : 4,
      organization: 'Forestry and Land Use Token',
      description: "Forestry and Land Use carbon credits promote conservation and sustainable land management, mitigating climate change through carbon sequestration and forest preservation efforts.",
    },
    {
      id : 5,
      organization: 'Buildings and Construction',
      description: "Buildings and Construction carbon credits encourage energy-efficient building design and construction practices, reducing emissions and promoting sustainable infrastructure in the built environment.",
    },
    {
      id : 6,
      organization: 'Agriculture',
      description: "Agriculture carbon credits incentivize sustainable farming practices, reducing emissions through improved soil management, livestock management, and carbon sequestration in agricultural landscapes.",
    }
  ];

  return (
    <div className="companies-container">
      {companies.map((company) => (
        <div key={company.id} className="company-banner">
          <img src={Companies[company.id - 1].imager_URL} style={{ width: '200px', height: '200px', borderRadius: '50%' }}  alt={company.name} />
          <h2>{company.organization}</h2>
          <p>{company.description}</p>
        </div>
      ))}
    </div>
  );

}

export default Tokens