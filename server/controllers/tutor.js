const { resolve } = require('path/posix');
const { marom_db, knex, connecteToDB } = require('../db');
const { shortId } = require('../modules');
const { insert, updateById, getAll } = require('../helperfunctions/crud_queries');



let post_new_subject = (req, res) => {


    let {faculty, subject, reason, AcademyId, facultyId } = req.body;

    let date = new Date();

    marom_db(async (config) => {
        const sql = require('mssql');
        console.log('uploading data...')

        var poolConnection = await sql.connect(config);
        if (poolConnection) {
            var resultSet = poolConnection.request().query(
                `
                    INSERT INTO "NewTutorSubject"(faculty, subject, date, AcademyId, reason, facultyID)
                    VALUES ('${faculty}', '${subject}', '${date}', '${AcademyId}', '${reason}', '${facultyId}')
                    `
            )

            resultSet.then((result) => {

                result.rowsAffected[0] === 1
                    ?
                    res.send({ bool: true, mssg: 'Data Was Successfully Saved' })
                    :
                    res.send({ bool: false, mssg: 'Data Was Not Successfully Saved' })

            })
                .catch((err) => {
                    console.log(err);
                    res.send({ bool: false, mssg: 'Data Was Not Successfully Saved' })
                })

        }

    })
}
let subjects = (req, res) => {
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        // console.log(poolConnection._connected)
        if (poolConnection) {
            var resultSet = await poolConnection.request().query(
                `
                    SELECT Id,FacultyId,SubjectName FROM Subjects
                `
            )

            res.send(resultSet)


        }

    })

}

let post_form_one = (req, res) => {

    let { fname, mname, sname, email, pwd, acadId, cell, add1, add2, city, state, zipCode, country, timeZone, response_zone, intro, motivation, headline, photo, video, grades } = req.body;

    let UserId = mname.length > 0 ? fname + '.' + ' ' + mname[0] + '.' + ' ' + sname[0] + shortId.generate() : fname + '.' + ' ' + sname[0] + shortId.generate();
    let screenName = mname.length > 0 ? fname + '.' + ' ' + mname[0] + '.' + ' ' + sname[0] : fname + '.' + ' ' + sname[0]
    console.log(grades)

    let action = cb => {
        marom_db(async (config) => {
            const sql = require('mssql');
            var poolConnection = await sql.connect(config);

            let result = poolConnection ? await get_action(poolConnection) : 'connection error';
            console.log(result)
            cb(result);

        })
    }

    action((result) => {

        if (result) {

            let db = marom_db(async (config) => {

                const sql = require('mssql');
                var poolConnection = await sql.connect(config);

                //let result = poolConnection ? await insert_rates(poolConnection) : 'connection error';

                insert_rates(poolConnection)
                    .then((result) => {
                        res.send({ user: UserId, screen_name: screenName, bool: true, mssg: 'Data Was Saved Successfully', type: 'save' })
                    })
                    .catch((err) => {
                        res.send({ user: UserId, screen_name: screenName, bool: false, mssg: 'Data Was Not Saved Successfully Due To Database Malfunction, Please Try Again.' })

                    })

            })

        } else {

            let db = marom_db(async (config) => {

                const sql = require('mssql');
                var poolConnection = await sql.connect(config);

                // let result = poolConnection ? await update_rates(poolConnection) : 'connection error';
                update_rates(poolConnection)
                    .then((result) => {
                        res.send({ user: UserId, screen_name: screenName, bool: true, mssg: 'Data Was Updated Successfully', type: 'update' })
                    })
                    .catch((err) => {
                        res.send({ user: UserId, screen_name: screenName, bool: false, mssg: 'Data Was Not Updated Successfully Due To Database Malfunction, Please Try Again.' })
                    })
                //res.send({user: UserId, screen_name: screenName, bool: true, mssg: 'Data Was Updated Successfully'})

            })

        }
    })







    let get_action = async (poolConnection) => {
        let records = await poolConnection.request().query(`SELECT * FROM "TutorSetup" WHERE CONVERT(VARCHAR, Email) = '${email}'`)
        let get_duplicate = await records.recordset;

        let result = get_duplicate.length > 0 ? false : true;
        return (result);
    }

    let insert_rates = async (poolConnection) => {
        let records = await poolConnection.request().query(`INSERT INTO TutorSetup(Photo, Video, FirstName, MiddleName, LastName, Address1, Address2, CityTown, StateProvince, ZipCode, Country, Email, CellPhone, GMT, ResponseHrs, TutorScreenname, HeadLine, Introduction, Motivate, Password, IdVerified, BackgroundVerified, AcademyId, Grades)
        VALUES ('${photo}', '${video}', '${fname}','${mname}','${sname}','${add1}','${add2}','${city}','${state}', '${zipCode}','${country}','${email}','${cell}','${timeZone}','${response_zone}','${screenName}','${headline}','${intro}','${motivation}','${pwd}','${null}','${null}', '${UserId}', '${grades}')`)

        let result = await records.rowsAffected[0] === 1 ? true : false
        //console.log(result, 'boolean...')
        return (result);
    }

    let update_rates = async (poolConnection) => {
        let records = await poolConnection.request().query(`UPDATE "TutorSetup" set Photo = '${photo}', Video = '${video}',  Grades = '${grades}', Address1 = '${add1}', Address2 = '${add2}', CityTown = '${city}', StateProvince = '${state}', ZipCode = '${zipCode}', Country = '${country}', Email = '${email}', CellPhone = '${cell}', GMT = '${timeZone}', ResponseHrs = '${response_zone}', TutorScreenname = '${screenName}', HeadLine = '${headline}', Introduction = '${intro}', Motivate = '${motivation}', Password = '${pwd}', IdVerified = '${null}', BackgroundVerified = '${null}' WHERE CONVERT(VARCHAR, AcademyId) = '${acadId}'`)

        let result = await records.rowsAffected[0] === 1 ? true : false
        return (result);
    }

}


