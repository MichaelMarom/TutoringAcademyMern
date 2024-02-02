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

const StudentFaculties = () => {
    const dispatch = useDispatch()
    const [response, setResponse] = useState([]);
    const [checkBoxClicked, setCheckBoxClicked] = useState("")
    const { student } = useSelector(state => state.student)

    useEffect(() => {
        const fetchTutorSubject = async () => {
            const result = await get_tutor_subject('1')
            result.sort(function (a, b) {
                if (a[0].subject < b[0].subject) {
                    return -1;
                }
                if (a[0].subject > b[0].subject) {
                    return 1;
                }
                return 0;
            });
            setResponse(result)
        }
        fetchTutorSubject()

    }, [])

    let getTutorSubject = async (e) => {
        let subject = e.currentTarget.dataset.id;

        const result = await get_tutor_subject(subject)
        setResponse(result);
        result.sort(function (a, b) {
            if (a[0].subject < b[0].subject) {
                return -1;
            }
            if (a[0].subject > b[0].subject) {
                return 1;
            }
            return 0;
        });
    }

    let handle_scroll_right = () => {

        let div = document.querySelector('.form-subject-data-tabs');
        let scroll_elem = div.children[1];
        let w = scroll_elem.offsetWidth;
        scroll_elem.scrollLeft = w;

    }

    let handle_scroll_left = () => {

        let div = document.querySelector('.form-subject-data-tabs');
        let scroll_elem = div.children[1];
        let w = scroll_elem.offsetWidth;
        scroll_elem.scrollLeft = -w

    }

    const getShortlist = async () => {
        const result = await get_student_short_list(window.localStorage.getItem('student_user_id'))
        result.sort(function (a, b) {
            if (a.tutorShortList.Subject < b.tutorShortList.Subject) {
                return -1;
            }
            if (a.tutorShortList.Subject > b.tutorShortList.Subject) {
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

            if (data[0]) {
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
    }, [checkBoxClicked])

    useEffect(() => {
        get_student_short_list_data(window.localStorage.getItem('student_user_id'))
            .then((result) => {
                console.log(result, 'cehbcjc')
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

    let handleSavedDeleteData = e => {

        let elem = e.target;

        let pElem = elem.parentElement;
        let id = pElem.dataset;

        if (!elem.checked) {
            toast.error("This record was removed from your shortlist")
            socket.emit('studentIllShorList', { id });
            getShortlist()
        }
        else {
            setCheckBoxClicked(elem)
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

                    <div className="form-subject-data-tabs mt-1" style={{ display: 'flex', margin: 'auto', padding: '0 0 0 0', justifyContent: 'center', alignItems: 'center', overflowX: 'hidden', width: '100%' }}>

                        <div style={{
                            margin: '0 0 0 0', display
                                : 'flex', alignItems: 'center', justifyContent: 'center', background: '#efefef', opacity: '.7', height: '100%', transform: 'skew(-0deg)'
                        }} className="scroller-left" onClick={handle_scroll_left}>
                            <div style={{ opacity: '1' }}>
                                <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 9L8 12M8 12L11 15M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                        </div>
                        <ul>
                            <li data-id='1' onClick={getTutorSubject} id='form-subject-data-tabs-list-active'><a>Math</a></li>
                            <li data-id='2' onClick={getTutorSubject}><a>Computer Language</a></li>
                            <li data-id='3' onClick={getTutorSubject}><a>English</a></li>
                            <li data-id='4' onClick={getTutorSubject}><a>Languages</a></li>
                            <li data-id='5' onClick={getTutorSubject}><a>Elementary Education</a></li>
                            <li data-id='6' onClick={getTutorSubject}><a>Science</a></li>
                            <li data-id='7' onClick={getTutorSubject}><a>Art </a></li>
                            <li data-id='8' onClick={getTutorSubject}><a>Social Studies </a></li>
                            <li data-id='9' onClick={getTutorSubject}><a>Programming</a></li>
                            <li data-id='10' onClick={getTutorSubject}><a>TestPrep</a></li>
                            <li data-id='11' onClick={getTutorSubject}><a>Business</a></li>
                            <li data-id='12' onClick={getTutorSubject}><a></a></li>
                            <li data-id='13' onClick={getTutorSubject}><a></a></li>
                            <li data-id='14' onClick={getTutorSubject}><a></a></li>
                            <li data-id='15' onClick={getTutorSubject}><a>Aviation</a></li>
                            <li data-id='16' onClick={getTutorSubject}><a>Engineering</a></li>
                        </ul>


                        <div style={{
                            margin: '0 0 0 0', background: '#efefef', display
                                : 'flex', alignItems: 'center', justifyContent: 'center', opacity: '.7', height: '100%', transform: 'skew(-0deg)'
                        }} className="scroller-right" onClick={handle_scroll_right}>
                            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">``
                                <path d="M13 15L16 12M16 12L13 9M16 12H8M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>

                        </div>
                    </div>




                    <div className="highlight m-0" style={{ width: '100%' }}>
                        There are 31 faculties containing 400+ subjects to select from. From the sub menu above, select the faculty of interest.
                        Then checkbox from the table below the Tutor(s) of interest. Your selected tutors be shown in the next "Short List" tab to compare
                        from the list. Then on the SHORT LIST tab, click on BOOK LESSON button to view tutor calendar.
                    </div>


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
                            {response?.length ?
                                <thead className='d-none'>
                                    <tr>
                                        {multi_student_cols.map(item => <th key={item.Header}>{item.Header}{item.tooltip}</th>)}
                                    </tr>
                                </thead>
                                :
                                <div className='text-danger'>
                                    No record found!
                                </div>}

                            {
                                response?.length
                                    ?
                                    <tbody>
                                        {

                                            response.map((item) => {
                                                let faculty = item[0] || {};
                                                let experience = item[1] || {};
                                                return <tr>
                                                    <td style={{ width: multi_student_cols[0].width }} id='student-tutor'
                                                        data-id={`${faculty.AcademyId}-${faculty.subject}-${faculty.rate}-${faculty?.AcademyId}-${window.localStorage.getItem('student_user_id')}`}>

                                                        <input onInput={handleSavedDeleteData} type='checkbox' style={{ height: '20px', width: '20px' }} />
                                                    </td>

                                                    <td style={{ width: multi_student_cols[1].width }}>{faculty.subject}</td>
                                                    <td style={{ width: multi_student_cols[2].width }}>
                                                        <div>
                                                            {(faculty.AcademyId).split(".").slice(0, 2).join(".")}
                                                            <Pill label={faculty.status} customColor={true} color={statesColours[faculty.status]}
                                                                width='auto'
                                                            />
                                                        </div>
                                                    </td>
                                                    <td style={{ width: multi_student_cols[3].width }}>
                                                        {experience.EducationalLevelExperience}
                                                    </td>
                                                    <td style={{ width: multi_student_cols[4].width }}>
                                                        {experience.Certificate}
                                                    </td>
                                                    <td style={{ width: multi_student_cols[5].width }}>
                                                        {experience.CertificateState}
                                                    </td>
                                                    <td style={{ width: multi_student_cols[6].width }}>
                                                        {experience.CertificateExpiration?.length ?
                                                            <div className={convertToDate(experience.CertificateExpiration).getTime() <
                                                                (new Date).getTime() ? `text-danger blinking-button` : ''}>
                                                                {new Date(experience.CertificateExpiration).toLocaleDateString()}
                                                            </div> : "-"
                                                        }
                                                    </td>
                                                    <td style={{ width: multi_student_cols[7].width }}>{faculty.rate}</td>
                                                    <td style={{ width: multi_student_cols[8].width }}>{faculty.cancPolicy} Hrs </td>
                                                    <td style={{ width: multi_student_cols[9].width }}>{faculty.responseTime.replace("Hours", 'Hrs')} </td>

                                                </tr>
                                            })
                                        }
                                    </tbody>
                                    :
                                    <div style={{ position: 'absolute', width: '100%', textAlign: 'center', fontSize: 'large', paddingTop: '20px', fontWeight: 'bold' }}>We Are Sorry, There Are No Tutor(s) Available For This Faculty. Please check later. New tutors register every day.</div>
                            }
                        </table>

                    </div>


                </div>
            </div >
            <Actions saveDisabled={true} />

            {/* <CenteredModal
                show={showAddNewSubjModal}
                handleClose={handleModalClose}
                title={'To Search If your subject exist , please type it on above field'}
            >
                <form onSubmit={checkRequestExist}>

                    <div className='d-flex flex-column' style={{ gap: "20px" }}>

                        <DebounceInput
                            delay={500}
                            value={newSubjectData}
                            setInputValue={setNewSubjectData}
                            onChange={(e) => setNewSubjectData(e.target.value)}
                            type='text'
                            debouceCallback={handleSearch}
                            placeholder='Type your subject here'
                            className='form-control'
                            required
                        />
                        {!subjectExistInFaculties.length && !!newSubjectData.length &&
                            !!newSubjectReasonData.length &&
                            <select className='form-select'
                                required onChange={e => setNewSubjectFacultyData(e.target.value)} type='text' >
                                <option value='' selected={!newSubjectFacultyData.length} disabled>Select Faculty</option>
                                {newSubjectFaculty}
                            </select>
                        }

                        {!subjectExistInFaculties.length && phase === 'add' && <textarea
                            style={{ height: "200px" }}
                            value={newSubjectReasonData}
                            required className='form-control'
                            onChange={e => setNewSubjectReasonData(e.target.value)}
                            placeholder='Explain why this subject should be added, and your ability, and experience of tutoring it.(max 700 characters)' />}
                        {
                            !!subjectExistInFaculties.length ?
                                <div className='border p-2 shadow rounded'>
                                    <h6>The Subject found in the Faculty below.</h6>
                                    <div className='d-flex align-items-center flex-wrap'>
                                        {subjectExistInFaculties.map(faculty =>
                                            <Pill label={faculty} width='200px' />
                                        )}
                                    </div>
                                </div> :
                                phase !== 'search' && <div className='border p-2 shadow rounded'>
                                    <p>This Subject does not exist.
                                        To add the subject, select also the fauclty to be considered.
                                    </p>
                                </div>
                        }
                    </div>
                    <div className="mt-4 d-flex justify-content-between">
                        <div>
                            {
                                newSubjRequestChecking ? <Loading loadingText='searching subject...' iconSize='20px' height='20px' />
                                    : null
                            }
                        </div>
                        <div>
                            <button type="button" className="action-btn btn" onClick={handleModalClose}>
                                <div className="button__content">
                                    <p className="button__text">Close</p>
                                </div>
                            </button>
                            <Button type="submit" className="action-btn btn" loading={newSubjRequestChecking}
                                disabled={newSubjRequestChecking || subjectExistInFaculties.length}>
                                <div className="button__content align-items-center">
                                    
                                        <FaSearch style={{
                                            animation: searchiung ? "spin 2s linear infinite" : 'none',
                                            marginBottom: "5px"
                                        }} />
                                    
                                    <p className="button__text">{phase === 'search' ? 'Search' : 'Add'}</p>
                                </div>
                            </Button>
                        </div>

                    </div>
                </form>
            </CenteredModal> */}
        </>
    );
}

export default StudentFaculties;