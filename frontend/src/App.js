import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import Calibrate from './components/Calibrate';
import History from './components/History';
import UserSelector from './components/UserSelector';

function App() {
  const [currentUser, setCurrentUser] = useState('default');

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-title">NeuroCalm</h1>
            <div className="nav-links">
              <Link to="/" className="nav-link">Dashboard</Link>
              <Link to="/calibrate" className="nav-link">Calibrate</Link>
              <Link to="/history" className="nav-link">History</Link>
              <UserSelector currentUser={currentUser} setCurrentUser={setCurrentUser} />
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard currentUser={currentUser} />} />
            <Route path="/calibrate" element={<Calibrate currentUser={currentUser} />} />
            <Route path="/history" element={<History currentUser={currentUser} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;



