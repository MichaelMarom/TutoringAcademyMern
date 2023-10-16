import React, { useState } from 'react';

function CustomEventForm({ onSave, onCancel, isDateDisabled }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState(null); // Initialize with null

  const handleSave = () => {
    if (!start || isDateDisabled(start)) {
      alert('Invalid date or date is disabled');
      return;
    }

    // Create your event object and pass it to the onSave callback
    const event = {
      title,
      description,
      start,
      end: new Date(start.getTime() + 60 * 60 * 1000), // Example: 1 hour event
    };

    onSave(event);
  };

  return (
    <div>
      <h3>Create Event</h3>
      <label>Title:</label>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      <label>Description:</label>
      <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      <label>Date and Time:</label>
      <input type="datetime-local" value={start} onChange={(e) => setStart(new Date(e.target.value))} />
      <button onClick={handleSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}

export default CustomEventForm;
