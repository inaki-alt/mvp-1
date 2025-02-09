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


const Home = () => {


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
                    <VolunteersView title={"Volunteers Pending Approval"}/>
                    {/*    <LeadssTable title={"Volunteers Pending Approval"} />*/}
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default Home;
