import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';

const EmailDetails = ({ setShowDetails, templateData }) => {
  // Debug: Log the received templateData.
  console.log("EmailDetails received:", templateData);

  if (!templateData || Object.keys(templateData).length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#000' }}>
        <p>No template data available.</p>
      </div>
    );
  }

  // Destructure the templateData properties.
  const {
    id,
    user_name,
    subject,
    date,
    receiverType,
    receiver,
    message,
    isInvitation,
    inviteEvent,
    sendMethods,
  } = templateData;

  const headerText = id === 'new' ? 'Compose New Broadcast' : `Editing: ${subject}`;

  return (
    <div
      className="email-details"
      style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '20px',
        color: '#333',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      }}
    >
      {/* Header Section */}
      <div
        className="header"
        style={{
          marginBottom: '20px',
          borderBottom: '1px solid #e0e0e0',
          paddingBottom: '10px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <button
          onClick={() => setShowDetails(false)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            marginRight: '10px',
          }}
          title="Back to Templates List"
        >
          <FiArrowLeft size={20} color="#333" />
        </button>
        <h4 style={{ margin: 0, fontWeight: 500 }}>{headerText}</h4>
      </div>

      {/* Details Section */}
      <div className="body" style={{ lineHeight: 1.6 }}>
        <p>
          <strong>User Name:</strong> {user_name}
        </p>
        <p>
          <strong>Subject:</strong> {subject}
        </p>
        <p>
          <strong>Date:</strong> {date}
        </p>
        <p>
          <strong>Receiver Type:</strong> {receiverType}
        </p>
        <p>
          <strong>Receiver:</strong> {receiver}
        </p>
        <p>
          <strong>Message:</strong>
        </p>
        <div
          style={{
            border: '1px solid #e0e0e0',
            padding: '10px',
            background: '#fafafa',
            borderRadius: '4px',
            marginBottom: '10px',
          }}
        >
          {message}
        </div>
        <p>
          <strong>Invitation:</strong> {isInvitation ? 'Yes' : 'No'}
        </p>
        {isInvitation && (
          <p>
            <strong>Invite Event:</strong> {inviteEvent}
          </p>
        )}
        <p>
          <strong>Send Methods:</strong>{' '}
          {sendMethods && sendMethods.length ? sendMethods.join(', ') : 'N/A'}
        </p>
      </div>
    </div>
  );
};

export default EmailDetails;