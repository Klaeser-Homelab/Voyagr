import React, { useState } from 'react';
import { CheckCircleIcon, PencilIcon } from '@heroicons/react/24/solid';
import api from '../../../config/api';

const EventCard = ({ event, onEventUpdated }) => {
  const [editingEvent, setEditingEvent] = useState(null);
  const [editedData, setEditedData] = useState({
    duration: event.duration,
    occurredAt: event.occurred_at || event.createdAt
  });

  // Format date for datetime-local input
  const formatDateTimeLocal = (date) => {
    const d = new Date(date);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  };

  // Handle editing mode toggle
  const handleEditClick = (e) => {
    e.stopPropagation();
    if (editingEvent) {
      setEditingEvent(null);
      // Reset to original values if canceling
      setEditedData({
        duration: event.duration,
        occurredAt: event.occurred_at || event.createdAt
      });
    } else {
      setEditingEvent(event.id);
      // Initialize with current values
      setEditedData({
        duration: event.duration,
        occurredAt: event.occurred_at || event.createdAt
      });
    }
  };

  // Handle saving edited event
  const handleSaveEvent = async () => {
    try {
      const updateData = {
        duration: editedData.duration,
        // Convert datetime-local string back to ISO format for API
        occurred_at: new Date(editedData.occurredAt).toISOString()
      };
      
      await api.put(`/api/events/${event.id}`, updateData);
      
      // Notify parent component to refresh data
      if (onEventUpdated) {
        onEventUpdated();
      }
      
      setEditingEvent(null);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  // Handle input changes
  const handleDurationChange = (e) => {
    const newDurationMinutes = parseInt(e.target.value) || 0;
    const newDurationMs = newDurationMinutes * 60000;
    setEditedData(prev => ({
      ...prev,
      duration: newDurationMs
    }));
  };

  const handleDateTimeChange = (e) => {
    setEditedData(prev => ({
      ...prev,
      occurredAt: e.target.value
    }));
  };

  const handleCancel = () => {
    setEditingEvent(null);
    setEditedData({
      duration: event.duration,
      occurredAt: event.occurred_at || event.createdAt
    });
  };

  return (
    <div className="relative group">
      <div 
        className={`card bg-gray-700 p-2 relative ${
          editingEvent === event.id ? 'bg-gray-600' : ''
        }`}
        style={{ 
          borderLeft: `20px solid ${event.color || '#ddd'}`
        }}
      >
        {/* Edit button overlay - appears in center on hover, but only when NOT editing */}
        {editingEvent !== event.id && (
          <div 
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-gray-600/40 rounded-lg cursor-pointer"
            onClick={handleEditClick}
          >
            <div className="bg-primary text-primary-content rounded-full p-3">
              <PencilIcon className="size-5" />
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="font-medium whitespace-nowrap">
            {event.description} • <span className="whitespace-nowrap">{Math.round(event.duration / (1000 * 60))} min</span>
          </span>
          <CheckCircleIcon className="size-6 text-white" />
        </div>

        {/* Edit form - only shows when editing */}
        {editingEvent === event.id && (
          <div className="mt-3 pt-3 border-t border-gray-600">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  value={Math.round(editedData.duration / (1000 * 60))}
                  onChange={handleDurationChange}
                  className="input input-sm input-bordered w-32"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Occurred At</label>
                <input
                  type="datetime-local"
                  value={formatDateTimeLocal(editedData.occurredAt)}
                  onChange={handleDateTimeChange}
                  className="input input-sm input-bordered"
                />
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={handleSaveEvent}
                  className="btn btn-sm btn-success"
                >
                  Save
                </button>
                <button 
                  onClick={handleCancel}
                  className="btn btn-sm btn-outline"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {event.todos && event.todos.length > 0 && (
          <div className="pl-4 mt-2 text-sm space-y-1">
            {event.todos.map(todo => (
              <div key={todo.id} className="flex items-center gap-2">
                <span className="text-base-content/70">✓</span>
                <span>{todo.description}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;