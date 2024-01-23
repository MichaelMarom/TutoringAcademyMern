import { useEffect, useRef, useState } from 'react';
import { IoIosCheckmarkCircle } from 'react-icons/io';

import { get_certificates, get_degree, get_experience, get_level, get_my_edu, get_state, upload_edu_form, upload_form_two } from '../../../axios/tutor';
import career from '../../../images/Experience-photo50.jpg';

import { moment } from '../../../config/moment'

import Select from 'react-select'
import Actions from '../../common/Actions';
import { FaRegTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { deleteFileOnServer, getPreviousFilePathFromDB, upload_file } from '../../../axios/file';
import Loading from '../../common/Loading';
import { AUST_STATES, CAN_STATES, Countries, UK_STATES, US_STATES, languages } from '../../../constants/constants'
import { getFileExtension, unsavedEducationChangesHelper } from '../../../helperFunctions/generalHelperFunctions';
import RichTextEditor from '../../common/RichTextEditor/RichTextEditor';
import PDFViewer from './PDFViewer'
import Button from '../../common/Button';
import UserRichTextEditor from '../../common/RichTextEditor/UserRichTextEditor';
import Tooltip from '../../common/ToolTip';
import ReactDatePicker from 'react-datepicker';
import { useSelector } from 'react-redux';

const languageOptions = languages.map((language) => ({
    value: language,
    label: language,
}));

const Education = () => {

    const [editMode, setEditMode] = useState(false);
    const [unSavedChanges, setUnsavedChanges] = useState(false);

    let [level, set_level] = useState('');

    let [university1, set_university1] = useState('');
    let [university2, set_university2] = useState('');
    let [university3, set_university3] = useState('');

    let [degree, set_degree] = useState([]);
    let [certificate, set_certificate] = useState('');
    let [language, set_language] = useState([]);

    const [countryForAssociate, setCountryForAssoc] = useState('');
    const [countryForCert, setCountryForCert] = useState('');
    const [countryForMast, setCountryForMast] = useState('');
    const [countryForDoc, setCountryForDoc] = useState('');
    const [countryForDeg, setCountryForDeg] = useState('')

    let [state2, set_state2] = useState('');
    let [state3, set_state3] = useState('');
    let [state4, set_state4] = useState('');
    let [state5, set_state5] = useState('');
    let [doctorateState, set_doctorateState] = useState('')

    let [experience, set_experience] = useState('');
    let [graduateYr1, set_graduateYr1] = useState('');
    let [graduateYr2, set_graduateYr2] = useState('');
    let [graduateYr3, set_graduateYr3] = useState('');
    let [doctorateGraduateYear, setDoctorateGraduateYear] = useState('')

    let [expiration, set_expiration] = useState('');
    let [othelang, set_othelang] = useState([]);
    let [workExperience, set_workExperience] = useState('');

    let [exp, set_exp] = useState('');
    let [level_list, set_level_list] = useState('')
    let [certificate_list, set_certificate_list] = useState('')
    let [d_list, set_d_list] = useState([])

    let [data, set_data] = useState(false);
    let [dbValues, setDbValues] = useState({});

    const [degreeFile, setDegreeFile] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [resumePath, set_resumePath] = useState(null);
    const [degreeFileContent, setDegreeFileContent] = useState('')
    const [certificateFile, setCertificateFile] = useState(null);
    const [certFileContent, setCertFileContent] = useState('')
    const [dataFetched, setDataFetched] = useState(false)
    let [db_edu_level, set_db_edu_level] = useState('');
    let [db_edu_cert, set_db_edu_cert] = useState('');
    const [fetchingEdu, setFetchingEdu] = useState(false);
    const [deg_file_name, set_deg_file_name] = useState('');
    const [cert_file_name, set_cert_file_name] = useState('');
    const [addReference, setAddReference] = useState(false)
    const [references, setReferences] = useState('')
    const [saving, setSaving] = useState(false);
    const [recordFetched, setRecordFetched] = useState(false);
    const { tutor } = useSelector(state => state.tutor)

    //private info protection notice
    let toastId = useRef();
    useEffect(() => {
        toastId.current = !toastId.current && recordFetched && !dbValues.EducationalLevel?.length &&
            !(cert_file_name || deg_file_name) &&
            toast('Please upload the highest diploma you earned. The academy only verifies your credentials, and guard your privecy by not publishing it on the portal.', {
                closeButton: true,
                autoClose: false,
                className: "setup-private-info edu"
            })
        console.log(toastId)

        if (toastId && (cert_file_name || deg_file_name)) {
            toast.dismiss()
        }
    }, [recordFetched, dbValues, cert_file_name, deg_file_name])

    useEffect(() => {
        if (dbValues.AcademyId) {
            setEditMode(false)
        } else {
            setEditMode(true)
        }
    }, [dbValues])

    useEffect(() => {
        if (dataFetched && db_edu_level !== level) {
            setCountryForAssoc('')
            setCountryForDeg('')
            setCountryForDoc('')
            setCountryForMast('')
            setDoctorateGraduateYear('')
            set_graduateYr3('')
            set_university1('')
            set_university2('')
            set_university3('')
            set_state2('')
            set_state3('')
            set_doctorateState('')
            set_state4('')
            set_deg_file_name('')
        }
    }, [level, db_edu_level])

    useEffect(() => {
        if (dataFetched && db_edu_cert !== certificate) {
            setCountryForCert('')
            set_state5('')
            set_expiration('')
            set_cert_file_name('')
        }
    }, [certificate, db_edu_cert])

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
        if (level === 'Undergraduate Student') {
            set_graduateYr1('current')
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

    let AcademyId = window.localStorage.getItem('tutor_user_id');

    let saver = () => {
        let response = upload_edu_form(level,
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
            graduateYr3,
            doctorateGraduateYear,
            expiration,
            JSON.stringify(othelang),
            workExperience,
            AcademyId,
            countryForDeg,
            countryForMast,
            countryForCert,
            countryForDoc,
            countryForAssociate,
            resumePath,
            cert_file_name,
            deg_file_name,
            references
        )
        return response;
    }

    const handleEditClick = () => {
        setEditMode(!editMode);
    };

    const handleEditorChange = (value) => {
        set_workExperience(value);
    };

    //comparing DB, Local
    useEffect(() => {
        if (true) {
            let fieldValues = {
                level,
                university1,
                university2,
                university3,
                degree,
                certificate,
                language,
                countryForAssociate,
                countryForCert,
                countryForMast,
                countryForDoc,
                countryForDeg,
                state2,
                state3,
                state4,
                state5,
                doctorateState,
                experience,
                graduateYr1,
                graduateYr2,
                graduateYr3,
                doctorateGraduateYear,
                expiration,
                othelang,
                workExperience,
                exp,
                level_list,
                certificate_list,
                d_list,
                data,
                degreeFile,
                degreeFileContent,
                certificateFile,
                certFileContent,
                dataFetched,
                db_edu_level,
                db_edu_cert,
                fetchingEdu,
                resumePath,
                references
            }
            console.log(dbValues, fieldValues)
            setUnsavedChanges(unsavedEducationChangesHelper(fieldValues, dbValues))
        }
    }, [
        level,
        university1,
        university2,
        university3,
        degree,
        certificate,
        language,
        countryForAssociate,
        countryForCert,
        countryForMast,
        countryForDoc,
        countryForDeg,
        state2,
        state3,
        state4,
        state5,
        doctorateState,
        experience,
        graduateYr1,
        graduateYr2,
        graduateYr3,
        doctorateGraduateYear,
        expiration,
        othelang,
        workExperience,
        degreeFile,
        degreeFileContent,
        certificateFile,
        certFileContent,
        dataFetched,
        db_edu_level,
        db_edu_cert,
        fetchingEdu,
        dbValues,
        resumePath,
        references
    ])

    //fetching DB
    useEffect(() => {
        !editMode && setFetchingEdu(true)

        get_my_edu(window.localStorage.getItem('tutor_user_id'))
            .then((result) => {
                if (result?.length) {
                    let data = result[0];
                    setDbValues(data)
                    set_workExperience(data.WorkExperience)
                    set_university1(data.College1)
                    set_university2(data.College2)
                    set_university3(data.DoctorateCollege)

                    set_language(JSON.parse(data.NativeLang))
                    set_othelang(JSON.parse(data.NativeLangOtherLang))

                    set_graduateYr1(data.College1Year)
                    set_graduateYr2(data.College2StateYear)
                    set_graduateYr3(data.DegreeYear)

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
                    setReferences(data.ThingsReferences)
                    // setAddReference(data.ThingsReferences?.length)

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

                    set_resumePath(data.Resume);
                    set_deg_file_name(data.DegFileName)
                    set_cert_file_name(data.CertFileName)

                    setDataFetched(true)
                } else {
                    setDbValues({
                        EducationalLevel: level,
                        College1: university1,
                        College2: university2,
                        DoctorateCollege: university3,
                        Certificate: certificate,
                        BachCountry: countryForAssociate,
                        CertCountry: countryForCert,
                        MastCountry: countryForMast,
                        DocCountry: countryForDoc,
                        DegCountry: countryForDeg,
                        College1State: state2,
                        College2State: state3,
                        DegreeState: state4,
                        CertificateState: state5,
                        DoctorateState: doctorateState,
                        EducationalLevelExperience: experience,
                        College1Year: graduateYr1,
                        College2StateYear: graduateYr2,
                        DegreeYear: graduateYr3,
                        DoctorateGradYr: doctorateGraduateYear,
                        CertificateExpiration: expiration,
                        WorkExperience: workExperience,
                        ThingsReferences: references
                    })
                }

            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setFetchingEdu(false)
                setRecordFetched(true)
                set_data(true)
            })
    }, [])

    useEffect(() => {

        get_experience()
            .then((data) => {
                let list = data.recordset.map((item) =>
                    <option key={item.TutorExperience} className={item.TutorExperience} value={item.TutorExperience}>{item.TutorExperience}</option>
                );
                let head = <option value=''>TutorExperience</option>

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
                    <option key={item.Degree}
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
                    <option key={item.Level} className={item.Level} value={item.Level}>{item.Level}</option>
                );
                set_level_list(list)

            })
            .catch((err) => {
                console.log(err)
            })

        get_certificates()
            .then((data) => {
                let list = data.recordset.map((item) =>
                    <option key={item.CertificateType} className={item.CertificateType} value={item.CertificateType}>{item.CertificateType}</option>
                );
                set_certificate_list(list)

            })
            .catch((err) => {
                console.log(err)
            })
    }, [certificate, degree, experience, level])

    let certified = e => {
        set_certificate(e.target.value)
    }

    const handleDegFileUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result
                setDegreeFileContent(base64);
            };
            reader.readAsDataURL(file);
            const fileExtension = file.name.split('.').pop().toLowerCase();
            const fileName = `${AcademyId}-degree-${level}.${fileExtension}`;
            set_deg_file_name(fileName)
            setDegreeFile(file);
        }
    }

    const handleResumeFileUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            setResumeFile(file);
            set_resumePath(`${AcademyId}-resume-${(new Date()).getTime()}-${file.name}`);
        }
    }

    const handleUploadDegreeToServer = async () => {
        if (degreeFile) {
            const formData = new FormData();
            formData.append('file', degreeFile);
            try {

                const response = await upload_file(formData, deg_file_name)

                console.log(response.data);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };

    const handleUploadResumeToServer = async () => {
        if (resumeFile) {
            const previousFilePath = await getPreviousFilePathFromDB(AcademyId);
            if (previousFilePath) {
                await deleteFileOnServer(AcademyId);
            }
            const formData = new FormData();
            formData.append('file', resumeFile);

            try {
                const fileName = resumePath
                const response = await upload_file(formData, fileName)

                console.log(response.data);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        } else {
            console.log('Please select a file before uploading.');
        }
    };

    const handleUploadCertificateToServer = async () => {
        if (certificateFile) {
            const formData = new FormData();
            formData.append('file', certificateFile);
            try {
                await upload_file(formData, cert_file_name)
            } catch (error) {
                console.error('Error uploading file:', error);
            }
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
            const fileExtension = file.name.split('.').pop().toLowerCase();
            const fileName = `${AcademyId}-certificate-${certificate}.${fileExtension}`;
            set_cert_file_name(fileName)
        }
    }

    const handleSave = async (e) => {
        e.preventDefault();
        if (workExperience.length === 11 || !workExperience.length) return toast.warning('Work Experiece in Required!')

        if (!cert_file_name || deg_file_name)
            toast.warning('Since You did not uploaded certificate/Degree, your Profile will stay in Pending status, and can not be activated until you upload the missing items!')

        setSaving(true)
        let res = await saver();
        setSaving(false)
        if (res) {
            handleUploadDegreeToServer()
            handleUploadCertificateToServer()
            // handleUploadResumeToServer();
            toast.success('Education record saved Successfully');
        }
        else {
            toast.error('Failed to save Record')
        }
        setEditMode(false)
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

                                <div className="col-md-4">
                                    <div className='d-flex justify-content-between'>
                                        <label className="text-secondary text-start" htmlFor="level">Education Level:</label>
                                        <Tooltip width="250px" text=" Please select the highest education level that you have earned diploma from (could be high school). If you selected academic education level, but cannot provide a proof in a form of diploma, we would have to decline your application." />
                                    </div>
                                    <select
                                        id="level"
                                        className="form-select m-0"
                                        onChange={(e) => set_level(e.target.value)}
                                        value={level}
                                        required
                                        disabled={!editMode}
                                    >
                                        <option value="" disabled>Select highest Education</option>
                                        {level_list}
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="text-secondary" htmlFor="experience">Experience:</label>
                                    <select
                                        id="experience"
                                        className="form-select m-0"
                                        onChange={(e) => set_experience(e.target.value)}
                                        value={experience}
                                        required
                                        disabled={!editMode}
                                    >
                                        {exp}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {level !== 'No Academic Education' && level.length ? (
                            <>
                                <div className="row mt-3 p-3 shadow  border shadow">
                                    {
                                        <h6 className='border-bottom'>
                                            {(level === 'Associate Degree' ||
                                                level === 'Undergraduate Student') ?
                                                'College' : 'Bachelor Degree'}
                                        </h6>
                                    }
                                    <div className='d-flex justify-content-between'>
                                        <div className="col-md-4">
                                            <label className="text-secondary" htmlFor="university1">{(level === 'Associate Degree' ||
                                                level === 'Undergraduate Student') ?
                                                'College Name' : 'Bachelor Degree Institute:'}</label>
                                            <input
                                                type="text"
                                                id="university1"
                                                className="form-control m-0"
                                                value={university1}
                                                onChange={(e) => set_university1(e.target.value)}
                                                placeholder="College/University 1"
                                                required
                                                disabled={!editMode}
                                            />
                                        </div>

                                        <div className="col-md-3">
                                            <div>
                                                <label className="text-secondary">Country for {`${level === 'Associate Degree' ?
                                                    "Associate degree" : "Bachelor"}`}</label>
                                                <select className='form-select'
                                                    onChange={(e) => setCountryForAssoc(e.target.value)}
                                                    value={countryForAssociate}
                                                    disabled={!editMode}
                                                >
                                                    <option value={''} disabled>Select Country</option>
                                                    {Countries.map((option) =>
                                                        <option value={option.Country}
                                                        >{option.Country}</option>
                                                    )}
                                                </select>
                                            </div>
                                            {options[countryForAssociate] &&
                                                <div>
                                                    <label className="text-secondary" htmlFor="state1">State/Province:</label>
                                                    <select
                                                        id="state1"
                                                        className="form-select m-0 w-100"
                                                        onChange={(e) => set_state2(e.target.value)}
                                                        value={state2}
                                                        required
                                                        disabled={!editMode}
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

                                        <div className="col-md-4">
                                            <label className="text-secondary" htmlFor="yr1">Graduation Year:</label>
                                            {level === 'Undergraduate Student' ? <div>{graduateYr1}</div> :
                                                <select
                                                    id="yr1"
                                                    className="form-select m-0 w-100"
                                                    onChange={(e) => set_graduateYr1(e.target.value)}
                                                    value={graduateYr1}
                                                    required
                                                    disabled={!editMode}
                                                >
                                                    <option value="">Select Year</option>
                                                    {d_list.map((item) => (
                                                        <option key={item} value={item}>
                                                            {item}
                                                        </option>
                                                    ))}
                                                </select>}
                                        </div>
                                    </div>

                                </div>
                                {
                                    level !== 'Bachelor Degree' && level !== 'Undergraduate Student' && level !== 'Associate Degree' ? (
                                        <div className="row mt-3 border p-3 shadow ">
                                            <h6 className='border-bottom'>Master Degree</h6>
                                            <div className='d-flex justify-content-between'>
                                                <div className="col-md-4">
                                                    <label className="text-secondary" htmlFor="university2">Master Degree University:</label>
                                                    <input
                                                        type="text"
                                                        id="university2"
                                                        className="form-control m-0"
                                                        value={university2}
                                                        onChange={(e) => set_university2(e.target.value)}
                                                        placeholder="College/University 2"
                                                        required
                                                        disabled={!editMode}

                                                    />
                                                </div>

                                                <div className="col-md-3">
                                                    <div>
                                                        <label className="text-secondary">Country for Master.</label>
                                                        <select className='form-select'
                                                            onChange={(e) => setCountryForMast(e.target.value)}
                                                            disabled={!editMode}
                                                            value={countryForMast}
                                                        >
                                                            <option value={''} disabled>Select Country</option>
                                                            {Countries.map((option) =>
                                                                <option value={option.Country}
                                                                >{option.Country}</option>
                                                            )}
                                                        </select>
                                                    </div>
                                                    {options[countryForMast] &&
                                                        <div>
                                                            <label className="text-secondary" htmlFor="state1">State/Province:</label>
                                                            <select
                                                                id="state1"
                                                                className="form-select m-0 w-100"
                                                                onChange={(e) => set_state3(e.target.value)}
                                                                value={state3}
                                                                required
                                                                disabled={!editMode}

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

                                                <div className="col-md-4">
                                                    <label className="text-secondary" htmlFor="yr2">Graduation Year:</label>
                                                    <select
                                                        id="yr2"
                                                        className="form-select m-0 w-100"
                                                        onChange={(e) => set_graduateYr2(e.target.value)}
                                                        value={graduateYr2}
                                                        required
                                                        disabled={!editMode}
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
                                                <div className="col-md-4">
                                                    <label className="text-secondary" htmlFor="university2"> Doctorate Degree university </label>
                                                    <input
                                                        type="text"
                                                        id="university2"
                                                        className="form-control m-0"
                                                        value={university3}
                                                        onChange={(e) => set_university3(e.target.value)}
                                                        placeholder="College/University 3"
                                                        required
                                                        disabled={!editMode}
                                                    />
                                                </div>

                                                <div className="col-md-3">
                                                    <div>
                                                        <label className="text-secondary">Country For Doctorate</label>
                                                        <select className='form-select'
                                                            onChange={(e) => setCountryForDoc(e.target.value)}
                                                            disabled={!editMode}
                                                            value={countryForDoc}
                                                        >
                                                            <option value={''} disabled>Select Country</option>
                                                            {Countries.map((option) =>
                                                                <option value={option.Country}
                                                                >{option.Country}</option>
                                                            )}
                                                        </select>
                                                    </div>
                                                    {options[countryForDoc] &&
                                                        <div>
                                                            <label className="text-secondary" htmlFor="state1">State/Province:</label>
                                                            <select
                                                                id="state1"
                                                                className="form-select m-0 w-100"
                                                                onChange={(e) => set_doctorateState(e.target.value)}
                                                                value={doctorateState}
                                                                required
                                                                disabled={!editMode}
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

                                                <div className="col-md-4">
                                                    <label className="text-secondary" htmlFor="yr2">Graduation Year:</label>
                                                    <select
                                                        id="yr2"
                                                        className="form-select m-0 w-100"
                                                        onChange={(e) => setDoctorateGraduateYear(e.target.value)}
                                                        value={doctorateGraduateYear}
                                                        required
                                                        disabled={!editMode}
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
                                        <div className="col-md-4">
                                            <div className='d-flex'>
                                                <label className="text-secondary text-start" htmlFor="degree">Upload Highest Degree Diploma:</label>
                                                <Tooltip width="200px" text="We use your document only to verify your status. we do not publish it to the public.
                                                               Upon verification, we mark your profile by the academic verification symbol" />
                                            </div>
                                            <div className='d-flex align-items-center'>

                                                {(deg_file_name && deg_file_name.length) ? (
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
                                                            disabled={!editMode}
                                                            className="form-control m-0"
                                                            onChange={handleDegFileUpload}
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
                                                    disabled={!editMode}
                                                    value={countryForDeg}
                                                    onChange={(e) => setCountryForDeg(e.target.value)}>
                                                    <option value={''} disabled>Select Country</option>
                                                    {Countries.map((option) =>
                                                        <option value={option.Country}
                                                        >{option.Country}</option>
                                                    )}
                                                </select>
                                            </div>
                                            {options[countryForDeg] &&
                                                <div>
                                                    <label className="text-secondary" htmlFor="state1">State/Province:</label>
                                                    <select
                                                        id="state1"
                                                        className="form-select m-0 w-100"
                                                        onChange={(e) => set_state4(e.target.value)}
                                                        value={state4}
                                                        required
                                                        disabled={!editMode}

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

                                        <div className="col-md-4">
                                            <label className="text-secondary" htmlFor="yr3">Diploma earned Year:</label>
                                            <select
                                                id="yr3"
                                                className="form-select m-0 w-100"
                                                onChange={(e) => set_graduateYr3(e.target.value)}
                                                value={graduateYr3}
                                                required
                                                disabled={!editMode}
                                            >
                                                <option value="" disabled>Select Year</option>
                                                {d_list.map((item) => (
                                                    <option
                                                        key={item}
                                                        value={item}
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
                                <div className="col-md-4">
                                    <div className='d-flex justify-content-between'>
                                        <label className="text-secondary text-start" htmlFor="degree">Certification</label>
                                        <Tooltip width="200px" text="We use your document only to verify your certification. We do not publish it to the public.
                                                               Upon verification, we mark your profile by the Diploma verification symbol" />
                                    </div> <select
                                        id="certificate"
                                        name="certificate"
                                        className="form-select m-0"
                                        onChange={certified}
                                        placeholder='Select Certificate'
                                        value={certificate}
                                        required
                                        disabled={!editMode}
                                    >
                                        <option value="" disabled>Select Certificate</option>
                                        {certificate_list}
                                    </select>
                                    {(certificate.length && certificate !== 'Not Certified') ? (
                                        <div className='d-flex justify-content-center align-items-center'>

                                            {(cert_file_name?.length) ? (
                                                <div className='d-flex w-100 justify-content-between border rounded p-2'>
                                                    <div>Certificate Uploaded</div>
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
                                                            disabled={!editMode}

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
                                                    disabled={!editMode}
                                                    onChange={(e) => setCountryForCert(e.target.value)}
                                                    value={countryForCert}
                                                >
                                                    <option value={''} disabled>Select Country</option>
                                                    {Countries.map((option) =>
                                                        <option value={option.Country}
                                                        >{option.Country}</option>
                                                    )}
                                                </select>
                                            </div>
                                            {options[countryForCert] &&
                                                <div>
                                                    <label className="text-secondary" htmlFor="state1">State/Province:</label>
                                                    <select
                                                        className="form-select m-0 w-100"
                                                        onChange={(e) => set_state5(e.target.value)}
                                                        value={state5}
                                                        required
                                                        disabled={!editMode}
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
                                        <div className="col-md-4">
                                            <label className="text-secondary" htmlFor="expiration">Certificate Expiration:</label>
                                            <ReactDatePicker
                                                selected={moment.tz(expiration ? expiration : new Date(), tutor.timeZone).toDate()}
                                                onChange={date => {
                                                    date.setHours(23);
                                                    date.setMinutes(59)
                                                    date.setSeconds(59)
                                                    const originalMoment = moment(date)
                                                    set_expiration(originalMoment)
                                                }}
                                                minDate={new Date()}
                                                dateFormat="MMM d, yyyy"
                                                className="form-control m-2"
                                                readOnly={!editMode}
                                                placeholder="Expiration Date"
                                            />
                                            {/* <input
                                                type="date"
                                                min={new Date().toISOString().split('T')[0]}
                                                id="expiration"
                                                className="form-control m-0"
                                                value={expiration}
                                                onBlur={handleBlur}
                                                onChange={handleDateChange}
                                                placeholder="Expiration"
                                                disabled={!editMode}
                                            /> */}
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
                                        isDisabled={!editMode}
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
                                        isDisabled={!editMode} />
                                </div></div>

                        </div>
                    </div>
                    <div className="tutor-tab-education-experience"
                        style={{ marginTop: "75px" }}>
                        <div className="education-work-experience-logo">
                            <img
                                src={career}
                                style={{ height: '85%', width: '200px', display: 'block', margin: 'auto', padding: '5px 10px 5px 10px' }}
                                alt=""
                            />

                        </div>
                        <div>
                            <Button className='btn-sm btn-primary'
                                disabled={!editMode}
                                handleClick={() => setAddReference(true)}>
                                Add Ressorces
                            </Button>
                        </div>
                        {
                            !!data.ThingsReferences?.length || addReference &&
                            <div className="form-outline my-3" style={{ width: "450px" }}>
                                <RichTextEditor
                                    className="references"
                                    value={references}
                                    onChange={(value) => setReferences(value)}
                                    readOnly={!editMode}
                                    placeholder={`Tutoring academy recommends using a digital pen made by Wacom for the collaboration tab whiteboard. Basic models are CTL-4100 & 6100. You can find more information on their official website www.wacom.com
                                    Cost: $50 or less
                                    `}
                                    height='400px'
                                />
                            </div>
                        }
                        <div style={{ width: "450px" }}>

                            <UserRichTextEditor
                                className="work-exp"
                                value={workExperience}
                                onChange={handleEditorChange}
                                readOnly={!editMode}
                                placeholder="Enter Your Work Experience"
                                height='800px'
                                required

                            />

                        </div>
                    </div>

                    <Actions
                        editDisabled={editMode}
                        saveDisabled={!editMode}
                        onEdit={handleEditClick}
                        unSavedChanges={unSavedChanges}
                        loading={saving}
                    />
                </form>
            </div>
        </div>
    );
}

export default Education;