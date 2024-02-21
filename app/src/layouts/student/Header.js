import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getBookedSlot } from "../../axios/student";
import { useDispatch, useSelector } from "react-redux";
import { FaSignOutAlt } from "react-icons/fa";
import Tooltip from "../../components/common/ToolTip";
import { useClerk } from "@clerk/clerk-react";
import { setUser } from "../../redux/auth_state/auth";
import { setTutor } from "../../redux/tutor_store/tutorData";
import { setStudent } from "../../redux/student_store/studentData";
import { setShortlist } from "../../redux/student_store/shortlist";


const Header = () => {
    const { signOut } = useClerk();

    const dispatch = useDispatch()
    let location = useLocation()
    const { student } = useSelector(state => state.student)
    const tabs = [
        { name: 'Introduction', url: 'intro' },
        { name: 'Student Setup', url: 'setup' },
        { name: 'Faculties', url: 'faculties' },
        { name: 'Short List', url: 'short-list' },
        { name: 'Accounting', url: 'accounting' },
        { name: "Feedback", url: 'feedback' },
        { name: 'Calender', url: 'calender' },
        { name: 'Terms Of Use', url: 'term-of-use' },
        { name: 'Message Board', url: 'chat' },
        { name: 'Market place', url: 'market-place' },
        { name: 'Collaboration', url: 'collaboration' },
        { name: 'Profile', url: 'profile' },
    ];

    useEffect(() => {
        getBookedSlot(window.localStorage.getItem('student_user_id'))
            .then(({ data }) => {
                data.map(item => {
                    let result = JSON.parse(item.bookedSlots)[0]?.start;
                    let setDate = new Date(result).getTime() / 1000
                    let newDate = new Date().getTime() / 1000

                    let sec = (newDate - setDate)
                    let min = sec / 60;

                    if (min <= 3 && min !== 0) {

                        if (location.pathname.split('/').splice(-1)[0] !== 'collaboration') {
                            // navigate('/student/collaboration')
                            // alert(`You are beeing redirected to your lesson which will begin soon`)
                        }
                    }

                })

            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    let nav = useNavigate()
    const [activeTab, setActiveTab] = useState('')

    useEffect(() => {
        const element = document.getElementById('student-tab-header-list-active');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }, [location.pathname, activeTab]);

    useEffect(() => {
        const currentTab = location.pathname.split('/').pop();
        setActiveTab(currentTab)
    }, [location])


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
    const handleSignOut = () => {
        localStorage.clear()
        dispatch(setUser({}))

        dispatch(setTutor({}))
        dispatch(setStudent({}))
        dispatch(setShortlist())
        //setTutor tonull
        //setStudent tonull
        nav('/login')
    }


    let handleTabClick = e => {
        nav(`/student/${e.currentTarget.dataset.url}`)
    }

    return (
        <>
            <div className={`screen-name btn-success rounded  p-1 flex-column`}
                style={{
                    fontSize: "14px",
                    display: 'flex', position: 'fixed',
                    top: '1px', zIndex: '999', left: '3%',
                }}>
                <div style={{ fontWeight: 'bold' }}>{student.ScreenName}</div>

            </div>

            <div className="tutor-tab-header shadow-sm">
                <div style={{
                    margin: '0 0 0 0', display
                        : 'flex', alignItems: 'center', justifyContent: 'center', background: '#efefef',
                    opacity: '.7', height: '100%', transform: 'skew(-0deg)', width: "50px",
                }} className="scroller-left" onClick={handle_scroll_left}>
                    <div style={{ opacity: '1' }}>
                        <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 9L8 12M8 12L11 15M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                </div>
                <ul id="" className={` header`} style={{
                    background: 'inherit',
                    pointerEvents: 'auto',
                    width: 'calc(100% - 300px)',
                    margin: '0 200px 0 200px'
                }}>
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
                <div  className="d-flex border rounded p-1 justify-content-center align-items-center " style={{ marginRight: "60px", cursor: "pointer" }}
                onClick={() => signOut(() => handleSignOut())}>
                    <p className="text-danger m-0">Signout</p>
                    <Tooltip text={"signout"} direction="bottomright">
                        <FaSignOutAlt color="red"  />
                    </Tooltip>
                </div>
                <div className="scroller-right" onClick={handle_scroll_right}
                    style={{
                        margin: '0 0 0 0', display
                            : 'flex', alignItems: 'center', justifyContent: 'center', background: '#efefef',
                        opacity: '.7', height: '100%', transform: 'skew(-0deg)', width: "50px"
                    }}></div>
                <div style={{
                    margin: '0 0 0 0', background: '#efefef', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', opacity: '.7', height: '100%',
                    transform: 'skew(-0deg)'
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