import { useEffect, useState } from 'react';
import Tabs from '../../common/Tabs';
import AccDetails from './AccDetails';
import TutorAccSetup from './TutorAccSetup';
import { get_sessions_details } from '../../../axios/tutor';

const Accounting = () => {
    const [sessions, setSessions] = useState([])
    let [activeTab, setActiveTab] = useState(<TutorAccSetup />);
    const AcademyId = localStorage.getItem('tutor_user_id')

    useEffect(() => {
        const fetchSessionDetails = async () => {
            const data = await get_sessions_details(AcademyId);
            console.log(data);
            setSessions(data)
        }
        fetchSessionDetails()
    }, [])


    const tabs = [
        { label: 'Account Settings', component: <TutorAccSetup /> },
        { label: 'Tutor Account Details', component: <AccDetails sessions={sessions} /> },
    ];
    return (
        <>
            <Tabs links={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
            <div >
                {activeTab}
            </div>
        </>
    );
}

export default Accounting;