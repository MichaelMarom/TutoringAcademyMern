import { useTable } from 'react-table';
import { useEffect, useLayoutEffect, useState } from 'react';

import { COLUMNS, DATA } from '../../Tables/Faculty/columns';
import { useMemo } from 'react';
import { get_student_short_list, get_student_short_list_data, get_tutor_subject, upload_student_short_list } from '../../axios/student';
import { socket } from '../../socket';
import Actions from '../common/Actions';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setShortlist } from '../../redux/student_store/shortlist';

const StudentFaculties = () => {
    const dispatch = useDispatch()
    const [response, setResponse] = useState([]);
    const [data, setData] = useState([]);
    const columns = useMemo(() => COLUMNS, []);
    const [checkBoxClicked, setCheckBoxClicked] = useState("")

    useEffect(() => {
        const fetchTutorSubject = async () => {
            const result = await get_tutor_subject('1')
            console.log(result, 123)
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
        // let clickedElem = e.currentTarget;
        // let deactivedElem = [...clickedElem?.parentElement.children ? clickedElem?.parentElement.children : []].filter(item => item.hasAttribute('id'))[0];

        // deactivedElem?.removeAttribute('id');
        // clickedElem?.setAttribute('id', 'form-subject-data-tabs-list-active')
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
        console.log(result, 'shortlists')
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
        // document.querySelector('#student-save').onclick = () => {
        if (checkBoxClicked.type?.length) {
            document.querySelector('.save-overlay')?.setAttribute('id', 'save-overlay')
            let list = [...document.querySelectorAll('#student-tutor')];
            let doc = list.filter(item =>
                item.children[0].checked === true
            )

            let data = doc.map(item => item.dataset.id)

            if (data[0]) {
                let list = data[0].split('-')
                let res = upload_student_short_list(data);

                if (res) {
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
        // }
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


    let multi_student_cols = [{ Header: '# Select' }, { Header: 'Subject' }, { Header: 'Tutor' }, { Header: 'Experience' }, { Header: 'Certification', }, { Header: 'State', }, { Header: 'Expiration', }, { Header: 'Rate', }]

    let handleSavedDeleteData = e => {

        let elem = e.target;

        let pElem = elem.parentElement;
        let id = pElem.dataset;

        if (!elem.checked) {
            toast.error("This record was removed from your shortlist")
            socket.emit('studentIllShorList', { id })
        }
        else {
            setCheckBoxClicked(elem)
        }


    }

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

    return (
        <>

            <div className="tutor-popin"></div>
            <div className="save-overlay">
                <span className="save_loader"></span>
            </div>
            <div className="form-subjects" style={{ overflow: 'hidden', height: 'calc(100vh - 50px)' }}>

                <div className="form-subject-alert">
                    <p style={{ fontSize: 'large', fontWeight: 'bold', color: 'blue', width: '100%', textAlign: 'center' }}>There are 400+ subjects to select from across 29 faculties for tutoring.</p>
                </div>

                <div id="form-subject-data-collection-table">

                    <div className="form-subject-data-tabs" style={{ display: 'flex', margin: 'auto', padding: '0 0 0 0', justifyContent: 'center', alignItems: 'center', overflowX: 'hidden', width: '100%' }}>

                        <div style={{
                            margin: '0 0 0 0', display
                                : 'flex', alignItems: 'center', justifyContent: 'center', background: '#efefef', opacity: '.7', height: '100%', transform: 'skew(-0deg)'
                        }} className="scroller-left" onClick={handle_scroll_left}>
                            <div style={{ opacity: '1' }}>
                                <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 9L8 12M8 12L11 15M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
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
                                <path d="M13 15L16 12M16 12L13 9M16 12H8M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>

                        </div>
                    </div>




                    <div className="highlight" style={{ width: '100%' }}>
                        From the menu above, click on faculty to view all subjects as being tought by the Tutors. Checkbox from the table below the Tutor(s) of interest. They will be dynamically saved in the next "ShortList" tab to compare, and select your tutor.``
                    </div>

                    <div className="form-subject-search-bar">
                        <div>
                          <label style={{ float: 'left', border: '1px solid #eee', padding: '5px 10px 0 10px' }} htmlFor="search"><h6>                                                               </h6></label>
                        </div>
                    </div>


                    <div className="tables" style={{ height: '600px', width: '100%', overflow: 'auto', padding: '5px' }}>

                        <table>
                            {response.length ?
                                <thead>
                                    <tr>
                                        {multi_student_cols.map(item => <th key={item.Header}>{item.Header}</th>)}
                                    </tr>
                                </thead>
                                :
                                <div className='text-danger'>
                                    No record found!
                                </div>}

                            {
                                response.length
                                    ?
                                    <tbody>
                                        {

                                            response.map((item) => {
                                                let faculty = item[0] || {};
                                                let experience = item[1] || {};
                                                return <tr>
                                                    <td id='student-tutor' data-id={`${faculty.AcademyId}-${faculty.subject}-${faculty.rate}-${faculty?.AcademyId}-${window.localStorage.getItem('student_user_id')}`}>

                                                        <input onInput={handleSavedDeleteData} type='checkbox' style={{ height: '20px', width: '20px' }} />
                                                    </td>

                                                    <td>{faculty.subject}</td>
                                                    <td>
                                                        {(faculty.AcademyId).split(".").slice(0, 2).join(".")}
                                                    </td>
                                                    <td>
                                                        {experience.EducationalLevelExperience}
                                                    </td>
                                                    <td>
                                                        {experience.Certificate}
                                                    </td>
                                                    <td>
                                                        {experience.CertificateState}
                                                    </td>
                                                    <td>
                                                        {experience.CertificateExpiration.length ?
                                                            new Date(experience.CertificateExpiration).toLocaleDateString() : "-"}
                                                    </td>
                                                    <td>{faculty.rate}</td>
                                                </tr>
                                            }
                                            )

                                        }


                                    </tbody>
                                    :
                                    <div style={{ position: 'absolute', width: '100%', textAlign: 'center', fontSize: 'large', paddingTop: '20px', fontWeight: 'bold' }}>We Are Sorry, There Are No Tutor(s) Available For This Faculty. Please check later, since new tutors register every day.</div>
                            }
                        </table>

                    </div>


                </div>
            </div>
            <Actions saveDisabled={true} />
        </>
    );
}

export default StudentFaculties;