import React from 'react'
import Header from '../components/student/Header'

const StudentLayout = ({ children }) => {

    return (
        <div>
            <Header />
            {children}
        </div>
    )
}

export default StudentLayout;
