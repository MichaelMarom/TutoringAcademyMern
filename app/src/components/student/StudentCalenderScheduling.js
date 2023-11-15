import React, { useEffect, useState } from 'react'
import ShowCalendar from '../common/Calendar/Calendar'
import { useSelector } from 'react-redux';
import { formatName } from '../../helperFunctions/generalHelperFunctions';
import { convertGMTOffsetToLocalString } from '../../helperFunctions/timeHelperFunctions';
import { get_my_data } from '../../axios/student';
import SlotPill from './SlotPill';


const StudentCalenderScheduling = () => {
  const [disableWeekDays, setDisabledWeekDays] = useState([]);
  const [activeTab, setActiveTab] = useState('month');
  const [tutorTime, setTutorTime] = useState('');
  const [disabledHours, setDisabledHours] = useState([]);
  const [activeSubscription, setActiveSubscription] = useState('')
  const { selectedTutor } = useSelector(state => state.selectedTutor)
  const [student, setStudent] = useState({})

  let subscription_cols = [
    { Header: "Hours" },
    { Header: "Select" },
    { Header: "Discount" },
  ];
  let subscription_discount = [
    { discount: "0%", hours: '1-5' },
    { discount: "6.0%", hours: '6' },
    { discount: "12.0%", hours: '12' },
  ];

  useEffect(() => {
    setTutorTime(convertGMTOffsetToLocalString(selectedTutor.GMT))
  }, [selectedTutor])

  useEffect(() => {
    const getStudentDetails = async () => {
      const res = await get_my_data(localStorage.getItem('student_user_id'))
      setStudent(res[1][0][0])
    }
    getStudentDetails()
  }, [])
  const getTimeDifferenceClass = (difference) => {
    if (difference >= -3 && difference <= 3) {
      return 'text-bg-success';
    } else if (difference >= -6 && difference <= 6) {
      return 'text-bg-warning';
    } else if (difference >= -7 && difference <= 7) {
      return 'text-bg-danger';
    } else {
      return 'text-bg-gray';
    }
  };

  const calculateTimeDifference = () => {
    try {
      console.log(student, selectedTutor);
      const studentOffset = parseInt(student.GMT, 10);
      const tutorOffset = parseInt(selectedTutor.GMT, 10);

      const difference = studentOffset - tutorOffset;

      return difference
    } catch (error) {
      console.log('Invalid GMT offset format');
    }
  };

  if (!selectedTutor.academyId)
    return <div className="text-danger mt-4">
      Please select tutor to Book lessons
    </div>
  return (
    <div>
      <div className='d-flex justify-content-end'>
        <div className={`w-75 align-items-center justify-content-between mt-3 d-flex row flex-row `}
        >
          <div className='d-flex gap-4 col-3 card m-2'>
            <div className='card-body'>
              <h4 className='d-inline mr-2 card-title'>
                Tutor:
              </h4>
              <h6 className='card-subtitle'>
                {formatName(selectedTutor.firstName, selectedTutor.lastName)}</h6>
              <div className='d-inline ml-2 card-text'>
                {tutorTime}
              </div>
            </div>

          </div>

          <div className='col-3'>
            <h5 className={`d-inline mr-2 card ${getTimeDifferenceClass(calculateTimeDifference())} text-bg-success px-1`}>
              Time zones  Difference: {calculateTimeDifference()}
            </h5>

          </div>
          <div className='ml-4 col-3'>
            <h4 className='d-inline ml-4'>
              My Time:  {convertGMTOffsetToLocalString(student.GMT)}
            </h4>
          </div>
        </div>
      </div>
      <div className='d-flex' style={{ height: "90vh" }}>
        {selectedTutor.activateSubscriptionOption && <div className="px-2 col-3 mt-3">
          <h4 className='text-center '>Subscription Discount</h4>
          <div
            className="rate-table"
          >
            <table>
              <thead>
                <tr>
                  {subscription_cols.map((item) => (
                    <th key={item.Header}>{item.Header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subscription_discount.map((item, index) => (
                  <tr key={index}>
                    <td>{item.hours}</td>
                    <td>
                      <input
                        onInput={(e) => { setActiveSubscription(e.target.value) }}
                        type="radio"
                        value={item.hours}
                        name="student-subscription"
                        id="student-subscription"
                        style={{
                          height: '20px',
                          width: '20px',
                        }}
                      />
                    </td>

                    <td>{item.discount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>}
        <div className={`px-5 ${selectedTutor.activateSubscriptionOption ? "col-9" : "col-12"} `}>
          <div className="highlight small lh-sm mb-3">
            Double click on an aviable (unblocked) slots. You must first book an introduction lesson. Most tutors will discount the 'intro' by 50%. You must conduct the "Introductionary" (Intro) lesson, and provide feedback before you can "Book" the next lesson with that tutor. You can book multiple lessons for a discount. For that reason you can "Reserve" slots for 60 minutes until you make your selection.
          </div>
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
