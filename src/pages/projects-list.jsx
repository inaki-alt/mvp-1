import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import EventsListHeader from '@/components/projectsList/EventsListHeader.jsx'
import VolunteersTable from '@/components/projectsList/VolunteersTable.jsx'
import SiteOverviewStatistics from "@/components/widgetsStatistics/SiteOverviewStatistics.jsx";

const ProjectsList = () => {
    return (
        <>
            <PageHeader>
                <EventsListHeader />
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <VolunteersTable />
                    <SiteOverviewStatistics/>
                </div>
            </div>

        </>
    )
}

export default ProjectsList