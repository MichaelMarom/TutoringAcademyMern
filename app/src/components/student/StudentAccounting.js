import React, { useEffect, useState } from 'react';
import AmountCalc from './Accounting/AmountCalc';
import AccountingTable from './Accounting/AccountingTable';
import BankDetails from './Accounting/BankDetails';
import { get_bank_details, get_payment_report, post_bank_details } from '../../axios/student';
import Actions from '../common/Actions';
import { toast } from 'react-toastify';
import Loading from '../common/Loading';
import { convertToDate } from '../common/Calendar/Calendar';

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

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [paymentReportData, setPaymentReportData] = useState([]);

    const transformIntoPaymentReport = (item) => {
        const bookedSlots = JSON.parse(item.bookedSlots);
        const reservedSlots = JSON.parse(item.reservedSlots);
        console.log(bookedSlots, reservedSlots, item, 'slostF');

        const combinedPaymentData = reservedSlots.concat(bookedSlots);
        const final = combinedPaymentData.filter(data => data.type != 'reserved')
        return final
    };

    useEffect(() => {
        const fetchPaymentReport = async () => {
            const studentId = localStorage.getItem('student_user_id')
            const data = await get_payment_report(studentId);
            console.log(data)
            const uniqueData = data.reduce((unique, item) => {
                if (unique?.some(detail => detail.tutorId === item.tutorId)) {
                    return unique
                }
                else {
                    return [...unique, item]
                }
            }, [])
            console.log(uniqueData, 'des')

            const transformedData = uniqueData.map(item => transformIntoPaymentReport(item)).flat().filter(slot => slot.studentId === studentId);
            setPaymentReportData([...paymentReportData, ...transformedData]);
        };

        fetchPaymentReport();
    }, []);

    const totalAmount = paymentReportData
        .filter((row) => {
            if (!startDate || !endDate) return true;
            console.log(row)
            return convertToDate(row.start) >= new Date(startDate) && convertToDate(row.start) <= new Date(endDate);
        })
        .reduce((total, row) => total + parseFloat(row.rate.split('$')[1]), 0);

    if (loading)
        return <Loading />
    return (
        <>
            <div className='mt-4 container'>
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
            <hr />

            <div className="container">
                <div className="row">
                    <AccountingTable tableData={paymentReportData} />
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
