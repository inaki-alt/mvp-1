import React, { useEffect, useState } from "react";
import Table from "@/components/shared/table/Table";
import { Link } from 'react-router-dom';
import { supabase } from "@/supabaseClient";

const VolunteersView = ({ title, showViewAll, viewAllLink }) => {
    const [hiddenVolunteers, setHiddenVolunteers] = useState(new Set());
    const [volunteers, setVolunteers] = useState([
        {
            id: 1,
            volunteer_name: "John Doe",
            event_name: "Community Clean-up",
            event_date: "2024-04-15",
        },
        {
            id: 2,
            volunteer_name: "Jane Smith",
            event_name: "Food Bank Distribution",
            event_date: "2024-04-20",
        },
        {
            id: 3,
            volunteer_name: "Alice Johnson",
            event_name: "Senior Center Visit",
            event_date: "2024-04-25",
        },
        {
            id: 4,
            volunteer_name: "Bob Wilson",
            event_name: "Community Clean-up",
            event_date: "2024-04-15",
        },
        {
            id: 5,
            volunteer_name: "Carol Martinez",
            event_name: "Food Bank Distribution",
            event_date: "2024-04-20",
        }
    ]);

    // Optionally fetch real data
    useEffect(() => {
        // Uncomment and implement if fetching data from supabase eventually.
        // const fetchVolunteers = async () => {
        //     const { data, error } = await supabase
        //         .from("event_volunteers")
        //         .select(`
        //             id,
        //             user_id,
        //             status,
        //             created_at,
        //             users (id, name, email, phone)
        //         `)
        //         .order("created_at", { ascending: false });
        //
        //     if (error) {
        //         console.error("Error fetching volunteers:", error);
        //     } else {
        //         setVolunteers(data.map(v => ({
        //             id: v.id,
        //             volunteer_name: v.users?.name || "Unknown",
        //             event_name: v.event_name,
        //             event_date: new Date(v.created_at).toLocaleDateString(),
        //         })));
        //     }
        // };
        // fetchVolunteers();
    }, []);

    const handleActionClick = (volunteerId, actionLabel) => {
        // Here you could fire an API call for approving/rejecting
        if (actionLabel === "Approve" || actionLabel === "Decline") {
            setHiddenVolunteers(prev => new Set([...prev, volunteerId]));
        }
    };

    const visibleVolunteers = volunteers.filter(v => !hiddenVolunteers.has(v.id));

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
            accessorKey: "actions",
            header: () => "Actions",
            cell: (info) => {
                const rowId = info.row.original.id;
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
                <h3 className="card-title m-0">{title}</h3>
                {showViewAll && viewAllLink && (
                  <Link to={viewAllLink} className="btn btn-secondary">
                    View All Volunteers
                  </Link>
                )}
            </div>
            <div className="card-body">
                <Table title={title} data={visibleVolunteers} columns={columns} />
            </div>
        </div>
    );
};

export default VolunteersView;
