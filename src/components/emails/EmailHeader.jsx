import React, { useState } from 'react'
import { FiAlertOctagon, FiAlignLeft, FiArchive, FiBell, FiBellOff, FiCheckCircle, FiChevronDown, FiChevronLeft, FiChevronRight, FiClock, FiDownload, FiEye, FiEyeOff, FiFolderPlus, FiMoreVertical, FiPlus, FiRefreshCw, FiSearch, FiShieldOff, FiSlash, FiSliders, FiStar, FiTag, FiTrash2, FiUserPlus } from 'react-icons/fi'
import Checkbox from '@/components/shared/Checkbox'
import { emailList } from '@/utils/fackData/emailList'
import Dropdown from '@/components/shared/Dropdown'
import HeaderSearchForm from '@/components/shared/pageHeader/HeaderSearchForm'

export const emailMoreOptions = [
    { icon: <FiPlus />, label: "Add to Group" },
    { icon: <FiUserPlus />, label: "Add to Contact" },
    { icon: <FiEyeOff />, label: "Make as Unread" },
    { icon: <FiSliders />, label: "Filter Messages" },
    { icon: <FiArchive />, label: "Make as Archive" },
    { type: "divider" },
    { icon: <FiSlash />, label: "Report Spam" },
    { icon: <FiSliders />, label: "Report phishing" },
    { type: "divider" },
    { icon: <FiDownload />, label: "Download Messages" },
    { icon: <FiBellOff />, label: "Mute Conversion" },
    { icon: <FiSlash />, label: "Block Conversion" },
    { icon: <FiTrash2 />, label: "Delete Conversion" },
]

export const emailActions = [
    { label: "Read", icon: <FiEye /> },
    { label: "Unread", icon: <FiEyeOff /> },
];

export const tagsItems = [
    {
        id: "item_1",
        label: "New Enrollment",
        checkbox: true,
        checked: true,
    },
    {
        id: "item_2",
        label: "Onboarding",
        checkbox: true,
        checked: false,
    },

];



const EmailHeader = ({ selectAll, handleSelectAll, showIcon, setSidebarOpen, onCompose }) => {
    const [emails, setEmails] = useState(emailList.emails)
    const uniquelabels = []
    emails.forEach(({ labels }) => {
        if (!uniquelabels.includes(labels)) {
            uniquelabels.push(labels)
        }
    })

    return (
        <div className="content-area-header bg-white sticky-top">
            <div class={`page-header-left d-flex align-items-center gap-2 ${showIcon ? "show-action" : ""}`}>
                <a href="#" className="app-sidebar-open-trigger me-2" onClick={() => setSidebarOpen(true)}>
                    <i className="fs-20"><FiAlignLeft /></i>
                </a>
                <Checkbox
                    id={"checkAll"}
                    name={""}
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="ms-1 me-2"
                />
                <div class={`action-list-items`}>
                    <Dropdown
                        dropdownItems={emailActions}
                        triggerIcon={<FiChevronDown />}
                        triggerPosition={"0,22"}
                        triggerClass='avatar-md'
                        dropdownPosition='dropdown-menu-start'
                    />

                    <Dropdown
                        dropdownItems={tagsItems}
                        triggerIcon={<FiTag />}
                        triggerPosition={"0,22"}
                        triggerClass='avatar-md'
                        dropdownPosition='dropdown-menu-start'
                        dropdownAutoClose='outside'
                        tooltipTitle={"TAGS"}
                    />




                </div>
                <a href="#" className="d-none d-sm-flex">
                    <div className="avatar-text avatar-md" data-bs-toggle="tooltip" data-bs-trigger="hover" title="Refresh">
                        <i><FiRefreshCw /></i>
                    </div>
                </a>
                <a href="#" className="d-none d-sm-flex">
                    <div className="avatar-text avatar-md" data-bs-toggle="tooltip" data-bs-trigger="hover" title="Snooze">
                        <i><FiBell /></i>
                    </div>
                </a>
            </div>
            <div className="page-header-right ms-auto">
                <div className="hstack gap-2">
                    <HeaderSearchForm />
                    <div className="filter-dropdown d-none d-sm-flex">
                        <a href="#" className="btn btn-light-brand btn-sm rounded-pill dropdown-toggle" data-bs-toggle="dropdown" data-bs-offset="0,23" aria-expanded="false">1-15 of 762 </a>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="#">Oldest</a></li>
                            <li><a className="dropdown-item" href="#">Newest</a></li>
                            <li><a className="dropdown-item" href="#">Replied</a></li>
                            <li className="dropdown-divider"></li>
                            <li><a className="dropdown-item" href="#">Ascending</a></li>
                            <li><a className="dropdown-item" href="#">Descending</a></li>
                        </ul>
                    </div>
                    <div className="hstack d-none d-sm-flex">
                        <a href="#" className="d-flex me-1">
                            <div className="avatar-text avatar-md" data-bs-toggle="tooltip" data-bs-trigger="hover" title="Previous">
                                <i><FiChevronLeft /></i>
                            </div>
                        </a>
                        <a href="#" className="d-flex me-1">
                            <div className="avatar-text avatar-md" data-bs-toggle="tooltip" data-bs-trigger="hover" title="Next">
                                <i><FiChevronRight /></i>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="page-header-right ms-auto">
                <div className="hstack gap-2">
                    <button className="btn btn-primary" onClick={onCompose}>
                        Compose Broadcast
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EmailHeader