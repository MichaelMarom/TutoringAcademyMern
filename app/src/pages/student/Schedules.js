import React, { useEffect, useState } from 'react';
import StudentLayout from '../../layouts/StudentLayout';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';  // Use moment-timezone instead of moment
import { get_student_events } from '../../axios/student';
import CustomEvent from '../../components/common/Calendar/Event';

const localizer = momentLocalizer(moment);

export const Schedules = () => {
    const studentId = localStorage.getItem("student_user_id");
    const [reservedSlots, setReservedSlots] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);

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
    }, [])

    const studentTimeZone = 'GMT+5';
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
    return (
        <StudentLayout showLegacyFooter={false}>
            <h4 className='text-center m-3'>Your Schedule</h4>
            <div className='m-3' style={{ height: "80vh" }}>
                <Calendar
                    localizer={localizer}
                    events={(reservedSlots.concat(bookedSlots)).map((event) => ({
                        ...event,
                        start: moment.tz(event.start, studentTimeZone).toDate(),
                        end: moment.tz(event.end, studentTimeZone).toDate(),
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
