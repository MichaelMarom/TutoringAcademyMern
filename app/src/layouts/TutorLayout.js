import React, { useState } from 'react'
import Header from '../components/tutor/Header'
import { useSelector } from 'react-redux'
import Steps from '../components/tutor/Steps'

const TutorLayout = ({ children, showLegacyFooter = true }) => {
    const { tutor } = useSelector(state => state.tutor);
    const { user } = useSelector(state => state.user)

    const [currentStep, setCurrentStep] = useState(3);
    ///show profile button when currentStep>1
    const steps = [
        { name: 'Profile Setup', url: "/tutor/setup", step: 1 },
        { name: 'Education', url: "/tutor/edu", step: 2 },
        { name: 'Bank', url: "/tutor/accounting", step: 3 },
        { name: 'Subject', url: "/tutor/subject", step: 4 },
    ];

    if (user.role === 'admin' && !localStorage.getItem('tutor_user_id'))
        return <div className='text-danger'>Please Select Tutor  From Tutor-Table to view tutor records</div>
    return (
        <div>
            {/* {(!tutor.Status || tutor.Status === 'pending') ?
                <Steps steps={steps} currentStep={currentStep} /> : */}
            < Header />
            {/* // } */}
            {children}
        </div>
    )
}

export default TutorLayout
