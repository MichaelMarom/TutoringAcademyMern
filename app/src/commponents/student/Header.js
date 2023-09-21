import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const Header = () => {

  
    let nav = useNavigate()

    let [screen_name, set_screen_name] = useState('')

    useEffect(() => {
        let name = window.localStorage.getItem('student_screen_name');
        set_screen_name(name) 
    }, []);

   

    let handle_scroll_right = () => {

        let div = document.querySelector('.student-tab-header');
        let scroll_elem = div.children[1];
        console.log(scroll_elem) 
        let w = scroll_elem.offsetWidth;
        scroll_elem.scrollLeft = w;

    }

    let handle_scroll_left = () => {
        
        let div = document.querySelector('.student-tab-header');
        let scroll_elem = div.children[1];
        let w = scroll_elem.offsetWidth;
        scroll_elem.scrollLeft = -w

    }

    
    let handleTabClick = e => {
        let clickedElem = e.currentTarget;
        let deactivedElem = [...clickedElem.parentElement.children].filter(item => item.hasAttribute('id'))[0];

        deactivedElem.removeAttribute('id');
        clickedElem.setAttribute('id', 'student-tab-header-list-active')

        nav(`student/${e.currentTarget.dataset.url}`)
 
    }


    return ( 
        <>
            <div className="screen-name btn-primary rounded" style={{display: screen_name === 'null' ? 'none': 'flex',position: 'fixed', top: '15px', zIndex: '1000', fontWeight: 'bold', color: '#fff', left: '45px', padding: '3px 5px 0', height:'30px'}}>
                {screen_name}
            </div>
            <div className="student-tab-header shadow-sm">
                <div className="scroller-left" onClick={handle_scroll_left}></div>
                    <ul>
                        <li data-url='intro' onClick={handleTabClick} id="student-tab-header-list-active"><a>Introduction</a></li>
                        <li data-url='setup' onClick={handleTabClick} ><a>Student Setup</a></li>
                        <li data-url='faculties' onClick={handleTabClick} ><a>Faculties</a></li>
                        <li data-url='short-list' onClick={handleTabClick} ><a>Short List</a></li>
                        <li data-url='accounting' onClick={handleTabClick} ><a>Accounting</a></li>
                        <li data-url='subjects' onClick={handleTabClick} ><a>Calender Scheduling</a></li>
                        <li data-url='my-students' onClick={handleTabClick} ><a>Message Board</a></li>
                        <li data-url='market-place' onClick={handleTabClick} ><a>Market place</a></li>
                        <li data-url='collaboration' onClick={handleTabClick} ><a>Collaboration </a></li>
                        <li data-url='tutor-profile' onClick={handleTabClick} ><a>Profile</a></li>
                    </ul>
                <div className="scroller-right" onClick={handle_scroll_right}></div>
            </div>
        </>
     );
}
 
export default Header;