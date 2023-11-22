import React, { useEffect, useState } from 'react'
import ShowCalendar from '../common/Calendar/Calendar'
import { useSelector } from 'react-redux';
import { formatName } from '../../helperFunctions/generalHelperFunctions';
import { convertGMTOffsetToLocalString } from '../../helperFunctions/timeHelperFunctions';
import { get_my_data, update_student_shortlist } from '../../axios/student';
import { useDispatch } from 'react-redux';
import { setStudent } from '../../redux/student_store/studentData';


const StudentCalenderScheduling = () => {
  const dispatch = useDispatch()
  const [disableWeekDays, setDisabledWeekDays] = useState([]);
  const [activeTab, setActiveTab] = useState('month');
  const [tutorTime, setTutorTime] = useState('');
  const [disabledHours, setDisabledHours] = useState([]);
  const [subscriptionHours, setActiveSubscriptionHours] = useState(null)
  const { selectedTutor } = useSelector(state => state.selectedTutor)

  const { student } = useSelector(state => state.student);

  let subscription_cols = [
    { Header: "Hours" },
    { Header: "Select" },
    { Header: "Discount" },
  ];
  let subscription_discount = [
    { discount: "0%", hours: '1-5', value: 5 },
    { discount: "6.0%", hours: 6, value: 6 },
    { discount: "12.0%", hours: 12, value: 12 },
  ];

  useEffect(() => {
    setTutorTime(convertGMTOffsetToLocalString(selectedTutor.GMT))
    setActiveSubscriptionHours(selectedTutor.discountHours)
  }, [selectedTutor])

  useEffect(() => {
    const update = async () => {
      console.log(student.AcademyId)
      if (subscriptionHours && student.AcademyId?.length) {
        const res = await update_student_shortlist(selectedTutor.academyId, student.AcademyId, selectedTutor.subject, { DiscountHours: subscriptionHours });
        console.log(res)
      }
    }
    update()
  }, [subscriptionHours, student])

  useEffect(() => {
    const getStudentDetails = async () => {
      const res = await get_my_data(localStorage.getItem('student_user_id'))
      dispatch(setStudent(res[1][0][0]))
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
      <div className={`d-flex ${selectedTutor.activateSubscriptionOption ? "justify-content-end" : ""}`}>
        <div className={`${selectedTutor.activateSubscriptionOption ? "w-75 " : "w-100"} align-items-center justify-content-between mt-3 d-flex row flex-row m-2`}
        >
          <div className='d-flex col-3 card m-2'>
            <div className='card-body'>
              <h4 className='d-inline mr-2 card-title'>
                Tutor:
              </h4>
              <h6 className='card-subtitle  text-start'>
                {formatName(selectedTutor.firstName, selectedTutor.lastName)}</h6>
              <div className='d-inline ml-2 card-text'>
                {tutorTime}
              </div>
            </div>
          </div>

          <div className='col-4'>
            <h5 className={`d-inline mr-2 card ${getTimeDifferenceClass(calculateTimeDifference())} text-bg-success px-1`}>
              Time zones  Difference: {calculateTimeDifference()}
            </h5>

          </div>
          <div className='d-flex col-3 card m-2'>
            <div className='card-body'>
              <h4 className='d-inline mr-2 card-title'>
                My Time:
              </h4>
              <h6 className='card-subtitle text-start'>
                {convertGMTOffsetToLocalString(student.GMT)}
              </h6>
            </div>
          </div>

        </div>
      </div >
      <div className='d-flex' style={{ height: "80vh" }}>
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
                        onChange={() => setActiveSubscriptionHours(item.value)}
                        type="radio"
                        checked={item.value === subscriptionHours}
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
    </div >
  )
}

export default StudentCalenderScheduling
