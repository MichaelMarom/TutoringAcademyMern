import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getBookedSlot } from "../../axios/student";


const Header = () => {

    let navigate = useNavigate()
    let location = useLocation()
    const tabs = [
        { name: 'Introduction', url: 'intro' },
        { name: 'Student Setup', url: 'setup' },
        { name: 'Faculties', url: 'faculties' },
        { name: 'Short List', url: 'short-list' },
        { name: 'Accounting', url: 'accounting' },
        // { name: 'Book Session', url: 'booking' },
        { name: "Feedback", url: 'feedback' },
        { name: 'Calender', url: 'calender' },
        { name: 'Terms Of Use', url: 'term-of-use' },
        { name: 'Message Board', url: 'my-students' },
        { name: 'Market place', url: 'market-place' },
        { name: 'Collaboration', url: 'collaboration' },
        { name: 'Profile', url: 'profile' },
    ];

    useEffect(() => {
        getBookedSlot(window.localStorage.getItem('student_user_id'))
        .then(({data}) => {
            data.map(item => {
                let result = JSON.parse(item.bookedSlots)[0]?.start;
                let setDate = new Date(result).getTime()/1000
                let newDate = new Date().getTime()/1000

                let sec = (newDate - setDate)
                let min = sec/60;

                if(min <= 3 && min !== 0 ){

                    if(location.pathname.split('/').splice(-1)[0] !== 'collaboration'){
                        navigate('/student/collaboration')
                        alert(`You are beeing redirected to your lesson which will begin soon`)
                    }
                    

                }
                

               
            })

        })
        .catch(err => {
            console.log(err)
        })
    },[])

    let nav = useNavigate()
    let [screen_name, set_screen_name] = useState('')
    const [activeTab, setActiveTab] = useState('')

    useEffect(() => {
        const element = document.getElementById('student-tab-header-list-active');
        if (element) {
            console.log('enter')
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, [location.pathname, activeTab]);


    useEffect(() => {
        let name = window.localStorage.getItem('student_screen_name');
        set_screen_name(name)
    }, []);

    useEffect(() => {
        const currentTab = location.pathname.split('/').pop();
        setActiveTab(currentTab)
    }, [location])


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
        nav(`/student/${e.currentTarget.dataset.url}`)
    }


    return (
        <>
            <div className="screen-name btn-primary rounded" 
            
            style={{ display: screen_name === 'null' ? 'none' : 'flex', position: 'fixed',
             top: '15px', zIndex: '999', fontWeight: 'bold', color: '#fff', left: '45px',
              padding: '3px 5px 0 5px', height: '30px' }}>
                {localStorage.getItem('student_screen_name')}
            </div>
            <div className="student-tab-header shadow-sm">
                <div style={{
                    margin: '0 0 0 0', display
                        : 'flex', alignItems: 'center', justifyContent: 'center', background: '#efefef', opacity: '.7', height: '100%', transform: 'skew(-0deg)'
                }} className="scroller-left" onClick={handle_scroll_left}>
                    <div style={{ opacity: '1' }}>
                        <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 9L8 12M8 12L11 15M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>

                </div>
                <ul className="header">
                    {tabs.map((tab) => (
                        <li
                            key={tab.url}
                            data-url={tab.url}
                            onClick={handleTabClick}
                            id={tab.url === activeTab ? 'student-tab-header-list-active' : ''}
                        >
                            <a>{tab.name}</a>
                        </li>
                    ))}
                </ul>
                <div className="scroller-right" onClick={handle_scroll_right}></div>
                <div style={{
                    margin: '0 0 0 0', background: '#efefef', display
                        : 'flex', alignItems: 'center', justifyContent: 'center', opacity: '.7', height: '100%', transform: 'skew(-0deg)'
                }} className="scroller-right" onClick={handle_scroll_right}>
                    <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">``
                        <path d="M13 15L16 12M16 12L13 9M16 12H8M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                </div>
            </div>
        </>
    );
}

export default Header;