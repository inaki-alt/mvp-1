import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/supabaseClient";


const Calendar = ({ nonProfitId, onDayClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);

    const fetchEvents = useCallback(async () => {
        if (!nonProfitId) return;

        try {
            const { data, error } = await supabase
                .from("events")
                .select("id, title, start_time, max_volunteers")
                .eq("non_profit_id", nonProfitId)
                .gte("start_time", new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString())
                .lte("start_time", new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString());

            if (error) throw error;

            setEvents(
                data.map((event) => ({
                    id: event.id,
                    title: event.title,
                    date: new Date(event.start_time),
                    volunteers: event.max_volunteers,
                }))
            );
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    }, [nonProfitId, currentDate]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const navigateMonth = (direction) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDayOfMonth = getFirstDayOfMonth(currentDate);
        const days = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`blank-${i}`} className="blank" />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayEvents = events.filter((event) => event.date.toDateString() === date.toDateString());

            days.push(
                <div
                    key={day}
                    className={`day ${dayEvents.length > 0 ? "hasEvent" : ""}`}
                    onClick={() => dayEvents.length > 0 && onDayClick && onDayClick(date)}
                    style={{ cursor: dayEvents.length > 0 && onDayClick ? "pointer" : "default" }}
                >
                    <span className="dayNumber">{day}</span>
                    {dayEvents.map((event) => (
                        <div key={event.id} className="eventIndicator">
                            <div className="eventTitle">{event.title}</div>
                            <div className="eventVolunteers">{event.volunteers} volunteers</div>
                        </div>
                    ))}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="calendar">
            <div className="header">
                <h2 className="monthYear">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="navigation">
                    <button className="navButton" onClick={() => navigateMonth(-1)}>←</button>
                    <button className="navButton" onClick={() => navigateMonth(1)}>→</button>
                </div>
            </div>
            <div className="weekdays">
                {weekDays.map((day) => (
                    <div key={day} className="weekday">{day}</div>
                ))}
            </div>
            <div className="days">{renderCalendarDays()}</div>
        </div>
    );
};

export default Calendar;
