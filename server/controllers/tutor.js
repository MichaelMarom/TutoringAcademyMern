const { resolve } = require('path/posix');
const { marom_db, knex, connecteToDB } = require('../db');
const { shortId } = require('../modules');
const moment = require('moment-timezone');
const { insert, updateById, getAll, find, findByAnyIdColumn, update, parameteriedUpdateQuery, parameterizedInsertQuery } = require('../helperfunctions/crud_queries');

const multer = require('multer');
const path = require('path');
const sql = require('mssql');
const COMMISSION_DATA = require('../constants/tutor');


let post_new_subject = (req, res) => {


    let { faculty, subject, reason, AcademyId, facultyId } = req.body;

    let date = new Date();

    marom_db(async (config) => {
        const sql = require('mssql');

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

    let { id } = req.query;
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        if (poolConnection) {
            var resultSet = await poolConnection.request().query(
                `
                    SELECT Id,FacultyId,SubjectName FROM Subjects WHERE CONVERT(VARCHAR, FacultyId) =  '${id}'
                `
            )

            res.send(resultSet)

        }

    })

}

const subject_already_exist = async (req, res) => {
    marom_db(async (config) => {
        try {
            const sql = require('mssql');
            const poolConnection = await sql.connect(config);

            if (poolConnection) {
                const result = await poolConnection.request().query(
                    // find('NewTutorSubject', req.params, 'And', { subject: 'varchar' })
                    `SELECT *
                    FROM NewTutorSubject
                    WHERE LOWER(cast(subject as varchar)) = LOWER('${req.params.subject}');`
                );

                if (result.recordset.length) {
                    return res.status(200).send({ message: "request exist", faculties: result.recordset.map(subject => subject.faculty) })

                } else {
                    const result = await poolConnection.request().query(
                        // find('Subjects', { SubjectName: req.params.subject }, 'AND', { SubjectName: 'varchar' })
                        `SELECT *
                        FROM Subjects as s join Faculty as f on
                        s.FacultyId = f.id
                        WHERE LOWER(cast(SubjectName as varchar)) = LOWER('${req.params.subject}');`
                    );
                    console.log(result.recordset)
                    if (result.recordset.length) {
                        return res.status(200).send({ message: "subject exist", faculties: result.recordset.map(subject => subject.Faculty) })
                    }
                    else {
                        res.status(200).send({ subjectExist: false, faculties:[] })
                    }
                }
            }
        } catch (err) {
            console.log(err);
            res.status(400).send({ message: err.message });
        }
    })
}

