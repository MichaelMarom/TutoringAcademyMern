import React, { useEffect, useState } from 'react'
import { fetch_tutor_ads } from '../../../axios/tutor'
import { useSelector } from 'react-redux';
import Ads from './CreateComponent';
import { useNavigate } from 'react-router-dom';

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
                    <div className='rounded shadow-sm p-2 border m-1' >
                        <h5 className='click-elem m-0 text-decoration-underline'
                            onClick={() => {
                                navigate(`/tutor/market-place/${item.Id}`)
                            }
                            }>
                            {item.AdHeader}
                        </h5>
                    </div>
                )}

            </div>
        </div>
    )
}

export default ListComponent