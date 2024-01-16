import { useEffect, useState } from 'react';
import Tabs from '../../common/Tabs';
import AccDetails from './AccDetails';
import TutorAccSetup from './TutorAccSetup';
import { get_sessions_details } from '../../../axios/tutor';

const Accounting = () => {
    const [sessions, setSessions] = useState([])
    let [activeTab, setActiveTab] = useState(<TutorAccSetup sessions={sessions} />);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const AcademyId = localStorage.getItem('tutor_user_id')

    useEffect(() => { setActiveTab(<TutorAccSetup sessions={sessions} />) }, [sessions])

    useEffect(() => {
        const fetchSessionDetails = async () => {
            const data = await get_sessions_details(AcademyId);
            setSessions(data)
        }
        fetchSessionDetails()
    }, [])

    const tabs = [
        { label: 'Account Settings', component: <TutorAccSetup sessions={sessions} /> },
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
            <div >
                {activeTab}
            </div>
        </>
    );
}

export default Accounting;