import React, { useEffect } from 'react'
import Header from '../layouts/student/Header'
import { useSelector } from 'react-redux'
import SmallSideBar from '../components/common/SmallSideBar'
import { generateUpcomingSessionMessage } from '../helperFunctions/generalHelperFunctions'
import { useNavigate } from 'react-router-dom'

const StudentLayout = ({ children }) => {
    const navigate = useNavigate()
    const { user } = useSelector(state => state.user)
    const { student } = useSelector(state => state.student)
    const { upcomingSessionFromNow, upcomingSession, inMins, currentSession } = useSelector(state => state.studentSessions)
    const extractRemainingtimeInInteger = parseInt(upcomingSessionFromNow.split(' ')[0]);
    console.log(extractRemainingtimeInInteger)

    useEffect(() => {
        if (inMins && upcomingSession?.id && extractRemainingtimeInInteger < 4) {
            navigate(`/collab?sessionId=${upcomingSession.id}`)
        }
        else if (currentSession?.id) {
            navigate(`/collab?sessionId=${currentSession.id}`)
        }
    }, [currentSession.id, inMins, upcomingSession])

    if (user.role === 'admin' && !student?.AcademyId)
        return <div className='text-danger'>Please Select Student from Student-Table to view tutor records</div>
    return (
        <div>
            <Header />
            <SmallSideBar inMins={inMins} message={generateUpcomingSessionMessage(upcomingSession, upcomingSessionFromNow)} />
            {children}
        </div>
    )
}

export default StudentLayout;
