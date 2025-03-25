import React, { useState } from 'react';
import axios from 'axios';
import { api } from '../config/api';
import './List.css';

const EventList = ({ events, inputName, onEventAdded }) => {
  const [adding, setAdding] = useState(false);

  const handleAddEvent = async () => {
    try {
      await axios.post(api.endpoints.events, {
        IID: selectedInput.IID,
        timestamp: new Date()
      }, {
        withCredentials: true
      });
      onEventAdded();
    } catch (err) {
      console.error('Failed to add event:', err);
    }
  };

  return (
    <div className="event-list">
      <button className="add-button" onClick={handleAddEvent}>
        Record New Event
      </button>
      
      {events.length === 0 ? (
        <p>No events recorded yet</p>
      ) : (
        <div className="events-grid">
          {events.map(event => (
            <div key={event.EID} className="event-card">
              <div className="event-info">
                <p className="event-timestamp">
                  {new Date(event.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList; 