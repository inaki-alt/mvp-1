import React, { useState } from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import EventsListHeader from '@/components/projectsList/EventsListHeader.jsx'
import VolunteersTable from '@/components/projectsList/VolunteersTable.jsx'
import SiteOverviewStatistics from "@/components/widgetsStatistics/SiteOverviewStatistics.jsx";
import EventCarousel from "@/components/calender/EventCarrusel.jsx";
import CalendarView from "@/components/calender/CalendarView.jsx";
import AppsCalender from "../../pages/apps-calender.jsx";
import CalenderModal from "@/components/calender/CalenderModal.jsx";
import CalenderSidebar from "@/components/calender/CalenderSidebar.jsx";
import CalendarMonthly from "@/components/calender/CalendarMonthly.jsx";
import {Outlet} from "react-router-dom";
import CalenderContent from "@/components/calender/CalenderContent.jsx";
import EventCalendarSmall from "@/components/EventCalendarSmall.jsx";
import EventDetailsPanel from '@/components/EventDetailsPanel.jsx';

const EventsView = () => {
    // Lift the selected event state up to this parent.
    const [selectedEventItem, setSelectedEventItem] = useState(null);

    // Pass this handler to the calendar so that when an event is clicked, the details are set.
    const handleEventSelect = (eventItem) => {
        setSelectedEventItem(eventItem);
    };

    // Handlers for saving and deleting events from the external details panel.
    // (You can extend these to update your data/store accordingly.)
    const handleSaveEvent = (updatedEvent) => {
        // For example, perform any API call or state update here.
        // For now, we simply clear the selection.
        setSelectedEventItem(null);
    };

    const handleDeleteEvent = (eventToDelete) => {
        // Update your event list as needed.
        setSelectedEventItem(null);
    };

    const handleCloseEventDetails = () => {
        setSelectedEventItem(null);
    };

    return (
        <>
            <PageHeader>
                <EventsListHeader/>
            </PageHeader>
            <div className='main-content'>
                {/* Row 1: Calendar + Event Details in two columns */}
                <div className="row">
                    <div className="col-md-6">
                        <div className="card stretch stretch-full p-3" style={{ background: 'white', color: 'black' }}>
                            <EventCalendarSmall externalOnSelectEvent={handleEventSelect}/>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card stretch stretch-full p-3" style={{ background: 'white', color: 'black' }}>
                            <EventDetailsPanel
                                selectedEvent={selectedEventItem}
                                onSaveEvent={handleSaveEvent}
                                onDeleteEvent={handleDeleteEvent}
                                onCloseEvent={handleCloseEventDetails}
                            />
                        </div>
                    </div>
                </div>
                {/* Row 2: Volunteers List */}
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card stretch stretch-full p-3" style={{ background: 'white', color: 'black' }}>
                            <VolunteersTable title={"Volunteers List"}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EventsView