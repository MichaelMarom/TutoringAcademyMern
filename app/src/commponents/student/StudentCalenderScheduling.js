import React, { useEffect, useState } from 'react'
import ShowCalendar from '../common/Calendar/Calendar'
import moment from 'moment'
import useClock from '../../hooks/Clock';
import { useLocation } from 'react-router-dom';


const StudentCalenderScheduling = () => {

  const { state: { id, GMT, name, academyId } } = useLocation();
  const [disableWeekDays, setDisabledWeekDays] = useState([]);
  const [activeTab, setActiveTab] = useState('month');
  const [tutorTime, setTutorTime] = useState('');
  const [disabledHours, setDisabledHours] = useState([]);
  const [currentTutor, setCurrentTutor] = useState({ id: academyId, SID: id, name });

  useEffect(() => {
    setTutorTime(moment().utcOffset(GMT).format('YYYY-MM-DD HH:mm:ss'))
  }, [id])

  return (
    <div>
      <div className='align-items-center justify-content-center mt-5 d-flex gap-4'>
        <h4 className='d-inline mr-2'> {name}</h4>
        <h4 className='d-inline ml-2'>
          {tutorTime}
        </h4>
      </div>
      <div className='d-flex'>
        <div className="px-2 col-3">

          <div className="highlight small lh-sm">
            Select a "Week", or a "day" tab at the top right corner. Double click on an aviable (unblocked) slots. You must book first an introduction lesson for 50% off with your new tutor. Then, "Book" a lesson, or "Reserve" a slot for 60 minutes until you make your mind.
          </div>
        </div>
        <div className='px-5 col-9' style={{ height: "500px" }}>
          <ShowCalendar currentTutor={currentTutor} activeTab={activeTab} disableWeekDays={disableWeekDays} disabledHours={disabledHours} setDisabledWeekDays={setDisabledWeekDays} setDisabledHours={setDisabledHours} />
        </div>
      </div>
    </div>
  )
}

export default StudentCalenderScheduling
