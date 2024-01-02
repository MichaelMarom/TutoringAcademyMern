import { useState } from 'react';
import { COLUMNS } from '../../Tables/Me/columns';
import { useEffect } from 'react';
import { get_my_data, get_rates, get_tutor_profile } from '../../axios/tutor';
import { convertGMTOffsetToLocalString } from '../../helperFunctions/timeHelperFunctions';
import { useParams } from 'react-router';
import Avatar from '../common/Avatar';
import { capitalizeFirstLetter, escapeHtml } from '../../helperFunctions/generalHelperFunctions';
import Button from '../common/Button';
import Loading from '../common/Loading';
import { FaLocationDot } from "react-icons/fa6";
import { IoTime } from "react-icons/io5";
import { GiTimeSynchronization } from "react-icons/gi";


const TutorProfile = () => {
    const params = useParams();
    const studentId = localStorage.getItem('student_user_id');
    const [data, setProfileData] = useState({})
    const [activeTab, setActiveTab] = useState('bach')

    useEffect(() => {
        const fetch_profile = async () => {
            const data = await get_tutor_profile(params.id, studentId);
            setProfileData(data)
        }

        fetch_profile();
    }, [params.id, studentId])
    if (!Object.keys(data).length)
        return <Loading />
    return (
        <div style={{ background: "lightGray", height: "90vh", overflowY: "auto" }}>
            <div className='container'>
                <div className=''>
                    <div >
                        <video src={data.Video} className="w-100 bg-white rounded py-5  px-4 mt-4" style={{ height: "300px" }}
                            controls autoplay
                        />
                    </div>
                    <div className='d-flex align-items-start justify-content-between w-100 mt-4 rounded  bg-white ' style={{ bottom: "-100px" }}>
                        <div className='d-flex align-items-start'>
                            <div className='p-1 bg-white rounded-circle'>
                                <Avatar avatarSrc={data.Photo} size='150px' indicSize='30px' />
                            </div>
                            <div className='text-start px-2 m-4 d-flex flex-column' style={{ gap: "5px" }} >
                                <h2>
                                    {capitalizeFirstLetter(data.TutorScreenname)}</h2>
                                <div className='d-flex align-items-center' style={{ gap: "20px" }}>

                                    <div className='d-flex align-items-center' style={{ gap: "10px" }}>
                                        <FaLocationDot size={32} />
                                        <h5 className='m-0'> {data.Country}</h5>
                                    </div>
                                    <div className='d-flex align-items-end' style={{ gap: "10px" }}>

                                        <h5 className='m-0'>{convertGMTOffsetToLocalString(data.GMT)}</h5>
                                        <p className='m-0'>
                                            - Local
                                        </p >
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='m-2 '>
                            <div className='d-flex '>
                                <Button className='btn-sm btn-primary'>Chat</Button>
                                <Button className='btn-sm btn-success'>See Schedule</Button>
                            </div>
                        </div>
                    </div>
                    <div className='d-flex mt-4' style={{ gap: "20px" }}>
                        <div className='col-4'>
                            <div className='bg-white rounded p-4 d-flex flex-column' style={{ gap: "15px" }}>

                                <div className='d-flex align-items-center' style={{ gap: "10px" }}>
                                    <IoTime size={32} />
                                    <h5 className='m-0'>{data.ResponseHrs}</h5>
                                </div>
                                <div className='d-flex flex-column align-items-start' style={{ gap: "10px" }}>

                                    <h5 className='m-0'>Languages</h5>
                                    <div className='d-flex align-items-center' style={{ gap: "10px" }}>

                                        <h6 className='text-start m-0'> English</h6> - Native
                                    </div>
                                    <div className='d-flex align-items-center' style={{ gap: "10px" }}>

                                        <h6 className='text-start m-0'> Urdu</h6> - Fluent
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='w-75'>
                            <div className='bg-white p-4 rounded'>
                                <div>

                                    <h5 className=''>
                                        Introduction
                                    </h5>
                                    <p className='border p-2'>
                                        {data.Introduction}
                                    </p>
                                </div>
                                <div>

                                    <h5 className=''>
                                        Motivate
                                    </h5>
                                    <p className='border p-2'>
                                        {data.Motivate}
                                    </p>
                                </div>
                                <div>

                                    <h5 className=''>
                                        Grades I Teach
                                    </h5>
                                    <p className='border p-2'>
                                        {JSON.parse(data.Grades).map(grade =>
                                            <div className='d-flex align-items-center' style={{ gap: "10px" }}>
                                                <h6 className='text-start m-0'> {grade}</h6> - primary
                                            </div>
                                        )}
                                    </p>
                                </div>
                                <div>

                                    <h5 className=''>
                                        Work Experience
                                    </h5>
                                    <div className='border p-2' dangerouslySetInnerHTML={{ __html: data.WorkExperience }} />
                                </div>
                                <div>

                                    <h5 className=''>
                                        Education
                                    </h5>
                                    <div className='border p-2'>
                                        <ul class="nav nav-tabs">
                                            <li class="nav-item">
                                                <p class={`nav-link ${activeTab === 'bach' ? "active" : ""}`}
                                                    aria-current="page"
                                                    onClick={() => setActiveTab('bach')}
                                                >Baclors</p>
                                                <p class={`nav-link ${activeTab === 'mast' ? "active" : ""}`}
                                                    aria-current="page"
                                                    onClick={() => setActiveTab('mast')}
                                                >Master</p>
                                                <p class={`nav-link ${activeTab === 'doc' ? "active" : ""}`}
                                                    aria-current="page"
                                                    onClick={() => setActiveTab('doc')}
                                                >Doctorate</p>
                                                <p class={`nav-link ${activeTab === 'cert' ? "active" : ""}`}
                                                    aria-current="page"
                                                    onClick={() => setActiveTab('cert')}
                                                >Ceritficate</p>
                                                <p class={`nav-link ${activeTab === 'deg' ? "active" : ""}`}
                                                    aria-current="page"
                                                    onClick={() => setActiveTab('deg')}
                                                >Degree</p>

                                            </li>
                                        </ul>
                                        <div className='border border-l border-r border-b px-2'>

                                            {activeTab === 'bach' &&
                                                <div>Bachlors  &&infor hre</div>
                                            }
                                            {activeTab === 'mast' &&
                                                <div>MAsters  &&infor hre</div>
                                            }
                                            {activeTab === 'doc' &&
                                                <div>Doctorate  &&infor hre</div>
                                            }
                                            {activeTab === 'cert' &&
                                                <div>Cerificate  &&infor hre</div>
                                            }
                                            {activeTab === 'deg' &&
                                                <div>Degree  &&infor hre</div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div >
    );
}

export default TutorProfile;