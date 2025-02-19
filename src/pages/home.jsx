import React, { useEffect, useState } from 'react';
import LatestLeads from '@/components/widgetsTables/LatestLeads';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import Footer from '@/components/shared/Footer';
import { supabase } from "@/supabaseClient";// Asegúrate de que esta ruta sea correcta
import EventsListHeader from "@/components/projectsList/EventsListHeader.jsx";
import EventCarrusel from "@/components/calender/EventCarrusel.jsx";
import PendingMessages from "@/components/Messages/PendingMessages.jsx";
import VolunteersView from "@/components/volunteers/VolunteersView.jsx";
import LeadssTable from "@/components/leads/LeadsTable.jsx";
import SiteOverviewStatistics from "@/components/widgetsStatistics/SiteOverviewStatistics.jsx";
import CalendarView from "@/components/calender/CalendarView.jsx";
import EventCarousel from "@/components/calender/EventCarrusel.jsx";
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleEditEvent = (eventName) => {
        // Navigate to the events management page with the event name as a query parameter
        navigate(`/events?event=${encodeURIComponent(eventName)}`);
    };

    return (
        <>
            <PageHeader>
                <EventsListHeader/>
            </PageHeader>
            <div className="main-content">
                <div className="row">
                    <div className="col-xxl-6">
                        <div className="card stretch stretch-full">
                            <EventCarousel title={"Upcoming Events"}/>
                        </div>
                    </div>
                    <div className="col-xxl-6">
                        <div className="card stretch stretch-full">
                            <PendingMessages title={"Pending Messages"}/>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="card stretch stretch-full">
                            <VolunteersView 
                                title={"Volunteers Pending Approval"}
                                columns={[
                                    'volunteer_name',
                                    'event_name',
                                    'event_date',
                                    'actions'
                                ]}
                                onEditEvent={handleEditEvent}
                                buttonStyle={{
                                    backgroundColor: 'black',
                                    color: 'white',
                                    border: '1px solid black'
                                }}
                                showViewAll={true}
                                viewAllLink="/volunteers"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default Home;
