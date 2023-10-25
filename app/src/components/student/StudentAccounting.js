import React, { useEffect, useState } from 'react';
import AmountCalc from './Accounting/AmountCalc';
import AccountingTable from './Accounting/AccountingTable';
import BankDetails from './Accounting/BankDetails';
import { get_bank_details, post_bank_details } from '../../axios/student';
import { Actions } from './Actions';
import { toast } from 'react-toastify';
import Loading from '../common/Loading';

const StudentAccounting = () => {
    let date = new Date()
    const [loading, setLoading] = useState(false);
    let [StudentStartDay, set_start_day] = useState(date)
    let [AccountName, set_acct_name] = useState(null)
    let [PaymentType, set_acct_type] = useState(null)
    let [BankName, set_bank_name] = useState(null)
    let [AccountNumber, set_acct] = useState(null)
    let [RoutingNumber, set_routing] = useState(null)
    let [SSH, set_ssh] = useState(null)
    let [AccumulatedHrs, set_accumulated_hrs] = useState(null)
    let [PaymentOption, set_payment_option] = useState(null)
    const AcademyId = localStorage.getItem('student_user_id')
    
    const onSave = async () => {

        if (!StudentStartDay ||
            !PaymentOption ||
            !PaymentType ||
            !AccountName ||
            !BankName ||
            !AccountNumber ||
            !RoutingNumber ||
            !SSH ||
            !PaymentType) {
            toast.warning('All Fields Should be filled')
            return
        }
        setLoading(true)
        const data = await post_bank_details({
            StudentStartDay,
            PaymentOption,
            PaymentType,
            AccountName,
            BankName,
            AccountNumber,
            RoutingNumber,
            SSH,
            AcademyId,
            AccumulatedHrs
        })
        if (data?.response?.status === 400)
            toast.error('Error Saving eeh data')
        else {

            toast.success('Data saved succesfully')

        }
        setLoading(false)
        console.log('hit save, data', data)
    }

    useEffect(() => {
        const fetchBankDetails = async () => {
            const data = await get_bank_details(AcademyId)
            if (data.length) {
                const result = data[0]
                set_start_day(result.StudentStartDay);
                set_acct_name(result.AccountName);
                set_acct_type(result.PaymentType);
                set_bank_name(result.BankName);
                set_acct(result.AccountNumber);
                set_routing(result.RoutingNumber);
                set_ssh(result.SSH);
                set_accumulated_hrs(result.AccumulatedHrs);
                set_payment_option(result.PaymentOption);
            }
        }
        fetchBankDetails()
    }, [])

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
                rate: 50 + i * 5,
            });
        }
        return records;
    };

    const tableData = generateDummyRecords();

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const totalAmount = tableData
        .filter((row) => {
            if (!startDate || !endDate) return true;
            console.log(row)
            return row.date >= new Date(startDate) && row.date <= new Date(endDate);
        })
        .reduce((total, row) => total + row.rate, 0);

    if (loading)
        return <Loading />
    return (
        <>
            <div className='mt-4'>
                <BankDetails
                    StudentStartDay={StudentStartDay}
                    set_start_day={set_start_day}
                    AccountName={AccountName}
                    set_acct_name={set_acct_name}
                    PaymentType={PaymentType}
                    set_acct_type={set_acct_type}
                    BankName={BankName}
                    set_bank_name={set_bank_name}
                    AccountNumber={AccountNumber}
                    set_acct={set_acct}
                    RoutingNumber={RoutingNumber}
                    set_routing={set_routing}
                    SSH={SSH}
                    set_ssh={set_ssh}
                    AccumulatedHrs={AccumulatedHrs}
                    set_accumulated_hrs={set_accumulated_hrs}
                    PaymentOption={PaymentOption}
                    set_payment_option={set_payment_option}
                />
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
            <Actions onSave={onSave} />
        </>
    );
};

export default StudentAccounting;
