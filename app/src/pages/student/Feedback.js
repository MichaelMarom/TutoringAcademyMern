import React, { useEffect, useState } from 'react'
import StudentLayout from '../../layouts/StudentLayout';
import BookedLessons from '../../components/student/Feedback/BookedLessons'
import QuestionFeedback from '../../components/student/Feedback/QuestionFeedback'
import { get_feedback, get_student_events, save_student_events } from '../../axios/student';
import { showDate } from '../../helperFunctions/timeHelperFunctions';
import { wholeDateFormat } from '../../constants/constants';
import { useDispatch } from 'react-redux';
import { postStudentBookings } from '../../redux/student_store/studentBookings';
import Actions from '../../components/common/Actions';
import Loading from '../../components/common/Loading';
import { toast } from 'react-toastify';
export const Feedback = () => {
    const [questions, setQuestions] = useState([
        {
            id: 1,
            title: 'Feedback',
            star: null,
        },
        {
            id: 2,
            title: 'How is your experience with this tutor?',
            star: null,
        },
        {
            id: 3,
            title: 'What is your overall rating for this session?',
            star: null,
        },
    ]);
    const [comment, setComment] = useState('')
    const [reservedSlots, setReservedSlots] = useState([])
    const [loading, setLoading] = useState(false)
    const [bookedSlots, setBookedSlots] = useState([])

    const [selectedEvent, setSelectedEvent] = useState({})

    const handleEmojiClick = (id, star) => {
        const updatedQuestions = [...questions];
        const questionIndex = updatedQuestions.findIndex((question) => question.id === id);

        if (questionIndex !== -1) {
            updatedQuestions[questionIndex].star = star;
            setQuestions([...updatedQuestions]);
            if (selectedEvent.type === 'booked') {
                const updatedBookedSlots = bookedSlots.map(slot => {
                    if (slot.id === selectedEvent.id) {
                        slot.rating = (questions.reduce((sum, question) => {
                            sum = question.star + sum
                            return sum
                        }, 0)) / questions.length;
                    }
                    return slot
                })
                setBookedSlots([...updatedBookedSlots])
            }
            else {
                const updatedReservedSlots = reservedSlots.map(slot => {
                    if (slot.id === selectedEvent.id) {
                        slot.rating = (questions.reduce((sum, question) => {
                            sum = question.star + sum
                            return sum
                        }, 0)) / questions.length;
                    }
                    return slot
                })

                setReservedSlots([...updatedReservedSlots])
            }
        }
    };

    const handleRowSelect = (event) => {
        setSelectedEvent(event)
    }

    const studentId = 'Naomi. C. M8bc074';
    const tutorId = 'Michael. C. M5ea887';
    const ShortlistId = 28;
    const dispatch = useDispatch()

    const onSave = async () => {
        setLoading(true)
        const data = await dispatch(postStudentBookings({ studentId, tutorId, bookedSlots, reservedSlots }));
        (data.response?.status === 400) ?
            toast.error("Error while saving the data") :
            toast.success('Data Succesfully Saved')
        setLoading(false)
    }

    useEffect(() => {
        const updatedSlots = (selectedEvent.type === 'booked'
            ? bookedSlots
            : reservedSlots).map(slot => {
                if (slot.id === selectedEvent.id) {
                    slot.comment = comment;
                }
                return slot
            })
        if (selectedEvent.type === 'booked')
            setBookedSlots([...updatedSlots])
        else
            setReservedSlots([...updatedSlots])
    }, [comment])

    useEffect(() => {
        setQuestions(questions.map(question => ({ ...question, star: null })))
        setComment('')
    }, [selectedEvent.id])

    useEffect(() => {
        const fetchFeedback = async () => {
            const data = await get_feedback(ShortlistId);
            console.log(data)
            if (data) {
                // setReservedSlots((data.reservedSlots))
            }
        }
        fetchFeedback()
    }, [])

    useEffect(() => {
        const getBookings = async () => {
            const data = await get_student_events(studentId, tutorId);
            setBookedSlots(JSON.parse(data.bookedSlots))
            setReservedSlots(JSON.parse(data.reservedSlots))
        }
        getBookings()
    }, [])

    if (loading)
        return <Loading />
    return (
        <StudentLayout showLegacyFooter={false} >
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-6">
                        <h2>Booked Lessons</h2>
                        <BookedLessons
                            events={bookedSlots.concat(reservedSlots)}
                            handleRowSelect={handleRowSelect}
                            setSelectedEvent={setSelectedEvent}
                            selectedEvent={selectedEvent}
                        />
                    </div>
                    {
                        selectedEvent.id &&
                        <div className="col-md-6">
                            <h4>Feedback on {showDate(selectedEvent.start, wholeDateFormat)} Session</h4>
                            <div className="questions">
                                <QuestionFeedback
                                    questions={questions} handleEmojiClick={handleEmojiClick} />
                                <div className="form-group">
                                    <label for="exampleTextarea">Write Feedback about your tutor, relevant subject and about session</label>
                                    <textarea className="form-control" id="exampleTextarea" rows="4"
                                        value={selectedEvent.comment ? selectedEvent.comment : comment}
                                        onChange={(e) => setComment(e.target.value)}></textarea>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>

            <Actions onSave={onSave} />
        </StudentLayout>
    )
}
