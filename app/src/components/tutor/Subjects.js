import { useState } from 'react';
import { useEffect } from 'react';
import { get_rates, get_subject, get_user_data, new_subj_request_exist,
     upload_new_subject, upload_tutor_rates } from '../../axios/tutor';
import { socket } from '../../config/socket';
import CenteredModal from '../common/Modal';
import Button from '../common/Button';
import { toast } from 'react-toastify';
import { FACULTIES } from '../../constants/constants';
import SubjectCard from './SubjectCard';
import Actions from '../common/Actions'
import { object } from 'prop-types';
import Loading from '../common/Loading';


const Subjects = () => {

    let [newSubjectFaculty, setNewSubjectFaculty] = useState([]);

    let [newSubjectFacultyData, setNewSubjectFacultyData] = useState('');
    let [newSubjectData, setNewSubjectData] = useState('');
    let [newSubjectReasonData, setNewSubjectReasonData] = useState('');
    const [showAddNewSubjModal, setShowAddNewSubjModal] = useState(false)
    const [newSubjRequestChecking, setNewSubjReqChecking] = useState(false)
    const [selectedFaculty, setSelectedFaculty] = useState(1);
    const [rate, setRate] = useState('')
    const [grades, setGrades] = useState([])
    let [faculty, set_faculty] = useState([]);
    const [subjectsWithRates, setSubjectsWithRates] = useState([]);

    let [active_course, set_active_course] = useState([])
    const [loadingSubs, setLoadingSubs] = useState(false)
    const handleGrades = () => {

    }

    const handleModalClose = () => {
        setShowAddNewSubjModal(false)
        setNewSubjectData('')
        setNewSubjectFacultyData('')
        setNewSubjectReasonData('')
    }

    useEffect(() => {
        let user_id = window.localStorage.getItem('tutor_user_id');
        setLoadingSubs(true)
        get_rates(user_id, selectedFaculty)
            .then((result) => {
                setSubjectsWithRates(result)
                setLoadingSubs(false)
                result.map(item => {
                    let c = item.subject
                    let t = document.querySelector('.tables')
                    let files = [...t.querySelectorAll('input[type=checkbox]')]
                    let r = files.filter((item) =>
                        item.value.toLowerCase() === c.toLowerCase()
                    )

                    get_user_data(user_id)
                        .then((result) => {
                            r[0].checked = true;
                            let elms = r[0].parentElement.parentElement.children;

                            elms[2].innerHTML = result[0].EducationalLevel;
                            elms[3].innerHTML = result[0].EducationalLevelExperience;
                            elms[4].innerHTML = result[0].Certificate;
                            elms[5].innerHTML = result[0].CertificateState;
                            elms[6].innerHTML = result[0].CertificateExpiration;
                            elms[7].classList.add('col-2')
                            elms[7].innerHTML = ` <div class="input-group p-2">
                            <span class="input-group-text">$</span>
                            <input
                              type="text"
                              required
                              value='${item.rate.split('').splice(1, 2).join('')}'
                              class="form-control m-0"   style="height:fit-content"
                              aria-label="Amount (to the nearest dollar)"
                            />
                            <input
                            type="text"
                            required
                            value='${item.rate.split('').splice(4, 5).join('')}' 
                            class="form-control m-0"   style="height:fit-content"
                            aria-label="Amount (to the nearest dollar)"
                          />
                          </div> `;
                        })
                        .catch((err) => err)

                })
            })
            .catch((err) => console.log(err))
    }, [selectedFaculty])

    let populate_col = e => {
        if (e.target.checked) {


            let user_id = window.localStorage.getItem('tutor_user_id');

            get_user_data(user_id)
                .then((result) => {
                    let data = result[0];

                    let elms = [...e.target.parentElement.parentElement.children];

                    elms[2].innerHTML = data.EducationalLevel;
                    elms[3].innerHTML = data.EducationalLevelExperience;
                    elms[4].innerHTML = data.Certificate;
                    elms[5].innerHTML = data.CertificateState;
                    elms[6].innerHTML = data.CertificateExpiration;
                    elms[7].innerHTML = ` <div class="input-group p-2">
                    <span class="input-group-text">$</span>
                    <input
                      type="text"
                      required
                      placeholder="00"
                      class="form-control m-0  " style="height:fit-content"
                      aria-label="Amount (to the nearest dollar)"
                    />
                    <input
                    type="text"
                    required
                    placeholder="cents"

                    class="form-control m-0  " style="height:fit-content"
                    aria-label="Amount (to the nearest dollar)"
                  />
                  </div> `;

                })
                .catch((err) => err)
        } else {
            let elms = [...e.target.parentElement.parentElement.children];

            elms[2].innerHTML = ''
            elms[3].innerHTML = ''
            elms[4].innerHTML = ''
            elms[5].innerHTML = ''
            elms[6].innerHTML = ''
            elms[7].innerHTML = ''


            let AcademyId = window.localStorage.getItem('tutor_user_id');
            let subject = e.target.value;

            socket.emit('DeleteSubjectRate', { AcademyId, subject })
        }


    }

    useEffect(() => {
        get_subject(1)
            .then((result) => set_active_course(result.recordset))
            .catch((err) => err)

    }, []);

    let getSubject = (id) => {
        get_subject(id)
            .then((result) => set_active_course(result.recordset))
            .catch((err) => err)
    }



    let handle_active_course = e => {
        let elem = e.currentTarget;
        //let tables = [...document.querySelectorAll('table')];
        //let active_table = tables.filter(item => !item.hasAttribute('id'));
        //active_table[0]?.setAttribute('id', 'hide_table');
        let index_of_elem = [...elem.parentElement.children].indexOf(elem);
        getSubject(index_of_elem + 1);
        //tables[index_of_elem]?.removeAttribute('id');


        let deactivedElem = [...elem.parentElement.children].filter(item => item.hasAttribute('id'))[0];
        deactivedElem?.removeAttribute('id');
        elem?.setAttribute('id', 'table_options_menu')



    }

    const getFacultiesOption = () => {
        let list = FACULTIES.map(item => {
            return (
                <option data-id={item.Id} value={`${item.Faculty}-${item.Id}`}
                    selected={newSubjectFacultyData === `${item.Faculty}-${item.Id}`} >{item.Faculty}</option>
            )
        })
        set_faculty(FACULTIES)
        setNewSubjectFaculty(list)
    }
    useEffect(() => { getFacultiesOption() }, [newSubjectFacultyData])


    let handle_scroll_right = () => {

        let div = document.querySelector('.tutor-tab-subject-data-tabs');
        let scroll_elem = div.children[1];
        let w = scroll_elem.offsetWidth;
        scroll_elem.scrollLeft = w;

    }

    let handle_scroll_left = () => {

        let div = document.querySelector('.tutor-tab-subject-data-tabs');
        let scroll_elem = div.children[1];
        let w = scroll_elem.offsetWidth;
        scroll_elem.scrollLeft = -w

    }
    const handleSave = (e) => {
        e.preventDefault()

        let checkboxs = [...document.querySelectorAll('input[type=checkbox]')];
        let checkedbox = checkboxs.filter(item => item.checked)
        let values = checkedbox.map(item => {
            return [...item.parentElement.parentElement.children]
        })
        let AcademyId = window.localStorage.getItem('tutor_user_id');
        let rate_list = [];
        let rate_err = []

        let result = () => {
            let file = values.map((item) => {
                console.log(item[7].children[0].children[1])
                if (`${item[7].children[0].children[1]?.value}.${item[7].children[0].children[2]?.value}` !== '00.00') {
                    let doc = { faculty: item[1].dataset.src, course: item[1].innerHTML, rate: "$" + item[7].children[0].children[1]?.value + "." + item[7].children[0].children[2]?.value }
                    rate_list.push(doc)
                    rate_err.push(true)


                } else {
                    // if (item[7].children[1] && item[7].children[0]) {
                    //     item[7].children[1]?.style.border = '1px solid red';
                    //     item[7].children[0]?.style.border = '1px solid red';
                    // }
                    rate_err.push(false)
                    //return false;
                }

            })

            let upload_agent = (items, id) => {
                console.log(items, 'itsm in api')
                upload_tutor_rates(items, id)
                    .then((result) => {
                        if (result) {
                            setTimeout(() => {
                                document.querySelector('.save-overlay')?.removeAttribute('id');
                            }, 1000);

                            document.querySelector('.tutor-popin')?.setAttribute('id', 'tutor-popin');
                            document.querySelector('.tutor-popin').innerHTML = 'Data Was Saved Successfully...'
                            setTimeout(() => {
                                document.querySelector('.tutor-popin')?.removeAttribute('id');
                            }, 2000);
                        } else {

                            document.querySelector('.tutor-popin')?.setAttribute('id', 'tutor-popin');
                            document.querySelector('.tutor-popin').innerHTML = 'Data Was Not Saved Successfully...'
                            setTimeout(() => {
                                document.querySelector('.tutor-popin')?.removeAttribute('id');
                            }, 2000);

                        }
                    })
                    .catch((err) => console.log(err))
            }

            let errCheck = rate_err.filter(item => item === false)
            if (errCheck.length > 0) {
                alert('Please Ensure The Rate Field Is At Least $1')
            } else {
                document.querySelector('.save-overlay')?.setAttribute('id', 'save-overlay')
                upload_agent(rate_list, AcademyId)
            }
        }
        result()
    }


    const checkRequestExist = async (e) => {
        e.preventDefault()
        setNewSubjReqChecking(true)
        const result = await new_subj_request_exist(newSubjectData);
        if (result.status === 200 && !result.subjectExist) {
            uploadNewSubject()
        }
        else {
            setNewSubjectData('')
            toast.warning(result.response.data.message)
        }
        setNewSubjReqChecking(false)
    }

    let uploadNewSubject = () => {
        let user_id = window.localStorage.getItem('tutor_user_id');
        upload_new_subject(newSubjectFacultyData.split('-')[0], newSubjectData, newSubjectReasonData, user_id, newSubjectFacultyData.split('-')[1])
            .then((result) => {
                if (result) {
                    setNewSubjectData('')
                    setNewSubjectFacultyData('')
                    setNewSubjectReasonData('')
                    toast.success("Subject Added Succefullu. Please wait for Admin to approve your request")
                } else {
                    toast.error("Error While Sending Request of New Subject")
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <>
            <div className="tutor-popin"></div>
            <div className="save-overlay">
                <span className="save_loader"></span>
            </div>
            <div className="container mt-3">

                <div className="tutor-tab-subject-data-collection-table">

                    <div className="tutor-tab-subject-data-tabs">
                        <div style={{
                            margin: '0 0 0 0', display
                                : 'flex', alignItems: 'center', justifyContent: 'center', background:
                                '#efefef', opacity: '.7', height: '100%', transform: 'skew(-0deg)'
                        }} className="scroller-left" onClick={handle_scroll_left}>
                            <div style={{ opacity: '1' }}>
                                <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 9L8 12M8 12L11 15M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                        </div>


                        <ul>

                            {
                                faculty.map((item, index) => {
                                    console.log(item, 'facu')
                                    return <li className='tutor-tab-subject-data-menu'
                                        style={{
                                            background: item.Id === selectedFaculty ? "#2471A3" : "",
                                            color: item.Id === selectedFaculty ? " #F7F9F9" : "",
                                        }}
                                        onClick={() => setSelectedFaculty(item.Id)}><a>{item.Faculty}</a></li>
                                }
                                )
                            }
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

                    <div className="highlight">
                        Select your faculty above, and checkbox the subject(s) from the list below that you are proficient to tutor. Then add the rate for the subject, and save. Didn't find your subject, and want to add it? Submit your request that match your expertise by clicking this lable; <Button className='btn-primary btn-small' type="button"
                            handleClick={() => setShowAddNewSubjModal(true)} > Search or Add New Subject</Button>

                    </div>

                    {loadingSubs ? <Loading height='50vh' /> : <div >

                        <div className='d-flex rounded justify-content-around
                         align-items-center
                         text-bg-primary m-2 p-2'>
                            <p className='m-0'> Subject</p>
                            <p className='m-0 col-5'>Grades</p>
                            <p className='m-0'> Rate</p>
                            <p className='m-0'> Action</p>
                        </div>
                        <div style={{ height: "50vh", overflowY: "auto", overflowX: "hidden", position: "relative" }}>
                            {
                                subjectsWithRates.map((item, index) => {
                                    const rateExtracted = item.rate && parseFloat(item.rate.replace('$', ''))
                                    const rate = isNaN(rateExtracted) ? '' : rateExtracted
                                    const grades = JSON.parse(item.grades ?? '[]');
                                    return <SubjectCard
                                    faculty={selectedFaculty}
                                        subject={item.subject}
                                        rateVal={rate}
                                        setRate={setRate}
                                        gradesVal={grades}
                                        handleGrades={handleGrades}
                                        onSave={handleSave}

                                    />
                                }
                                )
                            }
                        </div>

                    </div>}
                </div>

            </div>


            <CenteredModal
                show={showAddNewSubjModal}
                handleClose={handleModalClose}
                title={'Add New Subject'}
            >
                <form onSubmit={checkRequestExist}>

                    <div className='d-flex flex-column' style={{ gap: "20px" }}>
                        <select className='form-select'
                            required onChange={e => setNewSubjectFacultyData(e.target.value)} type='text' >
                            <option value='' selected={!newSubjectFacultyData.length} disabled>Select Faculty</option>
                            {newSubjectFaculty}
                        </select>
                        <input
                            required className='form-control'
                            value={newSubjectData}
                            onChange={e => setNewSubjectData(e.target.value)} type='text'
                            placeholder='Type your subject here' />
                        <textarea
                            value={newSubjectReasonData}
                            required className='form-control'
                            onChange={e => setNewSubjectReasonData(e.target.value)}
                            placeholder='Explain why this subject should be added, and your ability, and experience of tutoring it.(max 700 characters)' />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleModalClose}>
                            {"Close"}
                        </button>
                        <Button type="submit" className="btn btn-primary" loading={newSubjRequestChecking}
                            loadingText={' checking if request already sent...'}>
                            {'Submit'}
                        </Button>
                    </div>
                </form>
            </CenteredModal>
            <Actions saveDisabled={true} />
        </>
    );
}

export default Subjects;