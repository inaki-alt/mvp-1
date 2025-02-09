import { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import CalenderModal from './CalenderModal';
import CalenderSidebar from './CalenderSidebar';
import AddEventForm from './AddEventForm';
import EditEventForm from './EditEventForm';
import {FiAlignLeft, FiChevronLeft, FiChevronRight, FiClock, FiFilter} from 'react-icons/fi';
import { format, isValid } from 'date-fns';
import getIcon from '@/utils/getIcon';
import { initEvents } from './initEvents';
import EventDetails from './EventDetails';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Checkbox from '@/components/shared/Checkbox';

const eventCategoryOptions = [
    { label: "Category", value: "none", bgColor: "rgba(84,132,227,.15)", color: "#5485e4" },
    { label: "Environmental Cleanup", value: "Environmental_Cleanup", bgColor: "rgba(84,132,227,.15)", color: "#5485e4" },
    { label: "Community Development", value: "Community_Development" , bgColor: "rgba(84,132,227,.15)", color: "#5485e4"},
    { label: "Education & Tutoring", value: "Education_Tutoring" , bgColor: "rgba(84,132,227,.15)", color: "#5485e4"},
    { label: "Animal Welfare", value: "Animal_Welfare" , bgColor: "rgba(84,132,227,.15)", color: "#5485e4"},
    { label: "Food Distribution", value: "Food_Distribution" , bgColor: "rgba(84,132,227,.15)", color: "#5485e4"},
    { label: "Health & Wellness", value: "Health_Wellness", bgColor: "rgba(84,132,227,.15)", color: "#5485e4" },
    { label: "Technology & Digital Support", value: "Technology_Digital_Support" , bgColor: "rgba(84,132,227,.15)", color: "#5485e4"},
    { label: "Other", value: "Other" , bgColor: "rgba(84,132,227,.15)", color: "#5485e4"}, // Default category
]
const CalenderContent = () => {
    const calendarRef = useRef(null);
    const calenderModalRef = useRef(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [calenderFilter, setcalenderFilter] = useState({ label: "Monthly", icon: "feather-grid" })
    const [events, setEvents] = useState(initEvents);
    const [isWeekMonday, setIsWeekMonday] = useState(0)
    const [showWeekends, setShowWeekends] = useState(true);
    const [currentMonth, setCurrentMonth] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newEventDate, setNewEventDate] = useState(null);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [selectAll, setSelectAll] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState({
        none: true,
        Environmental_Cleanup: true,
        Community_Development: true,
        Education_Tutoring: true,
        Animal_Welfare: true,
        Food_Distribution: true,
        Health_Wellness: true,
        Technology_Digital_Support: true,
        Other: true,
    });

    // Dummy events data for every Saturday from February 2025 through March 2025
    useEffect(() => {
        const dummyEvents = [
            { id: "1", title: "Fresh Start Food Distribution", start: new Date(2025, 1, 1, 10, 0), category: "Food_Distribution" },
            { id: "2", title: "Hearty Harvest Giveaway", start: new Date(2025, 1, 8, 10, 0), category: "Food_Distribution" },
            { id: "3", title: "Caring Cuisine Collection", start: new Date(2025, 1, 15, 10, 0), category: "Food_Distribution" },
            { id: "4", title: "Nourish Together Food Drive", start: new Date(2025, 1, 22, 10, 0), category: "Food_Distribution" },
            { id: "5", title: "Spring Pantry Kickoff", start: new Date(2025, 2, 1, 10, 0), category: "Food_Distribution" },
            { id: "6", title: "Farm Fresh Fare Day", start: new Date(2025, 2, 8, 10, 0), category: "Food_Distribution" },
            { id: "7", title: "Mid-March Meal Meetup", start: new Date(2025, 2, 15, 10, 0), category: "Food_Distribution" },
            { id: "8", title: "Local Love Food Exchange", start: new Date(2025, 2, 22, 10, 0), category: "Food_Distribution" },
            { id: "9", title: "Harvest Helpers Distribution", start: new Date(2025, 2, 29, 10, 0), category: "Food_Distribution" },
        ];
        setEvents(dummyEvents);
    }, []);

    // category toggle
    const handleCategoryChange = (category) => {
        setSelectedCategories((prevCategories) => {
            const updatedCategories = {
                ...prevCategories,
                [category]: !prevCategories[category],
            };

            const allSelected = Object.values(updatedCategories).every((value) => value);
            setSelectAll(allSelected);

            return updatedCategories;
        });
    };

    // all category checked
    const handleAllCategory = (e) => {
        const newValue = e.target.checked;
        setSelectAll(!selectAll)

        setSelectedCategories((prevCategories) => {
            const updatedCategories = {};
            Object.keys(prevCategories).forEach((category) => {
                updatedCategories[category] = newValue;
            });
            return updatedCategories;
        });
    }

    // Check if all categories are true on initial load
    useEffect(() => {
        const allSelected = Object.values(selectedCategories).every((value) => value);
        setSelectAll(allSelected);
    }, []);


    // Filter events based on selected categories
    const filteredEvents = events.filter((event) => selectedCategories[event.category]);

    const handleEventBtnClick = (e) => {
        e.preventDefault()
        const date = new Date()
        setNewEventDate({ start: date, end: date });
        setIsAddModalOpen(true);
    };

    // open modal and add new event click on month view date
    const handleDateClick = (info) => {
        setNewEventDate({ start: info.date, end: info.date });
        setIsAddModalOpen(true);
    };

    // event submit
    const handleAddSubmit = (newEvent) => {
        setEvents([...events, newEvent]);
        setIsAddModalOpen(false);
    };

    // open modal and add new event click on week and day click date
    const handleSelect = (info) => {
        const { start, end } = info;
        setNewEventDate({ start, end });
        setIsAddModalOpen(true);
    };

    // open modal click up the event title
    const handleEventClick = (info) => {
        setSelectedEvent(info.event);
        setIsModalOpen(true);
    };

    // Delete event
    const handleDeleteEvent = () => {
        setEvents(events.filter((event) => event.id !== selectedEvent.id));
        setIsModalOpen(false);
    };

    // Open edit modal
    const handleEditEvent = () => {
        setIsEditModalOpen(true);
        setIsModalOpen(false);
    };

    // Edit event (to be called on edit modal confirmation)
    const handleEditSubmit = (updatedEvent) => {
        const newEvents = events.map((event) => {
            if (event.id === updatedEvent._def.publicId) {
                // Create a new object with the updated title
                return {
                    ...event,
                    title: updatedEvent.title,
                    category: updatedEvent.category,
                    start: updatedEvent.start,
                    end: updatedEvent.end,
                    details: {
                        NofVolunteers: updatedEvent.details.NofVolunteers,
                        location: updatedEvent.details.location,
                        details: updatedEvent.details.details,
                    },
                    allDay: updatedEvent.allDay
                };
            }
            return event;
        });

        setEvents(newEvents);
        setIsEditModalOpen(false);
    };

    // title date customize
    const handleDatesSet = (dateInfo) => {
        const date = new Date()
        const formattedDate = format(date, 'dd.MM.yy');
        setCurrentMonth(formattedDate);
    };


    // useEffect(()=>{
    //     const handleClickOutside = (event) => {
    //         if (calenderModalRef.current && !calenderModalRef.current.contains(event.target)) {
    //             setIsAddModalOpen(false);
    //         }
    //     };
    //     document.addEventListener('click', handleClickOutside);

    //     return () => {
    //         document.removeEventListener('click', handleClickOutside);
    //     };
    // }, [])

    const renderCustomButton = () => {
        const viewOptipns = [
            { label: "Daily", value: "timeGridDay", icon: "feather-list" },
            { label: "Weekly", value: "timeGridWeek", icon: "feather-umbrella" },
            { label: "Weeks (2)", value: "twoWeek", icon: "feather-sliders" },
            { label: "Weeks (3)", value: "threeWeek", icon: "feather-framer" },
            { label: "Monthly", value: "dayGridMonth", icon: "feather-grid" },
        ]
        return (
            <div id="menu" className="d-flex align-items-center justify-content-between">
                <div className="d-flex calendar-action-btn">
                    <div className="filter-dropdown me-1">
                        <button id="dropdownMenu-calendarType" className="dropdown-toggle calendar-dropdown-btn" type="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" data-bs-offset="0,17">
                            <i className='me-2 fs-12'>{getIcon(calenderFilter.icon)}</i>
                            <span>{calenderFilter.label}</span>
                        </button>
                        <div className="dropdown-menu">
                            {
                                viewOptipns.map(({ icon, label, value }, index) => (
                                    <li key={index} className="dropdown-item c-pointer" onClick={() => { calendarRef.current.getApi().changeView(value), setcalenderFilter({ label, icon }) }}>
                                        <i className='me-3'>{getIcon(icon)}</i>
                                        <span>{label}</span>
                                    </li>
                                ))
                            }
                            <li role="presentation" className="dropdown-divider" />
                            <li className="dropdown-item">
                                <Checkbox checked={true} id={"viewWeekendsSchedules"} name={"Show Weekends"} labelClassName="fs-12 fw-bold" onChange={(e) => setShowWeekends(e.target.checked ? true : false)} />
                            </li>
                            <li className="dropdown-item">
                                <Checkbox checked={false} id={"viewStartSchedules"} name={"Start Week on Monday"} labelClassName="fs-12 fw-bold" onChange={(e) => setIsWeekMonday(e.target.checked ? 1 : 0)} />
                            </li>
                            <li className="dropdown-item">
                                <Checkbox checked={false} id={"viewNarrowerSchedules"} name={"Narrower than weekdays"} labelClassName="fs-12 fw-bold" />
                            </li>
                        </div>
                    </div>
                    <div className="menu-navi d-none d-sm-flex">
                        <button type="button" className="move-today" onClick={() => calendarRef.current.getApi().today()}>
                            <FiClock className='me-2' size={13} />
                            <span>Today</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const formatEventTime = (eventStart) => {

        // Check if the start date is available and valid
        if (eventStart && isValid(eventStart)) {
            const hours = eventStart.getHours();
            const minutes = eventStart.getMinutes();
            const seconds = eventStart.getSeconds();

            if (hours === 0 && minutes === 0 && seconds === 0) {
                return false;
            } else {
                return format(eventStart, 'hh:mm a');
            }
        } else {
            return 'Invalid date';
        }
    };


    const renderEventContent = (eventInfo) => {
        const category = eventCategoryOptions.find(cat => cat.value === eventInfo.event.extendedProps.category);
        const eventStart = eventInfo.event.start;

        return (
            <span className='event-title-name' style={{ backgroundColor: category.bgColor, color: category.color }}>
                {getIcon(category.icon)}
                <b>{formatEventTime(eventStart)}</b>
                <span>{eventInfo.event.title}</span>
            </span>
        );
    };


    return (
        <>
            <CalenderSidebar handleEventBtnClick={handleEventBtnClick} selectedCategories={selectedCategories} handleCategoryChange={handleCategoryChange} handleAllCategory={handleAllCategory} selectAll={selectAll} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className='content-area'>
                <PerfectScrollbar>
                    <div className='content-area-body p-0 react-full-calender '>
                        <div className="content-area-header sticky-top">
                            <div className="page-header-left d-flex align-items-center gap-2">
                                <a href="#" className="app-sidebar-open-trigger me-2" onClick={() => setSidebarOpen(true)}>
                                    <FiFilter className='fs-20' />
                                </a>
                                {renderCustomButton()}
                            </div>
                            <div className="page-header-right ms-auto">
                                <div className="hstack gap-2">
                                    <div className="render-range d-none d-sm-flex renderRange">{currentMonth}</div>
                                    <div className="btn-group gap-1 menu-navi" role="group">
                                        <button type="button" className="avatar-text avatar-md move-day" onClick={() => calendarRef.current.getApi().prev()}>
                                            <FiChevronLeft size={12} />
                                        </button>
                                        <button type="button" className="avatar-text avatar-md move-day" onClick={() => calendarRef.current.getApi().next()}>
                                            <FiChevronRight size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <FullCalendar
                            plugins={[
                                dayGridPlugin,
                                interactionPlugin,
                                timeGridPlugin,
                                listPlugin,
                            ]}
                            initialView="dayGridMonth"
                            views={{
                                twoWeek: {
                                    type: 'dayGrid',
                                    duration: { weeks: 2 },
                                    buttonText: '2 weeks'
                                },
                                threeWeek: {
                                    type: 'dayGrid',
                                    duration: { weeks: 3 },
                                    buttonText: '3 weeks'
                                }
                            }}
                            headerToolbar={false}
                            events={filteredEvents}
                            dateClick={handleDateClick}
                            // eventAdd={handleEventClick}
                            eventClick={handleEventClick}
                            ref={calendarRef}
                            selectable={true} // Enable slot selection in timeGrid views
                            select={handleSelect}
                            datesSet={handleDatesSet}
                            weekends={showWeekends}
                            firstDay={isWeekMonday}
                            eventContent={renderEventContent}
                        />

                        {isAddModalOpen && (
                            <CalenderModal
                                onClose={() => setIsAddModalOpen(false)}
                                position={modalPosition}
                                ref={calenderModalRef}
                            >
                                <AddEventForm eventDate={newEventDate} onSubmit={handleAddSubmit} />
                            </CalenderModal>
                        )}

                        {isModalOpen && (
                            <CalenderModal onClose={() => setIsModalOpen(false)} position={modalPosition} ref={calenderModalRef}>
                                <EventDetails handleDeleteEvent={handleDeleteEvent} handleEditEvent={handleEditEvent} selectedEvent={selectedEvent} />
                            </CalenderModal>
                        )}

                        {/* Edit event modal */}
                        {isEditModalOpen && selectedEvent && (
                            <CalenderModal
                                onClose={() => setIsEditModalOpen(false)}
                                position={modalPosition}
                                ref={calenderModalRef}
                            >
                                <EditEventForm event={selectedEvent} onSubmit={handleEditSubmit} />
                            </CalenderModal>
                        )}
                    </div>
                </PerfectScrollbar>
            </div>
        </>
    )
}

export default CalenderContent