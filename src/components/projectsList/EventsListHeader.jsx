import React from 'react'
import { FiBarChart, FiFilter, FiPaperclip, FiPlus } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import Dropdown from '@/components/shared/Dropdown'
import { fileType } from '../leads/VolunteersHeader.jsx'
import ProjectsStatistics from '../widgetsStatistics/ProjectsStatistics'

const options = [
  { label: "Alls", color: "bg-primary" },
  { label: "On Hold", color: "bg-indigo" },
  { label: "Pending", color: "bg-warning" },
  { label: "Finished", color: "bg-success" },
  { label: "Declined", color: "bg-danger" },
  { label: "In Progress", color: "bg-teal" },
  { label: "Not Started", color: "bg-success" },
  { label: "My Projects", color: "bg-warning" }
];
const EventsListHeader = () => {
  return (
    <>
      <div className="d-flex align-items-center gap-2 page-header-right-items-wrapper">

        <Link to="/events/calendar" className="btn btn-primary">
          <FiPlus size={16} className='me-2' />
          <span>New Event</span>
        </Link>
      </div>
      <div id="collapseOne" className="accordion-collapse collapse page-header-collapse">
        <div className="accordion-body pb-2">
          <div className="row">
            <ProjectsStatistics />
          </div>
        </div>
      </div>
    </>
  )
}

export default EventsListHeader