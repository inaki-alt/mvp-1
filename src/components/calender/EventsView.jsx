import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import PageHeader from '@/components/shared/pageHeader/PageHeader';
import EventsListHeader from '@/components/projectsList/EventsListHeader.jsx';
import VolunteersTable from '@/components/projectsList/VolunteersTable.jsx';
import EventCalendarSmall from '@/components/EventCalendarSmall.jsx';
import EventDetailsPanel from '@/components/EventDetailsPanel.jsx';

const EventsView = () => {
    // Lift the selected event state up to this parent.
    const [searchParams] = useSearchParams();
    const [selectedEventItem, setSelectedEventItem] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);

    useEffect(() => {
        const eventId = searchParams.get('eventId');
        if (!eventId) return;

        setIsLoading(true);
        supabase
            .from('events')
            .select('title, start_time, end_time, location_name, location_address, max_volunteers, min_volunteers, description')
            .eq('id', eventId)
            .single()
            .then(({ data }) => {
                if (data) {
                    const { title, start_time, end_time, location_name, location_address, max_volunteers, min_volunteers, description } = data;
                    const eventDate = new Date(start_time);

                    setSelectedEventItem({
                        dateKey: eventDate.toDateString(),
                        index: 0,
                        event: {
                            event_name: title,
                            event_time: eventDate.getTime(),
                            end_time: new Date(end_time).getTime(),
                            location_name: location_name,
                            location_address: location_address,
                            max_volunteers: max_volunteers,
                            min_volunteers: min_volunteers,
                            description: description,
                        },
                    });
                }
            })
            .catch((error) => {
                console.error("Error fetching event:", error);
            })
            .finally(() => setIsLoading(false));
    }, [searchParams]);

    const handleDateClick = (data) => {
        setEventsForSelectedDate(data.eventsForSelectedDate);
        setSelectedEventItem(null);
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

    const handleSelectEvent = (data) => {
        setSelectedEventItem({
            dateKey: data.dateKey,
            index: data.index || 0,
            event: data.event
        });
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
                            <EventCalendarSmall onDateClick={handleDateClick}/>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card stretch stretch-full p-3" style={{ background: 'white', color: 'black' }}>
                            {isLoading ? (
                                <div className="text-center p-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                            <EventDetailsPanel
                                selectedEvent={selectedEventItem}
                                onSaveEvent={handleSaveEvent}
                                onDeleteEvent={handleDeleteEvent}
                                onCloseEvent={handleCloseEventDetails}
                                eventsForSelectedDate={eventsForSelectedDate}
                                onEventSelect={handleSelectEvent}
                            />
                            )}
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
    );
};

export default EventsView;