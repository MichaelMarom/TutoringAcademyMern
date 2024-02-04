import React from 'react'
import StudentLayout from '../../layouts/StudentLayout'
import StudentMarketPlaceComp from '../../components/student/StudentMarketPlace'

const StudentMarketPlace = () => {
  return (
    <StudentLayout showLegacyFooter={false}>
      <StudentMarketPlaceComp />
    </StudentLayout>
  )
}

export default StudentMarketPlace
