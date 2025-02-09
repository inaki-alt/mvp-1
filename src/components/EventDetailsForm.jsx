import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';

const EventDetailsForm = ({ event, onSave, onDelete, onClose }) => {
  // Local state for form fields
  const [eventName, setEventName] = useState(event.event_name);
  const [eventLocation, setEventLocation] = useState(event.location || '');
  const [eventOrganizer, setEventOrganizer] = useState(event.organizer || '');
  const [eventDescription, setEventDescription] = useState(event.description || '');
  // Extract time in HH:mm format from the event_time timestamp
  const initialTime = new Date(event.event_time).toISOString().substr(11, 5);
  const [eventTime, setEventTime] = useState(initialTime);

  const handleSave = () => {
    // Update event_time keeping the original date but with modified hours/minutes
    const updatedTime = new Date(event.event_time);
    const [hours, minutes] = eventTime.split(':');
    updatedTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));

    const updatedEvent = {
      ...event,
      event_name: eventName,
      event_time: updatedTime.getTime(),
      location: eventLocation,
      organizer: eventOrganizer,
      description: eventDescription,
    };
    onSave(updatedEvent);
  };

  const handleDelete = () => onDelete(event);

  return (
    <div className="event-details-form p-3" style={{ background: 'white', color: 'black' }}>
      <div className="d-flex justify-content-between align-items-center mb-3" style={{ background: 'white', color: 'black' }}>
        <h4 className="mb-0" style={{ background: 'white', color: 'black' }}>Edit Event</h4>
        <button onClick={onClose} className="btn btn-sm btn-outline-secondary" style={{ background: 'white', color: 'black' }}>
          <FaTimes />
        </button>
      </div>
      <div className="mb-2" style={{ background: 'white', color: 'black' }}>
        <label className="form-label" style={{ background: 'white', color: 'black' }}>Event Name</label>
        <input
          type="text"
          className="form-control"
          style={{ background: 'white', color: 'black' }}
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
      </div>
      <div className="mb-3" style={{ background: 'white', color: 'black' }}>
        <label className="form-label" style={{ background: 'white', color: 'black' }}>Event Time</label>
        <input
          type="time"
          className="form-control"
          style={{ background: 'white', color: 'black' }}
          value={eventTime}
          onChange={(e) => setEventTime(e.target.value)}
        />
      </div>
      <div className="mb-3" style={{ background: 'white', color: 'black' }}>
        <label className="form-label" style={{ background: 'white', color: 'black' }}>Location</label>
        <input
          type="text"
          className="form-control"
          style={{ background: 'white', color: 'black' }}
          value={eventLocation}
          onChange={(e) => setEventLocation(e.target.value)}
        />
      </div>
      <div className="mb-3" style={{ background: 'white', color: 'black' }}>
        <label className="form-label" style={{ background: 'white', color: 'black' }}>Organizer</label>
        <input
          type="text"
          className="form-control"
          style={{ background: 'white', color: 'black' }}
          value={eventOrganizer}
          onChange={(e) => setEventOrganizer(e.target.value)}
        />
      </div>
      <div className="mb-3" style={{ background: 'white', color: 'black' }}>
        <label className="form-label" style={{ background: 'white', color: 'black' }}>Description</label>
        <textarea
          className="form-control"
          rows="3"
          style={{ background: 'white', color: 'black' }}
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
        ></textarea>
      </div>
      <div className="d-flex justify-content-end gap-2" style={{ background: 'white', color: 'black' }}>
        <button onClick={handleSave} className="btn btn-primary" style={{ background: 'white', color: 'black' }}>Save</button>
        <button onClick={handleDelete} className="btn btn-danger" style={{ background: 'white', color: 'black' }}>Delete</button>
      </div>
    </div>
  );
};

EventDetailsForm.propTypes = {
  event: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EventDetailsForm; 