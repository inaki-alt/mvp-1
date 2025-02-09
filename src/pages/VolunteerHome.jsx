import React from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import EventsListHeader from "@/components/projectsList/EventsListHeader.jsx";
import Footer from '@/components/shared/Footer';
import NextEventCard from '@/components/volunteer/NextEventCard';
import MessagesWidget from '@/components/volunteer/MessagesWidget';
import VolunteerFeed from '@/components/volunteer/VolunteerFeed';
import RewardsWidget from '@/components/volunteer/RewardsWidget';
import OpportunitiesFeed from '@/components/volunteer/OpportunitiesFeed';

const VolunteerHome = () => {
    return (
        <div className="volunteer-home">
            <PageHeader>
                <EventsListHeader />
            </PageHeader>
            
            <main className="main-content container-fluid">
                <div className="row">
                    {/* Left Column - 70% width */}
                    <div className="col-lg-8">
                        {/* Next Event Card */}
                        <div className="card mb-3">
                            <div className="card-body">
                                <h5 className="card-title">Next Event</h5>
                                <NextEventCard />
                            </div>
                        </div>

                        {/* Feed Section */}
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Volunteer Opportunities</h5>
                                <OpportunitiesFeed />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - 30% width */}
                    <div className="col-lg-4">
                        {/* Messages Widget */}
                        <div className="card mb-3">
                            <div className="card-body">
                                <MessagesWidget />
                            </div>
                        </div>

                        {/* Rewards Widget */}
                        <div className="card">
                            <div className="card-body">
                                <RewardsWidget />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default VolunteerHome;