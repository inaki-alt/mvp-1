import React, { useState } from 'react';
import { 
    FiX, FiCalendar, FiMapPin, FiAward, 
    FiUsers, FiClock, FiMonitor, FiHeart, 
    FiSun, FiHome, FiBook, FiBox 
} from 'react-icons/fi';
import './OpportunityModal.css';
import ConfirmationModal from './ConfirmationModal';

const getBackgroundIcon = (category) => {
    switch (category?.toUpperCase()) {
        case 'TECHNOLOGY':
            return <FiMonitor />;
        case 'ENVIRONMENT':
            return <FiSun />;
        case 'COMMUNITY':
            return <FiHome />;
        case 'FOOD SECURITY':
            return <FiBox />;
        case 'EDUCATION':
            return <FiBook />;
        case 'ANIMAL CARE':
            return <FiHeart />;
        default:
            return <FiHome />;
    }
};

const OpportunityModal = ({ opportunity, onClose }) => {
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleEnroll = (e) => {
        e.stopPropagation();
        setShowConfirmation(true);
    };

    if (showConfirmation) {
        return <ConfirmationModal 
            opportunity={opportunity} 
            onClose={() => {
                setShowConfirmation(false);
                onClose();
            }} 
        />;
    }

    return (
        <div className="opportunity-modal-overlay" onClick={onClose}>
            <div className="opportunity-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-background-icon">
                    {getBackgroundIcon(opportunity.category)}
                </div>
                
                <button className="modal-close" onClick={onClose}>
                    <FiX size={20} />
                </button>

                <div className="enrollment-info">
                    <FiUsers className="icon" />
                    <span>{opportunity.enrolledCount} Volunteers Enrolled</span>
                </div>

                <div className="modal-content">
                    <h2>{opportunity.title}</h2>
                    <p className="organizer">{opportunity.organizer}</p>

                    <button className="enroll-button" onClick={handleEnroll}>
                        <FiUsers className="button-icon" />
                        Enroll Now
                    </button>

                    <section className="event-details">
                        <h3>About This Event</h3>
                        <p>{opportunity.description}</p>
                    </section>

                    <section className="time-location">
                        <h3>Time & Date</h3>
                        <div className="detail-item">
                            <div className="icon-wrapper">
                                <FiClock className="icon" />
                            </div>
                            <div className="detail-text">
                                <p>{opportunity.time}</p>
                                <p>{opportunity.date}</p>
                            </div>
                            <button className="calendar-button">
                                <FiCalendar className="button-icon" />
                                Add To Calendar
                            </button>
                        </div>

                        <h3>Location</h3>
                        <div className="detail-item">
                            <div className="icon-wrapper">
                                <FiMapPin className="icon" />
                            </div>
                            <div className="detail-text">
                                <p>{opportunity.address}</p>
                                <p>{opportunity.city}</p>
                            </div>
                            <button className="directions-button">
                                <FiMapPin className="button-icon" />
                                Get Directions
                            </button>
                        </div>
                    </section>

                    <section className="rewards-sponsors">
                        <div className="rewards">
                            <h3>Reward Points</h3>
                            <div className="points">
                                <FiAward className="reward-icon" />
                                <span>{opportunity.rewardPoints}</span>
                                <button className="see-all">See All</button>
                            </div>
                        </div>

                        <div className="sponsors">
                            <h3>Sponsors</h3>
                            <div className="sponsors-list">
                                {opportunity.sponsors?.map((sponsor, index) => (
                                    <span key={index}>{sponsor}</span>
                                ))}
                                <button className="see-all">See All</button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default OpportunityModal; 