let post_form_one = (req, res) => {

    let { fname, mname, sname, email, pwd, acadId, cell, add1, add2, city, state, zipCode,
        country, timeZone, response_zone, intro, motivation, headline, photo, video, grades, userId } = req.body;

    let UserId = mname.length > 0 ? fname + '.' + ' ' + mname[0] + '.' + ' ' + sname[0] + shortId.generate() : fname + '.' + ' ' + sname[0] + shortId.generate();
    let screenName = mname.length > 0 ? fname + '.' + ' ' + mname[0] + '.' + ' ' + sname[0] : fname + '.' + ' ' + sname[0]

    let action = cb => {
        marom_db(async (config) => {
            const sql = require('mssql');
            var poolConnection = await sql.connect(config);

            let result = poolConnection ? await get_action(poolConnection) : 'connection error';
            cb(result);

        })
    }

    action((result) => {

        if (result) {

            let db = marom_db(async (config) => {

                const sql = require('mssql');
                var poolConnection = await sql.connect(config);


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
        const dataObject = {
            Photo: photo || null,
            Video: video || null,
            FirstName: fname || null,
            MiddleName: mname || null,
            LastName: sname || null,
            Address1: add1 || null,
            Address2: add2 || null,
            CityTown: city || null,
            StateProvince: state || null,
            ZipCode: zipCode || null,
            Country: country || null,
            Email: email || null,
            CellPhone: cell || null,
            GMT: timeZone || null,
            ResponseHrs: response_zone || null,
            TutorScreenname: screenName || null,
            HeadLine: headline || null,
            Introduction: intro || null,
            Motivate: motivation || null,
            IdVerified: null || null,
            BackgroundVerified: null || null,
            AcademyId: UserId || null,
            Status: 'Pending' || null,
            Grades: grades || null,
            userId
        };
        let records = await poolConnection.request().query(
            insert('TutorSetup', dataObject)
        )

        let result = await records.rowsAffected[0] === 1 ? true : false
        return (result);
    }

    let update_rates = async (poolConnection) => {
        let records = await poolConnection.request().query(`UPDATE "TutorSetup" set Photo = '${photo}', Video = '${video}',  Grades = '${grades}', Address1 = '${add1}', Address2 = '${add2}', CityTown = '${city}', StateProvince = '${state}', ZipCode = '${zipCode}', Country = '${country}', Email = '${email}', CellPhone = '${cell}', GMT = '${timeZone}', ResponseHrs = '${response_zone}', TutorScreenname = '${screenName}', HeadLine = '${headline}', Introduction = '${intro}', Motivate = '${motivation}', Password = '${pwd}', IdVerified = '${null}', BackgroundVerified = '${null}' WHERE CONVERT(VARCHAR, AcademyId) = '${acadId}'`)

        let result = await records.rowsAffected[0] === 1 ? true : false
        return (result);
    }

}

let post_edu_form = async (req, res) => {

    let { level, university1, university2, university3, degree, degreeFile, certificate, certificateFile,
        language, state2, state3, state4, state5, state6, doctorateState, experience, graduagteYr1, graduagteYr2,
        graduagteYr3, doctorateGraduateYear, expiration, otherang, workExperience, user_id, countryForDeg,
        countryForMast,
        countryForCert,
        countryForDoc,
        countryForAssociate, resume, cert_file_name, deg_file_name, references } = req.body;


    let duplicate = await connecteToDB.then(async (poolConnection) => {
        return await poolConnection.request().query(`SELECT * From Education 
         WHERE CONVERT(VARCHAR, AcademyId) =  '${user_id}'`)
            .then((result) => {
                return result.recordset
            })
            .catch(err => console.log(err))
    });

    if (!duplicate.length) {
        marom_db(async (config) => {
            const sql = require('mssql');

            var poolConnection = await sql.connect(config);
            const request = poolConnection.request();
            request.input('WorkExperience', sql.NVarChar(sql.MAX), workExperience);
            request.input('ThingsReferences', sql.NVarChar(sql.MAX), references);

            if (poolConnection) {

                var resultSet = request.query(
                    ` INSERT INTO "Education" (EducationalLevel, EducationalLevelExperience, College1, 
                            College1State, College1Year, College2, College2State, College2StateYear, 
                            DoctorateCollege, DoctorateState, DoctorateGradYr, Degree,DegreeFile, DegreeState, 
                            DegreeYear, Certificate,CertificateFile, CertificateState, CertificateExpiration, 
                            NativeLang, NativeLangState, NativeLangOtherLang, WorkExperience, AcademyId,DegCountry,
                            MastCountry,CertCountry, DocCountry, BachCountry,Resume,CertFileName, 
                            DegFileName, ThingsReferences)
                        VALUES ('${level}', '${experience}', '${university1}',
                        '${state2}','${graduagteYr1}','${university2}','${state3}','${graduagteYr2}',
                        '${university3}','${doctorateState}','${doctorateState}','${degree}', '${degreeFile}','${state4}',
                        '${graduagteYr3}','${certificate}','${certificateFile}','${state5}','${expiration}',
                        '${language}','${state6}','${otherang}',@WorkExperience, '${user_id}',
                        '${countryForDeg}','${countryForMast}',
                        '${countryForCert}','${countryForDoc}','${countryForAssociate}','${resume}', 
                        '${cert_file_name}','${deg_file_name}', @ThingsReferences) `
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
            const request = poolConnection.request();
            request.input('WorkExperience', sql.NVarChar(sql.MAX), workExperience);
            request.input('ThingsReferences', sql.NVarChar(sql.MAX), references);

            if (poolConnection) {
                var resultSet = request.query(
                    `
                        UPDATE  "Education" SET EducationalLevel = '${level}', EducationalLevelExperience = '${experience}',
                         College1 = '${university1}', DoctorateCollege = '${university3}',DoctorateState = '${doctorateState}', 
                         DoctorateGradYr='${doctorateGraduateYear}',
                        College1State = '${state2}', College1Year = '${graduagteYr1}', College2 ='${university2}',
                         College2State = '${state3}', College2StateYear = '${graduagteYr2}', Degree = '${degree}',
                         DegreeState ='${state4}', DegreeYear = '${graduagteYr3}', Certificate = '${certificate}',
                          CertificateState = '${state5}', CertificateExpiration = '${expiration}', NativeLang = '${language}', 
                          NativeLangState = '${state6}', NativeLangOtherLang = '${otherang}', WorkExperience = @WorkExperience,
                          CertificateFile = '${certificateFile}', DegreeFile='${degreeFile}',DegCountry='${countryForDeg}',
                         MastCountry= '${countryForMast}',
                         CertCountry= '${countryForCert}',
                          DocCountry='${countryForDoc}',
                          BachCountry='${countryForAssociate}',
                          Resume='${resume}', CertFileName= '${cert_file_name}',DegFileName= '${deg_file_name}',
                          ThingsReferences=@ThingsReferences
                          WHERE CONVERT(VARCHAR, AcademyId) = '${user_id}'
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


    let { MutiStudentHourlyRate, IntroSessionDiscount, CancellationPolicy,
        FreeDemoLesson, ConsentRecordingLesson, ActivateSubscriptionOption,
        SubscriptionPlan, AcademyId, DiscountCode, CodeShareable, MultiStudent } = req.body;
    marom_db(async (config) => {
        try {

            const sql = require('mssql');
            console.log('uploading data...')

            var poolConnection = await sql.connect(config);
            let result;
            if (poolConnection) {

                let recordExisted = await poolConnection.request().query(
                    findByAnyIdColumn('TutorRates', { AcademyId }, 'varchar')
                )
                if (recordExisted.recordset.length) {
                    result = await poolConnection.request().query(
                        `UPDATE TutorRates 
                        SET MutiStudentHourlyRate = '${MutiStudentHourlyRate}', 
                        CancellationPolicy = '${CancellationPolicy}', 
                        FreeDemoLesson = '${FreeDemoLesson}',
                         ConsentRecordingLesson = '${ConsentRecordingLesson}',
                          ActivateSubscriptionOption = '${ActivateSubscriptionOption}', 
                          SubscriptionPlan = '${SubscriptionPlan}',
                           DiscountCode = '${DiscountCode}', 
                           CodeShareable=${CodeShareable ? 1 : 0},  
                           MultiStudent=${MultiStudent ? 1 : 0},
                           IntroSessionDiscount=${IntroSessionDiscount ? 1 : 0}
                         WHERE cast(AcademyId as varchar) = '${AcademyId}'`
                    )
                } else {
                    result = await poolConnection.request().query(
                        `
                            INSERT INTO "TutorRates"
                            (MutiStudentHourlyRate,CancellationPolicy,FreeDemoLesson,
                                ConsentRecordingLesson,ActivateSubscriptionOption,
                                SubscriptionPlan,AcademyId, DiscountCode,MultiStudent,
                                CodeShareable,IntroSessionDiscount)
                            VALUES ( '${MutiStudentHourlyRate}', 
                            '${CancellationPolicy}','${FreeDemoLesson}',
                            '${ConsentRecordingLesson}','${ActivateSubscriptionOption}',
                            '${SubscriptionPlan}','${AcademyId}','${DiscountCode}',${MultiStudent ? 1 : 0},
                            ${CodeShareable ? 1 : 0},${IntroSessionDiscount ? 1 : 0})
                            `
                    )
                }

                {/* console.log(result) */ }
                result.rowsAffected[0] === 1
                    ?
                    res.send({ bool: true, mssg: 'Data Was Successfully Saved' })
                    :
                    res.send({ bool: false, mssg: 'Data Was Not Successfully Saved' })
            }
        }
        catch (err) {
            console.log(err)
            res.send({ bool: false, mssg: 'Data Was Not Successfully Saved' })
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
                    SELECT EducationalLevel, EducationalLevelExperience, Certificate, CertificateState, 
                    CertificateExpiration, AcademyId  From Education  WHERE CONVERT(VARCHAR(max), AcademyId) = 
                    '${user_id}'
                `
            )
                .then((result) => {
                    res.status(200).send(result.recordset)
                })
            // .catch(err => console.log(err))

        }

    })
}

let upload_tutor_rates = (req, res) => {

    let { id, faculty, subject } = req.params;
    marom_db(async (config) => {
        try {
            const sql = require('mssql');

            var poolConnection = await sql.connect(config);
            if (poolConnection) {
                const existed = await poolConnection.request().query(
                    find('SubjectRates', {
                        AcademyId: id,
                        subject,
                        faculty
                    }, "AND", {
                        AcademyId: "varchar",
                        subject: "varchar",
                        faculty: "varchar"
                    })
                )
                let result;
                if (existed.recordset.length) {
                    result = await poolConnection.request().query(
                        update('SubjectRates', req.body, {
                            AcademyId: id,
                            subject,
                            faculty
                        }, {
                            AcademyId: "varchar",
                            subject: "varchar",
                            faculty: "varchar"
                        })
                    )
                }
                else {
                    result = await poolConnection.request().query(
                        insert('SubjectRates', {
                            ...req.body, ...{
                                AcademyId: id,
                                subject: subject,
                                faculty: faculty
                            }
                        })
                    )
                }
                res.status(200).send(result.recordset)
            }
        }
        catch (err) {
            console.log(err)
            res.status(400).send({ message: err.message })
        }

    })
}

let remove_subject_rates = (req, res) => {

    let { id } = req.params;
    marom_db(async (config) => {
        try {
            const sql = require('mssql');

            var poolConnection = await sql.connect(config);
            if (poolConnection) {
                const deleted = await poolConnection.request().query(
                    `Delete FROM SubjectRates where SID = '${id}'`
                )
                console.log(deleted)

                res.status(200).send(deleted)
            }
        }
        catch (err) {
            console.log(err)
            res.status(400).send({ message: err.message })
        }

    })
}

let upload_tutor_bank = (req, res) => {

    let { start_day, acct_name, acct_type, bank_name, acct, routing, ssh,
        accumulated_hrs, commission, total_earning, payment_option, AcademyId, email } = req.body;

    let checker = (cb) => {

        marom_db(async (config) => {
            const sql = require('mssql');
            var poolConnection = await sql.connect(config);
            let response = poolConnection ?
                await poolConnection.request().query(`SELECT * FROM "TutorBank" WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}'`) : 'err conneecting to db'

            cb(response.rowsAffected[0])
        })

    }

    checker((data) => {
        if (data < 1) {

            marom_db(async (config) => {
                const sql = require('mssql');
                var poolConnection = await sql.connect(config);

                let result = poolConnection ?
                    await insert_bank_details(poolConnection) : 'connection error';


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


                if (result) {
                    res.send(true)
                } else {
                    res.send(false)
                }
            })
        }
    })

    let insert_bank_details = async (poolConnection) => {
        let records = await poolConnection.request().query(`INSERT INTO "TutorBank"
        (AccountName,AccountType,BankName,Account,Routing,SSH,AccumulatedHrs,Commission,
            TotalEarning,PaymentOption,TutorStartDay,AcademyId, Email)
        VALUES ('${acct_name}', '${acct_type}','${bank_name}','${acct}','${routing}',
        '${ssh}','${accumulated_hrs}','${commission}', '${total_earning}','${payment_option}',
         '${start_day}', '${AcademyId}', '${email}')`)

        let result = await records.rowsAffected[0] === 1 ? true : false
        return (result);
    }

    let update_bank_details = async (poolConnection) => {
        let records = await poolConnection.request().query(
            `
                UPDATE "TutorBank" set AccountName = '${acct_name}', AccountType = '${acct_type}',
                 BankName = '${bank_name}', Account = '${acct}', Routing = '${routing}', SSH = '${ssh}',
                  AccumulatedHrs = '${accumulated_hrs}', Commission = '${commission}',
                   TotalEarning = '${total_earning}', PaymentOption = '${payment_option}'  , Email='${email}'
                    WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}'
            `
        )

        let result = await records.rowsAffected[0] === 1 ? true : false
        return (result);

    }

}

let get_my_data = async (req, res) => {
    let { AcademyId } = req.query;
    let books = []


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

        new Promise((resolve) => {
            response_1(resolve)
        })
            .then(() => {
                response_2(cb)
            })
        // .catch(err => console.log(err))
    }

    sender(() => {
        new Promise((resolve) => {
            response_0(resolve)
        })

            // .catch(err => console.log(err))
            .finally(() => {
                res.send(books)
            })
    })

}


let get_rates = (req, res) => {
    let { AcademyId, facultyId, subject } = req.query;
    marom_db(async (config) => {
        try {
            const sql = require('mssql');

            var poolConnection = await sql.connect(config);
            if (poolConnection) {
                const result = await poolConnection.request().query(
                    `Select sb.SubjectName as subject, sb.FacultyId as facultyId, sr.rate, sr.AcademyId, 
                    sr.grades as grades, sr.SID,
                    sb.CreatedOn FROM Subjects as sb
                    LEFT JOIN SubjectRates as sr ON  cast(sr.subject  as varchar(max))=
                    cast( sb.SubjectName as varchar(max)) and 
                    cast( sr.faculty as varchar(max))= 
                      cast(sb.FacultyId as varchar(max)) and cast( sr.AcademyId  as varchar)= '${AcademyId}'
                    where sb.FacultyId = ${facultyId}
                `
                )
                res.status(200).send(result.recordset)
            }
        }
        catch (err) {
            console.log(err)
            res.status(400).send({ message: err.message })
        }

    })
}

let get_tutor_rates = (req, res) => {
    let { AcademyId } = req.query;
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        if (poolConnection) {
            poolConnection.request().query(
                `
                    SELECT * From TutorRates WHERE 
                    CONVERT(VARCHAR, AcademyId) = '${AcademyId}' 
                `
            )
                .then((result) => {
                    res.status(200).send(result.recordset)
                })
                .catch(err => console.log(err))

        }

    })
}

let faculties = (req, res) => {
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        if (poolConnection) {
            poolConnection.request().query(
                `
                    SELECT * From Faculty  
                `
            )
                .then((result) => {
                    res.status(200).send(result.recordset)
                })
                .catch(err => console.log(err))

        }

    })
}

let get_bank_details = (req, res) => {
    let { AcademyId } = req.query;
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        if (poolConnection) {
            poolConnection.request().query(
                `
                    SELECT * From TutorBank WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}' 
                `
            )
                .then((result) => {
                    res.status(200).send(result.recordset)
                })
            // .catch(err => console.log(err))

        }

    })
}

