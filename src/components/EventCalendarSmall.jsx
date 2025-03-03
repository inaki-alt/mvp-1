import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { supabase } from '@/supabaseClient';
///

const EventCalendarSmall = ({ onDateClick }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});
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
          .select("id, title, description, start_time, end_time, location_name, location_address, max_volunteers, min_volunteers, user_id")
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
            location_name: event.location_name,
            location_address: event.location_address,
            organizer: currentUser.email, // Using user email as organizer
            description: event.description,
            max_volunteers: event.max_volunteers,
            min_volunteers: event.min_volunteers
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

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const dateKey = date.toDateString();
    const eventsForDate = events[dateKey] || [];
    
    onDateClick({
      eventsForSelectedDate: eventsForDate.map((event, index) => ({
        ...event,
        dateKey,
        index
      }))
    });
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

  return (
    <div className="calendar-container" style={{ background: 'white', color: 'black', padding: '1rem' }}>
      {isLoading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading events...</p>
        </div>
      ) : (
        <div className="calendar-content d-flex gap-3 flex-wrap" style={{ background: 'white', color: 'black' }}>
          <div className="calendar-left flex-fill">
            <Calendar
              onClickDay={handleDateClick}
              tileContent={tileContent}
              value={selectedDate}
              prev2Label={null}
              next2Label={null}
              formatMonthYear={formatMonthYear}
            />
          </div>
        </div>
      )}
    </div>
  );
};

EventCalendarSmall.propTypes = {
  onDateClick: PropTypes.func.isRequired,
};

export default EventCalendarSmall;
