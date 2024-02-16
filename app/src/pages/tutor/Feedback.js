import React, { useState } from 'react'
import TutorLayout from '../../layouts/TutorLayout'
import { showDate } from '../../helperFunctions/timeHelperFunctions';
import QuestionFeedback from '../../components/tutor/Feedback/QuestionFeedback';
import SessionsTable from '../../components/tutor/Feedback/SessionsTable';
import { wholeDateFormat } from '../../constants/constants';

const Feedback = () => {
    const [pastSessions, setPastSessions] = useState([])
    const [selectedEvent, setSelectedEvent] = useState({})
    const [questionLoading, setQuestionsLoading] = useState(false)
    const questions = []
    const [feedbackData, setFeedbackData] = useState();
    const [comment, setComment] = useState('')

    const handleRowSelect = () => { }
    const handleEmojiClick = () => {

    }

    const handleTextChange = () => { }

    return (
        <TutorLayout>
            <div className="container mt-1">
                <div className="py-2 row" >
                    <div className={` ${selectedEvent.id ? 'col-md-8' : 'col-md-12'}`}
                        style={{ maxHeight: "68vh", overflowY: "auto" }}>
                        <h2>Booked Lessons</h2>
                        {pastSessions.length ?
                            <>
                                <div style={{ fontSize: "14px" }}>
                                    <span style={{ fontWeight: "bold", fontSize: "16px" }} > Lessons blinking</span> by green border are ready for your feedback.
                                    Please rate your student as soon as posible.</div>
                                <SessionsTable
                                    setEvents={setFeedbackData}
                                    events={pastSessions}
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
                                        value={selectedEvent.comment ? selectedEvent.comment : comment}
                                        onChange={handleTextChange} />
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </TutorLayout>
    )
}

export default Feedback