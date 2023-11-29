import { useState } from 'react';
import Skeleton from 'react-loading-skeleton'
import { useEffect } from 'react';
import { get_faculty, get_rates, get_subject, get_user_data, upload_new_subject, upload_tutor_rates } from '../../axios/tutor';
import { COLUMNS } from '../../Tables/Subject/columns';
import { socket } from '../../socket';


const Subjects = () => {

    let [newSubjectFaculty, setNewSubjectFaculty] = useState([]);

    let [newSubjectFacultyData, setNewSubjectFacultyData] = useState('');
    let [newSubjectData, setNewSubjectData] = useState('');
    let [newSubjectReasonData, setNewSubjectReasonData] = useState('');

    let [emptyData, set_emptyData] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);


    let [newSubject, setNewSubject] = useState(false)

    let [faculty, set_faculty] = useState([])

    let [active_course, set_active_course] = useState([])

    useEffect(() => {
        let next = document.querySelector('.tutor-next')

        if (next && next.hasAttribute('id')) {
            next?.removeAttribute('id');
        }
    }, [])

    useEffect(() => {
        let user_id = window.localStorage.getItem('tutor_user_id');
        get_rates(window.localStorage.getItem('tutor_user_id'))
            .then((result) => {
                console.log(result)

                result.map(item => {
                    let c = item.subject
                    let t = document.querySelector('.tables')
                    let files = [...t.querySelectorAll('input[type=checkbox]')]
                    let r = files.filter((item) =>
                        item.value.toLowerCase() === c.toLowerCase()
                    )

                    get_user_data(user_id)
                        .then((result) => {
                            r[0].checked = true;
                            let elms = r[0].parentElement.parentElement.children;

                            elms[2].innerHTML = result[0].EducationalLevel;
                            elms[3].innerHTML = result[0].EducationalLevelExperience;
                            elms[4].innerHTML = result[0].Certificate;
                            elms[5].innerHTML = result[0].CertificateState;
                            elms[6].innerHTML = result[0].CertificateExpiration;
                            elms[7].innerHTML = `$ <input style='height: 25px; width: 40px; margin: 0;' type='text' placeholder='Dollars' value='${item.rate.split('').splice(1, 2).join('')}' maxlength='2' />.<input style='height: 25px; width: 40px; margin: 0;' type='text' placeholder='cents' value='${item.rate.split('').splice(4, 5).join('')}' maxlength='2' /> `;

                        })
                        .catch((err) => err)

                })
            }, [])
            .catch((err) => console.log(err))
    })

    let populate_col = e => {
        if (e.target.checked) {


            let user_id = window.localStorage.getItem('tutor_user_id');

            console.log(user_id)

            get_user_data(user_id)
                .then((result) => {
                    let data = result;
                    //console.log([...e.target.parentElement.parentElement.children][2].innerHTML)

                    let elms = [...e.target.parentElement.parentElement.children];

                    elms[2].innerHTML = result[0].EducationalLevel;
                    elms[3].innerHTML = result[0].EducationalLevelExperience;
                    elms[4].innerHTML = result[0].Certificate;
                    elms[5].innerHTML = result[0].CertificateState;
                    elms[6].innerHTML = result[0].CertificateExpiration;
                    elms[7].innerHTML = "$ <input style='height: 25px; width: 40px; margin: 0;' type='text' placeholder='Dollars' value='00' maxlength='2' />.<input style='height: 25px; width: 40px; margin: 0;' type='text' placeholder='cents' value='00' maxlength='2' /> ";

                    console.log(data)
                })
                .catch((err) => err)
        } else {
            let elms = [...e.target.parentElement.parentElement.children];

            elms[2].innerHTML = ''
            elms[3].innerHTML = ''
            elms[4].innerHTML = ''
            elms[5].innerHTML = ''
            elms[6].innerHTML = ''
            elms[7].innerHTML = ''


            let AcademyId = window.localStorage.getItem('tutor_user_id');
            let subject = e.target.value;

            socket.emit('DeleteSubjectRate', { AcademyId, subject })
        }


    }

    useEffect(() => {
        get_subject(1)
            .then((result) => set_active_course(result.recordset))
            .catch((err) => err)

    }, []);

    let getSubject = (id) => {
        get_subject(id)
            .then((result) => set_active_course(result.recordset))
            .catch((err) => err)
    }



    let handle_active_course = e => {
        let elem = e.currentTarget;
        //let tables = [...document.querySelectorAll('table')];
        //let active_table = tables.filter(item => !item.hasAttribute('id'));
        //active_table[0]?.setAttribute('id', 'hide_table');
        let index_of_elem = [...elem.parentElement.children].indexOf(elem);
        getSubject(index_of_elem + 1);
        //tables[index_of_elem]?.removeAttribute('id');


        let deactivedElem = [...elem.parentElement.children].filter(item => item.hasAttribute('id'))[0];
        deactivedElem?.removeAttribute('id');
        elem?.setAttribute('id', 'table_options_menu')



    }

    useEffect(() => {
        get_faculty()
            .then((result) => {
                let list = result.map(item => {
                    return (
                        <option data-id={item.id} value={`${item.Faculty}-${item.Id}`}>{item.Faculty}</option>
                    )
                })
                set_faculty(result)
                console.log(result)

                setNewSubjectFaculty(list)
            })
            .catch(err => console.log(err))
    }, [])


    let handle_scroll_right = () => {

        let div = document.querySelector('.tutor-tab-subject-data-tabs');
        let scroll_elem = div.children[1];
        console.log(scroll_elem)
        let w = scroll_elem.offsetWidth;
        scroll_elem.scrollLeft = w;

    }

    let handle_scroll_left = () => {

        let div = document.querySelector('.tutor-tab-subject-data-tabs');
        let scroll_elem = div.children[1];
        let w = scroll_elem.offsetWidth;
        scroll_elem.scrollLeft = -w

    }


    let save = document.querySelector('#tutor-save');
    if (save)
        save.onclick = () => {
            let checkboxs = [...document.querySelectorAll('input[type=checkbox]')];
            let checkedbox = checkboxs.filter(item => item.checked)
            let values = checkedbox.map(item => {
                return [...item.parentElement.parentElement.children]
            })
            let AcademyId = window.localStorage.getItem('tutor_user_id');
            let rate_list = [];
            let rate_err = []

            let result = () => {
                let file = values.map((item, index, array) => {
                    // console.log(item[7].children, 'item')
                    if (`${item[7].children[0]?.value}.${item[7].children[1]?.value}` !== '00.00') {
                        //document.querySelector('.save-overlay')?.setAttribute('id', 'save-overlay')
                        let doc = { faculty: item[1].dataset.src, course: item[1].innerHTML, rate: "$" + item[7].children[0]?.value + "." + item[7].children[1]?.value }
                        // item[7].children[0]?.style.border = '1px solid #000';
                        // item[7].children[1]?.style.border = '1px solid #000';
                        rate_list.push(doc)
                        rate_err.push(true)


                    } else {
                        // if (item[7].children[1] && item[7].children[0]) {
                        //     item[7].children[1]?.style.border = '1px solid red';
                        //     item[7].children[0]?.style.border = '1px solid red';
                        // }
                        rate_err.push(false)
                        //return false;
                    }

                })

                let upload_agent = (items, id) => {

                    upload_tutor_rates(items, id)
                        .then((result) => {
                            if (result) {
                                setTimeout(() => {
                                    document.querySelector('.save-overlay')?.removeAttribute('id');
                                }, 1000);

                                document.querySelector('.tutor-popin')?.setAttribute('id', 'tutor-popin');
                                document.querySelector('.tutor-popin').innerHTML = 'Data Was Saved Successfully...'
                                setTimeout(() => {
                                    document.querySelector('.tutor-popin')?.removeAttribute('id');
                                }, 2000);
                            } else {

                                document.querySelector('.tutor-popin')?.setAttribute('id', 'tutor-popin');
                                document.querySelector('.tutor-popin').innerHTML = 'Data Was Not Saved Successfully...'
                                setTimeout(() => {
                                    document.querySelector('.tutor-popin')?.removeAttribute('id');
                                }, 2000);

                            }
                        })
                        .catch((err) => console.log(err))
                }

                let errCheck = rate_err.filter(item => item === false)
                if (errCheck.length > 0) {
                    alert('Please Ensure The Rate Field Is At Least $1')
                } else {
                    document.querySelector('.save-overlay')?.setAttribute('id', 'save-overlay')
                    upload_agent(rate_list, AcademyId)
                }


            }

            result()
        }

    let newSubjectCheckBox = e => {

        let user_id = window.localStorage.getItem('tutor_user_id');

        console.log(user_id)
        if (e.target.checked) {
            setNewSubject(true)
            get_user_data(user_id)
                .then((result) => {
                    let data = result;
                    let elms = [...e.target.nextElementSibling.children];
                })

        } else {
            setNewSubject(false)
        }
    }

    let uploadNewSubject = e => {

        let saver = () => {
            let user_id = window.localStorage.getItem('tutor_user_id');


            upload_new_subject(newSubjectFacultyData.split('-')[0], newSubjectData, newSubjectReasonData, user_id, newSubjectFacultyData.split('-')[1])
                .then((result) => {
                    if (result) {
                        setTimeout(() => {
                            document.querySelector('.save-overlay')?.removeAttribute('id');
                        }, 1000);

                        document.querySelector('.tutor-popin')?.setAttribute('id', 'tutor-popin');
                        document.querySelector('.tutor-popin').innerHTML = 'Data Was Saved Successfully...'
                        setTimeout(() => {
                            document.querySelector('.tutor-popin')?.removeAttribute('id');
                        }, 2000);
                        let list = [...document.querySelectorAll('#new-sub')]
                        let validate = list.map(item => item.value = '');
                        document.querySelector('#new_sub_check_box').checked = false
                    } else {

                        document.querySelector('.tutor-popin')?.setAttribute('id', 'tutor-popin');
                        document.querySelector('.tutor-popin').innerHTML = 'Data Was Not Saved Successfully...'
                        setTimeout(() => {
                            document.querySelector('.tutor-popin')?.removeAttribute('id');
                        }, 2000);

                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }

        let list = [...document.querySelectorAll('#new-sub')]
        let validate = list.filter(item => item.value === '');
        let ll = list.filter(item => item.value === '');

        if (validate.length > 0) {

            validate.map(item => item.style.border = '1px solid red');
            alert('Please Ensure No Field Is Empty')

        } else {
            validate.forEach(item => console.log(item.style));
            console.log()
            let list = [...document.querySelectorAll('#new-sub')]
            list.map(item => item.style.border = '1px solid black')
            document.querySelector('.save-overlay')?.setAttribute('id', 'save-overlay');
            saver()

        }






    }

    return (
        <>
            <div className="tutor-popin"></div>
            <div className="save-overlay">
                <span className="save_loader"></span>
            </div>
            <div className="tutor-tab-subjects">
                <div className="tutor-tab-subject-alert">
                    <p style={{ fontSize: 'medium', fontWeight: 'bold', color: 'blue', width: '100%', textAlign: 'center' }}>There are 400+ subjects across 29 faculties to select from for tutoring. Didn't find your subject? List your expertise below and upload (submit) for review. We may list your subject after examination.</p>
                </div>
                <div className="tutor-tab-subjects-info" style={{ display: 'flex', flexDirection: 'column', background: '#e7e7e7', position: 'relative', alignItems: 'center', justifyContent: 'center', height: '70px', width: '100%', margin: 'auto' }}>

                <input onInput={newSubjectCheckBox} id='new_sub_check_box' type='checkbox' style={{ height: '30px', position: 'absolute', left: '45px', top: '8px', width: '30px', margin: '10px 0 0 0', cursor: 'pointer' }} />

                    <div style={{ width: '70%', margin: 'auto', opacity: newSubject ? '1' : '.5', pointerEvents: newSubject ? 'all' : 'none' }}>
                        <div style={{ width: '45%', padding: '5px', display: 'flex', flexDirection: 'row', alignItems: 'center', margin: 'auto,', float: 'left', height: '100%' }}>

                            
                            <select id='new-sub' onInput={e => setNewSubjectFacultyData(e.target.value)} style={{ float: 'right', ontSize: 'small', background: '#fff', width: '180px', height: '60px', margin: '0 0 0 0' }} type='text' >
                                <option value={''}>Select Faculty</option>
                                {newSubjectFaculty}
                            </select>
                            &nbsp;&nbsp;&nbsp;&nbsp;

                            <input id='new-sub' onInput={e => setNewSubjectData(e.target.value)} style={{ float: 'left', ontSize: 'small', background: '#fff', width: '180px', height: '60px', margin: '0 0 0 0' }} type='text' placeholder='Type your subject here' />

                        </div>



                        <div style={{ width: '50%', height: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', margin: 'auto', padding: '5px', float: 'right' }}>
                            <textarea id='new-sub' onInput={e => setNewSubjectReasonData(e.target.value)} style={{ width: '100%', height: '60px', background: '#fff', padding: '10px' }} placeholder='Summarize Your Reason In Not More Than 700 Characters For Adding This Subject '>

                            </textarea>
                        </div>




                        {/* <input style={{fontSize: 'small',width: 'calc(100% / 10)', margin: '0 5px 0 5px'}} type='text' placeholder='Select level' />
                        <input style={{fontSize: 'small',width: 'calc(100% / 10)', margin: '0 5px 0 5px'}} type='text' placeholder='Select experience' />
                        <input style={{fontSize: 'small',width: 'calc(100% / 10)', margin: '0 5px 0 5px'}} type='text' placeholder='Select Certification' />
                        <input style={{fontSize: 'small',width: 'calc(100% / 10)', margin: '0 5px 0 5px'}} type='text' placeholder='Select state' />
                        <input style={{fontSize: 'small',width: 'calc(100% / 10)', margin: '0 5px 0 5px'}} type='text' placeholder='Country' />
    <input style={{fontSize: 'small',width: 'calc(100% / 10)', margin: '0 5px 0 5px'}} type='text' placeholder='Day state' />*/}
                    </div>



                    <input onClick={uploadNewSubject} style={{ fontSize: 'small', background: 'green', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer', width: '80px', margin: '0 5px 0 5px', position: 'absolute', right: '45px', top: '15px' }} type="submit" value="Upload" />
                </div>

                <br />



                <div className="tutor-tab-subject-data-collection-table">

                    <div className="tutor-tab-subject-data-tabs">
                        <div style={{
                            margin: '0 0 0 0', display
                                : 'flex', alignItems: 'center', justifyContent: 'center', background: '#efefef', opacity: '.7', height: '100%', transform: 'skew(-0deg)'
                        }} className="scroller-left" onClick={handle_scroll_left}>
                            <div style={{ opacity: '1' }}>
                                <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 9L8 12M8 12L11 15M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>

                        </div>


                        <ul>


                            {
                                faculty.map((item, index) =>
                                    index === 0
                                        ?
                                        <li className='tutor-tab-subject-data-menu' id='table_options_menu' onClick={e => set_active_course(handle_active_course(e))}><a>{item.Faculty}</a></li>
                                        :
                                        <li className='tutor-tab-subject-data-menu' onClick={e => set_active_course(handle_active_course(e))}><a>{item.Faculty}</a></li>

                                )
                            }
                        </ul>

                        <div style={{
                            margin: '0 0 0 0', background: '#efefef', display
                                : 'flex', alignItems: 'center', justifyContent: 'center', opacity: '.7', height: '100%', transform: 'skew(-0deg)'
                        }} className="scroller-right" onClick={handle_scroll_right}>
                            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">``
                                <path d="M13 15L16 12M16 12L13 9M16 12H8M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>

                        </div>

                    </div>

                    <div className="highlight">
                        Checkbox any subject in any faculty where you are proficient enough to tutor, Ultimately you are being rated by the students feedback, if students feedback is only 2 stars then its free checkbox the subject then select the certificate, state expiration if available. Then click on the rate button which will pop up a table to select your rate
                    </div>




                    <div className="tables" style={{ height: '430px', width: '100%', overflow: 'auto', padding: '5px' }}>

                        <table style={{ position: 'relative' }}>
                            <thead >
                                <tr>
                                    {COLUMNS.map(item => <th key={item.Header}>{item.Header}</th>)}
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    active_course
                                        ?
                                        active_course.map((item, index) =>

                                            <tr key={index}>

                                                <td className={item.SubjectName} data-src={item.FacultyId}><input type='checkbox' onInput={populate_col} style={{ margin: '8px 0 0 0', cursor: 'pointer', height: '20px', width: '20px' }} value={item.SubjectName} /></td>

                                                <td data-src={item.FacultyId}>{item.SubjectName}</td>

                                                <td data-src={item.FacultyId}></td>
                                                <td data-src={item.FacultyId}></td>
                                                <td data-src={item.FacultyId}></td>
                                                <td data-src={item.FacultyId}></td>
                                                <td data-src={item.FacultyId}></td>
                                                <td data-src={item.FacultyId}></td>
                                            </tr>
                                        )

                                        :

                                        emptyData.map((item) =>
                                            <tr >

                                                <td ><Skeleton count={1} /></td>
                                                <td ><Skeleton count={1} /></td>
                                                <td ><Skeleton count={1} /></td>
                                                <td ><Skeleton count={1} /></td>
                                                <td ><Skeleton count={1} /></td>
                                                <td ><Skeleton count={1} /></td>
                                                <td ><Skeleton count={1} /></td>
                                                <td ><Skeleton count={1} /></td>

                                            </tr>
                                        )
                                }


                            </tbody>
                        </table>



                    </div>

                </div>


            </div>
        </>
    );
}

export default Subjects;