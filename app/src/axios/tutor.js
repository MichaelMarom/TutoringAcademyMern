import axios from "axios";

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




export let upload_form_one = (fname,uname,mname,sname,email,pwd,cell,acadId,add1,add2,city,state,zipCode,country,timeZone,response_zone,intro, motivation,headline,photo,video,grades) => {
    return new Promise((resolve, reject) => {

        axios.post('http://localhost:9876/tutor/form-one', {
            fname,uname,mname,sname,email,pwd,cell,acadId,add1,add2,city,state,zipCode,country,timeZone,response_zone,intro, motivation,headline,photo,video,grades
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

export let upload_form_three = (MutiStudentHourlyRate,MutiStudentOption,CancellationPolicy,FreeDemoLesson,ConsentRecordingLesson,ActivateSubscriptionOption,SubscriptionPlan,AcademyId) => {
    return new Promise((resolve, reject) => {

        axios.post('http://localhost:9876/tutor/form-three', {
            MutiStudentHourlyRate,MutiStudentOption,CancellationPolicy,FreeDemoLesson,ConsentRecordingLesson,ActivateSubscriptionOption,SubscriptionPlan,AcademyId
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

export const storeEventAPI = async (eventDetails) => {
  try {
    console.log(eventDetails,'dataformat');
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

export const fetchEvents = async () => {
    try {
      const response = await instance.get("api/events/list");
      console.log(response);
      return response.data;
    } catch (error) {
      console.error("Error:", error);
   }
  };

export const addDisabledDates = async (date) => {
    try {
      const response = await instance.post("/api/store-disabled-dates", date);
      return response.data;
    } catch (error) {
      console.error("Error:", error);
   }
  };
