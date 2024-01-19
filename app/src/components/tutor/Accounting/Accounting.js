import { useEffect, useState } from 'react';
import Tabs from '../../common/Tabs';
import AccDetails from './AccDetails';
import TutorAccSetup from './TutorAccSetup';
import { get_sessions_details } from '../../../axios/tutor';

const Accounting = () => {
    const [sessions, setSessions] = useState([])
    const [currentYearEarning, setCurrentYearEarning] = useState(0);
    const [currentYearHrs, setCurrentYearHrs] = useState(0);

    let [activeTab, setActiveTab] = useState(<TutorAccSetup sessions={sessions} currentYearAccHours={currentYearHrs} currentYearEarning={currentYearEarning} />);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const AcademyId = localStorage.getItem('tutor_user_id')

    useEffect(() => { setActiveTab(<TutorAccSetup sessions={sessions} currentYearAccHours={currentYearHrs} currentYearEarning={currentYearEarning} />) }, [sessions])

    useEffect(() => {
        const fetchSessionDetails = async () => {
            const data = await get_sessions_details(AcademyId);
            setSessions(data.sessions)
            setCurrentYearHrs(data.currentYearAccHours)
            setCurrentYearEarning(data.currentYearEarning)
        }
        fetchSessionDetails()
    }, [])

    const tabs = [
        { label: 'Account Settings', component: <TutorAccSetup sessions={sessions} currentYearAccHours={currentYearHrs} currentYearEarning={currentYearEarning} /> },
        { label: 'Tutor Account Details', component: <AccDetails sessions={sessions} /> },
    ];

    return (
        <>
            <Tabs links={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setActiveTabIndex={setActiveTabIndex}
                activeTabIndex={activeTabIndex}
            />
            <div>
                {activeTab}
            </div>
        </>
    );
}

export default Accounting;