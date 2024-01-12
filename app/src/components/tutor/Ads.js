import { useEffect, useState } from "react";
import { get_tutor_market_data } from "../../axios/tutor";
import Button from "../common/Button";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter } from "../../helperFunctions/generalHelperFunctions";
import { convertGMTOffsetToLocalString } from "../../helperFunctions/timeHelperFunctions";
import Pill from '../common/Pill'
import Loading from "../common/Loading";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import { GoPlus } from "react-icons/go";
import RichTextEditor from '../common/RichTextEditor/RichTextEditor'


const Ads = () => {
    const { tutor } = useSelector(state => state.tutor);
    let [education, set_education] = useState({})
    const [subjects, set_subjects] = useState([])
    const [fetching, setFetching] = useState(true);
    const [subject, setSubject] = useState('');
    const [grades, setGrades] = useState([])
    const [header, setHeader] = useState('')

    const [addText, setAddText] = useState(` Hello Students. My screen name is "${capitalizeFirstLetter(tutor.TutorScreenname)}", I teach "${subject.length ? subject : "...."}". I am "${education ? education?.EducationalLevel : '...'}" with experience of "${education ? education?.EducationalLevelExperience : '...'}".
    I live in "${tutor.Country}", time zone "${tutor.GMT}". I can teach students within
    "${convertGMTOffsetToLocalString(tutor.GMT)}" time zones. Click here to view my profile for my work experience, certificates, and Diploma.
    There you can look at my calendar-scheduling for availability, and book your lesson.
`)

    console.log(education, ';market sa')

    // const [grade, setGrade] = useState('')

    useEffect(() => {
        if (window.localStorage.getItem('tutor_user_id') !== null) {
            get_tutor_market_data(window.localStorage.getItem('tutor_user_id'))
                .then((result) => {

                    let { Subjects, Education } = result

                    console.log(Subjects, ';market sa123')
                    set_subjects(Subjects)
                    set_education(Education[0])
                    setFetching(false)
                })
                .catch(err => console.log(err))
        }
    }, [])

    useEffect(() => {
        setAddText(` Hello Students. My screen name is "${capitalizeFirstLetter(tutor.TutorScreenname)}", I teach "${!!subject.length ? subject : '.....'}". I am "${education ? education?.EducationalLevel : '....'}" with experience of "${education ? education?.EducationalLevelExperience : '.....'}".
    I live in "${tutor.Country}", time zone "${tutor.GMT}". I can teach students within
    "${convertGMTOffsetToLocalString(tutor.GMT)}" time zones. Click here to view my profile for my work experience, certificates, and Diploma.
    There you can look at my calendar-scheduling for availability, and book your lesson.`)
    }, [subject, tutor, education])
    const handleClickPill = (grade) => {
        const gradeExist = grades.find(item => item === grade)
        if (gradeExist) {
            return setGrades(grades.filter(item => item !== grade))
        }
        return setGrades([...grades, grade])
    }
    if (fetching || !tutor.AcademyId)
        return <Loading />
    if (!education.EducationalLevel)
        return <div className="text-danger fs-5ٖ">please fill education tab to generate Add's</div>
    return (
        <div style={{ height: "73vh", overflowY: "auto" }}>
            <div className="container mt-4">
                <div className="d-flex justify-content-between">
                    <div className="form-switch form-check w-25" style={{ marginBottom: "-10px" }}>
                        <input className="form-check-input"
                            type="checkbox"
                            role="switch" />
                        <label htmlFor="reportAd"><b>Repeat This Ad</b></label>
                    </div>

                    <div className="highlight w-75" >

                        This is the place that you can publish your private ad for all students to watch.
                        You need to select one subject to promote. The ad will appear for 7 days.
                        then you can renew it as needed.
                    </div>

                </div>

                <div className="rounded border shadow p-2">
                    <div className=" d-flex w-100 justify-content-center flex-column align-items-center mb-4">
                        <label htmlFor="" className="fs-3 w-50 text-center">Ad's Header</label>
                        <input className="form-control w-50 shadow" type="text"
                            placeholder="Type here a catchy message promoting your ad" value={header} onChange={(e) => setHeader(e.target.value)} />
                    </div>
                    <div className="d-flex flex-wrap justify-content-between">



                        <div style={{ width: "100%" }}
                            className=" mb-2 d-flex flex-column justify-content-start border p-2">
                            {/* {!!grades.length && <div className="rounded border d-flex w-100 m-2 ">
                                {grades.map(grade =>
                                    <div className="" style={{ width: "auto" }} onClick={() => handleClickPill(grade)}>
                                        <Pill label={grade}
                                            hasIcon={true} icon={<RxCross2 />}
                                            color="danger"
                                        />
                                    </div>)}
                            </div>} */}
                            <label htmlFor="">Tutor Teaching Grade</label>
                            <div className="w-100 d-flex justify-content-between">

                                <div className="d-flex  " style={{ width: "100%", overflowX: "auto", overflowY: "hidden" }}>
                                    {
                                        JSON.parse(tutor.Grades ?? '[]').map(grade =>
                                            <div style={{ width: "115px", margin: "2px" }} onClick={() => handleClickPill(grade)}>
                                                <Pill
                                                    label={grade}
                                                    hasIcon={true} icon={grades.find(item => item === grade) ? <RxCross2 /> : <GoPlus />}
                                                    color={grades.find(item => item === grade) ? "success" : "primary"} />
                                            </div>)
                                    }
                                </div>
                                {/* <div>
                                    <label htmlFor="">Grade</label>
                                    <div className="d-flex align-items-center">

                                        <input type="text" placeholder="type grade" className="form-control m-0"
                                            onChange={handleGrade} />
                                        <Button className="btn-sm btn-success"
                                            value={grade}
                                            handleClick={() => {
                                                if (grade.length > 2 && grade.length < 16) {
                                                    setGrades([...grades, grade]);
                                                    setGrade('')
                                                }
                                                else {
                                                    toast.warning('Minimum 3 and maximum 15 letters are accpetable to give Grade in Add!')
                                                }
                                            }}>ADD</Button>
                                    </div>

                                </div> */}
                            </div>
                        </div>

                        <div style={{ width: "50%" }} className="d-flex flex-column justify-content-start border p-2">
                            <label htmlFor="">Tutor Languages</label>
                            <div className="d-flex " style={{ width: "99%", overflowX: "auto", overflowY: "hidden" }}>
                                <div style={{ width: "100px", margin: "2px" }}>
                                    <Pill label={JSON.parse(education.NativeLang).value} hasIcon={false} color="success" />
                                </div>
                                {
                                    JSON.parse(education.NativeLangOtherLang).map(lang =>
                                        <div style={{ width: "100px", margin: "2px" }}>
                                            <Pill label={lang.value} hasIcon={false} />
                                        </div>)
                                }
                            </div>

                        </div>

                        <div style={{ width: "300px" }} className="d-flex flex-column justify-content-start ">
                            <label htmlFor="">Subject</label>
                            <select className="form-select" onChange={(e) => setSubject(e.target.value)} value={subject}>
                                <option value={''} disabled>Subject</option>

                                {subjects.map((item, index) =>
                                    <option key={index} value={item.subject}>{item.subject}</option>
                                )}
                            </select>
                        </div>

                        <div style={{ width: "300px" }} className="d-flex flex-column justify-content-start ">
                            <label htmlFor="">Educational Level</label>
                            <input type="text" className="form-control" value={education.EducationalLevel} />
                        </div>

                        <div style={{ width: "300px" }} className="d-flex flex-column justify-content-start ">
                            <label htmlFor="">Teaching Experience</label>
                            <input className="form-control" type="text" value={education.EducationalLevelExperience} />
                        </div>

                        <div style={{ width: "300px" }} className="d-flex flex-column justify-content-start ">
                            <label htmlFor="">Tutor's Certificate</label>
                            <input className="form-control" type="text" value={education.Certificate} />
                        </div>

                        <div style={{ width: "300px" }} className="d-flex flex-column justify-content-start ">
                            <label htmlFor="">Country</label>

                            <input className="form-control"
                                value={tutor.Country} />
                        </div>

                        <div style={{ width: "300px" }} className="d-flex flex-column justify-content-start ">
                            <label htmlFor="">UTC (time zone)</label>

                            <input className="form-control" value={convertGMTOffsetToLocalString(tutor.GMT)}
                            />

                        </div>

                        <div style={{ width: "300px" }} className="d-flex flex-column justify-content-start ">
                            <label htmlFor="">GMT</label>

                            <input className="form-control"
                                value={tutor.GMT}
                            />

                        </div>
                    </div>
                </div>


                <RichTextEditor className="border rounded shadow-lg w-100 p-4 fs-5 mt-2" height={"150px"} value={addText} onChange={(value) => setAddText(value)} placeholder={''} />

                <div >

                    <div className="mt-4">
                        <Button className="btn-sm btn-danger">Delete</Button>
                        <Button className="btn-sm btn-warning">View</Button>
                        <Button className="btn-sm btn-success">Save</Button>
                    </div>
                </div>

            </div>
        </div >
    );
}

export default Ads;