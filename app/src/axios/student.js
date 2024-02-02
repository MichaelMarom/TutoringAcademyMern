import { toast } from "react-toastify"
import { apiClient } from "./config";

export let upload_setup_form = (fname, mname, sname, email,
    lang, secLan, parentAEmail, parentBEmail, parentAName,
    parentBName,
    is_18, pwd, cell, grade,
    add1, add2, city, state, zipCode, country, timeZone,
    photo, acadId,
    parentConsent, userId) => {

    return new Promise((resolve, reject) => {
        apiClient.post('/student/setup', {
            fname, mname, sname, email, lang, secLan, parentAEmail, parentBEmail, parentAName, parentBName,
            is_18, pwd, cell, grade, add1, add2, city, state, zipCode, country, timeZone, photo, acadId,
            parentConsent, userId
        })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                // reject(err)
            })

    })
}


export const post_student_agreement = async (userId, body) => {
    try {
        const { data } = await apiClient.put(`/student/setup/agreement/${userId}`, body)
        return data
    }
    catch (err) {
        return err
    }
}

export let get_student_setup = (AcademyId) => {

    return new Promise((resolve, reject) => {

        apiClient.get('/student/setup', {
            params: {
                AcademyId
            }
        })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                // reject(err)
            })

    })
}

export const get_student_setup_by_userId = async (userId) => {
    try {
        const { data } = await apiClient.get('/student/setup', {
            params: {
                userId
            }
        })
        return data
    }
    catch (err) {
        console.log(err);
        return err
    }
}


export let get_student_grade = () => {

    return new Promise((resolve, reject) => {


        apiClient.get('/student/grade', {})
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                // reject(err)
            })

    })
}
export let get_student_market_data = (id) => {

    return new Promise((resolve, reject) => {


        apiClient.get('/student/market-data', { params: { id } })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                // reject(err)
            })

    })
}


export let get_tutor_subject = async (subject) => {
    try {
        const { data } = await apiClient.get('/student/tutor-subject', { params: { subject } })
        console.log(data, 'in axios123')
        return data
    }
    catch (err) {
        console.log(err)
        return err
    }
}


export let upload_student_short_list = (items) => {

    return new Promise((resolve, reject) => {


        apiClient.post('/student/short-list', { items })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                // reject(err)
            })

    })
}


export let get_student_short_list = async (student) => {
    try {
        const { data } = await apiClient.get(`/student/short-list/${student}`)
        return data;
    }
    catch (err) {
        console.log(err)
        return err
    }
}


export let get_my_data = (AcademyId) => {
    return new Promise((resolve, reject) => {
        apiClient.get('/student/my-data', {
            params: {
                AcademyId
            }
        })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                console.log(err)
                toast.error(err?.response?.data?.message || "Error Completing the request")
                // // reject(err)
            })
    })
}

export let get_student_short_list_data = (id) => {

    return new Promise((resolve, reject) => {


        apiClient.get('/student/short-list-data', { params: { id } })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                // reject(err)
            })

    })
}


export const save_student_events = async (body) => {
    await apiClient.post('/student/booking', body);
}

export const get_student_tutor_events = async (studentId, tutorId) => {
    const { data } = await apiClient.get(`/student/booking/${studentId}/${tutorId}`);
    return data;
}

export const get_student_events = async (studentId) => {
    try {
        const { data } = await apiClient.get(`/student/booking/${studentId}`);
        return data;
    }
    catch (err) {
        console.log(err)
        return err
    }
}

export const get_tutor_bookings = async (tutorId) => {
    try {
        const { data } = await apiClient.get(`/student/tutor/bookings/${tutorId}`);
        return data;
    }
    catch (err) {
        console.log(err)
    }
}

export const post_bank_details = async (payload) => {
    try {
        const { data } = await apiClient.post('/student/bank', payload);
        return data
    }
    catch (err) {
        console.log(err)
        return err
    }
}

export const get_bank_details = async (id) => {
    try {
        const { data } = await apiClient.get(`/student/bank/${id}`);
        return data
    }
    catch (err) {
        console.log(err)
        return err
    }
}

export const get_payment_report = async (studentId) => {
    try {
        const { data } = await apiClient.get(`/student/payment-report/${studentId}`);
        return data
    }
    catch (err) {
        console.log(err)
        return err
    }
}

export const get_all_feedback_questions = async () => {
    try {
        const { data } = await apiClient.get('/questions/list');
        return data;
    } catch (err) {
        console.log(err)
        return err
    }
}

export const get_feedback_to_question = async (sessionId, tutorId, studentId) => {
    try {
        const { data } = await apiClient.get(`/questions/${studentId}/${tutorId}/${sessionId}`);
        return data;
    } catch (err) {
        console.log(err)
        return err
    }
}

export const post_feedback_to_question = async (sessionId, tutorId, studentId, feedbackQuestionId, rating) => {
    const body = {
        SessionId: sessionId,
        FeedbackQuestionsId: feedbackQuestionId,
        rating,
        TutorId: tutorId,
        StudentId: studentId
    }
    try {
        const { data } = await apiClient.post(`/questions`, body);
        return data;
    } catch (err) {
        console.log(err)
        return err
    }
}

export const update_student_shortlist = async (AcademyId, studentId, subject, body) => {
    try {
        const { data } = await apiClient.put(`/student/short-list/${AcademyId}/${studentId}/${subject}`, body)
        return data;
    }
    catch (err) {
        return err
    }
}

export const getBookedSlot = async (AcademyId) => {
    try {

        let result = await apiClient.get('/student/booked-slot', { params: { AcademyId } })

        return result

    }
    catch (err) {
        return err
    }
}
