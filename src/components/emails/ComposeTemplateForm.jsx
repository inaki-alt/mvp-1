import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ComposeTemplateForm = ({ initialTemplate, onClose, onSave }) => {
  const [template, setTemplate] = useState({
    ...initialTemplate,
    variables: initialTemplate.variables || [],
    // Convert date to a Date object if it's a string
    date: typeof initialTemplate.date === 'string' ? new Date(initialTemplate.date) : initialTemplate.date || new Date()
  });

  // Sample options for Receiver and Invitation fields
  const volunteerOptions = ["Alice", "Bob", "Charlie"];
  const eventOptions = ["Fundraising Gala", "Charity Drive", "Product Launch"];
  const sendMethodOptions = ["Email", "Text Message"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTemplate(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // When receiverType changes, clear the receiver value.
  useEffect(() => {
    setTemplate(prev => ({ ...prev, receiver: '' }));
  }, [template.receiverType]);

  const handleSendMethodChange = (e) => {
    const { value, checked } = e.target;
    setTemplate(prev => {
      let newMethods = prev.sendMethods || [];
      if (checked) {
        if (!newMethods.includes(value)) {
          newMethods.push(value);
        }
      } else {
        newMethods = newMethods.filter(method => method !== value);
      }
      return { ...prev, sendMethods: newMethods };
    });
  };

  // Functions to manage template variables
  const addVariable = () => {
    setTemplate(prev => ({
      ...prev,
      variables: [...(prev.variables || []), { key: '', value: '' }]
    }));
  };

  const removeVariable = (index) => {
    setTemplate(prev => {
      const newVariables = [...(prev.variables || [])];
      newVariables.splice(index, 1);
      return { ...prev, variables: newVariables };
    });
  };

  const handleVariableChange = (index, field, newValue) => {
    setTemplate(prev => {
      const newVariables = [...(prev.variables || [])];
      newVariables[index] = { ...newVariables[index], [field]: newValue };
      return { ...prev, variables: newVariables };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert date back to YYYY-MM-DD format if necessary before saving.
    onSave({ ...template, date: template.date.toISOString().slice(0, 10) });
  };

  return (
    <div className="card border-0 shadow-sm">
      <div 
        className="card-header" 
        style={{ backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0' }}
      >
        <h5 className="card-title mb-0">
          {initialTemplate.id === 'new' ? 'Compose New Broadcast Template' : 'Edit Broadcast Template'}
        </h5>
      </div>
      <div className="card-body" style={{ backgroundColor: '#fff' }}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Template Name</label>
            <input
              type="text"
              className="form-control"
              name="user_name"
              value={template.user_name}
              onChange={handleChange}
              placeholder="Enter template name"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Subject</label>
            <input
              type="text"
              className="form-control"
              name="subject"
              value={template.subject}
              onChange={handleChange}
              placeholder="Enter subject"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label d-block">Date</label>
            <DatePicker
              selected={template.date}
              onChange={(date) => setTemplate(prev => ({ ...prev, date }))}
              dateFormat="yyyy-MM-dd"
              className="form-control"
              required
              // You can add custom CSS classes for a more stylish calendar
              calendarClassName="custom-datepicker"
              popperClassName="custom-datepicker-popper"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Receiver Type</label>
            <select
              className="form-select"
              name="receiverType"
              value={template.receiverType}
              onChange={handleChange}
              required
            >
              <option value="Volunteer">Volunteer</option>
              <option value="Event">Event</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Receiver</label>
            {template.receiverType === 'Volunteer' ? (
              <select
                className="form-select"
                name="receiver"
                value={template.receiver}
                onChange={handleChange}
                required
              >
                <option value="">Select Volunteer</option>
                {volunteerOptions.map(vol => (
                  <option key={vol} value={vol}>{vol}</option>
                ))}
              </select>
            ) : (
              <select
                className="form-select"
                name="receiver"
                value={template.receiver}
                onChange={handleChange}
                required
              >
                <option value="">Select Event</option>
                {eventOptions.map(ev => (
                  <option key={ev} value={ev}>{ev}</option>
                ))}
              </select>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Message</label>
            <textarea
              className="form-control"
              name="message"
              value={template.message}
              onChange={handleChange}
              placeholder="Enter your message here. Use variables like {{name}}, {{date}}, etc."
              rows="4"
              required
            ></textarea>
            <small className="text-muted">
              You can use variables: {'{{name}}'}, {'{{date}}'}
            </small>
          </div>
          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              name="isInvitation"
              checked={template.isInvitation}
              onChange={handleChange}
              id="invitationCheck"
            />
            <label className="form-check-label" htmlFor="invitationCheck">
              Invitation
            </label>
          </div>
          {template.isInvitation && (
            <div className="mb-3">
              <label className="form-label">Select Invitation Event</label>
              <select
                className="form-select"
                name="inviteEvent"
                value={template.inviteEvent}
                onChange={handleChange}
                required={template.isInvitation}
              >
                <option value="">Select Invitation Event</option>
                {eventOptions.map(ev => (
                  <option key={ev} value={ev}>{ev}</option>
                ))}
              </select>
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">Send Methods</label>
            <div className="form-check">
              {sendMethodOptions.map(method => (
                <div key={method}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`send-${method}`}
                    value={method}
                    checked={template.sendMethods.includes(method)}
                    onChange={handleSendMethodChange}
                  />
                  <label className="form-check-label" htmlFor={`send-${method}`}>
                    {method}
                  </label>
                </div>
              ))}
            </div>
          </div>
          {/* Template Variables Field */}
          <div className="mb-3">
            <label className="form-label">Template Variables</label>
            <div>
              {(template.variables || []).map((variable, index) => (
                <div key={index} className="row g-2 mb-2 align-items-center">
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Variable Name"
                      value={variable.key}
                      onChange={(e) => handleVariableChange(index, 'key', e.target.value)}
                    />
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Variable Value"
                      value={variable.value}
                      onChange={(e) => handleVariableChange(index, 'value', e.target.value)}
                    />
                  </div>
                  <div className="col-auto">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => removeVariable(index)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button type="button" className="btn btn-secondary" onClick={addVariable}>
                Add Variable
              </button>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {initialTemplate.id === 'new' ? 'Save Template' : 'Update Template'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComposeTemplateForm; 