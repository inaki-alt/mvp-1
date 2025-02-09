import React, { useEffect, useState } from "react";
import Table from "@/components/shared/table/Table";
import { FiEye, FiMoreHorizontal } from "react-icons/fi";
import Dropdown from "@/components/shared/Dropdown";
import { supabase } from "@/supabaseClient";
import CardHeader from "@/components/shared/CardHeader.jsx";

const actions = [
    { label: "Approve", id: "approve" },
    { label: "Reject", id: "reject" },
];

const VolunteersView = ({title}) => {
    const [hiddenVolunteers, setHiddenVolunteers] = useState(new Set());
    const [volunteers, setVolunteers] = useState([
        {
            id: 1,
            volunteer_name: "John Doe",
            email: "john.doe@example.com",
            phone: "123-456-7890",
            date: "01/15/2023",
            status: "Pending",
        },
        {
            id: 2,
            volunteer_name: "Jane Smith",
            email: "jane.smith@example.com",
            phone: "987-654-3210",
            date: "02/20/2023",
            status: "Pending",
        },
        {
            id: 3,
            volunteer_name: "Alice Johnson",
            email: "alice.johnson@example.com",
            phone: "555-123-4567",
            date: "03/10/2023",
            status: "Pending",
        },
    ]);

    useEffect(() => {
        const fetchVolunteers = async () => {
            const { data, error } = await supabase
                .from("event_volunteers")
                .select(`
                    id,
                    user_id,
                    status,
                    created_at,
                    users (id, name, email, phone)
                `)
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching volunteers:", error);
            } else {
                if (data.length === 0) {
                    console.warn("No volunteers found in the database.");
                }
                setVolunteers(data.map(v => ({
                    id: v.id,
                    volunteer_name: v.users?.name || "Unknown",
                    email: v.users?.email || "No email",
                    phone: v.users?.phone || "No phone",
                    date: new Date(v.created_at).toLocaleDateString(),
                    status: v.status || "Pending",
                })));
            }
        };

        // Comment out the fetchVolunteers call to use dummy data
        // fetchVolunteers();
    }, []);

    const handleActionClick = (volunteerId, actionLabel) => {
        if (actionLabel === "Approve" || actionLabel === "Reject") {
            setHiddenVolunteers(prev => new Set([...prev, volunteerId]));
        }
    };

    const visibleVolunteers = volunteers.filter(v => !hiddenVolunteers.has(v.id));

    const getDropdownItems = (volunteerId) => [
        {
            label: "Approve",
            id: "approve",
            to: "#",
            onClick: (e) => {
                e.preventDefault();
                handleActionClick(volunteerId, "Approve");
            }
        },
        {
            label: "Reject",
            id: "reject",
            to: "#",
            onClick: (e) => {
                e.preventDefault();
                handleActionClick(volunteerId, "Reject");
            }
        }
    ];

    const columns = [
        {
            accessorKey: "volunteer_name",
            header: () => "Volunteer Name",
            cell: (info) => {
                const name = info.getValue();
                return (
                    <a href="#" className="hstack gap-3">
                        <div className="text-white avatar-text user-avatar-text avatar-md">
                            {name.substring(0, 1)}
                        </div>
                        <div>
                            <span className="text-truncate-1-line">{name}</span>
                        </div>
                    </a>
                );
            },
        },
        {
            accessorKey: "email",
            header: () => "Email",
            cell: (info) => <a>{info.getValue()}</a>,
        },
        {
            accessorKey: "phone",
            header: () => "Phone",
            cell: (info) => <a href="tel:">{info.getValue()}</a>,
        },
        {
            accessorKey: "date",
            header: () => "Date Joined",
        },
        {
            accessorKey: "status",
            header: () => "Status",
            cell: (info) => <span className="badge bg-soft-primary">{info.getValue()}</span>,
        },
        {
            accessorKey: "actions",
            header: () => "Actions",
            cell: (info) => {
                const rowId = info.row.original.id;
                return (
                    <div className="hstack gap-2 justify-content-end">
                        <a className="avatar-text avatar-md">
                            <FiEye />
                        </a>
                        <Dropdown 
                            dropdownItems={getDropdownItems(rowId)}
                            triggerClassName="avatar-text avatar-md"
                            triggerPosition="0,21"
                            triggerIcon={<FiMoreHorizontal />}
                        />
                    </div>
                );
            },
            meta: {
                headerClassName: "text-end",
            },
        },
    ];

    return (
        <>
            <Table title={title} data={visibleVolunteers} columns={columns} />
        </>
    );
};

export default VolunteersView;
