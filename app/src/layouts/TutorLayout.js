import React, { useEffect, useState } from 'react'
import Header from '../layouts/tutor/Header'
import { useSelector } from 'react-redux'
import Steps from '../components/tutor/Steps'
import SmallSideBar from '../components/common/SmallSideBar'
import { generateUpcomingSessionMessage } from '../helperFunctions/generalHelperFunctions'
import { useNavigate } from 'react-router-dom'

const TutorLayout = ({ children }) => {
    const { tutor } = useSelector(state => state.tutor);
    const { user } = useSelector(state => state.user)
    const { upcomingSessionFromNow, upcomingSession, inMins, currentSession } = useSelector(state => state.tutorSessions)
    const [currentStep, setCurrentStep] = useState(3);
    const navigate = useNavigate()
    ///show profile button when currentStep>1
    const steps = [
        { name: 'Profile Setup', url: "/tutor/setup", step: 1 },
        { name: 'Education', url: "/tutor/edu", step: 2 },
        { name: 'Bank', url: "/tutor/accounting", step: 3 },
        { name: 'Subject', url: "/tutor/subject", step: 4 },
    ];

    useEffect(() => {
        if (currentSession?.id) {
            navigate(`${process.env.REACT_APP_BASE_URL}/collab?sessionId=${currentSession.id}`)
        }
    }, [currentSession])

    if (user.role !== 'admin' && (tutor.Status === 'closed' || tutor.Status === 'disapproved'))
        return <div className='text-danger'>Your Account is Closed or Suspended. Please contact adminitrator.</div>
    if (user.role === 'admin' && !localStorage.getItem('tutor_user_id'))
        return <div className='text-danger'>Please Select Tutor  From Tutor-Table to view tutor records</div>
    return (
        <div>
            {/* {(!tutor.Status || tutor.Status === 'pending') ?
                <Steps steps={steps} currentStep={currentStep} /> : */}
            < Header />
            <SmallSideBar inMins={inMins} currentSession={currentSession} message={generateUpcomingSessionMessage(upcomingSession, upcomingSessionFromNow)} />
            {children}
        </div>
    )
}

export default TutorLayout
