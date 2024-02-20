const { marom_db, connecteToDB } = require('../db');
const { insert, getAll, findById, findByAnyIdColumn, update, find, updateById } = require('../helperfunctions/crud_queries');
const { express, path, fs, parser, cookieParser, mocha, morgan, cors, shortId, jwt } = require('../modules');
require('dotenv').config();
const moment = require('moment-timezone');
const sql = require('mssql');
const capitalizeFirstLetter = require('../constants/helperfunctions.js')

const executeQuery = async (query, res) => {
    try {
        const db = await marom_db(() => { })
        await marom_db(async (config) => {
            try {
                const sql = require('mssql');
                const poolConnection = await sql.connect(config);
                if (poolConnection) {
                    const result = await poolConnection.request().query(
                        query
                    );
                    res.status(200).send(result?.recordset)
                }
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err)
            }
        })
    } catch (error) {
        console.error('Error in executeQuery:', error.message);
        return error
    }
};

let upload_setup_info = (req, res) => {

    let { fname, mname, sname, email, lang, secLan, parentAEmail, parentBEmail, parentAName, parentBName,
        is_18, pwd, cell, grade,
        add1, add2, city, state, zipCode, country,
        timeZone, photo, acadId, parentConsent,
        userId } = req.body;

    let UserId = mname?.length > 0 ? fname + '.' + ' ' + mname[0] + '.' + ' ' + sname[0] +
        shortId.generate() : fname + '.' + ' ' + sname[0] + shortId.generate();

    let screenName = mname?.length > 0 ? capitalizeFirstLetter(fname) + ' ' + capitalizeFirstLetter(mname[0]) + '. ' + capitalizeFirstLetter(sname[0]) :
        capitalizeFirstLetter(fname) + '. ' + capitalizeFirstLetter(sname[0]);


    let action = cb => {
        marom_db(async (config) => {
            const sql = require('mssql');
            var poolConnection = await sql.connect(config);

            let result = poolConnection ? await get_action(poolConnection) :
                'connection error';
            cb(result);

        })
    }

    action((result) => {

        if (result) {

            marom_db(async (config) => {

                const sql = require('mssql');
                var poolConnection = await sql.connect(config);

                insert_student_data(poolConnection)
                    .then((result) => {
                        res.send({ user: UserId, screen_name: screenName, bool: true, mssg: 'Data Was Saved Successfully', type: 'save' })
                    })
                    .catch((err) => {
                        res.status(400).send({ user: UserId, screen_name: screenName, bool: false, mssg: 'Data Was Not Saved Successfully Due To Database Malfunction, Please Try Again.' })
                        console.log(err)

                    })
            })

        } else {

            marom_db(async (config) => {

                const sql = require('mssql');
                var poolConnection = await sql.connect(config);

                update_student_data(poolConnection)
                    .then((result) => {
                        res.status(200).send({ user: UserId, screen_name: screenName, bool: true, mssg: 'Data Was Updated Successfully', type: 'update' })
                    })
                    .catch((err) => {
                        res.status(400).send({ user: UserId, screen_name: screenName, bool: false, mssg: 'Data Was Not Updated Successfully Due To Database Malfunction, Please Try Again.' })
                        console.log(err)
                    })
            })

        }
    })

    let get_action = async (poolConnection) => {
        let records = await poolConnection.request().query(`SELECT * FROM "StudentSetup" 
        WHERE CONVERT(VARCHAR, Email) = '${email.length > 8 ? email : null}'`)
        let get_duplicate = await records.recordset;

        let result = get_duplicate.length > 0 ? false : true;
        return (result);
    }

    let insert_student_data = async (poolConnection) => {
        let records = await poolConnection.request().query(`INSERT INTO StudentSetup(FirstName,
             MiddleName, LastName, Email, Cell, Language, SecLan, ParentAEmail, ParentBEmail, 
             ParentAName, ParentBName,
             AgeGrade, Grade, Address1, Address2, City, State, ZipCode, Country,  GMT
             AcademyId, ScreenName, Photo, Status, ParentConsent, userId)
        VALUES ('${fname}', '${mname}', '${sname}','${email}','${cell}',
        '${lang}', '${secLan}', '${parentAEmail}', '${parentBEmail}', 
        '${parentAName}', '${parentBName}','${is_18}', '${grade}', '${add1}','${add2}','${city}','${state}',
         '${zipCode}',
        '${country}','${timeZone}',
         '${UserId}','${screenName}','${photo}', 'Pending', '${parentConsent}','${userId}')`)

        let result = await records.rowsAffected[0] === 1 ? true : false
        //console.log(result, 'boolean...')
        return (result);
    }

    let update_student_data = async (poolConnection) => {
        let records = await poolConnection.request().query(`UPDATE "StudentSetup" 
        set Photo = '${photo}', Address1 = '${add1}', Address2 = '${add2}', City = '${city}',
         State = '${state}', ZipCode = '${zipCode}', Country = '${country}', 
          Email = '${email}', Cell = '${cell}', FirstName='${fname}',LastName='${sname}',
          MiddleName='${mname}', GMT = '${timeZone}', Language='${lang}', AgeGrade='${is_18}',
         Grade='${grade}', ParentConsent='${parentConsent}', SecLan = '${secLan}', 
         ParentAEmail='${parentAEmail}', ParentBEmail='${parentBEmail}', 
          ParentAName='${parentAName}', ParentBName='${parentBName}', ScreenName= '${screenName}'
          WHERE CONVERT(VARCHAR, AcademyId) = '${acadId}'`)

        let result = await records.rowsAffected[0] === 1 ? true : false
        return (result);
    }
}

