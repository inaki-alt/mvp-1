import React, { useState } from 'react';
import OpportunityModal from './OpportunityModal';
import './OpportunitiesFeed.css';
import { FiMonitor, FiHeart, FiSun, FiBook, FiBox, FiHome } from 'react-icons/fi';

const getIcon = (category) => {
    switch (category) {
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

const opportunities = [
    {
        id: 1,
        title: 'Tech Buddy Senior Center',
        organizer: 'Sunset Center',
        duration: '6 h',
        date: 'March 15, 2025',
        distance: '2 Miles Away',
        category: 'TECHNOLOGY'
    },
    {
        id: 2,
        title: 'Beach Cleanup',
        organizer: 'Ocean Guardians',
        duration: '2 h',
        date: 'March 15, 2025',
        distance: '2 Miles Away',
        category: 'ENVIRONMENT'
    },
    {
        id: 3,
        title: 'Community Garden',
        organizer: 'Adamson Community',
        duration: '21 h',
        date: 'March 15, 2025',
        distance: '2 Miles Away',
        category: 'COMMUNITY'
    },
    {
        id: 4,
        title: 'Food Bank Volunteers',
        organizer: 'BBI Initiative',
        duration: '21 h',
        date: 'March 15, 2025',
        distance: '2 Miles Away',
        category: 'FOOD SECURITY'
    },
    {
        id: 5,
        title: 'Library Reading Program',
        organizer: 'City Library',
        duration: '',
        date: 'March 15, 2025',
        distance: '2 Miles Away',
        category: 'EDUCATION'
    },
    {
        id: 6,
        title: 'Animal Shelter Care',
        organizer: 'Happy Paws',
        duration: '',
        date: 'March 15, 2025',
        distance: '2 Miles Away',
        category: 'ANIMAL CARE'
    },
    {
        id: 7,
        title: 'Park Cleanup Day',
        organizer: 'Parks Department',
        duration: '',
        date: 'March 15, 2025',
        distance: '2 Miles Away',
        category: 'ENVIRONMENT'
    },
    {
        id: 8,
        title: 'Youth Mentoring Program',
        organizer: 'Future Leaders',
        duration: '',
        date: 'March 15, 2025',
        distance: '2 Miles Away',
        category: 'EDUCATION'
    }
];

const OpportunitiesFeed = () => {
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);

    const handleOpportunityClick = (opportunity) => {
        setSelectedOpportunity({
            ...opportunity,
            description: "Join me and other community members to help clean up our local beach! We'll focus on collecting litter, trimming overgrown areas, and making our beach a beautiful place for everyone. After the cleanup, we'll have a small picnic with refreshments provided by local businesses.",
            time: "7:30AM - 10:30PM",
            date: "Sunday, September 14, 2024",
            address: "804 Guerrero St",
            city: "San Francisco, CA 94110, USA",
            enrolledCount: "24",
            rewardPoints: "250",
            sponsors: ["EcoStar", "Green Hope Co.", "Blue Mug Brewery"],
            image: "/path/to/your/image.jpg" // Add your image path here
        });
    };

    return (
        <>
            <div className="opportunities-feed custom-scrollbar">
                {opportunities.map((opp) => (
                    <div 
                        key={opp.id} 
                        className="opportunity-item"
                        onClick={() => handleOpportunityClick(opp)}
                    >
                        <div className="background-icon">
                            {getIcon(opp.category)}
                        </div>
                        <div className="opportunity-content">
                            <div className="category-and-org">
                                <span className="category-badge">{opp.category}</span>
                                <span className="organizer">
                                    {opp.organizer} {opp.duration && `• ${opp.duration}`}
                                </span>
                            </div>
                            <h3 className="opportunity-title">
                                {opp.title}
                            </h3>
                            {opp.date && opp.distance && (
                                <div className="date-distance">
                                    {opp.date} • {opp.distance}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {selectedOpportunity && (
                <OpportunityModal 
                    opportunity={selectedOpportunity}
                    onClose={() => setSelectedOpportunity(null)}
                />
            )}
        </>
    );
};

export default OpportunitiesFeed;