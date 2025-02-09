import React from 'react'

import { Link } from 'react-router-dom';
import Checkbox from './Checkbox';
import { FiMoreVertical } from 'react-icons/fi';

const Dropdown = ({
    triggerPosition,
    triggerClass = "avatar-sm",
    triggerIcon,
    triggerText,
    dropdownItems = [],
    dropdownPosition = "dropdown-menu-end",
    dropdownAutoClose,
    dropdownParentStyle,
    dataBsToggle = "modal",
    tooltipTitle,
    dropdownMenuStyle,
    iconStrokeWidth = 1.7,
    isItemIcon = true,
    isAvatar = true,
    onClick,
    active,
    id
}) => {

    // Handler for dropdown item click
    const handleItemClick = (e, item) => {
        e.preventDefault();

        // Prefer an onClick on the individual item if available,
        // otherwise, fall back to the onClick prop from Dropdown.
        if (item.onClick && typeof item.onClick === 'function') {
            item.onClick(e);
        } else if (typeof onClick === "function") {
            onClick(item.label, id);
        } else {
            console.warn(`Dropdown: onClick not defined for item "${item.label}"`);
        }
        // Optionally, if needed, you could force-close the dropdown here using Bootstrap's dropdown API.
    };

    return (
        <>
            <div className={`filter-dropdown ${dropdownParentStyle}`}>
                {/* Dropdown Trigger */}
                {
                    tooltipTitle ?
                        <span className="d-flex c-pounter" data-bs-toggle="dropdown" data-bs-offset={triggerPosition} data-bs-auto-close={dropdownAutoClose}>
                            {
                                isAvatar ?
                                    <div className={`avatar-text ${triggerClass}`} data-bs-toggle="tooltip" data-bs-trigger="hover" title={tooltipTitle} >
                                        {triggerIcon || <FiMoreVertical />} {triggerText}
                                    </div>
                                    :
                                    <div className={`${triggerClass}`} data-bs-toggle="tooltip" data-bs-trigger="hover" title={tooltipTitle}>
                                        {triggerIcon || <FiMoreVertical />} {triggerText}
                                    </div>
                            }
                        </span>
                        :
                        isAvatar ?
                            <Link to="#" className={`avatar-text ${triggerClass}`} data-bs-toggle="dropdown" data-bs-offset={triggerPosition} data-bs-auto-close={dropdownAutoClose} >
                                {triggerIcon || <FiMoreVertical />} {triggerText}
                            </Link>
                            :
                            <Link to="#" className={`${triggerClass}`} data-bs-toggle="dropdown" data-bs-offset={triggerPosition} data-bs-auto-close={dropdownAutoClose} >
                                {triggerIcon || <FiMoreVertical />} {triggerText}
                            </Link>
                }


                {/* Dropdown Menu */}
                <ul className={`dropdown-menu ${dropdownMenuStyle} ${dropdownPosition}`}>
                    {dropdownItems.map((item, index) => {
                        if (item.type === "divider") {
                            return <li className="dropdown-divider" key={index}></li>;
                        }

                        // Prepare extra attributes if a modal should be triggered.
                        // They are included only if item.modalTarget is defined.
                        const extraProps = {};
                        if (item.modalTarget) {
                            extraProps['data-bs-toggle'] = dataBsToggle;
                            extraProps['data-bs-target'] = item.modalTarget;
                        }

                        return (
                            <li key={index} className={`${item.checkbox ? "dropdown-item" : ""}`}>
                                {
                                    item.checkbox ?
                                        <Checkbox checked={item.checked} id={item.id} name={item.label} className={""} />
                                        :

                                        <Link
                                            {...extraProps}
                                            to={item.link || "#"}
                                            // Only add target if a link is explicitly provided.
                                            target={item.link ? '_blank' : undefined}
                                            className={`${active === item.label ? "active" : ""} dropdown-item`}
                                            onClick={(e) => handleItemClick(e, item)}
                                        >
                                            {
                                                isItemIcon ?
                                                    item.icon && React.cloneElement(item.icon, { className: "me-3", size: 16, strokeWidth: iconStrokeWidth })
                                                    :
                                                    <span className={`wd-7 ht-7 rounded-circle me-3 ${item.color}`}></span>
                                            }
                                            <span>{item.label}</span>
                                        </Link>
                                }
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    )
}

export default Dropdown