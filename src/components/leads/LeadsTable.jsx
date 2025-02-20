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

    const handleModalConfirm = (parsedData) => {
        const newData = parsedData.map(item => ({
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
            header: () => 'volunteer_name',
            cell: (info) => {
                const roles = info.getValue();
                return (
                    <a href="#" className="hstack gap-3">
                        {

                                <div className="text-white avatar-text user-avatar-text avatar-md">{roles?.name.substring(0, 1)}</div>
                        }
                        <div>
                            <span className="text-truncate-1-line">{roles?.name}</span>
                        </div>
                    </a>
                )
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
            cell: (info) => <a href="tel:">{info.getValue()}</a>
            // meta: {
            //     className: "fw-bold text-dark"
            // }
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
                <button onClick={() => setShowModal(true)} className="btn btn-primary">
                    Import CSV
                </button>
            </div>
            <Table title={title} data={tableData} columns={columns} />
            {showModal && (
                <CSVImportModal 
                    onClose={() => setShowModal(false)}
                    onConfirm={handleModalConfirm}
                />
            )}
        </>
    )
}

export default LeadssTable