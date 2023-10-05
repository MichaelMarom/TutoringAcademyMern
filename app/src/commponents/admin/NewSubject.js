import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { conevrtGMTOffsetToLocalString, convertGMTOffsetToLocalString } from '../../helperFuncations/timeHelperFuncations';
import { get_tutor_new_subject, post_new_subject } from '../../axios/admin';


const TutorTable = () => {

    let [data, setData] = useState([])
    let [emptyData , set_emptyData] = useState([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]);


    const COLUMNS = [
        {
            Header: 'Tutor Name',
            accessor: 'Tutor Name',
        },
        {
            Header: 'Subject',
            accessor: 'Subject',
        },
        {
            Header: 'Faculty',
            accessor: 'Faculty',
        },
        {
            Header: 'Notes',
            accessor: 'Notes',
        },
        
        {
            Header: 'Check Box',
            accessor: 'Check Box'
        }
        
    ];

   
    let navigate = useNavigate();

   
    useEffect(() => {
        get_tutor_new_subject()
        .then((result) => {
            setData(result)
            console.log(Object.values(result[0])[0])

        })
        .catch((err) => console.log(err))
    }, [])
    

    let acceptNewSubject = ( ) => {
        post_new_subject()
        .then(() => {
            
        })
        .catch((err) => console.log(err))

    }

    let declineNewSubject = ( ) => {
        post_new_subject()
        .then(() => {
            
        })
        .catch((err) => console.log(err))

    }

    return (  
        <> 
           
            <div className="tables" style={{height: '100%', width: '100%', overflow: 'auto', padding: '5px'}}>

            <table style={{position: 'relative'}}>
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
                            
                            <tr key={item.SID} >
                               
                                <td data-src={''}>{item.tutor}</td>
                                <td data-src={''}>{Object.values(item)[0].subject}</td>
                                <td data-src={''}>{Object.values(item)[0].faculty}</td>
                                <td data-src={''}>{Object.values(item)[0].reason}</td>
                                <td data-src=''>
                                    <>
                                    <button onClick={acceptNewSubject} style={{background: 'green', color: '#fff', borderRadius: '2px', padding: '10px'}}>Accept</button>
                                    <button onClick={declineNewSubject} style={{background: 'red', color: '#fff', borderRadius: '2px', padding: '10px'}}>Decline</button>
                                    </>
                                </td>
                                
                            </tr>
                        )
                        :
                        
                        emptyData.map((item) => 
                            <tr >
                               
                                <td ><Skeleton count={1} /></td>
                                <td ><Skeleton count={1} /></td>
                                <td ><Skeleton count={1} /></td>
                                <td ><Skeleton count={1} /></td>
                                <td ><Skeleton count={1} /></td>
                               
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