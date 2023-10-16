import React from 'react'
import Header from '../components/student/Header'
import Footer from '../components/student/Footer'

const StudentLayout = ({ children }) => {
    return (
        <div>
            <Header />
            {children}
            <Footer />
        </div>
    )
}

export default StudentLayout;
