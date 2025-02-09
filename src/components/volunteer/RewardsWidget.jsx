import React from 'react';

const RewardsWidget = () => {
    // Replace these values with your actual data or calculations
    const rewardsStats = {
        totalRewards: 1500,
        lastMonthRewards: 300,
        batches: [
            { batchName: "Bronze", count: 5, reward: 200 },
            { batchName: "Silver", count: 3, reward: 500 },
            { batchName: "Gold", count: 1, reward: 800 },
        ],
    };

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title fw-bold mb-4">Rewards Showroom</h5>

                {/* Overall Rewards Stats */}
                <div className="row">
                    <div className="col-md-6 mb-3 mb-md-0">
                        <div className="d-flex flex-column align-items-center p-3 border rounded">
                            <span className="small text-muted">Total Rewards</span>
                            <span className="fw-bold fs-3">{rewardsStats.totalRewards}</span>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="d-flex flex-column align-items-center p-3 border rounded">
                            <span className="small text-muted">Last Month Rewards</span>
                            <span className="fw-bold fs-3">{rewardsStats.lastMonthRewards}</span>
                        </div>
                    </div>
                </div>

                {/* Batches Section */}
                <h6 className="fw-bold mt-4 mb-3">Batches</h6>
                <div className="d-flex flex-wrap gap-3">
                    {rewardsStats.batches.map((batch, index) => (
                        <div 
                            key={index} 
                            className="p-3 border rounded text-center" 
                            style={{ minWidth: "120px" }}
                        >
                            <h6 className="mb-1">{batch.batchName}</h6>
                            <small className="text-muted">Count: {batch.count}</small>
                            <div className="fw-bold mt-2">Reward: {batch.reward}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RewardsWidget; 