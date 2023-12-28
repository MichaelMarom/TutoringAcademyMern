import { useEffect, useState } from "react";
import { IoChevronBackCircle, IoChevronForwardCircle } from "react-icons/io5";
import { COMMISSION_DATA, wholeDateFormat } from "../../../constants/constants";
import { showDate } from "../../../helperFunctions/timeHelperFunctions";
import Button from "../../common/Button";
import { moment } from '../../../config/moment'
import { convertToDate } from "../../common/Calendar/Calendar";
import ReactDatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { useSelector } from 'react-redux'
import { get_last_pay_day } from "../../../axios/tutor";
import { Navigate } from "react-big-calendar";
import { useNavigate } from "react-router-dom";
import { create_chat } from "../../../axios/chat";
import { toast } from "react-toastify";
import Loading from "../../common/Loading";

const AccDetails = ({ sessions }) => {
    const today = moment();
    const lastFriday = today.day(-2)
    const navigate = useNavigate()
    const { tutor } = useSelector((state) => state.tutor)
    const [startDate, setStartDate] = useState(null);
    const [selectedWeekSession, setSelectedWeekSession] = useState([]);

    const [lastpayDay, setLastPayDay] = useState(lastFriday);
    const [endDate, setEndDate] = useState(moment(lastpayDay));
    const [start, setStart] = useState(moment(endDate).toDate())
    const [end, setEnd] = useState(moment(endDate).toDate())
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (lastpayDay) {
            console.log(lastpayDay)
            const initialStartDate = moment(lastpayDay).toDate()
            initialStartDate.setDate(initialStartDate.getDate() - 14);
            setStartDate(initialStartDate);
        }
    }, [lastpayDay]);

    useEffect(() => {
        if (lastpayDay) { setEndDate(moment(lastpayDay)) }
    }, [lastpayDay])

    useEffect(() => {
        setLoading(true)
        const fetchPayDay = async () => {
            const data = await get_last_pay_day();
            setLastPayDay(data.Payday)
            setLoading(false)
        }
        fetchPayDay()
    }, [])

    useEffect(() => {
        if (startDate) {
            const filteredSession = sessions.filter(session => {
                const sessionDate = moment(session.end);
                const sessionDateWithoutTime = sessionDate.startOf('day');

                const startDateWithoutTime = moment(startDate).startOf('day');
                const endDateWithoutTime = moment(endDate).startOf('day');

                return (
                    sessionDateWithoutTime.isSameOrAfter(startDateWithoutTime) &&
                    sessionDateWithoutTime.isSameOrBefore(endDateWithoutTime)
                );
            });
            setStart(startDate ? moment(startDate).toDate() : moment().toDate());
            setSelectedWeekSession(filteredSession);
        }

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

    const handleNavigateChat = async (chatId, tutorId, studentId) => {
        if (chatId) return navigate(`/tutor/chat/${chatId}`)
        const data = await create_chat({ User1ID: studentId, User2ID: tutorId })
        if (data[0]?.ChatID) return navigate(`/tutor/chat/${data[0].ChatID}`)
        toast.warning('Student does not exist!')
    }

    const totalAmount = sessions
        .filter((row) => {
            if (!start || !end) return true;
            const originalEndDate = moment(end);
            const nextDayEndDate = originalEndDate.clone().add(1, 'days');
            const startOfNextDate = nextDayEndDate.startOf('day').toDate();

            const startDate = new Date(start);

            return convertToDate(row.start) >= startDate &&
                convertToDate(row.start) <= startOfNextDate;
        })
        .reduce((total, row) => total + row.net, 0)
        .toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const isNextDisabled = (moment(endDate).toDate()).getDate() >= (moment(lastpayDay).toDate()).getDate() &&
        (moment(endDate).toDate()).getMonth() >= (moment(lastpayDay).toDate()).getMonth() &&
        (moment(endDate).toDate()).getFullYear() >= (moment(lastpayDay).toDate()).getFullYear();

    const formatUTC = (dateInt, addOffset = false) => {
        let date = (!dateInt || dateInt.length < 1) ? moment() : moment(dateInt);

        if (tutor.timeZone) {
            date = date.tz(tutor.timeZone).toDate();
        }

        return date;
    }
    if (loading)
        return <Loading />
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
                                <td>{session.comm}%</td>
                                <td>{session.net.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td>{session.invoiceNum}</td>
                                <td><Button className="btn-sm btn-primary"> View Video</Button></td>
                                <td><Button className="btn-sm btn-success" onClick={() => handleNavigateChat(session.chatId, session.tutorId, session.studentId)}> Chat with Student</Button></td>
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