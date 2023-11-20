import React from 'react'
import { showDate } from '../../../helperFunctions/timeHelperFunctions'
import { wholeDateFormat } from '../../../constants/constants'
import { convertTutorIdToName } from '../../../helperFunctions/generalHelperFunctions'

const AccountingTable = ({ tableData }) => {

    return (
        <div className="col-md-8" style={{
            overflowY: 'auto',
            height: '60vh'
        }}>
            <h2>Payment Report</h2>
            {tableData.length ? <table className="table">
                <thead className="thead-dark" style={{
                    background: "black"
                }}>
                    <tr>
                        <th className='text-white bg-dark col-3'>Date</th>
                        <th className='text-white bg-dark'>Tutor</th>
                        <th className='text-white bg-dark'>Subject</th>
                        <th className='text-white bg-dark'>Rate</th>
                        <th className='text-white bg-dark'>Type</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, index) => (
                        <tr key={index}>
                            <td>{showDate(row.start, wholeDateFormat)}</td>
                            <td>{convertTutorIdToName(row.tutorId)}</td>
                            <td>{row.subject}</td>
                            <td>{row.rate}</td>
                            <td>{row.title}</td>
                        </tr>
                    ))}
                </tbody>
            </table> : <div className='text-danger'>No Record Found</div>}
        </div>
    )
}

export default AccountingTable
