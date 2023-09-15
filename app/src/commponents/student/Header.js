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

    
    let handleTabClick = e => {
        let clickedElem = e.target;
        let deactivedElem = [...clickedElem.parentElement.children].filter(item => item.hasAttribute('id'))[0];

        deactivedElem.removeAttribute('id');
        clickedElem.setAttribute('id', 'active')

        nav(`student/${e.target.dataset.url}`)
 
    }


    return ( 
        <>
            <div className="screen-name" style={{position: 'fixed', top: '40px', zIndex: '1000', background: '#000', color: '#fff', left: '50px', padding: '10px'}}>
                {screen_name}
            </div>
            <div className="tutor-tab-header shadow-sm">
                <div className="scroller-left" onClick={handle_scroll_left}></div>
                    <ul>
                        <li data-url='intro' onClick={handleTabClick} id="active">Introduction</li>
                        <li data-url='setup' onClick={handleTabClick} >Student Setup</li>
                        <li data-url='faculties' onClick={handleTabClick} >Faculties</li>
                        <li data-url='short-list' onClick={handleTabClick} >Short List</li>
                        <li data-url='accounting' onClick={handleTabClick} >Accounting</li>
                        <li data-url='subjects' onClick={handleTabClick} >Calender Scheduling</li>
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