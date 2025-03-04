import React, { useContext, useEffect, useRef, useState } from 'react'
import { FiAlignLeft, FiArrowLeft, FiArrowRight, FiChevronRight, FiMaximize, FiMinimize, FiMoon, FiPlus, FiSun, } from "react-icons/fi";
import LanguagesModal from './LanguagesModal';
import NotificationsModal from './NotificationsModal';
import ProfileModal from './ProfileModal';
import TimesheetsModal from './TimesheetsModal';
import HeaderDropDownModal from './HeaderDropDownModal';
import MegaMenu from './megaManu/MegaMenu';
import { supabase } from "@/supabaseClient";// Asegúrate de que esta ruta sea correcta
import { NavigationContext } from '../../../contentApi/navigationProvider';
import { Link } from 'react-router-dom';
//

const Header = () => {
    const { navigationOpen, setNavigationOpen } = useContext(NavigationContext)
    const [openMegaMenu, setOpenMegaMenu] = useState(false)
    const [navigationExpend, setNavigationExpend] = useState(false)
    const miniButtonRef = useRef(null);
    const expendButtonRef = useRef(null);
    const [userName, setUserName] = useState(null);

    useEffect(() => {
        // Check auth status when component mounts
        supabase.auth.getSession().then(({ data: { session } }) => {
            // Get user's name from metadata or profile, fallback to email
            const name = session?.user?.user_metadata?.full_name || 
                        session?.user?.user_metadata?.name ||
                        session?.user?.email?.split('@')[0] || null;
            setUserName(name);
        });

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const name = session?.user?.full_name || 
                        session?.user?.name ||
                        session?.user?.email?.split('@')[0] || null;
            setUserName(name);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (openMegaMenu) {
            document.documentElement.classList.add("nxl-lavel-mega-menu-open")
        }
        else {
            document.documentElement.classList.remove("nxl-lavel-mega-menu-open")
        }
    }, [openMegaMenu])

    const handleThemeMode = (type) => {
        if (type === "dark") {
            document.documentElement.classList.add("app-skin-dark")
            localStorage.setItem("skinTheme", "dark");
        }
        else {
            document.documentElement.classList.remove("app-skin-dark")
            localStorage.setItem("skinTheme", "light");
        }
    }

    useEffect(() => {
        const handleResize = () => {
            const newWindowWidth = window.innerWidth;
            if (newWindowWidth <= 1024) {
                document.documentElement.classList.remove('minimenu');
                document.querySelector('.navigation-down-1600').style.display = 'none';
            }
            else if (newWindowWidth >= 1025 && newWindowWidth <= 1400) {
                document.documentElement.classList.add('minimenu');
                document.querySelector('.navigation-up-1600').style.display = 'none';
                document.querySelector('.navigation-down-1600').style.display = 'block';
            }
            else {
                document.documentElement.classList.remove('minimenu');
                document.querySelector('.navigation-up-1600').style.display = 'block';
                document.querySelector('.navigation-down-1600').style.display = 'none';
            }
        };

        window.addEventListener('resize', handleResize);

        handleResize();

        const savedSkinTheme = localStorage.getItem("skinTheme");
        handleThemeMode(savedSkinTheme)

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleNavigationExpendUp = (e, pram) => {
        e.preventDefault()
        if (pram === "show") {
            setNavigationExpend(true);
            document.documentElement.classList.add('minimenu')
        }
        else {
            setNavigationExpend(false);
            document.documentElement.classList.remove('minimenu')
        }
    }

    const handleNavigationExpendDown = (e, pram) => {
        e.preventDefault()
        if (pram === "show") {
            setNavigationExpend(true);
            document.documentElement.classList.remove('minimenu')
        }
        else {
            setNavigationExpend(false);
            document.documentElement.classList.add('minimenu')
        }
    }

    const fullScreenMaximize = () => {
        const elem = document.documentElement;

        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }

        document.documentElement.classList.add("fsh-infullscreen")
        document.querySelector("body").classList.add("full-screen-helper")

    };
    const fullScreenMinimize = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { 
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }

        document.documentElement.classList.remove("fsh-infullscreen")
        document.querySelector("body").classList.remove("full-screen-helper")
    }

    return (
        <header className="nxl-header">
            <div className="header-wrapper">
                <div className="header-left d-flex align-items-center gap-4">
                    {!userName ? (
                        <nav className="authentication-links">
                            <Link to="/signin" className="btn btn-primary me-2">Sign In</Link>
                            <Link to="/nonprofit-signup" className="btn btn-outline-primary">
                                Non-Profit Sign Up
                            </Link>
                        </nav>
                    ) : (
                        <div className="event-header d-flex align-items-center justify-content-center" style={{ height: '100%' }}>
                            <h5 className="m-0">Welcome, {userName}</h5>
                        </div>
                    )}
                    {/* <!--! [Start] nxl-head-mobile-toggler !--> */}
                    <a href="#" className="nxl-head-mobile-toggler" onClick={(e) => {
                        e.preventDefault(), setNavigationOpen(true)
                    }} id="mobile-collapse">
                        <div className={`hamburger hamburger--arrowturn ${navigationOpen ? "is-active" : ""}`}>
                            <div className="hamburger-box">
                                <div className="hamburger-inner"></div>
                            </div>
                        </div>
                    </a>
                    {/* <!--! [Start] nxl-head-mobile-toggler !-->
                    <!--! [Start] nxl-navigation-toggle !--> */}
                    <div className="HideComponent nxl-navigation-toggle navigation-up-1600">
                        <a href="#" onClick={(e) => handleNavigationExpendUp(e, "show")} id="menu-mini-button"
                           ref={miniButtonRef} style={{display: navigationExpend ? "none" : "block"}}>
                            <FiAlignLeft size={24}/>
                        </a>
                        <a href="#" onClick={(e) => handleNavigationExpendUp(e, "hide")} id="menu-expend-button"
                           ref={expendButtonRef} style={{display: navigationExpend ? "block" : "none"}}>
                            <FiArrowRight size={24}/>
                        </a>
                    </div>
                    <div className="HideComponent nxl-navigation-toggle navigation-down-1600">
                        <a href="#" onClick={(e) => handleNavigationExpendDown(e, "hide")} id="menu-mini-button"
                           ref={miniButtonRef} style={{display: navigationExpend ? "block" : "none"}}>
                            <FiAlignLeft size={24}/>
                        </a>
                        <a href="#" onClick={(e) => handleNavigationExpendDown(e, "show")} id="menu-expend-button"
                           ref={expendButtonRef} style={{display: navigationExpend ? "none" : "block"}}>
                            <FiArrowRight size={24}/>
                        </a>
                    </div>
                    {/* <!--! [End] nxl-navigation-toggle !-->
                    <!--! [Start] nxl-lavel-mega-menu-toggle !--> */}
                    <div className="nxl-lavel-mega-menu-toggle d-flex d-lg-none">
                        <a href="#" onClick={(e) => {
                            e.preventDefault(), setOpenMegaMenu(true)
                        }} id="nxl-lavel-mega-menu-open">
                            <FiAlignLeft size={24}/>
                        </a>
                    </div>
                    {/* <!--! [End] nxl-lavel-mega-menu-toggle !-->
                    <!--! [Start] nxl-lavel-mega-menu !--> */}
                    <div className="HideComponent nxl-drp-link nxl-lavel-mega-menu">
                        <div className="nxl-lavel-mega-menu-toggle d-flex d-lg-none">
                            <a href="#" onClick={(e) => {
                                e.preventDefault(), setOpenMegaMenu(false)
                            }} id="nxl-lavel-mega-menu-hide">
                                <i className="me-2"><FiArrowLeft/></i>
                                <span>Back</span>
                            </a>
                        </div>
                        {/* <!--! [Start] nxl-lavel-mega-menu-wrapper !--> */}
                        <div className="nxl-lavel-mega-menu-wrapper d-flex gap-3">
                            <HeaderDropDownModal/>
                            <MegaMenu/>
                        </div>
                    </div>
                </div>
                {/* <!--! [End] Header Left !-->
                <!--! [Start] Header Right !--> */}
                <div className="header-right ms-auto">
                    <div className="d-flex align-items-center">
                        <div className="nxl-h-item d-none d-sm-flex" >
                            <div className="HideComponent full-screen-switcher">
                                <span className="nxl-head-link me-0">
                                    <FiMaximize size={20} className="maximize" onClick={fullScreenMaximize} />
                                    <FiMinimize size={20} className="minimize" onClick={fullScreenMinimize} />
                                </span>
                            </div>
                        </div>
                        <div className="nxl-h-item dark-light-theme">
                            <div className="nxl-head-link me-0 dark-button" onClick={() => handleThemeMode("dark")}>
                                <FiMoon size={20} />
                            </div>
                            <div className="nxl-head-link me-0 light-button" onClick={() => handleThemeMode("light")} style={{ display: "none" }}>
                                <FiSun size={20} />
                            </div>
                        </div>
                        <ProfileModal />
                    </div>
                </div>
                {/* <!--! [End] Header Right !--> */}
            </div>
        </header>
    )
}

export default Header