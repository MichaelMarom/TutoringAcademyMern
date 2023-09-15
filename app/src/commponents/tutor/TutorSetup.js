import {motion} from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { get_countries, get_gmt, get_response, get_state, get_tutor_setup, upload_form_one } from '../../axios/tutor';
import { socket } from '../../socket';
import containerVariants from '../constraint';
import { useDispatch } from 'react-redux';
import { setscreenNameTo } from '../../redux/tutor_store/ScreenName';
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
    let [photo, set_photo] = useState('')
    let [video, set_video] = useState('')

    let [email_isVerified, set_email_isVerified] = useState(false)
    let {save} = useSelector(s => s.save)

    let [is_logged_in, set_is_logged_in] = useState(false)

    let [countryList, setCountryList] = useState('')
    let [stateList, setStateList] = useState('')
    let [GMTList, setGMTList] = useState('')
    let [response_list, set_response_list] = useState('')

    let [data, set_data] = useState(false);

    let dispatch = useDispatch()


    /*useEffect(() => {
        if(window.localStorage.getItem('user_role') === 'admin'){
            window.location.reload()
        }
    }, [])*/

    useEffect(() => {
        get_tutor_setup(window.localStorage.getItem('tutor_user_id'))
        .then((result) => {
            console.log(result)
            let data = result[0]
            set_fname(data.FirstName)
            set_sname(data.LastName)
            set_mname(data.MiddleName)
            set_photo(data.Photo)
            set_video(data.Video)
            set_email(data.Email)
            set_cell(data.CellPhone)
            set_state(data.StateProvince)

            set_city(data.CityTown)
            set_country(data.Country)
            set_response_zone(data.ResponseHrs)
            set_intro(data.Introduction)
            set_motivation(data.Motivate)
            set_timeZone(data.GMT)
            set_zipCode(data.ZipCode)
            set_headline(data.HeadLine)
            set_add1(data.Address1)
            set_add2(data.Address2)

            


            let frame1 = document.querySelector(".tutor-tab-photo-frame"); 
            let frame2 = document.querySelector(".tutor-tab-video-frame"); 

            let img =  `<img src='${data.Photo}' style='height: 100%; width: 100%; '}} alt='photo' />`
            frame1.insertAdjacentHTML("afterbegin", img)

            let video =  `<video src='${data.Video}' controls autoplay style='height: 100%; width: 100%; '}} alt='video' ></video>`
            frame2.insertAdjacentHTML("afterbegin", video)



        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => {

            set_data(true)
        })
    }, [])

    useEffect(() => {
        let id = window.localStorage.getItem('tutor_user_id') !== 'null' ? window.localStorage.getItem('tutor_user_id') : null
        set_acadId(id)
    }, [])

    useEffect(() => {
        let next = document.querySelector('.tutor-next')

        if(next.hasAttribute('id')){
            next.removeAttribute('id');
        }
    }, [])

    useEffect(() => {

        let input = [...document.querySelectorAll('input')];
        let select = [...document.querySelectorAll('select')];
        let textarea = [...document.querySelectorAll('textarea')];

        let doc = [document.querySelector('.profile-photo-cnt'), document.querySelector('.profile-video-cnt')]

        let field = [...input, ...select, ...textarea, ...doc];

        

        let name = window.localStorage.getItem('tutor_user_id');
        if(name === null || name === 'null'){
            field.map(item => {
                item.style.opacity = 1;
                item.style.pointerEvents = 'all';
            })
        }else{
            field.map(item => {
                item.style.opacity = .4;
                item.style.pointerEvents = 'none';
            })
        }

    }, []);

    //useEffect(() => {
        
        if(document.querySelector('#tutor-save')){
            document.querySelector('#tutor-save').onclick = async() => { 
                
                let all_inputs = [...document.querySelectorAll('input')].filter(item => item.getAttribute('id') !== 'add2' && item.getAttribute('id') !== 'mname')
                let selects = [...document.querySelectorAll('select')]
                let text = [...document.querySelectorAll('textarea')]
        
                let all_select = selects.filter(item => item.className !== 'video-upload-option');
        
                let all_values = [...all_inputs,...all_select,...text]
        
        
                let  bool_list = []
                let bools = all_values.map(item => {
        
                    if(item.dataset.type ==='file'){
        
                        let data = item.nextElementSibling.hasChildNodes;
                        if(data){
                            bool_list.push(true)
                        }else{
                            bool_list.push(false)
                        }
        
                    }else{
        
                        if(item.value === ''){
        
                            if(item.dataset.type !=='file'){
                                item.setAttribute('id', 'err-border');
                            }
                            bool_list.push(false)
                        }else{
                            if(item.dataset.type !=='file'){
                                item.removeAttribute('id');
                            }
            
                            bool_list.push(true)
                        }
                    }
                    
                })
        
            
        
                let result = bool_list.filter(item => item === false)
        
        
                if(result.length === 0){
                    document.querySelector('.save-overlay').setAttribute('id', 'save-overlay')
                    let response = await saver();
                    if(response.bool){
                        
                        //document.querySelector('form').reset(); 
                        console.log(response)
                        if(response.type === 'save'){
                            window.localStorage.setItem('tutor_user_id', response.user);
                            window.localStorage.setItem('tutor_screen_name', response.screen_name);
                            dispatch(setscreenNameTo(response.screen_name));
                            alert(`Your New Screen Name Is ${response.screen_name}`)
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
        
                        }else{
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
                        }
        
                    
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
        
        
                /**/
            };
        }else{

        }


        if(document.querySelector('#tutor-edit')){

            document.querySelector('#tutor-edit').onclick = async() => {
                let input = [...document.querySelectorAll('input')].filter(item => item.id !== 'fname' && item.id !== 'mname' && item.id !== 'sname');
                let select = [...document.querySelectorAll('select')];
                let textarea = [...document.querySelectorAll('textarea')];
        
                let doc = [document.querySelector('.profile-photo-cnt'), document.querySelector('.profile-video-cnt')]
        
                let field = [...input, ...select, ...textarea, ...doc];
        
                field.map(item => {
                    item.style.opacity = 1;
                    item.style.pointerEvents = 'all';
                })
        
        
            }
        }else{
            
        }
    //}, [])

    let saver = async () => {
        let response = await upload_form_one(fname,uname,mname,sname,email,pwd,cell,acadId,add1,add2,city,state,zipCode,country,timeZone,response_zone,intro, motivation,headline,photo,video)
        //console.log(fname,uname,mname,sname,email,pwd,cell,acadId,add1,add2,city,state,zipCode,country,timeZone,response_zone,intro, motivation,headline)

        return response;
    }


    let handleEmail = e => {
        socket.emit('email', e.target.value);
        socket.on('email', (data)=> { 
            if(!data){
                e.target.style.border = '1px solid red';
                e.target.nextElementSibling.setAttribute('id', 'err-mssg');

                set_email_isVerified(false)
            }else{
                e.target.style.border = '1px solid #000';
                e.target.nextElementSibling.removeAttribute('id');
                set_email_isVerified(true)

            }
        })

    }

    useEffect(() => {

        get_countries()
        .then((data) => {
            console.log(data)
            let list = data.recordset.map((item) => 
                <option key={item.Country} className={item.Country} selected={item.Country === country ? 'selected' : ''} style={{height: '80px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0'}}  value={item.Country}>{item.Country}</option>
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
                <option key={item.GMT} className={item.GMT}  selected={item.GMT === timeZone ? 'selected' : ''} style={{height: '80px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0'}}  value={item.GMT}>{item.GMT}</option>
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
                <option key={item.State} className={item.State}  selected={item.State === state ? 'selected' : ''}  style={{height: '80px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0'}}  value={item.State}>{item.State}</option>
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
                <option key={item.Response} className={item.Response} selected={item.Response === response_zone ? 'selected' : ''} style={{height: '80px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0'}}  value={item.Response}>{item.Response}</option>
            );
            let head = <option key='null' style={{height: '50px', width: '100%', outline: 'none', padding: '0 10px 0 10px', borderRadius: '0'}}  value=''>Response</option>

            list.unshift(head);
            set_response_list(list) 

        })
        .catch((err) => {
            console.log(err)
        })
        
    }, [data])

    let handleImage = () => {
        let frame = document.querySelector(".tutor-tab-photo-frame"); 
        
        let f = document.querySelector("#photo");

        let type = [...f.files][0].type;

        

        if(type.split('/')[0] !== 'image'){
            alert('Only Image Can Be Uploaded To This Field')
        }else{
            frame.innerHTML = '';

            let reader = new FileReader();


            reader.onload = (result) => {



                let img =  `<img src='${reader.result}' style='height: 100%; width: 100%; '}} alt='photo' />`

                set_photo(reader.result)

                frame.insertAdjacentHTML("afterbegin", img)
                

            }
            reader.readAsDataURL([...f.files][0]);

        }
    } 

    let handleVideo = () => {
        let frame = document.querySelector(".tutor-tab-video-frame"); 

        
        let f = document.querySelector("#video");



        let type = [...f.files][0].type;


        if(type.split('/')[0] !== 'video'){
            alert('Only Video Can Be Uploaded To This Field')
        }else{

            frame.innerHTML = '';

            let reader = new FileReader({});

            reader.onload = (result) => {



                let video =  `<video src='${reader.result}' controls autoplay style='height: 100%; width: 100%; '}} alt='video' ></video>`

                set_video(reader.result)

                frame.insertAdjacentHTML("afterbegin", video)
                

            }
            reader.readAsDataURL([...f.files][0]);

        }
    } 


    return ( 
        <>
            <div className="tutor-popin"></div>
            <div className="save-overlay">
                <span class="save_loader"></span>
            </div>
            <motion.div variants={containerVariants} initial='hidden' animate='visible' exit='exit' className="tutor-tab-setup">
                
                <form action="">

                    <div className="tutor-setup-top-field" >
                        <div className="profile-photo-cnt">

                            <h5 style={{whiteSpace: 'nowrap'}}>Profile Photo</h5> 
                            <input type="file" data-type='file' onChange={handleImage} style={{display: 'none'}} id="photo" />
                            <div className="tutor-tab-photo-frame">

                            </div>
                            <label id='btn' htmlFor="photo">
                                Upload
                            </label>
                            
                        </div>

                        <div className="profile-details-cnt" >

                            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', whiteSpace: 'nowrap'}}>
                                <input onInput={ e => set_fname(e.target.value)}  placeholder='First Name' defaultValue={fname} type="text" id="fname" style={{float: 'right'}} />
                            </div>

                            <div  style={{ display: 'flex', justifyContent: 'center', width: '100%', whiteSpace: 'nowrap'}}>
                                <input onInput={ e => set_mname(e.target.value)} placeholder='Middle Name' defaultValue={mname} type="text" id="mname" style={{float: 'right'}} />
                            </div>

                            <div  style={{ display: 'flex', justifyContent: 'center', width: '100%', whiteSpace: 'nowrap'}}>
                                <input onInput={ e => set_sname(e.target.value)} placeholder='Last Name' defaultValue={sname} type="text" id="sname" style={{float: 'right'}} />
                            </div>

                            {/*<div  style={{ display: 'flex', justifyContent: 'center', width: '100%', whiteSpace: 'nowrap', pointerEvents: 'none'}}>
                                <input onInput={ e => set_uname(e.target.value)} placeholder='Screen Name' type="text" id="sname" style={{float: 'right'}} />
    </div>*/}

                            <div  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', whiteSpace: 'nowrap'}}>
                                <input onInput={ e => set_email(e.target.value)} onBlur={handleEmail} placeholder='Email' defaultValue={email} type="text" id="email" style={{float: 'right'}} />

                                <div className='err-mssg' >
                                    Email already exist, Please try something else...
                                </div>

                            </div>

                            <div  style={{ display: 'flex', justifyContent: 'center', width: '100%', whiteSpace: 'nowrap'}}>
                                <input onInput={ e => set_pwd(e.target.value)} placeholder='Password' defaultValue={pwd} type="text" id="pwd" style={{float: 'right'}} />
                            </div>

                            <div  style={{ display: 'flex', justifyContent: 'center', width: '100%', whiteSpace: 'nowrap'}}>
                                <input onInput={ e => set_cell(e.target.value)} placeholder='Cell Phone' defaultValue={cell} type="text" id="cellphn" style={{float: 'right'}} />
                            </div>

                            <div  style={{display: 'inline-block', width: '100%', display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap'}}>
                                <input onInput={e => set_add1(e.target.value)} placeholder='Address 1' defaultValue={add1} type="text" id="add1" style={{float: 'right'}} />
                            </div>

                            

                        </div>

                        <div className="profile-details-cnt" style={{float: 'left'}}>


                            <div  style={{display: 'inline-block', width: '100%', display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap'}}>
                                <input onInput={e => set_add2(e.target.value)} placeholder='Address 2' defaultValue={add2} type="text" id="add2" style={{float: 'right'}} />
                            </div>

                            <div style={{display: 'inline-block', width: '100%', display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap'}}>
                                <input onInput={e => set_city(e.target.value)} placeholder='City/Town' type="text" defaultValue={city} id="city" style={{float: 'right'}} />
                            </div>

                            <div style={{display: 'inline-block', width: '100%', display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap'}}>
                                <select  onInput={e => set_state(e.target.value)} id="state" defaultValue={state} style={{float: 'right', padding: '5px 5px 5px 5px', margin: '0 0 10px 0'}}>
                                    {stateList}

                                </select>
                            </div>

                            <div  style={{display: 'inline-block', width: '100%', display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap'}}>
                                <input onInput={e => set_zipCode(e.target.value)} defaultValue={zipCode} placeholder='Zip-Code' type="text" id="zip" style={{float: 'right'}} />
                            </div>

                            <div style={{display: 'inline-block', width: '100%', display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap'}}>
                                <select  onInput={e => set_country(e.target.value)} id="country" defaultValue={country} style={{float: 'right', padding: '5px', margin: '0 0 10px 0'}}>
                                    {countryList}

                                </select>
                                
                            </div>

                            <div style={{display: 'inline-block', width: '100%', display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap'}}>
                                <select  onInput={e => set_timeZone(e.target.value)} id="timeZone" defaultValue={timeZone} style={{float: 'right', padding: '5px 5px 5px 5px', margin: '0 0 10px 0'}}>
                                    {GMTList}

                                </select>
                            </div>

                            <div style={{display: 'inline-block', width: '100%', display: 'flex', justifyContent: 'center', whiteSpace: 'nowrap'}}>

                                <select  onInput={e => set_response_zone(e.target.value)} defaultValue={response_zone} id="resZone" style={{float: 'right', padding: '5px 5px 5px 5px', margin: '0 0 10px 0'}}>
                                    {response_list}

                                </select>
                            </div> 


                        </div>

                        <div className="profile-video-cnt" style={{float: 'right'}}>
                            <h5 style={{whiteSpace: 'nowrap'}}>Produce your profile video </h5>

                            <input data-type='file' defaultValue={video} onChange={handleVideo} type="file" style={{display: 'none'}} id="video" />

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




                    <div className="tutor-setup-bottom-field" >

                        <div className="profile-headline" style={{textAlign: 'center', float: 'left'}}>
                            <label style={{fontWeight: 'bold'}} htmlFor="headline">Headline</label><br />
                            <input defaultValue={headline} placeholder='Write A Catchy Headline.. Example: 21 years experienced nuclear science professor.' onInput={e => set_headline(e.target.value)} type="text" style={{width: '80%', height: '50px', margin: '0 0 10px 0'}} />
                            <br/>

                            <label style={{fontWeight: 'bold'}} htmlFor="intro">Introduction</label><br />
                            <textarea defaultValue={intro} placeholder='Writw An Introduction Here... e.g(My name is Fabian and i am a graduate of Harvard University in Boston...)' onInput={e => set_intro(e.target.value)} style={{width: '80%', padding: '10px',height: '200px'}} name="" id="">
                                
                            </textarea>
                        </div>


                        <div className="profile-motivation" style={{textAlign: 'center', float: 'right'}}>
                            <label style={{fontWeight: 'bold'}} htmlFor="intro">Motivate</label><br />
                            <textarea defaultValue={motivation} placeholder='Write Something That Will Motivate Your Students...' onInput={e => set_motivation(e.target.value)} style={{width: '80%', padding: '10px',height: '250px'}} name="" id="">
                                
                            </textarea>
                        </div>
                            
                    </div>

                </form>

            </motion.div>
        </>
     );
}
 
export default TutorSetup;