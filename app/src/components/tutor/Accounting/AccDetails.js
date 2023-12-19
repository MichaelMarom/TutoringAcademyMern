import { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { IoChevronBackCircle, IoChevronForwardCircle } from "react-icons/io5";
import { wholeDateFormat } from "../../../constants/constants";
import { showDate } from "../../../helperFunctions/timeHelperFunctions";
import Button from "../../common/Button";
import moment from 'moment'
import AmountCalc from "../../student/Accounting/AmountCalc";
import { convertToDate } from "../../common/Calendar/Calendar";

const AccDetails = ({ sessions }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(new Date());
    const [selectedWeekSession, setSelectedWeekSession] = useState([]);
    const [start, setStart] = useState(startDate)

    const [end, setEnd] = useState(endDate)


    useEffect(() => {
        const initialStartDate = new Date();
        initialStartDate.setDate(initialStartDate.getDate() - 14);
        setStartDate(initialStartDate);
    }, []);

    useEffect(() => {
        const filteredSession = sessions.filter(session => {
            const sessionDate = moment(session.end);
            return sessionDate.isSameOrAfter(startDate) && sessionDate.isSameOrBefore(endDate);
        });
        setStart(startDate)
        setSelectedWeekSession(filteredSession)
    }, [endDate, startDate])

    const handleBack = () => {
        const newEndDate = moment(startDate).subtract(1, 'days').toDate();
        const newStartDate = moment(newEndDate).subtract(14, 'days').toDate();
        setStart(newStartDate);
        setStartDate(newStartDate);
        setEndDate(newEndDate);
    };

    const handleNext = () => {
        const newStartDate = moment(endDate).add(1, 'days').toDate();
        const newEndDate = moment(newStartDate).add(14, 'days').toDate();

        setEndDate(newEndDate);
    };
    console.log(start)

    const totalAmount = selectedWeekSession
        .filter((row) => {
            if (!start || !end) return true;
            return convertToDate(row.start) >= new Date(start) &&
                convertToDate(row.start) <= new Date(end);
        })
        .reduce((total, row) => total + parseFloat(row.rate.split('$')[1]), 0);

    const isNextDisabled = endDate.getDate() >= (new Date()).getDate() &&
        endDate.getMonth() >= (new Date()).getMonth() &&
        endDate.getFullYear() >= (new Date()).getFullYear()
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
                        <span className="text-success">{isNextDisabled ? 'Today' : showDate(endDate)}</span>
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
                        <th>Subject</th>
                        <th>Student Name</th>
                        <th>Date/Time</th>
                        <th>Rate</th>
                        <th>Disc. Subj</th>
                        <th>Disc. Multi</th>
                        <th>% Commission</th>
                        <th>$ Net</th>
                        <th>Invoice #</th>

                        <th>Lesson Video</th>
                        <th>Chat</th>
                    </thead>
                    <tbody>
                        {selectedWeekSession.map(session =>
                            <tr>
                                <td>{session.subject}</td>
                                <td>{session.studentName}</td>
                                <td>{showDate(session.start, wholeDateFormat)}</td>
                                <td>{session.rate}</td>
                                <td>-</td>
                                <td>-</td>
                                <td>% Commission</td>
                                <td>$ Net</td>
                                <td>Invoice #</td>
                                <td><Button className="btn-sm btn-primary"> View Lesson Video</Button></td>
                                <td><Button className="btn-sm btn-success"> Chat with Student</Button></td>
                            </tr>
                        )}
                    </tbody>
                </table> :
                    <div className="text-danger">No record found for that bi-week</div>
                }
            </div>
            <div className="d-flex justify-content-end mt-4">

                <div className="d-flex w-75 justify-content-end align-items-center" style={{ gap: "10px" }}>
                    <h6 className="text-start m-0">Total Earning between </h6>
                    <input
                        type={"date"}
                        value={start ? (start).toISOString().split('T')[0] : null}
                        onClick={(e) => setStart(e.target.value)}
                        className="m-0 w-25 form-control"
                    />
                    <h6>and</h6>
                    <input
                        type={"date"}
                        className="m-0 w-25 form-control"
                        value={endDate.toISOString().split('T')[0]}
                        onClick={(e) => setEnd(e.target.value)}
                    />

                    <h6 className="text-start m-0 rounded border p-2">{totalAmount}</h6>
                </div>
            </div>
        </div>
    );
}

export default AccDetails;