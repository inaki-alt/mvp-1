import React from 'react';
import PropTypes from 'prop-types';
import EventDetailsForm from './EventDetailsForm';
import { FaEdit } from 'react-icons/fa';
import { format } from 'date-fns';

const EventDetailsPanel = ({ 
  selectedEvent, 
  onSaveEvent, 
  onDeleteEvent, 
  onCloseEvent, 
  eventsForSelectedDate,
  onEventSelect
}) => {
  const handleEventClick = (event) => {
    onEventSelect({
      dateKey: new Date(event.event_time).toDateString(),
      event: event
    });
  };

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
      </div>
      <div>
        {selectedEvent ? (
          // Show the event form when an event is selected for editing
          <EventDetailsForm
            key={selectedEvent.event.event_time}
            event={selectedEvent.event}
            onSave={onSaveEvent}
            onDelete={onDeleteEvent}
            onClose={onCloseEvent}
          />
        ) : (
          // Show the list of events when no event is selected for editing
          eventsForSelectedDate && eventsForSelectedDate.length > 0 ? (
            eventsForSelectedDate.map((event, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '1rem',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '1rem',
                  background: 'white',
                  color: 'black',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  {event.event_name}
                </div>
                <div style={{ color: '#555', marginBottom: '0.5rem' }}>
                  {format(event.event_time, 'HH:mm')}
                </div>
                <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  Location: {event.location_name}
                </div>
                <button
                  style={{
                    padding: '0.5rem 1rem',
                    border: '2px solid black',
                    borderRadius: '4px',
                    background: 'black',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'background 0.3s ease',
                  }}
                  onClick={() => handleEventClick(event)}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#333')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'black')}
                >
                  <FaEdit />
                  Edit
                </button>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p>No events to display</p>
            </div>
          )
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
  eventsForSelectedDate: PropTypes.arrayOf(
    PropTypes.shape({
      dateKey: PropTypes.string,
      index: PropTypes.number,
      event_name: PropTypes.string,
      event_time: PropTypes.number,
      location_name: PropTypes.string,
    })
  ),
  onEventSelect: PropTypes.func.isRequired,
};

export default EventDetailsPanel; 