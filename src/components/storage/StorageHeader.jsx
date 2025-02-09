import React, { useState } from 'react'
import Dropdown from '@/components/shared/Dropdown'
import { emailActions, tagsItems } from '../emails/EmailHeader'
import {
    FiAlertOctagon,
    FiAlertTriangle,
    FiAlignLeft,
    FiArchive,
    FiBellOff,
    FiDatabase,
    FiDelete,
    FiEye,
    FiEyeOff,
    FiFilePlus,
    FiFileText,
    FiFolderPlus,
    FiGrid,
    FiHardDrive,
    FiImage,
    FiList,
    FiMusic,
    FiPlus,
    FiSearch,
    FiSlash,
    FiSliders,
    FiTag,
    FiTrash2,
    FiVideo
} from 'react-icons/fi'
import { labels } from '../tasks/TaskHeader'
import SelectDropdown from '@/components/shared/SelectDropdown'
import HeaderSearchForm from '@/components/shared/pageHeader/HeaderSearchForm'

const projectOptions = [
    { value: "local", label: "Local", img: '/images/storage-icons/local-storage.png' },
]

const fileType = [
    { label: "New File", icon: <FiFilePlus /> },
]
const moreOptions = [
    { label: "Delete", icon: <FiDelete /> },

]

const StrogeHeader = ({ setSidebarOpen }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    return (
        <div className="content-area-header sticky-top">
            <div className="page-header-left d-flex align-items-center gap-2">
                <a href="#" className="app-sidebar-open-trigger me-2" onClick={() => setSidebarOpen(true)}>
                    <FiAlignLeft className='fs-20' />
                </a>
                <div>

                </div>

                <Dropdown
                    dropdownItems={emailActions}
                    triggerIcon={<FiEye />}
                    triggerPosition={"0,22"}
                    triggerClass='avatar-md'
                    dropdownPosition='dropdown-menu-start'
                />
                <Dropdown
                    dropdownItems={tagsItems}
                    triggerIcon={<FiTag />}
                    triggerPosition={"0,22"}
                    triggerClass='avatar-md'
                    dropdownAutoClose='outside'
                    tooltipTitle={"Tags"}
                    dropdownPosition='dropdown-menu-start'
                />

            </div>
            <div className="page-header-right ms-auto">
                <div className="hstack gap-2">
                    <HeaderSearchForm />
                </div>
            </div>
        </div>
    )
}

export default StrogeHeader