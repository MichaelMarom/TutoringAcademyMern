import { useEffect, useState } from "react";
import { get_student_market_data } from "../../axios/student";
import { G } from "@react-pdf/renderer";

const StudentMarketPlace = () => {

    let [screen_name, set_screen_name] = useState('')
    let [grade, set_grade] = useState('')
    let [lang, set_lang] = useState('')
    let [country, set_country] = useState('')


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


    



    useEffect(() => {

        if(window.localStorage.getItem('student_user_id') !== null){
            get_student_market_data(window.localStorage.getItem('student_user_id'))
            .then(({StudentData, EducationalLevel, Exprience, CertificateTypes, Subjects, Faculty, GMT}) => {
                set_screen_name(StudentData[0].ScreenName) 
                set_grade(StudentData[0].Grade)
                set_country(StudentData[0].Country)
                set_lang(StudentData[0].Language)
                set_gmt_list(GMT[0])

                set_education_list(EducationalLevel)
                set_certificate_list(CertificateTypes)
                set_exprience_list(Exprience)
                set_faculty_list(Subjects)
                set_faculty_list(Faculty)



                
            })
            .catch(err => console.log(err))
        }
    }, [])
    

    return ( 
        <>
            <div className="student-market-place-cnt">
                <div className="student-market-place-header">
                    <ul>
                        <li>The market place</li>
                        <li>Advertise</li>
                        <li>Tutor's bid</li>
                    </ul>
                </div>

                <div className="student-market-place-report-ad">
                    <input style={{width: '20px', height: '20px', margin: '0'}} type="checkbox" name="" id="reportAd" />
                    &nbsp;
                    <label htmlFor="reportAd"><b>Report Ad</b></label>
                </div>

           

                <br />

                <div className="student-market-place-body">
                    

                    <div className="student-market-place-body-form">
                        <div className="input-cnt">
                            <label htmlFor="">Student Screen ID</label>
                            <input defaultValue={screen_name} type="text" name="" id="Ad" />
                        </div>

                        <div className="input-cnt">
                            <label htmlFor="">Student Grade</label>
                            <input defaultValue={grade} type="text" name="" id="Ad" />
                        </div>

                        <div className="input-cnt">
                            <label htmlFor="">Country</label>
                            <input defaultValue={country} type="text" name="" id="Ad" />
                        </div>

                        <div className="input-cnt">
                            <label htmlFor="">Student Language</label>
                            <input defaultValue={lang} type="text" name="" id="Ad" />
                        </div>
                        <div className="input-cnt">
                            <label htmlFor="">Student Country</label>
                            <input defaultValue={country} type="text" name="" id="Ad" />
                        </div>

                        <div className="input-cnt" style={{marginBottom: '15px'}}>
                            <label htmlFor="">Need Help From Faculty</label>
                            <select>
                                <option value={''}>Select</option>
                                {
                                    faculty_list.map(item => {
                                        return(
                                            <option value={item.Faculty}>{item.Faculty}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className="input-cnt" style={{marginBottom: '15px'}}>
                            <label htmlFor="">Subject</label>
                            <select>
                                <option value={''}>Select</option>
                                {
                                    subject_list.map(item => {
                                        return(
                                            <option value={item.SubjectName}>{item.SubjectName}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>

                        <div className="input-cnt" style={{display: 'flex', alignItems: 'center', justifyContent: 'left'}}>
                            <label htmlFor="">Price Range</label>
                            <input  style={{width: '30%'}} type="number" name="" id="Ad" />
                            &nbsp; <b>To</b> &nbsp;
                            <input  style={{width: '30%'}} type="number" name="" id="Ad" />
                        </div>

                    </div>
                    
                    

                    <div className="student-market-place-btm-form">
                        <h4>Student's Requirements</h4>
                        <div className="input-cnt" style={{marginBottom: '15px'}}>
                            <label htmlFor="">Educational Level</label>
                            <select>
                                <option value={''}>Select</option>
                                {
                                    education_list.map(item => {
                                        return(
                                            <option value={item.Level}>{item.Level}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        

                        <div className="input-cnt" style={{marginBottom: '15px'}}>
                            <label htmlFor="">Teaching Experience</label>
                            <select>
                                <option value={''}>Select</option>
                                {
                                    exprience_list.map(item => {
                                        return(
                                            <option value={item.TutorExperience}>{item.TutorExperience}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        
                        <div className="input-cnt" style={{marginBottom: '15px'}}>
                            <label htmlFor="">Teacher's Certificate</label>
                            <select>
                                <option value={''}>Select</option>
                                {
                                    certificate_list.map(item => {
                                        return(
                                            <option value={item.CertificateType}>{item.CertificateType}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        

                        <div className="input-cnt" style={{marginBottom: '15px'}}>
                            <label htmlFor="">Native Language</label>
                            <select>
                                <option value={''}>Select</option>
                                {
                                    lang_list.map(item => {
                                        return(
                                            <option value={item}>{item}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        
                        <div className="input-cnt" style={{marginBottom: '15px'}}>
                            <label htmlFor="">UTC (Time + Date)</label>
                            <select>
                                <option value={''}>Select</option>
                                {
                                    gmt_list.map(item => {
                                        return(
                                            <option value={item.GMT}>{item.GMT}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        

                        <textarea style={{height: '100px', width: '400px'}}></textarea>

                    </div>


                    <div className="student-market-place-buttons">
                        <div className="input-cnt">
                            <input style={{width: '20px', height: '20px', margin: '0'}} type="checkbox" name="" id="" />
                            &nbsp;&nbsp;
                            <label htmlFor=""><b>Let the system find my tutor</b></label>
                        </div>

                        <div className="student-market-place-btns">
                            <button style={{background: 'red', color: '#fff'}}>Delete Ad</button>
                            <button style={{background: 'yellow', color: '#fff'}}>Submit Ad</button>
                        </div>
                    </div>

                </div>
            </div>
        </>
     );
}
 
export default StudentMarketPlace;