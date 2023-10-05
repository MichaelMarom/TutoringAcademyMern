import axios from "axios"




export let delete_new_subject = (subject,AcademyId) => {

    return new Promise((resolve, reject) => {

    
        axios.post('http://localhost:9876/admin/delete-new-subject', {subject,AcademyId})
        .then((result) => {
            resolve(result.data) 
        })
        .catch((err) => {
            reject(err)
        })

    })
    
}

export let post_new_subject = (id,subject,AcademyId) => {

    return new Promise((resolve, reject) => {

    
        axios.post('http://localhost:9876/admin/post-new-subject', {id,subject,AcademyId})
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

    
        axios.get('http://localhost:9876/admin/tutor-new-subject', {})
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

    
        axios.get('http://localhost:9876/admin/tutor-data', {})
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

    
        axios.post('http://localhost:9876/admin/set-tutor-status', {
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

    
        axios.get('http://localhost:9876/admin/student-data', {})
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

    
        axios.post('http://localhost:9876/admin/set-student-status', {
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