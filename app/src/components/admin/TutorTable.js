import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { get_tutor_data, set_tutor_status } from '../../axios/admin';
import { COLUMNS } from '../../Tables/Admin/column';
import moment from 'moment'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { conevrtGMTOffsetToLocalString, convertGMTOffsetToLocalString } from '../../helperFunctions/timeHelperFunctions';


const TutorTable = () => {

    let [data, set_data] = useState([]);
    let [emptyData, set_emptyData] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    let navigate = useNavigate();

    useEffect(() => {
        get_tutor_data()
            .then((result) => {
                console.log(result, 'result from tutorTable')
                set_data(result)
            })
            .catch((err) => {
                console.log(err)
            })

    }, [])

    let set_status = async (e, Id, Status) => {
        e.preventDefault();
        let response = await set_tutor_status(Id, Status)


        if (response.bool) {
            alert(response.mssg)
            get_tutor_data()
                .then((result) => {
                    console.log(result)
                    set_data(result)
                })
                .catch((err) => {
                    console.log(err)
                })
        } else {

            alert(response.mssg)

        }
    }

    let redirect_to_tutor_setup = (tutor_user_id, screenName) => {
        console.log(tutor_user_id)
        window.localStorage.setItem('tutor_user_id', tutor_user_id);
        window.localStorage.setItem('tutor_screen_name', screenName)
        window.localStorage.setItem('user_role', 'admin');
        navigate('/tutor/setup')
    }

    return (
        <>
            <div className="tables" style={{ height: '100%', width: '100%', overflow: 'auto', padding: '5px' }}>

                <table style={{ position: 'relative' }}>
                    <thead >
                        <tr>
                            {COLUMNS.map(item => <th key={item.Header}>{item.Header}</th>)}
                        </tr>
                    </thead>
                    <tbody>

                        {
                            data.length > 0
                                ?

                                data.map((item) =>

                                    <tr key={item.SID}
                                        onDoubleClick={() =>
                                            redirect_to_tutor_setup(item.AcademyId, item.TutorScreenname)
                                        }>
                                        <td data-src={null}>
                                            <div className="dropdown">
                                                <button style={{ background: '#f6f6f6', border: 'none', outline: 'none', color: '#000' }} className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1 status-btn" data-bs-toggle="dropdown" aria-expanded="false">
                                                    {item.Status}
                                                </button>
                                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                    <li style={{ width: '100%' }}><a data-status='pending' onClick={e => set_status(e, item.AcademyId, e.target.innerHTML)} style={{ width: '100%' }} className="dropdown-item" href="#">Pending</a></li>
                                                    <li style={{ width: '100%' }}><a data-status='active' onClick={e => set_status(e, item.AcademyId, e.target.innerHTML)} style={{ width: '100%' }} className="dropdown-item" href="#">Active</a></li>
                                                    <li style={{ width: '100%' }}><a data-status='suspended' onClick={e => set_status(e, item.AcademyId, e.target.innerHTML)} style={{ width: '100%' }} className="dropdown-item" href="#">Suspended</a></li>
                                                </ul>
                                            </div>
                                        </td>

                                        <td data-src={null}>
                                            <img src={item.Photo} style={{ height: '80px', width: '100px' }} />
                                        </td>
                                        <td data-src={item.TutorScreenname}>{item.TutorScreenname}</td>
                                        <td data-src={item.FirstName + ' ' + item.LastName}>{item.FirstName + ' ' + item.LastName}</td>
                                        <td data-src={item.Email}>{item.Email}</td>
                                        <td data-src={item.CellPhone}>{item.CellPhone}</td>
                                        <td data-src={item.GMT}>{convertGMTOffsetToLocalString(item.GMT)}</td>
                                        <td data-src={item.ResponseHrs}>{item.ResponseHrs}</td>
                                        <td data-src={null}>{null}</td>
                                        <td data-src={null}>{null}</td>
                                        <td data-src={item.IdVerified}>{item.IdVerified}</td>
                                        <td data-src={item.BackgroundVerified}>{item.BackgroundVerified}</td>

                                    </tr>
                                )
                                :

                                emptyData.map((item) =>
                                    <tr >
                                        <td data-src={null}>
                                            <div className="dropdown">
                                                <button style={{ background: '#f6f6f6', border: 'none', outline: 'none', color: '#000' }} className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1 status-btn" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <Skeleton count={1} />
                                                </button>
                                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                    <li style={{ width: '100%' }}><a data-status='pending' style={{ width: '100%' }} className="dropdown-item" href="#">Pending</a></li>
                                                    <li style={{ width: '100%' }}><a data-status='active' style={{ width: '100%' }} className="dropdown-item" href="#">Active</a></li>
                                                    <li style={{ width: '100%' }}><a data-status='suspended' style={{ width: '100%' }} className="dropdown-item" href="#">Suspended</a></li>
                                                </ul>
                                            </div>
                                        </td>

                                        <td data-src={null}>
                                            <Skeleton count={1} />
                                        </td>
                                        <td ><Skeleton count={1} /></td>
                                        <td ><Skeleton count={1} /></td>
                                        <td ><Skeleton count={1} /></td>
                                        <td ><Skeleton count={1} /></td>
                                        <td ><Skeleton count={1} /></td>
                                        <td ><Skeleton count={1} /></td>
                                        <td ><Skeleton count={1} /></td>
                                        <td ><Skeleton count={1} /></td>
                                        <td ><Skeleton count={1} /></td>
                                        <td ><Skeleton count={1} /></td>
                                        <td >{
                                            <Skeleton count={1} />
                                        }</td>
                                    </tr>
                                )
                        }



                    </tbody>
                </table>

            </div>
        </>
    );
}

export default TutorTable;