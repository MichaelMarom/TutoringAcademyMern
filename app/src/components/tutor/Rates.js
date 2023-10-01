import { useTable } from 'react-table';
import { Rates as RateCol } from '../../Tables/Rates/columns';
import { CommisionCols as CommCol } from '../../Tables/Commission/columns'
import { useMemo } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useCallback } from 'react';
import Acad_Commission from './Acad_Commission._Table';

const Rates = () => {

    const data = 
    [
    
        {
            's/n': '1',
            'select': <input type='radio' name='rate' style={{margin: '8px 0 0 0', height: '20px', width: '20px'}}/>,
            'rates': '$10.00'
        },
        {
            's/n': '2',
            'select': <input type='radio' name='rate' style={{margin: '8px 0 0 0', height: '20px', width: '20px'}}/>,
            'rates': '$10.00'
        },
        {
            's/n': '3',
            'select': <input type='radio' name='rate' style={{margin: '8px 0 0 0', height: '20px', width: '20px'}}/>,
            'rates': '$10.00'
        },
        {
            's/n': '4',
            'select': <input type='radio' name='rate' style={{margin: '8px 0 0 0', height: '20px', width: '20px'}}/>,
            'rates': '$10.00'
        },
        {
            's/n': '5',
            'select': <input type='radio' name='rate' style={{margin: '8px 0 0 0', height: '20px', width: '20px'}}/>,
            'rates': '$10.00'
        },
        {
            's/n': '6',
            'select': <input type='radio' name='rate' style={{margin: '8px 0 0 0', height: '20px', width: '20px'}}/>,
            'rates': '$10.00'
        },
        {
            's/n': '7',
            'select': <input type='radio' name='rate' style={{margin: '8px 0 0 0', height: '20px', width: '20px'}}/>,
            'rates': '$10.00'
        },
        {
            's/n': '8',
            'select': <input type='radio' name='rate' style={{margin: '8px 0 0 0', height: '20px', width: '20px'}}/>,
            'rates': '$10.00'
        },
        {
            's/n': '9',
            'select': <input type='radio' name='rate' style={{margin: '8px 0 0 0', height: '20px', width: '20px'}}/>,
            'rates': '$10.00'
        },
        {
            's/n': '10',
            'select': <input type='radio' name='rate' style={{margin: '8px 0 0 0', height: '20px', width: '20px'}}/>,
            'rates': '$10.00'
        }

    ]

    let single_student_cols = [{Header: '# Hours'}, {Header: 'Select'}, {Header: 'Rates'}]
    let single_rates = ['$5', '$10', '$15', '$20', '$25', '$30', '$35', '$40', '$45', <input type='text' id='custom-rate' placeholder='Type Here' style={{height: '20px', width: '80%', margin: '3px 0 0 0'}}/>]

    let multi_student_cols = [{Header: '# Students'}, {Header: 'Select'}, {Header: 'Discount'}]
    let multi_rates = ['25%', '30%', '33%', '36%', '39%', '42%', '45%', '48%', '51%', <input type='text' id='custom-rate' placeholder='Type Here' style={{height: '20px', width: '80%', margin: '3px 0 0 0'}}/>, <input type='text' id='custom-rate' placeholder='Type Here' style={{height: '20px', width: '80%', margin: '3px 0 0 0'}}/>]

    let subscription_cols = [{Header: 'Hours'}, {Header: 'Select'}, {Header: 'Discount'}]
    let subscription_dicount = ['5.00%', '7.50%', '10.0%', '12.5%', '15.0%', '17.5%', '20.0%', '22.5%', '25.0%', '27.5%']



    const columns = useMemo(() => RateCol, []);

    return ( 
        
        <>
            <div className="tutor-tab-rates">
                <div className="tutor-tab-rate-section">

                    <div className="tutor-tab-rate-box"> 
                        <h6>Single Student Hourly Rate</h6> 

                        <div className="highlight" style={{marginBottom: '35px', marginTop: '35px'}}> 
                            Select one rate for your subject from the table below or generate your own rate on row # 10
                        </div>


                        <div className="rate-table">

                        <table>
                            <thead>
                                <tr>
                                    {single_student_cols.map(item => <th key={item.Header}>{item.Header}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                
                                

                                    
                                {

                                    single_rates.map((item, index) => 
                                        <tr key={index}>
                                            <td>{index + 1}</td>

                                            <td><input type='radio'onInput={e => item === document.querySelector('#custom-rate') ? document.querySelector('#custom-rate').value : item} name='single-student' style={{margin: '8px 0 0 0', cursor: 'pointer', height: '20px', width: '20px'}}/></td>

                                            <td>{item}</td>
                                        </tr>
                                    )
                                }
                                
                                
                            </tbody>
                        </table>


                        </div>

                        <div className="tutor-tab-rates-btm-options-1">
                            <h6>Tutor's Own Student</h6>

                            <div className="highlight">
                                To tutor your own stuent on this platform use the code below and forward to your student to use with his/hers registeration. We will reduce our service fee begin these student(s) by a flat 10% (reduction from 20%) . you can offer this reduction to your student as a Discount by checking the box below
                            </div> 

                            <div style={{height: '200px', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', margin: 'auto'}}> 

                                <div style={{display: 'flex', alignItems: 'center', marginTop: '50px', justifyContent: 'center'}}>
                                    <input type="checkbox" style={{cursor: 'pointer', height: '20px', width: '20px'}} name="multi-student-checkbox" id="multi-student-checkbox"  /> &nbsp;
                                    <label htmlFor="multi-student-checkbox"><h6>Activate multi student option</h6></label>
                                </div>
                                

                                <div><b>Your Personal Code</b></div>

                                <input type='text' placeholder='Your Code' style={{height: '40px', width: '200px',background: '#00d5ff', color: '#fff', outline: 'none', border: 'none', marginBottom: '20px'}} />
                            </div>  


                            
                        </div>
                    </div>


                    <div className="tutor-tab-rate-box">
                        <h6>Multi Student Hourly Rate</h6>  
                        <div style={{height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 'auto'}}>
                            <input type="checkbox" style={{cursor: 'pointer', height: '20px', width: '20px'}} name="multi-student-checkbox" id="multi-student-checkbox"  /> &nbsp;
                            <label htmlFor="multi-student-checkbox"><h6>Activate multi student option</h6></label>
                        </div>

                        <div className="highlight">
                            Select one rate for your subject from the table below or generate your own rate on row # 10
                        </div>

                        <div className="rate-table">
                            <table>
                                <thead>
                                    <tr>
                                        {multi_student_cols.map(item => <th key={item.Header}>{item.Header}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    
                                    

                                        
                                    {

                                        multi_rates.map((item, index) => 
                                            <tr key={index}>
                                                <td>{index + 1 > 10 ? 'School class' : index + 1}</td>

                                                <td>{
                                                    index + 1 > 10 
                                                    ? 
                                                    <input type='checkbox' onInput={e => item === document.querySelector('#custom-rate') ? document.querySelector('#custom-rate').value : item} name='rate' style={{margin: '8px 0 0 0', cursor: 'pointer', height: '20px', width: '20px'}}/>
                                                    : 
                                                    <input type='radio'onInput={e => item === document.querySelector('#custom-rate') ? document.querySelector('#custom-rate').value : item} name='multi-student' style={{margin: '8px 0 0 0', cursor: 'pointer', height: '20px', width: '20px'}}/>
                                                }</td>

                                                <td>{item}</td>
                                            </tr>
                                        )
                                    }
                                    
                                    
                                </tbody>
                            </table>
                        </div>

                        <div className="tutor-tab-rates-btm-options" style={{height: '400px', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', margin: 'auto', marginTop: '10px'}}>
                             
                            <div style={{display: 'flex', alignItems: 'center', flexDirection: 'row', marginTop: '20px', marginBottom: '20px',  justifyContent: 'center'}}>
                                <label htmlFor="discount-bx"><h6> Cancellation Policy &nbsp;</h6></label>
                                <select name="" id="tutor-cancellation-policy">
                                    <option value="null"> Select</option>
                                    <option value="None">None</option>
                                    <option value="3 hours">3 hours</option>
                                    <option value="6 hours">6 hours</option>
                                    <option value="12 hours">12 hours</option>
                                    <option value="24 hours">24 hours</option>
                                    <option value="48 hours">48 hours</option>
                                </select>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', flexDirection: 'row', marginBottom: '5px',  justifyContent: 'center'}}>
                                <label htmlFor=""><h6>30 mins free demo lesson &nbsp;</h6></label>
                                <input style={{cursor: 'pointer', height: '20px', width: '20px'}} type="radio" name="30-mins-free-demo-lesson" />&nbsp; <h6>Yes</h6> &nbsp;
                                <input style={{cursor: 'pointer', height: '20px', width: '20px'}} type="radio" name="30-mins-free-demo-lesson" />&nbsp; <h6>No</h6> 
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', flexDirection: 'row', marginBottom: '20px',  justifyContent: 'center'}}>
                                <label htmlFor=""><h6>Consent recording lesson &nbsp;</h6></label>
                                <input style={{cursor: 'pointer', height: '20px', width: '20px'}}  type="radio" name="consent-recording-lesson" />&nbsp; <h6>Yes</h6> &nbsp;
                                <input style={{cursor: 'pointer', height: '20px', width: '20px'}}  type="radio" name="consent-recording-lesson" />&nbsp; <h6>No</h6>
                            </div>

                            <div className="highlight" style={{margin: '0'}}>
                                Video will be stored for 30 days for education purpose. Can be watched only by thr tutor, student or parent.
                            </div>

                        </div>
                    </div>


                    <div className="tutor-tab-rate-box">
                        <h6>Subscription Plan</h6>

                        <div style={{height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 'auto'}}>
                            <input type="checkbox" style={{cursor: 'pointer', height: '20px', width: '20px'}}  name="multi-student-checkbox" id="multi-student-checkbox"  /> &nbsp;
                            <label htmlFor="multi-student-checkbox"><h6>Activate subscription option</h6></label>
                        </div>

                        <div className="highlight">
                            Select one rate for your subject from the table below
                        </div>

                        <div className="rate-table">
                        <table>
                                <thead>
                                    <tr>
                                        {subscription_cols.map(item => <th key={item.Header}>{item.Header}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    
                                    

                                        
                                    {

                                        subscription_dicount.map((item, index) => 
                                            <tr key={index}>
                                                <td>{(index + 1) * 4 }</td>

                                                <td>
                                                    <input type='radio'onInput={e => item === document.querySelector('#custom-rate') ? document.querySelector('#custom-rate').value : item} name='student-subscription' style={{margin: '8px 0 0 0', cursor: 'pointer', height: '20px', width: '20px'}}/>
                                                </td>

                                                <td>{item}</td>
                                            </tr>
                                        )
                                    }
                                    
                                    
                                </tbody>
                            </table>
                        </div>

                        <div className="tutor-tab-rates-btm-options" style={{height: '600px', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', margin: 'auto'}}>
                            <h6>Multi Student Hourly Rate</h6>

                            <div className="highlight">
                                Hours are accumulated on annual bases that will start counting from your enrollment
                            </div>

                            <Acad_Commission />

                        </div>
                    </div>

                </div>
            </div>
        </>
     );
}
 
export default Rates;