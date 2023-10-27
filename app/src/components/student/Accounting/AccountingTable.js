import React, { useEffect, useState } from 'react'
import { showDate } from '../../../helperFunctions/timeHelperFunctions'
import { wholeDateFormat } from '../../../constants/constants'
import { get_payment_report } from '../../../axios/student'

const AccountingTable = ({ tableData }) => {

    const studentId = localStorage.getItem('student_user_id');
   
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
                        <th className='text-white bg-dark'>Type</th>
                        <th className='text-white bg-dark'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, index) => (
                        <tr key={index}>
                            <td>{showDate(row.start, wholeDateFormat)}</td>
                            <td>{row.tutorId}</td>
                            <td>{row.subject}</td>
                            <td>{row.rate}</td>
                            <td>{row.title}</td>

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
