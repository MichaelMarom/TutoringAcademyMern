import axios from "axios";
import { v4 as uuidv4 } from 'uuid'

const instance = axios.create({
    baseURL: "http://localhost:9876", // Adjust the base URL to match your backend API endpoint
    headers: {
        "Content-Type": "application/json",
    },
});


export let upload_new_subject = (faculty, subject, reason, AcademyId, facultyId) => {
    return new Promise((resolve, reject) => {

        axios.post('http://localhost:9876/tutor/new-subject', {
            faculty, subject, reason, AcademyId, facultyId
        })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}

export let get_subject = (id) => {

    return new Promise((resolve, reject) => {


        axios.get('http://localhost:9876/tutor/subjects', {
            params: {
                id
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



export let get_faculty = () => {

    return new Promise((resolve, reject) => {


        axios.get('http://localhost:9876/tutor/faculties', {
            params: {

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



export let get_tutor_status = (faculty, subject, reason, AcademyId) => {

    return new Promise((resolve, reject) => {


        axios.get('http://localhost:9876/tutor/tutor-status', {
            params: {
                faculty, subject, reason, AcademyId
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



export let get_countries = () => {

    return new Promise((resolve, reject) => {


        axios.get('http://localhost:9876/tutor/countries', {

        })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}


export let get_state = () => {

    return new Promise((resolve, reject) => {


        axios.get('http://localhost:9876/tutor/state', {

        })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}


export let get_experience = () => {

    return new Promise((resolve, reject) => {


        axios.get('http://localhost:9876/tutor/experience', {

        })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}


export let get_gmt = () => {

    return new Promise((resolve, reject) => {


        axios.get('http://localhost:9876/tutor/gmt', {

        })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}

export let get_response = () => {

    return new Promise((resolve, reject) => {


        axios.get('http://localhost:9876/tutor/response', {

        })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}


export let upload_form_one = (fname, uname, mname, sname, email, cell, acadId, add1, add2, city, state, zipCode, country, timeZone, response_zone, intro, motivation, headline, photo, video, grades, userId) => {
    return new Promise((resolve, reject) => {

        axios.post('http://localhost:9876/tutor/form-one', {
            fname, uname, mname, sname, email, cell, acadId, add1, add2, city, state, zipCode, country, timeZone, response_zone, intro, motivation, headline, photo, video, grades, userId
        })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })



    })
}


export let upload_form_two = (level, university1, university2, university3, degree, degreeFile, certificate, certificateFile, language, state2, state3, state4, state5, state6, doctorateState, experience, graduagteYr1, graduagteYr2, graduagteYr3, doctorateGraduateYear, expiration, otherang, workExperience, user_id) => {
    return new Promise((resolve, reject) => {
        console.log(university3, doctorateGraduateYear, doctorateState)

        axios.post('http://localhost:9876/tutor/form-two', {
            level, university1, university2, university3, degree, degreeFile, certificate, certificateFile, language, state2, state3, state4, state5, state6, doctorateState, experience, graduagteYr1, graduagteYr2, graduagteYr3, doctorateGraduateYear, expiration, otherang, workExperience, user_id
        })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}

//not using
export let upload_form_three = (MutiStudentHourlyRate, CancellationPolicy, FreeDemoLesson, ConsentRecordingLesson, ActivateSubscriptionOption, SubscriptionPlan, AcademyId, DiscountCode, CodeShareable, MultiStudent) => {
    return new Promise((resolve, reject) => {

        axios.post('http://localhost:9876/tutor/form-three', {
            MutiStudentHourlyRate, CancellationPolicy, FreeDemoLesson, ConsentRecordingLesson, ActivateSubscriptionOption, SubscriptionPlan, AcademyId, DiscountCode, CodeShareable, MultiStudent
        })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}


export let get_degree = () => {
    return new Promise((resolve, reject) => {

        axios.get('http://localhost:9876/tutor/degree', {

        })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}

export let get_level = () => {
    return new Promise((resolve, reject) => {

        axios.get('http://localhost:9876/tutor/level', {

        })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}



export let get_certificates = () => {
    return new Promise((resolve, reject) => {

        axios.get('http://localhost:9876/tutor/certificates', {

        })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}


export let get_user_data = (user_id) => {
    console.log(user_id)
    return new Promise((resolve, reject) => {

        axios.get('http://localhost:9876/tutor/education', {
            params: {
                user_id
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



export let upload_tutor_rates = (rate_list, AcademyId) => {
    return new Promise((resolve, reject) => {

        axios.post('http://localhost:9876/tutor/rates', {
            rate_list, AcademyId
        })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}


export let get_my_data = (AcademyId) => {
    return new Promise((resolve, reject) => {

        axios.get('http://localhost:9876/tutor/my-data', {
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

export let get_my_edu = (AcademyId) => {
    return new Promise((resolve, reject) => {

        axios.get('http://localhost:9876/tutor/my-edu', {
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


export let get_rates = (AcademyId) => {
    return new Promise((resolve, reject) => {

        axios.get('http://localhost:9876/tutor/my-rate', {
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



export let get_bank_details = (AcademyId) => {
    return new Promise((resolve, reject) => {

        axios.get('http://localhost:9876/tutor/tutor-bank-details', {
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

export let get_tutor_rates = (AcademyId) => {
    return new Promise((resolve, reject) => {

        axios.get('http://localhost:9876/tutor/tutor-rate', {
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

export let upload_form_four = (start_day, acct_name, acct_type, bank_name, acct, routing, ssh, accumulated_hrs, commission, total_earning, payment_option, AcademyId) => {
    return new Promise((resolve, reject) => {

        axios.post('http://localhost:9876/tutor/payment', {
            start_day, acct_name, acct_type, bank_name, acct, routing, ssh, accumulated_hrs, commission, total_earning, payment_option, AcademyId
        })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}


export let get_tutor_setup = (AcademyId) => {
    return new Promise((resolve, reject) => {

        axios.get('http://localhost:9876/tutor/tutor-setup', {
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

export let get_tutor_setup_by_userId = async (userId) => {
    try {
        const { data } = await instance.get('/tutor/tutor-setup', {
            params: {
                userId
            }
        })
        return data
    }
    catch (err) {
        console.log(err)
        return err
    }

}

export let get_tutor_setup_by_acaId = async (AcademyId) => {
    try {
        const { data } = await instance.get('/tutor/tutor-setup', {
            params: {
                AcademyId
            }
        })
        return data
    }
    catch (err) {
        console.log(err)
        return err
    }

}

export const storeEventAPI = async (eventDetails) => {
    try {
        console.log(eventDetails, 'dataformat');
        const newEvent = {
            title: eventDetails.title,
            allDay: eventDetails.allDay,
            start: eventDetails.start,
            end: eventDetails.end,
        };
        const response = await instance.post("/api/store-event", newEvent);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
    }
};

export const fetchStudentsBookings = async (tutorId) => {
    try {
        const response = await instance.get(`api/bookings/${tutorId}`);
        console.log(response, 'in axios');
        return response.data;
    } catch (error) {
        console.error("Error:", error);
    }
};


export const updateTutorDisableslots = async (tutorAcademyId, body) => {
    try {
        const { data } = await instance.put(`/tutor/update/${tutorAcademyId}`, body);
        return data
    }
    catch (err) {
        console.log(err)
        return err
    }
}
export const addDisabledDates = async (date) => {
    try {
        const response = await instance.post("/api/store-disabled-dates", date);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
    }
};


export const post_tutor_setup = async (data) => {
    try {
        console.log(data.video)
        let dataObject = {}
        if (data.photo !== undefined) dataObject.Photo = data.photo;
        if (data.video !== undefined) dataObject.Video = data.video;
        if (data.recordedVideo !== undefined) dataObject.VideoRecorded = data.recordedVideo;
        if (data.fname !== undefined) dataObject.FirstName = data.fname;
        if (data.mname !== undefined) dataObject.MiddleName = data.mname;
        if (data.sname !== undefined) dataObject.LastName = data.sname;
        if (data.add1 !== undefined) dataObject.Address1 = data.add1;
        if (data.add2 !== undefined) dataObject.Address2 = data.add2;
        if (data.city !== undefined) dataObject.CityTown = data.city;
        if (data.state !== undefined) dataObject.StateProvince = data.state;
        if (data.zipCode !== undefined) dataObject.ZipCode = data.zipCode;
        if (data.country !== undefined) dataObject.Country = data.country;
        if (data.cell !== undefined) dataObject.CellPhone = data.cell;
        if (data.timeZone !== undefined) dataObject.GMT = data.timeZone;
        if (data.response_zone !== undefined) dataObject.ResponseHrs = data.response_zone;
        if (data.screenName !== undefined) dataObject.TutorScreenname = data.screenName;
        if (data.headline !== undefined) dataObject.HeadLine = data.headline;
        if (data.intro !== undefined) dataObject.Introduction = data.intro;
        if (data.motivation !== undefined) dataObject.Motivate = data.motivation;
        if (data.userId !== undefined) dataObject.userId = data.userId;
        if (data.grades !== undefined) dataObject.Grades = data.grades;
        dataObject.TutorScreenname = data.mname.length > 0 ? data.fname + '.' + ' ' + data.mname[0] + '.' + ' ' + data.sname[0] : data.fname + '.' + ' ' + data.sname[0];
        dataObject.AcademyId = uuidv4()
        console.log(dataObject, 'AOBNjext')
        return instance.post('/tutor/setup', dataObject)
    } catch (err) {
        console.log(err)
    }
}