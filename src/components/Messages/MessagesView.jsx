import React, {} from 'react';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import Footer from '@/components/shared/Footer';
import { supabase } from "@/supabaseClient";// Asegúrate de que esta ruta sea correcta
import EventsListHeader from "@/components/projectsList/EventsListHeader.jsx";
import PendingMessages from "@/components/Messages/PendingMessages.jsx";
import VolunteersView from "@/components/volunteers/VolunteersView.jsx";
import EventCarousel from "@/components/calender/EventCarrusel.jsx";



const MessagesView = () => {


    return (
        <>
            <PageHeader>
                <EventsListHeader/>
            </PageHeader>
            <div className="main-content">
                <div className="row">
                    <div className="col-xxl-12">
                        <div className="card stretch stretch-full">
                            <PendingMessages title={"Pending Messages"}/>
                        </div>
                    </div>
                </div>
            </div>

            <Footer/>
        </>
    );
};

export default MessagesView;
