import React, { useEffect, useState } from 'react'
import StudentLayout from '../../layouts/StudentLayout';
import BookedLessons from '../../components/student/Feedback/BookedLessons'
import QuestionFeedback from '../../components/student/Feedback/QuestionFeedback'
import { get_all_feedback_questions, get_feedback_to_question, get_payment_report, get_student_events, post_feedback_to_question, save_student_events } from '../../axios/student';
import { showDate } from '../../helperFunctions/timeHelperFunctions';
import { wholeDateFormat } from '../../constants/constants';
import { useDispatch } from 'react-redux';
import { postStudentBookings } from '../../redux/student_store/studentBookings';
import Actions from '../../components/common/Actions';
import { toast } from 'react-toastify';
import { convertToDate } from '../../components/common/Calendar/Calendar';

export const Feedback = () => {
    const [questions, setQuestions] = useState([]);
    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(false)
    const [reservedSlots, setReservedSlots] = useState([])
    const [bookedSlots, setBookedSlots] = useState([])
    const [questionLoading, setQuestionLoading] = useState(false);

    const [selectedEvent, setSelectedEvent] = useState({})
    const [feedbackData, setFeedbackData] = useState([])
    const studentId = localStorage.getItem('student_user_id');
    const [pendingChange, setPendingChange] = useState(null);

    const dispatch = useDispatch()

    useEffect(() => {
        const getALlFeedbackQuestion = async () => {
            const data = await get_all_feedback_questions();
            setQuestions(data)
        }
        getALlFeedbackQuestion();

    }, [])

    const handleEmojiClick = async (id, star) => {
        const updatedQuestions = [...questions];
        const questionIndex = updatedQuestions.findIndex((question) => question.SID === id);

        if (questionIndex !== -1) {
            const data = await post_feedback_to_question(selectedEvent.id, selectedEvent.tutorId, studentId, id, star);
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
                await dispatch(postStudentBookings({
                    studentId, tutorId: selectedEvent.tutorId,
                    bookedSlots: updatedBookedSlots, reservedSlots
                }));
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
                await dispatch(postStudentBookings({
                    studentId, tutorId: selectedEvent.tutorId,
                    bookedSlots, reservedSlots: updatedReservedSlots
                }));

                setReservedSlots([...updatedReservedSlots])
            }
        }
    };

    const handleRowSelect = (event) => {
        setSelectedEvent(event)
    }

    const handleDynamicSave = async (value) => {
        setLoading(true)
        const updatedSlots = (selectedEvent.type === 'booked'
            ? bookedSlots
            : reservedSlots).map(slot => {
                if (slot.id === selectedEvent.id) {
                    slot.comment = value;
                }
                return slot
            })
        if (selectedEvent.type === 'booked') {
            // setBookedSlots([...updatedSlots])
            const data = await dispatch(postStudentBookings({
                studentId, tutorId: selectedEvent.tutorId,
                bookedSlots: updatedSlots, reservedSlots
            }));
            (data.response?.status === 400) ?
                toast.error("Error while saving the data") :
                toast.success('Data Succesfully Saved')
        }
        else {
            const data = await dispatch(postStudentBookings({
                studentId, tutorId: selectedEvent.tutorId,
                bookedSlots, reservedSlots: updatedSlots
            }));
            // setReservedSlots([...updatedSlots])
            data?.response?.status === 400 && toast.error("Error while saving the data");

            // toast.success('Data Succesfully Saved')
        }
        setLoading(false)
    }

    const handleTextChange = (event) => {
        const updatedValue = event.target.value;
        setComment(updatedValue);

        if (pendingChange) {
            clearTimeout(pendingChange);
        }

        const timeout = setTimeout(() => {
            handleDynamicSave(updatedValue);
        }, 1000);

        setPendingChange(timeout);
    };

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

    const transformFeedbackData = (item) => {
        let bookedSlots = JSON.parse(item.bookedSlots);
        let reservedSlots = JSON.parse(item.reservedSlots);
        console.log(bookedSlots, reservedSlots)
        bookedSlots = bookedSlots.filter(slot => {
            console.log(showDate(slot.end, wholeDateFormat), (new Date()).toLocaleString())
            return convertToDate(slot.end).getTime() < (new Date()).getTime()
        })
        reservedSlots = reservedSlots.filter(slot => {
            console.log(showDate(slot.end, wholeDateFormat), (new Date()).toLocaleString())
            return convertToDate(slot.end).getTime() < (new Date()).getTime()
        })
        const updatedPaymentReport_booked = bookedSlots.map(slot => ({
            ...slot,
            tutorId: item.tutorId,
        }));

        const updatedPaymentReport_reserved = reservedSlots.map(slot => ({
            ...slot,
            tutorId: item.tutorId,
        }));

        const combinedPaymentData = updatedPaymentReport_reserved.concat(updatedPaymentReport_booked);
        const final = combinedPaymentData.filter(data => data.type != 'reserved')
        return final
    };

    useEffect(() => {
        const fetchPaymentReport = async () => {
            const data = await get_payment_report(studentId);
            const uniqueData = data.reduce((unique, item) => {
                if (unique.some(detail => detail.tutorId === item.tutorId)) {
                    return unique
                }
                else {
                    return [...unique, item]
                }
            }, [])
            const transformedData = uniqueData.map(item => transformFeedbackData(item)).flat();
            setFeedbackData(transformedData);
        };

        fetchPaymentReport();
    }, []);


    useEffect(() => {
        if (selectedEvent.id) {
            setQuestionLoading(true)
            const fetchFeedbackToQuestion = async () => {
                const data = await get_feedback_to_question(selectedEvent.id, selectedEvent.tutorId, studentId)
                console.log(data)
                if (data.length)
                    setQuestions(data)
                setQuestionLoading(false)
            }
            fetchFeedbackToQuestion()
        }

        const categorizedData = feedbackData.reduce(
            (acc, obj) => {
                if ((obj.type === 'intro' || obj.type === 'reserved') && obj.tutorId === selectedEvent.tutorId) {
                    acc.reservedSlots.push(obj);
                } else if (obj.type === 'booked' && obj.tutorId === selectedEvent.tutorId) {
                    acc.bookedSlots.push(obj);
                }
                return acc;
            },
            { reservedSlots: [], bookedSlots: [] }
        );

        setReservedSlots(categorizedData.reservedSlots);
        setBookedSlots(categorizedData.bookedSlots);

    }, [selectedEvent])

    return (
        <StudentLayout showLegacyFooter={false} >
            <div className="container mt-5">
                <div className="row">
                    <div className={`${selectedEvent.id ? 'col-md-8' : 'col-md-12'}`}>
                        <h2>Booked Lessons</h2>
                        {feedbackData.length ?
                            <BookedLessons
                                events={feedbackData}
                                handleRowSelect={handleRowSelect}
                                setSelectedEvent={setSelectedEvent}
                                selectedEvent={selectedEvent}
                            /> :
                            <div className='text-danger'>No Record Found</div>
                        }
                    </div>
                    {
                        selectedEvent.id &&
                        <div className="col-md-4">
                            <h4>Feedback on {showDate(selectedEvent.start, wholeDateFormat)} Session</h4>
                            <div className="questions">
                                <QuestionFeedback
                                    loading={questionLoading}
                                    questions={questions}
                                    handleEmojiClick={handleEmojiClick}
                                />
                                <div className="form-group">
                                    <label for="exampleTextarea">Please write a short description of your impression about this lesson</label>

                                    <textarea className="form-control" id="exampleTextarea" rows="4"
                                        value={selectedEvent.comment ? selectedEvent.comment : comment}
                                        onChange={handleTextChange} />
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>

            <Actions
                saveDisabled={true}
            />
        </StudentLayout>
    )
}
