import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { get_certificates, get_degree, get_experience, get_level, get_state, upload_form_two } from '../../axios/tutor';
import career  from '../../images/career.png';

const Education = () => {

    let {save} = useSelector(s => s.save)


    let [level, set_level] = useState('');
    let [university1, set_university1] = useState('');
    let [university2, set_university2] = useState('');
    let [degree, set_degree] = useState('');
    let [certificate, set_certificate] = useState('');
    let [language, set_language] = useState('');

    let [state1, set_state1] = useState('');
    let [state2, set_state2] = useState('');
    let [state3, set_state3] = useState('');
    let [state4, set_state4] = useState('');
    let [state5, set_state5] = useState('');
    let [state6, set_state6] = useState(''); 

    let [experience, set_experience] = useState('');
    let [graduagteYr1, set_graduagteYr1] = useState('');
    let [graduagteYr2, set_graduagteYr2] = useState('');
    let [graduagteYr3, set_graduagteYr3] = useState('');
    let [expiration, set_expiration] = useState('');
    let [otherang, set_othelang] = useState('');
    let [workExperience, set_workExperience] = useState('');

    let [exp, set_exp] = useState();
    let [stateList, setStateList] = useState('');
    let [level_list, set_level_list] = useState('')
    let [degree_list, set_degree_list] = useState('')
    let [certificate_list, set_certificate_list] = useState('')


    let user_id = window.localStorage.getItem('user_id');

    let saver = () => {
        upload_form_two(level,university1,university2,degree,certificate,language,state2,state3,state4,state5,state6,experience,graduagteYr1,graduagteYr2,graduagteYr3,expiration,otherang,workExperience,user_id)
    }

    document.querySelector('#save').onclick = () => saver();

    useEffect(() => {
        get_experience()
        .then((data) => {
            let list = data.recordset.map((item) => 
                <option key={item.TutorExperience} className={item.TutorExperience} style={{height: '80px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0'}}  value={item.TutorExperience}>{item.TutorExperience}</option>
            );
            let head = <option key='null' style={{height: '50px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0'}}  value=''>TutorExperience</option>

            list.unshift(head);
            set_exp(list)

        })
        .catch((err) => {
            console.log(err)
        })

        get_state()
        .then((data) => {
            let list = data.recordset.map((item) => 
                <option key={item.State} className={item.State} style={{height: '80px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0'}}  value={item.State}>{item.State}</option>
            );
            let head = <option key='null' style={{height: '50px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0'}}  value=''>Select State</option>

            list.unshift(head);
            setStateList(list) 

        })
        .catch((err) => {
            console.log(err)
        })

        get_degree()
        .then((data) => {
            let list = data.recordset.map((item) => 
                <option key={item.Degree} className={item.Degree} style={{height: '80px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0'}}  value={item.Degree}>{item.Degree}</option>
            );
            let head = <option key='null' style={{height: '50px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0'}}  value=''>Degree</option>

            list.unshift(head);
            set_degree_list(list)

        })
        .catch((err) => {
            console.log(err)
        })

        get_level()
        .then((data) => {
            let list = data.recordset.map((item) => 
                <option key={item.Level} className={item.Level} style={{height: '80px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0'}}  value={item.Level}>{item.Level}</option>
            );
            let head = <option key='null' style={{height: '50px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0'}}  value=''>Educational Level</option>

            list.unshift(head);
            set_level_list(list)

        })
        .catch((err) => {
            console.log(err)
        })

        get_certificates()
        .then((data) => {
            let list = data.recordset.map((item) => 
                <option key={item.CertificateType} className={item.CertificateType} style={{height: '80px', width: '100%', outline: 'none', padding: '0 5x 0 5x', borderRadius: '0'}}  value={item.CertificateType}>{item.CertificateType}</option>
            );
            let head = <option key='null' style={{height: '50px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0'}}  value=''>CertificateType</option>

            list.unshift(head);
            set_certificate_list(list)

        })
        .catch((err) => {
            console.log(err)
        })
    })

    return ( 
        <>
            <div className="tutor-tab-education">
                <form action="">

                    <div className="tutor-tab-education-info" >
                        <h3>Education</h3>

                        <h6 className='tutor-tab-education-notice highlight' >
                            Now let's turn our attention to table headers — special cells that go at the start of a row or column and define the type of data that row or column contains (as an example, see the "Person" and "Age" cells in the first example shown in this article). To illustrate why they are useful, have a look at the following table example. First the source code:
                        </h6>

                        
                        <div className='input-cnt'>
                            <div style={{display: 'flex', justifyContent: 'center', margin: '0 0 20px 0', width: '100%', whiteSpace: 'nowrap'}}>
                                <select id='level' style={{padding: '5px'}} onInput={e => set_level(e.target.value)}>
                                    {
                                        level_list
                                    }
                                </select>
                            </div>

                            <div style={{display: 'flex', visibility: 'hidden', justifyContent: 'center', margin: '0 0 20px 0', width: '100%', 
                            whiteSpace: 'nowrap'}}>
                                <select onInput={e => set_state1(e.target.value)} id="state1">
                                    <option value='null'>Select</option>
                                </select>
                            </div>

                            <div style={{display: 'flex', justifyContent: 'center', margin: '0 0 20px 0', width: '100%', whiteSpace: 'nowrap'}}>
                                <select  onInput={e => set_experience(e.target.value)} id="experience" style={{float: 'right', padding: '8px', margin: '0 0 10px 0'}}>
                                    {exp}
                                </select>
                            </div>
                        </div>

                        <div className='input-cnt'>
                            <div style={{display: 'flex', justifyContent: 'center', margin: '0 0 20px 0', width: '100%', whiteSpace: 'nowrap'}}>
                                <input type='text' id='university1' onInput={e => set_university1(e.target.value)} placeholder='College/University 1' />
                            </div>

                            <div style={{display: 'flex', justifyContent: 'center', margin: '0 0 30px 0', width: '100%', 
                            whiteSpace: 'nowrap'}}>
                                <select style={{padding: '5px', width: '150px'}} onInput={e => set_state2(e.target.value)} id="state1">
                                    {stateList}
                                </select>
                            </div>

                            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: '0 0 20px 0', width: '100%', whiteSpace: 'nowrap'}}>
                                <label htmlFor='yr1'>Graduation Year</label> 
                                <input  onInput={e => set_graduagteYr1(e.target.value)} placeholder='Graduate Year' type="date" id="yr1" style={{float: 'right'}} />
                            </div>
                        </div>

                        <div className='input-cnt'>
                            <div style={{display: 'flex', justifyContent: 'center', margin: '0 0 20px 0', width: '100%', whiteSpace: 'nowrap'}}>
                                <input type='text' id='university2' onInput={e => set_university2(e.target.value)} placeholder='College/University 2' />
                            </div>

                            <div style={{display: 'flex', justifyContent: 'center', margin: '0 0 30px 0', width: '100%', 
                            whiteSpace: 'nowrap'}}>
                                <select style={{padding: '5px', width: '150px'}} onInput={e => set_state3(e.target.value)} id="state1">
                                    {stateList}
                                </select>
                            </div>

                            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: '0 0 20px 0', width: '100%', whiteSpace: 'nowrap'}}>
                                <label htmlFor='yr2'>Graduation Year</label> 
                                <input onInput={e => set_graduagteYr2(e.target.value)} placeholder='Graduate Year' type="date" id="yr2" style={{float: 'right'}} />
                            </div>
                        </div>

                        <div className='input-cnt'>
                            <div style={{display: 'flex', justifyContent: 'center', margin: '0 0 20px 0', width: '100%', whiteSpace: 'nowrap'}}>
                                <select id='degree' style={{padding: '5px'}} onInput={e => set_degree(e.target.value)}>
                                    {
                                        degree_list
                                    }
                                </select>
                            </div>

                            <div style={{display: 'flex', justifyContent: 'center', margin: '0 0 30px 0', width: '100%', 
                            whiteSpace: 'nowrap'}}>
                                <select style={{padding: '5px', width: '150px'}} onInput={e => set_state4(e.target.value)} id="state1">
                                    {stateList}
                                </select>
                            </div>

                            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: '0 0 20px 0', width: '100%', whiteSpace: 'nowrap'}}>
                                <label htmlFor='yr3'>Graduation Year</label> 
                                <input onInput={e => set_graduagteYr3(e.target.value)} placeholder='Teaching Experience' type="date" id="yr3" style={{float: 'right'}} />
                            </div>
                        </div>
                        
                        <div className='input-cnt'>
                            <div style={{display: 'flex', justifyContent: 'center', margin: '0 0 20px 0', width: '100%', whiteSpace: 'nowrap'}}>
                                <select id='certificate' style={{padding: '5px'}} onInput={e => set_certificate(e.target.value)}>
                                    {
                                        certificate_list
                                    }
                                </select>
                            </div>

                            <div style={{display: 'flex', justifyContent: 'center', margin: '0 0 30px 0', width: '100%', 
                            whiteSpace: 'nowrap'}}>
                                <select style={{padding: '5px', width: '150px'}} onInput={e => set_state5(e.target.value)} id="state1">
                                    {stateList}
                                </select>
                            </div>

                            <div style={{display: 'flex', justifyContent: 'center', margin: '0 0 20px 0', width: '100%', whiteSpace: 'nowrap'}}>
                                <input onInput={e => set_expiration(e.target.value)} placeholder='Expiration' type="date" id="expiration" style={{float: 'right'}} />
                            </div>
                        </div>

                        <div className='input-cnt'>
                            <div style={{display: 'flex', justifyContent: 'center', margin: '0 0 20px 0', width: '100%', whiteSpace: 'nowrap'}}>
                                <input id='language' style={{padding: '5px'}} onInput={e => set_language(e.target.value)} placeholder='Native Language' />
                            </div>

                            <div style={{display: 'flex', justifyContent: 'center', margin: '0 0 30px 0', width: '100%', 
                            whiteSpace: 'nowrap'}}>
                                <select style={{padding: '5px', width: '150px'}} onInput={e => set_state6(e.target.value)} id="state1">
                                    {stateList}
                                </select>
                            </div>

                            <div style={{display: 'flex', justifyContent: 'center', margin: '0 0 20px 0', width: '100%', whiteSpace: 'nowrap'}}>
                                <input onInput={e => set_othelang(e.target.value)} placeholder='Other Languages' type="text" id="other_languages" style={{float: 'right'}} />
                            </div>
                        </div>


                       

                       
                    </div>

                    <div className="tutor-tab-education-experience">
                        <div className="education-work-experience-logo">

                            <img src={career} style={{height: '85%', width: '200px', display: 'block', margin: 'auto', padding: '30px'}} alt="" />

                            <label htmlFor="" style={{margin: 'auto', textAlign: 'center'}}><h6 style={{textAlign: 'center'}}>Work Experience</h6></label>

                        </div>

                        <textarea onInput={e => set_workExperience(e.target.value)} style={{height: '400px'}} placeholder="Enter Here Your Work Experience" className="tutor-tab-education-experience-details">

                        </textarea>
                    </div>

                </form>
            </div>
        </>
     );
}
 
export default Education;