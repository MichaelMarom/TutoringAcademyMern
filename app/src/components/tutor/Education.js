import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { get_certificates, get_degree, get_experience, get_level, get_my_edu, get_state, upload_form_two } from '../../axios/tutor';
import career from '../../images/career.png';
import Select, { components } from 'react-select'

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

const CustomLanguageINput = ({ className = 'langues', ...props }) => {
    return (
        <components.Input
            {...props}
            className={`input-language ${className}`}
        />
    );
};

const Education = () => {

    useEffect(() => {
        let next = document.querySelector('.tutor-next')

        if (next && next.hasAttribute('id')) {
            next.removeAttribute('id');
        }
    }, [])

    let { save } = useSelector(s => s.save)


    let [level, set_level] = useState([]);
    let [university1, set_university1] = useState([]);
    let [university2, set_university2] = useState([]);
    let [degree, set_degree] = useState([]);
    let [certificate, set_certificate] = useState([]);
    let [language, set_language] = useState([]);
    let [state1, set_state1] = useState([]);
    let [state2, set_state2] = useState([]);
    let [state3, set_state3] = useState([]);
    let [state4, set_state4] = useState([]);
    let [state5, set_state5] = useState([]);
    let [state6, set_state6] = useState([]);

    let [experience, set_experience] = useState('');
    let [graduagteYr1, set_graduagteYr1] = useState('');
    let [graduagteYr2, set_graduagteYr2] = useState('');
    let [graduagteYr3, set_graduagteYr3] = useState('');
    let [expiration, set_expiration] = useState('');
    let [othelang, set_othelang] = useState('');
    let [workExperience, set_workExperience] = useState('');

    let [exp, set_exp] = useState();
    let [stateList, setStateList] = useState([]);
    let [level_list, set_level_list] = useState('')
    let [degree_list, set_degree_list] = useState('')
    let [certificate_list, set_certificate_list] = useState('')
    let [d_list, set_d_list] = useState([])

    let [data, set_data] = useState(false);
    let [files, set_files] = useState('');


    const handleLanguageChange = (selectedOption) => {
        set_language(selectedOption);
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
        let response = upload_form_two(level, university1, university2, degree, JSON.stringify(degreeFile), certificate, JSON.stringify(certificateFile), JSON.stringify(language), state2, state3, state4, state5, state6, experience, graduagteYr1, graduagteYr2, graduagteYr3, expiration, othelang, workExperience, user_id)
        return response;
    }

    const tutorSaveBtn = document.querySelector('#tutor-save')
    if (tutorSaveBtn) {
        tutorSaveBtn.onclick = async () => {

            let all_inputs = [...document.querySelectorAll('input')]
            let selects = [...document.querySelectorAll('select')]
            let text = [...document.querySelectorAll('textarea')]

            let all_values = [...text, ...selects, ...all_inputs];


            let bool_list = []
            let bools = all_values.map(item => {
                let dependantFields = { degree: 'degreeFile', certificate: "certificateFile" }
                if (item.value === '') {
                    if ((dependantFields[item.name] && (item.value && all_values.find(input => input.name === dependantFields[item.name])?.value)) || (document.querySelector('[autocomplete="off"]') === item && language.length)) {
                        bool_list.push(true)
                    }
                    else if (!dependantFields[item.name]) {
                        if (item.dataset.type === 'file') {
                            if (item.nextElementSibling) {
                                item.nextElementSibling.setAttribute('id', 'err-border');
                            }
                        } else {
                            item.setAttribute('id', 'err-border');
                        }
                        if (document.querySelector('[autocomplete="off"]') === item) {
                            document.querySelector('.language-selector').style.border = "1px solid red";
                        }
                        bool_list.push(false)
                    }
                    else {
                        bool_list.push(true)
                    }
                } else {
                    if (item.dataset.type === 'file') {
                        if (item.nextElementSibling) {
                            item.nextElementSibling.removeAttribute('id');
                        }
                    } else {
                        item.removeAttribute('id');
                    }

                    bool_list.push(true)

                }
            })

            let result = bool_list.filter(item => item === false)

            if (result.length === 0) {
                document.querySelector('.save-overlay').setAttribute('id', 'save-overlay')
                let response = await saver();
                if (response) {
                    setTimeout(() => {
                        document.querySelector('.save-overlay').removeAttribute('id');
                    }, 1000);

                    document.querySelector('.tutor-popin').setAttribute('id', 'tutor-popin');
                    document.querySelector('.tutor-popin').style.background = '#000';
                    document.querySelector('.tutor-popin').innerHTML = 'Data Was Saved Successfully...'
                    setTimeout(() => {
                        document.querySelector('.tutor-next').setAttribute('id', 'next')
                        document.querySelector('.tutor-popin').removeAttribute('id');
                    }, 5000);
                } else {
                    setTimeout(() => {
                        document.querySelector('.save-overlay').removeAttribute('id');
                    }, 1000);

                    document.querySelector('.tutor-popin').setAttribute('id', 'tutor-popin');
                    document.querySelector('.tutor-popin').style.background = 'red';
                    document.querySelector('.tutor-popin').innerHTML = 'Data Was Not Saved Successfully...'
                    setTimeout(() => {
                        document.querySelector('.tutor-popin').removeAttribute('id');
                    }, 5000);

                }


            }
        }
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
                    set_language(JSON.parse(data.NativeLang))
                    set_othelang(data.NativeLangOtherLang)

                    set_graduagteYr1(data.College1Year)
                    set_graduagteYr2(data.College2Year)
                    set_graduagteYr3(data.DegreeYear)

                    set_degree(data.Degree)
                    set_certificate(data.Certificate)

                    setDegreeFile(JSON.parse(data.DegreeFile))
                    setCertificateFile(JSON.parse(data.CertificateFile))

                    set_level(data.EducationalLevel)
                    set_expiration(data.CertificateExpiration)
                    set_experience(data.EducationalLevelExperience)
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
                    <option key={item.Degree} selected={item.Degree === degree ? 'selected' : ''} className={item.Degree} style={{ height: '80px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0' }} value={item.Degree}>{item.Degree}</option>
                );
                let head = <option key='null' style={{ height: '50px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0' }} value=''>Degree</option>

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
                let head = <option key='null' style={{ height: '50px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0' }} value=''>Educational Level</option>

                list.unshift(head);
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
                let head = <option key='null' style={{ height: '50px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0' }} value=''>CertificateType</option>

                list.unshift(head);
                set_certificate_list(list)

            })
            .catch((err) => {
                console.log(err)
            })
    }, [data])

    let [opacity, set_opacity] = useState('1')
    let [event, set_event] = useState('all')

    let edu_level = e => {
        if (e.target.value === 'No Academic Education') {
            set_opacity('.5')
            set_event('none')
        } else {
            set_opacity('1')
            set_event('all')
        }
        set_level(e.target.value)
    }

    let [certified_opacity, set_certified_opacity] = useState('1')
    let [certified_event, set_certified_event] = useState('all')

    const [degreeFile, setDegreeFile] = useState(null);
    const [degreeFileContent, setDegreeFileContent] = useState('')
    const [certificateFile, setCertificateFile] = useState(null);
    const [certFileContent, setCertFileContent] = useState('')

    let certified = e => {
        if (e.target.value === 'Not Certified') {
            set_certified_opacity('.5')
            set_certified_event('none')
        } else {
            set_certified_opacity('1')
            set_certified_event('all')
        }
        set_certificate(e.target.value)
    }
    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                setDegreeFileContent(content);
            };
            reader.readAsText(file);
            setDegreeFile(file);
        }
    }

    const handleCertUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                setCertFileContent(content);
            };
            reader.readAsText(file);
            setCertificateFile(file);
        }
    }


    return (
        <>
            <div className="tutor-popin"></div>
            <div className="save-overlay">
                <span className="save_loader"></span>
            </div>
            <div className="tutor-tab-education">
                <form action="">

                    <div className="tutor-tab-education-info" >
                        <h3>Education</h3>

                        <h6 className='tutor-tab-education-notice highlight' >
                            Tutor does not have to be academic graduate in order to pass his knowledge. However, when you select your academic background, you must uplaod your credentials. You have 7 days doing that. Until your diploma or teacher's cerificate uploaded, "X" icon is being shown near the appropriate field. When your documentaions are uploaded, the icon be changed to a green "Verified" logo. The student, or parents are able to see your status when making their decision of selecting you.
                        </h6>


                        <div className='input-cnt' style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', whiteSpace: 'nowrap' }}>
                                <select id='level' style={{ padding: '5px' }} onInput={edu_level}>
                                    {
                                        level_list
                                    }
                                </select>
                            </div>

                            <div style={{
                                display: 'flex', visibility: 'hidden', justifyContent: 'center', width: '100%',
                                whiteSpace: 'nowrap'
                            }}>
                                <select onInput={e => set_state1(e.target.value)} id="state1">
                                    <option value='null'>Select</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', whiteSpace: 'nowrap', width: '150px' }}>
                                <select onInput={e => set_experience(e.target.value)} id="experience" style={{ float: 'right', padding: '8px', margin: '0 0 10px 0' }}>
                                    {exp}
                                </select>
                            </div>
                        </div>

                        <div className='input-cnt' style={{ pointerEvents: event, opacity: opacity, width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', whiteSpace: 'nowrap' }}>
                                <input type='text' id='university1' defaultValue={university1} onInput={e => set_university1(e.target.value)} placeholder='College/University 1' />
                            </div>

                            <div style={{
                                display: 'flex', justifyContent: 'center', width: '100%',
                                whiteSpace: 'nowrap'
                            }}>
                                <select style={{ padding: '5px', width: '100px' }} onInput={e => set_state2(e.target.value)} id="state1">
                                    <option value=''>Select State</option>
                                    {
                                        stateList.map(item => {
                                            if (files !== null) {
                                                return (
                                                    item === files.College1State
                                                        ?
                                                        <option selected key={item}>{item}</option>
                                                        :
                                                        <option key={item}>{item}</option>
                                                )
                                            } else {
                                                return <option key={item}>{item}</option>
                                            }
                                        }
                                        )
                                    }
                                </select>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', whiteSpace: 'nowrap', marginTop: '10px' }}>
                                <label htmlFor='yr1'>Graduation Year</label>

                                <select onInput={e => set_graduagteYr1(e.target.value)} id="yr1">
                                    {
                                        d_list.map(item => {
                                            if (files !== null) {
                                                return (
                                                    item === files.College1Year
                                                        ?
                                                        <option selected key={item}>{item}</option>
                                                        :
                                                        <option key={item}>{item}</option>
                                                )
                                            } else {
                                                return <option key={item}>{item}</option>
                                            }
                                        }
                                        )
                                    }
                                </select>

                            </div>
                        </div>

                        <div className='input-cnt' style={{ pointerEvents: event, opacity: opacity, width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', whiteSpace: 'nowrap' }}>
                                <input type='text' defaultValue={university2} id='university2' onInput={e => set_university2(e.target.value)} placeholder='College/University 2' />
                            </div>

                            <div style={{
                                display: 'flex', justifyContent: 'center', width: '100%',
                                whiteSpace: 'nowrap'
                            }}>
                                <select style={{ padding: '5px', width: '100px' }} onInput={e => set_state3(e.target.value)} id="state3">
                                    <option value=''>Select State</option>
                                    {
                                        stateList.map(item => {
                                            if (files !== null) {
                                                return (
                                                    item === files.College2State
                                                        ?
                                                        <option selected key={item}>{item}</option>
                                                        :
                                                        <option key={item}>{item}</option>
                                                )
                                            } else {
                                                return <option selected key={item}>{item}</option>
                                            }
                                        }
                                        )
                                    }
                                </select>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', whiteSpace: 'nowrap', marginTop: '10px' }}>
                                <label htmlFor='yr2'>Graduation Year</label>
                                <select onInput={e => set_graduagteYr2(e.target.value)} id="yr2">
                                    {
                                        d_list.map(item => {
                                            if (files !== null) {
                                                return (
                                                    item === files.College2Year
                                                        ?
                                                        <option selected key={item}>{item}</option>
                                                        :
                                                        <option key={item}>{item}</option>
                                                )
                                            } else {
                                                return <option key={item}>{item}</option>
                                            }
                                        }
                                        )
                                    }
                                </select>
                            </div>
                        </div>

                        <div className='input-cnt' style={{ pointerEvents: event, opacity: opacity, width: '100%' }}>
                            <div style={{
                                display: 'flex', flexDirection: "column",
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%'
                            }}>
                                <select id='degree'
                                    name="degree"
                                    className='mb-4' style={{ padding: '5px' }} onInput={e => set_degree(e.target.value)}>
                                    {
                                        degree_list
                                    }
                                </select>
                                {
                                    degree.length ?
                                        <div className={`form-outline`}>
                                            <input
                                                type="file"
                                                id="degreeFile"
                                                name="degreeFile"
                                                className="form-control m-0"
                                                onChange={handleFileUpload}
                                            />
                                        </div> : null
                                }
                            </div>

                            <div style={{
                                display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%',
                                whiteSpace: 'nowrap'
                            }}>
                                <select style={{ padding: '5px', width: '100px' }} onInput={e => set_state4(e.target.value)} id="state1">
                                    <option value=''>Select State</option>
                                    {
                                        stateList.map(item => {

                                            if (files !== null) {

                                                return (
                                                    item === files.DegreeState
                                                        ?
                                                        <option selected key={item}>{item}</option>
                                                        :
                                                        <option key={item}>{item}</option>
                                                )
                                            } else {
                                                return <option key={item}>{item}</option>

                                            }
                                        }

                                        )
                                    }
                                </select>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', whiteSpace: 'nowrap', marginTop: '10px' }}>
                                <label htmlFor='yr3'>Graduation Year</label>
                                <select onInput={e => set_graduagteYr3(e.target.value)} id="yr3">
                                    {
                                        d_list.map(item => {
                                            if (files !== null) {

                                                return (
                                                    item === files.DegreeYear
                                                        ?
                                                        <option selected key={item}>{item}</option>
                                                        :
                                                        <option key={item}>{item}</option>
                                                )
                                            } else {
                                                return <option key={item}>{item}</option>

                                            }
                                        }

                                        )
                                    }
                                </select>
                            </div>
                        </div>

                        <div className='input-cnt' style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', width: '100%', whiteSpace: 'nowrap', alignItems: "center" }}>
                                <select id='certificate' name="certificate" style={{ padding: '5px', marginBottom: '20px' }} onInput={certified}>
                                    {
                                        certificate_list
                                    }
                                </select>
                                {
                                    certificate.length ?
                                        <div className={`form-outline `}>
                                            <input
                                                type="file"
                                                id="certificateFile"
                                                name="certificateFile"
                                                className="form-control m-0"
                                                onChange={handleCertUpload}
                                            />
                                        </div> : null
                                }
                            </div>

                            <div style={{
                                display: 'flex', opacity: certified_opacity, pointerEvents: certified_event, justifyContent: 'center', margin: '0 0 30px 0', width: '100%',
                                whiteSpace: 'nowrap'
                            }}>
                                <select style={{ padding: '5px', width: '100px' }} onInput={e => set_state5(e.target.value)} id="state1">
                                    <option value=''>Select State</option>
                                    {
                                        stateList.map(item => {
                                            if (files !== null) {
                                                return (
                                                    item === files.CertificateState
                                                        ?
                                                        <option selected key={item}>{item}</option>
                                                        :
                                                        <option key={item}>{item}</option>
                                                )
                                            } else {
                                                return <option key={item}>{item}</option>

                                            }
                                        }
                                        )
                                    }
                                </select>
                            </div>

                            <div style={{ display: 'flex', opacity: certified_opacity, pointerEvents: certified_event, justifyContent: 'center', width: '100%', whiteSpace: 'nowrap' }}>
                                <input onInput={e => set_expiration(e.target.value)} placeholder='Expiration' type="date" defaultValue={files !== null ? files.CertificateExpiration : ''} id="expiration" style={{ float: 'right', width: '200px', marginTop: '30px' }} />
                            </div>
                        </div>

                        <div className='input-cnt' style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%', whiteSpace: 'nowrap', marginLeft: '2.3rem' }}>

                                <Select
                                    isMulti
                                    className='language-selector'
                                    id='language'
                                    value={language}
                                    onChange={handleLanguageChange}
                                    options={languageOptions}
                                    components={CustomLanguageINput}
                                />
                            </div>

                            <div style={{
                                display: 'flex', justifyContent: 'center', margin: '0 0 30px 0', width: '100%',
                                whiteSpace: 'nowrap'
                            }}>
                                <select style={{ padding: '5px', width: '100px', visibility: 'hidden' }} value='null' id="state1">
                                    <option value='null'>Select</option>
                                </select>
                            </div>
                        </div>





                    </div>

                    <div className="tutor-tab-education-experience">
                        <div className="education-work-experience-logo">

                            <img src={career} style={{ height: '85%', width: '200px', display: 'block', margin: 'auto', padding: '30px' }} alt="" />

                            <label htmlFor="" style={{ margin: 'auto', textAlign: 'center' }}><h6 style={{ textAlign: 'center' }}>Work Experience</h6></label>

                        </div>

                        <textarea defaultValue={workExperience} onInput={e => set_workExperience(e.target.value)} style={{ height: '400px' }} placeholder="Enter Here Your Work Experience" className="tutor-tab-education-experience-details">

                        </textarea>
                    </div>

                </form>
            </div>
        </>
    );
}

export default Education;