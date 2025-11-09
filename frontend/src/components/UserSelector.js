import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserSelector.css';

const UserSelector = ({ currentUser, setCurrentUser }) => {
  const [users, setUsers] = useState(['default']);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/users');
      setUsers(response.data.length > 0 ? response.data : ['default']);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUserChange = (userId) => {
    setCurrentUser(userId);
    setShowDropdown(false);
  };

  return (
    <div className="user-selector">
      <button 
        className="user-selector-button"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        User: {currentUser} ▼
      </button>
      {showDropdown && (
        <div className="user-dropdown">
          {users.map(user => (
            <button
              key={user}
              className={`user-option ${currentUser === user ? 'active' : ''}`}
              onClick={() => handleUserChange(user)}
            >
              {user}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSelector;

