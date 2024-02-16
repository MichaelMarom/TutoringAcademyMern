import React, { useEffect, useState } from 'react';
import AmountCalc from './AmountCalc';
import AccountingTable from './AccountingTable';
import BankDetails from './BankDetails';
import { get_bank_details, get_payment_report, post_bank_details } from '../../../axios/student';
import Actions from '../../common/Actions';
import { toast } from 'react-toastify';
import Loading from '../../common/Loading';
import { convertToDate } from '../../common/Calendar/Calendar';
import Tabs from '../../common/Tabs';
import Lessons from './Lessons';

const StudentAccounting = () => {
    const AcademyId = localStorage.getItem('student_user_id')

   
   

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [paymentReportData, setPaymentReportData] = useState([]);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    let [activeTab, setActiveTab] = useState(null);

    useEffect(() => {
        setActiveTab(<BankDetails />)
    }, [])

    const tabs = [
        {
            label: 'Payment Type', component: <BankDetails />
        },
        { label: 'Accounting', component: <AccountingTable paymentReportData={paymentReportData} startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} /> },
        { label: 'Lessons Records', component: <Lessons paymentReportData={paymentReportData} /> },
    ];

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

    return (
        <>
            <Tabs
                links={tabs}
                activeTab={activeTab}
                activeTabIndex={activeTabIndex}
                setActiveTab={setActiveTab}
                setActiveTabIndex={setActiveTabIndex}
            />

            {
                activeTab
            }
            {/* <div className='mt-4 container'>
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
                        paymentReportData={paymentReportData}
                        startDate={startDate}
                        endDate={endDate}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                    />
                </div>
            </div> */}
        </>
    );
};

export default StudentAccounting;
