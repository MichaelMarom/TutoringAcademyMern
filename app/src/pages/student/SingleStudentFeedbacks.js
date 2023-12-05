import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import StudentLayout from '../../layouts/StudentLayout';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment-timezone';
import { useSelector } from 'react-redux';
import CustomEvent from '../../components/common/Calendar/Event';
import { convertToDate } from '../../components/common/Calendar/Calendar';
import { convertTutorIdToName } from '../../helperFunctions/generalHelperFunctions'
import { get_tutor_bookings } from '../../axios/student';


export const SingleTutorFeedbacks = () => {
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
            const timezone = moment.tz.names().filter(name =>
                (moment.tz(name).utcOffset()) === offset * 60);
            setTimeZone(timezone[0] || null);
        }
    }, [student])

    useEffect(() => {
        const fetchTutorBookings = async () => {
            const result = await get_tutor_bookings(params.AcademyId);
            const events = result.map(record => {
                const reservedSlots = JSON.parse(record.reservedSlots ?? '[]');
                const bookedSlots = JSON.parse(record.bookedSlots ?? '[]');
                const combinedSlots = reservedSlots.concat(bookedSlots);
                return combinedSlots;
            }).flat()
            console.log(events, 'kol')
            setEvents(events);
        }
        fetchTutorBookings();
    }, [params])

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

    const convertToGmt = (date) => {
        let updatedDate = moment(convertToDate(date)).tz(timeZone).toDate();
        return updatedDate;
    };

    const localizer = momentLocalizer(moment);
    return (
        <StudentLayout showLegacyFooter={false}>
            <h4 className='text-center m-3'>Tutor "{convertTutorIdToName(params.AcademyId)}" feedback from students</h4>
            <div className='m-3' style={{ height: "80vh" }}>
                <Calendar
                    localizer={localizer}
                    events={events.map((event) => ({
                        ...event,
                        start: convertToGmt(event.start),
                        end: convertToGmt(event.end),
                    }))}
                    components={{
                        event: event => (
                            <CustomEvent
                                {...event}
                                reservedSlots={events}
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