let get_tutor_setup = (req, res) => {
    marom_db(async (config) => {
        try {
            const sql = require('mssql');

            var poolConnection = await sql.connect(config);
            if (poolConnection) {
                const result = await poolConnection.request().query(
                    findByAnyIdColumn('TutorSetup', req.query, 'varchar(max)')
                )
                let record = result.recordset?.[0] || {}
                if (record.userId) {
                    const { recordset } = await poolConnection.request().query(
                        findByAnyIdColumn('Users1', { SID: record.userId })
                    )
                    record = { ...record, Email: recordset[0].email }
                }
                const offset = parseInt(record.GMT, 10);
                let timezones = moment.tz.names().filter(name =>
                    (moment.tz(name).utcOffset()) === offset * 60);
                const timeZone = timezones[0] || null

                const formattedResult = [{ ...record, timeZone }]

                res.status(200).send(formattedResult)
            }
        }
        catch (err) {
            console.log(err)
            res.status(400).send({ message: err.message })
        }
    })
}

let get_my_edu = (req, res) => {
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        if (poolConnection) {
            poolConnection.request().query(
                findByAnyIdColumn('Education', req.query, 'varchar(max)')
            )
                .then((result) => {
                    res.status(200).send(result.recordset)
                })
                .catch(err => {
                    console.log(err)
                    res.status(400).send(err)
                })
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
                // .catch(err => console.log(err))
            }
        })
    } catch (error) {
        console.error("Error Updating TutorSetup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

let get_tutor_status = (req, res) => {
    let { AcademyId } = req.query;
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        if (poolConnection) {
            poolConnection.request().query(
                `
                    SELECT Status From TutorSetup WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}' 
                `
            )
                .then((result) => {
                    res.status(200).send(result.recordset)
                })
            // .catch(err => console.log(err))

        }

    })
}

