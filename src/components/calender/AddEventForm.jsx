import React, { useEffect, useState } from 'react';
import { CiLock } from 'react-icons/ci';
import SelectDropdown from '@/components/shared/SelectDropdown';
import {FiCalendar, FiMapPin, FiTag, FiUsers} from 'react-icons/fi';
import { add, format, isValid } from 'date-fns';
import Datetime from "react-datetime";

export const eventCategoryOptions = [
    { label: "Category", value: "none", bgColor: "rgba(84,132,227,.15)", color: "#5485e4" },
    { label: "Environmental Cleanup", value: "Environmental_Cleanup", bgColor: "rgba(84,132,227,.15)", color: "#5485e4" },
    { label: "Community Development", value: "Community_Development" , bgColor: "rgba(84,132,227,.15)", color: "#5485e4"},
    { label: "Education & Tutoring", value: "Education_Tutoring" , bgColor: "rgba(84,132,227,.15)", color: "#5485e4"},
    { label: "Animal Welfare", value: "Animal_Welfare" , bgColor: "rgba(84,132,227,.15)", color: "#5485e4"},
    { label: "Food Distribution", value: "Food_Distribution" , bgColor: "rgba(84,132,227,.15)", color: "#5485e4"},
    { label: "Health & Wellness", value: "Health_Wellness", bgColor: "rgba(84,132,227,.15)", color: "#5485e4" },
    { label: "Technology & Digital Support", value: "Technology_Digital_Support" , bgColor: "rgba(84,132,227,.15)", color: "#5485e4"},
    { label: "Other", value: "Other" , bgColor: "rgba(84,132,227,.15)", color: "#5485e4"}, // Default category // Default category
]
export const eventOptions = [

]


const AddEventForm = ({ eventDate, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [NofVolunteers, setNofVolunteers] = useState('');
    const [details, setDetails] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(eventCategoryOptions[0]);
    const [position, setPosition] = useState(eventOptions[0]);
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [allDay, setAllDay] = useState(false)

    const timeConverter = (time) => ({
        hours: time.getHours(),
        minutes: time.getMinutes(),
        seconds: time.getSeconds(),
    });
    const combineDateTime = (date, currentTime) => (
        new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            currentTime.getHours(),
            currentTime.getMinutes(),
            currentTime.getSeconds()
        )
    )
    useEffect(() => {
        const currentTime = new Date();
        const convertStartDate = new Date(eventDate.start); // this eventDate.srtat is props eventDate
        const convertEndDate = new Date(eventDate.end);

        const handleDate = (date, setter, addOneHour = false) => {
            if (isValid(date)) {
                const { hours, minutes, seconds } = timeConverter(date);
                if (hours === 0 && minutes === 0 && seconds === 0) {
                    const newDate = combineDateTime(date, currentTime);
                    setter(addOneHour ? new Date(newDate).setHours(newDate.getHours() + 1) : newDate);
                } else {
                    setter(addOneHour ? new Date(date).setHours(date.getHours() + 1) : date);
                }
            }
        };

        handleDate(convertStartDate, setStartDate);
        handleDate(convertEndDate, setEndDate, true); // Add one hour to the end date if time is midnight
    }, [eventDate])

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        const newEvent = {
            id: Date.now().toString(),
            title: title,
            category: selectedCategory.value,
            start: format(startDate, "yyyy-MM-dd'T'HH:mm"),
            end: format(allDay ? add(new Date(endDate), { days: 1 }) : endDate, "yyyy-MM-dd'T'HH:mm"),
            details: {
                NofVolunteers: NofVolunteers,
                location: location,
                details: details,
                dotColor: selectedCategory.color
            },
            allDay: allDay
        };

        onSubmit(newEvent);
    };

    const handleStarteDateChange = (date) => {
        setStartDate(date._d)
    }
    const handleEndDateChange = (date) => {
        setEndDate(date._d)
    }

    return (
        <>
            <form onSubmit={handleSubmit}>

                <div className="input-container d-flex gap-3 mb-3">
                    <div className="input-group border">
                        <div className='border-end h-100 wd-40 d-flex align-items-center justify-content-center'>
                            <FiTag size={16}/>
                        </div>
                        <input type="text" placeholder="Event Title" value={title}
                               onChange={(e) => setTitle(e.target.value)} required className='form-control'/>
                    </div>
                    {/* <div className='border  wd-40 d-flex align-items-center justify-content-center'> <CiLock size={16} /> </div> */}
                </div>
                <div className="input-container d-flex gap-3 mb-3">
                    <div className="input-group border">
                        <div className='border-end h-100 wd-40 d-flex align-items-center justify-content-center'>
                            <FiMapPin size={16}/>
                        </div>
                        <input type="text" placeholder="Location" value={location}
                               onChange={(e) => setLocation(e.target.value)} className='form-control'/>
                    </div>
                </div>
                <div className="d-flex flex-lg-row flex-column gap-lg-4 gap-3 mb-3">
                    <div className="input-group border">
                        <div className='border-end h-100 wd-40 d-flex align-items-center justify-content-center'>
                            <FiUsers size={16}/>
                        </div>
                        <input type="text" placeholder="# Volunteers" value={NofVolunteers}
                               onChange={(e) => setNofVolunteers(e.target.value)} required className='form-control'/>
                    </div>

                    <SelectDropdown
                        options={eventCategoryOptions}
                        defaultSelect={"none"}
                        selectedOption={selectedCategory}
                        onSelectOption={(option) => setSelectedCategory(option)}
                        className={"w-100"}
                    />


                </div>
                <span className='event-title-name'>
                         <b>Start Date</b>
                     </span>
                <div className='d-flex flex-lg-row flex-column gap-lg-4 gap-3 mb-3'>

                    <div className='input-group date border'>
                        <div className='border-end ht-40 wd-40 d-flex align-items-center justify-content-center'>
                            <FiCalendar size={16}/>
                        </div>
                        <Datetime
                            timeFormat={allDay ? false : "HH:mm"}
                            dateFormat="YYYY-MM-DD"
                            closeOnSelect={true}
                            className='rdt-calender'
                            value={startDate}
                            onChange={handleStarteDateChange}
                        />
                    </div>
                </div>
                <span className='event-title-name'>
                         <b>End Date</b>
                     </span>
                <div className='d-flex flex-lg-row flex-column gap-lg-4 gap-3 mb-3'>
                    <div className='input-group date border'>
                        <div className='border-end ht-40 wd-40 d-flex align-items-center justify-content-center'>
                            <FiCalendar size={16}/>
                        </div>
                        <Datetime
                            timeFormat={allDay ? false : "HH:mm"}
                            dateFormat="YYYY-MM-DD"
                            closeOnSelect={true}
                            className='rdt-calender'
                            value={endDate}
                            onChange={handleEndDateChange}
                        />
                    </div>
                    <div className='wd-40 ht-40 d-flex justify-content-center align-items-center border '>
                        <input type="checkbox" name="allday" id="check" defaultChecked={false}
                               onChange={(e) => setAllDay(e.target.checked)}/>
                    </div>
                </div>
                <div className="w-100 mb-3">
                    <textarea className='form-control border ps-3' placeholder='Description'
                              onChange={(e) => setDetails(e.target.value)}/>
                </div>
                <button type="submit" className='btn btn-primary w-100'>Add Event</button>
            </form>
        </>
    );
};

export default AddEventForm;
