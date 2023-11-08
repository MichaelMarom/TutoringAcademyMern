import React, { useEffect, useState } from 'react'
import ShowCalendar from '../common/Calendar/Calendar'
import moment from 'moment';
import { useSelector } from 'react-redux';
import useClock from '../../hooks/Clock';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatName } from '../../helperFunctions/generalHelperFunctions';
import { convertGMTOffsetToLocalString, showDate } from '../../helperFunctions/timeHelperFunctions';
import { get_my_data } from '../../axios/student';


const StudentCalenderScheduling = () => {
  const [disableWeekDays, setDisabledWeekDays] = useState([]);
  const [activeTab, setActiveTab] = useState('month');
  const [tutorTime, setTutorTime] = useState('');
  const [disabledHours, setDisabledHours] = useState([]);
  const { selectedTutor } = useSelector(state => state.selectedTutor)
  const [student, setStudent] = useState({})
  console.log(selectedTutor)
  const { user } = useSelector(state => state.user);
  const { subject } = useSelector(state => state.subject)

  const nav = useNavigate()

  useEffect(() => {
    setTutorTime(convertGMTOffsetToLocalString(selectedTutor.GMT))
  }, [selectedTutor])

  useEffect(() => {
    const getStudentDetails = async () => {
      const res = await get_my_data(localStorage.getItem('student_user_id'))
      console.log(res[1][0],'estudent');
      setStudent(res[1][0][0])
    }
    getStudentDetails()
  }, [])

  if (!selectedTutor.academyId)
    return <div className="text-danger mt-4">
      Please select tutor to Book lessons
    </div>
  return (
    <div>
      <div className='align-items-center justify-content-center mt-5 d-flex gap-4'>
        <h4 className='d-inline mr-2'> {formatName(selectedTutor.firstName, selectedTutor.lastName)}</h4>
        <h4 className='d-inline ml-2'>
          {tutorTime}
        </h4>
      </div>
      <div className='d-flex' style={{ height: "75vh" }}>
        <div className="px-2 col-3">

          <div className="highlight small lh-sm">
            Select a "Week", or a "day" tab at the top right corner. Double click on an aviable (unblocked) slots. You must book first an introduction lesson for 50% off with your new tutor. Then, "Book" a lesson, or "Reserve" a slot for 60 minutes until you make your mind.
          </div>
        </div>
        <div className='px-5 col-9'>
          <ShowCalendar
            student={student}
            disableColor={selectedTutor.disableColor}
            activeTab={activeTab}
            disableWeekDays={disableWeekDays}
            disabledHours={disabledHours}
            setDisabledWeekDays={setDisabledWeekDays}
            setDisabledHours={setDisabledHours} />
        </div>
      </div>
    </div>
  )
}

export default StudentCalenderScheduling
