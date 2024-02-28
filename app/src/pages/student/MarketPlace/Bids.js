import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import { get_shortlist_ads } from '../../../axios/student'
import { useSelector } from 'react-redux'
import ShortlistAdCard from './ShortlistAdCard'
import { convertTutorIdToName } from '../../../helperFunctions/generalHelperFunctions'

const Bids = () => {
  const { student } = useSelector(state => state.student)
  const [ads, setAds] = useState([]);

  useEffect(() => {
    const fetchAds = async () => {
      const data = await get_shortlist_ads(student.AcademyId)
      setAds(data)
    }
    student.AcademyId && fetchAds()
  }, [student])

  return (
    <Layout>
      <div className='d-flex m-1' style={{ gap: "2%" }}>
        {ads.map(ad =>
          <ShortlistAdCard photo={ad.Photo} adText={ad.AdText} name={convertTutorIdToName(ad.AcademyId)} />
        )}
      </div>
    </Layout>

  )
}

export default Bids