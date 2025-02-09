import { format, isValid } from 'date-fns';
import React from 'react'
import {FiEdit, FiMapPin, FiTrash, FiUsers} from 'react-icons/fi'

const formatEventTimeTwo = (date) => {
    const parsedDate = new Date(date); // Convert to Date object

    // Check if the parsed date is valid
    if (isValid(parsedDate)) {
        const hours = parsedDate.getHours();
        const minutes = parsedDate.getMinutes();
        const seconds = parsedDate.getSeconds();

        // Check if the time is midnight (00:00:00)
        if (hours === 0 && minutes === 0 && seconds === 0) {
            // If it's midnight, return the date without time, or use default '12:00 AM'
            return format(parsedDate, 'yyyy.MM.dd 12:00 a');
        } else {
            // If it's not midnight, format the full date with time
            return format(parsedDate, 'yyyy.MM.dd hh:mm a');
        }
    } else {
        return 'Invalid date'; // Handle invalid date
    }
};


const EventDetails = ({ selectedEvent, handleEditEvent, handleDeleteEvent }) => {
    // Use optional chaining to avoid errors if extendedProps or details is missing
    const location = selectedEvent.extendedProps?.details?.location || "No location provided";
    const category = selectedEvent.extendedProps?.category || "No category";
    const nofVolunteers = selectedEvent.extendedProps?.details?.NofVolunteers || "N/A";
    const details = selectedEvent.extendedProps?.details?.details || "";

    // Inline styles for white & black theme
    const containerStyle = {
        background: '#fff',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        color: '#000',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '500px',
        margin: '0 auto'
    };

    const headerStyle = {
        marginBottom: '15px'
    };

    const timeRowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px'
    };

    const infoRowStyle = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '8px'
    };

    const iconStyle = {
        marginRight: '8px'
    };

    const dividerStyle = {
        margin: '15px 0',
        borderTop: '1px solid #000' // Solid black divider
    };

    const buttonContainerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '15px'
    };

    const buttonStyle = {
        flex: '1',
        padding: '10px',
        borderRadius: '4px',
        border: '2px solid #000', // Black border
        cursor: 'pointer',
        fontSize: '14px',
        backgroundColor: '#fff', // White background
        color: '#000', // Black text
    };

    const editButtonStyle = {
        ...buttonStyle,
        marginRight: '10px'
    };

    const deleteButtonStyle = {
        ...buttonStyle,
    };

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h2>{selectedEvent.title}</h2>
            </div>
            <div style={timeRowStyle}>
                <div>
                    <strong>Start:</strong> {formatEventTimeTwo(selectedEvent.start)}
                </div>
                <div>
                    <strong>End:</strong> {formatEventTimeTwo(selectedEvent.end)}
                </div>
            </div>
            <div style={infoRowStyle}>
                <FiMapPin style={iconStyle} size={16} />
                <span>{location}</span>
            </div>
            <div style={infoRowStyle}>
                <span>{category}</span>
            </div>
            <div style={infoRowStyle}>
                <FiUsers style={iconStyle} size={16} />
                <span>{nofVolunteers} volunteer{nofVolunteers !== 1 && "s"}</span>
            </div>
            {details && (
                <div style={{ marginTop: '10px' }}>
                    <p>{details}</p>
                </div>
            )}
            <div style={dividerStyle}></div>
            <div style={buttonContainerStyle}>
                <button style={editButtonStyle} onClick={handleEditEvent}>
                    <FiEdit style={{ marginRight: '5px' }} size={14} /> Edit
                </button>
                <button style={deleteButtonStyle} onClick={handleDeleteEvent}>
                    <FiTrash style={{ marginRight: '5px' }} size={14} /> Delete
                </button>
            </div>
        </div>
    )
}

export default EventDetails