import React, { Fragment } from 'react'
import { FiActivity, FiBell, FiChevronRight, FiDollarSign, FiLogOut, FiSettings, FiUser } from "react-icons/fi"

const activePosition = ["Active", "Always", "Bussy", "Inactive", "Disabled", "Cutomization"]
const subscriptionsList = ["Plan", "Billings", "Referrals", "Payments", "Statements", "Subscriptions"]
const ProfileModal = () => {
    return (
        <div className="dropdown nxl-h-item">
            <a href="#" data-bs-toggle="dropdown" role="button" data-bs-auto-close="outside">
                <img src="/images/logo-abbr.png" alt="user-image" className="img-fluid user-avtar me-0" />
            </a>
            <div className="dropdown-menu dropdown-menu-end nxl-h-dropdown nxl-user-dropdown">
                <div className="dropdown-header">
                    <div className="d-flex align-items-center">
                        <img src="/images/logo-abbr.png" alt="user-image" className="img-fluid user-avtar" />
                        <div>
                            <h6 className="text-dark mb-0">Demo <span className="badge bg-soft-success text-success ms-1">Non-Profit</span></h6>
                            <span className="fs-12 fw-medium text-muted">demo@altruence.ai</span>
                        </div>
                    </div>
                </div>


                <a href="#" className="dropdown-item">
                    <i ><FiUser /></i>
                    <span>Profile Details</span>
                </a>
                <a href="#" className="dropdown-item">
                    <i><FiSettings /></i>
                    <span>Account Settings</span>
                </a>
                <div className="dropdown-divider"></div>
                <a href="./login" className="dropdown-item">
                    <i> <FiLogOut /></i>
                    <span>Logout</span>
                </a>
            </div>
        </div>
    )
}

export default ProfileModal

const getColor = (item) => {
    switch (item) {
        case "Always":
            return "always_clr"
        case "Bussy":
            return "bussy_clr"
        case "Inactive":
            return "inactive_clr"
        case "Disabled":
            return "disabled_clr"
        case "Cutomization":
            return "cutomization_clr"
        default:
            return "active-clr";
    }
}