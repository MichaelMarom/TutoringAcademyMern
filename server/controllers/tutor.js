const { marom_db, knex } = require('../db');
const { shortId } = require('../modules');


let subjects = (req,res) => {
    marom_db(async(config) => {
        const sql = require('mssql');
    
        var poolConnection = await sql.connect(config);
       // console.log(poolConnection._connected)
        if(poolConnection){
            var resultSet = await poolConnection.request().query(
                `
                    SELECT Id,FacultyId,SubjectName FROM Subjects
                `
            )

            res.send(resultSet)    
      
           
        }
    
    })

}

let post_form_one = (req,res) => {
    
    let {fname,uname,mname,sname,email,pwd,cell,acadId,add1,add2,city,state,zipCode,country,timeZone,response_zone,intro, motivation,headline} = req.body;

    let UserId = fname + '.' + mname[mname.length - 1] + '.' + sname[0] + shortId.generate();
    console.log(UserId)
    marom_db(async(config) => {
        const sql = require('mssql');
        console.log('uploading data...')
    
        var poolConnection = await sql.connect(config);
        if(poolConnection){
            var resultSet = poolConnection.request().query(
                `
                    INSERT INTO TutorSetup(Photo, Video, FirstName, MiddleName, LastName, Address1, Address2, CityTown, StateProvince, ZipCode, Country, Email, CellPhone, GMT, ResponseHrs, TutorScreenname, HeadLine, Introduction, Motivate, Password, IdVerified, BackgroundVerified, AcademyId)
                    VALUES ('${null}', '${null}', '${fname}','${mname}','${sname}','${add1}','${add2}','${city}','${state}', '${zipCode}','${country}','${email}','${cell}','${timeZone}','${response_zone}','${uname}','${headline}','${intro}','${motivation}','${pwd}','${null}','${null}', '${UserId}')
                    `
            ) 

            resultSet.then((result) => {
                
                result.rowsAffected[0] === 1 
                ? 
                res.send({bool: true, user: UserId})
                :
                res.send(false)
               
            })
            .catch((err) => {
                console.log(err);
                res.send(false)
            })

            //res.send(resultSet)    
      
           
        }
    
    })
} 




let post_form_two = (req,res) => {

    
    
    let {level,university1,university2,degree,certificate,language,state2,state3,state4,state5,state6,experience,graduagteYr1,graduagteYr2,graduagteYr3,expiration,otherang,workExperience,user_id} = req.body;

    marom_db(async(config) => {
        const sql = require('mssql');
        console.log('uploading data...')
    
        var poolConnection = await sql.connect(config);
        if(poolConnection){
            var resultSet = poolConnection.request().query(
                `
                    INSERT INTO "Education"(EducationalLevel, EducationalLevelExperience, College1, College1State, College1Year, College2, College2State, College2StateYear, Degree, DegreeState, DegreeYear, Certificate, CertificateState, CertificateExpiration, NativeLang, NativeLangState, NativeLangOtherLang, WorkExperience, AcademyId)
                    VALUES ('${level}', '${experience}', '${university1}','${state2}','${graduagteYr1}','${university2}','${state3}','${graduagteYr2}','${degree}', '${state4}','${graduagteYr3}','${certificate}','${state5}','${expiration}','${language}','${state6}','${otherang}','${workExperience}', '${user_id}')
                    `
            ) 

            resultSet.then((result) => {
                
                result.rowsAffected[0] === 1 
                ? 
                res.send(true)
                :
                res.send(false)
               
            })
            .catch((err) => {
                console.log(err);
                res.send(false)
            })

            //res.send(resultSet)    
      
           
        }
    
    })
} 

let get_countries = (req,res) => {
    marom_db(async(config) => {
        const sql = require('mssql');
    
        var poolConnection = await sql.connect(config);
       // console.log(poolConnection._connected)
        if(poolConnection){
            var resultSet = await poolConnection.request().query(
                `
                    SELECT Country FROM Countries
                `
            )

            res.send(resultSet)    
      
           
        }
    
    })

}

let get_state =(req,res) => {
    marom_db(async(config) => {
        const sql = require('mssql');
    
        var poolConnection = await sql.connect(config);
       // console.log(poolConnection._connected)
        if(poolConnection){
            var resultSet = await poolConnection.request().query(
                `
                    SELECT * FROM States
                `
            )

            res.send(resultSet)    
      
           
        }
    
    })
}



let get_gmt =(req,res) => {
    marom_db(async(config) => {
        const sql = require('mssql');
    
        var poolConnection = await sql.connect(config);
       // console.log(poolConnection._connected)
        if(poolConnection){
            var resultSet = await poolConnection.request().query(
                `
                    SELECT * FROM GMT
                `
            )

            res.send(resultSet)    
      
           
        }
    
    })
}


