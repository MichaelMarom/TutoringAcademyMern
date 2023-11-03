import React from 'react'
import Header from '../components/tutor/Header'
import Footer from '../components/tutor/Footer'

const TutorLayout = ({ children, showLegacyFooter = true }) => {
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
}

export default TutorLayout
