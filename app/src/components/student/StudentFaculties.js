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
import { statesColours } from '../../constants/constants';
import SubMenu from '../common/SubMenu';
import Loading from '../common/Loading';
import { BiChevronDown } from 'react-icons/bi';
import { convertTutorIdToName } from '../../helperFunctions/generalHelperFunctions';

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


    useEffect(() => {
        if (selectedFaculty) {
            get_faculty_subject(selectedFaculty).then((result) => {
                if (!result?.response?.data) setSubjects(result)
            })
        }
    }, [selectedFaculty])

    useEffect(() => {
        if (selectedSubject.Id && selectedFaculty) {
            getTutorsAccordingToSubjectandFaculty(selectedSubject.SubjectName, selectedFaculty).then((result) => {
                !result?.response?.data && setTutorWithRates(result)
            })
        }
    }, [selectedSubject, selectedFaculty])

    console.log(subjects, selectedFaculty, tutorsWithRates)
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
        getTutorSubject()
    }, [selectedFaculty])

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

    let multi_student_cols = [
        {
            Header: '# Select',
            width: "7%",
            tooltip: <Tooltip color='white' width="200px" direction='bottomright'
                text="The student must conduct an introduction lesson with tutor. 
                Most Tutors motivate students by offering the 'Intro' lesson at half price. 
                The discounted 'Intro' marked by a green check box icon. 
            After the 'intro' lesson performed, the student being requested to provide  
            feedback before permitted to book further lessons with the tutor."  />
        },
        { Header: 'Subject', width: "7%", },
        { Header: 'Tutor', width: "7%", },
        { Header: 'Experience', width: "7%", },
        { Header: 'Certification', width: "7%", },
        { Header: 'Certificate Country', width: "7%", },
        { Header: 'Expiration', width: "7%", },
        { Header: 'Rate', width: "7%", },
        {
            Header: 'CancellationPolicy',
            width: "7%",
            tooltip: <Tooltip width="200px" color='white' direction='bottomleft'
                text="Indicate the cancellation period in hours. If you delete your booked session before that, then you will be refunded the full amount" />
        },
        {
            Header: 'ResponseTime',
            width: "7%",
            tooltip: <Tooltip width="200px" color='white' direction='bottomleft'
                text="Indicate the cancellation period in hours. If you delete your booked session before that, then you will be refunded the full amount" />
        }]

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
                        There are 39 faculties containing 600+ subjects to select from. From the sub menu above, select the faculty of interest.
                        Then checkbox from the table below the Tutor(s) of interest. Your selected tutors to be shown in the "Short List" tab, allows you to compare
                        from the list. Then from the SHORT LIST tab, click on the BOOK LESSON button to view your preferred tutor's calendar.
                    </div>

                    {(fetchedTutorSubjectRecord && !loading) ?
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
                    }


                </div>
            </div >
            <Actions saveDisabled={true} />
        </>
    );
}

export default StudentFaculties;