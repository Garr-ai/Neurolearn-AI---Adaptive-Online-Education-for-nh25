import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './History.css';

const History = ({ currentUser }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, [currentUser, filter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const url = filter === 'all' 
        ? `http://localhost:8000/events?user_id=${currentUser}&limit=100`
        : `http://localhost:8000/events?user_id=${currentUser}&mode=${filter}&limit=100`;
      
      const response = await axios.get(url);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getModeLabel = (mode) => {
    const labels = {
      meeting: 'Meeting',
      study: 'Study',
      lecture: 'Lecture',
      background: 'Background'
    };
    return labels[mode] || mode;
  };

  return (
    <div className="history">
      <div className="history-header">
        <h2>History</h2>
        <select 
          className="select filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Modes</option>
          <option value="meeting">Meetings</option>
          <option value="study">Study</option>
          <option value="lecture">Lectures</option>
          <option value="background">Background</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : events.length === 0 ? (
        <div className="card">
          <p>No events found. Start recording to see your data here.</p>
        </div>
      ) : (
        <div className="events-table">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Mode</th>
                <th>Focus</th>
                <th>Load</th>
                <th>Anomaly</th>
                <th>Context</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id}>
                  <td>{formatDate(event.timestamp)}</td>
                  <td>
                    <span className={`mode-badge mode-${event.mode}`}>
                      {getModeLabel(event.mode)}
                    </span>
                  </td>
                  <td>{event.focus_score.toFixed(1)}</td>
                  <td>{event.load_score.toFixed(1)}</td>
                  <td>{event.anomaly_score.toFixed(1)}</td>
                  <td>
                    {event.context?.url ? (
                      <a href={event.context.url} target="_blank" rel="noopener noreferrer">
                        {event.context.url.substring(0, 30)}...
                      </a>
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default History;



