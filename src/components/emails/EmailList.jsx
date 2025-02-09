import React from 'react'
import { FiCornerUpRight, FiEye, FiFastForward, FiLink2, FiMoreVertical, FiRepeat, FiStar, FiX } from 'react-icons/fi'
import { confirmDelete } from '@/utils/confirmDelete';

// const moreOptions = [
//     { icon: <FiEye />, label: "View" },
//     { icon: <FiCornerUpRight />, label: "Reply" },
//     { icon: <FiFastForward />, label: "Forward" },
//     { icon: <FiRepeat />, label: "Reply All" },
//     { icon: <FiX />, label: "Delete" },
// ]
const EmailList = ({ id, user_img, user_name, subject, date, handleDetailsShow }) => {
    const handleClick = () => {
        console.log("Template clicked: ", id);
        handleDetailsShow();
    };

    return (
        <div 
            className="email-list-item p-2 mb-2 border rounded" 
            onClick={handleClick} 
            style={{ cursor: 'pointer' }}
        >
            <div className="d-flex align-items-center">
                {user_img ? (
                    <img 
                        src={user_img} 
                        alt={user_name} 
                        className="rounded-circle me-2" 
                        width="40" 
                        height="40" 
                    />
                ) : (
                    <div 
                        className="avatar rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-2" 
                        style={{ width: '40px', height: '40px' }}
                    >
                        {user_name.charAt(0).toUpperCase()}
                    </div>
                )}
                <div className="flex-grow-1">
                    <h6 className="mb-0">{user_name}</h6>
                    <div className="text-muted">{subject}</div>
                </div>
                <div className="text-muted">
                    <small>{date}</small>
                </div>
            </div>
        </div>
    )
}

export default EmailList