import React, { useState } from 'react';
import { 
    FiCalendar, 
    FiMapPin, 
    FiUsers, 
    FiGrid,
    FiMessageSquare,
    FiLink,
    FiArrowLeft,
    FiArrowRight,
    FiClock,
    FiCheck,
    FiInfo,
    FiAward,
    FiStar,
    FiTrendingUp
} from 'react-icons/fi';
import QRModal from './QRModal';
import './EventsManagement.css';

const dummyEvents = [
    {
        id: 1,
        title: 'Tech Support for Seniors',
        date: '02/10/2025',
        time: '06:00 PM',
        endDate: '02/11/2025',
        endTime: '12:00 AM',
        location: 'Senior Center',
        maxVolunteers: '1/8',
        description: 'Help elderly community members with technology, including smartphone basics, email setup, and internet safety.',
        status: 'Upcoming',
        rewards: {
            points: 150,
            badges: ['Tech Helper', 'Community Star'],
            impact: '4 Seniors Helped'
        }
    },
    {
        id: 2,
        title: 'Beach Cleanup Initiative',
        date: '02/15/2025',
        time: '08:00 AM',
        endDate: '02/15/2025',
        endTime: '12:00 PM',
        location: 'Ocean Beach',
        maxVolunteers: '3/10',
        description: 'Join us in cleaning up the beach and protecting marine life. Equipment and refreshments provided.',
        status: 'Confirmed',
        rewards: {
            points: 200,
            badges: ['Earth Guardian', 'Ocean Protector'],
            impact: '50 lbs Waste Collected'
        }
    },
    {
        id: 3,
        title: 'Food Bank Distribution',
        date: '02/20/2025',
        time: '09:00 AM',
        endDate: '02/20/2025',
        endTime: '02:00 PM',
        location: 'Community Food Bank',
        maxVolunteers: '5/12',
        description: 'Help sort and distribute food to families in need. Training provided on-site.',
        status: 'Upcoming',
        rewards: {
            points: 175,
            badges: ['Hunger Fighter', 'Community Hero'],
            impact: '100 Families Served'
        }
    },
    {
        id: 4,
        title: 'Youth Mentoring Program',
        date: '02/25/2025',
        time: '03:00 PM',
        endDate: '02/25/2025',
        endTime: '06:00 PM',
        location: 'City Library',
        maxVolunteers: '2/6',
        description: 'Mentor high school students in academic subjects and career guidance.',
        status: 'Confirmed',
        rewards: {
            points: 225,
            badges: ['Youth Mentor', 'Education Champion'],
            impact: '6 Students Mentored'
        }
    },
    {
        id: 5,
        title: 'Park Restoration Project',
        date: '02/28/2025',
        time: '10:00 AM',
        endDate: '02/28/2025',
        endTime: '04:00 PM',
        location: 'Central Park',
        maxVolunteers: '8/15',
        description: 'Help restore park facilities, plant trees, and create new garden spaces.',
        status: 'Upcoming',
        rewards: {
            points: 180,
            badges: ['Green Thumb', 'Park Ranger'],
            impact: '10 Trees Planted'
        }
    }
];

