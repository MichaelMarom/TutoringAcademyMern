import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import StudentLayout from '../../layouts/StudentLayout';
import * as STUDENT_APIS from '../../axios/student'
import { SessionFeedback } from '../../components/common/EventModal/TutorEventModal/SessionFeedback';

export const SingleTutorFeedback = () => {
    const params = useParams();
    const [events, setEvents] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [questionLoading, setQuestionLoading] = useState(false);

    useEffect(() => {
        if (events[0]) {
            setQuestionLoading(true)
            const fetchFeedbackToQuestion = async () => {
                const data = await STUDENT_APIS.get_feedback_to_question(events[0].id, events[0].tutorId,
                    events[0].studentId)
                if (data.length)
                    setQuestions(data)
                setQuestionLoading(false)
            }
            fetchFeedbackToQuestion()
        }
    }, [events])

    useEffect(() => {
        const fetchEventFeedbacks = async () => {
            const data = await STUDENT_APIS.get_tutor_bookings(params.AcademyId);
            const extractedEvents = data.map(event => {
                const bookedslots = JSON.parse(event.bookedSlots ?? '[]');
                const reservedslots = JSON.parse(event.reservedslots ?? '[]');
                const combinedEvents = bookedslots.concat(reservedslots);
                console.log(combinedEvents, event)
                return combinedEvents
            }).flat();
            setEvents(extractedEvents)
        }

        fetchEventFeedbacks();
    }, [params])

    return (
        <StudentLayout showLegacyFooter={false}>
            <div style={{ height: "90vh", overflowY: "auto" }}>
                {events.map(event =>
                    <SessionFeedback
                        clickedSlot={event} questions={questions}
                    />
                )}
                <div>SingleTutorFeedback</div>
            </div>
        </StudentLayout>
    )
}
