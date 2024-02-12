import React from 'react'
import Header from '../components/student/Header'
import { useSelector } from 'react-redux'

const StudentLayout = ({ children }) => {
    const { user } = useSelector(state => state.user)
    if (user.role === 'admin' && !localStorage.getItem('tutor_user_id'))
        return <div className='text-danger'>Please Select Student  From Student-Table to view tutor records</div>

    return (
        <div>
            <Header />
            {children}
        </div>
    )
}

export default StudentLayout;
