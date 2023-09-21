import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


const Header = () => {

  
    let nav = useNavigate()

    let [screen_name, set_screen_name] = useState(window.localStorage.getItem('tutor_screen_name'));

    let {screenName} = useSelector(s => s.screenName);


    useEffect(() => {
        set_screen_name(screenName)
    }, [screenName]);
    
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
        let scroll_elem = div.children[0];
        let w = scroll_elem.offsetWidth;
        scroll_elem.scrollLeft = -w

    }


    return ( 
        <>

        <div className="screen-name btn-success rounded" style={{display: screen_name === 'null' ? 'none': 'flex',position: 'fixed', top: '15px', zIndex: '1000', fontWeight: 'bold', color: '#fff', left: '45px', padding: '3px 5px 0', height:'30px'}}>
            {screen_name}
        </div>

            <div className="tutor-tab-header shadow-sm">
                <div className="scroller-left" onClick={handle_scroll_left}></div>
                <ul>
                    <li data-url='intro' onClick={handleTabClick} id="tutor-tab-header-list-active"><a>Introduction</a></li>
                    <li data-url='setup' onClick={handleTabClick} ><a>Tutor Setup</a></li>
                    <li data-url='education' onClick={handleTabClick} ><a>Education</a></li>
                    <li data-url='rates' onClick={handleTabClick} ><a>My Rates</a></li>
                    <li data-url='accounting' onClick={handleTabClick} ><a>Accounting</a></li>
                    <li data-url='subjects' onClick={handleTabClick} ><a>Subjects</a></li>
                    <li data-url='my-students' onClick={handleTabClick} ><a>My students</a></li>
                    <li data-url='scheduling' onClick={handleTabClick} ><a>Scheduling</a></li>
                    <li data-url='term-of-use' onClick={handleTabClick} ><a>Terms Of Use</a></li>
                    <li data-url='market-place' onClick={handleTabClick} ><a>Market place</a></li>
                    <li data-url='collaboration' onClick={handleTabClick} ><a>Collaboration </a></li>
                    <li data-url='tutor-profile' onClick={handleTabClick} ><a>Tutor Profile</a></li>
                </ul>
                <div className="scroller-right" onClick={handle_scroll_right}></div>
            </div>
        </>
     );
}
 
export default Header;

