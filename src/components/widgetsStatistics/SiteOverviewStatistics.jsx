import React from 'react'
import { Link } from 'react-router-dom'
import { FiMoreVertical } from 'react-icons/fi'
import { crmStatisticsData } from '@/utils/fackData/crmStatisticsData'
import getIcon from '@/utils/getIcon'


const SiteOverviewStatistics = () => {
    return (
        <>
            {
                crmStatisticsData.map(({ id, completed_number, progress, progress_info, title, total_number, icon }) => (
                    <div key={id} className="col-xxl-3 col-md-6">
                        <div className="card stretch stretch-full short-info-card">
                            <div className="card-body">
                                <div className="d-flex align-items-start justify-content-between mb-4">
                                    <div className="d-flex gap-4 align-items-center">

                                        <div>
                                            <div className="fs-4 fw-bold text-dark">
                                                <span className="counter">{completed_number ? completed_number + "/" : ""}</span>
                                                <span className="counter">{total_number}</span>
                                            </div>
                                            <h3 className="fs-13 fw-semibold text-truncate-1-line">{title}</h3>
                                        </div>
                                    </div>
                                    <Link to="#" className="lh-1">
                                        <FiMoreVertical className='fs-16' />
                                    </Link>
                                </div>

                            </div>
                        </div>
                    </div>
                ))
            }
        </>
    )
}

export default SiteOverviewStatistics

