// TutorialScreen.jsx
import React from 'react';
import './TutorialScreen.css';

const TutorialScreen = () => {
  return (
    <div className="tutorial-screen">
      <h1>🌍 Welcome to the Globe Viewer</h1>
      <p>Click on a country to explore its information.</p>
      <p>Use the dropdown to toggle borders and rotation modes.</p>
      <p>Loading experience in the background...</p>
    </div>
  );
};

export default TutorialScreen;