let post_form_two = async (req, res) => {



    let { level, university1, university2, degree, certificate, language, state2, state3, state4, state5, state6, experience, graduagteYr1, graduagteYr2, graduagteYr3, expiration, otherang, workExperience, user_id } = req.body;


    let duplicate = await connecteToDB.then(async (poolConnection) => {
        return await poolConnection.request().query(`SELECT * From Education  WHERE CONVERT(VARCHAR, AcademyId) =  '${user_id}'`)
            .then((result) => {

                return result.recordset
            })
            .catch(err => console.log(err))
    });

    console.log(duplicate.length)
    if (duplicate.length === 0) {
        marom_db(async (config) => {
            const sql = require('mssql');
            console.log('uploading data...')

            var poolConnection = await sql.connect(config);
            if (poolConnection) {
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

            }

        })
    } else {
        marom_db(async (config) => {
            const sql = require('mssql');
            console.log('uploading data...')

            var poolConnection = await sql.connect(config);
            if (poolConnection) {
                var resultSet = poolConnection.request().query(
                    `
                        UPDATE  "Education" SET EducationalLevel = '${level}', EducationalLevelExperience = '${experience}', College1 = '${university1}', College1State = '${state2}', College1Year = '${graduagteYr1}', College2 ='${university2}', College2State = '${state3}', College2StateYear = '${graduagteYr2}', Degree = '${degree}', DegreeState ='${state4}', DegreeYear = '${graduagteYr3}', Certificate = '${certificate}', CertificateState = '${state5}', CertificateExpiration = '${expiration}', NativeLang = '${language}', NativeLangState = '${state6}', NativeLangOtherLang = '${otherang}', WorkExperience = '${workExperience}' WHERE CONVERT(VARCHAR, AcademyId) = '${user_id}'
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

            }

        })
    }
}

let post_form_three = (req, res) => {


    let { MutiStudentHourlyRate, MutiStudentOption, CancellationPolicy, FreeDemoLesson, ConsentRecordingLesson, ActivateSubscriptionOption, SubscriptionPlan, AcademyId } = req.body;

    marom_db(async (config) => {
        const sql = require('mssql');
        console.log('uploading data...')

        var poolConnection = await sql.connect(config);
        if (poolConnection) {
            var resultSet = poolConnection.request().query(
                `
                    INSERT INTO "TutorRates"(MutiStudentOption,MutiStudentHourlyRate,CancellationPolicy,FreeDemoLesson,ConsentRecordingLesson,ActivateSubscriptionOption,SubscriptionPlan,AcademyId)
                    VALUES ('${MutiStudentOption}', '${MutiStudentHourlyRate}', '${CancellationPolicy}','${FreeDemoLesson}','${ConsentRecordingLesson}','${ActivateSubscriptionOption}','${SubscriptionPlan}','${AcademyId}')
                    `
            )

            resultSet.then((result) => {

                result.rowsAffected[0] === 1
                    ?
                    res.send({ bool: true, mssg: 'Data Was Successfully Saved' })
                    :
                    res.send({ bool: false, mssg: 'Data Was Not Successfully Saved' })

            })
                .catch((err) => {
                    console.log(err);
                    res.send({ bool: false, mssg: 'Data Was Not Successfully Saved' })
                })

        }

    })
}


let get_countries = (req, res) => {
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        // console.log(poolConnection._connected)
        if (poolConnection) {
            var resultSet = await poolConnection.request().query(
                `
                    SELECT Country FROM Countries
                `
            )

            res.send(resultSet)


        }

    })

}

let get_state = (req, res) => {
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        // console.log(poolConnection._connected)
        if (poolConnection) {
            var resultSet = await poolConnection.request().query(
                `
                    SELECT * FROM States
                `
            )

            res.send(resultSet)


        }

    })
}



let get_gmt = (req, res) => {
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        // console.log(poolConnection._connected)
        if (poolConnection) {
            var resultSet = await poolConnection.request().query(
                `
                    SELECT * FROM GMT
                `
            )

            res.send(resultSet)


        }

    })
}


let get_experience = (req, res) => {
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        // console.log(poolConnection._connected)
        if (poolConnection) {
            var resultSet = await poolConnection.request().query(
                `
                    SELECT * FROM Experience
                `
            )

            res.send(resultSet)


        }

    })
}



let get_level = (req, res) => {
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        // console.log(poolConnection._connected)
        if (poolConnection) {
            var resultSet = await poolConnection.request().query(
                `
                    SELECT * FROM EducationalLevel
                `
            )

            res.send(resultSet)


        }

    })
}


let get_degree = (req, res) => {
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        // console.log(poolConnection._connected)
        if (poolConnection) {
            var resultSet = await poolConnection.request().query(
                `
                    SELECT * FROM Degree
                `
            )

            res.send(resultSet)


        }

    })
}


let get_certificates = (req, res) => {
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        // console.log(poolConnection._connected)
        if (poolConnection) {
            var resultSet = await poolConnection.request().query(
                `
                    SELECT * FROM CertificateTypes
                `
            )

            res.send(resultSet)


        }

    })
}

let get_response = (req, res) => {
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        // console.log(poolConnection._connected)
        if (poolConnection) {
            var resultSet = await poolConnection.request().query(
                `
                    SELECT * FROM ResponseTime
                `
            )

            res.send(resultSet)


        }

    })
}

let get_user_data = (req, res) => {
    let { user_id } = req.query;
    console.log(user_id)
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        // console.log(poolConnection._connected)
        if (poolConnection) {
            poolConnection.request().query(
                `
                    SELECT EducationalLevel, EducationalLevelExperience, Certificate, CertificateState, CertificateExpiration, AcademyId  From Education  WHERE CONVERT(VARCHAR, AcademyId) = '${user_id}'
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

let upload_tutor_rates = (req, res) => {

    try {
        let { rate_list, AcademyId } = req.body;

        let book = []

        let data = rate_list.map(async (item, index) => {

            let action = async cb => {
                await marom_db(async (config) => {
                    const sql = require('mssql');
                    var poolConnection = await sql.connect(config);

                    let result = poolConnection ? await get_action(poolConnection, item) : 'connection error';
                    cb(result, index);

                })
            }


            let response = action(async (result, index) => {

                console.log(result, index)
                if (result) {

                    try {
                        await marom_db(async (config) => {
                            const sql = require('mssql');
                            var poolConnection = await sql.connect(config);

                            let result = poolConnection ? await insert_rates(poolConnection, item) : 'connection error';

                            console.log('insert:', result);
                            book.push(result)
                            console.log(book.length, rate_list.length)
                            if (book.length > (rate_list.length / 2)) {
                                console.log('rates: ', true)

                                res.status(200).send(true)
                            }
                        })
                    } catch (error) {
                        console.log(error)
                    }

                } else {

                    try {
                        await marom_db(async (config) => {
                            const sql = require('mssql');
                            var poolConnection = await sql.connect(config);

                            let result = poolConnection ? await update_rates(poolConnection, item) : 'connection error';

                            console.log('update:', result);
                            book.push(result)
                            console.log(book.length, rate_list.length)
                            if (book.length > (rate_list.length / 2)) {
                                console.log('rates: ', true)

                                res.status(200).send(true)
                            }
                        })
                    } catch (error) {
                        console.log(error)
                    }


                }
            })

        })

        let get_action = async (poolConnection, item) => {
            let records = await poolConnection.request().query(`SELECT * FROM "SubjectRates"`)
            let get_duplicate = await records.recordset.filter(file => file.subject === item.course && file.AcademyId === AcademyId);

            let result = get_duplicate.length > 0 ? false : true;
            return (result);
        }

        let insert_rates = async (poolConnection, item) => {
            let records = await poolConnection.request().query(`INSERT INTO "SubjectRates"(faculty, subject, rate, AcademyId) VALUES('${item.faculty}','${item.course}','${item.rate}','${AcademyId}') `)

            let result = await records.rowsAffected[0] === 1 ? true : false

            return (result);
        }

        let update_rates = async (poolConnection, item) => {
            let records = await poolConnection.request().query(`UPDATE "SubjectRates" set faculty='${item.faculty}', subject='${item.course}', rate='${item.rate}'  WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}' AND CONVERT(VARCHAR, subject) = '${item.course}' `)

            //console.log('records :',records)
            let result = await records.rowsAffected[0] === 1 ? true : false
            return (result);

        }

    } catch (err) {
        console.log('Error message', err)
    }

}

let upload_form_four = (req, res) => {

    let { start_day, acct_name, acct_type, bank_name, acct, routing, ssh, accumulated_hrs, commission, total_earning, payment_option, AcademyId } = req.body;

    let checker = (cb) => {

        marom_db(async (config) => {
            const sql = require('mssql');
            var poolConnection = await sql.connect(config);
            let response = poolConnection ? await poolConnection.request().query(`SELECT * FROM "TutorBank" WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}'`) : 'err conneecting to db'

            cb(response.rowsAffected[0])
        })

    }

    checker((data) => {
        if (data < 1) {

            let db = marom_db(async (config) => {
                const sql = require('mssql');
                var poolConnection = await sql.connect(config);

                let result = poolConnection ? await insert_bank_details(poolConnection) : 'connection error';

                console.log('insert:', result);

                if (result) {
                    res.send(true)
                } else {
                    res.send(false)
                }
            })

        } else {
            let db = marom_db(async (config) => {
                const sql = require('mssql');
                var poolConnection = await sql.connect(config);

                let result = poolConnection ? await update_bank_details(poolConnection) : 'connection error';

                console.log('update:', result);

                if (result) {
                    res.send(true)
                } else {
                    res.send(false)
                }
            })
        }
    })

    let insert_bank_details = async (poolConnection) => {
        let records = await poolConnection.request().query(`INSERT INTO "TutorBank"(AccountName,AccountType,BankName,Account,Routing,SSH,AccumulatedHrs,Commission,TotalEarning,PaymentOption,TutorStartDay,AcademyId)
        VALUES ('${acct_name}', '${acct_type}','${bank_name}','${acct}','${routing}','${ssh}','${accumulated_hrs}','${commission}', '${total_earning}','${payment_option}', '${start_day}', '${AcademyId}')`)

        let result = await records.rowsAffected[0] === 1 ? true : false
        return (result);
    }

    let update_bank_details = async (poolConnection) => {
        let records = await poolConnection.request().query(
            `
                UPDATE "TutorBank" set AccountName = '${acct_name}', AccountType = '${acct_type}', BankName = '${bank_name}', Account = '${acct}', Routing = '${routing}', SSH = '${ssh}', AccumulatedHrs = '${accumulated_hrs}', Commission = '${commission}', TotalEarning = '${total_earning}', PaymentOption = '${payment_option}'  WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}'
            `
        )

        //console.log('records :',records)
        let result = await records.rowsAffected[0] === 1 ? true : false
        return (result);

    }

}

let get_my_data = async (req, res) => {
    let { AcademyId } = req.query;
    let books = []

    console.log(AcademyId)

    let response_0 = (resolve) => {
        marom_db(async (config) => {
            const sql = require('mssql');
            var poolConnection = await sql.connect(config);

            poolConnection.request().query(`SELECT * from TutorSetup WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}' `)
                .then((result) => {
                    books.push(result.recordsets);
                    resolve()
                })
                .catch((err) => err);
        })
    }

    let response_1 = (resolve) => {
        marom_db(async (config) => {
            const sql = require('mssql');
            var poolConnection = await sql.connect(config);

            poolConnection.request().query(`SELECT * from Education WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}' `)
                .then((result) => {
                    books.push(result.recordsets);
                    resolve()
                })
                .catch((err) => err);
        })
    }

    let response_2 = (cb) => {
        marom_db(async (config) => {
            const sql = require('mssql');
            var poolConnection = await sql.connect(config);

            poolConnection.request().query(`SELECT * from TutorRates WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}' `)
                .then((result) => {
                    books.push(result.recordsets);
                    cb()
                })
                .catch((err) => err);
        })
    }


    let sender = (cb) => {
        //response_0(cb)

        new Promise((resolve) => {
            response_1(resolve)
        })
            .then(() => {
                response_2(cb)
            })
            .catch(err => console.log(err))
    }

    sender(() => {
        new Promise((resolve) => {
            response_0(resolve)
        })

            .catch(err => console.log(err))
            .finally(() => {
                res.send(books)
            })
    })








    //console.log(response_0, response_1);
}


let get_rates = (req, res) => {
    let { AcademyId } = req.query;
    console.log(AcademyId)
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        // console.log(poolConnection._connected)
        if (poolConnection) {
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

let get_tutor_rates = (req, res) => {
    let { AcademyId } = req.query;
    console.log(AcademyId)
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        // console.log(poolConnection._connected)
        if (poolConnection) {
            poolConnection.request().query(
                `
                    SELECT * From TutorRates WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}' 
                `
            )
                .then((result) => {
                    console.log(result.recordset)
                    res.status(200).send(result.recordset)
                    //result.recordset.map(item => item.AcademyId === user_id ? item : null)
                })
                .catch(err => console.log(err))

        }

    })
}

let faculties = (req,res) => {
    marom_db(async(config) => {
        const sql = require('mssql');
    
        var poolConnection = await sql.connect(config);
       // console.log(poolConnection._connected)
        if(poolConnection){
            poolConnection.request().query(
                `
                    SELECT * From Faculty  
                `
            )
            .then((result) => {
                console.log(result.recordset)
                res.status(200).send(result.recordset)
                //result.recordset.map(item => item.AcademyId === user_id ? item : null)
            })
            .catch(err => console.log(err))

        }
    
    })
}

let get_bank_details = (req,res) => {
    let {AcademyId} = req.query;
    console.log(AcademyId)
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        // console.log(poolConnection._connected)
        if (poolConnection) {
            poolConnection.request().query(
                `
                    SELECT * From TutorBank WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}' 
                `
            )
                .then((result) => {
                    console.log(result.recordset)
                    res.status(200).send(result.recordset)
                    //result.recordset.map(item => item.AcademyId === user_id ? item : null)
                })
                .catch(err => console.log(err))

        }

    })
}


let get_tutor_setup = (req, res) => {
    let { AcademyId } = req.query;
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        if (poolConnection) {
            poolConnection.request().query(
                `
                    SELECT * From TutorSetup WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}' 
                `
            )
                .then((result) => {
                    res.status(200).send(result.recordset)
                })
                .catch(err => console.log(err))

        }

    })
}

let get_my_edu = (req, res) => {
    let { AcademyId } = req.query;
    console.log(AcademyId)
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        // console.log(poolConnection._connected)
        if (poolConnection) {
            poolConnection.request().query(
                `
                    SELECT * From Education WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}' 
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

//related to booking slot and student section
let storeEvents = (req, res) => {
    try {
        const { end, start, title } = req.body;

        marom_db(async (config) => {
            const sql = require('mssql');

            var poolConnection = await sql.connect(config);
            if (poolConnection) {
                console.log('poolconneciotn');
                poolConnection.request().query(
                    `
                   INSERT INTO EVENTS (endTime, startTime, title) VALUES ('${end}','${start}', '${title}')
                `
                )
                    .then((result) => {
                        res.status(200).send(result);
                    })
                    .catch(err => console.log(err, 'ERR!23'))
            }

        })
    } catch (error) {
        console.error("Error storing event:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

let storeCalenderTutorRecord = (req, res) => {
    const { id } = req.params;
    try {
        marom_db(async (config) => {
            const sql = require('mssql');

            var poolConnection = await sql.connect(config);
            if (poolConnection) {
                poolConnection.request().query(
                    updateById(id, 'TutorSetup', req.body)
                )
                    .then((result) => {
                        res.status(200).send(result.recordset);
                    })
                    .catch(err => console.log(err))
            }
        })
    } catch (error) {
        console.error("Error Updating TutorSetup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

let get_tutor_status = (req, res) => {
    let { AcademyId } = req.query;
    console.log(AcademyId)
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        // console.log(poolConnection._connected)
        if (poolConnection) {
            poolConnection.request().query(
                `
                    SELECT Status From TutorSetup WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}' 
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



let fetchEvents = (req, res) => {
    try {
        marom_db(async (config) => {
            const sql = require('mssql');

            var poolConnection = await sql.connect(config);
            if (poolConnection) {
                console.log('poolconneciotn');
                poolConnection.request().query(
                    `
                 SELECT * FROM Events
                `
                )
                    .then((result) => {
                        console.log(result, 'fetch result')
                        res.status(200).send(result.recordset);
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(400).json({ message: err.message });
                    })
            }
        })
    } catch (error) {
        console.error("Error storing dates:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    subjects,
    faculties,
    post_form_one,
    post_form_two,
    post_form_three,
    get_countries,
    get_gmt,
    post_new_subject,
    get_state,
    get_experience,
    get_degree,
    get_level,
    get_certificates,
    get_user_data,
    get_response,
    upload_tutor_rates,
    get_my_data,
    get_my_edu,
    get_rates,
    upload_form_four,
    get_tutor_setup,
    get_tutor_rates,
    get_bank_details,
    storeEvents,
    fetchEvents,
    storeCalenderTutorRecord,
    get_tutor_status
}
