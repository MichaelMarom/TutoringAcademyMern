import React from 'react'
import Header from '../components/tutor/Header'
import Footer from '../components/tutor/Footer'

const TutorLayout = ({ children }) => {
    return (
        <div>
            <Header />
            {children}
            <Footer />
        </div>
    )
}

export default TutorLayout
