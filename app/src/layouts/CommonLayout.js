import React from 'react'
import TutorHeader from '../layouts/tutor/Header'
import Header from '../layouts/student/Header'
import SmallSideBar from '../components/common/SmallSideBar'
import { generateUpcomingSessionMessage } from '../helperFunctions/generalHelperFunctions'
import { useSelector } from 'react-redux'
import AdminLayout from './AdminLayout'


const CommonLayout = ({ role, children }) => {
    const { upcomingSessionFromNow, upcomingSession, inMins } = useSelector(state => state.studentSessions)
    const { upcomingSessionFromNow: tutorUpcomingFromNow,
        upcomingSession: tutorUpcoming,
        inMins: isTutorUpcomgLessonInMins } = useSelector(state => state.tutorSessions)

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
                <SmallSideBar
                    inMins={isTutorUpcomgLessonInMins}
                    message={generateUpcomingSessionMessage(tutorUpcoming, tutorUpcomingFromNow)} />
                {children}
            </div>
        )
    else if (role === 'admin')
        return (
            <div>
                <AdminLayout />
                {/* <SmallSideBar
                    inMins={isTutorUpcomgLessonInMins}
                    message={generateUpcomingSessionMessage(tutorUpcoming, tutorUpcomingFromNow)} /> */}
                {children}
            </div>
        )
    else return null
}

export default CommonLayout
