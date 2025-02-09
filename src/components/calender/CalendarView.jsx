import React, { useState } from "react";


const Calendar = ({ events }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // Día de la semana del primer día

    // Crear un array del 1 al total de días del mes
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Función para verificar si un día tiene un evento y asignar un color diferente
    const getEventColor = (day) => {
        const event = events.find((event) => new Date(event.date).getDate() === day);
        return event ? event.color : "#ddd"; // Si hay evento, usa su color, si no, gris
    };

    return (
        <div className="calendar">
            <div className="calendar-header">
                <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>◀</button>
                <h2>
                    {currentDate.toLocaleString("default", { month: "long" })} {year}
                </h2>
                <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>▶</button>
            </div>

            <div className="calendar-grid">
                {Array(firstDayOfMonth).fill("").map((_, index) => (
                    <div key={`empty-${index}`} className="calendar-day empty"></div>
                ))}
                {daysArray.map((day) => (
                    <div
                        key={day}
                        className="calendar-day"
                        style={{ backgroundColor: getEventColor(day) }}
                    >
                        {day}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar;
