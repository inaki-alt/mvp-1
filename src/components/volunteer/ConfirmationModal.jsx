import React from 'react';
import { 
    FiMapPin, 
    FiCalendar, 
    FiArrowLeft, 
    FiShare2, 
    FiCheck,
    FiGrid,
    FiBox,
    FiChevronRight
} from 'react-icons/fi';
import './ConfirmationModal.css';

const ConfirmationModal = ({ opportunity, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="confirmation-modal">
                <div className="confirmation-header">
                    <button className="header-button" onClick={onClose}>
                        <FiArrowLeft size={24} />
                    </button>
                    <h1>Confirmation</h1>
                    <button className="header-button">
                        <FiShare2 size={24} />
                    </button>
                </div>

                <div className="confirmation-content">
                    <div className="illustration-container">
                        <FiBox size={120} className="placeholder-icon" />
                    </div>

                    <div className="action-buttons">
                        <button className="action-button black-button">
                            <FiMapPin size={20} />
                            Check In
                        </button>
                        <button className="action-button black-button">
                            <FiGrid size={20} />
                            Scan QR
                        </button>
                    </div>

                    <div className="event-confirmation">
                        <FiCalendar size={20} />
                        <span>Event Confirmed</span>
                        <FiChevronRight size={20} />
                    </div>

                    <h2 className="event-title">{opportunity.title}</h2>

                    <div className="event-section">
                        <h3>Time & Date</h3>
                        <div className="time-date">
                            <p className="time">{opportunity.time}</p>
                            <p className="date">{opportunity.date}</p>
                        </div>
                        <button className="section-button">
                            <FiCalendar size={20} />
                            Add To Calendar
                        </button>
                    </div>

                    <div className="event-section">
                        <h3>Location</h3>
                        <div className="location-map">
                            <div className="map-placeholder"></div>
                            <div className="location-details">
                                <p>{opportunity.address}</p>
                                <p>{opportunity.city}</p>
                            </div>
                        </div>
                        <button className="section-button">
                            <FiMapPin size={20} />
                            Get Directions
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal; 