let fetchStudentsBookings = (req, res) => {
    try {
        const { tutorId } = req.params;
        marom_db(async (config) => {
            const sql = require('mssql');

            var poolConnection = await sql.connect(config);
            if (poolConnection) {
                poolConnection.request().query(
                    find('StudentBookings', { tutorId })
                )
                    .then((result) => {
                        res.status(200).send(result.recordset);
                    })
                    .catch(err => {
                        res.status(400).json({ message: err.message });
                    })
            }
        })
    } catch (error) {
        console.error("Error storing Events:", error);
        res.status(400).json({ message: error.message });
    }
};

const post_tutor_setup = (req, res) => {
    marom_db(async (config) => {
        try {
            const sql = require('mssql');
            const poolConnection = await sql.connect(config);
            if (poolConnection) {
                const findtutorSetup = await poolConnection.request().query(
                    findByAnyIdColumn('TutorSetup', { userId: req.body.userId })
                );
                if (findtutorSetup.recordset.length) {
                    delete req.body["AcademyId"]
                    const request = poolConnection.request();
                    request.input('AcademyId', sql.NVarChar(sql.MAX),
                        findtutorSetup.recordset[0].AcademyId);


                    Object.keys(req.body).map((key) => {
                        if (key === 'VacationMode')
                            return request.input('VacationMode', sql.Bit, req.body.VacationMode);
                        if (key === 'StartVacation' || key === 'EndVacation')
                            return request.input(key, sql.NVarChar(sql.MAX), `${req.body[key]}`);
                        if (key === 'Step')
                            return request.input(key, sql.Int, req.body.Step);
                        request.input(key, sql.NVarChar(sql.MAX), req.body[key]);
                    })


                    const { query } = parameteriedUpdateQuery('TutorSetup', req.body,
                        { AcademyId: findtutorSetup.recordset[0].AcademyId })
                    const result = await request.query(query);

                    if (result.rowsAffected[0]) {
                        const result = await poolConnection.request().query(
                            findByAnyIdColumn("TutorSetup",
                                { AcademyId: findtutorSetup.recordset[0].AcademyId })
                        );
                        res.status(200).send(result.recordset);
                    }
                    else
                        res.status(200).send([]);
                }
                else {
                    req.body.AcademyId = req.body.MiddleName.length > 0 ?
                        req.body.FirstName + '.' + ' ' + req.body.MiddleName[0] + '.' + ' ' +
                        req.body.LastName[0] + shortId.generate() :
                        req.body.FirstName + '.' + ' ' + req.body.LastName[0] + shortId.generate();

                    const request = poolConnection.request();
                    Object.keys(req.body).map((key) => {
                        if (key === 'VacationMode')
                            return request.input('VacationMode', sql.Bit, req.body.VacationMode);
                        if (key === 'StartVacation' || key === 'EndVacation')
                            return request.input(key, sql.NVarChar(sql.MAX), `${req.body[key]}`);
                        if (key === 'Step')
                            return request.input(key, sql.Int, req.body.Step);
                        request.input(key, sql.NVarChar(sql.MAX), req.body[key]);
                    })

                    const { query } = parameterizedInsertQuery('TutorSetup', req.body)
                    const result = await request.query(query);

                    res.status(200).send(result.recordset);
                }
            }
        } catch (err) {
            console.log(err);
            res.status(400).send({ message: err.message });
        }
    })
}

