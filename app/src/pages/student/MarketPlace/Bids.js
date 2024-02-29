import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import { get_shortlist_ads } from '../../../axios/student'
import { useSelector } from 'react-redux'
import ShortlistAdCard from './ShortlistAdCard'
import { convertTutorIdToName } from '../../../helperFunctions/generalHelperFunctions'

const Bids = () => {
  const { student } = useSelector(state => state.student)
  const [ads, setAds] = useState([]);
  const [adDeleted, setAdDeleted] = useState()

  useEffect(() => {
    const fetchAds = async () => {
      const data = await get_shortlist_ads(student.AcademyId)
      setAds(data)
    }
    student.AcademyId && fetchAds()
  }, [student, adDeleted])

  return (
    <Layout>
      <div className='d-flex m-1 flex-wrap' style={{ height: "74vh", overflowY: "auto" }}>
        {ads.map(ad =>
          <ShortlistAdCard photo={ad.Photo} adText={ad.AdText}
            name={convertTutorIdToName(ad.AcademyId)} id={ad.Id} setAdDeleted={setAdDeleted} subject={ad.Subject}
            country={ad.Country}
            tutorId={ad.AcademyId}
          />
        )}
      </div>
    </Layout>

  )
}

export default Bids