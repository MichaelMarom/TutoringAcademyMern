import axios from "axios";
const axiosInstance = axios.create({
    baseURL: 'http://localhost:9876',
    headers: {
        'Content-Type': 'application/json',
    },
});

export let upload_form_one = (fname, mname, sname, email, lang, is_18, pwd, cell, grade, add1, add2, city, state, zipCode, country, timeZone, parent_fname, parent_lname, parent_email, photo, acadId, parentConsent, userId) => {

    return new Promise((resolve, reject) => {


        axios.post('http://localhost:9876/student/setup', {
            fname, mname, sname, email, lang, is_18, pwd, cell, grade, add1, add2, city, state, zipCode, country, timeZone, parent_fname, parent_lname, parent_email, photo, acadId, parentConsent, userId
        })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}



export let get_student_setup = (AcademyId) => {

    return new Promise((resolve, reject) => {


        axios.get('http://localhost:9876/student/setup', {
            params: {
                AcademyId
            }
        })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}

export const get_student_setup_by_userId = async (AcademyId) => {
    try {
        const { data } = await axiosInstance.get('/student/setup', {
            params: {
                AcademyId
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


        axios.get('http://localhost:9876/student/grade', {})
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}
export let get_student_market_data = (id) => {

    return new Promise((resolve, reject) => {


        axios.get('http://localhost:9876/student/market-data', { params: { id } })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}


export let get_tutor_subject = async (subject) => {
    const { data } = await axiosInstance.get('/student/tutor-subject', { params: { subject } })
    console.log(data, 'in axios123')
    return data
}


export let upload_student_short_list = (items) => {

    return new Promise((resolve, reject) => {


        axios.post('http://localhost:9876/student/short-list', { items })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}


export let get_student_short_list = async (student) => {
    try {
        const { data } = await axiosInstance.get(`/student/short-list/${student}`)
        return data;
    }
    catch (err) {
        console.log(err)
        return err
    }
}


export let get_my_data = (AcademyId) => {
    return new Promise((resolve, reject) => {

        axios.get('http://localhost:9876/student/my-data', {
            params: {
                AcademyId
            }
        })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}

export let get_student_short_list_data = (id) => {

    return new Promise((resolve, reject) => {


        axios.get('http://localhost:9876/student/short-list-data', { params: { id } })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}


export const save_student_events = async (body) => {
    await axiosInstance.post('/student/booking', body);
}

export const get_student_tutor_events = async (studentId, tutorId) => {
    const { data } = await axiosInstance.get(`/student/booking/${studentId}/${tutorId}`);
    return data;
}

export const get_student_events = async (studentId) => {
    try {
        const { data } = await axiosInstance.get(`/student/booking/${studentId}`);
        return data;
    }
    catch (err) {
        console.log(err)
        return err
    }
}

export const post_bank_details = async (payload) => {
    try {
        const { data } = await axiosInstance.post('/student/bank', payload);
        return data
    }
    catch (err) {
        console.log(err)
        return err
    }
}

export const get_bank_details = async (id) => {
    try {
        const { data } = await axiosInstance.get(`/student/bank/${id}`);
        return data
    }
    catch (err) {
        console.log(err)
        return err
    }
}

export const get_payment_report = async (studentId) => {
    try {
        const { data } = await axiosInstance.get(`/student/payment-report/${studentId}`);
        return data
    }
    catch (err) {
        console.log(err)
        return err
    }
}

export const get_all_feedback_questions = async () => {
    try {
        const { data } = await axiosInstance.get('/questions/list');
        return data;
    } catch (err) {
        console.log(err)
        return err
    }
}

export const get_feedback_to_question = async (sessionId, tutorId, studentId) => {
    try {
        const { data } = await axiosInstance.get(`/questions/${studentId}/${tutorId}/${sessionId}`);
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
        const { data } = await axiosInstance.post(`/questions`, body);
        return data;
    } catch (err) {
        console.log(err)
        return err
    }
}

export const update_student_shortlist = async (AcademyId, studentId, subject, body) => {
    try {
        const { data } = await axiosInstance.put(`/student/short-list/${AcademyId}/${studentId}/${subject}`, body)
        return data;
    }
    catch (err) {
        return err
    }
}

export const getBookedSlot = async (AcademyId) => {
    try{

        let result = await axiosInstance.get('/student/booked-slot', {params: {AcademyId}})

        return result
        
    }
    catch (err){
        return err
    }
}
