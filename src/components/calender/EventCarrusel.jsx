import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { supabase } from "@/supabaseClient";
import { useNavigate } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';
import "swiper/css";
import "swiper/css/navigation";
import "./EventCarrusel.css";

const EventCarousel = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data: eventsData, error } = await supabase
          .from("events")
          .select(
            "id, title, start_time, end_time, location, max_volunteers, description, user_id"
          );

        if (error) {
          console.error("Error fetching events:", error);
        } else {
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
        }
      } catch (err) {
        console.error("Unexpected error fetching events:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEditEvent = (eventId) => {
    navigate(`/events?eventId=${eventId}`);
  };

  return (
    <div className="events-container">
      <h1 className="events-header">Upcoming Events</h1>
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
                <h2 className="event-title">No upcoming events</h2>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default EventCarousel;