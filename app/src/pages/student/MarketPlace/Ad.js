import { useEffect, useState } from "react";
import { get_student_market_data } from "../../../axios/student";
import Layout from "./Layout";
import { useSelector } from "react-redux";
import UserRichTextEditor from "../../../components/common/RichTextEditor/UserRichTextEditor";
import { CERTIFICATES, EXPERIENCE, GMT, LEVEL, languages } from "../../../constants/constants";
import ReactSelect from "react-select";

const Ads = () => {
    const { student } = useSelector(state => state.student)
    const [header, setHeader] = useState('')
    const [errors, setErrors] = useState({})
    const [adText, setAdText] = useState('')
    const [subjects, setSubjects] = useState([])
    const [subject, setSubject] = useState('')
    const [faculties, setFaculties] = useState([])
    const [level, setLevel] = useState('')
    const [experience, setExperience] = useState('')
    const [language, setLanguage] = useState([])
    const [timeZone, setTimezone] = useState('')
    const [certificate, setCertificate] = useState('')

    let [activeFaculty, setActiveFaculty] = useState('')
    const languageOptions = languages.map((language) => ({
        value: language,
        label: language,
    }));

    useEffect(() => {
        console.log(activeFaculty)

        // let list = subject.filter(item => item.FacultyId == activeFaculty)

        // set_subject_list(list)
    }, [activeFaculty])

    useEffect(() => {
        if (student.AcademyId) {
            get_student_market_data(student.AcademyId)
                .then(({ StudentData, EducationalLevel, Exprience, CertificateTypes, Subjects, Faculty, GMT }) => {
                    setSubject(Subjects)
                })
                .catch(err => console.log(err))
        }
    }, [student])

    console.log(student)
    return (
        <Layout>
            <div className="" style={{ height: "70vh", overflowY: "auto" }}>
                <div className="container">
                    <div className=" d-flex justify-content-center align-items-end mb-2"
                        style={{ width: "90%", gap: '3%' }}>
                        <label className="fs-3 ">Ad's Header</label>
                        <input
                            className="form-control  shadow m-0"
                            style={{ width: "60%", }}
                            type="text"
                            required
                            placeholder="Type here a catchy message to attract tutors"
                            value={header}
                            onChange={(e) => {
                                if (e.target.value.length < 121) {
                                    delete errors.header;
                                    setErrors(errors)
                                    return setHeader(e.target.value)
                                }
                                setErrors({ ...errors, header: "Max Limit 120 characters" })
                            }} />
                        {errors.header && <p className="text-sm text-danger m-0">{errors.header} </p>}
                    </div>
                    <div className="d-flex justify-content-center" style={{ gap: "2%" }}>
                        <div className="border p-2 shadow " style={{ width: "40%" }} >
                            <div className="d-flex justify-content-between align-items-start m-1"
                                style={{ width: "90%" }}>
                                <label className="">Grade</label>
                                <input disabled={false}
                                    className="form-control  shadow m-0"
                                    style={{ maxWidth: "300px" }}
                                    type="text"
                                    required
                                    value={student.Grade}
                                />
                            </div>
                            <div className="d-flex justify-content-between align-items-start m-1"
                                style={{ width: "90%" }}>
                                <label className="">Country</label>
                                <input disabled={false}
                                    className="form-control  shadow m-0"
                                    style={{ maxWidth: "300px" }}
                                    type="text"
                                    required
                                    value={student.Country}
                                />
                            </div>
                            <div className="d-flex justify-content-between align-items-start m-1"
                                style={{ width: "90%" }}>
                                <label className="">GMT</label>
                                <input disabled={false}
                                    className="form-control  shadow m-0"
                                    style={{ maxWidth: "300px" }}
                                    type="text"
                                    required
                                    value={student.GMT} />
                            </div>
                            <div className=" d-flex justify-content-between align-items-start m-1"
                                style={{ width: "90%" }}>
                                <label className="">Language</label>
                                <input disabled={false}
                                    className="form-control  shadow m-0"
                                    style={{ maxWidth: "300px" }}
                                    type="text"
                                    required
                                    value={student.Language}
                                />
                            </div>
                            <div className="d-flex justify-content-between align-items-start m-1"
                                style={{ width: "90%" }}>
                                <label className="">Faculty</label>
                                <select className="form-select" style={{ maxWidth: "300px" }}
                                    required
                                    onChange={(e) => setSubject(e.target.value)}
                                    value={subject}>
                                    <option value={''} disabled>Select</option>

                                    {subjects.map((item, index) =>
                                        <option key={index} value={item.subject}>{item.subject}</option>
                                    )}
                                </select>
                                {errors.header && <p className="text-sm text-danger m-0">{errors.header} </p>}
                            </div>
                            <div className=" d-flex justify-content-between  align-items-start m-1"
                                style={{ width: "90%" }}>
                                <label className="">Subject</label>
                                <select className="form-select" style={{ maxWidth: "300px" }}
                                    required
                                    onChange={(e) => setSubject(e.target.value)}
                                    value={subject}>
                                    <option value={''} disabled>Select</option>

                                    {subjects.map((item, index) =>
                                        <option key={index} value={item.subject}>{item.subject}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                        <div className="border p-2 shadow " style={{ width: "40%" }}>
                            <h4>Tutor Requirments</h4>
                            <div className="d-flex justify-content-between align-items-start m-1"
                                style={{ width: "90%" }}>
                                <label className="">Education Level</label>
                                <select className="form-select" style={{ maxWidth: "300px" }}
                                    required
                                    onChange={(e) => setLevel(e.target.value)}
                                    value={level}>
                                    <option value={''} disabled>Select</option>

                                    {LEVEL.map((item, index) =>
                                        <option key={index} value={item}>{item}</option>
                                    )}
                                    <option value={'any'} >Any</option>

                                </select>
                            </div>
                            <div className="d-flex justify-content-between align-items-start m-1"
                                style={{ width: "90%" }}>
                                <label className="">Experience</label>
                                <select className="form-select" style={{ maxWidth: "300px" }}
                                    required
                                    onChange={(e) => setExperience(e.target.value)}
                                    value={experience}>
                                    <option value={''} disabled>Select</option>

                                    {EXPERIENCE.map((item, index) =>
                                        <option key={index} value={item}>{item}</option>
                                    )}
                                    <option value={'any'} >Any</option>

                                </select>
                            </div>
                            <div className="d-flex justify-content-between align-items-start m-1"
                                style={{ width: "90%" }}>
                                <label className="">Certificate</label>
                                <select className="form-select" style={{ maxWidth: "300px" }}
                                    required
                                    onChange={(e) => setCertificate(e.target.value)}
                                    value={certificate}>
                                    <option value={''} disabled>Select</option>

                                    {CERTIFICATES.map((item, index) =>
                                        <option key={index} value={item}>{item}</option>
                                    )}
                                    <option value={'any'} >Any</option>

                                </select>
                            </div>
                            <div className=" d-flex justify-content-between  align-items-start m-1"
                                style={{ width: "90%" }}>
                                <label className="">Language</label>
                                <div className="w-100" style={{ maxWidth: "300px" }}>
                                    <ReactSelect
                                        isMulti
                                        placeholder="Select other language(s)"
                                        className="language-selector w-100"
                                        id="other-languages"
                                        value={language}
                                        onChange={(selectedOption) => {
                                            setLanguage(selectedOption)
                                        }}
                                        options={languageOptions}
                                        isDisabled={false} />
                                </div>

                            </div>
                            <div className="d-flex justify-content-between align-items-start m-1"
                                style={{ width: "90%" }}>
                                <label className="">Timezone</label>
                                <select className="form-select" style={{ maxWidth: "300px" }}
                                    required
                                    onChange={(e) => setTimezone(e.target.value)}
                                    value={timeZone}>
                                    <option value={''} disabled>Select</option>

                                    {GMT.map((item, index) =>
                                        <option key={index} value={item.GMT}>{item.GMT}</option>
                                    )}
                                    <option value={'any'} >Any</option>

                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border rounded  shadow-lg my-4">
                        <div className="highlight">
                            The text below was generated generically by the computer. You can change the text to fit your personality. The ad will appear for 7 days for the selected subject. If you tutor multi subjects, you can publish a different ad for each subject.
                        </div>
                        <UserRichTextEditor
                            disabled={false}
                            readOnly={false}
                            required
                            className="w-100  fs-5 mb-4 "
                            height={"200px"} value={adText}
                            onChange={(value) => setAdText(value)}
                            placeholder={'Write You\'r Ad here '} />
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Ads;