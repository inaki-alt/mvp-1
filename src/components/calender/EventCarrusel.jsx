import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { supabase } from "@/supabaseClient";
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiUsers } from 'react-icons/fi';
import "swiper/css";
import "swiper/css/navigation";
import "./EventCarrusel.css";

const EventCarousel = () => {
  const [events, setEvents] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get the current user
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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Only fetch events if we have a current user
        if (!currentUser) return;

        const { data: eventsData, error } = await supabase
          .from("events")
          .select(
            "id, title, start_time, end_time, location, max_volunteers, description, user_id"
          )
          .eq("user_id", currentUser.id); // Filter by current user's ID

        if (error) {
          console.error("Error fetching events:", error);
          return;
        }

        // Get all event IDs created by this user
        const eventIds = eventsData.map(event => event.id);
        
        // Fetch all volunteers for all events created by this user
        if (eventIds.length > 0) {
          const { data: volunteersData, error: volunteersError } = await supabase
            .from("event_volunteers")
            .select(`
              id, 
              event_id, 
              user_id, 
              status, 
              created_at,
              users:user_id (id, email, first_name, last_name, phone_number),
              events:event_id (title)
            `)
            .in("event_id", eventIds);
            
          if (volunteersError) {
            console.error("Error fetching volunteers:", volunteersError);
          } else {
            setVolunteers(volunteersData);
          }
        }

        const enrichedEvents = await Promise.all(
          eventsData.map(async (event) => {
            // Get total volunteers registered
            const { count: totalVolunteers } = await supabase
              .from("event_volunteers")
              .select("id", { count: "exact" })
              .eq("event_id", event.id);

            // Get confirmed volunteers
            const { count: confirmedVolunteers } = await supabase
              .from("event_volunteers")
              .select("id", { count: "exact" })
              .eq("event_id", event.id)
              .eq("status", "confirmed");

            // Get pending applications
            const { count: pendingApplications } = await supabase
              .from("event_volunteers")
              .select("id", { count: "exact" })
              .eq("event_id", event.id)
              .eq("status", "pending");

            // Get unread messages
            const { count: unreadMessages } = await supabase
              .from("conversation_participants")
              .select("conversation_id", { count: "exact" })
              .eq("user_id", event.user_id)
              .is("last_read_at", null);

            return {
              ...event,
              totalVolunteers,
              confirmed: confirmedVolunteers,
              pending: pendingApplications,
              unread: unreadMessages,
              capacity: event.max_volunteers,
            };
          })
        );

        // Sort events by start time
        const sortedEvents = enrichedEvents.sort(
          (a, b) => new Date(a.start_time) - new Date(b.start_time)
        );
        setEvents(sortedEvents);
      } catch (err) {
        console.error("Unexpected error fetching events:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [currentUser]); // Depend on currentUser so it refetches when user changes

  const handleEditEvent = (eventId) => {
    navigate(`/events?eventId=${eventId}`);
  };

  const handleViewVolunteers = () => {
    // You could navigate to a volunteers page or show a modal
    console.log("All volunteers:", volunteers);
    // For now, just show an alert with the count
    alert(`You have ${volunteers.length} volunteers across all your events.`);
  };

  return (
    <div className="events-container">
      <div className="events-header-container d-flex justify-content-between align-items-center mb-3">
        <h1 className="events-header">Your Events</h1>
        {volunteers.length > 0 && (
          <button 
            className="btn btn-outline-primary d-flex align-items-center gap-2"
            onClick={handleViewVolunteers}
          >
            <FiUsers size={16} />
            <span>All Volunteers ({volunteers.length})</span>
          </button>
        )}
      </div>
      
      <div className="event-swiper-wrapper">
        <Swiper
          modules={[Navigation]}
          navigation={true}
          spaceBetween={20}
          slidesPerView={1}
          className="event-swiper"
        >
          {isLoading ? (
            <SwiperSlide>
              <div className="event-card">
                <h2 className="event-title">Loading events...</h2>
              </div>
            </SwiperSlide>
          ) : !currentUser ? (
            <SwiperSlide>
              <div className="event-card">
                <h2 className="event-title">Please log in to view your events</h2>
              </div>
            </SwiperSlide>
          ) : events.length > 0 ? (
            events.map((event) => (
              <SwiperSlide key={event.id}>
                <div className="event-card">
                  <div className="event-header">
                    <h2 className="event-title">{event.title}</h2>
                    <button 
                      className="edit-button"
                      onClick={() => handleEditEvent(event.id)}
                    >
                      <FiEdit /> Edit
                    </button>
                  </div>
                  <div className="info-section">
                    <div className="info-label">Date &amp; Time</div>
                    <div className="info-content">
                      {new Date(event.start_time).toLocaleString("en-US", {
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="info-section">
                    <div className="info-label">Location</div>
                    <div className="info-content">{event.location}</div>
                  </div>
                  <div className="info-section">
                    <div className="info-label">Description</div>
                    <div className="info-content">{event.description}</div>
                  </div>
                  <div className="event-status">
                    <div className="status-item">
                      <span className="status-label">Attendees</span>
                      <div className="status-value">
                        {event.confirmed} / {event.capacity}
                      </div>
                    </div>
                    <div className="status-item">
                      <span className="status-label">Pending</span>
                      <div className="status-value">{event.pending}</div>
                    </div>
                    <div className="status-item">
                      <span className="status-label">Status</span>
                      <div className="status-value">
                        {event.unread > 0 ? "Unread" : "Read"}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="event-card">
                <h2 className="event-title">You have no events</h2>
                <p className="text-center mt-3">
                  Create your first event to get started!
                </p>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
      
      {/* Optionally, you could add a volunteers section here */}
      {volunteers.length > 0 && (
        <div className="volunteers-summary mt-4">
          <h3>Recent Volunteer Applications</h3>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Event</th>
                  <th>Status</th>
                  <th>Applied</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.slice(0, 5).map(volunteer => (
                  <tr key={volunteer.id}>
                    <td>{volunteer.users?.first_name} {volunteer.users?.last_name}</td>
                    <td>{volunteer.events?.title}</td>
                    <td>
                      <span className={`badge ${volunteer.status === 'confirmed' ? 'bg-success' : volunteer.status === 'pending' ? 'bg-warning' : 'bg-secondary'}`}>
                        {volunteer.status}
                      </span>
                    </td>
                    <td>{new Date(volunteer.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCarousel;