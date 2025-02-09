import React, { useState } from 'react';
import { 
    FiDroplet, FiHeart, FiSun, FiGift, FiSearch, FiCoffee, 
    FiShoppingBag, FiBook, FiAward, FiClock, FiArrowDown, 
    FiArrowUp, FiUsers, FiHome, FiGlobe, FiSmile, FiShield, 
    FiTarget, FiBox, FiMusic, FiMonitor, FiShoppingCart, FiCamera, 
    FiFilm, FiHeadphones, FiTruck, FiPackage, FiDollarSign
} from 'react-icons/fi';
import './RewardsMarketplace.css';

const transactions = [
    {
        id: 1,
        type: 'earned',
        points: 250,
        description: 'Beach Cleanup',
        date: '2 days ago'
    },
    {
        id: 2,
        type: 'spent',
        points: 500,
        description: 'Tree Planting Donation',
        date: '5 days ago'
    },
    {
        id: 3,
        type: 'earned',
        points: 150,
        description: 'Food Bank Help',
        date: '1 week ago'
    }
];

const opportunities = {
    donate: [
        {
            id: 1,
            title: 'Clean Water Initiative',
            organizer: 'WaterWell Foundation',
            description: 'Provide clean water access to communities in need',
            points: 6000,
            category: 'WATER & SANITATION',
            impact: '5 families helped',
            icon: <FiDroplet />,
            nonprofit: true
        },
        {
            id: 2,
            title: 'Food Security Program',
            organizer: 'Global Food Bank Network',
            description: 'Support meal distribution to families in crisis',
            points: 1500,
            category: 'FOOD SECURITY',
            impact: '20 families fed',
            icon: <FiHeart />,
            nonprofit: true
        },
        {
            id: 3,
            title: 'Reforestation Project',
            organizer: 'Earth Restoration Trust',
            description: 'Plant trees in deforested areas',
            points: 2500,
            category: 'ENVIRONMENT',
            impact: '10 trees planted',
            icon: <FiSun />,
            nonprofit: true
        },
        {
            id: 4,
            title: 'Education for All',
            organizer: 'Learning Bridge NGO',
            description: 'Provide school supplies to underprivileged children',
            points: 3000,
            category: 'EDUCATION',
            impact: '15 students supported',
            icon: <FiBook />,
            nonprofit: true
        },
        {
            id: 5,
            title: 'Healthcare Access',
            organizer: 'Medical Without Borders',
            description: 'Support medical care in remote areas',
            points: 5000,
            category: 'HEALTHCARE',
            impact: '3 medical camps funded',
            icon: <FiShield />,
            nonprofit: true
        },
        {
            id: 6,
            title: 'Youth Empowerment',
            organizer: 'Future Leaders Foundation',
            description: 'Support youth leadership programs',
            points: 2000,
            category: 'YOUTH DEVELOPMENT',
            impact: '10 youth trained',
            icon: <FiUsers />,
            nonprofit: true
        },
        {
            id: 7,
            title: 'Homeless Shelter Support',
            organizer: 'Urban Housing Alliance',
            description: 'Provide shelter and basic necessities',
            points: 4000,
            category: 'HOUSING',
            impact: '8 people sheltered',
            icon: <FiHome />,
            nonprofit: true
        },
        {
            id: 8,
            title: 'Ocean Cleanup',
            organizer: 'Marine Conservation Society',
            description: 'Support ocean cleanup operations',
            points: 3500,
            category: 'ENVIRONMENT',
            impact: '1 beach cleaned',
            icon: <FiGlobe />,
            nonprofit: true
        },
        {
            id: 9,
            title: 'Literacy Program',
            organizer: 'Reading for All',
            description: 'Support adult literacy programs',
            points: 2800,
            category: 'EDUCATION',
            impact: '5 adults taught',
            icon: <FiBook />,
            nonprofit: true
        },
        {
            id: 10,
            title: 'Mental Health Support',
            organizer: 'Mind Wellness Foundation',
            description: 'Fund mental health counseling sessions',
            points: 3200,
            category: 'HEALTHCARE',
            impact: '10 sessions provided',
            icon: <FiSmile />,
            nonprofit: true
        },
        // ... Add more donation opportunities
    ],
    redeem: [
        {
            id: 1,
            title: 'Starbucks Gift Card',
            organizer: 'Starbucks',
            description: '$15 Gift Card for Coffee and Treats',
            points: 1500,
            category: 'FOOD & DRINK',
            expiry: '30 days',
            icon: <FiCoffee />,
            brand: true
        },
        {
            id: 2,
            title: 'Amazon Shopping Voucher',
            organizer: 'Amazon',
            description: '$25 Shopping Credit',
            points: 2500,
            category: 'RETAIL',
            expiry: '60 days',
            icon: <FiShoppingCart />,
            brand: true
        },
        {
            id: 3,
            title: 'Netflix Subscription',
            organizer: 'Netflix',
            description: '1 Month Premium Subscription',
            points: 3000,
            category: 'ENTERTAINMENT',
            expiry: '45 days',
            icon: <FiFilm />,
            brand: true
        },
        {
            id: 4,
            title: 'Spotify Premium',
            organizer: 'Spotify',
            description: '3 Months Music Streaming',
            points: 2800,
            category: 'MUSIC',
            expiry: '30 days',
            icon: <FiMusic />,
            brand: true
        },
        {
            id: 5,
            title: 'Best Buy Discount',
            organizer: 'Best Buy',
            description: '$50 Off Electronics',
            points: 5000,
            category: 'ELECTRONICS',
            expiry: '90 days',
            icon: <FiMonitor />,
            brand: true
        },
        {
            id: 6,
            title: 'Uber Rides',
            organizer: 'Uber',
            description: '$20 Ride Credit',
            points: 2000,
            category: 'TRANSPORTATION',
            expiry: '60 days',
            icon: <FiTruck />,
            brand: true
        },
        {
            id: 7,
            title: 'Nike Store Credit',
            organizer: 'Nike',
            description: '$30 Store Credit',
            points: 3000,
            category: 'SPORTS & FITNESS',
            expiry: '45 days',
            icon: <FiPackage />,
            brand: true
        },
        {
            id: 8,
            title: 'Apple Gift Card',
            organizer: 'Apple',
            description: '$25 App Store & iTunes',
            points: 2500,
            category: 'DIGITAL',
            expiry: '90 days',
            icon: <FiDollarSign />,
            brand: true
        },
        {
            id: 9,
            title: 'Movie Tickets',
            organizer: 'AMC Theatres',
            description: 'Two Premium Movie Tickets',
            points: 2000,
            category: 'ENTERTAINMENT',
            expiry: '60 days',
            icon: <FiCamera />,
            brand: true
        },
        {
            id: 10,
            title: 'Airbnb Stay Credit',
            organizer: 'Airbnb',
            description: '$50 Stay Credit',
            points: 5000,
            category: 'TRAVEL',
            expiry: '120 days',
            icon: <FiHome />,
            brand: true
        },
        // ... Add more redemption opportunities
    ]
};

