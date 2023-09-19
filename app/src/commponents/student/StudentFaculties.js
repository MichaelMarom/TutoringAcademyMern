import { useTable } from 'react-table';
import { useEffect, useLayoutEffect, useState } from 'react';

import { COLUMNS,DATA } from '../../Tables/Faculty/columns';
import { useMemo } from 'react';
import { get_student_short_list_data, get_tutor_subject, upload_student_short_list } from '../../axios/student';

const StudentFaculties = () => {

    const [response, setResponse] = useState([]);
    const [data, setData] = useState([]);

    const columns = useMemo(() => COLUMNS, []);

    useEffect(() => {
        get_tutor_subject('1')
        .then((result) => {
            setResponse(result)
            console.log(response)
        })
        .catch((err) => setResponse(err))

        
    }, [])

    let getTutorSubject = e => {
        let subject = e.target.dataset.id;

        get_tutor_subject(subject)
        .then((result) => {
            setResponse(result);
            console.log(response)

        })
        .catch((err) => setResponse(err))
    }

    useEffect(() => {
        document.querySelector('#student-save').onclick = () => {
            document.querySelector('.save-overlay').setAttribute('id', 'save-overlay')

            let list = [...document.querySelectorAll('#student-tutor')];
            let doc = list.filter(item => 
                item.children[0].checked === true 
            )

            let data = doc.map(item => item.dataset.id)
            console.log(data)
            if(data[0]){
               
                let list = data[0].split('-')
                //let response = upload_student_short_list(list[0],list[1],list[3],list[2]);
                let response = upload_student_short_list(data)

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
                            document.querySelector('.tutor-popin').removeAttribute('id');
                        }, 5000);
    
                    //}
                    /*else{
                        window.localStorage.setItem('tutor_user_id', response.user);
                        window.localStorage.setItem('tutor_screen_name', response.screen_name);
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
        get_student_short_list_data()
        .then((result) => {
            let list = [...document.querySelectorAll('#student-tutor')];

            result.map(item => {
                let elem = list.filter(response => response.dataset.id.split('-')[0] === item.AcademyId && response.dataset.id.split('-')[1] === item.Subject)
                console.log(elem)
                if(elem.length > 0){
                    elem[0].children[0].checked = true;
                }
            })
            console.log(result)
        })
        .catch((err) => console.log(err))
    },[response])

     
    let multi_student_cols = [{Header: '# Select'}, {Header: 'Subject'}, {Header: 'Tutor'}, {Header: 'Experience'}, {Header: 'Certification', }, {Header: 'State', }, {Header: 'Expiration', }, {Header: 'Rate', }]


    const tableInstance = useTable({columns, data})

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

    return ( 
        <>

            <div className="tutor-popin"></div>
            <div className="save-overlay">
                <span class="save_loader"></span>
            </div>
            <div className="form-subjects">
                <div className="form-subjects-info">
                    {/*<input type='text' placeholder='Type your subject here' />
                    <input type='text' placeholder='Type your faculty here' />
                    <input type='text' placeholder='Select level' />
                    <input type='text' placeholder='Select experience' />
                    <input type='text' placeholder='Select Certification' />
                    <input type='text' placeholder='Select state' />
                    <input type='text' placeholder='Country' />
    <input type='text' placeholder='Day state' />*/}

                    <input type="submit" value="Upload" />
                </div>
                <div className="form-subject-alert">
                    <p style={{fontSize: 'large', fontWeight: 'bold', color: 'blue', width: '100%', textAlign: 'center'}}>400+ subjects to select from, across of 12 faculties for tutoring.</p>
                </div>

                <div className="form-subject-data-tabs" style={{display: 'flex', margin: 'auto', padding: '0 0 10px 0', justifyContent: 'center', alignItems: 'center', overflowX: 'auto', width: '100%'}}>
                    <div data-id='1' onClick={getTutorSubject} style={{cursor: 'pointer', margin: '0 10px 0 10px', width: 'fit-content', padding: '0', flexShrink: '0'}} >Math</div>
                    <div data-id='2' onClick={getTutorSubject} style={{cursor: 'pointer', margin: '0 10px 0 10px', width: 'fit-content', padding: '0', flexShrink: '0'}}>Computer Language</div>
                    <div data-id='3' onClick={getTutorSubject} style={{cursor: 'pointer', margin: '0 10px 0 10px', width: 'fit-content', padding: '0', flexShrink: '0'}}>English</div>
                    <div data-id='4' onClick={getTutorSubject} style={{cursor: 'pointer', margin: '0 10px 0 10px', width: 'fit-content', padding: '0', flexShrink: '0'}}>Languages</div>
                    <div data-id='5' onClick={getTutorSubject} style={{cursor: 'pointer', margin: '0 10px 0 10px', width: 'fit-content', padding: '0', flexShrink: '0'}}>Elementary Education</div>
                    <div data-id='6' onClick={getTutorSubject} style={{cursor: 'pointer', margin: '0 10px 0 10px', width: 'fit-content', padding: '0', flexShrink: '0'}}>Science</div>
                    <div data-id='7' onClick={getTutorSubject} style={{cursor: 'pointer', margin: '0 10px 0 10px', width: 'fit-content', padding: '0', flexShrink: '0'}}>Art </div>
                    <div data-id='8' onClick={getTutorSubject} style={{cursor: 'pointer', margin: '0 10px 0 10px', width: 'fit-content', padding: '0', flexShrink: '0'}}>Social Studies </div>
                    <div data-id='9' onClick={getTutorSubject} style={{cursor: 'pointer', margin: '0 10px 0 10px', width: 'fit-content', padding: '0', flexShrink: '0'}}>Programming</div>
                    <div data-id='10' onClick={getTutorSubject} style={{cursor: 'pointer', margin: '0 10px 0 10px', width: 'fit-content', padding: '0', flexShrink: '0'}}>TestProp</div>
                    <div data-id='11' onClick={getTutorSubject} style={{cursor: 'pointer', margin: '0 10px 0 10px', width: 'fit-content', padding: '0', flexShrink: '0'}}>Business</div>
                    <div data-id='12' onClick={getTutorSubject} style={{cursor: 'pointer', margin: '0 10px 0 10px', width: 'fit-content', padding: '0', flexShrink: '0'}}></div>
                    <div data-id='13' onClick={getTutorSubject} style={{cursor: 'pointer', margin: '0 10px 0 10px', width: 'fit-content', padding: '0', flexShrink: '0'}}></div>
                    <div data-id='14' onClick={getTutorSubject} style={{cursor: 'pointer', margin: '0 10px 0 10px', width: 'fit-content', padding: '0', flexShrink: '0'}}></div>
                    <div data-id='15' onClick={getTutorSubject} style={{cursor: 'pointer', margin: '0 10px 0 10px', width: 'fit-content', padding: '0', flexShrink: '0'}}>Aviation</div>
                    <div data-id='16' onClick={getTutorSubject} style={{cursor: 'pointer', margin: '0 10px 0 10px', width: 'fit-content', padding: '0', flexShrink: '0'}}>Engineering</div>
                </div>

                <div id="form-subject-data-collection-table">
                    

                    <div className="highlight" style={{width: '100%'}}>
                        Click on the faculty above to show all subjects as being tought by the Tutors. Click on the Tutor's rate to view his/hers multi students, and/or Subscription discounts. Check box the Tutor(s) of interest and it be saved to your "Short" list.  
                    </div>

                    <div className="form-subject-search-bar">
                        <div>
                            <label style={{float: 'left', border: '1px solid #eee', padding: '5px 10px 0 10px'}} htmlFor="search"><h6>Search accross all faculties. type the subject of interest then checkbox to select</h6></label>

                            <div className="search-bar">
                                <input type="search" placeholder='Search Here...' id="search" tyle={{ outline: 'none', border: 'none'}} /> 
                                <input type="button" value="Search " style={{width: '50px', outline: 'none', border: 'none'}} />
                            </div>
                            

                        </div>

                    </div>

                    <table>
                        <thead>
                            <tr>
                                {multi_student_cols.map(item => <th key={item.Header}>{item.Header}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            
                            

                                
                            {

                                response.map((item) => 
                                    <tr>
                                        <td id='student-tutor' data-id={`${item[0].AcademyId}-${item[0].subject}-${item[0].rate}-${item[2].TutorScreenname}`}>

                                            <input type='checkbox'style={{height: '20px', width: '20px'}}  />
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

                                
                                //subscription_dicount.map((item, index) => 
                                    //<tr key={index}>
                                       // <td>{(index + 1) * 4 }</td>

                                        //<td>
                                            //<input  onInput={e => setSubscriptionPlan(e.target.value)} type='radio'/*onInput={e => item === document.querySelector('#custom-rate') ? document.querySelector('#custom-rate').value : item}*/ name='student-subscription' id='student-subscription' style={{margin: '8px 0 0 0', cursor: 'pointer', height: '20px', width: '20px'}}/>
                                        //</td>

                                        //</tbody><td>{item}</td>
                                   // </tr>
                                //)
                                
                            }
                            
                            
                        </tbody>
                    </table>
                </div>
            </div>
        </>
     );
}
 
export default StudentFaculties;