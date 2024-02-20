import { useEffect, useState } from 'react';

import { COLUMNS } from '../../Tables/Faculty/columns';
import { useMemo } from 'react';
import { get_student_short_list, get_student_short_list_data, get_tutor_subject, upload_student_short_list } from '../../axios/student';
import { socket } from '../../config/socket';
import Actions from '../common/Actions';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setShortlist } from '../../redux/student_store/shortlist';
import { create_chat } from '../../axios/chat';
import Tooltip from '../common/ToolTip';
import { convertToDate } from '../common/Calendar/Calendar';
import { FaSearch } from 'react-icons/fa';
import tutorData from '../../redux/tutor_store/tutorData';
import Pill from '../common/Pill';
import { statesColours } from '../../constants/constants';
import { get_faculty } from '../../axios/tutor';
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

    useEffect(() => {
        const fetchTutorSubject = async () => {
            const result = await get_tutor_subject('1');
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
        fetchTutorSubject()

    }, [])

    let getTutorSubject = async () => {
        const result = await get_tutor_subject(selectedFaculty)
        setFetchedTutorSubjectRecord(true)
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
    useEffect(() => {
        getTutorSubject()
    }, [selectedFaculty])

    const getShortlist = async () => {
        const result = await get_student_short_list(window.localStorage.getItem('student_user_id'))
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

    useEffect(() => {
        if (checkBoxClicked.type?.length) {
            document.querySelector('.save-overlay')?.setAttribute('id', 'save-overlay')
            let list = [...document.querySelectorAll('#student-tutor')];
            let doc = list.filter(item =>
                item.children[0].checked === true
            )

            let data = doc.map(item => item.dataset.id)
            const tutorStatus = data[0].split('-')[5]
            const activeTutor = tutorStatus === 'active';

            if (activeTutor) {
                if (data[0]) {
                    console.log(data[0])
                    let res = upload_student_short_list(data);

                    if (res) {
                        const tutorSelectedId = data[0].split('-')[0]
                        create_chat({ User1ID: student.AcademyId, User2ID: tutorSelectedId })
                            .then(() => { toast.success('You can also chat with selected tutor in MessageBoard Tab!') })
                            .catch((err => console.log(err)))

                        setTimeout(() => {
                            document.querySelector('.save-overlay')?.removeAttribute('id');
                        }, 1000);
                        getShortlist()

                        toast.success("Your selected record was uploaded to your short list")
                        setTimeout(() => {
                            if (document.querySelector('.tutor-popin')) {
                                document.querySelector('.tutor-popin')?.removeAttribute('id');
                            }
                        }, 5000);

                    } else {
                        setTimeout(() => {
                            document.querySelector('.save-overlay')?.removeAttribute('id');
                        }, 1000);

                        document.querySelector('.tutor-popin')?.setAttribute('id', 'tutor-popin');
                        document.querySelector('.tutor-popin').style.background = 'red';
                        document.querySelector('.tutor-popin').innerHTML = res.mssg
                        setTimeout(() => {
                            document.querySelector('.tutor-popin')?.removeAttribute('id');
                        }, 5000);
                    }
                }
            }
            else toast.warning('You can only Select Active Tutors')
        }
    }, [checkBoxClicked])

    useEffect(() => {
        get_student_short_list_data(window.localStorage.getItem('student_user_id'))
            .then((result) => {
                let list = [...document.querySelectorAll('#student-tutor')];
                if (result.length) {
                    result.map(item => {
                        let elem = list.filter(res => res.dataset.id.split('-')[0] === item.AcademyId && res.dataset.id.split('-')[1] === item.Subject)
                        if (elem.length > 0) {
                            elem[0].children[0].checked = true;
                        }
                    })
                }
            })
            .catch((err) => console.log(err))
    }, [response])


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
        { Header: 'State', width: "7%", },
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

    let handleSavedDeleteData = (e, status) => {
        let elem = e.target;

        let pElem = elem.parentElement;
        let id = pElem.dataset;

        if (!elem.checked) {
            toast.error("This record was removed from your shortlist")
            socket.emit('studentIllShorList', { id });
            getShortlist()
        }
        else {
            if (status === 'active') setCheckBoxClicked(elem)
            else toast.warning('You can only select Active Tutors')
        }
    }

    const getFacultiesOption = async () => {
        let list = await get_faculty()
        set_faculties(list)
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
                        There are 31 faculties containing 400+ subjects to select from. From the sub menu above, select the faculty of interest.
                        Then checkbox from the table below the Tutor(s) of interest. Your selected tutors be shown in the next "Short List" tab to compare
                        from the list. Then on the SHORT LIST tab, click on BOOK LESSON button to view tutor calendar.
                    </div>

                    {fetchedTutorSubjectRecord ?
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
                                                        <td style={{ width: multi_student_cols[0].width }} id='student-tutor'
                                                            data-id={`${item.AcademyId[0]}-${item.subject}-${item.rate}-${item?.AcademyId}-${student.AcademyId}-${item.status}`}>

                                                            <input disabled={item.status !== 'active'} onClick={() => toast.success('hehe')} onInput={(e) => handleSavedDeleteData(e, item.status)} type='checkbox'
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
                                                            {item.CertificateState}
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