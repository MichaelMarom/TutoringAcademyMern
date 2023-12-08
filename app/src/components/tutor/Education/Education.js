import { useEffect, useState } from 'react';
import { IoIosCheckmarkCircle } from 'react-icons/io';

import { get_certificates, get_degree, get_experience, get_level, get_my_edu, get_state, upload_form_two } from '../../../axios/tutor';
import career from '../../../images/career.png';
import Select from 'react-select'
import Actions from '../../common/Actions';
import { FaRegTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { upload_file } from '../../../axios/file';
import Loading from '../../common/Loading';
import { AUST_STATES, CAN_STATES, Countries, UK_STATES, US_STATES } from '../../../constants/constants'

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
            next?.removeAttribute('id');
        }
    }, [])


    let [level, set_level] = useState([]);

    let [university1, set_university1] = useState([]);
    let [university2, set_university2] = useState([]);
    let [university3, set_university3] = useState([]);

    let [degree, set_degree] = useState([]);
    let [certificate, set_certificate] = useState([]);
    let [language, set_language] = useState([]);

    const [countryForAssociate, setCountryForAssoc] = useState('');
    const [countryForCert, setCountryForCert] = useState('');
    const [countryForMast, setCountryForMast] = useState('');
    const [countryForDoc, setCountryForDoc] = useState('');
    const [countryForDeg, setCountryForDeg] = useState('')


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
    let [level_list, set_level_list] = useState('')
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
    const [fetchingEdu, setFetchingEdu] = useState(false);
    const options = {
        "Australia": AUST_STATES,
        "USA": US_STATES,
        "Canada": CAN_STATES,
        "UnitedKingdom": UK_STATES
    }

    useEffect(() => {

        if (dataFetched && db_edu_level !== level) {
            setDegreeFile(null)
            setDegreeFileContent(null)
        }
        if (dataFetched && db_edu_cert !== certificate) {
            setCertificateFile(null)
            setCertFileContent(null)
        }
        // eslint-disable-next-line
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
            user_id,
            countryForDeg,
            countryForMast,
            countryForCert,
            countryForDoc,
            countryForAssociate
        )
        return response;
    }

    useEffect(() => {
        setFetchingEdu(true)
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

                    setCountryForAssoc(data.BachCountry)
                    setCountryForCert(data.CertCountry)
                    setCountryForDeg(data.DegCountry)
                    setCountryForDoc(data.DocCountry)
                    setCountryForMast(data.MastCountry)
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
                console.log(err)
            })
            .finally(() => {
                setFetchingEdu(false)
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
                recordset.map(item => item.State);
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
    }, [data, certificate, degree, experience, level])

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

    const handleUploadDegreeToServer = async () => {
        if (degreeFile) {
            const formData = new FormData();
            formData.append('file', degreeFile);

            try {
                const filePrefix = `${user_id}-degree-${degree}`
                const response = await upload_file(formData, filePrefix)

                console.log(response.data);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        } else {
            console.warn('Please select a file before uploading.');
        }
    };
    const handleUploadCertificateToServer = async () => {
        if (certificateFile) {
            const formData = new FormData();
            formData.append('file', certificateFile);

            try {
                const filePrefix = `${user_id}-certificate-${certificate}`
                const response = await upload_file(formData, filePrefix)

                console.log(response.data.filePath);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        } else {
            console.warn('Please select a file before uploading.');
        }
    };

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
            handleUploadDegreeToServer()
            handleUploadCertificateToServer()
            toast.success('Education record saved Successfully')
        }
        else {
            toast.error('Failed to save Record')
        }
    }

    if (fetchingEdu)
        return <Loading loadingText='Fetching Tutor Eduction...' />
    return (
        <div style={{ height: "80vh", overflowY: "auto" }}>
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

                        <div className="d-flex  row border p-3 shadow ">
                            <h6 className='border-bottom'>Experience</h6>
                            <div className='d-flex justify-content-between'>

                                <div className="col-md-3">
                                    <label className="text-secondary" htmlFor="level">Education Level:</label>
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

                                <div className="col-md-3">
                                    <label className="text-secondary" htmlFor="experience">Experience:</label>
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
                        </div>

                        {level !== 'No Academic Education' && level.length ? (
                            <>
                                <div className="row mt-3 p-3 shadow  border shadow">
                                    <h6 className='border-bottom'>Bachlors Degree</h6>
                                    <div className='d-flex justify-content-between'>
                                        <div className="col-md-3">
                                            <label className="text-secondary" htmlFor="university1">{level === 'Associate Degree' ?
                                                'College Name' : 'Bachelor Degree Institute:'}</label>
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

                                        <div className="col-md-3">
                                            <div>
                                                <label className="text-secondary">Country for {`${level === 'Associate Degree' ?
                                                    "Associate degree" : "Bachlors"}`}</label>
                                                <select className='form-select'
                                                    onClick={(e) => setCountryForAssoc(e.target.value)}>
                                                    <option value={''} disabled selected>Select Country</option>
                                                    {Countries.map((option) =>
                                                        <option value={option.Country}

                                                            selected={option.Country === countryForAssociate ? "selected" : ""}
                                                        >{option.Country}</option>
                                                    )}
                                                </select>
                                            </div>
                                            {options[countryForAssociate] &&
                                                <div>
                                                    <label className="text-secondary" htmlFor="state1">State/Province:</label>
                                                    <select
                                                        id="state1"
                                                        className="form-control m-0 w-100"
                                                        onChange={(e) => set_state2(e.target.value)}
                                                        value={state2}
                                                        required
                                                    >
                                                        <option value="">Select State</option>
                                                        {options[countryForAssociate].map((item) => (
                                                            <option key={item} value={item}>
                                                                {item}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            }

                                        </div>

                                        <div className="col-md-3">
                                            <label className="text-secondary" htmlFor="yr1">Graduation Year:</label>
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
                                        </div></div>

                                </div>
                                {
                                    level !== 'Bachelor Degree' && level !== 'Undergraduate Student' && level !== 'Associate Degree' ? (
                                        <div className="row mt-3 border p-3 shadow ">
                                            <h6 className='border-bottom'>Master Degree</h6>
                                            <div className='d-flex justify-content-between'>
                                                <div className="col-md-3">
                                                    <label className="text-secondary" htmlFor="university2">Master Degree University:</label>
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

                                                <div className="col-md-3">
                                                    <div>
                                                        <label className="text-secondary">Country for Masters</label>
                                                        <select className='form-select'
                                                            onClick={(e) => setCountryForMast(e.target.value)}>
                                                            <option value={''} disabled selected>Select Country</option>
                                                            {Countries.map((option) =>
                                                                <option value={option.Country}

                                                                    selected={option.Country === countryForMast ? "selected" : ""}
                                                                >{option.Country}</option>
                                                            )}
                                                        </select>
                                                    </div>
                                                    {options[countryForMast] &&
                                                        <div>
                                                            <label className="text-secondary" htmlFor="state1">State/Province:</label>
                                                            <select
                                                                id="state1"
                                                                className="form-control m-0 w-100"
                                                                onChange={(e) => set_state3(e.target.value)}
                                                                value={state3}
                                                                required
                                                            >
                                                                <option value="">Select State</option>
                                                                {options[countryForMast].map((item) => (
                                                                    <option key={item} value={item}>
                                                                        {item}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    }
                                                </div>

                                                <div className="col-md-3">
                                                    <label className="text-secondary" htmlFor="yr2">Graduation Year:</label>
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
                                                </div></div>

                                        </div>
                                    ) : null
                                }
                                {
                                    level !== 'Undergraduate Student' && level !== 'Bachelor Degree' &&
                                        level !== 'Master Degree' && level !== 'Associate Degree' ? (
                                        <div className="row mt-3 border p-3 shadow ">
                                            <h6 className='border-bottom'>Doctorate Degree</h6>
                                            <div className='d-flex justify-content-between'>
                                                <div className="col-md-3">
                                                    <label className="text-secondary" htmlFor="university2"> Doctorate Degree University:</label>
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

                                                <div className="col-md-3">
                                                    <div>
                                                        <label className="text-secondary">Country For Doctorate</label>
                                                        <select className='form-select'
                                                            onClick={(e) => setCountryForDoc(e.target.value)}>
                                                            <option value={''} disabled selected>Select Country</option>
                                                            {Countries.map((option) =>
                                                                <option value={option.Country}

                                                                    selected={option.Country === countryForDoc ? "selected" : ""}
                                                                >{option.Country}</option>
                                                            )}
                                                        </select>
                                                    </div>
                                                    {options[countryForDoc] &&
                                                        <div>
                                                            <label className="text-secondary" htmlFor="state1">State/Province:</label>
                                                            <select
                                                                id="state1"
                                                                className="form-control m-0 w-100"
                                                                onChange={(e) => set_doctorateState(e.target.value)}
                                                                value={doctorateState}
                                                                required
                                                            >
                                                                <option value="">Select State</option>
                                                                {options[countryForDoc].map((item) => (
                                                                    <option key={item} value={item}>
                                                                        {item}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    }
                                                </div>

                                                <div className="col-md-3">
                                                    <label className="text-secondary" htmlFor="yr2">Graduation Year:</label>
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
                                                </div></div>

                                        </div>
                                    ) : null
                                }

                                <div className="row mt-3 border p-3 shadow ">
                                    <h6 className='border-bottom'>Degree Document</h6>
                                    <div className='d-flex justify-content-between'>
                                        <div className="col-md-3">
                                            <label className="text-secondary" htmlFor="degree">Upload Highest Degree Diploma:</label>
                                            <div className='d-flex align-items-center'>

                                                {(degreeFileContent && degreeFileContent.length) ? (
                                                    <div className='d-flex w-100 justify-content-between border rounded p-2'>
                                                        <div>Degree uploaded</div>
                                                        <div className="tick-icon"><IoIosCheckmarkCircle size={20} color='green' /></div>
                                                    </div>
                                                ) : (
                                                    <>  <div className="form-outline">
                                                        <input
                                                            type="file"
                                                            accept=".pdf, .jpeg, .png, .jpg"
                                                            id="degreeFile"
                                                            name="degreeFile"
                                                            className="form-control m-0"
                                                            onChange={handleFileUpload}
                                                            required
                                                        />
                                                    </div>
                                                        <div className="cross-icon"><FaRegTimesCircle size={20} color='red' /></div>

                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-3">
                                            <div>
                                                <label className="text-secondary">Country For Degree</label>
                                                <select className='form-select'
                                                    onClick={(e) => setCountryForDeg(e.target.value)}>
                                                    <option value={''} disabled selected>Select Country</option>
                                                    {Countries.map((option) =>
                                                        <option value={option.Country}

                                                            selected={option.Country === countryForDeg ? "selected" : ""}
                                                        >{option.Country}</option>
                                                    )}
                                                </select>
                                            </div>
                                            {options[countryForDeg] &&
                                                <div>
                                                    <label className="text-secondary" htmlFor="state1">State/Province:</label>
                                                    <select
                                                        id="state1"
                                                        className="form-control m-0 w-100"
                                                        onChange={(e) => set_state4(e.target.value)}
                                                        value={state4}
                                                        required
                                                    >
                                                        <option value="">Select State</option>
                                                        {options[countryForDeg].map((item) => (
                                                            <option key={item} value={item}>
                                                                {item}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            }
                                        </div>

                                        <div className="col-md-3">
                                            <label className="text-secondary" htmlFor="yr3">Diploma earned Year:</label>
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

                                </div>
                            </>
                        ) : null}

                        <div className="row mt-3 align-items-start border p-3 shadow ">
                            <h6 className='border-bottom'>Certification</h6>
                            <div className='d-flex justify-content-between'>
                                <div className="col-md-3">
                                    <label className="text-secondary" htmlFor="certificate">Upload Certificate:</label>
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

                                            {(certFileContent?.length) ? (
                                                <div className='d-flex w-100 justify-content-between border rounded p-2'>
                                                    <div>Certificate uploaded</div>
                                                    <div className="tick-icon"><IoIosCheckmarkCircle size={20} color='green' /></div>
                                                </div>) : (
                                                <>
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
                                                    <div className="cross-icon"><FaRegTimesCircle size={20} color='red' /></div>
                                                </>
                                            )}
                                        </div>
                                    ) : null}
                                </div>
                                {(certificate.length && certificate !== 'Not Certified') ? (
                                    <>
                                        <div className="col-md-3">
                                            <div>
                                                <label className="text-secondary">Country For Certification</label>
                                                <select className='form-select'
                                                    onClick={(e) => setCountryForCert(e.target.value)}>
                                                    <option value={''} disabled selected>Select Country</option>
                                                    {Countries.map((option) =>
                                                        <option value={option.Country}

                                                            selected={option.Country === countryForCert ? "selected" : ""}
                                                        >{option.Country}</option>
                                                    )}
                                                </select>
                                            </div>
                                            {options[countryForCert] &&
                                                <div>
                                                    <label className="text-secondary" htmlFor="state1">State/Province:</label>
                                                    <select
                                                        className="form-control m-0 w-100"
                                                        onChange={(e) => set_state5(e.target.value)}
                                                        value={state5}
                                                        required
                                                    >
                                                        <option value="">Select State</option>
                                                        {options[countryForCert].map((item) => (
                                                            <option key={item} value={item}>
                                                                {item}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            }

                                        </div>
                                        <div className="col-md-3">
                                            <label className="text-secondary" htmlFor="expiration">Certificate Expiration:</label>
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
                        </div>

                        <div className="row mt-3 justify-content-between border p-3 shadow ">
                            <h6 className='border-bottom'>Languages</h6>
                            <div className='d-flex justify-content-between'>
                                <div className="col-md-5">
                                    <label className="text-secondary" htmlFor="language">Select Native (Primary) Language:</label>
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

                                <div className="col-md-5">
                                    <label className="text-secondary" htmlFor="other-languages">Select Secondary language(s):</label>
                                    <Select
                                        isMulti
                                        placeholder="Select other language(s)"
                                        className="language-selector w-100"
                                        id="other-languages"
                                        value={othelang}
                                        onChange={handleLanguageChange}
                                        options={languageOptions}
                                    />
                                </div></div>

                        </div>
                    </div>
                    <div className="tutor-tab-education-experience">
                        <div className="education-work-experience-logo">
                            <img
                                src={career}
                                style={{ height: '85%', width: '200px', display: 'block', margin: 'auto', padding: '30px' }}
                                alt=""
                            />

                        </div>
                        <div className='border p-3'>

                            <h6 className='border-bottom'>Work Experience</h6>
                            <textarea
                                value={workExperience}
                                onChange={(e) => set_workExperience(e.target.value)}
                                style={{ height: '400px' }}
                                placeholder="Enter Your Work Experience"
                                className="form-control border-0"
                                required
                            ></textarea>
                        </div>
                    </div>

                    <Actions />
                </form>
            </div >
        </div>

    );
}

export default Education;