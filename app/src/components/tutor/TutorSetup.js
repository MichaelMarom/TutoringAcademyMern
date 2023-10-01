import {motion} from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { get_countries, get_gmt, get_response, get_state, upload_form_one } from '../../axios/tutor';
import containerVariants from '../constraint';
const TutorSetup = () => {

    let [fname, set_fname] = useState('')
    let [uname, set_uname] = useState('')
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
    let [response_zone, set_response_zone] = useState('')
    let [intro, set_intro] = useState('')
    let [motivation, set_motivation] = useState('')
    let [headline, set_headline] = useState('')
    let {save} = useSelector(s => s.save)

    let [countryList, setCountryList] = useState('')
    let [stateList, setStateList] = useState('')
    let [GMTList, setGMTList] = useState('')
    let [response_list, set_response_list] = useState('')

    let saver = async () => {
        let response = await upload_form_one(fname,uname,mname,sname,email,pwd,cell,acadId,add1,add2,city,state,zipCode,country,timeZone,response_zone,intro, motivation,headline)

        return response;

       
    }

    document.querySelector('#save').onclick = async() => {
        let all_inputs = [...document.querySelectorAll('input')]
        let selects = [...document.querySelectorAll('select')]
        let text = [...document.querySelectorAll('textarea')]

        let all_select = selects.filter(item => item.className !== 'video-upload-option');

        let all_values = [...all_inputs,...all_select,...text]


        let  bool_list = []
        let bools = all_values.map(item => {
            if(item.value === ''){

                if(item.dataset.type ==='file'){
                    if(item.nextElementSibling){
                        item.nextElementSibling.setAttribute('id', 'err-border');
                    }
                }else{
                    item.setAttribute('id', 'err-border');
                }
                bool_list.push(false)
            }else{
                if(item.dataset.type ==='file'){
                    if(item.nextElementSibling){
                        item.nextElementSibling.removeAttribute('id');
                    }
                }else{
                    item.removeAttribute('id');
                }

                bool_list.push(true)
                
            }
        })


        let result = bool_list.filter(item => item === false)


        if(result.length === 0){
            document.querySelector('.save-overlay').setAttribute('id', 'save-overlay')
            let response = await saver();
            console.log(response)
            if(response.bool){
                window.localStorage.setItem('user_id', response.user);
                document.querySelector('form').reset(); 

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

            
        }


        /**/
    };


    useEffect(() => {

        get_countries()
        .then((data) => {
            console.log(data)
            let list = data.recordset.map((item) => 
                <option key={item.Country} className={item.Country} style={{height: '80px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0'}}  value={item.Country}>{item.Country}</option>
            );
            let head = <option key='null' style={{height: '50px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0'}}  value=''>Country</option>

            list.unshift(head);
            setCountryList(list)

        })
        .catch((err) => {
            console.log(err)
        })


        get_gmt()
        .then((data) => {
            let list = data.recordset.map((item) => 
                <option key={item.GMT} className={item.GMT} style={{height: '80px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0'}}  value={item.GMT}>{item.GMT}</option>
            );
            let head = <option key='null' style={{height: '50px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0'}}  value=''>GMT</option>

            list.unshift(head);
            setGMTList(list)

        })
        .catch((err) => {
            console.log(err)
        })


        get_state()
        .then((data) => {
            let list = data.recordset.map((item) => 
                <option key={item.State} className={item.State} style={{height: '80px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0'}}  value={item.State}>{item.State}</option>
            );
            let head = <option key='null' style={{height: '50px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0'}}  value=''>State</option>

            list.unshift(head);
            setStateList(list) 

        })
        .catch((err) => {
            console.log(err)
        })


        get_response()
        .then((data) => {
            console.log(data)
            let list = data.recordset.map((item) => 
                <option key={item.Response} className={item.Response} style={{height: '80px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0'}}  value={item.Response}>{item.Response}</option>
            );
            let head = <option key='null' style={{height: '50px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0'}}  value=''>Response</option>

            list.unshift(head);
            set_response_list(list) 

        })
        .catch((err) => {
            console.log(err)
        })
        
    }, [])

    return ( 
        <>
            <div className="tutor-popin"></div>
            <div className="save-overlay">
                <span class="save_loader"></span>
            </div>
            <motion.div variants={containerVariants} initial='hidden' animate='visible' exit='exit' className="tutor-tab-setup">
                
                <form action="">

                    <div className="tutor-setup-top-field">
                        <div className="profile-photo-cnt">

                            <h5 style={{whiteSpace: 'nowrap'}}>Profile Photo</h5> 
                            <input type="file" data-type='file' style={{display: 'none'}} id="photo" />
                            <div className="tutor-tab-photo-frame"></div>
                            <label id='btn' htmlFor="photo">
                                Upload
                            </label>
                            
                        </div>

                        <div className="profile-details-cnt" >

                            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', whiteSpace: 'nowrap'}}>
                                <input onInput={ e => set_fname(e.target.value)} placeholder='First Name' type="text" id="fname" style={{float: 'right'}} />
                            </div>

                            <div  style={{ display: 'flex', justifyContent: 'center', width: '100%', whiteSpace: 'nowrap'}}>
                                <input onInput={ e => set_mname(e.target.value)} placeholder='Middle Name' type="text" id="mname" style={{float: 'right'}} />
                            </div>

                            <div  style={{ display: 'flex', justifyContent: 'center', width: '100%', whiteSpace: 'nowrap'}}>
                                <input onInput={ e => set_sname(e.target.value)} placeholder='Last Name' type="text" id="sname" style={{float: 'right'}} />
                            </div>

                            <div  style={{ display: 'flex', justifyContent: 'center', width: '100%', whiteSpace: 'nowrap'}}>
                                <input onInput={ e => set_uname(e.target.value)} placeholder='Screen Name' type="text" id="sname" style={{float: 'right'}} />
                            </div>

                            <div  style={{ display: 'flex', justifyContent: 'center', width: '100%', whiteSpace: 'nowrap'}}>
                                <input onInput={ e => set_email(e.target.value)} placeholder='Email' type="text" id="email" style={{float: 'right'}} />
                            </div>

                            <div  style={{ display: 'flex', justifyContent: 'center', width: '100%', whiteSpace: 'nowrap'}}>
                                <input onInput={ e => set_pwd(e.target.value)} placeholder='Password' type="text" id="pwd" style={{float: 'right'}} />
                            </div>

                            <div  style={{ display: 'flex', justifyContent: 'center', width: '100%', whiteSpace: 'nowrap'}}>
                                <input onInput={ e => set_cell(e.target.value)} placeholder='Cell Phone' type="text" id="cellphn" style={{float: 'right'}} />
                            </div>

                        </div>

                        <div className="profile-details-cnt" style={{float: 'left'}}>


                            <div  style={{display: 'inline-block', width: '100%', display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap'}}>
                                <input onInput={e => set_add1(e.target.value)} placeholder='Address 1' type="text" id="add1" style={{float: 'right'}} />
                            </div>

                            <div  style={{display: 'inline-block', width: '100%', display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap'}}>
                                <input onInput={e => set_add2(e.target.value)} placeholder='Address 2' type="text" id="add2" style={{float: 'right'}} />
                            </div>

                            <div style={{display: 'inline-block', width: '100%', display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap'}}>
                                <input onInput={e => set_city(e.target.value)} placeholder='City/Town' type="text" id="city" style={{float: 'right'}} />
                            </div>

                            <div style={{display: 'inline-block', width: '100%', display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap'}}>
                                <select  onInput={e => set_state(e.target.value)} id="state" style={{float: 'right', padding: '5px 5px 5px 5px', margin: '0 0 10px 0'}}>
                                    {stateList}

                                </select>
                            </div>

                            <div  style={{display: 'inline-block', width: '100%', display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap'}}>
                                <input onInput={e => set_zipCode(e.target.value)} placeholder='Zip-Code' type="text" id="zip" style={{float: 'right'}} />
                            </div>

                            <div style={{display: 'inline-block', width: '100%', display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap'}}>
                                <select  onInput={e => set_country(e.target.value)} id="country" style={{float: 'right', padding: '5px', margin: '0 0 10px 0'}}>
                                    {countryList}

                                </select>
                                
                            </div>

                            <div style={{display: 'inline-block', width: '100%', display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap'}}>
                                <select  onInput={e => set_timeZone(e.target.value)} id="timeZone" style={{float: 'right', padding: '5px 5px 5px 5px', margin: '0 0 10px 0'}}>
                                    {GMTList}

                                </select>
                            </div>

                            <div style={{display: 'inline-block', width: '100%', display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap'}}>

                                <select  onInput={e => set_response_zone(e.target.value)} id="resZone" style={{float: 'right', padding: '5px 5px 5px 5px', margin: '0 0 10px 0'}}>
                                    {response_list}

                                </select>
                            </div> 


                        </div>

                        <div className="profile-video-cnt" style={{float: 'right'}}>
                            <h5 style={{whiteSpace: 'nowrap'}}>Produce your profile video </h5>

                            <input data-type='file' type="file" style={{display: 'none'}} id="video" />

                            <div className="tutor-tab-video-frame"></div>
                            <label id='btn' htmlFor="video">
                                Upload
                            </label>

                            <select className='video-upload-option' style={{padding: '5px'}} name="" id="">
                                <option value="null">Select Upload Option</option>
                                <option value="Storage">Local File</option>
                                <option value="Youtube">Youtube</option>
                                <option value="Link">Url</option>
                            </select>
                        </div>
                    </div>




                    <div className="tutor-setup-bottom-field">

                        <div className="profile-headline" style={{textAlign: 'center', float: 'left'}}>
                            <label style={{fontWeight: 'bold'}} htmlFor="headline">Headline</label><br />
                            <input placeholder='Write A Catchy Headline.. Example: 21 years experienced nuclear science professor.' onInput={e => set_headline(e.target.value)} type="text" style={{width: '80%', height: '50px', margin: '0 0 10px 0'}} />
                            <br/>

                            <label style={{fontWeight: 'bold'}} htmlFor="intro">Introduction</label><br />
                            <textarea placeholder='Writw An Introduction Here... e.g(My name is Fabian and i am a graduate of Harvard University in Boston...)' onInput={e => set_intro(e.target.value)} style={{width: '80%', padding: '10px',height: '200px'}} name="" id="">
                                
                            </textarea>
                        </div>


                        <div className="profile-motivation" style={{textAlign: 'center', float: 'right'}}>
                            <label style={{fontWeight: 'bold'}} htmlFor="intro">Motivation</label><br />
                            <textarea placeholder='Write Something That Will Motivate Your Students...' onInput={e => set_motivation(e.target.value)} style={{width: '80%', padding: '10px',height: '250px'}} name="" id="">
                                
                            </textarea>
                        </div>
                            
                    </div>

                </form>

            </motion.div>
        </>
     );
}
 
export default TutorSetup;