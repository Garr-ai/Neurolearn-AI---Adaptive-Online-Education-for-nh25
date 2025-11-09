import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const Dashboard = ({ currentUser }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentMode, setCurrentMode] = useState('background');
  const [eegData, setEegData] = useState([]);
  const [ws, setWs] = useState(null);
  const [scores, setScores] = useState({
    focus: 0,
    load: 0,
    anomaly: 0
  });
  const [status, setStatus] = useState('Disconnected');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Connect to WebSocket
    const websocket = new WebSocket('ws://localhost:8765');
    
    websocket.onopen = () => {
      console.log('WebSocket connected');
      setWs(websocket);
      setStatus('Connected');
      setError(null);
    };

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);
      
      if (message.type === 'eeg_data') {
        const newData = {
          time: new Date(message.timestamp).toLocaleTimeString(),
          focus: message.data.focus_score,
          load: message.data.load_score,
          anomaly: message.data.anomaly_score
        };
        
        setScores({
          focus: message.data.focus_score,
          load: message.data.load_score,
          anomaly: message.data.anomaly_score
        });
        
        setEegData(prev => [...prev.slice(-59), newData]); // Keep last 60 points
      } else if (message.type === 'recording_started') {
        setStatus('Recording...');
        setError(null);
        setIsRecording(true);
      } else if (message.type === 'recording_stopped') {
        setStatus('Connected (Stopped)');
        setIsRecording(false);
      } else if (message.type === 'error') {
        setError(message.message);
        setStatus('Error');
        setIsRecording(false);
        console.error('Backend error:', message.message);
      }
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('Failed to connect to WebSocket server');
      setStatus('Connection Error');
    };

    websocket.onclose = () => {
      console.log('WebSocket disconnected');
      setWs(null);
      setStatus('Disconnected');
    };

    return () => {
      websocket.close();
    };
  }, []);

  const startRecording = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log('Sending start_recording message...');
      ws.send(JSON.stringify({ type: 'start_recording' }));
      setStatus('Connecting to Ganglion...');
      setError(null);
    } else {
      setError('WebSocket not connected. Please refresh the page.');
      setStatus('Not Connected');
    }
  };

  const stopRecording = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log('Sending stop_recording message...');
      ws.send(JSON.stringify({ type: 'stop_recording' }));
      setStatus('Stopping...');
    }
  };

  const changeMode = (mode) => {
    setCurrentMode(mode);
    if (ws) {
      ws.send(JSON.stringify({ type: 'set_mode', mode }));
    }
  };

  const tabs = [
    { id: 'meeting', label: 'Meetings' },
    { id: 'study', label: 'Studying' },
    { id: 'lecture', label: 'Lectures' },
    { id: 'background', label: 'Health Journal' }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="recording-controls">
          <div className="status-info">
            <span className={`status-indicator ${status.toLowerCase().replace(/\s+/g, '-')}`}>
              {status}
            </span>
            {error && <span className="error-message">{error}</span>}
          </div>
          <button 
            className={`button ${isRecording ? 'button-danger' : ''}`}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={!ws || ws.readyState !== WebSocket.OPEN}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
        </div>
      </div>

      <div className="mode-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`mode-tab ${currentMode === tab.id ? 'active' : ''}`}
            onClick={() => changeMode(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="scores-grid">
        <div className="score-card">
          <div className="score-label">Focus Score</div>
          <div className="score-value">{scores.focus.toFixed(1)}</div>
        </div>
        <div className="score-card">
          <div className="score-label">Load Score</div>
          <div className="score-value">{scores.load.toFixed(1)}</div>
        </div>
        <div className="score-card">
          <div className="score-label">Anomaly Score</div>
          <div className="score-value">{scores.anomaly.toFixed(1)}</div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Real-time EEG Data</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={eegData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="focus" stroke="#667eea" name="Focus" />
            <Line type="monotone" dataKey="load" stroke="#f093fb" name="Load" />
            <Line type="monotone" dataKey="anomaly" stroke="#4facfe" name="Anomaly" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;

