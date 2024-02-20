import React from 'react'
import TutorHeader from '../components/tutor/Header'
import Header from '../components/student/Header'
import SmallSideBar from '../components/common/SmallSideBar'
import { generateUpcomingSessionMessage } from '../helperFunctions/generalHelperFunctions'
import { useSelector } from 'react-redux'


const CommonLayout = ({ role, children, showLegacyFooter = true }) => {
    const { upcomingSessionFromNow, upcomingSession, inMins } = useSelector(state => state.studentSessions)

    if (role === 'student')
        return (
            <div>
                <Header />
                <SmallSideBar inMins={inMins} message={generateUpcomingSessionMessage(upcomingSession, upcomingSessionFromNow)} />

                {children}
            </div>
        )
    else if (role === 'tutor')
        return (
            <div>
                <TutorHeader />
                <SmallSideBar inMins={inMins} message={generateUpcomingSessionMessage(upcomingSession, upcomingSessionFromNow)} />
                {children}
            </div>
        )
    else return null
}

export default CommonLayout
