import React from 'react'
import {
    FiBarChart,
    FiBriefcase,
    FiDollarSign,
    FiDownload,
    FiEye,
    FiFilter,
    FiFlag,
    FiPaperclip,
    FiPlus,
    FiUserCheck,
    FiUserMinus,
    FiUsers
} from 'react-icons/fi'
import { BsFiletypeCsv, BsFiletypeExe, BsFiletypePdf, BsFiletypeTsx, BsFiletypeXml, BsPrinter } from 'react-icons/bs';
import Dropdown from '@/components/shared/Dropdown';
import { Link } from 'react-router-dom';
import LeadsStatisticsTwo from "../widgetsStatistics/LeadsStatisticsTwo"

const filterAction = [
    { label: "All", icon: <FiEye /> },
    { label: "Approved", icon: <FiFlag /> },
    { label: "Pending", icon: <FiFlag /> },
    { label: "Denied", icon: <FiFlag /> },
];
export const fileType = [
    { label: ".CSV", icon: <BsFiletypeCsv /> },
];

const VolunteersHeader = () => {
    return (
        <>
            <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">

                <Dropdown
                    dropdownItems={filterAction}
                    triggerPosition={"0, 12"}
                    triggerIcon={<FiFilter size={16} strokeWidth={1.6} />}
                    triggerClass='btn btn-icon btn-light-brand'
                    isAvatar={false}
                />
                <Dropdown
                    dropdownItems={fileType}
                    triggerPosition={"0, 12"}
                    triggerIcon={<FiDownload size={16} strokeWidth={1.6} />}
                    triggerClass='btn btn-icon btn-light-brand'
                    iconStrokeWidth={0}
                    isAvatar={false}
                />
            </div>

            <div id="collapseOne" className="accordion-collapse collapse page-header-collapse">
                <div className="accordion-body pb-2">
                    <div className="row">
                        <LeadsStatisticsTwo />
                    </div>
                </div>
            </div>
        </>
    )
}

export default VolunteersHeader