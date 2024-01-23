import React, { useEffect, useState } from 'react'
import { fetch_tutor_ads } from '../../../axios/tutor'
import { useSelector } from 'react-redux';
import Ads from './CreateComponent';
import { moment } from '../../../config/moment'
import { useNavigate } from 'react-router-dom';
import { showDate } from '../../../helperFunctions/timeHelperFunctions';

const ListComponent = ({ setActiveTab, setActiveTabIndex }) => {
    const [ad, setAds] = useState([]);
    const { tutor } = useSelector(state => state.tutor);
    const navigate = useNavigate()

    useEffect(() => {
        if (tutor.AcademyId) {
            const fetch = async () => {
                const data = await fetch_tutor_ads(tutor.AcademyId)
                setAds(data)
            }
            fetch()
        }
    }, [tutor])

    return (
        <div className='' style={{ height: "95vh", overflowY: "auto" }}>
            <div className='container'>
                {ad.map(item =>
                    <div onClick={() => {
                        navigate(`/tutor/market-place/${item.Id}`)
                    }
                    } className=' click-effect-elem rounded shadow-sm p-2 border m-1 d-flex ' style={{ gap: "20px" }} >
                        <p className=' m-0 text-decoration-underline '
                        >
                            {showDate(moment(item.Published_AT).toDate())}
                        </p>
                        <h5 className='click-elem m-0 text-decoration-underline'
                        >
                            {item.AdHeader}
                        </h5>
                    </div>
                )}

            </div>
        </div>
    )
}

export default ListComponent