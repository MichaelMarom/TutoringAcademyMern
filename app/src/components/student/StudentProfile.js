import { useState } from 'react';
import { COLUMNS } from '../../Tables/Me/columns';
import { useEffect } from 'react';
import { get_my_data } from '../../axios/student';
import moment from 'moment-timezone'

function calcTime() {
    let utcDateTime = moment().utc()
    const localTime = utcDateTime.local().format('dddd, MMMM D, HH:mm:ss');
    return localTime;
}

const StudentProfileCnt = () => {

    let [photo, setphoto] = useState('')
    let [screenName, setscreenName] = useState('')
    let [Id, setId] = useState('')
    let [consentVideo, setconsentVideo] = useState('')
    let [grade, setGrade] = useState('')
    let [GMT, setGMT] = useState('')
    let [country, setcountry] = useState('')
    let [parentFname, setparentFname] = useState('')
    let [parentLname, setparentLname] = useState('')
    

    let [rates, setRates] = useState([])
    const [currentTime, setCurrentTime] = useState(calcTime())

    useEffect(() => {
        get_my_data(window.localStorage.getItem('student_user_id'))
            .then((result) => {

                let response_0 = result[0];
                let response_1 = result[1];


                let files = [...response_0[0], ...response_1[0]];
                let me = { ...files[0], ...files[1], ...files[2]}

                console.log(me)

                setphoto(me.Photo)
                setGMT(me.GMT)
                setscreenName(me.ScreenName)
                setcountry(me.Country)
                setId(me.AcademyId)
                setconsentVideo(me.ParentConsent)
                setGrade(me.Grade)
                setparentFname(me.ParentFirstName)
                setparentLname(me.ParentLastName)

            })
            .catch((err) => console.log(err))

        
    }, [])

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(calcTime())
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <>
            <div className="form-student-profile">
<br />
                <div className="form-student-profile-head">
                    <div style={{ height: '230px', width: '180px', margin: '0 0 0 40px', position: 'relative' }}>
                        <div><b className='small'>{calcTime()}</b></div>
                        <img src={photo} style={{ height: '180px', width: '180px' }} alt="" />
                    </div>
                </div>
                <br />


                <div className="form-student-profile-body">
                    <div style={{display: 'flex'}}>
                        
                       
                    </div>

                    <br />

                    <div style={{display: 'flex'}}>
                        <div>

                            <div className='input-cnt' style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
                                <label>Screen Name</label>
                                <input defaultValue={screenName} type='text'></input>
                            </div>
                            <div className='input-cnt' style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
                                <label>Grade</label>
                                <input defaultValue={grade} type='text'></input>
                            </div>
                            <div className='input-cnt' style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
                                <label>Country</label>

                                <input defaultValue={country} type='text'></input>

                            </div>
                        </div>

                        <div>
                            <div className='input-cnt' style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
                                <label>Time Zone GMT</label>
                                <input defaultValue={GMT} type='text'></input>
                            </div>
                            <div className='input-cnt' style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
                                <label>Parent FirstName</label>

                                <input defaultValue={parentFname} type='text'></input>

                            </div>
                            <div className='input-cnt' style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
                                <label>Parent LastName</label>

                                <input defaultValue={parentLname} type='text'></input>

                            </div>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap'}}>
                                
                                    <h5>Parent(s) video recording consent</h5>
                                    <div style={{display: 'flex', flexDirection: 'row',}}>
                                        <div className='input-cnt' style={{height: '20px', width: '70px'}}>
                                            <label style={{height: '20px', width: '20px'}} htmlFor='parentConsentYes'>Yes</label>
                                            &nbsp;&nbsp;
                                            <input checked={consentVideo ? true: false} data-type='radio' name='parentConsent' style={{height: '20px', width: '20px', marginTop: '10px'}} id='parentConsentYes' type='radio'/>
                                        </div>

                                        <div className='input-cnt' style={{height: '20px', width: '70px'}}>

                                            <label style={{height: '20px', width: '20px'}} htmlFor='parentConsentNo'>No</label>
                                            &nbsp;&nbsp;
                                            <input checked={!consentVideo ? true: false} data-type='radio' name='parentConsent' style={{height: '20px', width: '20px', marginTop: '10px'}}  id='parentConsentNo' type='radio'/>
                                        </div>
                                    </div>
                            </div>
                        </div>
                    </div>


                </div>


            </div>
        </>
    );
}

export default StudentProfileCnt;