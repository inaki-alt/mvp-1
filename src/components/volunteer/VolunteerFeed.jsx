import React from 'react';
import { volunteerDummyData } from '@/utils/fackData/volunteerData';

const VolunteerFeed = () => {
    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-bold mb-4">Feed (from VolunteerMatch and Altruence)</h5>
                <div className="feed-content">
                    {volunteerDummyData.feed.map((item, index) => (
                        <div key={index} className="feed-item p-3 border-bottom">
                            <div className="d-flex justify-content-between">
                                <span className="badge bg-light-primary">{item.source}</span>
                                <small className="text-muted">{item.date}</small>
                            </div>
                            <p className="mb-0 mt-2">{item.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VolunteerFeed; 