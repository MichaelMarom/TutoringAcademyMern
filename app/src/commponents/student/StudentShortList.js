import { useTable } from 'react-table';
import { COLUMNS, DATA } from '../../Tables/Prompt/columns';
import { useMemo } from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import axios from 'axios';
import { useCallback } from 'react';
import containerVariants from '../constraint';
import { get_student_short_list } from '../../axios/student';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setTutor } from '../../redux/student_store/selectedTutor';
import Loading from '../common/Loading';

const StudentShortList = () => {

    // columns.js
    const [data, useData] = useState([]);
    const [response, setResponse] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const columns = useMemo(() => COLUMNS, []);

    let navigate = useNavigate()
    const dispatch = useDispatch()

    const { selectedTutor } = useSelector(state => state.selectedTutor);
    const handleNavigateToSchedule = async (item) => {
        await dispatch(setTutor({
            id: item.tutorData.SID, 
            academyId: item.tutorData.AcademyId,
            GMT: item.tutorData.GMT,
            name: `${item.tutorData.FirstName} ${item.tutorData.LastName}`,
            subject: item.tutorShortList.Subject
        }))
        navigate('/student/schedule')
    }

    useEffect(() => {
        setIsLoading(true)
        get_student_short_list(window.localStorage.getItem('student_user_id'))
        .then((result) => {
                result.sort(function (a, b) {
                    if (a.tutorShortList.Subject < b.tutorShortList.Subject) {
                        return -1;
                    }
                    if (a.tutorShortList.Subject > b.tutorShortList.Subject) {
                        return 1;
                    }
                    return 0;
                });
                
                setResponse(result)
                setIsLoading(false)
                console.log(response)
            })
            .catch((err) => {
                setIsLoading(false)
                console.log(err)
            })
    }, [])
    function convertGMTToLocalTime(gmtOffset) {
        const utcTime = new Date();
        const localTime = new Date(utcTime.getTime() + gmtOffset * 60 * 60 * 1000);
        return localTime;
    }
    let multi_student_cols = [{ Header: 'Photo' }, { Header: 'Demo Lesson @50%' }, { Header: 'Subject' }, { Header: 'Tutor Name' }, { Header: 'Country' }, { Header: 'Tutor Time' }, { Header: 'Tutor Schedule' }, { Header: 'Tutor Profile' }, { Header: 'Rate' }, { Header: 'Hire' }]

    let redirect_to_tutor_profile = tutor_user_id => {
        window.localStorage.setItem('tutor_user_id', tutor_user_id);
        window.localStorage.setItem('user_role', 'admin');
        navigate('/tutor/tutor-profile')
    }


    if(isLoading) return <Loading />
    return (
        <>
            <motion.div variants={containerVariants} initial='hidden' animate='visible' exit='exit' className="form-intro" style={{ overflow: "hidden" }}>
                <div className="form-into-prompt shadow-sm" style={{ padding: '20px' }}>
                    <div style={{ margin: 'auto', width: '100%', textAlign: 'center', fontSize: 'Medium', fontWeight: 'bold' }}> To view complete tutor's profile include presentation video, double click on his/hers picture.</div>

                    <div className="tables" style={{ height: '800px', width: '100%', overflow: 'auto', padding: '5px' }}>

                        <table>
                            <thead>
                                <tr>
                                    {multi_student_cols.map(item => <th key={item.Header}>{item.Header}</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>


                                {
                                    response.length > 0
                                        ?
                                        response.map((item, index) => {
                                            return <tr onDoubleClick={e => redirect_to_tutor_profile(item.tutorData.AcademyId)} key={index}>

                                                <td>{<img src={item.tutorData.Photo} style={{ height: '100px', width: '120px' }} />}</td>
                                                <td>
                                                    <input type='checkbox' style={{ height: '20px', width: '20px' }} defaultChecked={item.tutorDemoLesson.FreeDemoLesson === 'yes' ? true : false} />
                                                </td>
                                                <td>
                                                    {item.tutorShortList.Subject}
                                                </td>
                                                <td>
                                                    {item.tutorShortList.ScreenName}
                                                </td>
                                                <td>
                                                    {item.tutorData.Country}
                                                </td>
                                                <td>
                                                    {convertGMTToLocalTime(item.tutorData.GMT).toLocaleString()}
                                                </td>
                                                <td>
                                                    <button className='btn btn-outline-primary' onClick={() => handleNavigateToSchedule(item)}>View Schedule</button>
                                                </td>
                                                <td>
                                                    <button className='btn btn-outline-primary' onClick={e => redirect_to_tutor_profile(item.tutorData.AcademyId)}>View Profile</button>
                                                </td>
                                                <td>{item.tutorShortList.Rate}</td>
                                                <td>
                                                    <input style={{ height: '20px', width: '20px' }} type='radio' />
                                                </td>

                                            </tr>
                                        }
                                        )
                                        :
                                        ''


                                    //subscription_dicount.map((item, index) => 
                                    //<tr key={index}>
                                    // <td>{(index + 1) * 4 }</td>

                                    //<td>
                                    //<input  onInput={e => setSubscriptionPlan(e.target.value)} type='radio'/*onInput={e => item === document.querySelector('#custom-rate') ? document.querySelector('#custom-rate').value : item}*/ name='student-subscription' id='student-subscription' style={{margin: '8px 0 0 0', cursor: 'pointer', height: '20px', width: '20px'}}/>
                                    //</td>

                                    //</tbody><td>{item}</td>
                                    // </tr>
                                    //)

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