let get_experience =(req,res) => {
    marom_db(async(config) => {
        const sql = require('mssql');
    
        var poolConnection = await sql.connect(config);
       // console.log(poolConnection._connected)
        if(poolConnection){
            var resultSet = await poolConnection.request().query(
                `
                    SELECT * FROM Experience
                `
            )

            res.send(resultSet)    
      
           
        }
    
    })
}



let get_level =(req,res) => {
    marom_db(async(config) => {
        const sql = require('mssql');
    
        var poolConnection = await sql.connect(config);
       // console.log(poolConnection._connected)
        if(poolConnection){
            var resultSet = await poolConnection.request().query(
                `
                    SELECT * FROM EducationalLevel
                `
            )

            res.send(resultSet)    
      
           
        }
    
    })
}


let get_degree =(req,res) => {
    marom_db(async(config) => {
        const sql = require('mssql');
    
        var poolConnection = await sql.connect(config);
       // console.log(poolConnection._connected)
        if(poolConnection){
            var resultSet = await poolConnection.request().query(
                `
                    SELECT * FROM Degree
                `
            )

            res.send(resultSet)    
      
           
        }
    
    })
}


let get_certificates =(req,res) => {
    marom_db(async(config) => {
        const sql = require('mssql');
    
        var poolConnection = await sql.connect(config);
       // console.log(poolConnection._connected)
        if(poolConnection){
            var resultSet = await poolConnection.request().query(
                `
                    SELECT * FROM CertificateTypes
                `
            )

            res.send(resultSet)    
      
           
        }
    
    })
}

let get_response = (req,res) => {
    marom_db(async(config) => {
        const sql = require('mssql');
    
        var poolConnection = await sql.connect(config);
       // console.log(poolConnection._connected)
        if(poolConnection){
            var resultSet = await poolConnection.request().query(
                `
                    SELECT * FROM ResponseTime
                `
            )

            res.send(resultSet)    
      
           
        }
    
    })
}

let get_user_data   = (req,res) => {
    let {user_id} = req.query;
    console.log(user_id)
    marom_db(async(config) => {
        const sql = require('mssql');
    
        var poolConnection = await sql.connect(config);
       // console.log(poolConnection._connected)
        if(poolConnection){
            poolConnection.request().query(
                `
                    SELECT EducationalLevel, EducationalLevelExperience, Certificate, CertificateState, CertificateExpiration, AcademyId  From Education
                `
            )
            .then((result) => {
                res.status(200).send(result.recordset.map(item => item.AcademyId === user_id ? item : null))
                //result.recordset.map(item => item.AcademyId === user_id ? item : null)
            })
            .catch(err => console.log(err))

        }
    
    })
}

let upload_tutor_rates = (req, res) => {
    let  {rate_list, AcademyId} = req.body;

    let book = []

    let data = rate_list.map(async(item) => {

        let action = cb => {
            marom_db(async(config) => {
                const sql = require('mssql');
                var poolConnection = await sql.connect(config);

                let result = poolConnection ? await get_action(poolConnection) : 'connection error';
                cb(result);

            })
        }

        let response = action((result) => {
            if(result){

                let db = marom_db(async(config) => {
                    const sql = require('mssql');
                    var poolConnection = await sql.connect(config);
    
                    let result = poolConnection ? await insert_rates(poolConnection) : 'connection error';
                    
                    console.log('insert:', result);
                    book.push(result)
                    if(book.length === rate_list.length){
                        res.send(true)
                    }
                })
                
            }else{

                let db = marom_db(async(config) => {
                    const sql = require('mssql');
                    var poolConnection = await sql.connect(config);
    
                    let result = poolConnection ? await update_rates(poolConnection) : 'connection error';

                    console.log('update:', result);
                    book.push(result)
                    if(book.length === rate_list.length){
                        res.send(true)
                    }
                })

            }
        })

        let get_action = async(poolConnection) => {
            let records = await poolConnection.request().query(`SELECT * FROM "SubjectRates"`)
            let get_duplicate = await records.recordset.filter(file => file.subject === item.course && file.AcademyId === AcademyId);

            let result = get_duplicate.length > 0 ? false : true;
            return(result);
        }

        let insert_rates = async(poolConnection) => {
            let records = await poolConnection.request().query(`INSERT INTO "SubjectRates"(faculty, subject, rate, AcademyId) VALUES('${item.faculty}','${item.course}','${item.rate}','${AcademyId}')`)

            let result =  await records.rowsAffected[0] === 1 ? true : false
            return(result);
        }

        let update_rates = async(poolConnection) => {
            let records = await poolConnection.request().query(`UPDATE "SubjectRates" set faculty='${item.faculty}', subject='${item.course}', rate='${item.rate}'  WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}' AND CONVERT(VARCHAR, subject) = '${item.course}' `)

            //console.log('records :',records)
            let result =  await records.rowsAffected[0] === 1 ? true : false
            return(result);
          
        }


        

    })

}

