import { useTable } from 'react-table';
import { Rates as RateCol } from '../../Tables/Rates/columns';
import { CommisionCols as CommCol } from '../../Tables/Commission/columns'
import { useMemo } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import Acad_Commission from './Acad_Commission._Table';
import { get_rates, get_tutor_rates, upload_form_three } from '../../axios/tutor';

const Rates = () => {

    

   



    let [MultiStudentOption, setMultiStudentOption] = useState(false)
    let [MultiStudentHourlyRate, setMultiStudentHourlyRate] = useState('')
    let [CancellationPolicy, setCancellationPolicy] = useState('')
    let [FreeDemoLesson, setFreeDemoLesson] = useState('')
    let [ConsentRecordingLesson, setConsentRecordingLesson] = useState('')
    let [ActivateSubscriptionOption, setActivateSubscriptionOption] = useState('')
    let [SubscriptionPlan, setSubscriptionPlan] = useState('')


    useEffect(() => {
        get_tutor_rates(window.localStorage.getItem('tutor_user_id'))
        .then((result) => {
            console.log(result[0])

            if(result[0]){
            
                setMultiStudentOption(result[0].MutiStudentOption)
                setMultiStudentHourlyRate(result[0].MutiStudentHourlyRate)
                setCancellationPolicy(result[0].CancellationPolicy)
                setFreeDemoLesson(result[0].FreeDemoLesson)
                setConsentRecordingLesson(result[0].ConsentRecordingLesson)
                setActivateSubscriptionOption(result[0].ActivateSubscriptionOption)
                setSubscriptionPlan(result[0].SubscriptionPlan)

                let multiStudentCheckbox = document.querySelector('#multi-student-checkbox');
                MultiStudentOption  === "true" ? multiStudentCheckbox.checked = true : multiStudentCheckbox.checked = false     

                let subscriptionPlan = document.querySelector('#subscription-plan')
                ActivateSubscriptionOption === 'true' ? subscriptionPlan.checked = true : subscriptionPlan.checked = false

                let multiStudent = [...document.querySelectorAll('#multi-student')];

                multiStudent.map(item => {
                    //checked={ MultiStudentHourlyRate ?  ? true : false : false}
                    if(MultiStudentHourlyRate.split(' ').splice(-1)[0] === item.value.split(' ').splice(-1)[0]){
                        item.checked = true
                    }
                })



                let studentSubscription = [...document.querySelectorAll('#student-subscription')];

                studentSubscription.map(item => {
                    //checked={ MultiStudentHourlyRate ?  ? true : false : false}
                    //defaultChecked={SubscriptionPlan.split(' ').splice(-1)[0] === item ? true : false} value={(index + 1) * 4 + " "  + "@" + " " + item}
                    if(SubscriptionPlan.split(' ').splice(-1)[0] === item.value.split(' ').splice(-1)[0]){
                        item.checked = true
                    }
                })

                if(result[0].FreeDemoLesson === 'yes'){
                    document.querySelector('#freeDemoYes').checked = true
                    document.querySelector('#freeDemoNo').checked = false
                    
                }else{
                    document.querySelector('#freeDemoYes').checked = false
                    document.querySelector('#freeDemoNo').checked = true
                }

                if(result[0].ConsentRecordingLesson === 'yes'){
                    document.querySelector('#consentRecordingYes').checked = true
                    document.querySelector('#consentRecordingNo').checked = false
                    
                }else{
                    document.querySelector('#consentRecordingYes').checked = false
                    document.querySelector('#consentRecordingNo').checked = true
                }
                
            }else{

            }
            
        })
        .catch((err) => {
            console.log(err)
        })
    }, [])


    let saver = async () => {

        let response = await upload_form_three(MultiStudentHourlyRate,MultiStudentOption,CancellationPolicy,FreeDemoLesson,ConsentRecordingLesson,ActivateSubscriptionOption,SubscriptionPlan,window.localStorage.getItem('tutor_user_id'));

        return response;

    }

    if(document.querySelector('#tutor-save')){

        document.querySelector('#tutor-save').onclick = async() => {

            console.log(MultiStudentOption.length, MultiStudentHourlyRate.length, CancellationPolicy.length, FreeDemoLesson.length, ConsentRecordingLesson.length, ActivateSubscriptionOption.length, SubscriptionPlan.length)

            if(MultiStudentOption === true || MultiStudentOption === false && MultiStudentHourlyRate.length > 0 && CancellationPolicy.length > 0 && FreeDemoLesson.length > 0 && ConsentRecordingLesson.length > 0 && ActivateSubscriptionOption === true || ActivateSubscriptionOption === false  && SubscriptionPlan.length > 0){
                document.querySelector('.save-overlay').setAttribute('id', 'save-overlay')
                let response = await saver();
                if(response.bool){
                    //window.localStorage.setItem('user_id', response.user);
                    //window.localStorage.setItem('tutor_screen_name', response.screen_name);
                    //document.querySelector('form').reset(); 
                    console.log(response)

                    setTimeout(() => {
                        document.querySelector('.save-overlay').removeAttribute('id');
                    }, 1000);

                    document.querySelector('.tutor-popin').setAttribute('id', 'tutor-popin');
                    document.querySelector('.tutor-popin').style.background = '#000';
                    document.querySelector('.tutor-popin').innerHTML = response.mssg
                    setTimeout(() => {
                        document.querySelector('.tutor-next').setAttribute('id', 'next')
                        document.querySelector('.tutor-popin').removeAttribute('id');
                    }, 5000);
                }else{
                    setTimeout(() => {
                        document.querySelector('.save-overlay').removeAttribute('id');
                    }, 1000);
                    
                    document.querySelector('.tutor-popin').setAttribute('id', 'tutor-popin');
                    document.querySelector('.tutor-popin').style.background = 'red';
                    document.querySelector('.tutor-popin').innerHTML = response.mssg
                    setTimeout(() => {
                        document.querySelector('.tutor-popin').removeAttribute('id');
                    }, 5000);

                }

                
            }else{
                alert('Please Ensure All Input Fields Contains A Value')
            }


            /**/
        };
    }

    useEffect(() => {
        let next = document.querySelector('.tutor-next')

        if(next.hasAttribute('id')){
            next.removeAttribute('id');
        }
    }, [])

    

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

   
    let multi_student_cols = [{Header: '# Students'}, {Header: 'Select'}, {Header: 'Discount'}]
    let multi_rates = ['25%', '30%', '33%', '36%', '39%', '42%', '45%', '48%', '51%', <input type='text' id='custom-rate' placeholder='Type Here' style={{height: '20px', width: '80%', margin: '3px 0 0 0'}}/>, <input type='text' id='custom-rate' placeholder='Type Here' style={{height: '20px', width: '80%', margin: '3px 0 0 0'}}/>]

    let subscription_cols = [{Header: 'Hours'}, {Header: 'Select'}, {Header: 'Discount'}]
    let subscription_dicount = ['6.0%', '12.0%', '18.0%', '24.0%']


    useEffect(() => {
        
    }, [])

    return ( 
        
        <>
            <div className="tutor-popin"></div>
            <div className="save-overlay">
                <span className="save_loader"></span>
            </div>
            <div className="tutor-tab-rates" >
                <div className="tutor-tab-rate-section">


                    <div className="tutor-tab-rate-box">
                        <h6 className='text-secondary'>Multi Student Hourly Rate</h6>  
                        <div style={{height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 'auto'}}>
                            <input type="checkbox"  onInput={e => setMultiStudentOption(e.target.checked ? true : false)} style={{cursor: 'pointer', height: '20px', width: '20px'}} name="multi-student-checkbox" id="multi-student-checkbox"  /> &nbsp;
                            <label htmlFor="multi-student-checkbox"><h6>Activate multi student option</h6></label>
                        </div>

                        <div className="highlight">
                             You must check the box above to activate the multi students option allowing multi students tutoring. Your students will select one rate from the table below reflecting the number of students in their group. The discount rate refers to each student in the group. if a student absent he/she are still being charged even if he/she cancelled the session. Should you decide to tutor a full class of students (up to 30) set up your rate in the last row. usually a school may hire you for this task when they are short of a teachers.
                        </div>

                        <div className="rate-table" style={{pointerEvents: /*MultiStudentOption ? 'all' : */'none', opacity: /*MultiStudentOption ? '1' : */'.5'}}>
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

                                                <td>

                                                    {
                                                        index + 1 > 10 

                                                        ? 

                                                        <input  value={index + 1 + " " + "@" + " " + item} onInput={e => setMultiStudentHourlyRate(e.target.value)} type='checkbox' /*onInput={e => item === document.querySelector('#custom-rate') ? document.querySelector('#custom-rate').value : item}*/ name='rate' style={{margin: '8px 0 0 0', cursor: 'pointer', height: '20px', width: '20px'}}/>

                                                        : 

                                                        <input  value={index + 1 + " " + "@" + " " + item}   onInput={e => setMultiStudentHourlyRate(e.target.value)} type='radio' /*onInput={e => item === document.querySelector('#custom-rate') ? document.querySelector('#custom-rate').value : item}*/ name='multi-student' id='multi-student' style={{margin: '8px 0 0 0', cursor: 'pointer', height: '20px', width: '20px'}}/>

                                                    }

                                                </td>

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
                                <select name="" onInput={e => setCancellationPolicy(e.target.value)} id="tutor-cancellation-policy">
                                    <option selected={CancellationPolicy === 'null' ? 'selected' : ''} value="null"> Select</option>
                                    <option selected={CancellationPolicy === 'None' ? 'selected' : ''} value="None">None</option>
                                    <option selected={CancellationPolicy === '3 hours' ? 'selected' : ''} value="3 hours">3 hours</option>
                                    <option selected={CancellationPolicy === '6 hours' ? 'selected' : ''} value="6 hours">6 hours</option>
                                    <option selected={CancellationPolicy === '12 hours' ? 'selected' : ''} value="12 hours">12 hours</option>
                                    <option selected={CancellationPolicy === '24 hours' ? 'selected' : ''} value="24 hours">24 hours</option>
                                    <option selected={CancellationPolicy === '48 hours' ? 'selected' : ''} value="48 hours">48 hours</option>
                                </select>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', flexDirection: 'row', marginBottom: '5px',  justifyContent: 'center'}}>
                                <label htmlFor=""><h6>Introduction lesson at 50% off &nbsp;</h6></label>
                                <input onInput={e => setFreeDemoLesson(e.target.value)}  style={{cursor: 'pointer', height: '20px', width: '20px'}} type="radio" name="30-mins-free-demo-lesson" id='freeDemoYes' value={'yes'} />&nbsp; <h6>Yes</h6> &nbsp;
                                <input onInput={e => setFreeDemoLesson(e.target.value)} style={{cursor: 'pointer', height: '20px', width: '20px'}} id='freeDemoNo' type="radio" name="30-mins-free-demo-lesson" value={'no'} />&nbsp; <h6>No</h6> 
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', flexDirection: 'row', marginBottom: '20px',  justifyContent: 'center'}}>
                                <label htmlFor=""><h6>Consent recording lesson &nbsp;</h6></label>
                                <input onInput={e => setConsentRecordingLesson(e.target.value)} id='consentRecordingYes' style={{cursor: 'pointer', height: '20px', width: '20px'}}  type="radio" name="consent-recording-lesson" value={'yes'} />&nbsp; <h6>Yes</h6> &nbsp;
                                <input onInput={e => setConsentRecordingLesson(e.target.value)} id='consentRecordingNo' style={{cursor: 'pointer', height: '20px', width: '20px'}}  type="radio" name="consent-recording-lesson" value={'no'} />&nbsp; <h6>No</h6>
                            </div>

                            <div className="highlight" style={{margin: '0'}}>
                                Video will be stored for 30 days for educational purpose. Can be watched only by thr tutor, student or parent.
                            </div>

                        </div>
                    </div>


                    <div className="tutor-tab-rate-box">
                        <h6>Subscription Plan</h6>

                        <div style={{height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 'auto'}}>
                            <input type="checkbox"  onInput={e => setActivateSubscriptionOption (e.target.checked ? true : false)} style={{cursor: 'pointer', height: '20px', width: '20px'}}  name="subscription-plan" id="subscription-plan"  /> &nbsp;
                            <label htmlFor="subscription-plan"><h6>Activate subscription option</h6></label>
                        </div>

                        <div className="highlight">
                            You must check the box above to activate this option. Your student will select one option from the table below when he/she want to save by paying upfront on multi sessions. The Academy will forward you 50% from the discounted amount upfront. For example; student selects the 12 hours option, and you charge $45.00/hr, then $45.00 X 12 = $540 -10% = $486. from this amount the academy will forward you 50% upfront, and the balance upon completion.
                        </div>

                        <div className="rate-table" style={{pointerEvents: /*ActivateSubscriptionOption ? 'all' :*/ 'none', opacity:/* ActivateSubscriptionOption ? '1' :*/ '.5'}} >
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
                                                    <input  onInput={e => setSubscriptionPlan(e.target.value)} type='radio'/*onInput={e => item === document.querySelector('#custom-rate') ? document.querySelector('#custom-rate').value : item}*/ name='student-subscription' id='student-subscription' style={{margin: '8px 0 0 0', cursor: 'pointer', height: '20px', width: '20px'}}/>
                                                </td>

                                                <td>{item}</td>
                                            </tr>
                                        )
                                    }
                                    
                                    
                                </tbody>
                            </table>
                        </div>

                        
                    </div>

                </div>
            </div>
        </>
     );
}
 
export default Rates;