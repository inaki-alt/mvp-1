import React from 'react';
import { volunteerDummyData } from '@/utils/fackData/volunteerData';
import { FiCopy } from 'react-icons/fi';

const NextEventCard = () => {
    const { nextEvent } = volunteerDummyData;

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(nextEvent.address);
    };

    return (
        <div className="card mb-4">
            <div className="card-body">
                <h5 className="card-title fw-bold mb-4">Next Event</h5>
                <h6 className="mb-3">{nextEvent.title}</h6>
                <p className="mb-2">{nextEvent.date} at {nextEvent.time}</p>
                <p className="mb-2 text-muted cursor-pointer" onClick={handleCopyAddress}>
                    <FiCopy className="me-2" />
                    Address (click to copy address)
                </p>
                <p className="mb-0 text-muted">{nextEvent.additionalDetails}</p>
            </div>
        </div>
    );
};

export default NextEventCard; 