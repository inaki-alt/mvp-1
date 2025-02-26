import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import { processEventData } from '@/utils/eventUtils';
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import EventsListHeader from '@/components/projectsList/EventsListHeader.jsx'
import VolunteersTable from '@/components/projectsList/VolunteersTable.jsx'
import EventCalendarSmall from "@/components/EventCalendarSmall.jsx";
import EventDetailsPanel from '@/components/EventDetailsPanel.jsx';

const EventsView = () => {
    const [searchParams] = useSearchParams();
    const [selectedEventItem, setSelectedEventItem] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const eventId = searchParams.get('eventId');
        if (!eventId) return;

        setIsLoading(true);
        supabase
            .from('events')
            .select('*')
            .eq('id', eventId)
            .single()
            .then(({ data }) => {
                if (data) {
                    // Ensure timestamps are numbers
                    const processedData = {
                        ...data,
                        start_time: new Date(data.start_time).getTime(),
                        end_time: new Date(data.end_time).getTime()
                    };
                    setSelectedEventItem(processEventData(processedData));
                }
            })
            .finally(() => setIsLoading(false));
    }, [searchParams]);

    const handleEventSelect = (eventItem) => {
        if (eventItem?.event) {
            // Ensure timestamps are numbers
            const processedEvent = {
                ...eventItem.event,
                start_time: new Date(eventItem.event.start_time).getTime(),
                end_time: new Date(eventItem.event.end_time).getTime()
            };
            setSelectedEventItem(processEventData(processedEvent));
        }
    };

    const handleSaveEvent = async (updatedEvent) => {
        setSelectedEventItem(null);
    };

    const handleDeleteEvent = async (eventToDelete) => {
        setSelectedEventItem(null);
    };

    return (
        <>
            <PageHeader>
                <EventsListHeader/>
            </PageHeader>
            <div className='main-content'>
                <div className="row">
                    <div className="col-md-6">
                        <div className="card stretch stretch-full p-3" style={{ background: 'white', color: 'black' }}>
                            <EventCalendarSmall externalOnSelectEvent={handleEventSelect}/>
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
                                    onCloseEvent={() => setSelectedEventItem(null)}
                                    isLoading={isLoading}
                                />
                            )}
                        </div>
                    </div>
                </div>
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