let get_student_setup = (req, res) => {
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        if (poolConnection) {
            poolConnection.request().query(
                findByAnyIdColumn('StudentSetup', req.query)
            )
                .then((result) => {
                    res.status(200).send(result.recordset)
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).send({ message: "Failed to fetch student record!" })
                })
        }

    })
}

let get_student_grade = (req, res) => {
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        // console.log(poolConnection._connected)
        if (poolConnection) {
            poolConnection.request().query(
                `
                    SELECT * From Grade 
                `
            )
                .then((result) => {
                    res.status(200).send(result.recordset)
                    //result.recordset.map(item => item.AcademyId === user_id ? item : null)
                })
            //   .catch(err => console.log(err))

        }

    })
}

let get_tutor_subject = async (req, res) => {
    try {
        marom_db(async (config) => {
            try {
                let { subject } = req.query;

                const poolConnection = await sql.connect(config);
                if (poolConnection) {
                    const subjects = await poolConnection.request().query(`SELECT 
                    SubjectRates.*,
                    edu.*,
                    TutorSetup.ResponseHrs as responseTime, 
                    TutorSetup.Status as status,
                    TutorRates.CancellationPolicy as cancPolicy
                    FROM SubjectRates
                    JOIN TutorSetup ON cast(TutorSetup.AcademyId as varchar(max)) = 
                    cast(SubjectRates.AcademyId as varchar(max))
                    JOIN TutorRates ON cast(TutorRates.AcademyId as varchar(max)) = 
                    cast(SubjectRates.AcademyId as varchar(max))
                    JOIN Education as edu ON
                    cast(TutorSetup.AcademyId as varchar(max)) =  cast(edu.AcademyId as varchar(max))
                    WHERE CONVERT(VARCHAR, SubjectRates.faculty) = '${subject}';`)

                    res.status(200).send(subjects.recordset)
                }
            }
            catch (err) {
                console.log(err)
                res.status(400).send({ message: err.message })
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({ message: err.message })
    }
}

let upload_student_short_list = async (req, res) => {

    let book = []
    let { items } = req.body;
    //1 0 4
    let checkDuplicates = async (subject, AcademyId, Student) => {

        let response = await connecteToDB
            .then((poolConnection) =>
                poolConnection.request().query(`SELECT * from StudentShortList 
                WHERE CONVERT(VARCHAR, Student)  =  '${Student}' AND
                 CONVERT(VARCHAR, AcademyId) =  '${AcademyId}' AND CONVERT(VARCHAR, Subject) =  '${subject}'`)
                    .then((result) => {

                        return result.recordset

                    })
                    .catch(err => console.log(err))
            )


        return response.length > 0 ? false : true;
    }

    let uploadData = (list) => {
        connecteToDB
            .then((poolConnection) =>
                poolConnection.request().query(`INSERT INTO StudentShortList 
                (Subject,AcademyId,date,ScreenName,Rate,Student) values('${list[1]}', '${list[0]}',
                 '${Date().toString()}', '${list[3]}', '${list[2]}', '${list[4]}')`)
                    .then((result) => {

                        book.push(result.rowsAffected[0]);

                        if (book.subjectLength === items) {

                            res.send(result.rowsAffected[0] === 1 ? true : false)

                        }

                    })
                    .catch(err => console.log(err))
            )
    }


    items.map(async (item) => {
        console.log(item, 'inside items');
        let list = item.split('-');

        let bool = await checkDuplicates(list[1], list[0], list[4])
        if (bool) { uploadData(list) }
    })
}

const get_student_short_list = async (req, res) => {
    try {
        marom_db(async (config) => {
            let poolConnection = await sql.connect(config);
            let result = await poolConnection.request().query(
                `SELECT SSL.*, TR.*, SR.rate as rate, TS.*
                FROM StudentShortList SSL
                left JOIN TutorRates TR ON 
                    CONVERT(VARCHAR(MAX), SSL.AcademyId) = CONVERT(VARCHAR(MAX), TR.AcademyId)   
                join TutorSetup as TS ON
                    CONVERT(VARCHAR(MAX), SSL.AcademyId) = CONVERT(VARCHAR(MAX), TS.AcademyId)   
                inner join SubjectRates as SR ON
                    cast(SR.AcademyId as VARCHAR(MAX)) =  cast( TR.AcademyId as VARCHAR(MAX)) and      
                    cast(SR.subject as VARCHAR(MAX)) =  cast( SSL.Subject as VARCHAR(MAX))   
                WHERE cast( SSL.Student as varchar) = cast('${req.params.student}' as varchar) AND
                TS.Status = 'active'
                `
            );

            res.status(200).send(result.recordset);
        })
    } catch (err) {
        console.log(err);
        res.status(400).send({ message: err.message })
    }
};

const update_shortlist = async (req, res) => {
    try {
        const query = update("StudentShortList", req.body, req.params, {
            AcademyId: "varchar",
            Student: "varchar", Subject: "varchar"
        })
        const result = await executeQuery(query, res);
        if (result?.recordset?.length === 0) {
            throw new Error('Update failed: Record not found');
        }
        // res.status(200).send(result?.recordset)
    } catch (error) {
        console.error('Error in updateRecord:', error.message);
        res.status(400).send(error)

    }
}

let get_my_data = async (req, res) => {
    let { AcademyId } = req.query;
    let books = []


    let response_0 = (resolve) => {
        marom_db(async (config) => {
            const sql = require('mssql');
            var poolConnection = await sql.connect(config);

            const result = await poolConnection.request().query(`SELECT * from StudentSetup 
            WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}' `)
            let record = result.recordset[0] || {}
            if (record.userId) {
                const { recordset } = await poolConnection.request().query(
                    findByAnyIdColumn('Users1', { SID: record.userId })
                )
                record = { ...record, Email: recordset[0].email }
            }
            const recordsets = [record]
            books.push(recordsets);
            resolve()
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



    let sender = (cb) => {
        //response_0(cb)

        new Promise((resolve) => {
            response_1(resolve)
        })
            .then(() => {
                response_0(cb)
            })
        //   .catch(err => console.log(err))
    }

    sender(async () => {
        let record = books[1][0] || {}

        const offset = parseInt(record.GMT, 10);
        let timezones = moment.tz.names().filter(name =>
            (moment.tz(name).utcOffset()) === offset * 60);
        const timeZone = timezones[0] || null

        const formattedResult = [books[0], [[{ ...record, timeZone }]]];
        res.send(formattedResult)
    })

}

let get_student_short_list_data = (req, res) => {

    connecteToDB.then(poolConnection =>
        poolConnection.request().query(`SELECT * From StudentShortList WHERE CONVERT(VARCHAR, Student) =  '${req.query.id}'`)
            .then((result) => {

                res.send(result.recordset);
            })
        //   .catch(err => console.log(err))
    )


}

let get_student_market_data = async (req, res) => {

    let { id } = req.query;


    let StudentData = await connecteToDB.then(poolConnection =>
        poolConnection.request().query(`SELECT * From StudentSetup WHERE CONVERT(VARCHAR, AcademyId) =  '${id}'`)
            .then((result) => {

                return (result.recordset);
            })
        //   .catch(err => console.log(err))
        //   .catch(err => console.log(err))
    )

    let Exprience = await connecteToDB.then(poolConnection =>
        poolConnection.request().query(`SELECT * FROM Experience`)
            .then((result) => {

                return (result.recordset);
            })
        //   .catch(err => console.log(err))
    )

    let EducationalLevel = await connecteToDB.then(poolConnection =>
        poolConnection.request().query(`SELECT * FROM EducationalLevel`)
            .then((result) => {

                return (result.recordset);
                //res.status(200).send()
                //console.log(result)
                //SELECT * From Education  WHERE CONVERT(VARCHAR, AcademyId) =  '${subject}'  
            })
        //   .catch(err => console.log(err))
        //   .catch(err => console.log(err))
    )

    let CertificateTypes = await connecteToDB.then(poolConnection =>
        poolConnection.request().query(`SELECT * FROM CertificateTypes`)
            .then((result) => {

                return (result.recordset);
                //res.status(200).send()
                //console.log(result)
                //SELECT * From Education  WHERE CONVERT(VARCHAR, AcademyId) =  '${subject}'  
            })
        //   .catch(err => console.log(err))
        //   .catch(err => console.log(err))
    )

    let Subjects = await connecteToDB.then(poolConnection =>
        poolConnection.request().query(`SELECT Id,FacultyId,SubjectName FROM Subjects`)
            .then((result) => {

                return (result.recordset);
                //res.status(200).send()
                //console.log(result)
                //SELECT * From Education  WHERE CONVERT(VARCHAR, AcademyId) =  '${subject}'  
            })
        //   .catch(err => console.log(err))
        //   .catch(err => console.log(err))
    )

    let Faculty = await connecteToDB.then(poolConnection =>
        poolConnection.request().query(`SELECT * FROM Faculty`)
            .then((result) => {

                return (result.recordset);
                //res.status(200).send()
                //console.log(result)
                //SELECT * From Education  WHERE CONVERT(VARCHAR, AcademyId) =  '${subject}'  
            })
        //   .catch(err => console.log(err))
        //   .catch(err => console.log(err))
    )

    let GMT = await connecteToDB.then(poolConnection =>
        poolConnection.request().query(`SELECT * FROM GMT`)
            .then((result) => {

                return (result.recordset);
                //res.status(200).send()
                //console.log(result)
                //SELECT * From Education  WHERE CONVERT(VARCHAR, AcademyId) =  '${subject}'  
            })
        //   .catch(err => console.log(err))
        //   .catch(err => console.log(err))
    )

    new Promise((resolve, reject) => {
        resolve(StudentData)
    })
        .then((StudentData) => {
            return { StudentData, Exprience }
        })
        .then(({ StudentData, Exprience }) => {
            return { StudentData, EducationalLevel, Exprience }
        })
        .then(({ StudentData, EducationalLevel, Exprience }) => {
            return { StudentData, EducationalLevel, Exprience, CertificateTypes }
        })
        .then(({ StudentData, EducationalLevel, Exprience, CertificateTypes }) => {
            return { StudentData, EducationalLevel, Exprience, CertificateTypes, Subjects }
        })
        .then(({ StudentData, EducationalLevel, Exprience, CertificateTypes, Subjects }) => {
            return { StudentData, EducationalLevel, Exprience, CertificateTypes, Subjects, Faculty }
        })
        .then(({ StudentData, EducationalLevel, Exprience, CertificateTypes, Subjects }) => {
            return { StudentData, EducationalLevel, Exprience, CertificateTypes, Subjects, Faculty, GMT }
        })
        .then((result) => {
            res.send(result)
        })


}


const post_student_bookings = async (req, res) => {
    const { tutorId, studentId } = req.body;
    if (tutorId && studentId) {
        connecteToDB.then(poolConnection =>
            poolConnection.request().query(
                find('StudentBookings', { studentId, tutorId })
            )
                .then((result) => {
                    if (result.recordset.length) {
                        connecteToDB.then(poolConnection =>
                            poolConnection.request().query(
                                update('StudentBookings', req.body,
                                    { studentId: req.body.studentId, tutorId: req.body.tutorId }
                                )
                            )
                                .then((result) => res.send(result.recordset))
                            //   .catch(err => console.log(err))
                        )

                    }
                    else {
                        connecteToDB.then(poolConnection =>
                            poolConnection.request().query(
                                insert('StudentBookings', req.body)
                            )
                                .then((result) => {
                                    res.send(result.recordset);
                                })
                            //   .catch(err => console.log(err))
                        )
                    }
                })
            //   .catch(err => console.log(err))
        )
    }
    else {
        res.status(400).send({ message: `missing params tutorId/studentId` })
    }
}

const get_student_or_tutor_bookings = async (req, res) => {
    const { tutorId, studentId } = req.params;
    connecteToDB.then(poolConnection =>
        poolConnection.request().query(
            find('StudentBookings', { studentId, tutorId }, 'OR')
        )
            .then((result) => {
                res.send(result.recordset);
            })
        //   .catch(err => console.log(err))
    )
}

const get_student_bookings = async (req, res) => {
    const { studentId } = req.params;
    connecteToDB.then(poolConnection =>
        poolConnection.request().query(
            find('StudentBookings', { studentId })
        )
            .then((result) => {
                res.send(result.recordset);
            })
        //   .catch(err => console.log(err))
    )
}

const get_tutor_bookings = async (req, res) => {
    const { tutorId } = req.params;
    connecteToDB.then(poolConnection =>
        poolConnection.request().query(
            find('StudentBookings', { tutorId })
        )
            .then((result) => {
                res.send(result.recordset);
            })
        //   .catch(err => console.log(err))
    )
}

const get_student_bank_details = async (req, res) => {
    marom_db(async (config) => {
        try {
            const sql = require('mssql');
            const poolConnection = await sql.connect(config);

            if (poolConnection) {
                const result = await poolConnection.request().query(
                    findByAnyIdColumn('StudentBank', req.params, 'Varchar')
                );

                res.status(200).send(result.recordset);
            }
        } catch (err) {
            console.log(err);
            res.status(400).send({ message: err.message });
        }
    })
}

const post_student_bank_details = async (req, res) => {
    marom_db(async (config) => {
        try {
            const sql = require('mssql');
            const poolConnection = await sql.connect(config);

            if (poolConnection) {
                const result = await poolConnection.request().query(
                    findByAnyIdColumn('StudentBank', { AcademyId: req.body.AcademyId }, 'varchar')
                );
                if (result.recordset.length) {
                    await poolConnection.request().query(
                        update('StudentBank', req.body, { AcademyId: req.body.AcademyId })
                    );
                }
                else {
                    await poolConnection.request().query(
                        insert('StudentBank', req.body)
                    );
                }

                res.status(200).send(result.recordset);
            }
        } catch (err) {
            console.log(err);
            res.status(400).send({ message: err.message });
        }
    })
}

const get_student_feedback = async (req, res) => {
    marom_db(async (config) => {
        try {
            const sql = require('mssql');
            const poolConnection = await sql.connect(config);

            if (poolConnection) {
                const result = await poolConnection.request().query(
                    findByAnyIdColumn('Feedback', req.params, 'Varchar')
                );

                res.status(200).send(result.recordset);
            }
        } catch (err) {
            console.log(err);
            res.status(400).send({ message: err.message });
        }
    })
}

const post_student_feedback = async (req, res) => {
    marom_db(async (config) => {
        try {
            const sql = require('mssql');
            const poolConnection = await sql.connect(config);

            if (poolConnection) {
                const result = await poolConnection.request().query(
                    findByAnyIdColumn('Feedback', { AcademyId: req.body.ShortlistId }, 'varchar')
                );
                if (result.recordset.length) {
                    await poolConnection.request().query(
                        update('StudentBank', req.body, { AcademyId: req.body.ShortlistId })
                    );
                }
                else {
                    await poolConnection.request().query(
                        insert('Feedback', req.body)
                    );
                }

                res.status(200).send(result.recordset);
            }
        } catch (err) {
            console.log(err);
            res.status(400).send({ message: err.message });
        }
    })
}

const payment_report = async (req, res) => {
    const { studentId } = req.params;
    marom_db(async (config) => {
        try {
            const sql = require('mssql');
            const poolConnection = await sql.connect(config);

            if (poolConnection) {
                const result = await poolConnection.request().query(
                    `SELECT 
                   b.studentId AS studentId,
                   b.tutorId AS tutorId,
                   b.reservedSlots AS reservedSlots,
                   b.bookedSlots AS bookedSlots,
                   r.rate AS rate
                    FROM StudentBookings AS b
                    JOIN StudentShortList AS r ON
                    b.studentId  = CAST( r.Student as varchar(max)) AND 
                    b.tutorId =  CAST(r.AcademyId as varchar(max))
                    inner join TutorSetup AS ts On
                    ts.AcademyId = CAST(r.AcademyId as varchar(max))
                    WHERE b.studentId = CAST('${studentId}' as varchar(max)); `
                );

                res.status(200).send(result.recordset);
            }
        } catch (err) {
            console.log(err);
            res.status(400).send({ message: err.message });
        }
    })
}

const get_feedback_questions = async (req, res) => {
    marom_db(async (config) => {
        try {
            const sql = require('mssql');
            const poolConnection = await sql.connect(config);

            if (poolConnection) {
                const result = await poolConnection.request().query(
                    getAll('FeedbackQuestions')
                );

                res.status(200).send(result.recordset);
            }
        } catch (err) {
            console.log(err);
            res.status(400).send({ message: err.message });
        }
    })
}

const get_feedback_of_questions = async (req, res) => {
    marom_db(async (config) => {
        try {
            const sql = require('mssql');
            const poolConnection = await sql.connect(config);

            if (poolConnection) {
                const result = await poolConnection.request().query(
                    `SELECT fq.questionText as questionText, f.rating as star, fq.SID as SID
                  FROM Feedback f
                  JOIN feedbackQuestions fq ON f.feedbackQuestionsId = fq.SID
                  WHERE f.StudentId = '${req.params.StudentId}'
                  AND f.TutorId = '${req.params.TutorId}'
                  AND f.SessionId = '${req.params.SessionId}'`
                );

                res.status(200).send(result.recordset);
            }
        } catch (err) {
            console.log(err);
            res.status(400).send({ message: err.message });
        }
    })
}

const post_feedback_questions = async (req, res) => {
    marom_db(async (config) => {
        try {
            const sql = require('mssql')
            const poolConnection = await sql.connect(config);
            if (poolConnection) {
                let result
                result = await poolConnection.request().query(
                    `SELECT * FROM Feedback WHERE SessionId = '${req.body.SessionId}'
                     AND TutorId = '${req.body.TutorId}' AND FeedBackQuestionsId = ${req.body.FeedbackQuestionsId}`
                );
                if (result.recordset.length) {
                    result = await poolConnection.request().query(
                        update('Feedback', req.body, {
                            SessionId: req.body.SessionId,
                            TutorId: req.body.TutorId,
                            FeedBackQuestionsId: req.body.FeedbackQuestionsId
                        })
                    );
                }
                else {
                    result = await poolConnection.request().query(
                        insert('Feedback', req.body)
                    );
                }

                res.status(200).send(result.recordset);
            }
        } catch (err) {
            console.log(err);
            res.status(400).send({ message: err.message });
        }
    })
}

function getBookedSlot(req, res) {

    let { AcademyId } = req.query;
    marom_db(async (config) => {
        try {
            const sql = require('mssql');

            var poolConnection = await sql.connect(config);
            if (poolConnection) {
                const result = await poolConnection.request().query(
                    `
                    SELECT bookedSlots From StudentBookings 
                    WHERE CONVERT(VARCHAR, studentId) = '${AcademyId}'
                `
                )
                res.status(200).send(result.recordset)
            }
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }

    })
}

const post_student_agreement = async (req, res) => {
    marom_db(async (config) => {
        try {
            const sql = require('mssql')
            const poolConnection = await sql.connect(config);
            if (poolConnection) {
                const result = await poolConnection.request().query(
                    update('StudentSetup', req.body, req.params)
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

const set_code_applied = async (req, res) => {
    marom_db(async (config) => {
        try {
            const sql = require('mssql')
            const poolConnection = await sql.connect(config);
            if (poolConnection) {

                const { recordset: tutorRateRecord } = await poolConnection.request().query(
                    find('TutorRates', { AcademyId: req.params.tutorId }, 'AND', { AcademyId: 'varchar' })
                )
                console.log(tutorRateRecord)
                if (tutorRateRecord[0].CodeStatus === 'used') throw new Error('Code Already Used!')

                const { recordset: updatedTutorRateRecord } = await poolConnection.request().query(
                    update('TutorRates', { CodeStatus: 'used' }, { AcademyId: req.params.tutorId }, { AcademyId: 'varchar' })
                )
                if (!updatedTutorRateRecord.length) throw new Error('Code does not exist!')
                const { recordset: updatedStudenTutorCodeStatus } = await poolConnection.request().query(
                    update('StudentShortList', { CodeApplied: true },
                        {
                            AcademyId: req.params.tutorId,
                            Student: req.params.studentId,
                            Subject: updatedTutorRateRecord[0].CodeSubject
                        },
                        { AcademyId: 'varchar', Student: 'varchar', Subject: 'varchar' })
                )

                if (!updatedStudenTutorCodeStatus.length) {
                    const { recordset: SubjectRate } = await poolConnection.request().query(
                        find('SubjectRates', {
                            AcademyId: req.params.tutorId,
                            Subject: updatedTutorRateRecord[0].CodeSubject
                        }, 'AND', { AcademyId: 'varchar', Subject: 'varchar' })
                    )

                    console.log(SubjectRate, updatedTutorRateRecord)
                    if (!SubjectRate[0].rate) throw new Error('Invalid Code!')

                    await poolConnection.request().query(
                        insert('StudentShortList',
                            {
                                CodeApplied: true,
                                AcademyId: req.params.tutorId,
                                Student: req.params.studentId,
                                Subject: updatedTutorRateRecord[0].CodeSubject,
                                Rate: SubjectRate[0].rate,
                                ScreenName: req.params.tutorId,
                                date: new Date().toLocaleString()
                            },
                            { AcademyId: 'varchar', Student: 'varchar', Subject: 'varchar', ScreenName: 'varchar' })
                    )
                }

                res.status(200).send({ message: 'Code applied status changed succesfully' });
            }
        }
        catch (err) {
            console.log(err)
            res.status(400).send({ message: err.message })
        }
    })
}

const get_published_ads = async (req, res) => {
    marom_db(async (config) => {
        try {
            const sql = require('mssql')
            const poolConnection = await sql.connect(config);
            if (poolConnection) {
                const result = await poolConnection.request().query(
                    find('TutorAds', { Status: 'published' })
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

const get_all_students_sessions_formatted = async (req, res) => {
    marom_db(async (config) => {
        try {
            const sql = require('mssql')
            const poolConnection = await sql.connect(config);
            if (poolConnection) {
                const { recordset } = await poolConnection.request().query(
                    `select sb.*, ss.GMT
                    from StudentBookings as sb
                    join StudentSetup as ss on
                    cast(ss.AcademyId as varchar) = sb.studentId
                    where sb.studentId = '${req.params.studentId}'
                    `
                )

                if (recordset[0]) {
                    const offset = parseInt(recordset[0].GMT, 10);
                    let timezones = moment.tz.names().filter(name =>
                        (moment.tz(name).utcOffset()) === offset * 60);
                    const timeZone = timezones[0] || null

                    let reservedSlots = [];
                    let bookedSlots = []
                    recordset.map(record => {
                        reservedSlots.push(JSON.parse(record.reservedSlots));
                        bookedSlots.push(JSON.parse(record.bookedSlots))
                        return
                    })

                    // const allSessions

                    const allSessions = (reservedSlots.concat(bookedSlots)).flat()

                    const currentTime = moment().tz(timeZone)
                    const sortedEvents = allSessions.sort((a, b) => moment(a.start).diff(moment(b.start)));
                    const upcomingSession = sortedEvents.find(event => moment(event.start).isAfter(currentTime)) || {};
                    const timeUntilStart = upcomingSession.id ?
                        moment(upcomingSession.start).tz(timeZone).to(currentTime, true) : '';
                    let inMins = false
                    if (timeUntilStart.includes('minutes') || timeUntilStart.includes('minute')) {
                        inMins = true
                    }

                    res.status(200).send({ sessions: allSessions, upcomingSession, inMins, upcomingSessionFromNow: timeUntilStart })
                }
                else {
                    res.status(200).send({ sessions: [], upcomingSession: {}, inMins: false, upcomingSessionFromNow: '' })
                }
            }
        }
        catch (err) {
            console.log(err)
            res.status(400).send({ message: err.message })
        }
    })
}

module.exports = {
    post_feedback_questions,
    set_code_applied,
    update_shortlist,
    get_all_students_sessions_formatted,
    post_student_agreement,
    get_feedback_of_questions,
    get_feedback_questions,
    upload_setup_info,
    get_student_setup,
    get_student_grade,
    get_published_ads,
    getBookedSlot,
    get_tutor_subject,
    get_student_short_list,
    upload_student_short_list,
    get_student_short_list_data,
    get_student_market_data,
    get_my_data,
    get_student_bookings,
    post_student_bookings,
    get_student_or_tutor_bookings,
    get_tutor_bookings,
    get_student_bank_details,
    post_student_bank_details,
    get_student_feedback,
    post_student_feedback,
    payment_report
}
