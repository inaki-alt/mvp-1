import React, { useState } from 'react';
import EmailHeader from './EmailHeader';
import PerfectScrollbar from 'react-perfect-scrollbar';
import EmailSIdebar from './EmailSIdebar';
import EmailList from './EmailList';
import EmailDetails from './EmailDetails';
import ComposeTemplateForm from './ComposeTemplateForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmailContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Maintain broadcast templates for each event.
  const [broadcastTemplates, setBroadcastTemplates] = useState({
    1: [
      {
        id: 't1',
        user_img: null,
        user_name: 'Template 1',
        subject: 'Newsletter: Product Updates',
        date: '2023-10-01',
        receiverType: 'Volunteer',
        receiver: 'Alice',
        message:
          'Hello {{name}}, here is your weekly newsletter about product updates.',
        isInvitation: false,
        inviteEvent: '',
        sendMethods: ['Email'],
        variables: []
      },
      {
        id: 't2',
        user_img: null,
        user_name: 'Template 2',
        subject: 'Newsletter: Weekly Roundup',
        date: '2023-10-01',
        receiverType: 'Volunteer',
        receiver: 'Bob',
        message:
          'Hello {{name}}, here is the weekly roundup update. Stay tuned for more details!',
        isInvitation: true,
        inviteEvent: 'Charity Drive',
        sendMethods: ['Email', 'Text Message'],
        variables: []
      },
    ],
    2: [
      {
        id: 't3',
        user_img: null,
        user_name: 'Template 3',
        subject: 'Product Launch Announcement',
        date: '2023-10-05',
        receiverType: 'Event',
        receiver: 'Fundraising Gala',
        message:
          'Dear {{name}}, we are excited to announce our new product launch! Join us for the big reveal.',
        isInvitation: true,
        inviteEvent: 'Fundraising Gala',
        sendMethods: ['Email'],
        variables: []
      },
    ],
    3: [
      {
        id: 't4',
        user_img: null,
        user_name: 'Template 4',
        subject: 'Promo: Limited Time Offer',
        date: '2023-10-10',
        receiverType: 'Volunteer',
        receiver: 'Charlie',
        message: "Hey {{name}}, don't miss our limited time offer!",
        isInvitation: false,
        inviteEvent: '',
        sendMethods: ['Text Message'],
        variables: []
      },
      {
        id: 't5',
        user_img: null,
        user_name: 'Template 5',
        subject: 'Promo: Clearance Sale',
        date: '2023-10-10',
        receiverType: 'Volunteer',
        receiver: 'Alice',
        message: 'Hi {{name}}, our clearance sale is on now! Hurry up!',
        isInvitation: false,
        inviteEvent: '',
        sendMethods: ['Email', 'Text Message'],
        variables: []
      },
    ],
  });

  // When a broadcast event is selected from the sidebar,
  // clear any previously selected template.
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setSelectedTemplate(null);
    setEditMode(false);
  };

  // When a template is chosen from the list (left panel).
  const handleTemplateClick = (template) => {
    setSelectedTemplate(template);
    setEditMode(false);
  };

  // When "Compose Broadcast" is clicked from the header.
  const handleCompose = () => {
    const newTemplate = {
      id: 'new',
      user_img: null,
      user_name: '',
      subject: '',
      date: new Date().toISOString().slice(0, 10),
      receiverType: 'Volunteer',
      receiver: '',
      message: '',
      isInvitation: false,
      inviteEvent: '',
      sendMethods: [],
      variables: [],
    };
    setSelectedTemplate(newTemplate);
    setEditMode(true);
  };

  // Save handler for both new and updated templates.
  const handleSaveTemplate = (template) => {
    if (selectedEvent) {
      setBroadcastTemplates((prev) => {
        const currentTemplates = prev[selectedEvent.id] || [];
        if (template.id === 'new') {
          const newId = `t${Date.now()}`;
          return {
            ...prev,
            [selectedEvent.id]: [...currentTemplates, { ...template, id: newId }],
          };
        } else {
          return {
            ...prev,
            [selectedEvent.id]: currentTemplates.map((t) =>
              t.id === template.id ? template : t
            ),
          };
        }
      });
      // Update the selected template and exit edit mode.
      setSelectedTemplate(template.id === 'new' ? { ...template, id: `t${Date.now()}` } : template);
      setEditMode(false);
    }
  };

  // Handler for sending a broadcast.
  const handleSendBroadcast = () => {
    console.log('Sending broadcast with template:', selectedTemplate);
    if (!selectedTemplate) {
      console.error("No template selected to send broadcast");
      return;
    }
    toast.success("🎈 Broadcast Sent Successfully! 🎉", {
      position: "top-right",
      autoClose: 6000,
    });
  };

  // Get the list of templates for the selected event.
  const templates = selectedEvent ? broadcastTemplates[selectedEvent.id] || [] : [];

  return (
    <>
      <EmailSIdebar
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
        onEventClick={handleEventClick}
      />
      <div className="content-area">
        <EmailHeader onCompose={handleCompose} setSidebarOpen={setSidebarOpen} />
        {selectedEvent ? (
          <div className="row">
            <div className="col-md-4 border-end">
              <PerfectScrollbar>
                <div className="p-3">
                  <h3 className="mb-3">{selectedEvent.name} Broadcast Templates</h3>
                  {templates.length > 0 ? (
                    templates.map((template) => (
                      <EmailList
                        key={template.id}
                        id={template.id}
                        user_img={template.user_img}
                        user_name={template.user_name}
                        subject={template.subject}
                        date={template.date}
                        handleDetailsShow={() => handleTemplateClick(template)}
                      />
                    ))
                  ) : (
                    <p>No templates available for this event.</p>
                  )}
                </div>
              </PerfectScrollbar>
            </div>
            <div className="col-md-8">
              {selectedTemplate ? (
                editMode ? (
                  <ComposeTemplateForm
                    initialTemplate={selectedTemplate}
                    onClose={() => setEditMode(false)}
                    onSave={handleSaveTemplate}
                  />
                ) : (
                  <div className="p-3">
                    <EmailDetails setShowDetails={() => {}} templateData={selectedTemplate} />
                    <div className="d-flex justify-content-end gap-2 mt-3">
                      <button className="btn btn-primary" onClick={() => setEditMode(true)}>
                        Update
                      </button>
                      <button className="btn btn-success" onClick={handleSendBroadcast}>
                        Send Broadcast
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <div className="text-center py-5">
                  <p>Please select a template from the list.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-5">
            <h4>No Broadcast Selected</h4>
            <p>Please select a broadcast event from the sidebar to view its templates.</p>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default EmailContent;