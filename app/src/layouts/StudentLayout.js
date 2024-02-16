import React from 'react'
import Header from '../components/student/Header'
import { useSelector } from 'react-redux'
import SmallSideBar from '../components/common/SmallSideBar'
import { generateUpcomingSessionMessage } from '../helperFunctions/generalHelperFunctions'

const StudentLayout = ({ children }) => {
    const { user } = useSelector(state => state.user)
    const { student } = useSelector(state => state.student)
    const { upcomingSessionFromNow, upcomingSession, inMins } = useSelector(state => state.studentSessions)
    console.log(inMins)


    if (user.role === 'admin' && !student?.AcademyId)
        return <div className='text-danger'>Please Select Student  From Student-Table to view tutor records</div>
    return (
        <div>
            <Header />
            <SmallSideBar inMins={inMins} message={generateUpcomingSessionMessage(upcomingSession, upcomingSessionFromNow)} />
            {children}
        </div>
    )
}

export default StudentLayout;
