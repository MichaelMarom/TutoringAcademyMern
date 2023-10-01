import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { get_tutor_status } from "../../axios/tutor";


const Header = () => {

  
    let nav = useNavigate()

    let [screen_name, set_screen_name] = useState(window.localStorage.getItem('tutor_screen_name'));

    let [tutorState, setTutorState] = useState('Pending')

    let {screenName} = useSelector(s => s.screenName);


    useEffect(() => {
        set_screen_name(screenName)
    }, [screenName]);



    useEffect(() => {
        let user_id = window.localStorage.getItem('tutor_user_id');
        get_tutor_status(user_id)
        .then((result) =>{
            console.log(result[0].Status)
            setTutorState(result[0].Status)
        })
        .catch(err => console.log(err)) 
    }, []);
    
    let handleTabClick = e => {
        let clickedElem = e.currentTarget;
        let url = e.currentTarget.dataset.url;
        let deactivedElem = [...clickedElem.parentElement.children].filter(item => item.hasAttribute('id'))[0];

        deactivedElem.removeAttribute('id');
        clickedElem.setAttribute('id', 'tutor-tab-header-list-active')

        nav(`tutor/${url}`)

        let urls = [
            'intro','setup','education','rates','accounting','subjects','my-students','scheduling','term-of-use','market-place','collaboration','tutor-profile'
        ]
        let new_index = urls.indexOf(url);
        window.localStorage.setItem('tab_index', new_index)
 
    }

    let handle_scroll_right = () => {

        let div = document.querySelector('.tutor-tab-header');
        let scroll_elem = div.children[1];
        console.log(scroll_elem) 
        let w = scroll_elem.offsetWidth;
        scroll_elem.scrollLeft = w;

    }

    let handle_scroll_left = () => {
        
        let div = document.querySelector('.tutor-tab-header');
        let scroll_elem = div.children[1];
        let w = scroll_elem.offsetWidth;
        scroll_elem.scrollLeft = -w

    }


    return ( 
        <>

        <div className="screen-name btn-success rounded" style={{display: screen_name === 'null' ? 'none': 'flex',position: 'fixed', top: '15px', zIndex: '2400', fontWeight: 'bold', color: '#fff', left: '45px', padding: '3px 5px 0', height:'30px',background: tutorState === 'Pending' ? 'yellow' : tutorState === 'Active' ? 'green' : tutorState === 'Suspended' ? 'orange' : 'red',color: tutorState === 'Pending' ? '#000' : tutorState === 'Active' ? '#fff' : tutorState === 'Suspended' ? '#fff' : '#fff'}}>
            {screen_name}
        </div>

            <div className="tutor-tab-header shadow-sm">
                <div style={{margin: '0 0 0 0', display
                        : 'flex', alignItems: 'center', justifyContent: 'center',background: '#efefef', opacity: '.7', height: '100%', transform: 'skew(-0deg)'}}  className="scroller-left" onClick={handle_scroll_left}>
                    <div style={{opacity: '1'}}>
                    <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 9L8 12M8 12L11 15M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>   
                    </div>           

                </div>
                <ul id="tutor-header-menus">
                    <li data-url='intro' onClick={handleTabClick} id="tutor-tab-header-list-active"><a>Introduction</a></li>
                    <li data-url='setup' onClick={handleTabClick} ><a>Tutor Setup</a></li>
                    <li data-url='education' onClick={handleTabClick} ><a>Education</a></li>
                    <li data-url='rates' onClick={handleTabClick} ><a>Motivate</a></li>
                    <li data-url='accounting' onClick={handleTabClick} ><a>Accounting</a></li>
                    <li data-url='subjects' onClick={handleTabClick} ><a>Subjects</a></li>
                    <li data-url='my-students' onClick={handleTabClick} ><a>My students</a></li>
                    <li data-url='scheduling' onClick={handleTabClick} ><a>Scheduling</a></li>
                    <li data-url='term-of-use' onClick={handleTabClick} ><a>Terms Of Use</a></li>
                    <li data-url='message-board' onClick={handleTabClick} ><a>Message Board</a></li>
                    <li data-url='market-place' onClick={handleTabClick} ><a>Market place</a></li>
                    <li data-url='collaboration' onClick={handleTabClick} ><a>Collaboration </a></li>
                    <li data-url='tutor-profile' onClick={handleTabClick} ><a>Tutor Profile</a></li>
                </ul>

                {/*<div className="tutor-status" style={{padding: '5px',height: '30px',background: tutorState === 'Pending' ? 'yellow' : tutorState === 'Active' ? 'green' : tutorState === 'Suspended' ? 'orange' : 'red',color: tutorState === 'Pending' ? '#000' : tutorState === 'Active' ? '#fff' : tutorState === 'Suspended' ? '#fff' : '#fff'}}>
                    {tutorState}
    </div>*/}

                <div className="scroller-right" onClick={handle_scroll_right}></div>
                <div style={{margin: '0 0 0 0',background: '#efefef', display
                        : 'flex', alignItems: 'center', justifyContent: 'center', opacity: '.7', height: '100%', transform: 'skew(-0deg)'}}  className="scroller-right" onClick={handle_scroll_right}>
                    <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">``
                        <path d="M13 15L16 12M16 12L13 9M16 12H8M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>

                </div>



            </div>
        </>
     );
}
 
export default Header;

