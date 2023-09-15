import axios from "axios"




export let upload_form_one = (fname,mname,sname,email,lang,is_18,pwd,cell,grade,add1,add2,city,state,zipCode,country,timeZone,parent_fname,parent_lname,parent_email,photo,acadId) => {

    return new Promise((resolve, reject) => {

    
        axios.post('http://localhost:9876/student/setup', {
            fname,mname,sname,email,lang,is_18,pwd,cell,grade,add1,add2,city,state,zipCode,country,timeZone,parent_fname,parent_lname,parent_email,photo,acadId
        })
        .then((result) => {
            resolve(result.data) 
        })
        .catch((err) => {
            reject(err)
        })

    })
}



export let get_student_setup = (id) => {

    return new Promise((resolve, reject) => {

    
        axios.get('http://localhost:9876/student/setup', {
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


export let get_student_grade = () => {

    return new Promise((resolve, reject) => {

    
        axios.get('http://localhost:9876/student/grade', { })
        .then((result) => {
            resolve(result.data) 
        })
        .catch((err) => {
            reject(err)
        })

    })
}