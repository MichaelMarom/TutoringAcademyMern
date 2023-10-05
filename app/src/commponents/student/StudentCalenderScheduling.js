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
            CheckBox the hours that you are not tutoring. Students will
            not be able to book lessons for your blocked hours.
          </div>

          <div className="highlight small lh-sm">
            Double click on a blocked day or hour. Will unblock the
            day or hour for that full day or specific hour.
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
