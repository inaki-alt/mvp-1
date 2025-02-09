import React, { Fragment, useEffect, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { menuList } from "@/utils/fackData/menuList";
import getIcon from "@/utils/getIcon";

const Menus = () => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [openSubDropdown, setOpenSubDropdown] = useState(null);
    const [activeParent, setActiveParent] = useState("");
    const [activeChild, setActiveChild] = useState("");
    const location = useLocation();
    const pathName = location.pathname;
    
    // Update this line to exclude /volunteers path
    const isVolunteerView = pathName.startsWith("/volunteer") && !pathName.startsWith("/volunteers");

    // Updated filter logic
    const filteredMenus = menuList.filter(menu => {
        if (isVolunteerView) {
            // Show only menus with hideForVolunteer: false for volunteer view
            return menu.hideForVolunteer === false;
        }
        // Show only menus with hideForVolunteer: true or undefined for admin view
        return menu.hideForVolunteer === true || menu.hideForVolunteer === undefined;
    });

    const handleMainMenu = (e, name) => {
        e.preventDefault(); // Prevent event bubbling
        if (openDropdown === name) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(name);
        }
    };

    const handleDropdownMenu = (e, name) => {
        e.preventDefault(); // Prevent event bubbling
        e.stopPropagation();
        if (openSubDropdown === name) {
            setOpenSubDropdown(null);
        } else {
            setOpenSubDropdown(name);
        }
    };

    // Reset states when view changes
    useEffect(() => {
        setOpenDropdown(null);
        setOpenSubDropdown(null);
        
        if (pathName !== "/") {
            const x = pathName.split("/");
            setActiveParent(x[1]);
            setActiveChild(x[2]);
            setOpenDropdown(x[1]);
            setOpenSubDropdown(x[2]);
        } else {
            setActiveParent("dashboards");
            setOpenDropdown("dashboards");
        }
    }, [pathName, isVolunteerView]); // Added isVolunteerView as dependency

    return (
        <>
            {filteredMenus.map(({ dropdownMenu, id, name, path, icon }) => {
                const isActive = pathName === path;
                const hasDropdown = dropdownMenu && dropdownMenu.length > 0;

                return (
                    <li
                        key={id}
                        onClick={(e) => handleMainMenu(e, name)}
                        className={`nxl-item nxl-hasmenu ${activeParent === name ? "active nxl-trigger" : ""} ${hasDropdown ? 'has-child' : ''}`}
                    >
                        <Link 
                            to={isVolunteerView && path === '/' ? '/volunteer/home' : path} 
                            className="nxl-link text-capitalize"
                            onClick={(e) => !hasDropdown && e.stopPropagation()}
                        >
                            <span className="nxl-micon"> {getIcon(icon)} </span>
                            <span className="nxl-mtext" style={{ paddingLeft: "2.5px" }}>
                                {name}
                            </span>
                            {hasDropdown && (
                                <span className="nxl-arrow fs-16">
                                    <FiChevronRight />
                                </span>
                            )}
                        </Link>
                        {hasDropdown && (
                            <ul
                                className={`nxl-submenu ${openDropdown === name ? "nxl-menu-visible" : "nxl-menu-hidden"}`}
                            >
                                {dropdownMenu.map(({ id, name, path, subdropdownMenu }) => {
                                    const x = name;
                                    return (
                                        <Fragment key={id}>
                                            {subdropdownMenu.length ? (
                                                <li
                                                    className={`nxl-item nxl-hasmenu ${activeChild === name ? "active" : ""}`}
                                                    onClick={(e) => handleDropdownMenu(e, x)}
                                                >
                                                    <Link 
                                                        to={path} 
                                                        className={`nxl-link text-capitalize`}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <span className="nxl-mtext">{name}</span>
                                                        <span className="nxl-arrow">
                                                            <FiChevronRight />
                                                        </span>
                                                    </Link>
                                                    <ul
                                                        className={`nxl-submenu ${
                                                            openSubDropdown === x 
                                                            ? "nxl-menu-visible" 
                                                            : "nxl-menu-hidden"
                                                        }`}
                                                    >
                                                        {subdropdownMenu.map(({ id, name, path }) => (
                                                            <li
                                                                key={id}
                                                                className={`nxl-item ${pathName === path ? "active" : ""}`}
                                                            >
                                                                <Link
                                                                    className="nxl-link text-capitalize"
                                                                    to={path}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    {name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            ) : (
                                                <li className={`nxl-item ${pathName === path ? "active" : ""}`}>
                                                    <Link 
                                                        className="nxl-link" 
                                                        to={path}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {name}
                                                    </Link>
                                                </li>
                                            )}
                                        </Fragment>
                                    );
                                })}
                            </ul>
                        )}
                    </li>
                );
            })}
        </>
    );
};

export default Menus;
