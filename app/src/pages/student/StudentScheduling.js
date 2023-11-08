import React from 'react'
import StudentCalenderScheduling from '../../components/student/StudentCalenderScheduling'
import StudentLayout from '../../layouts/StudentLayout'

const StudentScheduling = () => {
  return (
    <StudentLayout showLegacyFooter={false} >
      <StudentCalenderScheduling />
    </StudentLayout>
  )
}

export default StudentScheduling