const RewardsMarketplace = () => {
    const [activeTab, setActiveTab] = useState('donate');
    const [searchQuery, setSearchQuery] = useState('');
    const [showTransactions, setShowTransactions] = useState(false);

    const filteredOpportunities = opportunities[activeTab].filter(opp => 
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="rewards-marketplace">
            <div className="marketplace-header">
                <div className="points-display">
                    <div className="points-value">5,320</div>
                    <h2>Points Available</h2>
                </div>
                <div className="header-right">
                    <div className="search-container">
                        <FiSearch className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Search Rewards" 
                            className="search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="transactions-wrapper">
                        <button 
                            className="transactions-toggle"
                            onClick={() => setShowTransactions(!showTransactions)}
                        >
                            <FiClock />
                            <span>History</span>
                        </button>
                        {showTransactions && (
                            <div className="transactions-dropdown">
                                <h3>Recent Transactions</h3>
                                <div className="transactions-list">
                                    {transactions.map(transaction => (
                                        <div key={transaction.id} className="transaction-item">
                                            <div className="transaction-icon">
                                                {transaction.type === 'earned' ? 
                                                    <FiArrowUp className="earned" /> : 
                                                    <FiArrowDown className="spent" />
                                                }
                                            </div>
                                            <div className="transaction-details">
                                                <div className="transaction-description">
                                                    {transaction.description}
                                                </div>
                                                <div className="transaction-date">
                                                    {transaction.date}
                                                </div>
                                            </div>
                                            <div className={`transaction-points ${transaction.type}`}>
                                                {transaction.type === 'earned' ? '+' : '-'}
                                                {transaction.points}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="view-all-btn">
                                    View All Transactions
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="marketplace-content">
                <div className="slider-container">
                    <div className={`slider-track ${activeTab}`}>
                        <button 
                            className={`slider-option ${activeTab === 'donate' ? 'active' : ''}`}
                            onClick={() => setActiveTab('donate')}
                        >
                            Make an Impact
                        </button>
                        <button 
                            className={`slider-option ${activeTab === 'redeem' ? 'active' : ''}`}
                            onClick={() => setActiveTab('redeem')}
                        >
                            Get Rewards
                        </button>
                        <div className="slider-background"></div>
                    </div>
                </div>

                <div className="rewards-feed">
                    {filteredOpportunities.map((opp) => (
                        <div key={opp.id} className="reward-card">
                            <div className="card-header">
                                <div className="icon-wrapper">
                                    {opp.icon}
                                </div>
                                <span className="category-badge">{opp.category}</span>
                            </div>
                            <div className="card-content">
                                <span className="initiative-chip">{opp.title}</span>
                                <h3 className="card-organizer">{opp.organizer}</h3>
                                <p className="card-description">{opp.description}</p>
                                <div className="card-footer">
                                    <div className="points-required">
                                        <FiAward className="points-icon" />
                                        <span>{opp.points.toLocaleString()} Points</span>
                                    </div>
                                    {activeTab === 'donate' ? (
                                        <div className="impact-info">
                                            <FiHeart className="impact-icon" />
                                            <span>{opp.impact}</span>
                                        </div>
                                    ) : (
                                        <div className="expiry-info">
                                            <FiBook className="expiry-icon" />
                                            <span>Expires in {opp.expiry}</span>
                                        </div>
                                    )}
                                </div>
                                <button className="card-action-btn">
                                    {activeTab === 'donate' ? 'Donate Now' : 'Redeem Now'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RewardsMarketplace; 