const set_agreements_date_null_for_all = (req, res) => {
    marom_db(async (config) => {
        try {
            const sql = require('mssql');
            const poolConnection = await sql.connect(config);
            if (poolConnection) {
                const result = await poolConnection.request().query(`Update TutorSetup set AgreementDate = null`)
                res.status(200).send(result.rowsAffected ? true : false)
            }
        }
        catch (err) {
            res.status(400).send({ message: err.message })
        }
    })
}

let get_tutor_market_data = async (req, res) => {

    let { id } = req.query;

    let Education = async () => await connecteToDB.then(poolConnection =>
        poolConnection.request().query(`SELECT * From Education WHERE CONVERT(VARCHAR, AcademyId) =  '${id}'`)
            .then((result) => {

                return (result.recordset);
            })
        // .catch(err => console.log(err))

    )

    // let Exprience = await connecteToDB.then(poolConnection =>
    //     poolConnection.request().query(`SELECT * From Experience `)
    //         .then((result) => {

    //             return (result.recordset);
    //         })
    //     // .catch(err => console.log(err))

    // )

    // let EducationalLevel = await connecteToDB.then(poolConnection =>
    //     poolConnection.request().query(`SELECT * From EducationalLevel `)
    //         .then((result) => {

    //             return (result.recordset);
    //         })
    //     // .catch(err => console.log(err))
    // )

    // let CertificateTypes = await connecteToDB.then(poolConnection =>
    //     poolConnection.request().query(`SELECT * FROM CertificateTypes `)
    //         .then((result) => {

    //             return (result.recordset);
    //         })
    //     // .catch(err => console.log(err))

    // )

    let Subjects = async () => await connecteToDB.then(poolConnection =>
        poolConnection.request().query(`SELECT * FROM SubjectRates WHERE CONVERT(VARCHAR, AcademyId) =  '${id}'`)
            .then((result) => {
                return (result.recordset);
            })
            .catch(err => console.log(err))
    )

    // let Faculty = await connecteToDB.then(poolConnection =>
    //     poolConnection.request().query(`SELECT * FROM Faculty `)
    //         .then((result) => {

    //             return (result.recordset);
    //         })
    //     // .catch(err => console.log(err))
    //     // .catch(err => console.log(err))
    // )

    // let GMT = await connecteToDB.then(poolConnection =>
    //     poolConnection.request().query(`SELECT * FROM GMT`)
    //         .then((result) => {

    //             return (result.recordset);
    //         })
    //     // .catch(err => console.log(err))
    //     // .catch(err => console.log(err))
    // )
    try {
        res.status(200).send({
            Education: await Education(),
            Subjects: await Subjects()
        })
    }
    catch (e) {
        res.status(400).send({ message: e.message })
    }
}

let get_tutor_students = async (req, res) => {
    marom_db(async (config) => {
        try {
            const { academyId } = req.params;
            const sql = require('mssql');

            const poolConnection = await sql.connect(config)
            const students = await poolConnection.request().query(`
            SELECT * FROM StudentShortList as ss join StudentSetup as st on
            cast(st.AcademyId as varchar(max)) = cast(ss.Student as varchar(max)) join StudentBookings as sb
            on cast(sb.studentId as varchar)= cast(ss.Student  as varchar) and 
            sb.tutorId = cast( ss.AcademyId  as varchar) and 
            sb.subjectName=cast(ss.Subject as varchar)
            WHERE  CONVERT(VARCHAR, ss.AcademyId) = '${academyId}'
           `)

            const formattedResult = students.recordset.map(student => {
                const reservedSlots = JSON.parse(student.reservedSlots || '[]');
                const bookedSlots = JSON.parse(student.bookedSlots || '[]');
                // const 
                const allPastSession = reservedSlots.concat(bookedSlots).filter((session) =>
                    new Date(session.end) < new Date());
                allPastSession.sort((a, b) => a.date - b.date);
                const oldestSession = allPastSession.length > 0 ? allPastSession[0] : null;
                const latestSession = allPastSession.length > 0 ? allPastSession[allPastSession.length - 1] : null;
                const sumOfRates = allPastSession.reduce((total, session) => {
                    const rateValue = parseFloat(session.rate.replace('$', ''));
                    return total + rateValue;
                }, 0);

                return {
                    id: student.AcademyId[1],
                    online: student.Online,
                    photo: student.Photo === 'undefined' ? null : student.Photo,
                    screenName: student.ScreenName[1],
                    subject: student.Subject,
                    country: student.Country,
                    gmt: student.GMT,
                    grade: student.Grade,
                    totalHours: allPastSession.length,
                    dateStart: allPastSession.length ? oldestSession.start : null,
                    dateLast: allPastSession.length ? latestSession.start : null,
                    totalGross: '',
                    totalNet: sumOfRates
                }
            })
            res.status(200).json(formattedResult);
        } catch (error) {
            console.error('Error fetching tutor students:', error);
            res.status(400).json({ error: error.message });
        }
    })
}

