import React, { useState } from 'react'
import { FiCopy, FiDownload, FiEdit2, FiInfo, FiLink2, FiMove, FiScissors, FiShare2, FiTrash2 } from 'react-icons/fi'
import RecentFileCard from './RecentFileCard';
import { cloudStorageData, storageFolderData } from '@/utils/fackData/storageData';
import StrogeHeader from './StorageHeader';
import PerfectScrollbar from "react-perfect-scrollbar";
import Footer from '@/components/shared/Footer';
import { confirmDelete } from '@/utils/confirmDelete';
import StorageSidebar from './StorageSidebar';

export const strogeOptions = [
    { icon: <FiShare2 />, label: "Share" },
    { icon: <FiInfo />, label: "Details", modalTarget: "#fileFolderDetailsOffcanvas" },
    { icon: <FiEdit2 />, label: "Rename" },
    { icon: <FiDownload />, label: "Download" },
    { type: "divider" },
    { icon: <FiCopy />, label: "Copy to..." },
    { icon: <FiMove />, label: "Move to..." },
    { icon: <FiLink2 />, label: "Open with...", link: "" },
    { type: "divider" },
    { icon: <FiScissors />, label: "Backup" },
    { icon: <FiTrash2 />, label: "Remove" },
]

const StorageContent = () => {
    const [cloudData, setCloudData] = useState(cloudStorageData)
    const [fileData, setFileData] = useState(storageFolderData(0, 4))
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const handleDeleteCloud = (label, id) => {
        if (label === "Remove") {
            confirmDelete(id).then((result) => {
                if (result.confirmed) {
                    setCloudData(cloudData.filter((data) => data.id !== result.id));
                }
            })
        }
    };
    const handleDeleteFile = (label, id) => {
        if (label === "Remove") {
            confirmDelete(id).then((result) => {
                if (result.confirmed) {
                    setFileData(fileData.filter((data) => data.id !== result.id));
                }
            })
        }
    };

    return (
        <>
            <StorageSidebar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
            <div className='content-area'>
                <PerfectScrollbar>
                    <StrogeHeader setSidebarOpen={setSidebarOpen} />
                    <div className='content-area-body'>

                        <div className="recent-section mb-5">
                            <SectionTitle
                                sectionName={"Recent Files"}
                                sectionDescription={"Recent access files (Last access 24 min ago)"}
                            />
                            <div className="row">
                                {
                                    fileData.map(({ id, iconSrc, title }) => (
                                        <RecentFileCard
                                            key={id}
                                            imgSrc={iconSrc}
                                            title={title}
                                            projectLink="Project"
                                            dashboardLink="Dashboard"
                                            category="Webapps"
                                            strogeOptions={strogeOptions}
                                            handleDelete={handleDeleteFile}
                                            id={id}
                                        />
                                    ))
                                }
                            </div>
                        </div>

                    </div>
                </PerfectScrollbar>
            </div>
        </>
    )
}

export default StorageContent


const SectionTitle = ({ sectionName, sectionDescription }) => {
    return (
        <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="me-4">
                <h2 className="fs-16 fw-bold mb-1">{sectionName}</h2>
                <div className="fs-12 text-muted text-truncate-1-line">{sectionDescription}</div>
            </div>
            <a href="#" className="btn btn-sm btn-light-brand">View More</a>
        </div>
    )
}


