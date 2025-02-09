import React, { useState, memo, useEffect } from 'react'
import Table from '@/components/shared/table/Table';
import { FiAlertOctagon, FiArchive, FiClock, FiEdit3, FiEye, FiMoreHorizontal, FiPrinter, FiTrash2 } from 'react-icons/fi'
import Dropdown from '@/components/shared/Dropdown';
import SelectDropdown from '@/components/shared/SelectDropdown';
import { projectTableData } from '@/utils/fackData/projectTableData';
import PropTypes from 'prop-types';

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

const VolunteersTable = ({ title = "Volunteer List" }) => {


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
            header: () => 'Start Date',
        },
        {
            accessorKey: 'assigned',
            header: () => '# of Projects Assigned',
            cell: () => '2',
        },
        {
            accessorKey: 'status',
            header: () => 'Status',
            cell: () => 'status',
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
    ]

    return (
        <>
            <Table title={title} data={projectTableData} columns={columns} />
        </>
    )
}

VolunteersTable.propTypes = {
    title: PropTypes.string,
};

export default VolunteersTable
