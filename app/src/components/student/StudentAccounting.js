import React, { useState } from 'react';
import AmountCalc from './Accounting/AmountCalc';
import AccountingTable from './Accounting/AccountingTable';

const StudentAccounting = () => {
    // Generate 10 dummy records with date and time
    const generateDummyRecords = () => {
        const records = [];
        const today = new Date();

        for (let i = 0; i < 10; i++) {
            const recordDate = new Date(today);
            recordDate.setDate(today.getDate() - i);
            records.push({
                date: recordDate,
                tutor: `Tutor ${i}`,
                subject: `Subject ${i}`,
                rate: 50 + i * 5, // Vary the rate
            });
        }

        return records;
    };

    const tableData = generateDummyRecords();

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Calculate the total amount paid during the selected interval
    const totalAmount = tableData
        .filter((row) => {
            if (!startDate || !endDate) return true;
            console.log(row)
            return row.date >= new Date(startDate) && row.date <= new Date(endDate);
        })
        .reduce((total, row) => total + row.rate, 0);

    return (
        <>
            <div className="form-accounting mt-4">
                <div style={{ margin: 'auto' }} className="form-acct-pay-option">
                    <h6>Set up your payment</h6>
                    <input
                        style={{ cursor: 'pointer', fontSize: 'x-small' }}
                        type="radio"
                        value="Paypal"
                        name="p-method"
                        id=""
                    />{' '}
                    Paypal &nbsp; &nbsp; &nbsp;
                    <input
                        style={{ cursor: 'pointer', fontSize: 'x-small' }}
                        type="radio"
                        value="Zale"
                        name="p-method"
                        id=""
                    />{' '}
                    Direct Deposit (ACH) &nbsp; &nbsp; &nbsp;
                    <input
                        style={{ cursor: 'pointer', fontSize: 'x-small' }}
                        type="radio"
                        value="Bank"
                        name="p-method"
                        id=""
                    />{' '}
                    Credit/Debit (3% transaction fee) &nbsp; &nbsp; &nbsp;
                    <br />
                    <br />
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <AccountingTable tableData={tableData} />
                    <AmountCalc
                        totalAmount={totalAmount}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                    />
                </div>
            </div>
        </>
    );
};

export default StudentAccounting;
