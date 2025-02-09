import React from 'react';
import PropTypes from 'prop-types';
import EventDetailsForm from './EventDetailsForm';

const EventDetailsPanel = ({ selectedEvent, onSaveEvent, onDeleteEvent, onCloseEvent }) => {
  return (
    <div
      className="event-details-panel"
      style={{
        background: 'white',
        color: 'black',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          borderBottom: '1px solid #eaeaea',
          paddingBottom: '1rem',
        }}
      >
        <h4 style={{ fontSize: '1.5rem', margin: 0 }}>
          {selectedEvent ? selectedEvent.event.event_name : 'Event Details'}
        </h4>
        {selectedEvent && (
          <button
            onClick={onCloseEvent}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.2rem',
              color: 'black',
            }}
          >
            &times;
          </button>
        )}
      </div>
      <div>
        {selectedEvent ? (
          <EventDetailsForm
            event={selectedEvent.event}
            onSave={onSaveEvent}
            onDelete={onDeleteEvent}
            onClose={onCloseEvent}
          />
        ) : (
          <div style={{ textAlign: 'center' }}>
            <p>Select an event from the calendar to view details.</p>
          </div>
        )}
      </div>
    </div>
  );
};

EventDetailsPanel.propTypes = {
  selectedEvent: PropTypes.shape({
    dateKey: PropTypes.string,
    index: PropTypes.number,
    event: PropTypes.object,
  }),
  onSaveEvent: PropTypes.func.isRequired,
  onDeleteEvent: PropTypes.func.isRequired,
  onCloseEvent: PropTypes.func.isRequired,
};

export default EventDetailsPanel; 