import { useTable } from 'react-table';
import { useEffect, useLayoutEffect, useState } from 'react';

import { COLUMNS,DATA } from '../../Tables/Faculty/columns';
import { useMemo } from 'react';
import { get_student_short_list_data, get_tutor_subject, upload_student_short_list } from '../../axios/student';
import { socket } from '../../socket';

const StudentFaculties = () => {

    const [response, setResponse] = useState([]);
    const [data, setData] = useState([]);
    const [badData, setbadData] = useState([]);

    const columns = useMemo(() => COLUMNS, []);

    useEffect(() => {
        get_tutor_subject('1')
        .then((result) => {
            setResponse(result)
            result.sort(function (a, b) {
                if (a[0].subject < b[0].subject) {
                  return -1;
                }
                if (a[0].subject > b[0].subject) {
                  return 1;
                }
                return 0;
            });
            console.log(result)
        })
        .catch((err) => setResponse(err))

        
    }, [])

    let getTutorSubject = e => {
        let subject = e.currentTarget.dataset.id;

        get_tutor_subject(subject)
        .then((result) => {
            setResponse(result);
            result.sort(function (a, b) {
                if (a[0].subject < b[0].subject) {
                  return -1;
                }
                if (a[0].subject > b[0].subject) {
                  return 1;
                }
                return 0;
            });
            console.log(result)

        })
        .catch((err) => setResponse(err))

        let clickedElem = e.currentTarget;
        let deactivedElem = [...clickedElem.parentElement.children].filter(item => item.hasAttribute('id'))[0];

        deactivedElem.removeAttribute('id');
        clickedElem.setAttribute('id', 'form-subject-data-tabs-list-active')
    }

    let handle_scroll_right = () => {

        let div = document.querySelector('.form-subject-data-tabs');
        let scroll_elem = div.children[1];
        //console.log(scroll_elem) 
        let w = scroll_elem.offsetWidth;
        scroll_elem.scrollLeft = w;

    }

    let handle_scroll_left = () => {
        
        let div = document.querySelector('.form-subject-data-tabs');
        let scroll_elem = div.children[1];
        let w = scroll_elem.offsetWidth;
        scroll_elem.scrollLeft = -w

    }


    useEffect(() => {
        document.querySelector('#student-save').onclick = () => {
            document.querySelector('.save-overlay').setAttribute('id', 'save-overlay')

            let list = [...document.querySelectorAll('#student-tutor')];
            let doc = list.filter(item => 
                item.children[0].checked === true 
            )

            let data = doc.map(item => item.dataset.id)

            if(data[0]){
               
                let list = data[0].split('-')
                //let response = upload_student_short_list(list[0],list[1],list[3],list[2]);
                let response = upload_student_short_list(data);

                if(response){
                        
                    //document.querySelector('form').reset(); 
                    //if(response.type === 'save'){
                       
                        setTimeout(() => {
                            document.querySelector('.save-overlay').removeAttribute('id');
                        }, 1000);
        
                        document.querySelector('.tutor-popin').setAttribute('id', 'tutor-popin');
                        document.querySelector('.tutor-popin').style.background = '#000';
                        document.querySelector('.tutor-popin').innerHTML = 'Data was uploaded successfully...'
                        setTimeout(() => {
                           // document.querySelector('.student-next').setAttribute('id', 'next')

                           if(document.querySelector('.tutor-popin')){
                                document.querySelector('.tutor-popin').removeAttribute('id');
                           }
                        }, 5000);   
    
                    //}
                    /*else{
                        window.localStorage.setItem('tutor_user_id', response.user);
                        window.localStorage.setItem('tutor_screen[0].subject', response.screen_name);
                        setTimeout(() => {
                            document.querySelector('.save-overlay').removeAttribute('id');
                        }, 1000);
        
                        document.querySelector('.tutor-popin').setAttribute('id', 'tutor-popin');
                        document.querySelector('.tutor-popin').style.background = '#000';
                        document.querySelector('.tutor-popin').innerHTML = response.mssg
                        setTimeout(() => {
                            document.querySelector('.tutor-next').setAttribute('id', 'next')
                            document.querySelector('.tutor-popin').removeAttribute('id');
                        }, 5000);
                    }*/
    
                
                }else{
                    setTimeout(() => {
                        document.querySelector('.save-overlay').removeAttribute('id');
                    }, 1000);
                    
                    document.querySelector('.tutor-popin').setAttribute('id', 'tutor-popin');
                    document.querySelector('.tutor-popin').style.background = 'red';
                    document.querySelector('.tutor-popin').innerHTML = response.mssg
                    setTimeout(() => {
                        document.querySelector('.tutor-popin').removeAttribute('id');
                    }, 5000);
    
                }

            }
        }
    },[])

    useEffect(() => {
        console.log(badData)
    }, [badData])

    
    useEffect(() => {
        get_student_short_list_data(window.localStorage.getItem('student_user_id'))
        .then((result) => {
            let list = [...document.querySelectorAll('#student-tutor')];

            result.map(item => {
                let elem = list.filter(response => response.dataset.id.split('-')[0] === item.AcademyId && response.dataset.id.split('-')[1] === item.Subject)
                if(elem.length > 0){
                    elem[0].children[0].checked = true;
                }
            })
        })
        .catch((err) => console.log(err))
    },[response])

     
    let multi_student_cols = [{Header: '# Select'}, {Header: 'Subject'}, {Header: 'Tutor'}, {Header: 'Experience'}, {Header: 'Certification', }, {Header: 'State', }, {Header: 'Expiration', }, {Header: 'Rate', }]


    const tableInstance = useTable({columns, data})

    let handleBadData = e => {

        let elem = e.target;

        let pElem = elem.parentElement;
        let id = pElem.dataset;
 
        if(!elem.checked){
            socket.emit('studentIllShorList', {id})
        }

    }

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

    return ( 
        <>

            <div className="tutor-popin"></div>
            <div className="save-overlay">
                <span className="save_loader"></span>
            </div>
            <div className="form-subjects" style={{overflow: 'hidden', height: 'calc(100vh - 50px)'}}>
               
                <div className="form-subject-alert">
                    <p style={{fontSize: 'large', fontWeight: 'bold', color: 'blue', width: '100%', textAlign: 'center'}}>400+ subjects to select from across 29 faculties for tutoring.</p>
                </div>

                <div id="form-subject-data-collection-table">

                    <div className="form-subject-data-tabs" style={{display: 'flex', margin: 'auto', padding: '0 0 0 0', justifyContent: 'center', alignItems: 'center', overflowX: 'hidden', width: '100%'}}>
                        
                        <div style={{margin: '0 0 0 0', display
                        : 'flex', alignItems: 'center', justifyContent: 'center',background: '#efefef', opacity: '.7', height: '100%', transform: 'skew(-0deg)'}}  className="scroller-left" onClick={handle_scroll_left}>
                            <div style={{opacity: '1'}}>
                            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 9L8 12M8 12L11 15M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>   
                            </div>           

                        </div>
                        <ul>
                            <li data-id='1' onClick={getTutorSubject} id='form-subject-data-tabs-list-active'><a>Math</a></li>
                            <li data-id='2' onClick={getTutorSubject}><a>Computer Language</a></li>
                            <li data-id='3' onClick={getTutorSubject}><a>English</a></li>
                            <li data-id='4' onClick={getTutorSubject}><a>Languages</a></li>
                            <li data-id='5' onClick={getTutorSubject}><a>Elementary Education</a></li>
                            <li data-id='6' onClick={getTutorSubject}><a>Science</a></li>
                            <li data-id='7' onClick={getTutorSubject}><a>Art </a></li>
                            <li data-id='8' onClick={getTutorSubject}><a>Social Studies </a></li>
                            <li data-id='9' onClick={getTutorSubject}><a>Programming</a></li>
                            <li data-id='10' onClick={getTutorSubject}><a>TestPrep</a></li>
                            <li data-id='11' onClick={getTutorSubject}><a>Business</a></li>
                            <li data-id='12' onClick={getTutorSubject}><a></a></li>
                            <li data-id='13' onClick={getTutorSubject}><a></a></li>
                            <li data-id='14' onClick={getTutorSubject}><a></a></li>
                            <li data-id='15' onClick={getTutorSubject}><a>Aviation</a></li>
                            <li data-id='16' onClick={getTutorSubject}><a>Engineering</a></li>
                        </ul>


                        <div style={{margin: '0 0 0 0',background: '#efefef', display
                        : 'flex', alignItems: 'center', justifyContent: 'center', opacity: '.7', height: '100%', transform: 'skew(-0deg)'}}  className="scroller-right" onClick={handle_scroll_right}>
                        <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">``
                            <path d="M13 15L16 12M16 12L13 9M16 12H8M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>

                        </div>
                </div>

                
                    

                    <div className="highlight" style={{width: '100%'}}>
                        Click on the faculty above to view all subjects as being tought by the Tutors. Check box the Tutor(s) of interest, and "save" to your "Short" list to compare.``  
                    </div>

                    <div className="form-subject-search-bar">
                        <div>
                            <label style={{float: 'left', border: '1px solid #eee', padding: '5px 10px 0 10px'}} htmlFor="search"><h6>From the list below, select the subjects of interest, then click the "Save" botton. The selected subjects can be compared in the next "Short list" tab.                                                               </h6></label>
                        </div>
                    </div>


                    <div className="tables" style={{height: '600px', width: '100%', overflow: 'auto', padding: '5px'}}>
                    
                        <table>
                            <thead>
                                <tr>
                                    {multi_student_cols.map(item => <th key={item.Header}>{item.Header}</th>)}
                                </tr>
                            </thead>

                            {
                                response.length > 0 
                                ?
                                <tbody >
                                    {
                                       
                                        response.map((item) => 
                                            <tr>
                                                <td id='student-tutor' data-id={`${item[0].AcademyId}-${item[0].subject}-${item[0].rate}-${item[2].TutorScreenname}-${window.localStorage.getItem('student_user_id')}`}>

                                                    <input onInput={handleBadData} type='checkbox' style={{height: '20px', width: '20px'}}  />
                                                </td>

                                                <td>{item[0].subject}</td> 
                                                <td>
                                                    {item.splice(-1)[0].TutorScreenname}
                                                </td>
                                                <td>
                                                    {item[1].EducationalLevelExperience}
                                                </td>
                                                <td>
                                                    {item[1].Certificate}
                                                </td>
                                                <td>
                                                    {item[1].CertificateState}
                                                </td>
                                                <td>
                                                    {new Date(item[1].CertificateExpiration).toLocaleDateString()}
                                                </td>
                                                <td>{item[0].rate}</td>
                                            </tr>
                                        )
                                        
                                    }
                                    
                                    
                                </tbody>
                                :
                                <div style={{position: 'absolute', width: '100%', textAlign: 'center', fontSize: 'large', paddingTop: '20px', fontWeight: 'bold'}}>We Are Sorry, There Are No Tutor(s) Available For This Faculty. Please check later, since new tutors register every day.</div>
                            }
                        </table>

                    </div>


                </div>
            </div>
        </>
     );
}
 
export default StudentFaculties;