import { useTable } from 'react-table';
import { useState } from 'react';
import {AnimatePresence} from 'framer-motion'
import { useMemo } from 'react';
import { useEffect } from 'react';
import { get_subject, get_user_data, upload_tutor_rates } from '../../axios/tutor';
import { COLUMNS } from '../../Tables/Subject/columns';

const Subjects = () => {

    const [data, set_data] = useState([]);
    const [data_ready, set_data_ready] = useState(false);
    //let [courses, set_courses] = useState([]);

    
    
    let [math_courses, set_math_courses] = useState([])
    let [software_courses, set_software_courses] = useState([])
    let [eng_courses, set_eng_courses] = useState([])
    let [lang_courses, set_lang_courses] = useState([])
    let [elem_courses, set_elem_courses] = useState([])
    let [sci_courses, set_sci_courses] = useState([])
    let [art_courses, set_art_courses] = useState([])
    let [social_s_courses, set_social_s_courses] = useState([])
    let [code_courses, set_code_courses] = useState([])
    let [test_prep_courses, set_test_prep_courses] = useState([])
    let [business_courses, set_business_courses] = useState([])
    let [health_courses, set_health_courses] = useState([])
    let [life_skill_courses, set_life_skill_courses] = useState([])
    let [aviation_courses, set_aviation_courses] = useState([])
    let [engineering_courses, set_engineering_courses] = useState([])


    let [active_course, set_active_course] = useState([])
   
    let courses = async(cb) => {
        let response = await get_subject()
        .then((result) => result.recordset)
        .catch((err) =>  err) 

        cb(response);
    }

    let populate_col = e => {
       if(e.target.checked){

        
            let user_id = window.localStorage.getItem('user_id');

            get_user_data(user_id)
            .then((result) => {
                let data = result;
                let elms = [...e.target.parentElement.parentElement.children];

                elms[2].innerHTML = result[1].EducationalLevel;
                elms[3].innerHTML = result[1].EducationalLevelExperience;
                elms[4].innerHTML = result[1].Certificate;
                elms[5].innerHTML = result[1].CertificateState;
                elms[6].innerHTML = result[1].CertificateExpiration;
                elms[7].innerHTML = "$ <input style='height: 25px; width: 40px; margin: 0;' type='text' placeholder='Dollars' value='00' maxlength='2' />.<input style='height: 25px; width: 40px; margin: 0;' type='text' placeholder='cents' value='00' maxlength='2' /> ";

                let refined_elms = elms.splice(2, elms.length);
                console.log(refined_elms)
                console.log(data)
            })
            .catch((err) =>  err) 
        }else{
            let elms = [...e.target.parentElement.parentElement.children];

            elms[2].innerHTML = ''    
            elms[3].innerHTML = ''
            elms[4].innerHTML = '' 
            elms[5].innerHTML = ''     
            elms[6].innerHTML = ''    
            elms[7].innerHTML = ''    
        }
    }

    useEffect(() => {

        courses((data) => {

            data.map((item) => {
                let id = item.FacultyId
                if(id === 1){
                    set_math_courses(old_list => [...old_list, item])
                }else if(id === 2){
                    set_software_courses(old_list => [...old_list, item])
                }else if(id === 3){
                    set_eng_courses(old_list => [...old_list, item])
                }else if(id === 4){
                    set_lang_courses(old_list => [...old_list, item])
                }else if(id === 5){
                    set_elem_courses(old_list => [...old_list, item])
                }else if(id === 6){
                    set_sci_courses(old_list => [...old_list, item])
                }else if(id === 7){
                    set_art_courses(old_list => [...old_list, item])
                }else if(id === 8){
                    set_social_s_courses(old_list => [...old_list, item])
                }else if(id === 9){
                    set_code_courses(old_list => [...old_list, item])
                }else if(id === 10){
                    set_test_prep_courses(old_list => [...old_list, item])
                }else if(id === 11){
                    set_business_courses(old_list => [...old_list, item])
                }else if(id === 12){
                    set_health_courses(old_list => [...old_list, item])
                }else if(id === 13){
                    set_life_skill_courses(old_list => [...old_list, item])
                }else if(id === 14){
                    //set_//aviation_courses(old_list => [...old_list, item]) 
                }else if(id === 15){
                    set_aviation_courses(old_list => [...old_list, item])
                }else if(id === 16){
                    set_engineering_courses(old_list => [...old_list, item])
                }
            })

        })

    }, []);
    

    useEffect(() => {
        set_active_course(math_courses)
    }, []) 

    let handle_active_course = e => {
        let elem = e.target;
        let tables = [...document.querySelectorAll('table')];
        let active_table = tables.filter(item => !item.hasAttribute('id'));
        active_table[0].setAttribute('id', 'hide_table');


        let index_of_elem = [...elem.parentElement.children].indexOf(elem);
        tables[index_of_elem].removeAttribute('id');

    }

    let save = document.querySelector('#save');
    save.onclick = () => {
        let checkboxs = [...document.querySelectorAll('input[type=checkbox]')];
        let checkedbox = checkboxs.filter(item => item.checked)
        let values = checkedbox.map(item => {
            return [...item.parentElement.parentElement.children]
        })
        let AcademyId = window.localStorage.getItem('user_id');
        let rate_list = [];

        let result = () => {
            let file = values.map((item, index, array) => {

                if( `${item[7].children[0].value}.${item[7].children[1].value}`  !== '00.00'){
                    document.querySelector('.save-overlay').setAttribute('id', 'save-overlay')
                    let doc = {faculty: item[1].dataset.src, course: item[1].innerHTML, rate: "$" + item[7].children[0].value + "." + item[7].children[1].value}
                    rate_list.push(doc)

                }

            })

            upload_tutor_rates(rate_list, AcademyId)
            .then((result) => {
                if(result){
                    setTimeout(() => {
                        document.querySelector('.save-overlay').removeAttribute('id');
                    }, 1000);
    
                    document.querySelector('.tutor-popin').setAttribute('id', 'tutor-popin');
                    document.querySelector('.tutor-popin').innerHTML = 'Data Was Saved Successfully...'
                    setTimeout(() => {
                        document.querySelector('.tutor-popin').removeAttribute('id');
                    }, 2000);
                }else{
                    document.querySelector('.tutor-popin').setAttribute('id', 'tutor-popin');
                    document.querySelector('.tutor-popin').innerHTML = 'Data Was Not Saved Successfully...'
                    setTimeout(() => {
                        document.querySelector('.tutor-popin').removeAttribute('id');
                    }, 2000);
    
                }
            })
            .catch((err) => console.log(err))

          
        }

        result()
    }
    return ( 
        <>
            <div className="tutor-popin"></div>
            <div className="save-overlay">
                <span class="save_loader"></span>
            </div>
            <div className="tutor-tab-subjects">
                <div className="tutor-tab-subjects-info">
                    <input type='text' placeholder='Type your subject here' />
                    <input type='text' placeholder='Type your faculty here' />
                    <input type='text' placeholder='Select level' />
                    <input type='text' placeholder='Select experience' />
                    <input type='text' placeholder='Select Certification' />
                    <input type='text' placeholder='Select state' />
                    <input type='text' placeholder='Country' />
                    <input type='text' placeholder='Day state' />

                    <input type="submit" value="Upload" />
                </div>
                <div className="tutor-tab-subject-alert">
                    <p style={{fontSize: 'large', fontWeight: 'bold', color: 'blue', width: '100%', textAlign: 'center'}}>400+ students to select for tutoring did't find your subject List your expertise above and submit We may list your subject after examination.</p>
                </div>

                <div className="tutor-tab-subject-data-collection-table">
                    
                    <div className="tutor-tab-subject-data-tabs">

                        <div onClick={e => set_active_course(handle_active_course(e))}>Math</div>
                        <div onClick={e => set_active_course(handle_active_course(e))}>Software</div>
                        <div onClick={e => set_active_course(handle_active_course(e))}>English</div>
                        <div onClick={e => set_active_course(handle_active_course(e))}>Languages</div>
                        <div onClick={e => set_active_course(handle_active_course(e))}>Elementary Edu...</div>
                        <div onClick={e => set_active_course(handle_active_course(e))}>Science</div>
                        <div onClick={e => set_active_course(handle_active_course(e))}>Art</div>
                        <div onClick={e => set_active_course(handle_active_course(e))}>Social Study</div>
                        <div onClick={e => set_active_course(handle_active_course(e))}>Programming</div>
                        <div onClick={e => set_active_course(handle_active_course(e))}>Test Prep</div>
                        <div onClick={e => set_active_course(handle_active_course(e))}>Business</div>
                        <div onClick={e => set_active_course(handle_active_course(e))}>Health </div>
                        <div onClick={e => set_active_course(handle_active_course(e))}>Life Skills</div>
                        <div onClick={e => set_active_course(handle_active_course(e))}>?</div>
                        <div onClick={e => set_active_course(handle_active_course(e))}>Aviation</div>
                        <div onClick={e => set_active_course(handle_active_course(e))}>Engineering</div>
                        
                    </div>
                    <div className="highlight">
                        Checkbox any subject in any faculty where you are proficient enough to tutor, Ultimately you are being rated by the students feedback, if students feedback is only 2 stars then its free checkbox the subject then select the certificate, state expiration if available. Then click on the rate button which will pop up a table to select your rate
                    </div>

                    <div className="tutor-tab-subject-search-bar">
                        <div onClick={e => set_active_course()}>
                            <label style={{float: 'left', border: '1px solid #eee', padding: '5px 10px 0 10px'}} htmlFor="search"><h6>Search accross all faculties. type the subject of interest then checkbox to select</h6></label>

                            <div className="search-bar">
                                <input  style={{height: '50px', width: '300', margin: '0 5px 0 5px'}} type="search" placeholder='Search Here...' id="search"  /> 
                                <input  style={{height: '50px', width: '150px', margin: '0 0 0 5px'}} type="button" value="Search" />
                            </div>
                            

                        </div>

                    </div>

                       
                    <div className="tables" style={{height: '430px', width: '100%', overflow: 'auto', padding: '5px'}}>

                        <table >
                            <thead>
                                <tr>
                                    {COLUMNS.map(item => <th key={item.Header}>{item.Header}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                    
                                {

                                    math_courses.map((item, index) => 
                                        
                                        <tr key={index}>
                                           
                                            <td data-src={item.FacultyId}><input type='checkbox' onInput={populate_col} style={{margin: '8px 0 0 0', cursor: 'pointer', height: '20px', width: '20px'}} value={item.SubjectName} /></td>

                                            <td data-src={item.FacultyId}>{item.SubjectName}</td>

                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                        </tr>
                                    )
                                }
                                
                                
                            </tbody>
                        </table>

                        <table id='hide_table'>
                            <thead>
                                <tr>
                                    {COLUMNS.map(item => <th key={item.Header}>{item.Header}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                    
                                {

                                    software_courses.map((item, index) => 
                                        <tr key={index}>
                                            <td data-src={item.FacultyId}><input type='checkbox' onInput={populate_col} style={{margin: '8px 0 0 0', cursor: 'pointer', height: '20px', width: '20px'}} value={item.SubjectName} /></td>

                                            <td data-src={item.FacultyId}>{item.SubjectName}</td>

                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                        </tr>
                                    )
                                }
                                
                                
                            </tbody>
                        </table>

                        <table id='hide_table'>
                            <thead>
                                <tr>
                                    {COLUMNS.map(item => <th key={item.Header}>{item.Header}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                    
                                {

                                    eng_courses.map((item, index) => 
                                        <tr key={index}>
                                            <td data-src={item.FacultyId}><input type='checkbox' onInput={populate_col} style={{margin: '8px 0 0 0', cursor: 'pointer', height: '20px', width: '20px'}} value={item.SubjectName} /></td>

                                            <td data-src={item.FacultyId}>{item.SubjectName}</td>

                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                        </tr>
                                    )
                                }
                                
                                
                            </tbody>
                        </table>

                        <table id='hide_table'>
                            <thead>
                                <tr>
                                    {COLUMNS.map(item => <th key={item.Header}>{item.Header}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                    
                                {

                                    lang_courses.map((item, index) => 
                                        <tr key={index}>
                                            <td data-src={item.FacultyId}><input type='checkbox' onInput={populate_col} style={{margin: '8px 0 0 0', cursor: 'pointer', height: '20px', width: '20px'}} value={item.SubjectName} /></td>

                                            <td data-src={item.FacultyId}>{item.SubjectName}</td>

                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                        </tr>
                                    )
                                }
                                
                                
                            </tbody>
                        </table>

                        <table id='hide_table'>
                            <thead>
                                <tr>
                                    {COLUMNS.map(item => <th key={item.Header}>{item.Header}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                    
                                {

                                    elem_courses.map((item, index) => 
                                        <tr key={index}>
                                            <td data-src={item.FacultyId}><input type='checkbox' onInput={populate_col} style={{margin: '8px 0 0 0', cursor: 'pointer', height: '20px', width: '20px'}} value={item.SubjectName} /></td>

                                            <td data-src={item.FacultyId}>{item.SubjectName}</td>

                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                        </tr>
                                    )
                                }
                                
                                
                            </tbody>
                        </table>

                        <table id='hide_table'>
                            <thead>
                                <tr>
                                    {COLUMNS.map(item => <th key={item.Header}>{item.Header}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                    
                                {

                                    sci_courses.map((item, index) => 
                                        <tr key={index}>
                                            <td data-src={item.FacultyId}><input type='checkbox' onInput={populate_col} style={{margin: '8px 0 0 0', cursor: 'pointer', height: '20px', width: '20px'}} value={item.SubjectName} /></td>

                                            <td data-src={item.FacultyId}>{item.SubjectName}</td>

                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                        </tr>
                                    )
                                }
                                
                                
                            </tbody>
                        </table>

                        <table id='hide_table'>
                            <thead>
                                <tr>
                                    {COLUMNS.map(item => <th key={item.Header}>{item.Header}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                    
                                {

                                    art_courses.map((item, index) => 
                                        <tr key={index}>
                                            <td data-src={item.FacultyId}><input type='checkbox' onInput={populate_col} style={{margin: '8px 0 0 0', cursor: 'pointer', height: '20px', width: '20px'}} value={item.SubjectName} /></td>

                                            <td data-src={item.FacultyId}>{item.SubjectName}</td>

                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                        </tr>
                                    )
                                }
                                
                                
                            </tbody>
                        </table>

                        <table id='hide_table'>
                            <thead>
                                <tr>
                                    {COLUMNS.map(item => <th key={item.Header}>{item.Header}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                    
                                {

                                    social_s_courses.map((item, index) => 
                                        <tr key={index}>
                                            <td data-src={item.FacultyId}><input type='checkbox' onInput={populate_col} style={{margin: '8px 0 0 0', cursor: 'pointer', height: '20px', width: '20px'}} value={item.SubjectName} /></td>

                                            <td data-src={item.FacultyId}>{item.SubjectName}</td>

                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                        </tr>
                                    )
                                }
                                
                                
                            </tbody>
                        </table>

                        <table id='hide_table'>
                            <thead>
                                <tr>
                                    {COLUMNS.map(item => <th key={item.Header}>{item.Header}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                    
                                {

                                    code_courses.map((item, index) => 
                                        <tr key={index}>
                                            <td data-src={item.FacultyId}><input type='checkbox' onInput={populate_col} style={{margin: '8px 0 0 0', cursor: 'pointer', height: '20px', width: '20px'}} value={item.SubjectName} /></td>

                                            <td data-src={item.FacultyId}>{item.SubjectName}</td>

                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                        </tr>
                                    )
                                }
                                
                                
                            </tbody>
                        </table>

                        <table id='hide_table'>
                            <thead>
                                <tr>
                                    {COLUMNS.map(item => <th key={item.Header}>{item.Header}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                    
                                {

                                    test_prep_courses.map((item, index) => 
                                        <tr key={index}>
                                            <td data-src={item.FacultyId}><input type='checkbox' onInput={populate_col} style={{margin: '8px 0 0 0', cursor: 'pointer', height: '20px', width: '20px'}} value={item.SubjectName} /></td>

                                            <td data-src={item.FacultyId}>{item.SubjectName}</td>

                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                        </tr>
                                    )
                                }
                                
                                
                            </tbody>
                        </table>

                        <table id='hide_table'>
                            <thead>
                                <tr>
                                    {COLUMNS.map(item => <th key={item.Header}>{item.Header}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                    
                                {

                                    business_courses.map((item, index) => 
                                        <tr key={index}>
                                            <td data-src={item.FacultyId}><input type='checkbox' onInput={populate_col} style={{margin: '8px 0 0 0', cursor: 'pointer', height: '20px', width: '20px'}} value={item.SubjectName} /></td>

                                            <td data-src={item.FacultyId}>{item.SubjectName}</td>

                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                        </tr>
                                    )
                                }
                                
                                
                            </tbody>
                        </table>

                        <table id='hide_table'>
                            <thead>
                                <tr>
                                    {COLUMNS.map(item => <th key={item.Header}>{item.Header}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                    
                                {

                                    health_courses.map((item, index) => 
                                        <tr key={index}>
                                            <td data-src={item.FacultyId}><input type='checkbox' onInput={populate_col} style={{margin: '8px 0 0 0', cursor: 'pointer', height: '20px', width: '20px'}} value={item.SubjectName} /></td>

                                            <td data-src={item.FacultyId}>{item.SubjectName}</td>

                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                        </tr>
                                    )
                                }
                                
                                
                            </tbody>
                        </table>

                        <table id='hide_table'>
                            <thead>
                                <tr>
                                    {COLUMNS.map(item => <th key={item.Header}>{item.Header}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                    
                                {

                                    life_skill_courses.map((item, index) => 
                                        <tr key={index}>
                                            <td data-src={item.FacultyId}><input type='checkbox' onInput={populate_col} style={{margin: '8px 0 0 0', cursor: 'pointer', height: '20px', width: '20px'}} value={item.SubjectName} /></td>

                                            <td data-src={item.FacultyId}>{item.SubjectName}</td>

                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                        </tr>
                                    )
                                }
                                
                                
                            </tbody>
                        </table>

                        <table id='hide_table'>
                            <thead>
                                <tr>
                                    {COLUMNS.map(item => <th key={item.Header}>{item.Header}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                    
                                {

                                    aviation_courses.map((item, index) => 
                                        <tr key={index}>
                                            <td data-src={item.FacultyId}><input type='checkbox' onInput={populate_col} style={{margin: '8px 0 0 0', cursor: 'pointer', height: '20px', width: '20px'}} value={item.SubjectName} /></td>

                                            <td data-src={item.FacultyId}>{item.SubjectName}</td>

                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                        </tr>
                                    )
                                }
                                
                                
                            </tbody>
                        </table>

                        <table id='hide_table'>
                            <thead>
                                <tr>
                                    {COLUMNS.map(item => <th key={item.Header}>{item.Header}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                    
                                {

                                    engineering_courses.map((item, index) => 
                                        <tr key={index}>
                                            <td data-src={item.FacultyId}><input type='checkbox' onInput={populate_col} style={{margin: '8px 0 0 0', cursor: 'pointer', height: '20px', width: '20px'}} value={item.SubjectName} /></td>

                                            <td data-src={item.FacultyId}>{item.SubjectName}</td>

                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
                                            <td data-src={item.FacultyId}></td>
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