const EventsManagement = () => {
    const [selectedMonth, setSelectedMonth] = useState('February 2025');
    const [selectedEvent, setSelectedEvent] = useState(dummyEvents[0]);
    const [showQRModal, setShowQRModal] = useState(false);

    const handleEventSelect = (event) => {
        setSelectedEvent(event);
    };

    const handleOpenQRModal = () => {
        setShowQRModal(true);
    };

    const handleCloseQRModal = () => {
        setShowQRModal(false);
    };

    return (
        <div className="events-management-container">
            <div className="events-sidebar">
                <div className="sidebar-header">
                    <div className="month-selector">
                        <button className="arrow-btn">
                            <FiArrowLeft size={20} />
                        </button>
                        <h2>{selectedMonth}</h2>
                        <button className="arrow-btn">
                            <FiArrowRight size={20} />
                        </button>
                    </div>
                </div>
                
                <div className="events-list">
                    {dummyEvents.map((event) => (
                        <div 
                            key={event.id} 
                            className={`email-list-item ${event.id === selectedEvent.id ? 'selected' : ''}`}
                            onClick={() => handleEventSelect(event)}
                        >
                            <div className="event-item-content">
                                <div className={`event-avatar ${event.status.toLowerCase()}`}>
                                    <FiCalendar size={20} />
                                </div>
                                <div className="event-info">
                                    <h3>{event.title}</h3>
                                    <div className="event-details">
                                        <span className="event-time">
                                            <FiClock size={14} />
                                            {event.time}
                                        </span>
                                        <span className="event-status">
                                            <FiUsers size={14} />
                                            {event.maxVolunteers}
                                        </span>
                                    </div>
                                </div>
                                <div className={`status-badge ${event.status.toLowerCase()}`}>
                                    {event.status}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="event-details-panel">
                <div className="event-header">
                    <div className="event-title">
                        <h1>{selectedEvent.title}</h1>
                        <span className={`status-badge ${selectedEvent.status.toLowerCase()}`}>
                            {selectedEvent.status}
                        </span>
                    </div>
                </div>
                
                <div className="event-info-container">
                    <div className="cards-grid">
                        <div className="info-card time-card">
                            <div className="card-icon">
                                <FiClock />
                            </div>
                            <div className="card-content">
                                <h3>Date & Time</h3>
                                <p>{selectedEvent.date} at {selectedEvent.time}</p>
                                <p className="secondary-text">Until {selectedEvent.endDate} at {selectedEvent.endTime}</p>
                            </div>
                        </div>

                        <div className="info-card location-card">
                            <div className="card-icon">
                                <FiMapPin />
                            </div>
                            <div className="card-content">
                                <h3>Location</h3>
                                <p>{selectedEvent.location}</p>
                                <button className="card-action-btn">
                                    Get Directions
                                </button>
                            </div>
                        </div>

                        <div className="info-card volunteers-card">
                            <div className="card-icon">
                                <FiUsers />
                            </div>
                            <div className="card-content">
                                <h3>Volunteer Capacity</h3>
                                <p>{selectedEvent.maxVolunteers}</p>
                                <div className="capacity-bar">
                                    <div className="capacity-fill" style={{width: '25%'}}></div>
                                </div>
                            </div>
                        </div>

                        <div className="info-card description-card">
                            <div className="card-icon">
                                <FiInfo />
                            </div>
                            <div className="card-content">
                                <h3>Description</h3>
                                <p>{selectedEvent.description}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rewards-section">
                        <h2>
                            <FiAward className="section-icon" />
                            Rewards & Impact
                        </h2>
                        <div className="rewards-grid">
                            <div className="reward-card points">
                                <div className="reward-icon">
                                    <FiStar />
                                </div>
                                <div className="reward-content">
                                    <h3>Points</h3>
                                    <p className="reward-value">{selectedEvent.rewards.points}</p>
                                    <span className="reward-label">Volunteer Points</span>
                                </div>
                            </div>

                            <div className="reward-card badges">
                                <div className="reward-icon">
                                    <FiAward />
                                </div>
                                <div className="reward-content">
                                    <h3>Badges</h3>
                                    <div className="badges-container">
                                        {selectedEvent.rewards.badges.map((badge, index) => (
                                            <span key={index} className="badge">{badge}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="reward-card impact">
                                <div className="reward-icon">
                                    <FiTrendingUp />
                                </div>
                                <div className="reward-content">
                                    <h3>Impact</h3>
                                    <p className="impact-value">{selectedEvent.rewards.impact}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button 
                            className="action-button glass"
                            onClick={handleOpenQRModal}
                        >
                            <div className="button-content">
                                <FiGrid className="button-icon" />
                                <span>Scan QR</span>
                            </div>
                        </button>
                        <button className="action-button glass">
                            <div className="button-content">
                                <FiMessageSquare className="button-icon" />
                                <span>Message</span>
                            </div>
                        </button>
                        <button className="action-button glass">
                            <div className="button-content">
                                <FiCheck className="button-icon" />
                                <span>Check-In</span>
                            </div>
                        </button>
                        <button className="action-button primary">
                            <div className="button-content">
                                <FiLink className="button-icon" />
                                <span>Add to Calendar</span>
                            </div>
                            <div className="button-glow"></div>
                        </button>
                    </div>
                </div>
            </div>

            {showQRModal && (
                <QRModal 
                    event={selectedEvent}
                    onClose={handleCloseQRModal}
                />
            )}
        </div>
    );
};

export default EventsManagement; 