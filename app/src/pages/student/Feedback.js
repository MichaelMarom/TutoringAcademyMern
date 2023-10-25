import React, { useEffect, useState } from 'react'
import StudentLayout from '../../layouts/StudentLayout';
import BookedLessons from '../../components/student/Feedback/BookedLessons'
import QuestionFeedback from '../../components/student/Feedback/QuestionFeedback'
import { get_feedback, get_student_events } from '../../axios/student';

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
    const [selectedSubject, setSelectedSubject] = useState(null)
    const [reservedSlots, setReservedSlots] = useState({})
    const [bookedSlots, setBookedSlots] = useState({})


    const handleEmojiClick = (id, star) => {
        // Create a copy of the questions array
        const updatedQuestions = [...questions];

        // Find the index of the question with the matching id
        const questionIndex = updatedQuestions.findIndex((question) => question.id === id);

        if (questionIndex !== -1) {
            // Update the star rating for the question with the matching id
            updatedQuestions[questionIndex].star = star;

            // Update the state with the modified questions
            setQuestions(updatedQuestions);
        }
    };
    const handleRowSelect = (subject) => {
        setSelectedSubject(subject)
    }
    const studentId = 'Naomi. C. M8bc074';
    const tutorId = 'Michael. C. M5ea887';
    const ShortlistId = 28;

    useEffect(() => {
        const fetchFeedback = async () => {
            const data = await get_feedback(ShortlistId);
            console.log(data)
            if(data){
                setReservedSlots((data.reservedSlots))
            }
        }
        fetchFeedback()
    }, [])

    useEffect(() => {
        const getBookings = async () => {
            const data = await get_student_events(studentId, tutorId);
            console.log(data)
        }
        getBookings()
    }, [])

    return (

        <StudentLayout>
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-6">
                        <h2>Booked Lessons</h2>
                        <BookedLessons handleRowSelect={handleRowSelect} />
                    </div>
                    <div className="col-md-6">
                        <h2>Feedback</h2>
                        <div className="questions">
                            <QuestionFeedback questions={questions} handleEmojiClick={handleEmojiClick} />
                            <div class="form-group">
                                <label for="exampleTextarea">Write Feedback about your tutor and relevant subject</label>
                                <textarea class="form-control" id="exampleTextarea" rows="4"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    )
}
