import React from 'react'
import Header from '../components/student/Header'
import Footer from '../components/student/Footer'

const StudentLayout = ({ children, showLegacyFooter = true }) => {

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

export default StudentLayout;
