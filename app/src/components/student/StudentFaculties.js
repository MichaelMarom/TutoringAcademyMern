import { useEffect, useState } from 'react';
import {
    getTutorsAccordingToSubjectandFaculty,
    get_student_short_list,
    get_student_short_list_data,
    get_tutor_subject,
    upload_student_short_list
} from '../../axios/student';
import { create_chat } from '../../axios/chat';
import { get_faculty, get_faculty_subject } from '../../axios/tutor';

import { socket } from '../../config/socket';
import Actions from '../common/Actions';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setShortlist } from '../../redux/student_store/shortlist';
import Tooltip from '../common/ToolTip';
import { convertToDate } from '../common/Calendar/Calendar';
import Pill from '../common/Pill';
import { statesColours, wholeDateFormat } from '../../constants/constants';
import SubMenu from '../common/SubMenu';
import Loading from '../common/Loading';
import { BiChevronDown } from 'react-icons/bi';
import { convertTutorIdToName } from '../../helperFunctions/generalHelperFunctions';
import Avatar from '../common/Avatar';
import { showDate } from '../../helperFunctions/timeHelperFunctions';
import { useNavigate } from 'react-router-dom';
import { setTutor } from '../../redux/student_store/selectedTutor';
import BTN_ICON from '../../assets/images/button__icon.png'
import { IoArrowBackCircleSharp } from 'react-icons/io5';


