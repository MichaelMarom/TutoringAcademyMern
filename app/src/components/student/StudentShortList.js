import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setTutor } from '../../redux/student_store/selectedTutor';
import Loading from '../common/Loading';
import { convertTutorIdToName } from '../../helperFunctions/generalHelperFunctions';
import { showDate } from '../../helperFunctions/timeHelperFunctions';
import { wholeDateFormat } from '../../constants/constants';
import Avatar from '../common/Avatar';
import Tooltip from '../common/ToolTip';
import Actions from '../common/Actions';
import tutorData from '../../redux/tutor_store/tutorData';
import { moment } from '../../config/moment'

const StudentShortList = () => {
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
            discountHours: item.tutorShortList.DiscountHours,
            StartVacation: item.tutorData.StartVacation,
            EndVacation: item.tutorData.EndVacation,
            VacationMode: item.tutorData.VacationMode,
        }))
        navigate('/student/booking')
    }
    const handleNavigateToFeedback = (id) => navigate(`/student/tutor/feedback/${id}`)

    function convertGMTToLocalTime(gmtOffset) {
        const utcTime = new Date();
        const localTime = new Date(utcTime.getTime() + gmtOffset * 60 * 60 * 1000);
        return localTime;
    }

    let multi_student_cols = [
        { Header: 'Photo', width: "6%", },
        {
            Header: 'VacationMode',
            width: "6%",
            tooltip: <Tooltip color='white' width="200px" direction='bottomright'
                text="vacation permitted to book further lessons with the tutor." />
        },
        {
            Header: 'Vacations',
            width: "6%",
            tooltip: <Tooltip color='white' width="200px" direction='bottomright'
                text="date" />
        },
        {
            Header: 'Demo Lesson @50%',
            width: "6%",
            tooltip: <Tooltip color='white' width="200px" direction='bottomright'
                text="The student must conduct an introduction lesson with tutor. Most Tutors motivate students by offering the 'Intro' lesson at half price. The discounted 'Intro' marked by a green check boxk icon. 
                After the 'intro' lesson performed, the student must provide a feedback before permitted to book further lessons with the tutor."  />
        },
        { Header: 'Subject', width: "6%", },
        { Header: 'Tutor Name', width: "6%", },
        { Header: 'Country', width: "6%", },
        {
            Header: 'Tutor Local Time (UTC).',
            width: "6%",
            tooltip: <Tooltip width="200px" color='white' direction='bottomleft'
                text="The time shown is the local time (UTC) at the tutor's location." />
        },
        {
            Header: "Be Aware Time Zone Diff",
            width: "6%",
            tooltip: <Tooltip color='white' direction='bottomleft' width='200px'
                text="The numbers below calculate the difference between your time zone and the tutor. When difference is between +/-3 to 6 Hours, we provide orange background. And if is 7 time zones or more, we show blinking red background. When you book your lesson on the tutor's calendar, it will be shown on your calendar adjusted to your local time (UTC). " />
        },
        {
            Header: 'View Tutor Schedule',
            width: "6%",
            tooltip: <Tooltip width="200px" color='white' direction='bottomright'
                text="Its cancellation time, if you delet your booked session before that, then you will be refunded ful amount" />
        },
        {
            Header: 'Consult Students FeedBack',
            width: "6%",
            tooltip: <Tooltip width="200px" color='white' direction='bottomleft'
                text="To view tutor's feedback as graded by other students, click the button below." />
        },
        {
            Header: 'Examine Tutor Profile',
            width: "6%",
            tooltip: <Tooltip color='white' direction='bottomleft' width='200px'
                text="To view the full tutor's profile, include introduction video, education credentials, verifications, work experience, and more, Click on the button below." />
        },
        { Header: 'Rate', width: "6%", },
        {
            Header: 'Cancellation Policy',
            width: "6%",
            tooltip: <Tooltip color='white' direction='bottomleft' width='200px'
                text="Number of hours the tutor allows you to cancell the booked lesson without penalty. if you cancel less than the indicated hours, you liable for the lesson amount. Otherwise you will receive refund." />
        },
        {
            Header: 'Tutor Response Time',
            width: "6%",
            tooltip: <Tooltip width="200px" color='white' direction='bottomleft'
                text="This is the time the tutor committed to response to you address him/her. Please take notice that this committment is in effect during tutor's local time (UTC) business hours. " />
        }

    ]

    let redirect_to_tutor_profile = (id) => {
        navigate(`/tutor-profile/${id}`)
    }

    const calculateTimeDifference = (tutorGMT) => {
        try {
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

    if (shortlistLoading) return <Loading />
    return (
        <>
            <div className="form-into-prompt shadow-sm " style={{ padding: '20px', height: "94vh" }}>
                <div className='d-flex rounded justify-content-between
                         align-items-center
                         p-2' style={{ color: "white", background: "#2471A3" }}>
                    {multi_student_cols.map(item =>

                        <div className='text-center d-flex flex-column'
                            style={{ width: item.width }}>
                            <p className='m-0' key={item.Header} > {item.Header}</p>
                            <div style={{ float: "right" }}>
                                {item.tooltip}
                            </div>
                        </div>
                    )}
                </div>
                <div className="tables" style={{ height: '70vh', width: '100%', overflowY: "auto" }}>
                    <table>
                        {response.length ?
                            <thead className='d-none'>
                                <tr>
                                    {multi_student_cols.map(item =>
                                        <th key={item.Header} className=''>{item.Header}{item.tooltip}</th>
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
                                        const rate = tutorShortList.rate
                                        return (
                                            <tr key={index}>
                                                <td className='' style={{ width: multi_student_cols[0].width }}>
                                                    <Avatar
                                                        size='100'
                                                        indicSize='20px'
                                                        avatarSrc={tutorSetup?.Photo}
                                                        online={tutorSetup.Online}
                                                    />
                                                </td>
                                                <td className='m-auto' style={{ width: multi_student_cols[0].width }}>
                                                    <div className="form-check form-switch d-flex gap-3 justify-content-center" style={{ fontSize: "16px " }}>
                                                        <input
                                                            className="form-check-input "
                                                            type="checkbox"
                                                            role="switch"
                                                            style={{
                                                                width: "30px",
                                                                height: "15px"
                                                            }}
                                                            checked={tutorSetup.VacationMode}
                                                        />

                                                    </div>
                                                </td>
                                                <td style={{ width: multi_student_cols[0].width }}>
                                                    {tutorSetup.VacationMode ?
                                                        `${showDate(tutorSetup.StartVacation)} - ${showDate(tutorSetup.EndVacation)}`
                                                        : `-`
                                                    }  </td>
                                                <td style={{ width: multi_student_cols[0].width }}>
                                                    <input type='checkbox'
                                                        style={{ height: '20px', width: '20px' }}
                                                        checked={tutorShortList?.IntroSessionDiscount || false}
                                                    />
                                                </td>
                                                <td style={{ width: multi_student_cols[1].width }} className=''>
                                                    {tutorShortList?.Subject}
                                                </td>
                                                <td style={{ width: multi_student_cols[2].width }} className=''>
                                                    {convertTutorIdToName(tutorSetup?.AcademyId)}
                                                </td>
                                                <td style={{ width: multi_student_cols[3].width }}>
                                                    {tutorSetup?.Country}
                                                </td>
                                                <td style={{ width: multi_student_cols[4].width }} className=' text-center'>
                                                    {showDate(convertGMTToLocalTime(tutorSetup?.GMT), wholeDateFormat)} <br />
                                                </td>
                                                <td style={{ width: multi_student_cols[5].width }} className=''>
                                                    <div className={`d-inline card px-1 m-auto ${classByDifference(calculateTimeDifference(tutorSetup?.GMT))}`}
                                                        style={{ fontSize: "18px" }}
                                                    >
                                                        {calculateTimeDifference(tutorSetup?.GMT) > 0 ?
                                                            `+${calculateTimeDifference(tutorSetup?.GMT)}` :
                                                            calculateTimeDifference(tutorSetup?.GMT)}
                                                    </div>
                                                </td>
                                                <td style={{ width: multi_student_cols[6].width }}>
                                                    <button className='btn btn-outline-primary btn-sm'
                                                        onClick={() => handleNavigateToSchedule(item)}>
                                                        Book Lesson</button>
                                                </td>
                                                <td style={{ width: multi_student_cols[7].width }} >
                                                    <button className='btn btn-outline-success btn-sm'
                                                        onClick={() => handleNavigateToFeedback(tutorSetup.AcademyId)}>
                                                        Feedbacks</button>
                                                </td>
                                                <td style={{ width: multi_student_cols[8].width }}>
                                                    <button className='btn btn-outline-primary btn-sm'
                                                        onClick={() => redirect_to_tutor_profile(tutorSetup?.AcademyId)}>
                                                        View Profile</button>
                                                </td>
                                                <td style={{ width: multi_student_cols[9].width }}>{rate}</td>
                                                <td style={{ width: multi_student_cols[10].width }}>
                                                    {tutorShortList.CancellationPolicy} Hrs
                                                </td>

                                                <td style={{ width: multi_student_cols[11].width }}>
                                                    {tutorSetup.ResponseHrs.replace("Hours", "Hrs")}
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
            <Actions saveDisabled="true" />
        </>
    );
}

export default StudentShortList;