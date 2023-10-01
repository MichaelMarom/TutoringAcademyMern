import axios from 'axios'


export let get_subject = () => {

    return new Promise((resolve, reject) => {

    
        axios.get('http://localhost:9876/tutor/subjects', {
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




export let upload_form_one = (fname,lname,mname,sname,email,pwd,cell,acadId,add1,add2,city,state,zipCode,country,timeZone,response_zone,intro, motivation,headline) => {
    return new Promise((resolve, reject) => {

        axios.post('http://localhost:9876/tutor/form-one', {
            fname,lname,mname,sname,email,pwd,cell,acadId,add1,add2,city,state,zipCode,country,timeZone,response_zone,intro, motivation,headline
        })
        .then((result) => {
            resolve(result.data)
        })
        .catch((err) => {
            reject(err)
        })           

    })
}


export let upload_form_two = (level,university1,university2,degree,certificate,language,state2,state3,state4,state5,state6,experience,graduagteYr1,graduagteYr2,graduagteYr3,expiration,otherang,workExperience,user_id) => {
    return new Promise((resolve, reject) => {

        axios.post('http://localhost:9876/tutor/form-two', {
            level,university1,university2,degree,certificate,language,state2,state3,state4,state5,state6,experience,graduagteYr1,graduagteYr2,graduagteYr3,expiration,otherang,workExperience,user_id
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

export let upload_form_four = (start_day,acct_name,acct_type,bank_name,acct,routing,ssh,accumulated_hrs,commission,total_earning,payment_option,AcademyId) => {
    return new Promise((resolve, reject) => {

        axios.post('http://localhost:9876/tutor/payment', {
            start_day,acct_name,acct_type,bank_name,acct,routing,ssh,accumulated_hrs,commission,total_earning,payment_option,AcademyId
        })
        .then((result) => {
            resolve(result.data)
        })
        .catch((err) => {
            reject(err)
        })           

    })
}
