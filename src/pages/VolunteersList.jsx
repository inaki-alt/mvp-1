import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import VolunteersHeader from '@/components/leads/VolunteersHeader.jsx'
import LeadssTable from '@/components/leads/LeadsTable'
import Footer from '@/components/shared/Footer'
import SiteOverviewStatistics from "@/components/widgetsStatistics/SiteOverviewStatistics.jsx";

const VolunteersList = () => {
    return (
        <>
            <PageHeader>
                <VolunteersHeader />
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <LeadssTable title={"Volunteers"} />
                    <SiteOverviewStatistics />
                </div>
            </div>
            <Footer/>
        </>
    )
}

export default VolunteersList