const StudentFaculties = () => {
    const dispatch = useDispatch()
    const [subjects, setSubjects] = useState([]);
    const [response, setResponse] = useState([]);

    const [checkBoxClicked, setCheckBoxClicked] = useState("")
    const { student } = useSelector(state => state.student)
    const [faculties, set_faculties] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState(1);
    const [fetchedTutorSubjectRecord, setFetchedTutorSubjectRecord] = useState(true)
    const [loading, setLoading] = useState(false)
    const [selectedTutors, setSelectedTutors] = useState([])
    const [selectedSubject, setSelectedSubject] = useState({})
    const [tutorsWithRates, setTutorWithRates] = useState([])
    const [fetchingTutorsRate, setFetchingTutorsRate] = useState(false)
    const navigate = useNavigate()

    const handleNavigateToSchedule = async (item) => {
        dispatch(setTutor({
            id: item.SID[0],
            academyId: item.AcademyId,
            GMT: item.GMT,
            firstName: item.FirstName,
            lastName: item.LastName,
            subject: selectedSubject.SubjectName,
            rate: item.Rate,
            disableColor: item.disableColor,
            introDiscountEnabled: item.IntroSessionDiscount || false,
            activateSubscriptionOption: item.ActivateSubscriptionOption === "true",
            discountHours: item.DiscountHours,
            StartVacation: item.StartVacation,
            EndVacation: item.EndVacation,
            VacationMode: item.VacationMode,
        }))
        navigate('/student/booking')
    }
    const handleNavigateToFeedback = (id) => navigate(`/student/tutor/feedback/${id}`)

    function convertGMTToLocalTime(gmtOffset) {
        const utcTime = new Date();
        const localTime = new Date(utcTime.getTime() + gmtOffset * 60 * 60 * 1000);
        return localTime;
    }

    useEffect(() => {
        if (selectedFaculty) {
            get_faculty_subject(selectedFaculty).then((result) => {
                if (!result?.response?.data) setSubjects(result)
            })
        }
    }, [selectedFaculty])

    useEffect(() => {
        if (selectedSubject.Id && selectedFaculty && student.AcademyId) {
            setFetchingTutorsRate(true)
            setTimeout(() => {
                setFetchingTutorsRate(false)
            }, 3000);

            getTutorsAccordingToSubjectandFaculty(selectedSubject.SubjectName, selectedFaculty, student.AcademyId).then((result) => {
                !result?.response?.data && setTutorWithRates(result)
            }).finally(() => {
                // setFetchingTutorsRate(false)
            })
        }
    }, [selectedSubject, selectedFaculty, student])

    console.log(fetchingTutorsRate, tutorsWithRates)

    // useEffect(() => {
    //     const fetchTutorSubject = async () => {
    //         const result = await get_tutor_subject('1');
    //         if (!result?.response?.data) {
    //             result.sort(function (a, b) {
    //                 if (a.subject < b.subject) {
    //                     return -1;
    //                 }
    //                 if (a.subject > b.subject) {
    //                     return 1;
    //                 }
    //                 return 0;
    //             });
    //             setResponse(result)
    //         }
    //     }
    //     fetchTutorSubject()

    // }, [])

    let getTutorSubject = async () => {
        const result = await get_tutor_subject(selectedFaculty)
        setFetchedTutorSubjectRecord(true)
        if (!result?.repsonse?.data) {
            result.sort(function (a, b) {
                if (a.subject < b.subject) {
                    return -1;
                }
                if (a.subject > b.subject) {
                    return 1;
                }
                return 0;
            });
            setResponse(result);
        }
    }

    useEffect(() => {
        setSelectedSubject({})
        getTutorSubject()
    }, [selectedFaculty])

    useEffect(() => {
        !selectedSubject.Id && setTutorWithRates([])
    }, [selectedSubject])

    const getShortlist = async () => {
        const result = await get_student_short_list(window.localStorage.getItem('student_user_id'))
        if (!result?.response.data) {
            result.sort(function (a, b) {
                if (a.Subject < b.Subject) {
                    return -1;
                }
                if (a.Subject > b.Subject) {
                    return 1;
                }
                return 0;
            });
            dispatch(setShortlist(result))
        }
    }

    // useEffect(() => {
    //     get_student_short_list_data(student.AcademyId)
    //         .then((result) => {
    //             let list = [...document.querySelectorAll('#student-tutor')];
    //             if (result?.length) {
    //                 setSelectedTutors(result)
    //                 result.map(item => {
    //                     let elem = list.filter(res => res.dataset.id.split('-')[0] === item.AcademyId && res.dataset.id.split('-')[1] === item.Subject)
    //                     if (elem.length > 0) {
    //                         elem[0].children[0].checked = true;
    //                     }
    //                 })
    //             }
    //         })
    //         .catch((err) => console.log(err))
    // }, [response, checkBoxClicked, student])

    // let multi_student_cols = [
    //     {
    //         Header: '# Select',
    //         width: "7%",
    //         tooltip: <Tooltip color='white' width="200px" direction='bottomright'
    //             text="The student must conduct an introduction lesson with tutor. 
    //             Most Tutors motivate students by offering the 'Intro' lesson at half price. 
    //             The discounted 'Intro' marked by a green check box icon. 
    //         After the 'intro' lesson performed, the student being requested to provide  
    //         feedback before permitted to book further lessons with the tutor."  />
    //     },
    //     { Header: 'Subject', width: "7%", },
    //     { Header: 'Tutor', width: "7%", },
    //     { Header: 'Experience', width: "7%", },
    //     { Header: 'Certification', width: "7%", },
    //     { Header: 'Certificate Country', width: "7%", },
    //     { Header: 'Expiration', width: "7%", },
    //     { Header: 'Rate', width: "7%", },
    //     {
    //         Header: 'CancellationPolicy',
    //         width: "7%",
    //         tooltip: <Tooltip width="200px" color='white' direction='bottomleft'
    //             text="Indicate the cancellation period in hours. If you delete your booked session before that, then you will be refunded the full amount" />
    //     },
    //     {
    //         Header: 'ResponseTime',
    //         width: "7%",
    //         tooltip: <Tooltip width="200px" color='white' direction='bottomleft'
    //             text="Indicate the cancellation period in hours. If you delete your booked session before that, then you will be refunded the full amount" />
    //     }]

    let multi_student_cols = [
        { Header: 'Photo', width: "8.33%", },
        { Header: 'Rate', width: "8.33%", },

        {
            Header: 'Demo @50%',
            width: "8.33%",
            tooltip: <Tooltip color='white' width="200px" direction='bottomright'
                text="The student must conduct an introduction lesson with tutor. Most 
                Tutors motivate students by offering the 'Intro' lesson at half price. 
                The discounted 'Intro' marked by a green check box icon. 
                After the 'intro' lesson performed, the student being requested to provide
                 feedback before permitted to book further lessons with the tutor."  />
        },
        { Header: 'Name', width: "8.33%", },
        { Header: 'Country', width: "8.33%", },
        {
            Header: 'Time (UTC).',
            width: "8.33%",
            tooltip: <Tooltip width="200px" color='white' direction='bottomleft'
                text="The time shown is the local time (UTC) at the tutor's location." />
        },
        {
            Header: "Time Diff",
            width: "8.33%",
            tooltip: <Tooltip color='white' direction='bottomleft' width='200px'
                text="The numbers below calculate the difference between your time zone and the tutor. When difference is between +/-3 to 6 Hours, we provide orange background. And if is 7 time zones or more, we show blinking red background. When you book your lesson on the tutor's calendar, it will be shown on your calendar adjusted to your local time (UTC). " />
        },
        {
            Header: 'View Schedule',
            width: "8.33%",
            tooltip: <Tooltip width="200px" color='white' direction='bottomright'
                text="Its cancellation time, if you delet your booked session before that, then you will be refunded ful amount" />
        },
        {
            Header: 'FeedBack',
            width: "8.33%",
            tooltip: <Tooltip width="200px" color='white' direction='bottomleft'
                text="To view tutor's feedback as graded by other students, click the button below." />
        },
        {
            Header: 'Profile',
            width: "8.33%",
            tooltip: <Tooltip color='white' direction='bottomleft' width='200px'
                text="To view the full tutor's profile, include introduction video, education credentials, verifications, work experience, and more, Click on the button below." />
        },
        {
            Header: 'Policy',
            width: "8.33%",
            tooltip: <Tooltip color='white' direction='bottomleft' width='200px'
                text="Number of hours the tutor allows you to cancell the booked lesson without penalty. if you cancel less than the indicated hours, you liable for the lesson amount. Otherwise you will receive refund." />
        },
        {
            Header: 'Response Time',
            width: "8.33%",
            tooltip: <Tooltip width="200px" color='white' direction='bottomleft'
                text="This is the time the tutor committed to response to you address him/her. Please take notice that this committment is in effect during tutor's local time (UTC) business hours. " />
        }

    ]

    let handleSavedDeleteData = async (e, status, body) => {
        setLoading(true)
        let elem = e.target;

        let pElem = elem.parentElement;
        let id = pElem.dataset;
        if (!elem.checked) {
            toast.error("This record was removed from your shortlist")
            socket.emit('studentIllShorList', { id });
            getShortlist()
            setCheckBoxClicked(elem)
            setLoading(false)
        }
        else {
            if (status === 'active') {
                setTimeout(async () => {
                    let res = await upload_student_short_list(body);
                    if (!!res?.length) {
                        setCheckBoxClicked(elem)

                        toast.success("Your selected subject has been listed in the Shortlist tab! Select the tab to view it.", { pauseOnHover: true })

                        await create_chat({ User1ID: body.Student, User2ID: body.AcademyId })
                        toast.info('You can chat with the selected tutor in the Message Board Tab!')
                        getShortlist()
                        setLoading(false)

                        elem.checked = true;
                    }
                }, 2000)
            }
            else toast.warning('You can select only Active Tutors')
        }
    }

    const getFacultiesOption = async () => {
        let list = await get_faculty()
        list?.length && set_faculties(list)
    }
    useEffect(() => { getFacultiesOption() }, [])


    let redirect_to_tutor_profile = (id) => {
        navigate(`/student/tutor-profile/${id}`)
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


    return (
        <>
            <div className="tutor-popin"></div>
            <div className="save-overlay">
                <span className="save_loader"></span>
            </div>
            <div className="form-subjects" style={{ overflow: 'hidden', height: 'calc(100vh - 50px)' }}>

                <div id="form-subject-data-collection-table">
                    <SubMenu faculty={faculties} selectedFaculty={selectedFaculty} setSelectedFaculty={setSelectedFaculty} />

                    <div className="highlight m-0" style={{ width: '100%' }}>
                        There are 41 faculties containing 600+ subjects to select from. From the sub menu above, select the faculty of interest.
                        Then from the table below select the subject of interest. Your selected subject generates a coparison table of all tutors
                        for that subject allow you to compare from the list. Then click on the BOOK LESSON button to view your preferred tutor's calendar.
                    </div>

                    <div className='d-flex  rounded justify-content-between
                         align-items-center
                         p-2' style={{ color: "white", background: "#2471A3" }}>
                        {subjects.length} subjects. Select the subject of interest from the list bellow.
                    </div>

                    {selectedSubject.SubjectName && <div className='d-flex align-items-center ' style={{ gap: "30px" }}>
                        <div className='d-flex align-items-center' onClick={() => setSelectedSubject({})}><IoArrowBackCircleSharp size={20} /> Back</div>
                        <p className='m-0'>
                            {selectedSubject.SubjectName}
                        </p>
                    </div>}

                    <div>
                        {!selectedSubject.SubjectName &&
                            <div className='d-flex flex-wrap align-content-start' style={{ height: "55vh", overflowY: "auto" }}>
                                {subjects.map(subj =>

                                    <div className="form-check col-3 border m-0 " style={{ height: "45px" }}>
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="options"
                                            checked={selectedSubject.Id === subj.Id}
                                            onChange={() => setSelectedSubject(subj)}
                                        />
                                        <label className="form-check-label" htmlFor="option1">
                                            {subj.SubjectName}
                                        </label>
                                    </div>
                                )
                                }
                                <div style={{ height: "40px", marginTop: "20px" }}></div>

                            </div>}

                        {selectedSubject.SubjectName && !fetchingTutorsRate ?
                            <>
                                <div className='d-flex rounded justify-content-between  align-items-center '
                                    style={{ color: "white", background: "#2471A3" }}>
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

                                <div className="tables" style={{ height: '53vh', width: '100%', overflowY: "auto" }}>
                                    <table>
                                        {tutorsWithRates.length ?
                                            <thead className='d-none'>
                                                <tr>
                                                    {multi_student_cols.map(item =>
                                                        <th key={item.Header} className=''>{item.Header}{item.tooltip}</th>
                                                    )}
                                                </tr>
                                            </thead> : <div className="text-danger p-4 m-2">No tutors found that is offering that Subject </div>}
                                        <tbody>
                                            {
                                                tutorsWithRates.map((item, index) => {
                                                    const rate = item.rate;
                                                    return (
                                                        <tr key={index}>
                                                            <td style={{ width: multi_student_cols[0].width, border: '1px solid lightgray' }}>
                                                                <div className='d-flex flex-column' >
                                                                    <Avatar
                                                                        size='50'
                                                                        avatarSrc={item?.Photo}
                                                                        online={item.Online}
                                                                        showOnlineStatus={false}
                                                                    />
                                                                    {item.CodeApplied &&
                                                                        <div className="blinking-button" style={{ color: "black" }}>
                                                                            <Pill fontColor='black' label={'connected'} customColor color='limegreen' editable={false} hasIcon={false} />
                                                                        </div>
                                                                    }
                                                                </div>
                                                            </td>
                                                            <td style={{ width: multi_student_cols[9].width, border: '1px solid lightgray' }}>{rate}</td>                                                                <td style={{ width: multi_student_cols[0].width, border: '1px solid lightgray' }}>
                                                                <input type='checkbox'
                                                                    style={{ height: '20px', width: '20px' }}
                                                                    checked={item?.IntroSessionDiscount || false}
                                                                />
                                                            </td>

                                                            <td style={{ width: multi_student_cols[2].width, border: '1px solid lightgray' }} className=''>
                                                                {convertTutorIdToName(item?.AcademyId)}
                                                            </td>
                                                            <td style={{ width: multi_student_cols[3].width, border: '1px solid lightgray' }}>
                                                                {item?.Country}
                                                            </td>
                                                            <td style={{ width: multi_student_cols[4].width, border: '1px solid lightgray' }} className='text-center'>
                                                                {showDate(convertGMTToLocalTime(item?.GMT), wholeDateFormat)} <br />
                                                            </td>
                                                            <td style={{ width: multi_student_cols[5].width, border: '1px solid lightgray' }} className=''>
                                                                <div className={`d-inline card px-1 m-auto ${classByDifference(calculateTimeDifference(item?.GMT))}`}
                                                                    style={{ fontSize: "18px" }}
                                                                >
                                                                    {calculateTimeDifference(item?.GMT) > 0 ?
                                                                        `+${calculateTimeDifference(item?.GMT)}` :
                                                                        calculateTimeDifference(item?.GMT)}
                                                                </div>
                                                            </td>
                                                            <td style={{ width: multi_student_cols[6].width, border: '1px solid lightgray' }}>
                                                                <button className='action-btn-square'
                                                                    onClick={() => handleNavigateToSchedule(item)}>
                                                                    <div className='button__content'>
                                                                        <div className='button__icon'>
                                                                            <img src={BTN_ICON} alt={"btn__icon"} />
                                                                        </div>
                                                                        <div className='button__text  text-sm'>Book Lesson</div>
                                                                    </div>
                                                                </button>
                                                            </td>
                                                            <td style={{ width: multi_student_cols[7].width, border: '1px solid lightgray' }} >
                                                                <button className='action-btn-square'
                                                                    onClick={() => handleNavigateToFeedback(item.AcademyId)}>
                                                                    <div className='button__content'>
                                                                        <div className='button__icon'>
                                                                            <img src={BTN_ICON} alt={"btn__icon"} />
                                                                        </div>
                                                                        <div className='button__text'> Feedbacks</div>
                                                                    </div></button>
                                                            </td>
                                                            <td style={{ width: multi_student_cols[8].width, border: '1px solid lightgray' }}>
                                                                <button className='action-btn-square'
                                                                    onClick={() => redirect_to_tutor_profile(item?.AcademyId)}>
                                                                    <div className='button__content'>
                                                                        <div className='button__icon'>
                                                                            <img src={BTN_ICON} alt={"btn__icon"} />
                                                                        </div>
                                                                        <div className='button__text'> View Profile</div>
                                                                    </div>
                                                                </button>
                                                            </td>
                                                            <td style={{ width: multi_student_cols[10].width, border: '1px solid lightgray' }}>
                                                                {item.CancellationPolicy} Hrs
                                                            </td>

                                                            <td style={{ width: multi_student_cols[11].width, border: '1px solid lightgray' }}>
                                                                {item.ResponseHrs.replace("Hours", "Hrs")}
                                                            </td>

                                                        </tr>
                                                    )
                                                })
                                            }

                                        </tbody>
                                    </table>
                                </div>
                            </> : <Loading height='30vh' />
                        }
                    </div>

                    {/* {(fetchedTutorSubjectRecord && !loading) ?
                        subjects?.length ?
                            <>
                                <div className='' style={{ height: "72vh", overflowY: "auto" }}>
                                    <div className='container'>
                                        {subjects.map(item =>
                                            <div className=' rounded m-1 border' style={{ background: "lightgray" }}>
                                                <div onClick={() => selectedSubject.Id == item.Id ?
                                                    setSelectedSubject({}) : setSelectedSubject(item)}
                                                    className='ad  click-effect-elem  shadow-sm p-2  
                                                    d-flex justify-content-between align-items-center'
                                                    style={{ gap: "20px" }} >
                                                    <div>
                                                        {item.SubjectName}
                                                    </div>
                                                    <div>
                                                        <BiChevronDown />
                                                    </div>
                                                </div>
                                                <div className={`w-100 ${selectedSubject.Id === item.Id ? '' : 'opacity-0'} `}
                                                    style={{
                                                        background: 'white',
                                                        maxHeight: selectedSubject.Id === item.Id ? '250px' : '0',
                                                        overflow: 'hidden',
                                                        transition: 'max-height ease-in-out 0.5s, opacity 0.5s, visibility 0.5s',
                                                    }}>
                                                    <div className='d-flex pb-3' style={{ gap: "50px" }}>
                                                        <div>
                                                            <div className='d-flex'>
                                                                {tutorsWithRates.map(tutor => <div className='w-25 p-2 border rounded shadow m-2'>
                                                                    <h5 > {convertTutorIdToName(tutor.AcademyId)} </h5>
                                                                    <h6 className='text-start'>Rate: {tutor.rate}</h6>
                                                                    <p className='m-0 ' style={{ fontSize: " 12px " }}>HighestEducation: {tutor.EducationalLevelExperience}</p>
                                                                    <p className='m-0 ' style={{ fontSize: " 12px " }}>Experience:  {tutor.EducationalLevel}</p>
                                                                    <div>-</div>
                                                                    <div>
                                                                        CertificateExpiration: {item.CertificateExpiration?.length ?
                                                                            <div
                                                                                className={convertToDate(item.CertificateExpiration).getTime() < (new Date).getTime() ?
                                                                                    `text-danger blinking-button` : ''}>
                                                                                {new Date(item.CertificateExpiration).toLocaleDateString()}
                                                                            </div> : "-"
                                                                        }</div>
                                                                    <p className='m-0 ' style={{ fontSize: " 12px " }}>Certificate:  {tutor.Certificate}</p>
                                                                    <p className='m-0 ' style={{ fontSize: " 12px " }}>Certificate State: {tutor.CertificateState}</p>
                                                                    <p className='m-0 ' style={{ fontSize: " 12px " }}>Certificate COuntry{tutor.CertCountry}</p>

                                                                </div>)}
                                                            </div>


                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </>
                            : <div style={{
                                position: 'absolute', width: '100%',
                                textAlign: 'center', fontSize: 'large', paddingTop: '20px',
                                fontWeight: 'bold'
                            }}>We Are Sorry, There Are No Tutor(s) Available For This Faculty. Please check later. New tutors register every day.</div>
                        : <Loading height='50vh' />
                    } */}


                </div>
            </div >
            <Actions saveDisabled={true} />
        </>
    );
}

export default StudentFaculties;