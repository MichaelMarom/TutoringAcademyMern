import React, { useEffect, useState } from 'react'
import TutorLayout from '../../layouts/TutorLayout'
import { showDate } from '../../helperFunctions/timeHelperFunctions';
import QuestionFeedback from '../../components/tutor/Feedback/QuestionFeedback';
import SessionsTable from '../../components/tutor/Feedback/SessionsTable';
import { wholeDateFormat } from '../../constants/constants';
import { feedback_records, get_tutor_feedback_questions } from '../../axios/tutor';
import { useDispatch, useSelector } from 'react-redux';
import { get_feedback_to_question, post_feedback_to_question } from '../../axios/student';
import { postStudentBookings } from '../../redux/student_store/studentBookings';
import { toast } from 'react-toastify';
import Actions from '../../components/common/Actions';

const Feedback = () => {
    const dispatch = useDispatch()
    const [selectedEvent, setSelectedEvent] = useState({})
    const [questionLoading, setQuestionLoading] = useState(false)
    const [feedbackData, setFeedbackData] = useState([]);
    const [comment, setComment] = useState('')
    const [questions, setQuestions] = useState([])
    const [pendingChange, setPendingChange] = useState(null);
    const { tutor } = useSelector(state => state.tutor)

    useEffect(() => {
        const getALlFeedbackQuestion = async () => {
            const data = await get_tutor_feedback_questions();
            setQuestions(data)
        }
        getALlFeedbackQuestion();

    }, [])

    useEffect(() => {
        const getFeedback = async () => {
            const records = tutor.AcademyId ? await feedback_records(tutor.AcademyId) : []
            setFeedbackData(records)
        }
        getFeedback()
    }, [tutor])

    const handleRowSelect = () => { }

    const handleEmojiClick = async (id, star) => {
        const updatedQuestions = [...questions];
        const questionIndex = updatedQuestions.findIndex((question) => question.SID === id);

        if (questionIndex !== -1) {
            await post_feedback_to_question(selectedEvent.id, tutor.AcademyId, selectedEvent.studentId, id, star, 0);
            updatedQuestions[questionIndex].star = star;
            setQuestions([...updatedQuestions]);
            const updatedSlots = feedbackData.map(slot => {
                if (slot.id === selectedEvent.id) {
                    slot.tutorRating = (questions.reduce((sum, question) => {
                        sum = question.star + sum
                        return sum
                    }, 0)) / questions.length;
                }
                return slot
            })

            dispatch(postStudentBookings({
                studentId: selectedEvent.studentId, tutorId: tutor.AcademyId,
                bookedSlots: updatedSlots.filter(slot => slot.type === 'booked' && slot.studentId === selectedEvent.studentId && slot.tutorId === tutor.AcademyId),
                reservedSlots: updatedSlots.filter(slot => slot.type !== 'booked' && slot.studentId === selectedEvent.studentId && slot.tutorId === tutor.AcademyId)
            }));
            setFeedbackData(feedbackData.map(slot => {
                if (slot.id === selectedEvent.id) {
                    slot.tutorRating = (questions.reduce((sum, question) => {
                        sum = question.star + sum
                        return sum
                    }, 0)) / questions.length;
                }
                return slot;
            }))
        }
    };

    const handleDynamicSave = async (value) => {
        const updatedSlots = feedbackData.map(slot => {
            if (slot.id === selectedEvent.id) {
                slot.tutorComment = value;
            }
            return slot
        })

        const data = dispatch(postStudentBookings({
            studentId: selectedEvent.studentId, tutorId: tutor.AcademyId,
            bookedSlots: updatedSlots.filter(slot => slot.id === 'booked' && slot.studentId === selectedEvent.studentId && slot.tutorId === tutor.AcademyId),
            reservedSlots: updatedSlots.filter(slot => slot.id !== 'booked' && slot.studentId === selectedEvent.studentId && slot.tutorId === tutor.AcademyId)
        }));
        data?.response?.status === 400 && toast.error("Error while saving the data");
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
        const updatedSlots = feedbackData.map(slot => {
            if (slot.id === selectedEvent.id) {
                slot.tutorComment = comment;
            }
            return slot
        })

        setFeedbackData(updatedSlots)
        setSelectedEvent({ ...selectedEvent, comment })

    }, [comment])

    useEffect(() => {
        if (selectedEvent.id) {
            setQuestionLoading(true)
            const fetchFeedbackToQuestion = async () => {
                const data = await get_feedback_to_question(selectedEvent.id, tutor.AcademyId, selectedEvent.studentId, 0)
                console.log(data)
                if (data.length)
                    setQuestions(data)
                setQuestionLoading(false)
            }
            fetchFeedbackToQuestion()
        }
        setQuestions(questions.map(question => ({ ...question, star: null })))
        setComment('')
    }, [selectedEvent.id])


    return (
        <TutorLayout>
            <div className="container mt-1">
                <div className="py-2 row" >
                    <div className={` ${selectedEvent.id ? 'col-md-8' : 'col-md-12'}`}
                        style={{ maxHeight: "80vh", overflowY: "auto" }}>
                        <h2>Booked Lessons</h2>
                        {feedbackData.length ?
                            <>
                                <div style={{ fontSize: "14px" }}>
                                    <span style={{ fontWeight: "bold", fontSize: "16px" }} > Lessons blinking</span> by green border are ready for your feedback.
                                    Please rate your student as soon as possible.
                                </div>
                                <SessionsTable
                                    events={feedbackData}
                                    handleRowSelect={handleRowSelect}
                                    setSelectedEvent={setSelectedEvent}
                                    selectedEvent={selectedEvent}
                                />
                            </>
                            :
                            <div className='text-danger'>No Record Found</div>
                        }
                    </div>
                    {
                        selectedEvent.id &&
                        <div className="col-md-4 " style={{ height: "70vh", overflowY: "auto" }}>
                            <h4>Feedback on {showDate(selectedEvent.start, wholeDateFormat)} Session</h4>
                            <div className="questions">
                                <QuestionFeedback
                                    loading={questionLoading}
                                    questions={questions}
                                    handleEmojiClick={handleEmojiClick}
                                />
                                <div className="form-group">
                                    <label htmlFor="exampleTextarea">
                                        Please write a short description of your impression about this lesson
                                    </label>

                                    <textarea className="form-control" id="exampleTextarea" rows="4"
                                        value={selectedEvent.tutorComment ? selectedEvent.tutorComment : comment}
                                        onChange={handleTextChange} />
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <Actions saveDisabled />
        </TutorLayout>
    )
}

export default Feedback