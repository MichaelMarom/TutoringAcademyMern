import containerVariants from '../constraint';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { get_countries, get_gmt, get_state } from '../../axios/tutor';
import { socket } from '../../socket';
import { get_my_data, get_student_grade, get_student_setup, get_student_setup_by_userId, get_student_short_list, upload_form_one } from '../../axios/student';
import { convertGMTOffsetToLocalString } from '../../helperFunctions/timeHelperFunctions';
import { useDispatch } from 'react-redux';
import { setShortlist } from '../../redux/student_store/shortlist';
import { setStudent } from '../../redux/student_store/studentData';
import Tooltip from '../common/ToolTip';
import { FaInfoCircle } from 'react-icons/fa';

const StudentSetup = () => {
    const dispatch = useDispatch()
    let [fname, set_fname] = useState('')
    let [mname, set_mname] = useState('')
    let [sname, set_sname] = useState('')
    let [email, set_email] = useState('')
    let [pwd, set_pwd] = useState('')

    let [cell, set_cell] = useState('')
    let [acadId, set_acadId] = useState('')
    let [add1, set_add1] = useState('')
    let [add2, set_add2] = useState('')
    let [city, set_city] = useState('')
    let [state, set_state] = useState('')
    let [zipCode, set_zipCode] = useState('')
    let [country, set_country] = useState('')
    let [timeZone, set_timeZone] = useState('')
    let [is_18, set_is_18] = useState('')
    let [lang, set_lang] = useState('')
    let [parentConsent, set_parentConsent] = useState(false)
    let [grade, set_grade] = useState('')
    let [parent_fname, set_parent_fname] = useState('')
    let [parent_lname, set_parent_lname] = useState('')
    let [parent_email, set_parent_email] = useState('')

    let [photo, set_photo] = useState('')
    let [email_isVerified, set_email_isVerified] = useState(false)
    let { save } = useSelector(s => s.save)


    let [countryList, setCountryList] = useState('')
    let [stateList, setStateList] = useState('')
    let [lang_list, setlang_list] = useState([
        'English',
        'French',
        'German',
        'Spanish'
    ])
    let [GMTList, setGMTList] = useState('')
    let [GradeList, setGradeList] = useState('')

    let [data, set_data] = useState(false);
    const [dateTime, setDateTime] = useState('')
    const { user } = useSelector(state => state.user)
    const { student } = useSelector(state => state.student)

    let saver = async () => {

        let response = await upload_form_one(fname, mname, sname, user[0].email, lang, is_18, pwd, cell, grade, add1, add2, city, state, zipCode, country, timeZone, parent_fname, parent_lname, parent_email, photo, acadId, parentConsent, user[0].SID)
        const res = await get_my_data(localStorage.getItem('student_user_id'));
        dispatch(setStudent(res[1][0][0]))
        return response;
    }

    useEffect(() => {
        const fetchStudentSetup = async () => {
            if (user[0].role === 'student' || user[0].role === 'admin') {
                if (Object.keys(student)) {
                    let data = student
                    set_fname(data.FirstName)
                    set_sname(data.LastName)
                    set_mname(data.MiddleName)
                    set_photo(data.Photo)
                    set_email(data.Email)
                    set_cell(data.Cell)
                    set_state(data.State)

                    set_parentConsent(data.ParentConsent)
                    set_city(data.City)
                    set_country(data.Country)
                    set_timeZone(data.GMT)
                    set_zipCode(data.ZipCode)
                    set_add1(data.Address1)
                    set_add2(data.Address2)
                    set_is_18(data.AgeGrade)
                    set_lang(data.Language)
                    set_grade(data.Grade)
                    let list = [...document.querySelectorAll('.parentConsentOption')]
                    for (let i; i < list.length; list++) {
                        if (data.ParentConsent === 'true') {
                            list[0].checked = true
                            list[1].checked = false

                            console.log(list[0])
                        }
                        else {
                            list[0].checked = false
                            list[1].checked = true
                        }
                    }
                    set_parent_lname(data.ParentFirstName)
                    set_parent_fname(data.ParentLastName)
                    set_parent_email(data.ParentEmail)

                }
            }
        }
        fetchStudentSetup();
    }, [student])

    console.log(parentConsent, typeof (parentConsent), 'consent');

    useEffect(() => {
        let id = window.localStorage.getItem('student_user_id') !== null ? window.localStorage.getItem('student_user_id') : null
        set_acadId(id)
    }, [])

    useEffect(() => {
        let next = document.querySelector('.next')

        if (next && next.hasAttribute('id')) {
            next?.removeAttribute('id');
        }
    }, [])

    useEffect(() => {

        let input = [...document.querySelectorAll('input')];

        let doc = [document.querySelector('.profile-photo-cnt'), document.querySelector('.profile-video-cnt')]

        let field = input;



        let name = window.localStorage.getItem('user_id');
        if (name === null || name === 'null') {
            field.map(item => {
                item.style.opacity = 1;
                item.style.pointerEvents = 'all';
            })
        } else {
            field.map(item => {
                item.style.opacity = .4;
                item.style.pointerEvents = 'none';
            })
        }

    }, []);

    useEffect(() => {

        let input = [...document.querySelectorAll('input')];
        let select = [...document.querySelectorAll('select')];

        let doc = [document.querySelector('.profile-photo-cnt')]

        let field = [...input, ...select, ...doc];



        // let name = window.localStorage.getItem('student_user_id');
        // if (name === null || name === 'null') {
        //     field.map(item => {
        //         item.style.opacity = 1;
        //         item.style.pointerEvents = 'all';
        //     })
        // } else {
        //     field.map(item => {
        //         item.style.opacity = .4;
        //         item.style.pointerEvents = 'none';
        //     })
        // }

    }, []);

    // useEffect(() => {
    if (document.querySelector('#student-save')) {
        document.querySelector('#student-save').onclick = async () => {


            let all_inputs = [...document.querySelectorAll('input')].filter(item => item.getAttribute('id') !== 'add2' && item.getAttribute('id') !== 'mname')



            let all_values = all_inputs


            let bool_list = []
            let bools = all_values.map(item => {
                console.log(item.dataset.type)

                if (item.dataset.type === 'file') {

                    let data = item.nextElementSibling.hasChildNodes;
                    if (data) {
                        bool_list.push(true)
                    } else {
                        bool_list.push(false)
                    }

                } else if (item.dataset.type === 'radio') {


                    if (parentConsent) {
                        bool_list.push(true)
                    } else {
                        bool_list.push(false)
                        alert('Plase Select Parent Consent Option')
                    }
                } else {

                    if (item.value === '') {

                        if (item.dataset.type !== 'file') {
                            item?.setAttribute('id', 'err-border');
                        }
                        bool_list.push(false)
                    } else {
                        if (item.dataset.type !== 'file') {
                            item?.removeAttribute('id');
                        }

                        bool_list.push(true)
                    }
                }

            })



            let result = bool_list.filter(item => {
                console.log(item)
                return item === false
            })
            console.log(result, 'booooool')

            if (result.length === 0) {
                document.querySelector('.save-overlay')?.setAttribute('id', 'save-overlay')
                let response = await saver();
                if (response.bool) {

                    //document.querySelector('form').reset(); 
                    console.log(response)
                    if (response.type === 'save') {
                        window.localStorage.setItem('student_user_id', response.user);
                        window.localStorage.setItem('student_screen_name', response.screen_name);
                        alert(`Your New Screen Name Is ${response.screen_name}`)
                        setTimeout(() => {
                            document.querySelector('.save-overlay')?.removeAttribute('id');
                        }, 1000);

                        document.querySelector('.tutor-popin')?.setAttribute('id', 'tutor-popin');
                        document.querySelector('.tutor-popin').style.background = '#000';
                        document.querySelector('.tutor-popin').innerHTML = response.mssg
                        setTimeout(() => {
                            document.querySelector('.next')?.setAttribute('id', 'next')
                            document.querySelector('.tutor-popin')?.removeAttribute('id');
                        }, 5000);

                    } else {
                        setTimeout(() => {
                            document.querySelector('.save-overlay')?.removeAttribute('id');
                        }, 1000);

                        document.querySelector('.tutor-popin')?.setAttribute('id', 'tutor-popin');
                        document.querySelector('.tutor-popin').style.background = '#000';
                        document.querySelector('.tutor-popin').innerHTML = response.mssg
                        setTimeout(() => {
                            document.querySelector('.next')?.setAttribute('id', 'next')
                            document.querySelector('.tutor-popin')?.removeAttribute('id');
                        }, 5000);
                    }


                } else {
                    setTimeout(() => {
                        document.querySelector('.save-overlay')?.removeAttribute('id');
                    }, 1000);

                    document.querySelector('.tutor-popin')?.setAttribute('id', 'tutor-popin');
                    document.querySelector('.tutor-popin').style.background = 'red';
                    document.querySelector('.tutor-popin').innerHTML = response.mssg
                    setTimeout(() => {
                        document.querySelector('.tutor-popin')?.removeAttribute('id');
                    }, 5000);

                }


            }


            /**/
        };
    }

    if (document.querySelector('#student-edit')) {
        document.querySelector('#student-edit').onclick = async () => {
            let input = [...document.querySelectorAll('input')].filter(item => item.id !== 'fname' && item.id !== 'mname' && item.id !== 'sname');
            let select = [...document.querySelectorAll('select')];

            let doc = [document.querySelector('.profile-photo-cnt')]

            let field = [...input, ...select, ...doc];

            field.map(item => {
                item.style.opacity = 1;
                item.style.pointerEvents = 'all';
            })


        }
    }

    useEffect(() => {

        get_countries()
            .then((data) => {
                console.log(data)
                let list = data.recordset.map((item) =>
                    <option key={item.Country} className={item.Country} selected={item.Country === country ? 'selected' : ''} style={{ height: '80px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0' }} value={item.Country}>{item.Country}</option>
                );
                let head = <option key='null' style={{ height: '50px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0' }} value=''>Country</option>

                list.unshift(head);
                setCountryList(list)

            })
            .catch((err) => {
                console.log(err)
            })


        get_gmt()
            .then((data) => {
                let list = data.recordset.map((item) =>
                    <option key={item.GMT} className={item.GMT} selected={item.GMT === timeZone ? 'selected' : ''} style={{ height: '80px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0' }} value={item.GMT}>{item.GMT}</option>
                );
                let head = <option key='null' style={{ height: '50px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0' }} value=''>GMT</option>

                list.unshift(head);
                setGMTList(list)

            })
            .catch((err) => {
                console.log(err)
            })

        get_student_grade()
            .then((data) => {
                let list = data.map((item) =>
                    <option key={item.id} className={item.Grade} selected={item.Grade === grade ? 'selected' : ''} style={{ height: '80px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0' }} value={item.Grade}>{item.Grade}</option>
                );
                let head = <option key='null' style={{ height: '50px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0' }} value=''>Grade</option>

                list.unshift(head);
                setGradeList(list)

            })
            .catch((err) => {
                console.log(err)
            })


        get_state()
            .then((data) => {
                let list = data.recordset.map((item) =>
                    <option key={item.State} className={item.State} selected={item.State === state ? 'selected' : ''} style={{ height: '80px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0' }} value={item.State}>{item.State}</option>
                );
                let head = <option key='null' style={{ height: '50px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0' }} value=''>State</option>

                list.unshift(head);
                setStateList(list)

            })
            .catch((err) => {
                console.log(err)
            })
    }, [data])

    let handleImage = () => {

        let f = document.querySelector("#photo");

        let type = [...f.files][0].type;

        if (type.split('/')[0] !== 'image') {
            alert('Only Image Can Be Uploaded To This Field')
        } else {

            let reader = new FileReader();

            reader.onload = (result) => {
                set_photo(reader.result)
            }
            reader.readAsDataURL([...f.files][0]);
        }
    }

    useEffect(() => {
        const localTime = convertGMTOffsetToLocalString(timeZone);
        setDateTime(localTime)
    }, [timeZone])

    return (
        <>
            <div className="tutor-popin"></div>
            <div className="save-overlay">
                <span className="save_loader"></span>
            </div>
            <motion.div variants={containerVariants} initial='hidden' animate='visible' exit='exit' className="form-tutor-setup">
                <form action="">
                    <div className="tutor-setup-top-field" style={{ height: '100%' }}>

                        <div className="profile-photo-cnt">
                            <p>{typeof dateTime === 'object' ? '' : dateTime}</p>

                            <h5 style={{ whiteSpace: 'nowrap' }}>Profile Photo</h5>
                            <input type="file" data-type='file' onChange={handleImage} style={{ display: 'none' }} id="photo" />
                            <div className="tutor-tab-photo-frame">
                                <img src={photo} style={{ height: "100%", width: "100%" }} alt='photo' />
                            </div>
                            <label id='btn' htmlFor="photo">
                                Upload
                            </label>

                        </div>

                        <div className="profile-details-cnt" >

                            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', whiteSpace: 'nowrap' }}>
                                <input onInput={e => set_fname(e.target.value)} placeholder='First Name' value={fname} type="text" id="fname" style={{ float: 'right' }} />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', whiteSpace: 'nowrap' }}>
                                <input onInput={e => set_mname(e.target.value)} placeholder='Middle Name' value={mname} type="text" id="mname" style={{ float: 'right' }} />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', whiteSpace: 'nowrap' }}>
                                <input onInput={e => set_sname(e.target.value)} placeholder='Last Name' value={sname} type="text" id="sname" style={{ float: 'right' }} />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', whiteSpace: 'nowrap' }}>
                                <input
                                    placeholder='Email'
                                    value={user[0].email}
                                    type="text" id="email"
                                    style={{ float: 'right' }} readonly />

                                <div className='err-mssg' >
                                    Email already exist, Please try something else...
                                </div>

                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', whiteSpace: 'nowrap' }}>
                                <input onInput={e => set_cell(e.target.value)} placeholder='Cell Phone' value={cell} type="text" id="cellphn" style={{ float: 'right' }} />
                            </div>


                            <div style={{ display: 'inline-block', width: '100%', display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap' }}>
                                <select onInput={e => set_lang(e.target.value)} id="state" value={state} style={{ float: 'right', padding: '5px 5px 5px 5px', margin: '0 0 10px 0' }}>
                                    <option value="null">Select Language</option>
                                    {
                                        lang_list.map(item =>

                                            <option selected={item === lang ? 'selected' : ''} value={item}>{item}</option>
                                        )
                                    }

                                </select>
                            </div>

                            <div style={{ display: 'inline-block', width: '100%', display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap' }}>
                                <select dname="" id="" onInput={e => set_is_18(e.target.value)} style={{ float: 'right', width: '300px', margin: '0  0 10px 0', padding: '0 8px 0 8px', cursor: 'pointer' }}>
                                    <option value="null">Are You Over 18 ?</option>
                                    <option selected={is_18 === 'yes' ? 'selected' : ''} value="yes">Yes</option>
                                    <option selected={is_18 === 'no' ? 'selected' : ''} value="no">No</option>
                                </select>
                            </div>

                            <div style={{ display: 'inline-block', width: '100%', display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap' }}>
                                <select onInput={e => set_grade(e.target.value)} id="state" value={state} style={{ float: 'right', padding: '5px 5px 5px 5px', margin: '0 0 10px 0' }}>
                                    {
                                        GradeList
                                    }

                                </select>

                            </div>

                            <div style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                width: '100%', display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap'
                            }}>

                                <h5>Parent video consent</h5>
                                <div className="form-check form-switch d-flex gap-3" style={{ fontSize: "16px " }}>
                                    <input
                                        className="form-check-input "
                                        type="checkbox"
                                        role="switch"
                                        style={{
                                            width: "30px",
                                            height: "15px"
                                        }}
                                        onChange={() => { console.log('hit'); set_parentConsent(!parentConsent) }}
                                        checked={parentConsent === "true" || parentConsent === true}
                                    />
                                    <label className="form-check-label mr-3" for="flexSwitchCheckChecked" >
                                        Parent(s) consent to record lesson.
                                    </label>
                                    <Tooltip text="Enable this switch to consent video recording.The video clip stored for 30 days, then be deleted from The academy servers." width="200px">
                                        <FaInfoCircle size={18} color="#0096ff" />
                                    </Tooltip>
                                </div>
                            </div>


                        </div>



                        <div className="profile-details-cnt" style={{ float: 'left' }}>

                            <div style={{ display: 'inline-block', width: '100%', display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap' }}>
                                <input onInput={e => set_add1(e.target.value)} placeholder='Address 1' value={add1} type="text" id="add1" style={{ float: 'right' }} />
                            </div>


                            <div style={{ display: 'inline-block', width: '100%', display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap' }}>
                                <input onInput={e => set_add2(e.target.value)} placeholder='Address 2' value={add2} type="text" id="add2" style={{ float: 'right' }} />
                            </div>

                            <div style={{ display: 'inline-block', width: '100%', display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap' }}>
                                <input onInput={e => set_city(e.target.value)} placeholder='City/Town' type="text" value={city} id="city" style={{ float: 'right' }} />
                            </div>

                            <div style={{ display: 'inline-block', width: '100%', display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap' }}>
                                <select onInput={e => set_state(e.target.value)} id="state" value={state} style={{ float: 'right', padding: '5px 5px 5px 5px', margin: '0 0 10px 0' }}>
                                    {stateList}

                                </select>
                            </div>

                            <div style={{ display: 'inline-block', width: '100%', display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap' }}>
                                <input onInput={e => set_zipCode(e.target.value)} value={zipCode} placeholder='Zip-Code' type="text" id="zip" style={{ float: 'right' }} />
                            </div>

                            <div style={{ display: 'inline-block', width: '100%', display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap' }}>
                                <select onInput={e => set_country(e.target.value)} id="country" value={country} style={{ float: 'right', padding: '5px', margin: '0 0 10px 0' }}>
                                    {countryList}

                                </select>

                            </div>

                            <div style={{ display: 'inline-block', width: '100%', display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap' }}>
                                <select onInput={e => set_timeZone(e.target.value)} id="timeZone" value={timeZone} style={{ float: 'right', padding: '5px 5px 5px 5px', margin: '0 0 10px 0' }}>
                                    {GMTList}

                                </select>
                            </div>



                            <div style={{ display: 'inline-block', width: '100%', display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap' }}>
                                <input onInput={e => set_parent_email(e.target.value)} placeholder='Parent Email' type="text" value={parent_email} id="p-email" style={{ float: 'right' }} />
                            </div>

                            <div style={{ display: 'inline-block', width: '100%', display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap' }}>
                                <input onInput={e => set_parent_fname(e.target.value)} placeholder='Parent FirstName' type="text" value={parent_fname} id="p-fname" style={{ float: 'right' }} />
                            </div>

                            <div style={{ display: 'inline-block', width: '100%', display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap' }}>
                                <input onInput={e => set_parent_lname(e.target.value)} placeholder='Parent LastName' type="text" value={parent_lname} id="p-lname" style={{ float: 'right' }} />
                            </div>


                        </div>


                    </div>
                </form>
            </motion.div>
        </>
    );
}

export default StudentSetup;