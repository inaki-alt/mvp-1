import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import { FiChevronLeft } from 'react-icons/fi';

const CalenderContent = () => {
  const [formData, setFormData] = useState({
    eventName: "",
    startDate: "",
    startTime: "",
    locationName: "",
    locationAddress: "",
    minVolunteers: "",
    maxVolunteers: "",
    eventDescription: "",
  });

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

  // Compute an end time based on the chosen start time.
  // Here we assume a default event duration of 1 hour.
  const computeEndTime = (startTime) => {
    if (!startTime) return "";
    const [hours, minutes] = startTime.split(":").map(Number);
    const date = new Date(1970, 0, 1, hours, minutes);
    date.setHours(date.getHours() + 1); // add one hour by default
    return format(date, 'hh:mm a');
  };

  // Handle form submission (replace with your actual submission logic)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Event Created:", formData);
    alert("Event Created! Check console for details.");
    // Optionally reset formData or navigate away
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
                  <input
                    type="time"
                    className="form-control"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              {/* End Time (calculated) */}
              <div className="mb-3">
                <label htmlFor="endTime" className="form-label">End Time (Calculated)</label>
                <input
                  type="text"
                  className="form-control"
                  id="endTime"
                  value={computeEndTime(formData.startTime)}
                  readOnly
                />
                {formData.startTime && (
                  <small className="form-text text-muted">Default duration is 1 hour</small>
                )}
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
                <button type="submit" className="btn btn-primary">
                  Create Event
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