import React from 'react'
import Header from '@/components/shared/header/Header'
import NavigationManu from '@/components/shared/navigationMenu/NavigationMenu'
import { Outlet, useLocation } from 'react-router-dom'
import useBootstrapUtils from '@/hooks/useBootstrapUtils'
import ChatProfileInfo from '@/components/chats/ChatProfileInfo'
import Footer from "@/components/shared/Footer.jsx";
import ComposeMailPopUp from "@/components/emails/ComposeMailPopup.jsx";
import StorageDetails from "@/components/storage/StorageDetails.jsx";

const LayoutApplications = () => {
    const pathName = useLocation().pathname
    useBootstrapUtils(pathName)

    const getClassName = (pathName) => {
        switch (pathName) {
            case "/messages/email":
                return "apps-email"
            case "/messages/chat":
                return "apps-chat"
            case "/applications/tasks":
                return "apps-tasks"
            case "/applications/notes":
                return "apps-notes"
            case "/events/calendar":
                return "apps-calendar"
            case "/documents":
                return "apps-storage"

            default:
                return null
        }
    }
    return (
        <>
            <Header/>
            <NavigationManu/>
            <main className={`card nxl-container apps-container ${getClassName(pathName)}`}>
                <div className="card-body nxl-content without-header">
                    <div className='main-content d-flex'>
                        <Outlet/>
                    </div>
                </div>
            </main>
            <StorageDetails />
            <ChatProfileInfo/>
            <ComposeMailPopUp />
        </>
    )
}

export default LayoutApplications