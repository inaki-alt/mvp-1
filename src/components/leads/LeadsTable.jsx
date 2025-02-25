import React, { memo, useEffect, useState } from 'react'
import Table from '@/components/shared/table/Table';
import { FiEye, FiMoreHorizontal} from 'react-icons/fi'
import Dropdown from '@/components/shared/Dropdown';
import SelectDropdown from '@/components/shared/SelectDropdown';
import { leadTableData } from '@/utils/fackData/leadTableData';
import CSVImportModal from './CSVImportModal';
import { toast } from 'react-toastify';


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


const LeadssTable = ({title}) => {
    const [tableData, setTableData] = useState(leadTableData);
    const [showModal, setShowModal] = useState(false);
    const [showSingleModal, setShowSingleModal] = useState(false);
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);

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
            cell: (info) => <a>{info.getValue()}</a>
        },
        {
            accessorKey: 'phone',
            header: () => 'Phone',
            cell: (info) => <a href={`tel:${info.getValue()}`}>{info.getValue()}</a>
        },
        {
            accessorKey: 'events_count',
            header: () => '# of Events They Have Signed to',
            cell: (info) => <span>{info.getValue() || 0}</span>
        },
        {
            accessorKey: 'hours_volunteered',
            header: () => '# of Hours Volunteered',
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
            header: () => 'Date',
        },
        {
            accessorKey: 'status',
            header: () => 'Status',
            cell: () => 'Pending'
        },
        {
            accessorKey: 'actions',
            header: () => "Actions",
            cell: info => (
                <div className="hstack gap-2 justify-content-end">
                    <a className="avatar-text avatar-md">
                        <FiEye />
                    </a>
                    <Dropdown dropdownItems={actions} triggerClassNaclassName='avatar-md' triggerPosition={"0,21"} triggerIcon={<FiMoreHorizontal />} />
                </div>
            ),
            meta: {
                headerClassName: 'text-end'
            }
        },
    ]
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>{title}</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={() => setShowSingleModal(true)}
                        style={{
                            backgroundColor: '#000',
                            color: '#fff',
                            border: 'none',
                            padding: '10px 20px',
                            cursor: 'pointer'
                        }}
                    >
                        Add Volunteer
                    </button>
                    <button 
                        onClick={() => setShowModal(true)}
                        style={{
                            backgroundColor: '#000',
                            color: '#fff',
                            border: 'none',
                            padding: '10px 20px',
                            cursor: 'pointer'
                        }}
                    >
                        Import CSV
                    </button>
                </div>
            </div>
            <Table title={title} data={tableData} columns={columns} />
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
        </>
    )
}

export default LeadssTable


// -----------------------------------------------------------------------
// New Modal Component: SingleVolunteerModal
// -----------------------------------------------------------------------
const SingleVolunteerModal = ({ onClose, onConfirm }) => {
    const [volunteerName, setVolunteerName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [date, setDate] = useState('');

    const handleConfirm = () => {
        if (!volunteerName || !email || !phone || !date) {
            toast.error("Please fill all fields.");
            return;
        }
        const newVolunteer = [{
            volunteer_name: volunteerName,
            email,
            phone,
            date,
        }];
        onConfirm(newVolunteer);
        onClose();
        toast.success("Volunteer added successfully");
    };

    // Styling objects similar to the CSV modal for consistency.
    const overlayStyle = {
        position: 'fixed',
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        background: 'rgba(240,240,240,0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    };

    const modalStyle = {
        background: '#fff',
        padding: '30px',
        borderRadius: '12px',
        maxWidth: '450px',
        width: '90%',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        border: '2px solid #000',
    };

    const headerStyle = {
        fontSize: '24px',
        marginBottom: '10px',
        textAlign: 'center',
        fontWeight: '600',
        color: '#000'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
    };

    const inputStyle = {
        width: '100%',
        padding: '8px',
        marginBottom: '15px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    };

    const buttonContainerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '20px'
    };

    const cancelButtonStyle = {
        background: '#fff',
        border: '2px solid #000',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
        color: '#000',
        flex: 1,
        marginRight: '10px',
        transition: 'background 0.3s, color 0.3s',
    };

    const confirmButtonStyle = {
        background: '#000',
        border: '2px solid #000',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
        color: '#fff',
        flex: 1,
        transition: 'background 0.3s, color 0.3s',
    };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <h2 style={headerStyle}>Add Volunteer</h2>
                <div>
                    <label style={labelStyle}>Volunteer Name</label>
                    <input
                        type="text"
                        style={inputStyle}
                        value={volunteerName}
                        onChange={(e) => setVolunteerName(e.target.value)}
                        placeholder="Enter volunteer name"
                    />
                </div>
                <div>
                    <label style={labelStyle}>Email</label>
                    <input
                        type="email"
                        style={inputStyle}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
                    />
                </div>
                <div>
                    <label style={labelStyle}>Phone</label>
                    <input
                        type="text"
                        style={inputStyle}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter phone number"
                    />
                </div>
                <div>
                    <label style={labelStyle}>Date</label>
                    <input
                        type="date"
                        style={inputStyle}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <div style={buttonContainerStyle}>
                    <button onClick={onClose} style={cancelButtonStyle}>Cancel</button>
                    <button onClick={handleConfirm} style={confirmButtonStyle}>Confirm</button>
                </div>
            </div>
        </div>
    );
};