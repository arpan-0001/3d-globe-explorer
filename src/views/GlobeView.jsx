import React from 'react';
// import './GlobeView.css';
import GlobeViewer from '../GlobeViewer';

const GlobeView = ({ onBack }) => {
  return (
    <div className="globe-container">
      <div className="back-button-wrapper">
        <button className="back-button" onClick={onBack}>🔙 Back</button>
      </div>

      <div className="globe-canvas-wrapper">
        <GlobeViewer />
      </div>
    </div>
  );
};


export default GlobeView;
