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
        clickedElem.setAttribute('id', 'active')
        nav(`student/${e.target.dataset.url}`)
 
    }


    return ( 
        <>
            <div className="screen-name btn-primary rounded" style={{display: screen_name === 'null' ? 'none': 'flex',position: 'fixed', top: '15px', zIndex: '1000', fontWeight: 'bold', color: '#fff', left: '45px', padding: '3px 5px 0', height:'30px'}}>
                {screen_name}
            </div>
            <div className="student-tab-header shadow-sm">
                <div className="scroller-left" onClick={handle_scroll_left}></div>
                    <ul>
                        <li data-url='intro' onClick={handleTabClick} id="active">Introduction</li>
                        <li data-url='setup' onClick={handleTabClick} >Student Setup</li>
                        <li data-url='faculties' onClick={handleTabClick} >Faculties</li>
                        <li data-url='short-list' onClick={handleTabClick} >Short List</li>
                        <li data-url='accounting' onClick={handleTabClick} >Accounting</li>
                        <li data-url='schedule' onClick={handleTabClick} >Calender Scheduling</li>
                        <li data-url='my-students' onClick={handleTabClick} >Message Board</li>
                        <li data-url='market-place' onClick={handleTabClick} >Market place</li>
                        <li data-url='collaboration' onClick={handleTabClick} >Collaboration </li>
                        <li data-url='tutor-profile' onClick={handleTabClick} >Profile</li>
                    </ul>
                <div className="scroller-right" onClick={handle_scroll_right}></div>
            </div>
        </>
     );
}
 
export default Header;