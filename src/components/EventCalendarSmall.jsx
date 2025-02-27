import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaTimes, FaEdit } from 'react-icons/fa';
import { format } from 'date-fns';
import EventDetailsForm from './EventDetailsForm';
import { supabase } from '@/supabaseClient';
///

const EventCalendarSmall = ({ externalOnSelectEvent }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});
  const [selectedEventItem, setSelectedEventItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Get the current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error getting current user:", error);
      } else if (user) {
        setCurrentUser(user);
      }
    };

    getCurrentUser();
  }, []);

  // Fetch events from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      if (!currentUser) return;
      
      setIsLoading(true);
      
      try {
        // Fetch events created by the current user
        const { data: eventsData, error } = await supabase
          .from("events")
          .select("id, title, description, start_time, end_time, location, max_volunteers, user_id")
          .eq("user_id", currentUser.id);
        
        if (error) {
          console.error("Error fetching events:", error);
          return;
        }
        
        // Transform the data for the calendar
        const formattedEvents = {};
        
        eventsData.forEach(event => {
          const startDate = new Date(event.start_time);
          const dateKey = startDate.toDateString();
          
          if (!formattedEvents[dateKey]) {
            formattedEvents[dateKey] = [];
          }
          
          formattedEvents[dateKey].push({
            id: event.id,
            event_name: event.title,
            event_time: startDate.getTime(),
            end_time: new Date(event.end_time).getTime(),
            location: event.location,
            organizer: currentUser.email, // Using user email as organizer
            description: event.description,
            max_volunteers: event.max_volunteers
          });
        });
        
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Unexpected error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, [currentUser]);

  // When a date is clicked, set the selected date.
  const handleDateClick = (date) => {
    setSelectedDate(date);
    if (!externalOnSelectEvent) {
      setSelectedEventItem(null);
    }
  };

  // Display a dot on days that have events.
  const tileContent = ({ date, view }) => {
    const dateKey = date.toDateString();
    if (events[dateKey] && events[dateKey].length > 0) {
      return <span className="event-dot">●</span>;
    }
    return null;
  };

  // Custom month/year header format.
  const formatMonthYear = (locale, date) => {
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return (
      <>
        <span className="month">{month}</span>{' '}
        <span className="year">{year}</span>
      </>
    );
  };

  // Internal handlers for saving/updating and deleting events
  const handleInternalSaveEvent = async (updatedEvent) => {
    const dateKey = selectedEventItem.dateKey;
    const eventIndex = selectedEventItem.index;
    const eventId = selectedEventItem.event.id;
    
    try {
      // Update the event in Supabase
      const { error } = await supabase
        .from("events")
        .update({
          title: updatedEvent.event_name,
          description: updatedEvent.description,
          location: updatedEvent.location,
          // Only update other fields if they exist in the updatedEvent object
          ...(updatedEvent.event_time && { start_time: new Date(updatedEvent.event_time).toISOString() }),
          ...(updatedEvent.end_time && { end_time: new Date(updatedEvent.end_time).toISOString() }),
          ...(updatedEvent.max_volunteers && { max_volunteers: updatedEvent.max_volunteers })
        })
        .eq("id", eventId);
      
      if (error) {
        console.error("Error updating event:", error);
        alert("Failed to update event. Please try again.");
        return;
      }
      
      // Update local state
      setEvents((prev) => {
        const eventsForDate = prev[dateKey];
        const updatedEventsForDate = [...eventsForDate];
        updatedEventsForDate[eventIndex] = updatedEvent;
        return { ...prev, [dateKey]: updatedEventsForDate };
      });
      
      setSelectedEventItem(null);
      
    } catch (error) {
      console.error("Unexpected error updating event:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleInternalDeleteEvent = async (eventToDelete) => {
    const dateKey = selectedEventItem.dateKey;
    const eventIndex = selectedEventItem.index;
    const eventId = selectedEventItem.event.id;
    
    try {
      // Delete the event from Supabase
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);
      
      if (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete event. Please try again.");
        return;
      }
      
      // Update local state
      setEvents((prev) => {
        const eventsForDate = prev[dateKey].filter((_, i) => i !== eventIndex);
        if (eventsForDate.length === 0) {
          const newEvents = { ...prev };
          delete newEvents[dateKey];
          return newEvents;
        }
        return { ...prev, [dateKey]: eventsForDate };
      });
      
      setSelectedEventItem(null);
      
    } catch (error) {
      console.error("Unexpected error deleting event:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div
      className="calendar-container"
      style={{ background: 'white', color: 'black', padding: '1rem' }}
    >
      {isLoading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading events...</p>
        </div>
      ) : (
        <div className="calendar-content d-flex gap-3 flex-wrap" style={{ background: 'white', color: 'black' }}>
          <div className="calendar-left flex-fill" style={{ background: 'white', color: 'black' }}>
            <Calendar
              onClickDay={handleDateClick}
              tileContent={tileContent}
              value={selectedDate}
              prev2Label={null}
              next2Label={null}
              formatMonthYear={formatMonthYear}
            />

            {selectedDate && (
              <div className="event-container mt-3" style={{ background: 'white', color: 'black' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <span
                    onClick={() => setSelectedDate(null)}
                    className="event-container__close"
                    style={{ cursor: 'pointer', fontSize: '1.2rem', padding: '0.25rem', background: 'white', color: 'black' }}
                  >
                    <FaTimes />
                  </span>
                </div>
                <div>
                  {(events[selectedDate.toDateString()] || []).map((event, index) => (
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
                        {format(event.event_time, 'HH:mm')} - {format(selectedDate, 'EEEE - d MMM')}
                      </div>
                      <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        Location: {event.location}
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
                        onClick={() => {
                          const eventItem = {
                            dateKey: selectedDate.toDateString(),
                            index,
                            event,
                          };
                          if (externalOnSelectEvent) {
                            externalOnSelectEvent(eventItem);
                          } else {
                            setSelectedEventItem(eventItem);
                          }
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#333')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'black')}
                      >
                        <FaEdit />
                        Edit
                      </button>
                    </div>
                  ))}
                  
                  {(!events[selectedDate.toDateString()] || events[selectedDate.toDateString()].length === 0) && (
                    <div className="text-center py-3">
                      <p>No events scheduled for this date.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* When using an external details panel, do not render the right side here */}
          {!externalOnSelectEvent && (
            <div
              className={`calendar-right flex-fill ${selectedEventItem ? 'fade-in-panel' : ''}`}
              style={{ background: 'white', color: 'black' }}
            >
              {selectedEventItem ? (
                <EventDetailsForm
                  key={selectedEventItem.event.event_time}
                  event={selectedEventItem.event}
                  onSave={handleInternalSaveEvent}
                  onDelete={handleInternalDeleteEvent}
                  onClose={() => setSelectedEventItem(null)}
                />
              ) : (
                <div className="placeholder p-3" style={{ background: 'white', color: 'black' }}>
                  <p style={{ color: 'black' }}>Select an event to view details</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventCalendarSmall;
