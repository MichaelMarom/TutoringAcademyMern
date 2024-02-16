import React, { useEffect, useState } from 'react'
import Layout from './Layout';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetch_tutor_ads } from '../../../axios/tutor';
import { fetch_published_ads } from '../../../axios/student';
import { moment } from '../../../config/moment'
import { showDate } from '../../../helperFunctions/timeHelperFunctions';

const Marketplace = () => {
    const [ad, setAds] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        const fetch = async () => {
            const data = await fetch_published_ads()
            setAds(data)
        }
        fetch()
    }, [])

    return (
        <Layout>
            <div className='' style={{ height: "95vh", overflowY: "auto" }}>
                <div className='container'>
                    {ad.map(item =>
                        <div onClick={() => {
                            // navigate(`/student/market-place/${item.Id}`)
                        }
                        } className=' click-effect-elem rounded shadow-sm p-2 border m-1 d-flex ' style={{ gap: "20px" }} >
                            {item.Published_At &&
                                <p className=' m-0 text-decoration-underline ' >
                                    {showDate(moment(item.Published_At).toDate())}
                                </p>
                            }
                            <h5 className='click-elem m-0 text-decoration-underline' >
                                {item.AdHeader}
                            </h5>
                        </div>
                    )}

                </div>
            </div>
        </Layout>
    )
}

export default Marketplace