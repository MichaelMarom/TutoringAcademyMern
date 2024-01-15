import React, { useEffect, useState } from 'react'
import TutorLayout from '../../../layouts/TutorLayout'
import Tabs from '../../../components/common/Tabs'
import Ads from '../../../components/student/Ads'
import List from '../../../components/tutor/Ads/ListComponent'
import Classified from '../../../components/tutor/Ads/Classified'
import Layout from './Layout'
import UserRichTextEditor from '../../../components/common/RichTextEditor/UserRichTextEditor'
import Pill from '../../../components/common/Pill'
import { RxCross2 } from 'react-icons/rx'
import { GoPlus } from 'react-icons/go'
import { FaTrashCan } from 'react-icons/fa6'
import { FaEye, FaUpload } from 'react-icons/fa'
import { fetch_ad, get_tutor_market_data, put_ad } from '../../../axios/tutor'
import { useParams } from 'react-router-dom'
import Loading from '../../../components/common/Loading'
import Actions from '../../../components/common/Actions'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'

const Edit = () => {
    const { tutor } = useSelector(state => state.tutor);
    const params = useParams();
    let [education, set_education] = useState({})
    const [subjects, set_subjects] = useState([])
    const [fetching, setFetching] = useState(false);
    const [subject, setSubject] = useState('');
    const [grades, setGrades] = useState([])
    const [header, setHeader] = useState('');
    const AcademyId = localStorage.getItem('tutor_user_id');

    const [addText, setAddText] = useState(``)

    useEffect(() => {
        if (params.id) {
            fetch_ad(params.id)
                .then((result) => {
                    console.log(result)
                    setGrades(JSON.parse(result.Grades))
                    setSubject(result.Subject)
                    setHeader(result.AdHeader)
                    setAddText(result.AdText)
                })
                .catch(err => console.log(err))

            get_tutor_market_data(window.localStorage.getItem('tutor_user_id'))
                .then((result) => {

                    let { Subjects, Education } = result
                    set_subjects(Subjects)
                    set_education(Education[0])
                })
                .catch(err => console.log(err))
        }
    }, [params])

    const handleClickPill = (grade) => {
        const gradeExist = grades.find(item => item === grade)
        if (gradeExist) {
            return setGrades(grades.filter(item => item !== grade))
        }
        return setGrades([...grades, grade])
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!grades.length) return toast.warning('Please select atleast one grade!')
        params.id && await put_ad(params.id, {
            AcademyId,
            AdText: addText,
            AdHeader: header,
            Subject: subject,
            Certificate: education.Certificate,
            Experience: education.EducationalLevelExperience,
            GMT: tutor.GMT,
            Country: tutor.Country,
            EducationalLevel: education.EducationalLevel,
            Languages: education.NativeLang,
            Grades: grades
        })
        toast.success('Data Saved Successfully');
    }

    if (fetching || !tutor.AcademyId || !education?.EducationalLevel?.length)
        return <Loading />
    return (
        <Layout>
            <div style={{ height: "78vh", overflowY: "auto" }}>
                <form onSubmit={handleUpdate}>
                    <div className="container mt-4">
                        <div className="d-flex justify-content-between">
                            <div className="form-switch form-check w-25" style={{ marginBottom: "-10px" }}>
                                <input className="form-check-input"
                                    type="checkbox"
                                    role="switch" />
                                <label htmlFor="reportAd"><b>Publish This Ad</b></label>
                            </div>
                            <div className="highlight w-75" >
                                This is the place where you can promote yourself by publishing your private ad for all students to watch. If you tutor multi subjects, you can select one subject at the time by changing the header.
                            </div>

                        </div>

                        <div className="rounded border shadow p-2">
                            <div className=" d-flex w-100 justify-content-start align-items-center mb-4"
                                style={{ gap: "10px" }}>
                                <div className="w-75 d-flex align-items-center" style={{ gap: "10px" }}>
                                    <label htmlFor="" className="fs-3  ">Ad's Header</label>
                                    <input
                                        className="form-control w-50 shadow m-0"
                                        type="text"
                                        placeholder="Type here a catchy message promoting your subject"
                                        required
                                        value={header}
                                        onChange={(e) => setHeader(e.target.value)} />
                                </div>
                                <div className="d-flex align-items-center w-25 justify-content-end" style={{ gap: "20px" }}>
                                    <div className="click-effect-elem rounded-circle p-3 " style={{ cursor: "pointer", background: "lightGray" }}>
                                        <FaTrashCan size={25} />
                                    </div>
                                    <div className="click-effect-elem  rounded-circle p-3 " style={{ cursor: "pointer", background: "lightGray" }}>
                                        <FaUpload size={25} />
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex flex-wrap justify-content-start" style={{ gap: "10px" }}>

                                <div style={{ width: "100%" }}
                                    className=" mb-2 d-flex flex-column justify-content-start border p-2">
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
                                    <select className="form-select"
                                        required
                                        onChange={(e) => setSubject(e.target.value)}
                                        value={subject}>
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

                                {!!education.Certificate.length && <div style={{ width: "300px" }} className="d-flex flex-column justify-content-start ">
                                    <label htmlFor="">Tutor's Certificate</label>
                                    <input className="form-control" type="text" value={education.Certificate} />
                                </div>}

                                <div style={{ width: "300px" }} className="d-flex flex-column justify-content-start ">
                                    <label htmlFor="">Country</label>

                                    <input className="form-control"
                                        value={tutor.Country} />
                                </div>

                                <div style={{ width: "300px" }}
                                    className="d-flex flex-column justify-content-start ">
                                    <label htmlFor="">GMT</label>

                                    <input className="form-control"
                                        value={tutor.GMT}
                                    />

                                </div>
                            </div>
                        </div>

                        <div className="p-4 border rounded  shadow-lg my-4">
                            <div className="highlight">
                                Ad's text here
                            </div>
                            <UserRichTextEditor
                                required
                                className="w-100  fs-5 mb-4 "
                                height={"200px"} value={addText}
                                onChange={(value) => setAddText(value)}
                                placeholder={'Write You\'r Add here '} />
                        </div>
                    </div>

                    <Actions />
                </form>
            </div >

        </Layout>
    )
}

export default Edit