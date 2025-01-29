import React, { useState, useEffect } from 'react';

function App() {
  const [people, setPeople] = useState([]);
  const [skills, setSkills] = useState({}); // Store skill data for each person
  const commonSkills = [
    'Application of Typography',
    'Applying Color Theory',
    'Creation of Brands',
    'Creating User Personas',
    'Creating Effective Icons',
    'Conducting Usability Tests',
    'Gathering User Feedback',
    'Creating Effective Surveys',
    'Crafting Effective Questions',
    'Conducting Market Research',
    'Using Figma for Design',
    'Designing Responsive Interactions',
    'Designing Functional Micro-Interactions',
    'Designing User Flows',
    'Creating Sitemaps',
    'Creating Basic Prototypes',
    'Creating Wireframes',
  ];

  useEffect(() => {
    // Fetch the list of people
    fetch('https://forinterview.onrender.com/people')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched people data:', data); // Debug log
        setPeople(data);
      });
  }, []);

  const handleAddSkills = (id) => {
    // Fetch skill data for the person with the given ID
    fetch(`https://forinterview.onrender.com/people/${id}`)
      .then(response => response.json())
      .then(data => {
        console.log(`Fetched skill data for person ${id}:`, data); // Debug log

        // Ensure skillset data exists and extract it
        const personSkills = data.data?.data?.skillset?.map((skill) => {
          // Handle the case where the skills array may contain multiple skills
          return skill.skills?.map((specificSkill) => ({
            name: specificSkill.name,
            score: specificSkill.pos?.[0]?.consensus_score, // Extract the consensus score
          }));
        }).flat() || []; // Default to an empty array if no skills are found

        setSkills(prevSkills => ({ ...prevSkills, [id]: personSkills }));
      });
  };

  // Function to generate heatmap color based on consensus score (green color scale)
  const getHeatmapColor = (score) => {
    // Score 0 -> light green, Score 4 -> dark green
    const green = Math.min(255, Math.max(0, 255 - score * 60)); // Range from 255 (light) to 0 (dark)
    const red = 0; // Keep red component at 0
    const blue = 0; // Keep blue component at 0
    return `rgb(${red}, ${green}, ${blue})`;
  };

  return (
    <div style={{ display: 'flex', padding: '20px' }}>
      {/* Left column: Table of people */}
      <div style={{ flex: 1, marginRight: '20px' }}>
        <h2>People</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '2px solid #ccc', padding: '10px' }}>Name</th>
              <th style={{ borderBottom: '2px solid #ccc', padding: '10px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {people.map(person => (
              <tr key={person.id}>
                <td style={{ padding: '10px' }}>{person.name}</td>
                <td style={{ padding: '10px' }}>
                  <button
                    onClick={() => handleAddSkills(person.id)}
                    style={{ padding: '5px 10px' }}
                  >
                    +
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Right column: Display skill data */}
      <div style={{ display: 'flex', flexWrap: 'wrap', flex: 2 }}>
        {/* Display the first column for skills */}
        <div style={{ width: '200px', marginRight: '10px' }}>
          <h3>Skills</h3>
          <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
            {commonSkills.map((skill, index) => (
              <li key={index} style={{ padding: '5px 0' }}>
                {skill}
              </li>
            ))}
          </ul>
        </div>

        {/* Display the heatmap columns for each person */}
        {Object.entries(skills).map(([id, personSkills]) => (
          <div
            key={id}
            style={{
              width: '100px',
              margin: '10px',
              padding: '10px',
              border: '1px solid #ccc',
            }}
          >
            <h3>{people.find(person => person.id === id)?.name}</h3>
            <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
              {personSkills.map((skill, index) => (
                <li
                  key={index}
                  style={{
                    backgroundColor: getHeatmapColor(skill.score),
                    padding: '5px',
                    marginBottom: '5px',
                  }}
                >
                  {skill.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
