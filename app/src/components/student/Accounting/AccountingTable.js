import React, { useEffect } from 'react'
import { showDate } from '../../../helperFunctions/timeHelperFunctions'
import { wholeDateFormat } from '../../../constants/constants'
import { get_payment_report } from '../../../axios/student'

const AccountingTable = ({ tableData }) => {

    const studentId = localStorage.getItem('student_user_id');

    console.log(studentId);
    useEffect(() => {
        const fetchPaymentReport = async () => {
            const data = await get_payment_report(studentId);
            console.log(data, 'deded');
        }
        fetchPaymentReport()
    }, [])
    
    return (
        <div className="col-md-6" style={{
            overflowY: 'auto',
            height: '60vh'
        }}>
            <h2>Payment Report</h2>
            <table className="table">
                <thead className="thead-dark" style={{
                    background: "black"
                }}>
                    <tr>
                        <th className='text-white bg-dark'>Date</th>
                        <th className='text-white bg-dark'>Tutor</th>
                        <th className='text-white bg-dark'>Subject</th>
                        <th className='text-white bg-dark'>Rate</th>
                        <th className='text-white bg-dark'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, index) => (
                        <tr key={index}>
                            <td>{showDate(row.date, wholeDateFormat)}</td>
                            <td>{row.tutor}</td>
                            <td>{row.subject}</td>
                            <td>${row.rate}</td>
                            <td>
                                <button className="btn btn-primary">Details</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default AccountingTable