let getSessionsDetails = async (req, res) => {
    const { tutorId } = req.params;
    marom_db(async (config) => {
        try {
            const sql = require('mssql');
            const poolConnection = await sql.connect(config);

            if (poolConnection) {
                const result = await poolConnection.request().query(
                    `SELECT 
                      b.reservedSlots, ts.GMT, b.bookedSlots, b.tutorId, b.studentId, 
                      b.subjectName, ss.Rate, ch.ChatID
                        FROM StudentBookings AS b
                        JOIN StudentShortList AS ss ON
                        b.studentId  = CAST(ss.Student AS varchar(max)) AND 
                        b.tutorId =  CAST(ss.AcademyId AS varchar(max))
                        inner JOIN TutorSetup AS ts On
                        b.tutorId = CAST(ts.AcademyId AS varchar(max))
                        left JOIN Chat AS ch ON 
                        ch.User1ID =cast( ss.Student AS varchar) AND
                        ch.User2ID =cast( ts.AcademyId AS varchar)
                        WHERE b.tutorId = CAST('${tutorId}' AS varchar(max)); `
                );
                const allStudentsSessions = result.recordset.map(record => {
                    const reservedSession = JSON.parse(record.reservedSlots);
                    const bookedSession = JSON.parse(record.bookedSlots);
                    const bookedSessionWithChatId = bookedSession.map(session => ({ ...session, chatId: record.ChatID }))

                    const reservedSlotWithChatId = reservedSession.map(session => ({ ...session, chatId: record.ChatID }))
                    const combinedSessions = reservedSlotWithChatId.concat(bookedSessionWithChatId)
                    return combinedSessions

                }).flat();

                const uniqueIds = new Set();
                const uniqueIdsSessions = allStudentsSessions.filter((obj) => {
                    if (!uniqueIds.has(obj.id)) {
                        uniqueIds.add(obj.id);
                        return true;
                    }
                    return false;
                });
                uniqueIdsSessions.sort((a, b) => new Date(b.start) - new Date(a.start))
                const arrayWithSerialNumber = uniqueIdsSessions.map((obj, index) => ({
                    ...obj,
                    sr: uniqueIdsSessions.length - index,
                }));

                const commissionAccordingtoNumOfSession = (sr) => {
                    const commissionEntry = COMMISSION_DATA.find(entry => {
                        if (!entry.higher) {
                            return sr >= entry.lower && sr <= entry.higher;
                        } else {
                            return sr >= entry.lower;
                        }
                    });
                    return commissionEntry ? commissionEntry.percent : null
                }

                const calcNet = (rate, comm) => {
                    const numericRate = parseFloat(rate.replace("$", ""));
                    const commissionAmount = (numericRate * comm) / 100;

                    const netAmount = numericRate - commissionAmount;
                    return netAmount
                }

                const sessionWithCommision = arrayWithSerialNumber.map((session) => ({
                    ...session,
                    comm: commissionAccordingtoNumOfSession(session.sr),
                    net: calcNet(session.rate, commissionAccordingtoNumOfSession(session.sr))
                }))

                const today = moment(); // Get today's date
                let latestPayday = moment('2024-01-18T17:21:42.727Z', 'YYYY-MM-DD');

                while (latestPayday.isBefore(today)) {
                    latestPayday.add(14, 'days');

                    if (latestPayday.isAfter(today)) {
                        latestPayday = moment(latestPayday).subtract(14, 'days');
                        break;
                    }
                }

                const currentYear = moment().year();
                const sessionsWithinPayDay = sessionWithCommision.filter(session => moment(session.start).isBefore(latestPayday))
                // Filter sessions for the current year
                const currentYearFullfilledSessions = sessionsWithinPayDay.filter((session) =>
                    moment(session.start).year() === currentYear && session.request !== 'delete'
                );

                const previousYearFullFilledSessions = sessionsWithinPayDay.filter((session) =>
                    moment(session.start).year() === currentYear - 1 && session.request !== 'delete'
                );
                const currentYearEarning = currentYearFullfilledSessions.reduce((total, session) =>
                    total + session.net, 0);
                const previousYearEarning = previousYearFullFilledSessions.reduce((total, session) =>
                    total + session.net, 0);
                const currentYearAccHours = currentYearFullfilledSessions.length;


                res.status(200).send({ currentYearEarning, previousYearEarning, currentYearAccHours, sessions: sessionsWithinPayDay });
            }
        } catch (err) {
            console.log(err);
            res.status(400).send({ message: err.message });
        }
    })
}

let last_pay_day = async (req, res) => {
    marom_db(async (config) => {
        try {
            const sql = require('mssql');
            const poolConnection = await sql.connect(config);

            if (poolConnection) {
                const result = await poolConnection.request().query(
                    `SELECT Top 1 *
                  FROM Plateform_Payments
                  ORDER BY payday DESC`
                );

                const today = moment(); // Get today's date
                let latestPayday = moment(result.recordset[0].Payday, 'YYYY-MM-DD');

                while (latestPayday.isBefore(today)) {
                    latestPayday.add(14, 'days');

                    if (latestPayday.isAfter(today)) {
                        latestPayday = moment(latestPayday).subtract(14, 'days');
                        break;
                    }
                }
                const formattedResult = {
                    AdminId: result.recordset[0].AcademyId,
                    Payday: latestPayday,
                    SID: result.recordset[0].SID,
                    Status: result.recordset[0].Status,
                }

                res.status(200).send(formattedResult)
            }
        }
        catch (err) {
            console.log(err)
            res.status(400).send({ message: err.message })
        }
    })
}

