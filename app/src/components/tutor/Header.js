import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";


const Header = () => {

    let nav = useNavigate()
    let location = useLocation()
    const [activeTab, setActiveTab] = useState('intro');

    let [screen_name, set_screen_name] = useState(window.localStorage.getItem('tutor_screen_name'));

    let [tutorState, setTutorState] = useState('Pending')
    const { tutor } = useSelector(state => state.tutor);

    useEffect(() => {
        const element = document.getElementById('tutor-tab-header-list-active');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, [location]);

    const tabs = [
        { url: '/tutor/intro', name: 'Introduction' },
        { url: '/tutor/setup', name: 'Tutor Setup' },
        { url: '/tutor/education', name: 'Education' },
        { url: '/tutor/rates', name: 'Motivate' },
        { url: '/tutor/accounting', name: 'Accounting' },
        { url: '/tutor/subjects', name: 'Subjects' },
        { url: '/tutor/my-students', name: 'My students' },
        { url: '/tutor/scheduling', name: 'Scheduling' },
        { url: '/tutor/term-of-use', name: 'Terms Of Use' },
        { url: '/tutor/chat', name: 'Message Board' },
        { url: '/tutor/market-place', name: 'Market place' },
        { url: '/tutor/collaboration', name: 'Collaboration' },
        { url: `/tutor-profile/${localStorage.getItem("tutor_user_id")}`, name: 'Profile' },

    ];

    useEffect(() => {
        set_screen_name(localStorage.getItem('tutor_screen_name'))
    }, [localStorage.getItem('tutor_screen_name')]);

    useEffect(() => {
        setTutorState(tutor.Status)
    }, [tutor]);

    useEffect(() => {
        const currentTab = location.pathname;
        setActiveTab(currentTab)
    }, [location])

    let handleTabClick = e => {
        let url = e.currentTarget.dataset.url;
        nav(`${url}`)

        let urls = [
            'intro', 'setup', 'education', 'rates', 'accounting', 'subjects', 'my-students',
            'scheduling', 'term-of-use', 'market-place', 'collaboration', 'tutor-profile'
        ]
        let new_index = urls.indexOf(url);
        window.localStorage.setItem('tab_index', new_index)
    }

    let handle_scroll_right = () => {

        let div = document.querySelector('.tutor-tab-header');
        let scroll_elem = div.children[1];
        let w = scroll_elem.offsetWidth;
        scroll_elem.scrollLeft = w;

    }

    let handle_scroll_left = () => {

        let div = document.querySelector('.tutor-tab-header');
        let scroll_elem = div.children[1];
        let w = scroll_elem.offsetWidth;
        scroll_elem.scrollLeft = -w

    }
    const statesColours = {
        'pending': "primary",
        'active': "success",
        "under-review": "warning",
        "disapproved": "danger"
    }

    return (
        <>
            <div className={`screen-name btn-success rounded text-bg-${statesColours[tutorState]} p-2`}
                style={{
                    display: screen_name === 'null' ? 'none' : 'flex', position: 'fixed',
                    top: '15px', zIndex: '999', fontWeight: 'bold', left: '45px',
                }}>
                {screen_name}
            </div>

            <div className="tutor-tab-header shadow-sm">
                <div style={{
                    margin: '0 0 0 0', display
                        : 'flex', alignItems: 'center', justifyContent: 'center', background: '#efefef',
                    opacity: '.7', height: '100%', transform: 'skew(-0deg)'
                }} className="scroller-left" onClick={handle_scroll_left}>
                    <div style={{ opacity: '1' }}>
                        <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 9L8 12M8 12L11 15M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                </div>
                <ul id="tutor-header-menus" className="header">
                    {tabs.map((tab) => (
                        <li
                            key={tab.url}
                            data-url={tab.url}
                            onClick={handleTabClick}
                            id={activeTab.includes(tab.url) ? 'tutor-tab-header-list-active' : ''}
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
                    <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 15L16 12M16 12L13 9M16 12H8M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                </div>



            </div>
        </>
    );
}

export default Header;

