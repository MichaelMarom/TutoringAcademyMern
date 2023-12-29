import { useState } from 'react';
import { useEffect } from 'react';
import {
    get_rates, get_subject, get_user_data, new_subj_request_exist,
    upload_new_subject, upload_tutor_rates
} from '../../axios/tutor';
import { socket } from '../../config/socket';
import CenteredModal from '../common/Modal';
import Button from '../common/Button';
import { toast } from 'react-toastify';
import { FACULTIES } from '../../constants/constants';
import SubjectCard from './SubjectCard';
import Actions from '../common/Actions'
import Loading from '../common/Loading';


const Subjects = () => {

    let [newSubjectFaculty, setNewSubjectFaculty] = useState([]);

    let [newSubjectFacultyData, setNewSubjectFacultyData] = useState('');
    let [newSubjectData, setNewSubjectData] = useState('');
    let [newSubjectReasonData, setNewSubjectReasonData] = useState('');
    const [showAddNewSubjModal, setShowAddNewSubjModal] = useState(false)
    const [newSubjRequestChecking, setNewSubjReqChecking] = useState(false)
    const [selectedFaculty, setSelectedFaculty] = useState(1);
    let [faculty, set_faculty] = useState([]);
    const [subjectsWithRates, setSubjectsWithRates] = useState([]);

    const [loadingSubs, setLoadingSubs] = useState(false)

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
            })
            .catch((err) => console.log(err))
    }, [selectedFaculty])

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
            <div className="container" style={{ marginTop: "2px" }}>

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

                    <div className="highlight d-flex flex-column align-items-center">
                        <p>
                            Select your faculty above, then from the list below click on the 'Edit' button for your subject (you can select more than one). Type your rate, select the school grades you tutor for this subject. and SAVE. Didn't find your subject, and want to add it? Submit your request that match your expertise by clicking here:
                        </p>
                        <Button className='btn-primary btn-small text-center' type="button"
                            handleClick={() => setShowAddNewSubjModal(true)} > Search/Add New Subject</Button>

                    </div>

                    {loadingSubs ? <Loading height='50vh' /> : <div >

                        <div className='d-flex rounded justify-content-between
                         align-items-center
                         mx-2 p-2' style={{ color: "white", background: "#2471A3" }}>
                            <p className='m-0 col-2'> Subject</p>
                            <p className='m-0 col-6'>School Grades (elementary, middle, & high school)</p>
                            <p className='m-0 col-3 text-start'> $ Rate</p>
                            <p className='m-0 col-1'> Action</p>
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
                                        gradesVal={grades}
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
                            style={{ height: "200px" }}
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