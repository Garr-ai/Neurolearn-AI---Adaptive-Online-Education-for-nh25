import React, { useState } from 'react';
import './Calibrate.css';

const Calibrate = ({ currentUser }) => {
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [baseline, setBaseline] = useState(null);

  const startCalibration = () => {
    setIsCalibrating(true);
    // Calibration logic would go here
    setTimeout(() => {
      setBaseline({
        focus: 50,
        load: 50,
        anomaly: 10
      });
      setIsCalibrating(false);
    }, 5000);
  };

  return (
    <div className="calibrate">
      <h2>Calibration</h2>
      <div className="card">
        <h3 className="card-title">Establish Baseline</h3>
        <p className="card-description">
          Sit comfortably and relax for 30 seconds. We'll measure your baseline
          brain activity to personalize your recommendations.
        </p>
        
        {!baseline ? (
          <div className="calibration-section">
            <button 
              className="button" 
              onClick={startCalibration}
              disabled={isCalibrating}
            >
              {isCalibrating ? 'Calibrating...' : 'Start Calibration'}
            </button>
            {isCalibrating && (
              <div className="calibration-progress">
                <div className="progress-bar">
                  <div className="progress-fill"></div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="baseline-results">
            <h4>Baseline Established</h4>
            <div className="baseline-scores">
              <div className="baseline-item">
                <span>Focus:</span>
                <span>{baseline.focus.toFixed(1)}</span>
              </div>
              <div className="baseline-item">
                <span>Load:</span>
                <span>{baseline.load.toFixed(1)}</span>
              </div>
              <div className="baseline-item">
                <span>Anomaly:</span>
                <span>{baseline.anomaly.toFixed(1)}</span>
              </div>
            </div>
            <button 
              className="button button-secondary"
              onClick={() => setBaseline(null)}
            >
              Recalibrate
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calibrate;

