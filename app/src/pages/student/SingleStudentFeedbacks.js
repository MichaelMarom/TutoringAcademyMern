import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import StudentLayout from '../../layouts/StudentLayout';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment-timezone';
import { useSelector } from 'react-redux';
import CustomEvent from '../../components/common/Calendar/Event';


export const SingleTutorFeedbacks = () => {
    console.log('lok');
    const params = useParams();
    const [events, setEvents] = useState([]);
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


    const localizer = momentLocalizer(moment);

    return (
        <StudentLayout showLegacyFooter={false}>
            <h4 className='text-center m-3'>Your Schedul</h4>
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
    )

}
