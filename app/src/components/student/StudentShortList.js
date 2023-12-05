import { motion } from 'framer-motion';
import containerVariants from '../constraint';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setTutor } from '../../redux/student_store/selectedTutor';
import Loading from '../common/Loading';
import { convertTutorIdToName } from '../../helperFunctions/generalHelperFunctions';
import { showDate } from '../../helperFunctions/timeHelperFunctions';
import { wholeDateFormat } from '../../constants/constants';

const StudentShortList = () => {

    // columns.js
    let navigate = useNavigate()
    const dispatch = useDispatch()
    const { shortlist: response, isLoading: shortlistLoading } = useSelector(state => state.shortlist)
    const { student } = useSelector(state => state.student)
    const handleNavigateToSchedule = async (item) => {
        dispatch(setTutor({
            id: item.tutorSetup?.SID,
            academyId: item.tutorData?.AcademyId,
            GMT: item.tutorData?.GMT,
            firstName: item.tutorData?.FirstName,
            lastName: item.tutorData?.LastName,
            subject: item.tutorShortList.Subject,
            rate: item.tutorShortList.Rate,
            disableColor: item.tutorData?.disableColor,
            introDiscountEnabled: item.tutorShortList.IntroSessionDiscount || false,
            activateSubscriptionOption: item.tutorShortList.ActivateSubscriptionOption === "true",
            discountHours: item.tutorShortList.DiscountHours
        }))
        navigate('/student/booking')
    }
    const handleNavigateToFeedback = (id) => navigate(`/student/tutor/feedback/${id}`)

    function convertGMTToLocalTime(gmtOffset) {
        const utcTime = new Date();
        const localTime = new Date(utcTime.getTime() + gmtOffset * 60 * 60 * 1000);
        return localTime;
    }

    let multi_student_cols = [{ Header: 'Photo' }, { Header: 'Demo Lesson @50%' }, { Header: 'Subject' }, { Header: 'Tutor Name' }, { Header: 'Country' }, { Header: 'Tutor Time' }, { Header: "Time Zone Diff" }, { Header: 'Tutor Schedule' }, { Header: 'Tutor Profile' }, { Header: 'Rate' }, { Header: 'Hire' }]

    let redirect_to_tutor_profile = () => {
        navigate('/tutor/tutor-profile')
    }

    const calculateTimeDifference = (tutorGMT) => {
        try {
            console.log(student)
            const studentOffset = parseInt(student.GMT, 10);
            const tutorOffset = parseInt(tutorGMT, 10);

            const difference = studentOffset - tutorOffset;

            return difference
        } catch (error) {
            console.log('Invalid GMT offset format');
        }
    };
    const classByDifference = (difference) => {
        if (difference >= -3 && difference <= 3) {
            return 'text-bg-success';
        } else if (difference >= -6 && difference <= 6) {
            return 'text-bg-warning';
        } else {
            return 'text-bg-danger blinking-frame-red';
        }
    }
    console.log(shortlistLoading, 'lol')
    if (shortlistLoading) return <Loading />
    return (
        <>
            <motion.div variants={containerVariants} initial='hidden' animate='visible' exit='exit' className="form-intro" style={{ overflow: "hidden" }}>
                <div className="form-into-prompt shadow-sm" style={{ padding: '20px' }}>
                    {response.length ?
                        <div style={{ margin: 'auto', width: '100%', textAlign: 'center', fontSize: 'Medium', fontWeight: 'bold' }}>
                            To view complete tutor's profile include presentation video, click on 'View Profile' button, or double click on tutor's picture.</div>
                        :
                        <div className='text-danger'> no record found!</div>

                    }

                    <div className="tables" style={{ height: '800px', width: '100%', overflow: 'auto', padding: '5px' }}>

                        <table>
                            {response.length ?
                                <thead>
                                    <tr>
                                        {multi_student_cols.map(item => <th key={item.Header}>{item.Header}</th>
                                        )}
                                    </tr>
                                </thead> : null}
                            <tbody>
                                {
                                    response.length > 0
                                        ?
                                        response.map((item, index) => {
                                            const tutorSetup = item.tutorData;
                                            const tutorDemoLesson = item.tutorDemoLesson;
                                            const tutorShortList = item.tutorShortList;
                                            return (
                                                <tr
                                                    onDoubleClick={() =>
                                                        redirect_to_tutor_profile(tutorSetup?.AcademyId)} key={index}>
                                                    <td className='col-1'>{
                                                        <img src={tutorSetup?.Photo}
                                                            style={{ height: '100px', width: '120px' }} />}</td>
                                                    <td>
                                                        <input type='checkbox'
                                                            style={{ height: '20px', width: '20px' }}
                                                            checked={tutorShortList?.IntroSessionDiscount || false}
                                                        />
                                                    </td>
                                                    <td>
                                                        {tutorShortList?.Subject}
                                                    </td>
                                                    <td>
                                                        {convertTutorIdToName(tutorSetup?.AcademyId)}
                                                    </td>
                                                    <td>
                                                        {tutorSetup?.Country}
                                                    </td>
                                                    <td className='col-1 text-center'>
                                                        {showDate(convertGMTToLocalTime(tutorSetup?.GMT), wholeDateFormat)} <br />
                                                    </td>
                                                    <td className='col-1'>
                                                        <div className={`d-inline mr-2 card px-1 w-50 m-auto ${classByDifference(calculateTimeDifference(tutorSetup?.GMT))}`}>
                                                            {calculateTimeDifference(tutorSetup?.GMT) > 0 ? `+${calculateTimeDifference(tutorSetup?.GMT)}` : calculateTimeDifference(tutorSetup?.GMT)}
                                                        </div>
                                                    </td>
                                                    <td >
                                                        <button className='btn btn-outline-primary' onClick={() => handleNavigateToSchedule(item)}>Book Lesson</button>
                                                    </td>
                                                    <td >
                                                        <button className='btn btn-outline-success' onClick={() => handleNavigateToFeedback(tutorSetup.AcademyId)}>Feedbacks</button>
                                                    </td>
                                                    <td>
                                                        <button className='btn btn-outline-primary' onClick={e => redirect_to_tutor_profile(tutorSetup?.AcademyId)}>View Profile</button>
                                                    </td>
                                                    <td>{tutorShortList?.Rate}</td>
                                                    <td>
                                                        <input style={{ height: '20px', width: '20px' }} type='radio' />
                                                    </td>

                                                </tr>
                                            )
                                        }) :
                                        null
                                }

                            </tbody>
                        </table>

                    </div>

                </div>
            </motion.div>
        </>
    );
}

export default StudentShortList;