import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';
import Dashboard from './components/Dashboard';
import Calibrate from './components/Calibrate';
import History from './components/History';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import PrivateRoute from './components/PrivateRoute';

function AppContent() {
  const { currentUser, logout } = useAuth();
  const [localUser, setLocalUser] = useState('default');

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="nav-title">NeuroCalm by BK</h1>
          <div className="nav-links">
            {currentUser ? (
              <>
                <Link to="/" className="nav-link">Dashboard</Link>
                <Link to="/calibrate" className="nav-link">Calibrate</Link>
                <Link to="/history" className="nav-link">History</Link>
                <span className="nav-user">Welcome, {currentUser.displayName || currentUser.email}</span>
                <button onClick={handleLogout} className="nav-link nav-button">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route 
            path="/login" 
            element={currentUser ? <Navigate to="/" /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={currentUser ? <Navigate to="/" /> : <Register />} 
          />
          <Route 
            path="/forgot-password" 
            element={currentUser ? <Navigate to="/" /> : <ForgotPassword />} 
          />
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <Dashboard currentUser={currentUser?.uid || localUser} />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/calibrate" 
            element={
              <PrivateRoute>
                <Calibrate currentUser={currentUser?.uid || localUser} />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/history" 
            element={
              <PrivateRoute>
                <History currentUser={currentUser?.uid || localUser} />
              </PrivateRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;