let upload_form_four = (req, res) => {

    let {start_day,acct_name,acct_type,bank_name,acct,routing,ssh,accumulated_hrs,commission,total_earning,payment_option,AcademyId} = req.body;

    let checker = (cb) => {

        marom_db(async(config) => {
            const sql = require('mssql');
            var poolConnection = await sql.connect(config);
            let response = poolConnection ? await poolConnection.request().query(`SELECT * FROM "TutorBank" WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}'`) : 'err conneecting to db'

            cb(response.rowsAffected[0])
        })

    }

    checker((data) => {
        if(data < 1){

            let db = marom_db(async(config) => {
                const sql = require('mssql');
                var poolConnection = await sql.connect(config);

                let result = poolConnection ? await insert_bank_details(poolConnection) : 'connection error';
                
                console.log('insert:', result);
                
                if(result){
                    res.send(true)
                }else{
                    res.send(false)
                }
            })
            
        }else{
            let db = marom_db(async(config) => {
                const sql = require('mssql');
                var poolConnection = await sql.connect(config);

                let result = poolConnection ? await update_bank_details(poolConnection) : 'connection error';

                console.log('update:', result);
                
                if(result){
                    res.send(true)
                }else{
                    res.send(false)
                }
            })
        }
    })

    let insert_bank_details = async(poolConnection) => {
        let records = await poolConnection.request().query(`INSERT INTO "TutorBank"(AccountName,AccountType,BankName,Account,Routing,SSH,AccumulatedHrs,Commission,TotalEarning,PaymentOption,TutorStartDay,AcademyId)
        VALUES ('${acct_name}', '${acct_type}','${bank_name}','${acct}','${routing}','${ssh}','${accumulated_hrs}','${commission}', '${total_earning}','${payment_option}', '${start_day}', '${AcademyId}')`)

        let result =  await records.rowsAffected[0] === 1 ? true : false
        return(result);
    }

    let update_bank_details = async(poolConnection) => {
        let records = await poolConnection.request().query(
            `
                UPDATE "TutorBank" set AccountName = '${acct_name}', AccountType = '${acct_type}', BankName = '${bank_name}', Account = '${acct}', Routing = '${routing}', SSH = '${ssh}', AccumulatedHrs = '${accumulated_hrs}', Commission = '${commission}', TotalEarning = '${total_earning}', PaymentOption = '${payment_option}'  WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}'
            `
        )

        //console.log('records :',records)
        let result =  await records.rowsAffected[0] === 1 ? true : false
        return(result);
      
    }

}

let get_my_data   = async(req,res) => {
    let {AcademyId} = req.query;
    let books = []

    console.log(AcademyId)
    
    let response_0 = () => {
        marom_db(async(config) => {
            const sql = require('mssql');
            var poolConnection = await sql.connect(config);

            poolConnection.request().query(`SELECT * from TutorSetup WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}' `)
            .then((result) => {
                books.push(result);
                if(books.length === 2){
                    res.send(books)
                }
            })
            .catch((err) => err);
        })
    }

    let response_1 = () => { 
        marom_db(async(config) => {
            const sql = require('mssql');
            var poolConnection = await sql.connect(config);

            poolConnection.request().query(`SELECT * from Education WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}' `)
            .then((result) => {
                books.push(result);
                if(books.length === 2){
                    res.send(books)
                }
            })
            .catch((err) => err);
        })
    }

    response_0()
    response_1()


    //console.log(response_0, response_1);
}


let get_rates = (req,res) => {
    let {AcademyId} = req.query;
    console.log(AcademyId)
    marom_db(async(config) => {
        const sql = require('mssql');
    
        var poolConnection = await sql.connect(config);
       // console.log(poolConnection._connected)
        if(poolConnection){
            poolConnection.request().query(
                `
                    SELECT * From SubjectRates WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}' 
                `
            )
            .then((result) => {
                res.status(200).send(result.recordset)
                //result.recordset.map(item => item.AcademyId === user_id ? item : null)
            })
            .catch(err => console.log(err))

        }
    
    })
}

module.exports = {
    subjects,
    post_form_one,
    post_form_two,
    get_countries,
    get_gmt,
    get_state,
    get_experience,
    get_degree,
    get_level,
    get_certificates,
    get_user_data,
    get_response,
    upload_tutor_rates,
    get_my_data,
    get_rates,
    upload_form_four
}
