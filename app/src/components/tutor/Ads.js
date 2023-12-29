import { useEffect, useState } from "react";
import { get_student_market_data } from "../../axios/student";
import { G } from "@react-pdf/renderer";
import { get_tutor_market_data } from "../../axios/tutor";
import TutorNewSubject from "../../pages/Admin/NewSubject";

const Ads = () => {

    let [screen_name, set_screen_name] = useState('...')
    let [grade, set_grade] = useState('...')
    let [lang, set_lang] = useState('...')
    let [country, set_country] = useState('...')


    let [education_list, set_education_list] = useState([])
    let [exprience_list, set_exprience_list] = useState([])
    let [certificate_list, set_certificate_list] = useState([])
    let [utc_list, set_utc_list] = useState([])
    let [faculty_list, set_faculty_list] = useState([])
    let [lang_list, set_lang_list] = useState('')
    let [subject_list, set_subject_list] = useState([])
    let [gmt_list, set_gmt_list] = useState([])

    let [education, set_education] = useState([])
    let [exprience, set_exprience] = useState([])
    let [certificate, set_certificate] = useState([])
    let [utc, set_utc] = useState([])
    let [faculty, set_faculty] = useState([])
    let [subject, set_subject] = useState([])

    let [activeFaculty, setActiveFaculty] = useState('')




    useEffect(() => {
        console.log(activeFaculty)

        let list = subject.filter(item => item.FacultyId == activeFaculty)

        set_subject_list(list)
    }, [activeFaculty])


    useEffect(() => {

        if (window.localStorage.getItem('tutor_id') !== null) {
            get_tutor_market_data(window.localStorage.getItem('tutor_id'))
                .then((result) => {

                    let { TutortData, EducationalLevel, Exprience, CertificateTypes, Subjects, Faculty, GMT, Education } = result

                    console.log(result)
                    set_screen_name(TutortData[0].TutorScreenname)
                    set_grade(TutortData[0].Grades)
                    set_country(TutortData[0].Country)
                    set_lang(TutortData[0].Language)
                    set_gmt_list([TutortData[0].GMT])
                    set_education(Education)

                    set_education_list(EducationalLevel)
                    set_certificate_list(CertificateTypes)
                    set_exprience_list(Exprience)
                    set_subject_list(Subjects)
                    set_faculty_list(Faculty)




                })
                .catch(err => console.log(err))
        }
    }, [])



    return (
        <>
            <div className="student-market-place-cnt">


                <div className="student-market-place-report-ad" style={{ position: 'relative', width: '100%' }}>

                    <input style={{ width: '20px', height: '20px', margin: '0' }} type="checkbox" name="" id="reportAd" />
                    &nbsp;
                    <label htmlFor="reportAd"><b>Repeat This Ad</b></label>


                    <textarea style={{ width: '50%', height: '100px', marginLeft: '20%', marginTop: '.5%' }}>

                    </textarea>

                    <div className="input-cnt" >
                        <label htmlFor="">Ads Header</label>

                        <input defaultValue={lang} type="text" name="" id="Ad" />
                    </div>

                </div>





                <br />

                <div className="student-market-place-body">




                    <div className="student-market-place-body-form">


                        <div className="input-cnt">
                            <label htmlFor="">Tutor Screen ID</label>
                            <input defaultValue={screen_name} type="text" name="" id="Ad" />
                        </div>

                        <div className="input-cnt">
                            <label htmlFor="">Tutor Teaching Grade</label>
                            <input defaultValue={grade} type="text" name="" id="Ad" />
                        </div>

                        <div className="input-cnt">
                            <label htmlFor="">Tutor Language</label>
                            <input defaultValue={lang} type="text" name="" id="Ad" />
                        </div>




                        {/*<div className="input-cnt" style={{marginBottom: '15px'}}>
                            <label htmlFor="">Faculty</label>
                            <select onInput={e => setActiveFaculty(e.target.value.split('-')[1])}>
                                <option value={''}>Select Faculty</option>
                                {
                                    faculty_list.map(item => {
                                        return(
                                            <option value={`${item.Faculty}-${item.Id}`}>{item.Faculty}</option>
                                        )
                                    })
                                }
                            </select>
                            </div>*/}

                        <div className="input-cnt" style={{ marginBottom: '15px' }}>
                            <label htmlFor="">Subject</label>
                            <div className="tutor-teaching-subject">

                                {
                                    subject_list.map((item, index) => <div key={index}>{item.subject}</div>)
                                }

                            </div>
                        </div>

                        {/*<div className="input-cnt" style={{display: 'flex', alignItems: 'center', justifyContent: 'left'}}>
                            <label htmlFor="">Price Range</label>
                            <input  style={{width: '30%'}} onInput={e => set_price_max(e.target.value)} defaultValue={0} min={0} type="number" name="" id="Ad" />
                            &nbsp; <b>To</b> &nbsp;
                            <input  style={{width: '30%'}} min={eval(price_max) + 1} defaultValue={eval(price_max) + 1} type="number" name="" id="price-max" />
                            </div>*/}

                        <div className="input-cnt" style={{ marginBottom: '15px' }}>
                            <label htmlFor="">Educational Level</label>
                            <select>
                                <option value={''}>Select</option>
                                {
                                    education_list.map(item =>

                                        education[0]?.EducationalLevel === item.Level
                                            ?
                                            <option selected value={item.Level}>{item.Level}</option>

                                            :

                                            <option value={item.Level}>{item.Level}</option>


                                    )
                                }
                            </select>
                        </div>


                        <div className="input-cnt" style={{ marginBottom: '15px' }}>
                            <label htmlFor="">Teaching Experience</label>
                            <input type="text" value={education[0]?.EducationalLevelExperience} />
                        </div>

                    </div>



                    <div className="student-market-place-btm-form">

                        <div className="input-cnt" style={{ marginBottom: '15px' }}>
                            <label htmlFor="">Tutor's Certificate</label>
                            <input type="text" value={education[0]?.Certificate} />
                        </div>




                        <div className="input-cnt" style={{ marginBottom: '15px' }}>
                            <label htmlFor="">Country</label>

                            <input style={{ width: '300px' }} value={country} type="number" name="" id="Ad" />

                        </div>


                        <div className="input-cnt" style={{ marginBottom: '15px' }}>
                            <label htmlFor="">UTC (Max time zones)</label>

                            <input style={{ width: '300px' }} min={0} max={12} defaultValue={0} type="number" name="" id="Ad" />

                        </div>

                        <div className="input-cnt" style={{ marginBottom: '15px' }}>
                            <label htmlFor="">GMT</label>

                            <input style={{ width: '300px' }} min={0} max={12} defaultValue={0} type="number" name="" id="Ad" />

                        </div>


                        <textarea style={{ height: '150px', width: '500px', padding: '10px' }} value={`My name is "${screen_name}", I teach "${subject_list.length < 1 ? '...' : [...subject_list.map(item => item.subject)].join(', ')}" for students "${grade}". I am "${education[0] ? education[0]?.EducationalLevel : '...'}" with experience of 
                        "${education[0] ? education[0]?.EducationalLevelExperience : '...'}". 
                        I live in "${country}", time zone "${gmt_list[0]}". I can teach students within 
                        "${utc}" time zones. Please look at my calendar-scheduling for availability, 
                        and my profile for my work experience and promotions.`} ></textarea>

                    </div>


                    <div className="student-market-place-buttons">
                        <div className="input-cnt">
                            <input style={{ width: '20px', height: '20px', margin: '0' }} type="checkbox" name="" id="" />
                            &nbsp;&nbsp;
                            <label htmlFor=""><b>Let the system find my tutor</b></label>
                        </div>

                        <div className="student-market-place-btns">
                            <button style={{ background: 'red', color: '#fff' }}>Delete Ad</button>
                            <button style={{ background: 'yellow', color: '#fff' }}>View Ad</button>
                            <button style={{ background: 'Green', color: '#fff' }}>Submit Ad</button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default Ads;