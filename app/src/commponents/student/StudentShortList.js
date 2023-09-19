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

const StudentShortList = () => {

    // columns.js
    const [data, useData] = useState([]);
    const [response, setResponse] = useState([]);

    const columns = useMemo(() => COLUMNS, []);

    useEffect(() => {
        get_student_short_list()
        .then((result) => {
           setResponse(result)
        })
        .catch((err) => {
            console.log(err)
        })
    }, [])

    let multi_student_cols = [{Header: 'Intro Video'}, {Header: 'Photo'}, {Header: 'Demo Lesson'}, {Header: 'Subject'}, {Header: 'Tutor'}, {Header: 'Country' }, {Header: 'GMT'}, {Header: 'Invite'}, {Header: 'Hire'}, {Header: 'Rate', }]


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
                                <tr>
                                    <td>
                                        {<video src={item[2] ? item[2][0].Video : ''} controls style={{height: '100px', width: '100px'}}></video>}
                                    </td>

                                    <td>{<img src={item[2] ? item[2][0].Photo : ''}  style={{height: '100px', width: '100px'}} />}</td> 
                                    <td>
                                        <input type='checkbox' defaultChecked={item[1].FreeDemoLesson === 'yes' ? true : false} />
                                    </td>
                                    <td>
                                        {item[0].Subject}
                                    </td>
                                    <td>
                                        {item[0].TutorScreenname}
                                    </td>
                                    <td>
                                        {item[2] ? item[2][0].Country : ''}
                                    </td>
                                    <td>
                                        {item[2] ? item[2][0].GMT : ''}
                                    </td>
                                    <td><input type='checkbox' /></td>
                                    <td><input type='radio' /></td>
                                    <td>{item[0].rate}</td>
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