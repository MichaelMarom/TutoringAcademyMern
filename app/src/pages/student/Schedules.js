import React from 'react'
import StudentLayout from '../../layouts/StudentLayout';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useSelector } from 'react-redux';
const localizer = momentLocalizer(moment);
export const Schedules = () => {
    const { reservedSlots, bookedSlots } = useSelector(state => state.bookings)

    const studentTimeZone = 'GMT+5';
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
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: "100%" }}
                />
            </div>
        </StudentLayout>
    )
}
