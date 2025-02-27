import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa';
import { supabase } from '@/supabaseClient';

const EventDetailsForm = ({ event, onSave, onDelete, onClose, hideCloseButton }) => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventEndTime, setEventEndTime] = useState('');
  const [locationName, setLocationName] = useState('');
  const [eventAddress, setEventAddress] = useState('');
  const [minVolunteers, setMinVolunteers] = useState('');
  const [maxVolunteers, setMaxVolunteers] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Reset/refresh the form fields whenever the event prop changes.
  useEffect(() => {
    const initialEventDate = new Date(event.event_time).toISOString().split('T')[0];
    const initialStartTime = new Date(event.event_time).toISOString().substring(11, 16);
    const initialEndTime = event.end_time 
      ? new Date(event.end_time).toISOString().substring(11, 16)
      : new Date(new Date(event.event_time).getTime() + 60 * 60 * 1000)
          .toISOString()
          .substring(11, 16);

    setEventName(event.event_name || '');
    setEventDate(initialEventDate);
    setEventTime(initialStartTime);
    setEventEndTime(initialEndTime);
    setLocationName(event.location_name || event.location || '');
    setEventAddress(event.location_address || '');
    setMinVolunteers(event.min_volunteers || '');
    setMaxVolunteers(event.max_volunteers || '');
    setEventDescription(event.description || '');
  }, [event]);

  // Hide success message after 3 seconds
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  // Calculate event duration for display (read-only field)
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

  const handleSave = async () => {
    setIsSubmitting(true);
    
    try {
      const startDateTime = new Date(`${eventDate}T${eventTime}`);
      const endDateTime = new Date(`${eventDate}T${eventEndTime}`);
      
      // Prepare the updated event object for the UI
      const updatedEvent = {
        ...event,
        event_name: eventName,
        event_time: startDateTime.getTime(),
        end_time: endDateTime.getTime(),
        location: locationName, // Keep location for backward compatibility
        location_name: locationName,
        location_address: eventAddress,
        min_volunteers: parseInt(minVolunteers, 10) || 0,
        max_volunteers: parseInt(maxVolunteers, 10) || 0,
        description: eventDescription,
      };
      
      // Update the event in Supabase with only the fields that exist in the schema
      const { error } = await supabase
        .from("events")
        .update({
          title: eventName,
          description: eventDescription,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          location: locationName, // Update location field separately
          location_name: locationName, // Store location name separately
          location_address: eventAddress, // Store address separately
          min_volunteers: parseInt(minVolunteers, 10) || 0,
          max_volunteers: parseInt(maxVolunteers, 10) || 0
        })
        .eq("id", event.id);
      
      if (error) {
        console.error("Error updating event:", error);
        alert("Failed to update event. Please try again.");
        return;
      }
      
      // Show success message
      setSaveSuccess(true);
      
      // Fetch the updated event from Supabase to ensure we have the latest data
      const { data: refreshedEvent, error: refreshError } = await supabase
        .from("events")
        .select("*")
        .eq("id", event.id)
        .single();
        
      if (refreshError) {
        console.error("Error refreshing event data:", refreshError);
      } else if (refreshedEvent) {
        // Transform the refreshed data to match our expected format
        const formattedEvent = {
          id: refreshedEvent.id,
          event_name: refreshedEvent.title,
          event_time: new Date(refreshedEvent.start_time).getTime(),
          end_time: new Date(refreshedEvent.end_time).getTime(),
          location: refreshedEvent.location,
          location_name: refreshedEvent.location_name,
          location_address: refreshedEvent.location_address,
          min_volunteers: refreshedEvent.min_volunteers,
          max_volunteers: refreshedEvent.max_volunteers,
          description: refreshedEvent.description
        };
        
        // Call the onSave callback with the refreshed event
        onSave(formattedEvent);
      } else {
        // If refresh fails, use our locally updated event
        onSave(updatedEvent);
      }
      
    } catch (error) {
      console.error("Unexpected error saving event:", error);
      alert("An error occurred while saving. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Called when the user confirms deletion in the modal.
  const confirmDelete = async () => {
    setIsSubmitting(true);
    
    try {
      // Delete the event from Supabase
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", event.id);
      
      if (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete event. Please try again.");
        return;
      }
      
      // Call the onDelete callback
      onDelete(event);
      setShowDeleteModal(false);
      
    } catch (error) {
      console.error("Unexpected error deleting event:", error);
      alert("An error occurred while deleting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
        {!hideCloseButton && (
          <button onClick={onClose} className="btn btn-sm btn-outline-secondary">
            <FaTimes />
          </button>
        )}
      </div>
      
      {saveSuccess && (
        <div className="alert alert-success mb-3" role="alert">
          Event saved successfully!
        </div>
      )}
      
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
        <button 
          onClick={handleSave} 
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
        <button 
          onClick={handleDeleteClick} 
          className="btn btn-danger"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Delete'}
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
              <button 
                onClick={confirmDelete} 
                className="btn btn-danger"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className="btn btn-secondary"
                disabled={isSubmitting}
              >
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
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  hideCloseButton: PropTypes.bool,
};

export default EventDetailsForm; 