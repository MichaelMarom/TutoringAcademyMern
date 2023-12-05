import React, { useEffect, useState } from 'react';
import StudentLayout from '../../layouts/StudentLayout';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment-timezone';
import { get_student_events } from '../../axios/student';
import CustomEvent from '../../components/common/Calendar/Event';
import { convertToDate } from '../../components/common/Calendar/Calendar';
import { useSelector } from 'react-redux';


export const Schedules = () => {
    const studentId = localStorage.getItem("student_user_id");
    const [reservedSlots, setReservedSlots] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [timeZone, setTimeZone] = useState('America/New_York');
    const { student } = useSelector(state => state.student)

    useEffect(() => {
        moment.tz.setDefault(timeZone);
    }, [timeZone]);

    useEffect(() => {
        if (student.GMT) {
            const offset = parseInt(student.GMT, 10);
            const timezone = moment.tz.names().filter(name => (moment.tz(name).utcOffset()) === offset * 60);
            setTimeZone(timezone[0] || null);
        }
    }, [student])

    useEffect(() => {
        const fetchEvents = async () => {
            const data = await get_student_events(studentId);
            const reservedSlotsArray = data.map(item => JSON.parse(item.reservedSlots)).flat();
            const bookedSlotsArray = data.map(item => JSON.parse(item.bookedSlots)).flat();
            console.log(reservedSlotsArray, bookedSlotsArray)
            setReservedSlots(reservedSlotsArray);
            setBookedSlots(bookedSlotsArray);
        }
        fetchEvents();
    }, [studentId])


    const convertToGmt = (date) => {
        let updatedDate = moment(convertToDate(date)).tz(timeZone).toDate();
        return updatedDate;
    };

    const eventPropGetter = (event) => {
        if (event.type === 'reserved') {
            return {
                className: 'reserved-event',
                style: {
                    border: "none",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    backgroundColor: 'yellow',
                    color: "black"
                },
            };
        } else if (event.type === 'booked') {
            return {
                className: 'booked-event',
                style: {
                    border: "none",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    backgroundColor: 'green',
                },
            };
        }
        return {};
    };

    const localizer = momentLocalizer(moment);
    return (
        <StudentLayout showLegacyFooter={false}>
            <h4 className='text-center m-3'>Your Schedule</h4>
            <div className='m-3' style={{ height: "80vh" }}>
                <Calendar
                    localizer={localizer}
                    events={(reservedSlots.concat(bookedSlots)).map((event) => ({
                        ...event,
                        start: convertToGmt(event.start),
                        end: convertToGmt(event.end),
                    }))}
                    components={{
                        event: event => (
                            <CustomEvent
                                {...event}
                                reservedSlots={reservedSlots}
                                isStudentLoggedIn={true}
                                handleSetReservedSlots={() => { }}
                            />
                        )
                    }}
                    eventPropGetter={eventPropGetter}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: "100%" }}
                />
            </div>
        </StudentLayout>
    );
}
