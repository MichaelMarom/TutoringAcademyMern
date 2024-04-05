import React, { useEffect, useState } from 'react'
import Header from '../layouts/tutor/Header'
import { useSelector } from 'react-redux'
import SmallSideBar from '../components/common/SmallSideBar'
import { generateUpcomingSessionMessage } from '../helperFunctions/generalHelperFunctions'
import { useNavigate } from 'react-router-dom'

const TutorLayout = ({ children }) => {
    const { tutor } = useSelector(state => state.tutor);
    const { user } = useSelector(state => state.user)
    const { upcomingSessionFromNow, upcomingSession, inMins, currentSession } = useSelector(state => state.tutorSessions)
    const navigate = useNavigate()

    const extractRemainingtimeInInteger = parseInt(upcomingSessionFromNow.split(' ')[0]);
    console.log(extractRemainingtimeInInteger)

    useEffect(() => {
        // if (inMins && upcomingSession?.id && extractRemainingtimeInInteger < 4) {
        //     navigate(`/collab?sessionId=${upcomingSession.id}`)
        // }
        // else if (currentSession?.id) {
        //     navigate(`/collab?sessionId=${currentSession.id}`)
        // }
    }, [currentSession.id, inMins, upcomingSession])

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