const get_tutor_profile_data = async (req, res) => {
    marom_db(async (config) => {
        try {
            const sql = require('mssql');
            const poolConnection = await sql.connect(config);

            if (poolConnection) {
                const result = await poolConnection.request().query(
                    `SELECT
                        CAST(ts.AcademyId AS VARCHAR(MAX)) AS AcademyId,
                        CAST(ts.TutorScreenname AS VARCHAR(MAX)) AS TutorScreenname,

                        CAST(ts.Video AS VARCHAR(MAX)) AS Video,
                        CAST(ts.Photo AS VARCHAR(MAX)) AS Photo,
                        CAST(ts.CellPhone AS VARCHAR(MAX)) AS CellPhone,
                        CAST(ts.CityTown AS VARCHAR(MAX)) AS CityTown,
                        CAST(ts.Country AS VARCHAR(MAX)) AS Country,
                        CAST(ts.FirstName AS VARCHAR(MAX)) AS FirstName,
                        CAST(ts.GMT AS VARCHAR(MAX)) AS GMT,
                        CAST(ts.Grades AS VARCHAR(MAX)) AS Grades,
                        CAST(ts.HeadLine AS VARCHAR(MAX)) AS HeadLine,
                        CAST(ts.Motivate AS VARCHAR(MAX)) AS Motivate,
                        CAST(ts.Introduction AS VARCHAR(MAX)) AS Introduction,
                        CAST(ts.Online AS VARCHAR(MAX)) AS Online,
                        CAST(ts.ResponseHrs AS VARCHAR(MAX)) AS ResponseHrs,
                        CAST(ts.StateProvince AS VARCHAR(MAX)) AS StateProvince,

                        CAST(te.WorkExperience AS VARCHAR(MAX)) As WorkExperience,
                        CAST(te.EducationalLevel AS VARCHAR(MAX)) as EducationalLevel,
                        CAST(te.EducationalLevelExperience AS VARCHAR(MAX)) EducationLevelExp,
                        CAST(te.BachCountry AS VARCHAR(MAX)) AS BachCountry,
                        CAST(te.College1 AS VARCHAR(MAX)) AS College1,
                        CAST(te.College1State AS VARCHAR(MAX)) AS College1State,
                        CAST(te.College1Year AS VARCHAR(MAX)) AS BachYear,
                        CAST(te.CertCountry AS VARCHAR(MAX)) AS CertCountry,
                        CAST(te.Certificate AS VARCHAR(MAX)) AS Certificate,
                        CAST(te.CertificateExpiration AS VARCHAR(MAX)) AS CertificateExpiration,
                        CAST(te.CertificateExpiration AS VARCHAR(MAX)) as CertExpDate,
                        CAST(te.DoctorateState AS VARCHAR(MAX)) as DocState,
                        CAST(te.DoctorateGradYr AS VARCHAR(MAX)) as DocYr,
                        CAST(te.DoctorateCollege AS VARCHAR(MAX)) as DocCollege,
                        CAST(te.DocCountry AS VARCHAR(MAX)) as DocCountry,
                        CAST(te.NativeLang AS VARCHAR(MAX)) as NativeLang,
                        CAST(te.NativeLangOtherLang AS VARCHAR(MAX)) as OtherLang,
                        CAST(te.Degree AS VARCHAR(MAX)) as Degree,
                        CAST(te.DegreeState AS VARCHAR(MAX)) as DegState,
                        CAST(te.DegreeYear AS VARCHAR(MAX)) as DegYr,
                        CAST(te.DegCountry AS VARCHAR(MAX)) as DegCountry,
                        CAST(te.MastCountry AS VARCHAR(MAX)) as MastCountry,
                        CAST(te.College2 AS VARCHAR(MAX)) as MastCollege,
                        CAST(te.College2State AS VARCHAR(MAX)) as MastState,
                        CAST(te.College2StateYear AS VARCHAR(MAX)) as MastYr,
                        CAST(te.Resume AS VARCHAR(MAX)) As Resume,
                        CAST(te.CertFileName AS VARCHAR(MAX)) As CertFileName,
                        CAST(te.DegFileName AS VARCHAR(MAX)) As DegFileName,



                        CAST(tc.ChatID AS VARCHAR(MAX)) AS ChatID,

                        CAST(tr.CancellationPolicy AS VARCHAR(MAX)) AS CancellationPolicy,
                        CAST(tr.IntroSessionDiscount AS VARCHAR(MAX))  AS IntroSessionDiscount,


                        ISNULL(
                            (
                                SELECT sr.subject AS Subject,
                                       sr.rate AS Rate, sr.Grades AS SubjectGrades
                                FROM SubjectRates AS sr
                                WHERE CAST(sr.AcademyId AS VARCHAR(MAX)) = CAST(ts.AcademyId AS VARCHAR(MAX))
                                FOR JSON PATH
                            ), '') AS Subjects
                    FROM
                        TutorSetup AS ts
                    LEFT JOIN
                        Education AS te ON CAST(ts.AcademyId AS VARCHAR(MAX)) = CAST(te.AcademyId AS VARCHAR(MAX))
                    LEFT JOIN
                        Chat AS tc ON CAST(ts.AcademyId AS VARCHAR) = tc.User2ID 
                        AND CAST(tc.User1ID AS VARCHAR) = '${req.params.studentId}'
                    LEFT JOIN
                        TutorRates AS tr ON CAST(tr.AcademyId AS VARCHAR) = ts.AcademyId
                        
                    WHERE
                        CAST(ts.AcademyId AS VARCHAR(MAX)) = CAST('${req.params.tutorId}' AS VARCHAR(MAX))
                    GROUP BY
                        tc.ChatID,
                        CAST(ts.TutorScreenname AS VARCHAR(MAX)),

                        CAST(ts.AcademyId AS VARCHAR(MAX)),
                        CAST(ts.Photo AS VARCHAR(MAX)),
                        CAST(ts.Video AS VARCHAR(MAX)),
                        CAST(ts.CellPhone AS VARCHAR(MAX)),
                        CAST(ts.CityTown AS VARCHAR(MAX)),
                        CAST(ts.Country AS VARCHAR(MAX)),
                        CAST(ts.FirstName AS VARCHAR(MAX)),
                        CAST(ts.LastName AS VARCHAR(MAX)),
                        CAST(ts.GMT AS VARCHAR(MAX)),
                        CAST(ts.Grades AS VARCHAR(MAX)),
                        CAST(ts.HeadLine AS VARCHAR(MAX)),
                        CAST(ts.Motivate AS VARCHAR(MAX)),
                        CAST(ts.Introduction AS VARCHAR(MAX)),
                        CAST(ts.Online AS VARCHAR(MAX)),
                        CAST(ts.ResponseHrs AS VARCHAR(MAX)),
                        CAST(ts.StateProvince AS VARCHAR(MAX)),
                        
                        CAST(te.WorkExperience AS VARCHAR(MAX)),
                        CAST(te.EducationalLevel AS VARCHAR(MAX)),
                        CAST(te.EducationalLevelExperience AS VARCHAR(MAX)),
                        CAST(te.BachCountry AS VARCHAR(MAX)),
                        CAST(te.College1 AS VARCHAR(MAX)),
                        CAST(te.College1State AS VARCHAR(MAX)),
                        CAST(te.College1Year AS VARCHAR(MAX)),
                        CAST(te.CertCountry AS VARCHAR(MAX)),
                        CAST(te.Certificate AS VARCHAR(MAX)),
                        CAST(te.CertificateExpiration AS VARCHAR(MAX)),
                        CAST(te.DoctorateState AS VARCHAR(MAX)),
                        CAST(te.DoctorateGradYr AS VARCHAR(MAX)),
                        CAST(te.DoctorateCollege AS VARCHAR(MAX)),
                        CAST(te.DocCountry AS VARCHAR(MAX)),
                        CAST(te.NativeLang AS VARCHAR(MAX)),
                        CAST(te.NativeLangOtherLang AS VARCHAR(MAX)),
                        CAST(te.Degree AS VARCHAR(MAX)),
                        CAST(te.DegreeState AS VARCHAR(MAX)),
                        CAST(te.DegreeYear AS VARCHAR(MAX)),
                        CAST(te.DegCountry AS VARCHAR(MAX)),
                        CAST(te.MastCountry AS VARCHAR(MAX)),
                        CAST(te.College2 AS VARCHAR(MAX)),
                        CAST(te.College2State AS VARCHAR(MAX)),
                        CAST(te.College2StateYear AS VARCHAR(MAX)),
                        CAST(te.Resume AS VARCHAR(MAX)) ,
                        CAST(te.CertFileName AS VARCHAR(MAX)),
                        CAST(te.DegFileName AS VARCHAR(MAX)) ,

                        CAST(tr.IntroSessionDiscount AS VARCHAR(MAX)),
                        CAST(tr.CancellationPolicy AS VARCHAR(MAX))

                    `
                );
                const record = result.recordset[0] || null;
                if (!record) return res.status(200).send({})
                const formattedResult =
                {
                    ...record, Subjects: JSON.parse(record.Subjects.length ?
                        record.Subjects : '[]'),
                    OtherLang: JSON.parse(record.OtherLang ?? '[]'), NativeLang: JSON.parse(record.NativeLang ?? '[]')
                }
                res.status(200).send(formattedResult)
            }
        }
        catch (err) {
            console.log(err)
            res.status(400).send({ message: err.message })
        }
    })
}

