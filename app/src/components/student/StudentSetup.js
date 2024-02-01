import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { get_my_data, upload_form_one } from '../../axios/student';
import { convertGMTOffsetToLocalString } from '../../helperFunctions/timeHelperFunctions';
import { useDispatch } from 'react-redux';
import { setStudent } from '../../redux/student_store/studentData';
import Tooltip from '../common/ToolTip';
import { FaInfoCircle } from 'react-icons/fa';
import { Countries, GMT, GRADES, STATES, US_STATES } from '../../constants/constants';
import { PhoneInput } from 'react-international-phone';
import Actions from '../common/Actions';
import { toast } from 'react-toastify';
import Button from '../common/Button';
import BTN_ICON from '../../images/button__icon.png';

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
    console.log(is_18)
    let [lang, set_lang] = useState('')
    let [parentConsent, set_parentConsent] = useState(false)
    let [grade, set_grade] = useState('')
    let [parent_fname, set_parent_fname] = useState('')
    let [parent_lname, set_parent_lname] = useState('')
    let [parent_email, set_parent_email] = useState('')

    let [photo, set_photo] = useState('')


    let [countryList, setCountryList] = useState('')
    let [stateList, setStateList] = useState('');
    const [parentAEmail, setParentAEmail] = useState('');
    const [parentBEmail, setParentBEmail] = useState('');
    const [parentAName, setParentAName] = useState('');
    const [parentBName, setParentBName] = useState('');
    const [secLan, setSecLang] = useState('')

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
    const [userId, setUserId] = useState('')
    const { user } = useSelector(state => state.user)
    const { student } = useSelector(state => state.student)
    const [saving, setSaving] = useState(false)
    const [code, set_code] = useState('')

    let saver = async () => {
        setSaving(true)
        let response = await upload_form_one(fname, mname, sname, user.role === 'student' ? user.email : email,
            lang, secLan, parentAEmail, parentBEmail, parentAName, parentBName,
            is_18, pwd, cell, grade, add1, add2, city, state, zipCode, country, timeZone,
            photo, acadId, parentConsent,
            user.role === 'student' ? user.SID : userId)
        if (response.bool) {
            toast.success('success')
            const res = await get_my_data(localStorage.getItem('student_user_id'));
            dispatch(setStudent(res[1][0][0]))
        }
        else {
            toast.error('failed')
        }
        setSaving(false)
        return response;
    }

    useEffect(() => {
        const fetchStudentSetup = async () => {
            if (user.role === 'student' || user.role === 'admin') {
                if (Object.keys(student)) {
                    let data = student
                    set_fname(data.FirstName)
                    set_sname(data.LastName)
                    set_mname(data.MiddleName)
                    set_photo(data.Photo)
                    set_email(data.Email)
                    set_cell(data.Cell)
                    set_state(data.State)
                    setUserId(data.userId)
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

                        }
                        else {
                            list[0].checked = false
                            list[1].checked = true
                        }
                    }
                    setParentAName(data.ParentAName)
                    setParentBName(data.ParentBName)
                    setParentAEmail(data.ParentAEmail)
                    setParentBEmail(data.ParentBEmail)
                    setSecLang(data.SecLan)
                }
            }
        }
        fetchStudentSetup();
    }, [student])


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
            // field.map(item => {
            //     item.style.opacity = .4;
            //     item.style.pointerEvents = 'none';
            // })
        }

    }, []);

    if (document.querySelector('#student-save')) {
        document.querySelector('#student-save').onclick = async () => {

            let all_inputs = [...document.querySelectorAll('input')].filter(item => item.getAttribute('id') !== 'add2' && item.getAttribute('id') !== 'mname')

            let all_values = all_inputs

            let bool_list = []
            let bools = all_values.map(item => {

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
                return item === false
            })

            if (result.length === 0) {
                document.querySelector('.save-overlay')?.setAttribute('id', 'save-overlay')
                let response = await saver();
                if (response.bool) {

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
        let list = Countries.map((item) =>
            <option key={item.Country} className={item.Country} selected={item.Country === country ? 'selected' : ''}
                style={{ height: '80px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0' }} value={item.Country}>{item.Country}</option>
        );
        let head = <option key='null'
            style={{ height: '50px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0' }} value=''>Country</option>

        list.unshift(head);
        setCountryList(list)


        let gmt_list = GMT.map((item) =>
            <option key={item.GMT} className={item.GMT} selected={item.GMT === timeZone ? 'selected' : ''}
                style={{ height: '80px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0' }} value={item.GMT}>{item.GMT}</option>
        );
        let gmt_head = <option key='null'
            style={{
                height: '50px', width: '100%',
                outline: 'none', padding: '0 10px 0 10px', borderRadius: '0'
            }} value=''>GMT</option>

        gmt_list.unshift(gmt_head);
        setGMTList(gmt_list)




        let grades_list = GRADES.map((item) =>
            <option key={item.id} className={item.Grade} selected={item.Grade === grade ? 'selected' : ''}
                style={{ height: '80px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0' }} value={item.Grade}>{item.Grade}</option>
        );
        let grades_head = <option key='null'
            style={{ height: '50px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0' }} value=''>Grade</option>

        grades_list.unshift(grades_head);
        setGradeList(grades_list)


        let states_list = STATES.map((item) =>
            <option key={item.State} className={item.State} selected={item.State === state ? 'selected' : ''}
                style={{ height: '80px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0' }} value={item.State}>{item.State}</option>
        );
        let state_head = <option key='null'
            style={{ height: '50px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0' }} value=''>State</option>

        states_list.unshift(state_head);
        setStateList(states_list)

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
            <form onSubmit={saver}>
                <div className="d-flex justify-content-center container mt-4"
                    style={{ height: '100%', gap: "3%" }}>

                    <div className="profile-photo-cnt"
                        style={{ width: "30%" }}>
                        <p>{typeof dateTime === 'object' ? '' : dateTime}</p>

                        <h5
                            style={{ whiteSpace: 'nowrap' }}>Profile Photo</h5>
                        <input required className="form-control" type="file" data-type='file' onChange={handleImage}
                            style={{ display: 'none' }} id="photo" />
                        <div className="tutor-tab-photo-frame">
                            <img src={photo}
                                style={{ height: "100%", width: "100%" }} alt='photo' />
                        </div>
                        <label id='btn' className='action-btn mt-4' htmlFor="photo">
                            <div className='button__content'>
                                <div className='button__text'>Upload</div>
                            </div>
                        </label>

                        <div className='rounded border shadow p-2 mt-4'>
                            <h6>Write tutor code here</h6>
                            <div className='mb-2 d-flex align-items-center justify-content-center' style={{ gap: '2%' }}>
                                <input className="form-control " style={{ width: "65%", }}
                                    onChange={e => set_code(e.target.value)}
                                    placeholder='Code' type="text" value={code} />
                                <Button className='action-btn'>
                                    <div className="button__content">
                                        <div className="button__icon">
                                            <img src={BTN_ICON} alt={"btn__icon"} style={{
                                                animation: false ? "spin 2s linear infinite" : 'none',
                                            }} />
                                        </div>
                                        <p className="button__text">Connect   </p>
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className='d-flex flex-column' style={{ width: "66%" }}>
                        <div className='d-flex' style={{ width: "100%", gap: "3%" }}>

                            <div className="profile-details-cnt"
                                style={{ width: "48%" }}>

                                <div className='input-group mb-2 '>
                                    <label class="input-group-text" style={{ width: "35%" }} for="inputGroupSelect01">
                                        First Name</label>
                                    <input required className="form-control"
                                        onInput={e => set_fname(e.target.value)} placeholder='First Name'
                                        value={fname} type="text" id="fname"
                                    />
                                </div>

                                <div className='input-group mb-2 '>
                                    <label class="input-group-text" style={{ width: "35%" }} for="inputGroupSelect01">Middle Name</label>
                                    <input required className="form-control" onInput={e => set_mname(e.target.value)} placeholder='Middle Name' value={mname} type="text" id="mname"
                                    />
                                </div>

                                <div className='input-group mb-2 '>
                                    <label class="input-group-text" style={{ width: "35%" }} for="inputGroupSelect01">Last Name</label>
                                    <input required className="form-control" onInput={e => set_sname(e.target.value)} placeholder='Last Name' value={sname} type="text" id="sname"
                                    />
                                </div>

                                <div className='input-group mb-2 '>
                                    <label class="input-group-text" style={{ width: "35%" }} for="inputGroupSelect01">Email</label>
                                    <input required className="form-control"
                                        placeholder='Email'
                                        value={user.role === 'student' ? user.email : email}
                                        type="text" id="email"

                                        readonly />

                                    <div className='err-mssg' >
                                        Email already exist, Please try something else...
                                    </div>

                                </div>

                                <div className='input-group mb-2 '>
                                    <label class="input-group-text" style={{ width: "35%" }} for="inputGroupSelect01">CellPhone</label>
                                    <PhoneInput
                                        defaultCountry="us"
                                        value={cell}
                                        onChange={(cell) => set_cell(cell)}
                                        required
                                        style={{ width: "65%" }}
                                    />
                                </div>




                                <div className='input-group mb-2 '>
                                    <label class="input-group-text" style={{ width: "35%" }} for="inputGroupSelect01">Age</label>
                                    <select required className="form-select " dname="" id="" onInput={e => set_is_18(e.target.value)}>
                                        <option value="null">Are You Over 18 ?</option>
                                        <option selected={is_18 === 'yes' ? 'selected' : ''} value="yes">Yes</option>
                                        <option selected={is_18 === 'no' ? 'selected' : ''} value="no">No</option>
                                    </select>
                                </div>

                                <div className='input-group mb-2' >
                                    <label class="input-group-text" style={{ width: "35%" }} for="inputGroupSelect01">GMT</label>

                                    <select required className="form-select " onInput={e => set_timeZone(e.target.value)} id="timeZone" value={timeZone}>
                                        {GMTList}

                                    </select>
                                </div>

                                <div className='input-group mb-2 '>
                                    <label class="input-group-text" style={{ width: "35%" }} for="inputGroupSelect01">Grade</label>
                                    <select required className="form-select " onInput={e => set_grade(e.target.value)} id="state" value={grade}
                                    >
                                        {
                                            GradeList
                                        }

                                    </select>

                                </div>

                                <div className='input-group mb-2 '>
                                    <label class="input-group-text" style={{ width: "35%" }} for="inputGroupSelect01">Native Language</label>
                                    <select required className="form-select " onInput={e => set_lang(e.target.value)} id="state" value={lang}

                                    >
                                        <option value="null">Select Language</option>
                                        {
                                            lang_list.map(item =>

                                                <option selected={item === lang ? 'selected' : ''} value={item}>{item}</option>
                                            )
                                        }

                                    </select>
                                </div>

                            </div>

                            <div className="profile-details-cnt" style={{ width: "48%" }}>

                                <div className='input-group mb-2 '>
                                    <label class="input-group-text" style={{ width: "35%" }} for="inputGroupSelect01">Address1</label>

                                    <input required className="form-control "
                                        onInput={e => set_add1(e.target.value)} placeholder='Address 1' value={add1}
                                        type="text" id="add1"
                                    />
                                </div>

                                <div className='input-group mb-2 '>
                                    <label class="input-group-text" style={{ width: "35%" }} for="inputGroupSelect01">Address2</label>
                                    <input className="form-control" onInput={e => set_add2(e.target.value)} placeholder='Optional' value={add2} type="text" id="add2"
                                    />
                                </div>

                                <div className='input-group mb-2 '>
                                    <label class="input-group-text" style={{ width: "35%" }} for="inputGroupSelect01">City</label>
                                    <input required className="form-control" onInput={e => set_city(e.target.value)} placeholder='City/Town' type="text" value={city} id="city"
                                    />
                                </div>

                                <div className='input-group mb-2 '>
                                    <label class="input-group-text" style={{ width: "35%" }} for="inputGroupSelect01">State</label>
                                    <select required className="form-select " onInput={e => set_state(e.target.value)} id="state"
                                        value={state}
                                    >
                                        {stateList}

                                    </select>
                                </div>

                                <div className='input-group mb-2 '>
                                    <label class="input-group-text" style={{ width: "35%" }} for="inputGroupSelect01">Zip</label>
                                    <input required className="form-control" onInput={e => set_zipCode(e.target.value)} value={zipCode} placeholder='Zip-Code' type="text" id="zip"
                                    />
                                </div>

                                <div className='input-group mb-2 '>
                                    <label class="input-group-text" style={{ width: "35%" }} for="inputGroupSelect01">Country</label>

                                    <select required className="form-select " onInput={e => set_country(e.target.value)}
                                        id="country" value={country}
                                    >
                                        {countryList}

                                    </select>

                                </div>
                                <div className='input-group mb-2' >
                                    <label class="input-group-text" style={{ width: "35%" }} for="inputGroupSelect01">UTC</label>

                                    <input className='form-control' value={dateTime} />
                                </div>
                                <div className='input-group mb-2 '>
                                    <label class="input-group-text small" style={{ width: "35%" }} for="inputGroupSelect01">Other Language(s)</label>
                                    <select className="form-select " placeholder='Optional'
                                        onChange={e => setSecLang(e.target.value)} id="state" value={secLan}
                                    >
                                        <option value="null">Select Language</option>
                                        {
                                            lang_list.map(item =>

                                                <option selected={item === lang ? 'selected' : ''}
                                                    value={item}>{item}</option>
                                            )
                                        }

                                    </select>
                                </div>

                            </div>
                        </div>
                        <div className='d-flex flex-column border rounded shadow p-2 m-2'
                            style={{ gap: "2%" }}>
                            <h6 className='mb-3'>Parent Info</h6>
                            <div className='d-flex' style={{ gap: "2%" }}>
                                <div className='input-group mb-2 '>
                                    <label class="input-group-text" style={{ width: "35%" }} for="inputGroupSelect01">Parent A Email</label>
                                    <input required className="form-control"
                                        onChange={e => setParentAEmail(e.target.value)}
                                        placeholder='Parent A Email'
                                        type="email" value={parentAEmail} />
                                </div>

                                <div className='input-group mb-2 '>
                                    <label class="input-group-text" style={{ width: "35%" }} for="inputGroupSelect01">Parent A Name</label>
                                    <input required className="form-control"
                                        onChange={e => setParentAName(e.target.value)} placeholder='Parent A Name'
                                        type="text" value={parentAName} />
                                </div>
                            </div>
                            <div className='d-flex' style={{ gap: "2%" }}>
                                <div className='input-group mb-2'>
                                    <label class="input-group-text" style={{ width: "35%" }} for="inputGroupSelect01">Parent B Email</label>
                                    <input required className="form-control"
                                        onChange={e => setParentBEmail(e.target.value)}
                                        placeholder='Parent B Email' type="email" value={parentBEmail} />
                                </div>

                                <div className='input-group mb-2 '>
                                    <label class="input-group-text" style={{ width: "35%" }} for="inputGroupSelect01">Parent B Name</label>
                                    <input required className="form-control"
                                        onChange={e => setParentBName(e.target.value)}
                                        placeholder='Parent B Name' type="text" value={parentBName}
                                    />
                                </div>
                            </div>
                            <div
                                style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    width: '100%', display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap'
                                }}>

                                <h5>Parent(s) video recording consent</h5>
                                <div className="form-check form-switch d-flex gap-3"

                                    style={{ fontSize: "16px " }}>
                                    <input required className="form-check-input m-1"
                                        type="checkbox"
                                        role="switch"


                                        style={{
                                            width: "30px",
                                            height: "15px"
                                        }}
                                        onChange={() => { set_parentConsent(!parentConsent) }}
                                        checked={parentConsent === "true" || parentConsent === true}
                                    />
                                    <label className="form-check-label mr-3" htmlFor="flexSwitchCheckChecked" >
                                        Parent(s) consent to record lesson.
                                    </label>
                                    <Tooltip text="Enable this switch to consent video recording for ensuring quality of service. The video clip stored for 30 days, then be deleted from The academy servers." width="200px">
                                        <FaInfoCircle size={18} color="#0096ff" />
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Actions
                    loading={saving}
                />
            </form>
        </>
    );
}

export default StudentSetup;