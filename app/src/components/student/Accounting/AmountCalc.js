import React from 'react'

const AmountCalc = ({ totalAmount, setStartDate, setEndDate }) => {
    return (
        <div className="col-md-4">
            <h2>Filter by Date and Time</h2>
            <div className="form-group">
                <label htmlFor="startDate">Start Date and Time</label>
                <input
                    type="datetime-local"
                    className="form-control"
                    id="startDate"
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="endDate">End Date and Time</label>
                <input
                    type="datetime-local"
                    className="form-control"
                    id="endDate"
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>
            <div className="alert alert-info">
                Total Amount Paid: ${totalAmount}
            </div>
        </div>
    )
}

export default AmountCalc
