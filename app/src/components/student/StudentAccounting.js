import { useState } from "react";

const StudentAccounting = () => {
    const tableData = [
        {
            date: '2023-10-01',
            tutor: 'John Doe',
            subject: 'Mathematics',
            rate: 50,
        },
        {
            date: '2023-10-05',
            tutor: 'Jane Smith',
            subject: 'Science',
            rate: 45,
        },
        // Add more rows as needed
    ];

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Calculate the total amount paid during the selected interval
    const totalAmount = tableData
        .filter((row) => {
            if (!startDate || !endDate) return true;
            return row.date >= startDate && row.date <= endDate;
        })
        .reduce((total, row) => total + row.rate, 0);
    return (
        <>
            <div className="form-accounting mt-4">

                <div style={{ margin: 'auto' }} className="form-acct-pay-option">
                    <h6>Set up your payment</h6>


                    <input style={{ cursor: 'pointer', fontSize: 'x-small' }} type="radio" value='Paypal' name='p-method' id="" />  Paypal &nbsp; &nbsp; &nbsp;
                    <input style={{ cursor: 'pointer', fontSize: 'x-small' }} type="radio" value='Zale' name='p-method' id="" />  Direct Deposit (ACH) &nbsp; &nbsp; &nbsp;
                    <input style={{ cursor: 'pointer', fontSize: 'x-small' }} type="radio" value='Bank' name='p-method' id="" />  Credit/Debit (3% transaction fee) &nbsp; &nbsp; &nbsp;

                    <br />
                    <br />



                </div>

            </div>
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <h2>Payment Report</h2>
                        <table className="table">
                            <thead className="thead-light">
                                <tr>
                                    <th>Date</th>
                                    <th>Tutor</th>
                                    <th>Subject</th>
                                    <th>Rate</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.date}</td>
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
                    <div className="col-md-6">
                        <h2>Filter by Date</h2>
                        <div className="form-group">
                            <label htmlFor="startDate">Start Date</label>
                            <select
                                className="form-control"
                                id="startDate"
                                onChange={(e) => setStartDate(e.target.value)}
                            >
                                <option value="">Select Start Date</option>
                                <option value="2023-10-01">2023-10-01</option>
                                <option value="2023-10-03">2023-10-03</option>
                                {/* Add more start date options as needed */}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="endDate">End Date</label>
                            <select
                                className="form-control"
                                id="endDate"
                                onChange={(e) => setEndDate(e.target.value)}
                            >
                                <option value="">Select End Date</option>
                                <option value="2023-10-04">2023-10-04</option>
                                <option value="2023-10-06">2023-10-06</option>
                                {/* Add more end date options as needed */}
                            </select>
                        </div>
                        <div className="alert alert-info">
                            Total Amount Paid: ${totalAmount}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default StudentAccounting;