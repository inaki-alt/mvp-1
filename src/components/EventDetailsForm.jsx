import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import { parseDateTime, formatTimeString, formatEventDate } from '@/utils/eventUtils';

const EventDetailsForm = ({ event, onSave, onDelete }) => {
  const startDate = parseDateTime(event.start_time);
  const endDate = parseDateTime(event.end_time);

  const [eventName, setEventName] = useState(event.event_name || '');
  const [eventDate, setEventDate] = useState(formatEventDate(startDate));
  const [eventTime, setEventTime] = useState(formatTimeString(startDate));
  const [eventEndTime, setEventEndTime] = useState(formatTimeString(endDate));
  const [locationName, setLocationName] = useState(event.location || '');
  const [eventAddress, setEventAddress] = useState(event.address || '');
  const [minVolunteers, setMinVolunteers] = useState(event.min_volunteers || '');
  const [maxVolunteers, setMaxVolunteers] = useState(event.max_volunteers || '');
  const [eventDescription, setEventDescription] = useState(event.description || '');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const calculateDuration = () => {
    const start = new Date(`${eventDate}T${eventTime}`);
    const end = new Date(`${eventDate}T${eventEndTime}`);
    let diff = end - start;
    if (diff < 0) {
      diff += 24 * 60 * 60 * 1000; // Adjust if event passes midnight
    }
    const totalMinutes = Math.floor(diff / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const handleSave = () => {
    const startDateTime = new Date(`${eventDate}T${eventTime}`);
    const endDateTime = new Date(`${eventDate}T${eventEndTime}`);
    const updatedEvent = {
      ...event,
      event_name: eventName,
      start_time: startDateTime.getTime(),
      end_time: endDateTime.getTime(),
      location: locationName || '',
      address: eventAddress || '',
      min_volunteers: Number(minVolunteers || 0),
      max_volunteers: Number(maxVolunteers || 0),
      description: eventDescription || ''
    };
    onSave(updatedEvent);
  };

  const confirmDelete = () => {
    onDelete(event);
    setShowDeleteModal(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  return (
    <div className="event-details-form card p-4 shadow" style={{ background: '#fff', borderRadius: '10px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
        <h4 className="mb-0" style={{ color: '#333' }}>
          Edit Event
        </h4>
      </div>
      
      <div className="mb-3">
        <label className="form-label">Event Name</label>
        <input
          type="text"
          className="form-control"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="Enter event name"
        />
      </div>
      
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Start Date</label>
          <input
            type="date"
            className="form-control"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Start Time</label>
          <input
            type="time"
            className="form-control"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
          />
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">End Time</label>
          <input
            type="time"
            className="form-control"
            value={eventEndTime}
            onChange={(e) => setEventEndTime(e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Event Duration</label>
          <input
            type="text"
            className="form-control"
            value={calculateDuration()}
            readOnly
          />
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Location Name</label>
          <input
            type="text"
            className="form-control"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            placeholder="Enter location name"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Location Address</label>
          <input
            type="text"
            className="form-control"
            value={eventAddress}
            onChange={(e) => setEventAddress(e.target.value)}
            placeholder="Enter location address"
          />
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Minimum Number of Volunteers</label>
          <input
            type="number"
            className="form-control"
            value={minVolunteers}
            onChange={(e) => setMinVolunteers(e.target.value)}
            placeholder="Minimum volunteers required"
            min="0"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Maximum Number of Volunteers</label>
          <input
            type="number"
            className="form-control"
            value={maxVolunteers}
            onChange={(e) => setMaxVolunteers(e.target.value)}
            placeholder="Maximum volunteers allowed"
            min="0"
          />
        </div>
      </div>
      
      <div className="mb-3">
        <label className="form-label">Event Description</label>
        <textarea
          className="form-control"
          rows="4"
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
          placeholder="Describe the event"
        ></textarea>
      </div>
      
      <div className="d-flex justify-content-end gap-2">
        <button onClick={handleSave} className="btn btn-primary">
          Save
        </button>
        <button onClick={handleDeleteClick} className="btn btn-danger">
          Delete
        </button>
      </div>

      {showDeleteModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: '100vw',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '8px',
              width: '90%',
              maxWidth: '400px',
            }}
          >
            <h5>Confirm Delete Event</h5>
            <p>Are you sure you want to delete this event?</p>
            <div className="d-flex justify-content-end gap-2">
              <button onClick={confirmDelete} className="btn btn-danger">
                Yes, Delete
              </button>
              <button onClick={() => setShowDeleteModal(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

EventDetailsForm.propTypes = {
  event: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default EventDetailsForm; 