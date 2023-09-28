import { useTable } from 'react-table';
import { useState } from 'react';

import { COLUMNS } from '../../Tables/Me/columns';
import fb from  '../../images/FB_IMG_1670873473127.jpg'
import vd from  '../../images/Settings 2023-02-28 17-54-39.mp4'
import { useEffect } from 'react';
import { get_my_data, get_rates } from '../../axios/tutor';

const TutorProfile = () => {

    let [photo,  setphoto] = useState('loading...')
    let [GMT,  setGMT] = useState('0')
    let [video,  setvideo] = useState('loading...')
    let [intro,  setIntro] = useState('loading...')
    let [headline,  setHeadline] = useState('loading...')
    let [college1,  setCollege1] = useState('loading...')
    let [college2,  setCollege2] = useState('loading...')
    let [certificate,  setCertificate] = useState('loading...')
    let [educationalLevel,  setEducationalLevel] = useState('loading...')
    let [tutorExperience,  setTutorExperience] = useState('loading...')
    let [workExperience,  setWorkExperience] = useState('loading...')
    let [resHrs,  setResHrs] = useState('loading...')
    let [lang,  setLang] = useState('loading...')
    let [state,  setState] = useState('loading...')
    let [MutiStudentOption, setMutiStudentOption] = useState('loading...')
    let [expiration,  setExpiration] = useState('loading...')
    let [CancellationPolicy, setCancellationPolicy] = useState('loading...')
    let [ConsentRecordingLesson, setConsentRecordingLesson] = useState('loading...')

    let [rates, setRates] = useState([])

    useEffect(() => {
        get_my_data(window.localStorage.getItem('tutor_user_id'))
        .then((result) => {

            let response_0 = result[0];
            let response_1 = result[1];
            let response_2 = result[2];


            let files = [...response_0[0], ...response_1[0], ...response_2[0]];
            let me = {...files[0], ...files[1], ...files[2], ...files[3]}
           
            console.log(new Set(files))
            console.log(me)

            setvideo(me.Video) 
            setphoto(me.Photo)
            setCollege1(me.College1)
            setCollege2(me.College2)
            setCertificate(me.Certificate)
            setEducationalLevel(me.EducationalLevel)
            setTutorExperience(me.EducationalLevelExperience)
            setExpiration(me.CertificateExpiration)
            setMutiStudentOption(me.MutiStudentOption)
            setConsentRecordingLesson(me.ConsentRecordingLesson)
            setCancellationPolicy(me.CancellationPolicy)
            setWorkExperience(me.WorkExperience)
            setIntro(me.Introduction)
            setHeadline(me.HeadLine)
            setResHrs(me.ResponseHrs)
            setLang(me.NativeLang)
            setState(me.StateProvince)
            setState(me.StateProvince);
            setGMT(me.GMT) 


        })
        .catch((err) => console.log(err))

        get_rates(window.localStorage.getItem('tutor_user_id')) 
        .then((result) => {
            setRates(result)
        })
        .catch((err) => console.log(err))
    }, [])


    function calcTime(offset) {

        // create Date object for current location
       

        var start = new Date().toUTCString();
        let time = start.split(' ').splice(3, 4)[1].split(':').splice(0,2).join(':');



       
        //console.log(time); 
        //calcTime(GMT.split('').splice(1, GMT.length).join(''))
       
        // return time as a string
        return  start.split(' ').splice(3, 4)[1];
    }

 
    return ( 
        <>
            <div className="form-tutor-profile">

                <div className="form-tutor-profile-head">
                    <ul>
                        <li style={{width: '33%'}}> 
                            <input style={{height: '30px', width: '30px', margin: '0 10px 0 0 '}} type="checkbox" name="" id="" />
                            <span>Verified</span>
                        </li>
                        {/*<li style={{width: '33%'}}> 
                            <p>Status</p>
                            <input style={{height: '30px', width: '150px', margin: '0 10px 0 0 '}} type="text" name="" id="" />
                        </li>
                        <li style={{width: '33%'}}> 
                            <p>Profile page</p>
                            <input style={{height: '40px'}} type="range" name="" id="" />
    </li>*/}
                    </ul>
                </div>

                <div className="form-tutor-profile-body">
                    <div className="tutor-intel1">

                        <div style={{height: '230px', width: '180px', margin: '0 0 0 40px', position: 'relative'}}>
                            <div><b>{calcTime()}</b></div>
                            <img src={photo} style={{height: '180px', width: '180px'}} alt="" />
                        </div>
                         

                        <div className="education-intel">
                            <h6>Education</h6>

                            <div style={{float: 'left', height: '100%', width: '50%'}}>
                                <div>
                                    <p><b>College University 1</b></p>
                                    <p style={{color: 'red'}}><b>{college1}</b></p>
                                </div>
                                <div>
                                    <p><b>Teaching Level </b></p>
                                    <p style={{color: 'red'}}><b>Any</b></p>
                                </div>
                                <div>
                                    <p><b>Certification</b></p>
                                    <p style={{color: 'red'}}><b>{certificate}</b></p> 
                                </div>
                            </div>

                            <div style={{float: 'right', height: '100%', width: '50%'}}>
                                <div>
                                    <p><b>College University 2</b></p>
                                    <p style={{color: 'red'}}><b>{college2}</b></p>
                                </div>
                                <div>
                                    <p><b>Experience</b></p>
                                    <p style={{color: 'red'}}><b>{tutorExperience}</b></p>
                                </div>
                                <div> 
                                    <p><b>Educational Level</b></p>
                                    <p style={{color: 'red'}}><b>{educationalLevel}</b></p>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="tutor-intel2">
                        <p>
                            This is the page where students/parents would be aquinted with you, and make their decision to hire you. Treat this page like it's your own business. 
                        </p>

                        <p>
                            <span><b>Headline</b></span> 
                            <span> {headline}</span>
                        </p>

                        <div>
                            <p><b>Introduction</b></p>

                            <div style={{textAlign: 'left', fontSize: 'large', padding: '10px', height: '200px'}}>
                                {intro}
                            </div>

                            <div style={{textAlign: 'left', fontSize: 'large', padding: '10px', height: '30%'}}>
                                Nothing like a face to face video conference contributors to building the trust between strangers. Motivate your students to take a free 30 minutes demo lessons with you. offer subscription discount and or group learning for reduced price.
                            </div>

                        </div>

                    </div>

                    <div className="tutor-intel3">
                        <div>{GMT}</div>
                        <video controls src={video} autoPlay  style={{height: '250px', width: '300px', margin: '0 0 0 90px', background: '#000'}} alt="" />
                        <button style={{height: '40px', margin: 'auto', marginLeft: '90px', marginTop: '10px', marginBottom: '20px', width: '250px', padding: '5px'}}>Click to view</button>

                        <div className="education-intel">

                            <div style={{float: 'left', height: '100%', width: '33.3%'}}>
                                <div>
                                    <p><b>Cancellation</b></p>
                                    <p style={{color: 'red'}}><b>{CancellationPolicy}</b></p>
                                </div>
                                <br />
                                <div>
                                    <p><b>Response Hours</b> </p>
                                    <p style={{color: 'red'}}><b>{resHrs}</b></p>
                                </div>
                            </div>

                            <div style={{float: 'left', height: '100%', width: '33.3%'}}>
                                <div>
                                    <p><b>Language</b></p>
                                    <p style={{color: 'red'}}><b>{lang}</b></p>
                                </div>
                            </div>

                            <div style={{float: 'right', height: '100%', width: '33.3%'}}>
                                <div>
                                    <p><b>Tutoring</b></p>
                                    <p style={{color: 'red'}}><b>{MutiStudentOption}</b></p>
                                </div>
                                <div>
                                    <p><b>Recording</b></p>
                                    <p style={{color: 'red'}}><b>{ConsentRecordingLesson}</b></p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="form-tutor-profile-btm">

                    <div className="form-tutor-profile-table" style={{textAlign: 'left', padding: '10px', float: 'left', width: '60%'}}>
                        <table>
                            <thead>
                                <tr>
                                    {COLUMNS.map(item => <th key={item.Header}>{item.Header}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                    
                                {

                                    rates.map((item, index) => 
                                        <tr key={index}>
                                            <td>{item.subject}</td>

                                            <td>{educationalLevel}</td>
                                            <td>{tutorExperience}</td>

                                            <td>{certificate}</td> 
                                            <td>{state}</td>

                                            <td>{expiration}</td>
                                            <td>{item.rate}</td>
                                        </tr>
                                    )
                                }
                                
                                
                            </tbody>
                        </table>
                    </div>

                    <div className="form-tutor-profile-table" style={{textAlign: 'center', padding: '10px', float: 'right', width: '40%'}}>
                        <h6>Work Experience</h6>

                        <div style={{textAlign: 'left', textTransform: 'capitalize', padding: '15px', background: '#e7e7e7'}}>
                            {workExperience}
                        </div>
                    </div>

                </div>

            </div>
        </>
     );
}
 
export default TutorProfile;