import React, { useState, memo, useEffect } from 'react'
import Table from '@/components/shared/table/Table';
import { FiAlertOctagon, FiArchive, FiClock, FiEdit3, FiEye, FiMoreHorizontal, FiPrinter, FiTrash2 } from 'react-icons/fi'
import Dropdown from '@/components/shared/Dropdown';
import SelectDropdown from '@/components/shared/SelectDropdown';
import PropTypes from 'prop-types';
import { supabase } from '@/supabaseClient';

const actions = [
    { label: "Edit", icon: <FiEdit3 /> },
    { label: "Print", icon: <FiPrinter /> },
    { label: "Remind", icon: <FiClock /> },
    { type: "divider" },
    { label: "Archive", icon: <FiArchive /> },
    { label: "Report Spam", icon: <FiAlertOctagon />, },
    { type: "divider" },
    { label: "Delete", icon: <FiTrash2 />, },
];

const TableCell = memo(({ options, defaultSelect }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    return (
        <SelectDropdown
            options={options}
            defaultSelect={defaultSelect}
            selectedOption={selectedOption}
            onSelectOption={(option) => setSelectedOption(option)}
        />
    );
});

TableCell.displayName = 'TableCell';

const VolunteersTable = ({ title = "Volunteer List", eventId }) => {
    const [volunteers, setVolunteers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVolunteers = async () => {
            if (!eventId) {
                setVolunteers([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                // Fetch volunteers for the selected event
                const { data, error } = await supabase
                    .from('event_volunteers')
                    .select(`
                        id,
                        event_id,
                        user_id,
                        status,
                        created_at,
                        users:user_id (id, email, first_name, last_name, phone_number)
                    `)
                    .eq('event_id', eventId);

                if (error) {
                    throw error;
                }

                // Format the data for the table
                const formattedData = data.map(volunteer => ({
                    id: volunteer.id,
                    customer: {
                        name: `${volunteer.users.first_name || ''} ${volunteer.users.last_name || ''}`.trim() || 'Unknown',
                        email: volunteer.users.email || 'No email'
                    },
                    'start-date': new Date(volunteer.created_at).toLocaleDateString(),
                    status: volunteer.status || 'pending',
                    user_id: volunteer.user_id
                }));

                setVolunteers(formattedData);
            } catch (err) {
                console.error('Error fetching volunteers:', err);
                setError('Failed to load volunteers. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchVolunteers();
    }, [eventId]);

    const handleStatusChange = async (volunteerId, newStatus) => {
        try {
            const { error } = await supabase
                .from('event_volunteers')
                .update({ status: newStatus })
                .eq('id', volunteerId);

            if (error) {
                throw error;
            }

            // Update the local state
            setVolunteers(prevVolunteers => 
                prevVolunteers.map(volunteer => 
                    volunteer.id === volunteerId 
                        ? { ...volunteer, status: newStatus } 
                        : volunteer
                )
            );
        } catch (err) {
            console.error('Error updating volunteer status:', err);
            alert('Failed to update volunteer status. Please try again.');
        }
    };

    const columns = [
        {
            accessorKey: 'id',
            header: ({ table }) => {
                const checkboxRef = React.useRef(null);

                useEffect(() => {
                    if (checkboxRef.current) {
                        checkboxRef.current.indeterminate = table.getIsSomeRowsSelected();
                    }
                }, [table.getIsSomeRowsSelected()]);

                return (
                    <input
                        type="checkbox"
                        className="custom-table-checkbox"
                        ref={checkboxRef}
                        checked={table.getIsAllRowsSelected()}
                        onChange={table.getToggleAllRowsSelectedHandler()}
                    />
                );
            },
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    className="custom-table-checkbox"
                    checked={row.getIsSelected()}
                    disabled={!row.getCanSelect()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
            meta: {
                headerClassName: 'width-30',
            },
        },

        {
            accessorKey: 'customer',
            header: () => 'Volunteer',
            cell: (info) => {
                const customer = info.getValue();
                return (
                    <a href="#" className="hstack gap-3">
                        <div className="text-white avatar-text user-avatar-text avatar-md">
                            {customer?.name && customer.name.substring(0, 1)}
                        </div>
                        <div>
                            <span className="text-truncate-1-line">{customer?.name}</span>
                            <small className="fs-12 fw-normal text-muted">{customer?.email}</small>
                        </div>
                    </a>
                )
            }
        },
        {
            accessorKey: 'start-date',
            header: () => 'Applied Date',
        },
        {
            accessorKey: 'status',
            header: () => 'Status',
            cell: (info) => {
                const status = info.getValue();
                const volunteerId = info.row.original.id;
                
                const getStatusBadgeClass = (status) => {
                    switch (status.toLowerCase()) {
                        case 'approved':
                            return 'bg-success';
                        case 'declined':
                            return 'bg-danger';
                        case 'pending':
                            return 'bg-warning';
                        default:
                            return 'bg-secondary';
                    }
                };
                
                return (
                    <div className="d-flex align-items-center">
                        <span className={`badge ${getStatusBadgeClass(status)} me-2`}>
                            {status}
                        </span>
                        <div className="dropdown">
                            <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                Change
                            </button>
                            <ul className="dropdown-menu">
                                <li><button className="dropdown-item" onClick={() => handleStatusChange(volunteerId, 'approved')}>Approve</button></li>
                                <li><button className="dropdown-item" onClick={() => handleStatusChange(volunteerId, 'declined')}>Decline</button></li>
                                <li><button className="dropdown-item" onClick={() => handleStatusChange(volunteerId, 'pending')}>Reset to Pending</button></li>
                            </ul>
                        </div>
                    </div>
                );
            }
        },
        {
            accessorKey: 'actions',
            header: () => "Actions",
            cell: () => (
                <div className="hstack gap-2 justify-content-end">
                    <a className="avatar-text avatar-md">
                        <FiEye />
                    </a>
                </div>
            ),
            meta: {
                headerClassName: 'text-end'
            }
        },
    ];

    return (
        <>
            {isLoading ? (
                <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading volunteers...</p>
                </div>
            ) : error ? (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            ) : volunteers.length === 0 ? (
                <div className="text-center py-4">
                    <p>No volunteers found for this event.</p>
                    {!eventId && <p className="text-muted">Please select an event to view its volunteers.</p>}
                </div>
            ) : (
                <Table title={title} data={volunteers} columns={columns} />
            )}
        </>
    );
};

VolunteersTable.propTypes = {
    title: PropTypes.string,
    eventId: PropTypes.string,
};

export default VolunteersTable;