const post_tutor_ad = async (req, res) => {
    marom_db(async (config) => {
        try {
            const poolConnection = await sql.connect(config);
            const result = await poolConnection.request().query(insert('TutorAds', req.body))
            res.status(200).send(result.recordset[0]);
        }
        catch (e) {
            res.status(400).send({ message: e.message })
        }
    })
}

const get_tutor_ads = async (req, res) => {
    marom_db(async (config) => {
        try {
            const poolConnection = await sql.connect(config);
            const result = await poolConnection.request().query(find('TutorAds', req.params))
            res.status(200).send(result.recordset);
        }
        catch (e) {
            res.status(400).send({ message: e.message })
        }
    })
}

const get_ad = async (req, res) => {
    marom_db(async (config) => {
        try {
            const poolConnection = await sql.connect(config);
            const result = await poolConnection.request().
                query(findByAnyIdColumn('TutorAds', req.params))
            res.status(200).send(result.recordset[0]);
        }
        catch (e) {
            res.status(400).send({ message: e.message })
        }
    })
}

const put_ad = async (req, res) => {
    marom_db(async (config) => {
        try {
            const poolConnection = await sql.connect(config);
            const result = await poolConnection.request().
                query(update('TutorAds', req.body, req.params))
            res.status(200).send(result.recordset[0]);
        }
        catch (e) {
            res.status(400).send({ message: e.message })
        }
    })
}

module.exports = {
    get_tutor_profile_data,
    getSessionsDetails,
    post_tutor_ad,
    set_agreements_date_null_for_all,
    get_ad,
    put_ad,
    get_tutor_ads,
    remove_subject_rates,
    subject_already_exist,
    last_pay_day,
    subjects,
    get_tutor_market_data,
    get_tutor_students,
    post_tutor_setup,
    faculties,
    post_form_one,
    post_edu_form,
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
    upload_tutor_bank,
    get_tutor_setup,
    get_tutor_rates,
    get_bank_details,
    storeEvents,
    fetchStudentsBookings,
    storeCalenderTutorRecord,
    get_tutor_status
}
