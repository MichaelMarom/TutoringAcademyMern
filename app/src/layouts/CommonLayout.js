import React from 'react'
import TutorHeader from '../components/tutor/Header'
import Header from '../components/student/Header'


const CommonLayout = ({ role, children, showLegacyFooter = true }) => {
    if (role === 'student')
        return (
            <div>
                <Header />
                {children}
            </div>
        )
    else if (role === 'tutor')
        return (
            <div>
                <TutorHeader />
                {children}
            </div>
        )
    else return null
}

export default CommonLayout
