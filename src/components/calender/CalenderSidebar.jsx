import React from 'react'
import {FiCalendar, FiPlus, FiX} from 'react-icons/fi'
import ReactDatetimeClass from 'react-datetime'
import PerfectScrollbar from 'react-perfect-scrollbar'
import Datetime from "react-datetime";
import { upcomingScheduleList } from '@/utils/fackData/upcomingScheduleList';
import ImageGroup from '@/components/shared/ImageGroup';

const CalenderSidebar = ({ selectedCategories, handleCategoryChange, handleAllCategory, selectAll,  sidebarOpen, setSidebarOpen, handleEventBtnClick  }) => {
  return (
    <div className={`content-sidebar content-sidebar-xl ${sidebarOpen ? "app-sidebar-open" : ""}`}>
      <PerfectScrollbar>
        <div className="content-sidebar-header bg-white sticky-top hstack justify-content-between">
          <h4 className="fw-bolder mb-0">Calendar</h4>
          <a href="#" className="app-sidebar-close-trigger d-flex" onClick={() => setSidebarOpen(false)}>
            <FiX/>
          </a>
        </div>
        <div className="content-sidebar-header" onClick={(e) => handleEventBtnClick(e)}>
          <a href="#" id="btn-new-schedule" className="btn btn-primary w-100" data-toggle="modal">
          <FiPlus size={14} className='me-2' />
            <span>New Event</span>
          </a>
        </div>

        <div className="content-sidebar-body">
          <div id="lnb-calendars" className="lnb-calendars">
            <div className="lnb-calendars-item">
              <div className="custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input" id="viewAllSchedules" value="all" checked={selectAll} onChange={(e) => handleAllCategory(e)} />
                <label className="custom-control-label c-pointer" htmlFor="viewAllSchedules">
                  <span className="fs-13 fw-semibold lh-lg d-inline-block" style={{ marginTop: "-3px" }}>View All Schedules</span>
                </label>
              </div>
            </div>
            <div id="calendarList" className="lnb-calendars-d1">
              {Object.keys(selectedCategories).map((category) => (
                <div key={category} className='filter-item'>
                  <div className="custom-control custom-checkbox" data-category={`${category}`}>
                    <input type="checkbox" className="custom-control-input" id={category} value="all" checked={selectedCategories[category]} onChange={() => handleCategoryChange(category)} />
                    <label className="custom-control-label c-pointer" htmlFor={category}>
                      <span className="fs-13 fw-semibold lh-lg d-inline-block" style={{ marginTop: "-3px" }}>{category}</span>
                    </label>
                  </div>
                  {/* <Checkbox id={category} name={category} checked={selectedCategories[category]}  onChange={() => handleCategoryChange(category)} /> */}
                </div>
              ))}
            </div>
          </div>

        </div>
      </PerfectScrollbar>
    </div>
  )
}

export default CalenderSidebar