import React from 'react'
import TutorHeader from '../components/tutor/Header'
import TutorFooter from '../components/tutor/Footer'
import Header from '../components/student/Header'
import Footer from '../components/student/Footer'


const CommonLayout = ({ role, children, showLegacyFooter = true }) => {
    if (role === 'student')
        return (
            <div>
                <Header />
                {children}
                {showLegacyFooter ?
                    <Footer /> :
                    null
                }
            </div>
        )
    else if (role === 'tutor')
        return (
            <div>
                <TutorHeader />
                {children}
                {showLegacyFooter ?
                    <TutorFooter /> :
                    null
                }
            </div>
        )
    else return null
}

export default CommonLayout
