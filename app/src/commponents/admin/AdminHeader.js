import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const Header = () => {

  
    let nav = useNavigate()
    
    let handleTabClick = e => {
        let clickedElem = e.currentTarget;
        let deactivedElem = [...clickedElem.parentElement.children].filter(item => item.hasAttribute('id'))[0];

        deactivedElem.removeAttribute('id');
        clickedElem.setAttribute('id', 'admin-tab-header-list-active')

        nav(`admin/${e.currentTarget.dataset.url}`)
 
    }

    let [screen_name, set_screen_name] = useState('')

    useEffect(() => {
        let name = window.localStorage.getItem('admin_screen_name');
        set_screen_name(name) 
    }, []);


    return ( 
        <>
        <div className="screen-name btn-success rounded" style={{display: screen_name === 'null' ? 'none': 'flex',position: 'fixed', top: '15px', zIndex: '1000', fontWeight: 'bold', color: '#fff', left: '45px', padding: '3px 5px 0', height:'30px'}}>
                {screen_name}
            </div>  
            <div className="admin-tab-header shadow-sm">
                <ul>
                    <li data-url='tutor-data' onClick={handleTabClick} id="admin-tab-header-list-active"><a>Tutor</a></li>
                    <li data-url='student-data' onClick={handleTabClick} ><a>Student</a></li>
                    <li data-url='emai-prog' onClick={handleTabClick} ><a>Email Prog</a></li>
                    <li data-url='new-subject' onClick={handleTabClick} ><a>New Subject</a></li>
                    <li data-url='accounting' onClick={handleTabClick} ><a>Accounting</a></li>
                    <li data-url='communications' onClick={handleTabClick} ><a>Communications </a></li>
                </ul>
            </div>
        </>
     );
}
 
export default Header;