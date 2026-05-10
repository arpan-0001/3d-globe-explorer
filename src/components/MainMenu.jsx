import React from 'react';
import './MainMenu.css';

const MainMenu = ({ onSelect }) => {
  return (
    <div className="landing-container">
      <h1 className="title">Welcome to the Space Explorer</h1>
      <div className="options">
        <div className="card" onClick={() => onSelect('globe')}>
          <h2>🌍 Earth Globe View</h2>
          <p>See countries and locations on a rotating Earth</p>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;
