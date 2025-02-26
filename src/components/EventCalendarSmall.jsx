import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaTimes, FaEdit } from 'react-icons/fa';
import { format } from 'date-fns';
import EventDetailsForm from './EventDetailsForm';
///

const EventCalendarSmall = ({ externalOnSelectEvent }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});
  const [selectedEventItem, setSelectedEventItem] = useState(null);

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

  useEffect(() => {
    // Dummy events for every Saturday from February 2025 through March 2025 with extra details.
    setEvents({
      "Sat Feb 01 2025": [
        {
          id: "event-2025-02-01",
          event_name: "Fresh Start Food Distribution",
          start_time: new Date(2025, 1, 1, 10, 0).getTime(),
          end_time: new Date(2025, 1, 1, 12, 0).getTime(),
          location: "Main Hall",
          organizer: "Alice Johnson",
          description: "Food packages distribution to local community."
        },
      ],
      "Sat Feb 08 2025": [
        {
          id: "event-2025-02-08",
          event_name: "Hearty Harvest Giveaway",
          start_time: new Date(2025, 1, 8, 10, 0).getTime(),
          end_time: new Date(2025, 1, 8, 12, 0).getTime(),
          location: "Community Center",
          organizer: "Bob Smith",
          description: "Celebrating the harvest with a community giveaway."
        },
      ],
      "Sat Feb 15 2025": [
        {
          id: "event-2025-02-15",
          event_name: "Caring Cuisine Collection",
          start_time: new Date(2025, 1, 15, 10, 0).getTime(),
          end_time: new Date(2025, 1, 15, 12, 0).getTime(),
          location: "Local School Hall",
          organizer: "Carol White",
          description: "Collecting and distributing cooked meals to those in need."
        },
      ],
      "Sat Feb 22 2025": [
        {
          id: "event-2025-02-22",
          event_name: "Nourish Together Food Drive",
          start_time: new Date(2025, 1, 22, 10, 0).getTime(),
          end_time: new Date(2025, 1, 22, 12, 0).getTime(),
          location: "City Park",
          organizer: "David Brown",
          description: "A drive for combining efforts to feed the hungry."
        },
      ],
      "Sat Mar 01 2025": [
        {
          id: "event-2025-03-01",
          event_name: "Spring Pantry Kickoff",
          start_time: new Date(2025, 2, 1, 10, 0).getTime(),
          end_time: new Date(2025, 2, 1, 12, 0).getTime(),
          location: "Food Bank",
          organizer: "Eve Black",
          description: "Launching the season's pantry with essentials."
        },
      ],
      "Sat Mar 08 2025": [
        {
          id: "event-2025-03-08",
          event_name: "Farm Fresh Fare Day",
          start_time: new Date(2025, 2, 8, 10, 0).getTime(),
          end_time: new Date(2025, 2, 8, 12, 0).getTime(),
          location: "Farmers' Market",
          organizer: "Frank Green",
          description: "Showcasing fresh local produce from nearby farms."
        },
      ],
      "Sat Mar 15 2025": [
        {
          id: "event-2025-03-15",
          event_name: "Mid-March Meal Meetup",
          start_time: new Date(2025, 2, 15, 10, 0).getTime(),
          end_time: new Date(2025, 2, 15, 12, 0).getTime(),
          location: "Community Kitchen",
          organizer: "Grace Blue",
          description: "Networking and meal planning for community members."
        },
      ],
      "Sat Mar 22 2025": [
        {
          id: "event-2025-03-22",
          event_name: "Local Love Food Exchange",
          start_time: new Date(2025, 2, 22, 10, 0).getTime(),
          end_time: new Date(2025, 2, 22, 12, 0).getTime(),
          location: "Downtown Center",
          organizer: "Henry Gray",
          description: "Exchange local food and explore sustainable options."
        },
      ],
      "Sat Mar 29 2025": [
        {
          id: "event-2025-03-29",
          event_name: "Harvest Helpers Distribution",
          start_time: new Date(2025, 2, 29, 10, 0).getTime(),
          end_time: new Date(2025, 2, 29, 12, 0).getTime(),
          location: "Community Hall",
          organizer: "Ivy Gold",
          description: "Final day of food distribution for the season."
        },
      ],
    });
  }, []);

  // Internal handlers for saving/updating and deleting events
  const handleInternalSaveEvent = (updatedEvent) => {
    const dateKey = selectedEventItem.dateKey;
    const eventIndex = selectedEventItem.index;
    setEvents((prev) => {
      const eventsForDate = prev[dateKey];
      const updatedEventsForDate = [...eventsForDate];
      updatedEventsForDate[eventIndex] = updatedEvent;
      return { ...prev, [dateKey]: updatedEventsForDate };
    });
    setSelectedEventItem(null);
  };

  const handleInternalDeleteEvent = (eventToDelete) => {
    const dateKey = selectedEventItem.dateKey;
    const eventIndex = selectedEventItem.index;
    setEvents((prev) => {
      const eventsForDate = prev[dateKey].filter((_, i) => i !== eventIndex);
      return { ...prev, [dateKey]: eventsForDate };
    });
    setSelectedEventItem(null);
  };

  return (
    <div
      className="calendar-container"
      style={{ background: 'white', color: 'black', padding: '1rem' }}
    >
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
                      {format(event.start_time, 'HH:mm')} - {format(selectedDate, 'EEEE - d MMM')}
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
    </div>
  );
};

export default EventCalendarSmall;
