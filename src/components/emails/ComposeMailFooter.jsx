import React from 'react'
import 'react-quill/dist/quill.snow.css';
import Dropdown from '@/components/shared/Dropdown';
import { FiCheck, FiClock, FiCompass, FiEdit3, FiFeather, FiFileText, FiHash, FiImage, FiMic, FiMoreHorizontal, FiSend, FiType, FiUpload, FiVideo, FiX } from 'react-icons/fi'

export const initMessage = [
    { icon: <FiFileText />, label: "Welcome Template" },
    { icon: <FiFileText />, label: "Issue Resolved Template" },
    { icon: <FiFileText />, label: "Thank You Template" },
    { icon: <FiFileText />, label: "Save as Template" },
    { icon: <FiFileText />, label: "Manage Templates" },
]

export const uploadAttachments = [
    { icon: <FiFileText />, label: "Upload Documents" },
]

const editingActions = [
    { icon: <FiType />, label: "Plain Text Mode" },
    { icon: <FiCheck />, label: "Check Spelling" },
    { icon: <FiCompass />, label: "Smart Compose" },
    { icon: <FiFeather />, label: "Manage Signature" },
]

const sendMessage = [
    { icon: <FiSend />, label: "Instant Broadcast" },
    { icon: <FiClock />, label: "Schedule Broadcast" },
]
const ComposeMailFooter = () => {
    return (
        <>
            <div className="d-flex align-items-center gap-2">
                <Dropdown
                    dropdownItems={sendMessage}
                    triggerIcon={"Broadcast"}
                    tooltipTitle={"Broadcast Template"}
                    triggerClass='btn btn-primary dropdown-toggle'
                    triggerPosition={"0, 0"}
                    dropdownPosition='dropdown-menu-start'
                    isAvatar={false}
                />

                <Dropdown
                    dropdownItems={initMessage}
                    triggerIcon={<FiHash size={16} />}
                    tooltipTitle={"Select Template"}
                    dropdownParentStyle={"d-none d-sm-block"}
                    triggerClass='btn btn-icon'
                    triggerPosition={"0, 0"}
                    dropdownMenuStyle="wd-300"
                    dropdownPosition='dropdown-menu-start'
                    isAvatar={false}
                />

                <Dropdown
                    dropdownItems={uploadAttachments}
                    triggerIcon={<FiUpload size={16} />}
                    tooltipTitle={"Upload Attachments"}
                    dropdownParentStyle={"d-none d-sm-block"}
                    triggerClass='btn btn-icon'
                    triggerPosition={"0, 0"}
                    dropdownPosition='dropdown-menu-start'
                    isAvatar={false}
                />
            </div>
            {/* <!--! BEGIN: [mail-editor-action-right] !--> */}
            <div className="d-flex align-items-center gap-2">
                <Dropdown
                    dropdownItems={editingActions}
                    triggerIcon={<FiMoreHorizontal size={16} />}
                    tooltipTitle={"Editing Actions"}
                    triggerClass='btn btn-icon'
                    triggerPosition={"0, 0"}
                    dropdownPosition='dropdown-menu-start'
                    isAvatar={false}
                />

                <a href="#" data-bs-dismiss="modal">
                    <span className="btn btn-icon" data-bs-toggle="tooltip" data-bs-trigger="hover" title="Delete Broadcast">
                        <FiX size={16} />
                    </span>
                </a>
            </div>
        </>
    )
}

export default ComposeMailFooter