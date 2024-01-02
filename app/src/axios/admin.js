import { apiClient } from "./config"

export let delete_new_subject = (subject, AcademyId) => {

    return new Promise((resolve, reject) => {


        apiClient.post('/admin/delete-new-subject', { subject, AcademyId })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })

}

export let post_new_subject = (id, subject, AcademyId) => {

    return new Promise((resolve, reject) => {


        apiClient.post('/admin/post-new-subject', { id, subject, AcademyId })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}

export let get_tutor_new_subject = () => {

    return new Promise((resolve, reject) => {


        apiClient.get('/admin/tutor-new-subject', {})
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}

export let get_tutor_data = () => {

    return new Promise((resolve, reject) => {


        apiClient.get('/admin/tutor-data', {})
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}

export let set_tutor_status = (Id, Status) => {

    return new Promise((resolve, reject) => {


        apiClient.post('/admin/set-tutor-status', {
            Id, Status
        })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}

export let get_student_data = () => {

    return new Promise((resolve, reject) => {


        apiClient.get('/admin/student-data', {})
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}

export let set_student_status = (Id, Status) => {

    return new Promise((resolve, reject) => {


        apiClient.post('/admin/set-student-status', {
            Id, Status
        })
            .then((result) => {
                resolve(result.data)
            })
            .catch((err) => {
                reject(err)
            })

    })
}

export const post_termsOfUse = async (data) => {
    try {
        const response = await apiClient.post(`/admin/store-terms`, data);
        return response;
    } catch (error) {
        console.log(error);
        return error;
    }
};

export const get_adminConstants = async (data) => {
    try {
        const response = await apiClient.get(`/admin/get-constants`);
        return response;
    } catch (error) {
        console.log(error);
        return error;
    }
};