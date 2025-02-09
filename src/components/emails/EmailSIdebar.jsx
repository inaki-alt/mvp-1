import React from 'react'
import { FiBell, FiEdit, FiInbox, FiInfo, FiPlus, FiSend, FiStar, FiTrash2, FiX } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import PerfectScrollbar from "react-perfect-scrollbar";

const EmailSIdebar = ({setSidebarOpen, sidebarOpen, onEventClick}) => {
    // Mocked broadcast events data
    const broadcastEvents = [
        { id: 1, name: "Weekly Newsletter", date: "2023-10-01" },
        { id: 2, name: "Product Launch", date: "2023-10-05" },
        { id: 3, name: "Promo Campaign", date: "2023-10-10" },
    ];

    return (
        <div className={`content-sidebar content-sidebar-md ${sidebarOpen ? "app-sidebar-open" : ""}`}>
            <PerfectScrollbar>
                <div className="content-sidebar-header bg-white sticky-top hstack justify-content-between">
                    <h4 className="fw-bolder mb-0">Broadcast</h4>
                    <Link to="#" className="app-sidebar-close-trigger d-flex" onClick={()=>setSidebarOpen(false)}>
                        <i><FiX /></i>
                    </Link>
                </div>
                <div className="list-group list-group-flush">
                    {broadcastEvents.map((event) => (
                        <a
                            key={event.id}
                            href="#"
                            className="list-group-item list-group-item-action"
                            onClick={() => onEventClick(event)}
                        >
                            <div className="d-flex w-100 align-items-center">
                                <h5 className="mb-1">{event.name}</h5>
                                <small className="ms-auto">{event.date}</small>
                            </div>
                        </a>
                    ))}
                </div>
            </PerfectScrollbar>
        </div>
    )
}

export default EmailSIdebar