import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import { FaTimesCircle } from 'react-icons/fa';

import { get_certificates, get_degree, get_experience, get_level, get_my_edu, get_state, upload_form_two } from '../../axios/tutor';
import career from '../../images/career.png';
import Select, { components } from 'react-select'
import Actions from '../common/Actions';
import { FaRegTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const languages = [
    'Afrikaans',
    'Albanian',
    'Arabic',
    'Armenian',
    'Basque',
    'Bengali',
    'Bulgarian',
    'Catalan',
    'Cambodian',
    'Chinese (Mandarin)',
    'Croatian',
    'Czech',
    'Danish',
    'Dutch',
    'English',
    'Estonian',
    'Fiji',
    'Finnish',
    'French',
    'Georgian',
    'German',
    'Greek',
    'Gujarati',
    'Hebrew',
    'Hindi',
    'Hungarian',
    'Icelandic',
    'Indonesian',
    'Irish',
    'Italian',
    'Japanese',
    'Javanese',
    'Korean',
    'Latin',
    'Latvian',
    'Lithuanian',
    'Macedonian',
    'Malay',
    'Malayalam',
    'Maltese',
    'Maori',
    'Marathi',
    'Mongolian',
    'Nepali',
    'Norwegian',
    'Persian',
    'Polish',
    'Portuguese',
    'Punjabi',
    'Quechua',
    'Romanian',
    'Russian',
    'Samoan',
    'Serbian',
    'Slovak',
    'Slovenian',
    'Spanish',
    'Swahili',
    'Swedish',
    'Tamil',
    'Tatar',
    'Telugu',
    'Thai',
    'Tibetan',
    'Tonga',
    'Turkish',
    'Ukrainian',
    'Urdu',
    'Uzbek',
    'Vietnamese',
    'Welsh',
    'Xhosa',
];

const languageOptions = languages.map((language) => ({
    value: language,
    label: language,
}));

const Education = () => {

    function getToday() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    function handleDateChange(e) {
        const selectedValue = e.target.value;
        set_expiration(selectedValue);
    }
    function handleBlur() {
        if (expiration < getToday()) {
            set_expiration(getToday());
        }
    }

    useEffect(() => {
        let next = document.querySelector('.tutor-next')

        if (next && next.hasAttribute('id')) {
            next.removeAttribute('id');
        }
    }, [])


    let [level, set_level] = useState([]);

    let [university1, set_university1] = useState([]);
    let [university2, set_university2] = useState([]);
    let [university3, set_university3] = useState([]);

    let [degree, set_degree] = useState([]);
    let [certificate, set_certificate] = useState([]);
    let [language, set_language] = useState([]);

    let [state2, set_state2] = useState([]);
    let [state3, set_state3] = useState([]);
    let [state4, set_state4] = useState([]);
    let [state5, set_state5] = useState([]);
    let [doctorateState, set_doctorateState] = useState([])

    let [experience, set_experience] = useState('');
    let [graduateYr1, set_graduateYr1] = useState('');
    let [graduateYr2, set_graduateYr2] = useState('');
    let [graduagteYr3, set_graduagteYr3] = useState('');
    let [doctorateGraduateYear, setDoctorateGraduateYear] = useState('')

    let [expiration, set_expiration] = useState('');
    let [othelang, set_othelang] = useState([]);
    let [workExperience, set_workExperience] = useState('');

    let [exp, set_exp] = useState();
    let [stateList, setStateList] = useState([]);
    let [level_list, set_level_list] = useState('')
    let [degree_list, set_degree_list] = useState('')
    let [certificate_list, set_certificate_list] = useState('')
    let [d_list, set_d_list] = useState([])

    let [data, set_data] = useState(false);
    let [files, set_files] = useState('');

    const [degreeFile, setDegreeFile] = useState(null);
    const [degreeFileContent, setDegreeFileContent] = useState('')
    const [certificateFile, setCertificateFile] = useState(null);
    const [certFileContent, setCertFileContent] = useState('')
    const [dataFetched, setDataFetched] = useState(false)
    let [db_edu_level, set_db_edu_level] = useState('');
    let [db_edu_cert, set_db_edu_cert] = useState('');
    useEffect(() => {

        if (dataFetched && db_edu_level !== level) {
            setDegreeFile(null)
            setDegreeFileContent(null)
        }
        if (dataFetched && db_edu_cert !== certificate) {
            setCertificateFile(null)
            setCertFileContent(null)
        }
    }, [level, certificate])

    const handleLanguageChange = (selectedOption) => {
        set_othelang(selectedOption);
    }

    useEffect(() => {
        const currentYear = (new Date()).getFullYear();
        const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step));
        let d = range(currentYear, currentYear - 50, -1)
        let list = d.map(item => <option value={item} >{item}</option>)
        list.unshift(<option value='' >Select Year</option>)

        set_d_list(d)
    }, [])


    let user_id = window.localStorage.getItem('tutor_user_id');

    let saver = () => {
        let response = upload_form_two(level,
            university1,
            university2,
            university3,
            degree,
            degreeFileContent,
            certificate,
            certFileContent,
            JSON.stringify(language),
            state2,
            state3,
            state4,
            state5,
            [],
            doctorateState,
            experience,
            graduateYr1,
            graduateYr2,
            graduagteYr3,
            doctorateGraduateYear,
            expiration,
            JSON.stringify(othelang),
            workExperience,
            user_id)
        return response;
    }

    useEffect(() => {
        get_my_edu(window.localStorage.getItem('tutor_user_id'))
            .then((result) => {

                if (result.length > 0) {
                    let data = result[0];
                    set_files(data)
                    set_workExperience(data.WorkExperience)
                    set_university1(data.College1)
                    set_university2(data.College2)
                    set_university3(data.DoctorateCollege)

                    set_language(JSON.parse(data.NativeLang))
                    set_othelang(JSON.parse(data.NativeLangOtherLang))

                    set_graduateYr1(data.College1Year)
                    set_graduateYr2(data.College2StateYear)
                    set_graduagteYr3(data.DegreeYear)

                    set_state2(data.College1State)
                    set_state3(data.College2State)
                    set_state4(data.DegreeState)
                    set_state5(data.CertificateState)
                    set_doctorateState(data.DoctorateState)

                    setDoctorateGraduateYear(data.DoctorateGradYr)

                    set_doctorateState(data.DoctorateState)

                    set_degree(data.Degree)
                    set_certificate(data.Certificate)
                    set_db_edu_cert(data.Certificate)

                    setDegreeFileContent(data.DegreeFile)
                    setCertFileContent(data.CertificateFile)

                    set_level(data.EducationalLevel)
                    set_db_edu_level(data.EducationalLevel)

                    set_expiration(data.CertificateExpiration)
                    set_experience(data.EducationalLevelExperience)
                    setDataFetched(true)
                } else {
                    set_files(null)
                }

            })
            .catch((err) => {

            })
            .finally(() => {

                set_data(true)
            })
    }, [])

    useEffect(() => {

        get_experience()
            .then((data) => {
                let list = data.recordset.map((item) =>
                    <option key={item.TutorExperience} selected={item.TutorExperience === experience ? 'selected' : ''} className={item.TutorExperience} style={{ height: '80px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0' }} value={item.TutorExperience}>{item.TutorExperience}</option>
                );
                let head = <option key='null' style={{ height: '50px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0' }} value=''>TutorExperience</option>

                list.unshift(head);
                set_exp(list)

            })
            .catch((err) => {
                console.log(err)
            })

        get_state()
            .then(({ recordset }) => {
                let data = recordset.map(item => item.State);
                setStateList(data);

            })
            .catch((err) => {
                console.log(err)
            })

        get_degree()
            .then((data) => {
                let list = data.recordset.map((item) =>
                    <option key={item.Degree} selected={item.Degree === degree ? 'selected' : ''}
                        className={item.Degree} style={{
                            height: '80px', width: '100%', outline: 'none', padding: '0 10px 0 10px',
                            borderRadius: '0'
                        }} value={item.Degree}>{item.Degree}</option>
                );
                let head = <option key='null' style={{
                    height: '50px', width: '100%', outline: 'none', padding: '0 10px 0 10px',
                    borderRadius: '0'
                }} value=''>Degree</option>

                list.unshift(head);
                set_degree_list(list)

            })
            .catch((err) => {
                console.log(err)
            })

        get_level()
            .then((data) => {
                let list = data.recordset.map((item) =>
                    <option key={item.Level} className={item.Level} style={{ height: '80px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0' }} selected={item.Level === level ? 'selected' : ''} value={item.Level}>{item.Level}</option>
                );
                set_level_list(list)

            })
            .catch((err) => {
                console.log(err)
            })

        get_certificates()
            .then((data) => {
                let list = data.recordset.map((item) =>
                    <option key={item.CertificateType} className={item.CertificateType} style={{ height: '80px', width: '100%', outline: 'none', padding: '0 5x 0 5x', borderRadius: '0' }} selected={item.CertificateType === certificate ? 'selected' : ''} value={item.CertificateType}>{item.CertificateType}</option>
                );
                set_certificate_list(list)

            })
            .catch((err) => {
                console.log(err)
            })
    }, [data])

    let edu_level = e => {
        set_level(e.target.value)
    }


    let certified = e => {
        set_certificate(e.target.value)
    }
    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result
                setDegreeFileContent(base64);
            };
            reader.readAsDataURL(file);
            setDegreeFile(file);
        }
    }

    const handleCertUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result
                setCertFileContent(base64);
            };
            reader.readAsDataURL(file);
            setCertificateFile(file);
        }
    }

    const handleSave = async (e) => {
        e.preventDefault();
        let res = await saver()
        if (res) {
            toast.success('Education record saved Successfully')
        }
        else {
            toast.success('Failed to save Record Successfully')
        }
    }
    return (
        <>
            <div className='tutor-popin'></div>
            <div className='save-overlay'>
                <span className='save-loader'></span>
            </div>
            <div className="container tutor-tab-education">
                <form action="" onSubmit={handleSave}>
                    <div className="tutor-tab-education-info pt-4">
                        <h3>Education</h3>
                        <h6 className="tutor-tab-education-notice highlight">
                            Tutor does not have to be an academy graduate in order to lecture his knowledge. However, when you select your academic background, you must upload your diploma and/or Certificate(s). You have 7 days to do that. Until your credentials are uploaded, "X" icon is being shown near the appropriate field. When your documents are uploaded, the "X" icon is changed to a green "Verified" logo. The student or parents can see your status when making their decision of selecting you.
                        </h6>

                        <div className="d-flex justify-content-between row">
                            <div className="col-md-4">
                                <label htmlFor="level">Education Level:</label>
                                <select
                                    id="level"
                                    className="form-control m-0"
                                    onChange={edu_level}
                                    value={level}
                                    required
                                >
                                    <option value="" disabled>Select Education</option>
                                    {level_list}
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label htmlFor="experience">Experience:</label>
                                <select
                                    id="experience"
                                    className="form-control m-0"
                                    onChange={(e) => set_experience(e.target.value)}
                                    value={experience}
                                    required
                                >
                                    {exp}
                                </select>
                            </div>
                        </div>

                        {level !== 'No Academic Education' && level.length ? (
                            <>
                                <div className="row mt-3">
                                    <div className="col-md-4">
                                        <label htmlFor="university1">Bachelor Degree:</label>
                                        <input
                                            type="text"
                                            id="university1"
                                            className="form-control m-0"
                                            value={university1}
                                            onChange={(e) => set_university1(e.target.value)}
                                            placeholder="College/University 1"
                                            required
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <label htmlFor="state1">Select State:</label>
                                        <select
                                            id="state1"
                                            className="form-control m-0 w-100"
                                            onChange={(e) => set_state2(e.target.value)}
                                            value={state2}
                                            required
                                        >
                                            <option value="">Select State</option>
                                            {stateList.map((item) => (
                                                <option key={item} value={item}>
                                                    {item}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-4">
                                        <label htmlFor="yr1">Graduation Year:</label>
                                        <select
                                            id="yr1"
                                            className="form-control m-0 w-100"
                                            onChange={(e) => set_graduateYr1(e.target.value)}
                                            value={graduateYr1}
                                            required
                                        >
                                            <option value="">Select Year</option>
                                            {d_list.map((item) => (
                                                <option key={item} value={item}>
                                                    {item}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                {
                                    level !== 'Bachelor Degree' && level !== 'Undergraduate Student' ? (
                                        < div className="row mt-3">
                                            <div className="col-md-4">
                                                <label htmlFor="university2">Master Degree:</label>
                                                <input
                                                    type="text"
                                                    id="university2"
                                                    className="form-control m-0"
                                                    value={university2}
                                                    onChange={(e) => set_university2(e.target.value)}
                                                    placeholder="College/University 2"
                                                    required
                                                />
                                            </div>

                                            <div className="col-md-4">
                                                <label htmlFor="state3">Select State:</label>
                                                <select
                                                    id="state3"
                                                    className="form-control m-0 w-100"
                                                    onChange={(e) => set_state3(e.target.value)}
                                                    value={state3}
                                                    required
                                                >
                                                    <option value="">Select State</option>
                                                    {stateList.map((item) => (
                                                        <option key={item} value={item}>
                                                            {item}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="col-md-4">
                                                <label htmlFor="yr2">Graduation Year:</label>
                                                <select
                                                    id="yr2"
                                                    className="form-control m-0 w-100"
                                                    onChange={(e) => set_graduateYr2(e.target.value)}
                                                    value={graduateYr2}
                                                    required
                                                >
                                                    <option value="">Select Year</option>
                                                    {d_list.map((item) => (
                                                        <option key={item} value={item}>
                                                            {item}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    ) : null
                                }
                                {
                                    level !== 'Undergraduate Student' && level !== 'Bachelor Degree' &&
                                        level !== 'Master Degree' ? (
                                        <div className="row mt-3">
                                            <div className="col-md-4">
                                                <label htmlFor="university2">Doctorate Degree:</label>
                                                <input
                                                    type="text"
                                                    id="university2"
                                                    className="form-control m-0"
                                                    value={university3}
                                                    onChange={(e) => set_university3(e.target.value)}
                                                    placeholder="College/University 3"
                                                    required
                                                />
                                            </div>

                                            <div className="col-md-4">
                                                <label htmlFor="state3">Select State:</label>
                                                <select
                                                    id="state3"
                                                    className="form-control m-0 w-100"
                                                    onChange={(e) => set_doctorateState(e.target.value)}
                                                    value={doctorateState}
                                                    required
                                                >
                                                    <option value="">Select State</option>
                                                    {stateList.map((item) => (
                                                        <option key={item} value={item}>
                                                            {item}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="col-md-4">
                                                <label htmlFor="yr2">Graduation Year:</label>
                                                <select
                                                    id="yr2"
                                                    className="form-control m-0 w-100"
                                                    onChange={(e) => setDoctorateGraduateYear(e.target.value)}
                                                    value={doctorateGraduateYear}
                                                    required
                                                >
                                                    <option value="">Select Year</option>
                                                    {d_list.map((item) => (
                                                        <option key={item} value={item}>
                                                            {item}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    ) : null
                                }

                                <div className="row mt-3">
                                    <div className="col-md-4">
                                        <label htmlFor="degree">Upload Highest Degree:</label>
                                        <div className='d-flex align-items-center'>

                                            <div className="form-outline">
                                                <input
                                                    type="file"
                                                    accept=".pdf, .jpeg, .png, .jpg, .doc"
                                                    id="degreeFile"
                                                    name="degreeFile"
                                                    className="form-control m-0"
                                                    onChange={handleFileUpload}
                                                    required
                                                />
                                            </div>
                                            {(degreeFileContent && degreeFileContent.length) ? (
                                                <div className="tick-icon"><IoIosCheckmarkCircle size={20} color='green' /></div>
                                            ) : (
                                                <div className="cross-icon"><FaRegTimesCircle size={20} color='red' /></div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <label htmlFor="state4">Select State:</label>
                                        <select
                                            id="state4"
                                            className="form-control m-0 w-100"
                                            onChange={(e) => set_state4(e.target.value)}
                                            value={state4}
                                            required
                                        >
                                            <option value="">Select State</option>
                                            {stateList.map((item) => (
                                                <option
                                                    key={item}
                                                    value={item}
                                                    selected={item === files?.DegreeState}
                                                >
                                                    {item}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-4">
                                        <label htmlFor="yr3">Graduation Year:</label>
                                        <select
                                            id="yr3"
                                            className="form-control m-0 w-100"
                                            onChange={(e) => set_graduagteYr3(e.target.value)}
                                            value={graduagteYr3}
                                            required
                                        >
                                            <option value="">Select Year</option>
                                            {d_list.map((item) => (
                                                <option
                                                    key={item}
                                                    value={item}
                                                    selected={item === files?.DegreeYear}
                                                >
                                                    {item}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </>
                        ) : null}

                        <div className="row mt-3 align-items-end">
                            <div className="col-md-4">
                                <label htmlFor="certificate">Upload Certificate:</label>
                                <select
                                    id="certificate"
                                    name="certificate"
                                    className="form-control m-0"
                                    onChange={certified}
                                    placeholder='Select Certificate'
                                    required
                                >
                                    <option value="" disabled>Select Certificate</option>
                                    {certificate_list}
                                </select>
                                {(certificate.length && certificate !== 'Not Certified') ? (
                                    <div className='d-flex justify-content-center align-items-center'>
                                        <div className="form-outline">
                                            <input
                                                type="file"
                                                accept=".pdf, .jpeg, .png, .jpg, .doc"
                                                id="certificateFile"
                                                name="certificateFile"
                                                className="form-control m-0 mr-2"
                                                onChange={handleCertUpload}
                                                required
                                            />
                                        </div>
                                        {(certFileContent?.length) ? (
                                            <div className="tick-icon"><IoIosCheckmarkCircle size={20} color='green' /></div>
                                        ) : (
                                            <div className="cross-icon"><FaRegTimesCircle size={20} color='red' /></div>
                                        )}
                                    </div>
                                ) : null}
                            </div>
                            {(certificate.length && certificate !== 'Not Certified') ? (
                                <>
                                    <div className="col-md-4">
                                        <label htmlFor="state5">Select State:</label>
                                        <select
                                            id="state5"
                                            className="form-control m-0 w-100"
                                            onChange={(e) => set_state5(e.target.value)}
                                            required
                                        >
                                            <option value="">Select State</option>
                                            {stateList.map((item) => (
                                                <option
                                                    key={item}
                                                    value={item}
                                                    selected={item === files?.CertificateState}
                                                >
                                                    {item}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="expiration">Expiration:</label>
                                        <input
                                            type="date"
                                            min={new Date().toISOString().split('T')[0]}
                                            id="expiration"
                                            className="form-control m-0"
                                            value={expiration}
                                            onBlur={handleBlur}
                                            onChange={handleDateChange}
                                            placeholder="Expiration"
                                        />
                                    </div>
                                </>
                            ) : null}
                        </div>

                        <div className="row mt-3 justify-content-between">
                            <div className="col-md-4">
                                <label htmlFor="language">Select Native (Primary) Language:</label>
                                <Select
                                    isMulti={false}
                                    placeholder="Select Native Languages"
                                    className="language-selector w-100"
                                    id="native-language"
                                    onChange={(selectedOption) => set_language(selectedOption)}
                                    defaultValue={language}
                                    value={language}
                                    options={languageOptions}
                                    required
                                />
                            </div>

                            <div className="col-md-4">
                                <label htmlFor="other-languages">Select Secondary language(s):</label>
                                <Select
                                    isMulti
                                    placeholder="Select other language(s)"
                                    className="language-selector w-100"
                                    id="other-languages"
                                    value={othelang}
                                    onChange={handleLanguageChange}
                                    options={languageOptions}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="tutor-tab-education-experience">
                        <div className="education-work-experience-logo">
                            <img
                                src={career}
                                style={{ height: '85%', width: '200px', display: 'block', margin: 'auto', padding: '30px' }}
                                alt=""
                            />
                            <label htmlFor=""><h6 style={{ textAlign: 'center' }}>Work Experience</h6></label>
                        </div>

                        <textarea
                            value={workExperience}
                            onChange={(e) => set_workExperience(e.target.value)}
                            style={{ height: '400px' }}
                            placeholder="Enter Your Work Experience"
                            className="tutor-tab-education-experience-details"
                            required
                        ></textarea>
                    </div>

                    <Actions />
                </form>
            </div >
        </>

    );
}

export default Education;