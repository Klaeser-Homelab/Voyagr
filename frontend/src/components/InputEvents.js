import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { api } from '../config/api';
import './List.css';

const InputEvents = () => {
  const { inputId } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      const response = await axios.get(`${api.endpoints.inputs}/${inputId}/events`);
      setEvents(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [inputId]);

  useEffect(() => {
    if (inputId) {
      fetchEvents();
    }
  }, [inputId, fetchEvents]);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${remainingSeconds}s`;
  };

  const handleAddEvent = async () => {
    try {
      await axios.post(api.endpoints.events, {
        IID: inputId,
        timestamp: new Date()
      }, {
        withCredentials: true
      });
      // Refresh events
      fetchEvents();
    } catch (err) {
      setError('Failed to add event');
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      await axios.delete(`${api.endpoints.events}/${eventId}`);
      // Refresh the events list after deletion
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="events-page">
      <Link to="/" className="back-link">← Back to Inputs</Link>
      
      <h2>Events for Input {inputId}</h2>

      <button className="add-button" onClick={handleAddEvent}>
        Record New Event
      </button>

      <div className="grid">
        {events.length === 0 ? (
          <p>No events recorded yet</p>
        ) : (
          events.map(event => (
            <div key={event.EID} className="card">
              <div className="info">
                <span className={`event-type ${event.type}`}>
                  {event.type}
                </span>
                <h3>Duration: {formatDuration(event.duration)}</h3>
                <p>Recorded: {new Date(event.createdAt).toLocaleString()}</p>
              </div>
              <button 
                className="delete-button"
                onClick={() => deleteEvent(event.EID)}
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InputEvents; 