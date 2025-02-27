import React, { useEffect, useState } from "react";
import Table from "@/components/shared/table/Table";
import { Link } from 'react-router-dom';
import { supabase } from "@/supabaseClient";

const VolunteersView = ({ title, showViewAll, viewAllLink }) => {
    const [volunteers, setVolunteers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [showAllStatuses, setShowAllStatuses] = useState(false);

    // Get the current user
    useEffect(() => {
        const getCurrentUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.error("Error getting current user:", error);
            } else if (user) {
                setCurrentUser(user);
            }
        };

        getCurrentUser();
    }, []);

    // Fetch volunteers for all events created by the current user
    useEffect(() => {
        const fetchVolunteers = async () => {
            if (!currentUser) return;
            
            setIsLoading(true);
            
            try {
                // First, get all events created by this user
                const { data: userEvents, error: eventsError } = await supabase
                    .from("events")
                    .select("id, title, start_time")
                    .eq("user_id", currentUser.id);
                
                if (eventsError) {
                    console.error("Error fetching user events:", eventsError);
                    return;
                }
                
                if (!userEvents || userEvents.length === 0) {
                    setVolunteers([]);
                    return;
                }
                
                // Get the event IDs
                const eventIds = userEvents.map(event => event.id);
                
                // Then fetch all volunteers for these events
                const { data: volunteersData, error: volunteersError } = await supabase
                    .from("event_volunteers")
                    .select(`
                        id,
                        event_id,
                        user_id,
                        status,
                        created_at,
                        users:user_id (id, email, first_name, last_name, phone_number),
                        events:event_id (id, title, start_time)
                    `)
                    .in("event_id", eventIds)
                    .order("created_at", { ascending: false });
                
                if (volunteersError) {
                    console.error("Error fetching volunteers:", volunteersError);
                    return;
                }
                
                // Transform the data for the table
                const formattedVolunteers = volunteersData.map(volunteer => ({
                    id: volunteer.id,
                    volunteer_name: `${volunteer.users?.first_name || ''} ${volunteer.users?.last_name || ''}`.trim() || "Unknown",
                    event_name: volunteer.events?.title || "Unknown Event",
                    event_date: volunteer.events?.start_time 
                        ? new Date(volunteer.events.start_time).toLocaleDateString() 
                        : "Unknown Date",
                    status: volunteer.status,
                    volunteer_id: volunteer.user_id,
                    event_id: volunteer.event_id,
                    created_at: volunteer.created_at
                }));
                
                setVolunteers(formattedVolunteers);
            } catch (error) {
                console.error("Unexpected error fetching volunteers:", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchVolunteers();
    }, [currentUser]);

    const handleActionClick = async (volunteerId, actionLabel) => {
        try {
            const volunteerToUpdate = volunteers.find(v => v.id === volunteerId);
            if (!volunteerToUpdate) return;
            
            const newStatus = actionLabel === "Approve" ? "confirmed" : "declined";
            
            // Update the volunteer status in the database
            const { error } = await supabase
                .from("event_volunteers")
                .update({ status: newStatus })
                .eq("id", volunteerId);
                
            if (error) {
                console.error(`Error ${actionLabel.toLowerCase()}ing volunteer:`, error);
                alert(`Failed to ${actionLabel.toLowerCase()} volunteer. Please try again.`);
                return;
            }
            
            // Update local state to reflect the change
            setVolunteers(prev => 
                prev.map(v => v.id === volunteerId ? {...v, status: newStatus} : v)
            );
            
            // Show a success message
            alert(`Volunteer ${actionLabel.toLowerCase()}ed successfully!`);
            
        } catch (error) {
            console.error(`Error handling ${actionLabel.toLowerCase()} action:`, error);
            alert(`An error occurred. Please try again.`);
        }
    };

    // Filter volunteers based on status
    const filteredVolunteers = showAllStatuses 
        ? volunteers 
        : volunteers.filter(v => v.status === "pending");

    const pendingCount = volunteers.filter(v => v.status === "pending").length;

    const columns = [
        {
            accessorKey: "volunteer_name",
            header: () => "Volunteer Name",
            cell: (info) => <div className="text-truncate-1-line">{info.getValue()}</div>,
        },
        {
            accessorKey: "event_name",
            header: () => "Event",
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: "event_date",
            header: () => "Date of Event",
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: "status",
            header: () => "Status",
            cell: (info) => {
                const status = info.getValue();
                let badgeClass = "bg-secondary";
                
                if (status === "confirmed") badgeClass = "bg-success";
                else if (status === "pending") badgeClass = "bg-warning";
                else if (status === "declined") badgeClass = "bg-danger";
                
                return <span className={`badge ${badgeClass}`}>{status}</span>;
            },
        },
        {
            accessorKey: "actions",
            header: () => "Actions",
            cell: (info) => {
                const rowId = info.row.original.id;
                const status = info.row.original.status;
                
                // Don't show action buttons for already confirmed or declined volunteers
                if (status === "confirmed" || status === "declined") {
                    return null;
                }
                
                return (
                    <div className="hstack gap-2">
                        <button 
                            style={{ backgroundColor: 'white', color: 'black', border: '1px solid black' }}
                            className="btn btn-sm"
                            onClick={() => handleActionClick(rowId, "Approve")}
                        >
                            Approve
                        </button>
                        <button 
                            style={{ backgroundColor: 'white', color: 'black', border: '1px solid black' }}
                            className="btn btn-sm"
                            onClick={() => handleActionClick(rowId, "Decline")}
                        >
                            Decline
                        </button>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="volunteers-view card">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="card-title m-0">
                    {title} {pendingCount > 0 && <span className="badge bg-warning ms-2">{pendingCount} pending</span>}
                </h3>
                <div className="d-flex gap-2">
                    <div className="form-check form-switch">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id="showAllStatusesSwitch"
                            checked={showAllStatuses}
                            onChange={() => setShowAllStatuses(!showAllStatuses)}
                        />
                        <label className="form-check-label" htmlFor="showAllStatusesSwitch">
                            Show all statuses
                        </label>
                    </div>
                    {showViewAll && viewAllLink && (
                        <Link to={viewAllLink} className="btn btn-secondary">
                            View All Volunteers
                        </Link>
                    )}
                </div>
            </div>
            <div className="card-body">
                {isLoading ? (
                    <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading volunteers...</p>
                    </div>
                ) : filteredVolunteers.length === 0 ? (
                    <div className="text-center py-4">
                        <p>
                            {showAllStatuses 
                                ? "No volunteers found for your events." 
                                : "No pending volunteer applications."}
                        </p>
                        {!showAllStatuses && volunteers.length > 0 && (
                            <button 
                                className="btn btn-outline-primary mt-2"
                                onClick={() => setShowAllStatuses(true)}
                            >
                                Show all volunteers
                            </button>
                        )}
                    </div>
                ) : (
                    <Table title={title} data={filteredVolunteers} columns={columns} />
                )}
            </div>
        </div>
    );
};

export default VolunteersView;
