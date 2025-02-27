import React, { memo, useEffect, useState } from 'react'
import Table from '@/components/shared/table/Table';
import { FiEye, FiMoreHorizontal, FiUserPlus } from 'react-icons/fi'
import Dropdown from '@/components/shared/Dropdown';
import SelectDropdown from '@/components/shared/SelectDropdown';
import CSVImportModal from './CSVImportModal';
import { toast } from 'react-toastify';
import { supabase } from '@/supabaseClient';
import SingleVolunteerModal from './SingleVolunteerModal';

const actions = [
    { label: "Approve" },
    { label: "Reject" },
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


const LeadsTable = ({title}) => {
    const [tableData, setTableData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showSingleModal, setShowSingleModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [userEvents, setUserEvents] = useState([]);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isAssigning, setIsAssigning] = useState(false);

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

    // Fetch all volunteers from all events created by the current user
    useEffect(() => {
        const fetchVolunteers = async () => {
            if (!currentUser) return;
            
            setIsLoading(true);
            
            try {
                // First, get all events created by this user
                const { data: events, error: eventsError } = await supabase
                    .from("events")
                    .select("id, title")
                    .eq("user_id", currentUser.id);
                
                if (eventsError) {
                    console.error("Error fetching events:", eventsError);
                    setIsLoading(false);
                    return;
                }
                
                setUserEvents(events || []);
                
                if (!events || events.length === 0) {
                    setTableData([]);
                    setIsLoading(false);
                    return;
                }
                
                // Get all event IDs
                const eventIds = events.map(event => event.id);
                
                // Fetch all volunteers for these events
                const { data: volunteers, error: volunteersError } = await supabase
                    .from("event_volunteers")
                    .select(`
                        id, 
                        status, 
                        created_at,
                        event_id,
                        note,
                        users:user_id (id, email, first_name, last_name, phone_number),
                        events:event_id (title)
                    `)
                    .in("event_id", eventIds);
                
                if (volunteersError) {
                    console.error("Error fetching volunteers:", volunteersError);
                    setIsLoading(false);
                    return;
                }
                
                // Format the data for the table
                const formattedData = volunteers.map(volunteer => {
                    const fullName = `${volunteer.users.first_name || ''} ${volunteer.users.last_name || ''}`.trim();
                    
                    // Count events this volunteer has signed up for
                    const eventsCount = volunteers.filter(v => 
                        v.users.id === volunteer.users.id
                    ).length;
                    
                    // Extract address and zip code from note if available
                    let address = '';
                    let zipCode = '';
                    
                    if (volunteer.note) {
                        const addressMatch = volunteer.note.match(/Address: ([^,]+)/);
                        const zipMatch = volunteer.note.match(/Zip Code: ([^,]+)/);
                        
                        if (addressMatch && addressMatch[1] !== 'N/A') {
                            address = addressMatch[1];
                        }
                        
                        if (zipMatch && zipMatch[1] !== 'N/A') {
                            zipCode = zipMatch[1];
                        }
                    }
                    
                    return {
                        id: volunteer.id,
                        volunteer_name: { name: fullName || 'Unknown' },
                        email: volunteer.users.email || '',
                        phone: volunteer.users.phone_number || '',
                        events_count: eventsCount,
                        hours_volunteered: 0, // This would need to be calculated from actual hours logged
                        address: address,
                        zip_code: zipCode,
                        date: new Date(volunteer.created_at).toLocaleDateString(),
                        status: volunteer.status || 'pending',
                        event_name: volunteer.events.title,
                        user_id: volunteer.users.id,
                        event_id: volunteer.event_id
                    };
                });
                
                setTableData(formattedData);
            } catch (error) {
                console.error("Error:", error);
                toast.error("Failed to load volunteers data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchVolunteers();
    }, [currentUser]);

    const handleModalConfirm = (parsedData) => {
        const newData = parsedData.map(item => ({
            ...item,
            volunteer_name: { name: item.volunteer_name || '' },
        }));
        setTableData(prevData => [...prevData, ...newData]);
    };

    const handleSingleVolunteerConfirm = (volunteerData) => {
        const newData = volunteerData.map(item => ({
            ...item,
            volunteer_name: { name: item.volunteer_name || '' },
        }));
        setTableData(prevData => [...prevData, ...newData]);
    };

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
            setTableData(prevData => 
                prevData.map(volunteer => 
                    volunteer.id === volunteerId 
                        ? { ...volunteer, status: newStatus } 
                        : volunteer
                )
            );
            
            toast.success(`Volunteer ${newStatus} successfully`);
        } catch (err) {
            console.error('Error updating volunteer status:', err);
            toast.error('Failed to update volunteer status');
        }
    };

    const handleAssignVolunteer = (volunteer) => {
        setSelectedVolunteer(volunteer);
        setShowAssignModal(true);
    };

    const handleAssignConfirm = async () => {
        if (!selectedVolunteer || !selectedEvent) {
            toast.error('Please select an event');
            return;
        }

        setIsAssigning(true);

        try {
            // Check if volunteer is already assigned to this event
            const { data: existingAssignments, error: checkError } = await supabase
                .from('event_volunteers')
                .select('id')
                .eq('user_id', selectedVolunteer.user_id)
                .eq('event_id', selectedEvent);

            if (checkError) throw checkError;

            if (existingAssignments && existingAssignments.length > 0) {
                toast.info('Volunteer is already assigned to this event');
                setShowAssignModal(false);
                setIsAssigning(false);
                return;
            }

            // Create the new assignment
            const { error: assignError } = await supabase
                .from('event_volunteers')
                .insert([
                    {
                        event_id: selectedEvent,
                        user_id: selectedVolunteer.user_id,
                        status: 'pending',
                        note: `Address: ${selectedVolunteer.address || 'N/A'}, Zip Code: ${selectedVolunteer.zip_code || 'N/A'}`
                    }
                ]);

            if (assignError) throw assignError;

            // Get the event title for display
            const { data: eventData } = await supabase
                .from('events')
                .select('title')
                .eq('id', selectedEvent)
                .single();

            toast.success(`Volunteer assigned to ${eventData?.title || 'event'} successfully`);
            
            // Refresh the volunteer list
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setCurrentUser({...user}); // This will trigger the useEffect to reload data
            }
        } catch (error) {
            console.error('Error assigning volunteer:', error);
            toast.error('Failed to assign volunteer to event');
        } finally {
            setIsAssigning(false);
            setShowAssignModal(false);
            setSelectedVolunteer(null);
            setSelectedEvent(null);
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
            accessorKey: 'volunteer_name',
            header: () => 'Name',
            cell: (info) => {
                const nameObj = info.getValue();
                return (
                    <a href="#" className="hstack gap-3">
                        <div className="text-white avatar-text user-avatar-text avatar-md">
                            {nameObj?.name.substring(0, 1)}
                        </div>
                        <div>
                            <span className="text-truncate-1-line">{nameObj?.name}</span>
                        </div>
                    </a>
                );
            }
        },
        {
            accessorKey: 'email',
            header: () => 'Email',
            cell: (info) => <a href={`mailto:${info.getValue()}`}>{info.getValue()}</a>
        },
        {
            accessorKey: 'phone',
            header: () => 'Phone',
            cell: (info) => <a href={`tel:${info.getValue()}`}>{info.getValue()}</a>
        },
        {
            accessorKey: 'event_name',
            header: () => 'Event',
            cell: (info) => <span>{info.getValue()}</span>
        },
        {
            accessorKey: 'events_count',
            header: () => '# of Events',
            cell: (info) => <span>{info.getValue() || 0}</span>
        },
        {
            accessorKey: 'hours_volunteered',
            header: () => 'Hours Volunteered',
            cell: (info) => <span>{info.getValue() || 0}</span>
        },
        {
            accessorKey: 'address',
            header: () => 'Address',
            cell: (info) => <span>{info.getValue() || ''}</span>
        },
        {
            accessorKey: 'zip_code',
            header: () => 'Zip Code',
            cell: (info) => <span>{info.getValue() || '---'}</span>
        },
        {
            accessorKey: 'date',
            header: () => 'Date Applied',
        },
        {
            accessorKey: 'status',
            header: () => 'Status',
            cell: (info) => {
                const status = info.getValue();
                
                const getStatusBadgeClass = (status) => {
                    switch (status.toLowerCase()) {
                        case 'approved':
                            return 'bg-success';
                        case 'rejected':
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
                    </div>
                );
            }
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
            cell: info => {
                const volunteer = info.row.original;
                const volunteerId = volunteer.id;
                const status = volunteer.status;
                
                // Custom actions based on current status
                const statusActions = [
                    { 
                        label: "Approve", 
                        onClick: () => handleStatusChange(volunteerId, 'approved'),
                        disabled: status === 'approved'
                    },
                    { 
                        label: "Reject", 
                        onClick: () => handleStatusChange(volunteerId, 'rejected'),
                        disabled: status === 'rejected'
                    },
                    { 
                        label: "Reset to Pending", 
                        onClick: () => handleStatusChange(volunteerId, 'pending'),
                        disabled: status === 'pending'
                    },
                    {
                        label: "Assign to Event",
                        onClick: () => handleAssignVolunteer(volunteer),
                        disabled: false
                    }
                ];
                
                return (
                    <div className="hstack gap-2 justify-content-end">
                        <a className="avatar-text avatar-md">
                            <FiEye />
                        </a>
                        <div className="dropdown">
                            <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                Actions
                            </button>
                            <ul className="dropdown-menu">
                                {statusActions.map((action, index) => (
                                    <li key={index}>
                                        <button 
                                            className="dropdown-item" 
                                            onClick={action.onClick}
                                            disabled={action.disabled}
                                        >
                                            {action.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
            },
        },
    ];
    
    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">{title}</h4>
                <div className="d-flex gap-2">
                    <button 
                        className="btn btn-primary d-flex align-items-center gap-2"
                        onClick={() => setShowSingleModal(true)}
                    >
                        <FiUserPlus />
                        Add Volunteer
                    </button>
                    <button 
                        className="btn btn-outline-primary"
                        onClick={() => setShowModal(true)}
                    >
                        Import CSV
                    </button>
                </div>
            </div>
            
            {isLoading ? (
                <div className="text-center py-4">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : tableData.length === 0 ? (
                <div className="text-center py-4">
                    <p>No volunteers found for your events.</p>
                </div>
            ) : (
                <Table title={title} data={tableData} columns={columns} />
            )}
            
            {showModal && (
                <CSVImportModal 
                    onClose={() => setShowModal(false)}
                    onConfirm={handleModalConfirm}
                />
            )}
            {showSingleModal && (
                <SingleVolunteerModal 
                    onClose={() => setShowSingleModal(false)}
                    onConfirm={handleSingleVolunteerConfirm}
                />
            )}
            
            {/* Assign to Event Modal */}
            {showAssignModal && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                        backdropFilter: 'blur(5px)',
                    }}
                >
                    <div 
                        style={{
                            backgroundColor: 'white',
                            width: '90%',
                            maxWidth: '500px',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                            overflow: 'hidden',
                            position: 'relative',
                        }}
                    >
                        <div 
                            style={{
                                padding: '24px 32px',
                                borderBottom: '1px solid #eee',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backgroundColor: 'white',
                                color: 'black',
                            }}
                        >
                            <h3 style={{ margin: 0, fontWeight: '600', letterSpacing: '1px' }}>ASSIGN TO EVENT</h3>
                            <button 
                                type="button" 
                                onClick={() => setShowAssignModal(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    color: 'black',
                                    cursor: 'pointer',
                                    padding: '0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                aria-label="Close"
                            >
                                &times;
                            </button>
                        </div>
                        <div style={{ padding: '24px 32px' }}>
                            <p>
                                Assign <strong>{selectedVolunteer?.volunteer_name?.name}</strong> to an event:
                            </p>
                            
                            <div style={{ marginBottom: '24px' }}>
                                <label htmlFor="eventSelect" style={{ display: 'block', marginBottom: '8px' }}>
                                    Select Event:
                                </label>
                                <select 
                                    id="eventSelect"
                                    value={selectedEvent || ''}
                                    onChange={(e) => setSelectedEvent(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '1px solid #222',
                                        borderRadius: '0',
                                        backgroundColor: 'white',
                                        fontSize: '16px',
                                    }}
                                >
                                    <option value="">-- Select an Event --</option>
                                    {userEvents
                                        .filter(event => event.title !== 'Volunteer Pool') // Exclude the dummy event
                                        .map(event => (
                                            <option key={event.id} value={event.id}>
                                                {event.title}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                            
                            <div 
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: '16px',
                                    marginTop: '24px',
                                }}
                            >
                                <button 
                                    type="button" 
                                    onClick={() => setShowAssignModal(false)}
                                    style={{
                                        padding: '12px 24px',
                                        border: '1px solid black',
                                        backgroundColor: 'white',
                                        color: 'black',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                    }}
                                >
                                    CANCEL
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleAssignConfirm}
                                    disabled={!selectedEvent || isAssigning}
                                    style={{
                                        padding: '12px 24px',
                                        border: 'none',
                                        backgroundColor: 'black',
                                        color: 'white',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        opacity: (!selectedEvent || isAssigning) ? 0.7 : 1,
                                    }}
                                >
                                    {isAssigning ? 'ASSIGNING...' : 'ASSIGN'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LeadsTable;