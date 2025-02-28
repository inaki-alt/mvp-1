import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import { FiChevronLeft } from 'react-icons/fi';
import { supabase } from '@/supabaseClient';
import { useNavigate } from 'react-router-dom';

const CalenderContent = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    eventName: "",
    startDate: "",
    startTime: "",
    endTime: "",
    locationName: "",
    locationAddress: "",
    minVolunteers: "",
    maxVolunteers: "",
    eventDescription: "",
  });

  // Generate time options in 30-minute intervals
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of ['00', '30']) {
        const hourFormatted = hour.toString().padStart(2, '0');
        options.push(`${hourFormatted}:${minute}`);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  // When a date is clicked on the mini calendar,
  // update the startDate field (using yyyy-MM-dd format)
  const handleDateClick = (info) => {
    const clickedDate = info.date;
    const formattedDate = format(clickedDate, "yyyy-MM-dd");
    setFormData((prevData) => ({ ...prevData, startDate: formattedDate }));
  };

  // Update form data when an input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle form submission with Supabase integration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (!user) {
        alert('You must be logged in to create an event');
        setIsSubmitting(false);
        return;
      }
      
      // Create date objects from the form inputs
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.startDate}T${formData.endTime}`);
      
      // Format location as a combined string
      const location = `${formData.locationName}, ${formData.locationAddress}`;
      
      // Insert the event into the database
      const { data, error } = await supabase
        .from('events')
        .insert({
          user_id: user.id,
          title: formData.eventName,
          description: formData.eventDescription,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          location: location,
          location_name: formData.locationName,
          location_address: formData.locationAddress,
          min_volunteers: parseInt(formData.minVolunteers) || 0,
          max_volunteers: parseInt(formData.maxVolunteers) || 0,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      console.log("Event Created:", data);
      alert("Event successfully created!");
      
      // Navigate back to events list or to the new event
      navigate('/events');
      
    } catch (error) {
      console.error("Error creating event:", error);
      alert(`Failed to create event: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Back button handler (uses browser history, modify if using react-router)
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="container py-4">
      <button className="btn btn-secondary mb-3" onClick={handleBack}>
        <FiChevronLeft className="me-1" /> Back
      </button>
      <div className="row">
        {/* Left side: A mini calendar */}
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={false}
              selectable={true}
              dateClick={handleDateClick}
              height="auto"
            />
          </div>
        </div>
        {/* Right side: Event creation form */}
        <div className="col-md-8">
          <div className="card shadow-sm p-4">
            <h3 className="mb-4">Create New Event</h3>
            <form onSubmit={handleSubmit}>
              {/* Event Name */}
              <div className="mb-3">
                <label htmlFor="eventName" className="form-label">Event Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="eventName"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleInputChange}
                  placeholder="Enter event name"
                  required
                />
              </div>
              {/* Start Date and Start Time */}
              <div className="row">
                <div className="mb-3 col-md-6">
                  <label htmlFor="startDate" className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3 col-md-6">
                  <label htmlFor="startTime" className="form-label">Start Time</label>
                  <select
                    className="form-select"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select start time</option>
                    {timeOptions.map((time) => (
                      <option key={`start-${time}`} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* End Time as a select dropdown */}
              <div className="mb-3">
                <label htmlFor="endTime" className="form-label">End Time</label>
                <select
                  className="form-select"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select end time</option>
                  {timeOptions.map((time) => (
                    <option key={`end-${time}`} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              {/* Location (Name and Address) */}
              <div className="row">
                <div className="mb-3 col-md-6">
                  <label htmlFor="locationName" className="form-label">Location Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="locationName"
                    name="locationName"
                    value={formData.locationName}
                    onChange={handleInputChange}
                    placeholder="Enter location name"
                    required
                  />
                </div>
                <div className="mb-3 col-md-6">
                  <label htmlFor="locationAddress" className="form-label">Location Address</label>
                  <input
                    type="text"
                    className="form-control"
                    id="locationAddress"
                    name="locationAddress"
                    value={formData.locationAddress}
                    onChange={handleInputChange}
                    placeholder="Enter location address"
                    required
                  />
                </div>
              </div>
              {/* Volunteers Minimum and Maximum */}
              <div className="row">
                <div className="mb-3 col-md-6">
                  <label htmlFor="minVolunteers" className="form-label">Minimum Number of Volunteers</label>
                  <input
                    type="number"
                    className="form-control"
                    id="minVolunteers"
                    name="minVolunteers"
                    value={formData.minVolunteers}
                    onChange={handleInputChange}
                    placeholder="Min volunteers"
                    required
                  />
                </div>
                <div className="mb-3 col-md-6">
                  <label htmlFor="maxVolunteers" className="form-label">Maximum Number of Volunteers</label>
                  <input
                    type="number"
                    className="form-control"
                    id="maxVolunteers"
                    name="maxVolunteers"
                    value={formData.maxVolunteers}
                    onChange={handleInputChange}
                    placeholder="Max volunteers"
                    required
                  />
                </div>
              </div>
              {/* Event Description */}
              <div className="mb-3">
                <label htmlFor="eventDescription" className="form-label">Event Description</label>
                <textarea
                  className="form-control"
                  id="eventDescription"
                  name="eventDescription"
                  rows="4"
                  value={formData.eventDescription}
                  onChange={handleInputChange}
                  placeholder="Describe the event..."
                ></textarea>
              </div>
              <div className="text-end">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalenderContent;