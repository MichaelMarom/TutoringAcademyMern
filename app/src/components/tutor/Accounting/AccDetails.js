import { useEffect, useState } from "react";
import { IoChevronBackCircle, IoChevronForwardCircle } from "react-icons/io5";
import { wholeDateFormat } from "../../../constants/constants";
import { showDate } from "../../../helperFunctions/timeHelperFunctions";
import Button from "../../common/Button";
import { moment } from '../../../config/moment'
import { convertToDate } from "../../common/Calendar/Calendar";
import ReactDatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';

const AccDetails = ({ sessions }) => {
    const today = moment();
    const lastFriday = today.day(-2)
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(lastFriday.toDate());
    const [selectedWeekSession, setSelectedWeekSession] = useState([]);
    const [start, setStart] = useState(moment(endDate).toDate())

    const [end, setEnd] = useState(moment(endDate).toDate())

    useEffect(() => {
        const initialStartDate = lastFriday.toDate()
        initialStartDate.setDate(initialStartDate.getDate() - 14);
        setStartDate(initialStartDate);
    }, []);

    console.log(moment.tz(sessions[0]?.start, moment.tz.guess()).format('z'), 'timeZOne')
    console.log(selectedWeekSession)

    useEffect(() => {
        const filteredSession = sessions.filter(session => {
            const sessionDate = moment(session.end);
            const sessionDateWithoutTime = sessionDate.startOf('day'); // Keep only the date part

            const startDateWithoutTime = moment(startDate).startOf('day');
            const endDateWithoutTime = moment(endDate).startOf('day');

            return (
                sessionDateWithoutTime.isSameOrAfter(startDateWithoutTime) &&
                sessionDateWithoutTime.isSameOrBefore(endDateWithoutTime)
            );
        });
        console.log(start, startDate);
        setStart(startDate ? moment(startDate).toDate() : moment().toDate());
        setSelectedWeekSession(filteredSession);

    }, [endDate, startDate])

    const handleBack = () => {
        const newEndDate = moment(startDate).subtract(1, 'days').toDate();
        const newStartDate = moment(newEndDate).subtract(14, 'days').toDate();
        setStart(newStartDate);
        setEnd(newEndDate)
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    };

    const handleNext = () => {
        const newStartDate = moment(endDate).add(1, 'days').toDate();
        const newEndDate = moment(newStartDate).add(14, 'days').toDate();
        setStartDate(newStartDate);
        setEnd(newEndDate)
        setStart(newStartDate);

        setEndDate(newEndDate);
    };

    const totalAmount = selectedWeekSession
        .filter((row) => {
            if (!start || !end) return true;
            return convertToDate(row.start) >= new Date(start) &&
                convertToDate(row.start) <= new Date(end);
        })
        .reduce((total, row) => total + parseFloat(row.rate.split('$')[1]), 0)
        .toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const isNextDisabled = endDate.getDate() >= (moment().day(-2).toDate()).getDate() &&
        endDate.getMonth() >= (moment().day(-2).toDate()).getMonth() &&
        endDate.getFullYear() >= (moment().day(-2).toDate()).getFullYear();

    const formatUTC = (dateInt, addOffset = false) => {
        let date = (!dateInt || dateInt.length < 1) ? new Date : new Date(dateInt);
        if (typeof dateInt === "string") {
            return date;
        } else {
            const offset = addOffset ? date.getTimezoneOffset() : -(date.getTimezoneOffset());
            const offsetDate = new Date();
            offsetDate.setTime(date.getTime() + offset * 60000)
            return offsetDate;
        }
    }

    return (
        <div className="d-flex flex-column w-100 mt-4 container">
            <div className="d-flex justify-content-end">
                <div className="d-flex w-50 align-items-center" style={{ gap: "10px" }}>
                    <h6 className="text-start m-0">
                        Bi-Weekly Account Details</h6>
                    <IoChevronBackCircle
                        style={{ cursoe: "pointer" }}
                        size={32} color="green" onClick={handleBack} />
                    <div className="rounded-pill border p-2">
                        from &nbsp;
                        <span className="text-success">{showDate(startDate)}</span> &nbsp;
                        to  &nbsp;
                        <span className="text-success">{showDate(endDate)}</span>
                    </div>
                    <IoChevronForwardCircle
                        size={32}
                        color={isNextDisabled ? "gray" : "green"}
                        onClick={() => !isNextDisabled && handleNext()}
                        style={{ cursoe: "pointer" }}
                    />

                </div>
            </div>
            <div className="mt-4" style={{ height: "70vh", overflowY: "auto" }}>
                {selectedWeekSession.length ? <table>
                    <thead>
                        <th>Sr.</th>
                        <th>Subject</th>
                        <th>Student Name</th>
                        <th>Date/Time</th>
                        <th>Rate</th>
                        <th>Disc. Subs</th>
                        <th>Disc. Multi</th>
                        <th>% Com'</th>
                        <th>$ Net</th>
                        <th>Invoice #</th>

                        <th>Lesson Video</th>
                        <th>Chat</th>
                    </thead>
                    <tbody>
                        {selectedWeekSession.map((session) =>
                            <tr>
                                <td>{session.sr}</td>
                                <td>{session.subject}</td>
                                <td>{session.studentName}</td>
                                <td className="col-2">{showDate(session.start, wholeDateFormat)}</td>
                                <td>{session.rate}</td>
                                <td>-</td>
                                <td>-</td>
                                <td>{session.sr <= 20 ? '20%' : '15%'}</td>
                                <td>$ Net</td>
                                <td>{session.invoiceNum}</td>
                                <td><Button className="btn-sm btn-primary"> View Video</Button></td>
                                <td><Button className="btn-sm btn-success"> Chat with Student</Button></td>
                            </tr>
                        )}
                    </tbody>
                </table> :
                    <div className="text-danger">No records found for that bi-week</div>
                }
            </div>
            <div className="d-flex justify-content-end mt-4">

                <div className="d-flex w-75 justify-content-end align-items-center" style={{ gap: "10px" }}>
                    <h6 className="text-start m-0">Total Earning between </h6>
                    <ReactDatePicker
                        selected={formatUTC(start, true)}
                        onChange={date => setStart(formatUTC(date))}
                        dateFormat="MMM d, yyyy"
                        className="form-control m-2 w-80"
                    />

                    <h6 className="m-0">and</h6>
                    <ReactDatePicker
                        selected={formatUTC(end, true)}
                        onChange={date => setEnd(formatUTC(date))}
                        dateFormat="MMM d, yyyy"
                        className="form-control m-2 w-80"
                    />

                    <h6 className="text-start m-0 rounded border p-2">{totalAmount}</h6>
                </div>
            </div>
        </div>
    );
}

export default AccDetails;