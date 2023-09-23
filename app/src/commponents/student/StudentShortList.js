import { useTable } from 'react-table';
import { COLUMNS,DATA } from '../../Tables/Prompt/columns';
import { useMemo } from 'react';
import { useState } from 'react';
import {motion} from 'framer-motion';
import { useEffect } from 'react';
import axios from 'axios';
import { useCallback } from 'react';
import containerVariants from '../constraint';
import { get_student_short_list } from '../../axios/student';
import { useNavigate } from 'react-router-dom';

const StudentShortList = () => {

    // columns.js
    const [data, useData] = useState([]);
    const [response, setResponse] = useState([]);

    const columns = useMemo(() => COLUMNS, []);

    let navigate = useNavigate()

    

    useEffect(() => {
        get_student_short_list(window.localStorage.getItem('student_user_id'))
        .then((result) => {
            
            setResponse(result)
            console.log(response)
        })
        .catch((err) => {
            console.log(err)
        })
    }, [])

    let multi_student_cols = [{Header: 'Intro Video'}, {Header: 'Photo'}, {Header: 'Demo Lesson'}, {Header: 'Subject'}, {Header: 'Tutor'}, {Header: 'Country' }, {Header: 'GMT'}, {Header: 'Invite'}, {Header: 'Hire'}, {Header: 'Rate', }]

    let redirect_to_tutor_profile = tutor_user_id => {
        window.localStorage.setItem('tutor_user_id', tutor_user_id);
        window.localStorage.setItem('user_role', 'admin');
        navigate('/tutor/tutor-profile')
    }
    return ( 
        <>
            <motion.div variants={containerVariants} initial='hidden' animate='visible' exit='exit' className="form-intro">
                <div className="form-into-prompt shadow-sm" style={{padding: '20px'}}>
                   
                <table>
                    <thead>
                        <tr>
                            {multi_student_cols.map(item => <th key={item.Header}>{item.Header}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        
                        

                            
                        {

                            response.length > 0 
                            ?

                            response.map((item,index) => 
                                <tr onDoubleClick={e => redirect_to_tutor_profile(item.AcademyId)} key={index}>
                                    <td>
                                        {<video src={item.tutorData.Video} controls style={{height: '100px', width: '120px'}}></video>}
                                    </td>

                                    <td>{<img src={item.tutorData.Photo}  style={{height: '100px', width: '120px'}} />}</td> 
                                    <td>
                                        <input type='checkbox' style={{height: '20px', width: '20px'}} defaultChecked={item.tutorDemoLesson.FreeDemoLesson === 'yes' ? true : false} />
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
                                        {item.tutorData.GMT}
                                    </td>
                                    <td><input style={{height: '20px', width: '20px'}} type='checkbox' /></td>
                                    <td><input style={{height: '20px', width: '20px'}} type='radio' /></td>
                                    <td>{item.tutorShortList.Rate}</td>
                                </tr>
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
            </motion.div>
        </>
     );
}
 
export default StudentShortList;