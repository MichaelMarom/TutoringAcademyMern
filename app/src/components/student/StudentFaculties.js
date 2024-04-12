import { useEffect, useState } from 'react';
import {
    get_student_short_list,
    get_student_short_list_data,
    get_tutor_subject,
    upload_student_short_list
} from '../../axios/student';
import { create_chat } from '../../axios/chat';
import { get_faculty } from '../../axios/tutor';

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

const StudentFaculties = () => {
    const dispatch = useDispatch()
    const [response, setResponse] = useState([]);
    const [checkBoxClicked, setCheckBoxClicked] = useState("")
    const { student } = useSelector(state => state.student)
    const [faculties, set_faculties] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState(1);
    const [fetchedTutorSubjectRecord, setFetchedTutorSubjectRecord] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedTutors, setSelectedTutors] = useState([])

    useEffect(() => {
        const fetchTutorSubject = async () => {
            const result = await get_tutor_subject('1');
            if (!result?.response?.data) {
                result.sort(function (a, b) {
                    if (a.subject < b.subject) {
                        return -1;
                    }
                    if (a.subject > b.subject) {
                        return 1;
                    }
                    return 0;
                });
                setResponse(result)
            }
        }
        fetchTutorSubject()

    }, [])

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

    useEffect(() => {
        get_student_short_list_data(student.AcademyId)
            .then((result) => {
                let list = [...document.querySelectorAll('#student-tutor')];
                if (result?.length) {
                    setSelectedTutors(result)
                    result.map(item => {
                        let elem = list.filter(res => res.dataset.id.split('-')[0] === item.AcademyId && res.dataset.id.split('-')[1] === item.Subject)
                        if (elem.length > 0) {
                            elem[0].children[0].checked = true;
                        }
                    })
                }
            })
            .catch((err) => console.log(err))
    }, [response, checkBoxClicked, student])

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
                        response?.length ?
                            <>
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

                                <div className="tables" style={{ height: '40vh', width: '100%', overflow: 'auto', padding: '5px' }}>
                                    <table>
                                        <thead className='d-none'>
                                            <tr>
                                                {multi_student_cols.map(item => <th key={item.Header}>{item.Header}{item.tooltip}</th>)}
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                response.map((item) => {
                                                    return <tr>
                                                        <td style={{ width: multi_student_cols[0].width }} id={`student-tutor`}
                                                            data-id={`${item.AcademyId[0]}-${item.subject}-${item.rate}-${item?.AcademyId}-${student.AcademyId}-${item.status}`}
                                                        >

                                                            <input disabled={item.status !== 'active' || loading} onChange={(e) =>
                                                                handleSavedDeleteData(e, item.status, {
                                                                    Student: student.AcademyId, Rate: item.rate, date: new Date(),
                                                                    AcademyId: item.AcademyId[0], Subject: item.subject
                                                                })} type='checkbox' checked={
                                                                    !!selectedTutors.find(tutor =>
                                                                        tutor.Subject === item.subject && tutor.AcademyId == item.AcademyId[0] &&
                                                                        tutor.Student === student.AcademyId)?.AcademyId}
                                                                style={{ height: '20px', width: '20px' }} />
                                                        </td>

                                                        <td style={{ width: multi_student_cols[1].width }}>{item.subject}</td>
                                                        <td style={{ width: multi_student_cols[2].width }}>
                                                            <div>
                                                                {(item.AcademyId[0]).split(".").slice(0, 2).join(".")}
                                                                <Pill label={item.status} customColor={true} color={statesColours[item.status].bg}
                                                                    fontColor={statesColours[item.status].color}
                                                                    width='auto'
                                                                />
                                                            </div>
                                                        </td>
                                                        <td style={{ width: multi_student_cols[3].width }}>
                                                            {item.EducationalLevelExperience}
                                                        </td>
                                                        <td style={{ width: multi_student_cols[4].width }}>
                                                            {item.Certificate}
                                                        </td>
                                                        <td style={{ width: multi_student_cols[5].width }}>
                                                            {item.CertCountry}
                                                        </td>
                                                        <td style={{ width: multi_student_cols[6].width }}>
                                                            {item.CertificateExpiration?.length ?
                                                                <div className={convertToDate(item.CertificateExpiration).getTime() <
                                                                    (new Date).getTime() ? `text-danger blinking-button` : ''}>
                                                                    {new Date(item.CertificateExpiration).toLocaleDateString()}
                                                                </div> : "-"
                                                            }
                                                        </td>
                                                        <td style={{ width: multi_student_cols[7].width }}>{item.rate}</td>
                                                        <td style={{ width: multi_student_cols[8].width }}>{item.cancPolicy} Hrs </td>
                                                        <td style={{ width: multi_student_cols[9].width }}>{item.responseTime.replace("Hours", 'Hrs')} </td>

                                                    </tr>
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </>
                            : <div style={{ position: 'absolute', width: '100%', textAlign: 'center', fontSize: 'large', paddingTop: '20px', fontWeight: 'bold' }}>We Are Sorry, There Are No Tutor(s) Available For This Faculty. Please check later. New tutors register every day.</div>
                        : <Loading height='50vh' />
                    }


                </div>
            </div >
            <Actions saveDisabled={true} />
        </>
    );
}

export default StudentFaculties;