import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiUser, FiUsers } from 'react-icons/fi';
import './ViewToggle.css';

const ViewToggle = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const isVolunteerPath = (path) => {
        // First check if it's not /volunteers
        if (path.startsWith('/volunteers')) {
            return false;
        }
        // Then check if it's /volunteer
        return path.startsWith('/volunteer');
    };

    const [isVolunteer, setIsVolunteer] = useState(isVolunteerPath(location.pathname));

    useEffect(() => {
        setIsVolunteer(isVolunteerPath(location.pathname));
    }, [location]);

    const handleToggle = () => {
        // Don't toggle if we're on /volunteers path
        if (location.pathname.startsWith('/volunteers')) {
            return;
        }

        const newPath = isVolunteer 
            ? location.pathname.replace('/volunteer', '') 
            : '/volunteer' + (location.pathname === '/' ? '/home' : location.pathname);
        
        navigate(newPath);
        window.location.reload();
    };

    return (
        <div className="view-toggle-container">
            <button 
                className={`view-toggle-button ${isVolunteer ? 'volunteer' : 'admin'}`}
                onClick={handleToggle}
            >
                <div className="toggle-icons">
                    <div className={`icon-container ${!isVolunteer ? 'active' : ''}`}>
                        <FiUser className="toggle-icon" />
                        <span className="toggle-label">Non Profit</span>
                    </div>
                    <div className={`icon-container ${isVolunteer ? 'active' : ''}`}>
                        <FiUsers className="toggle-icon" />
                        <span className="toggle-label">Volunteer</span>
                    </div>
                </div>
                <div className="toggle-slider"></div>
            </button>
        </div>
    );
};

export default ViewToggle; 