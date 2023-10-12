const { marom_db, connecteToDB } = require('../db');
const { insert, getAll, findById, findByAnyIdColumn, update, find } = require('../helperfunctions/crud_queries');
const { express, path, fs, parser, cookieParser, mocha, morgan, io, cors, shortId, jwt } = require('../modules');
require('dotenv').config();


let upload_form_one = (req, res) => {

    let { fname, mname, sname, email, lang, is_18, pwd, cell, grade, add1, add2, city, state, zipCode, country, timeZone, parent_fname, parent_lname, parent_email, photo, acadId, parentConsent } = req.body;
    console.log('data: ', fname, mname, sname, email, lang, is_18, pwd, cell, grade, add1, add2, city, state, zipCode, country, timeZone, parent_fname, parent_lname, parent_email, acadId)

    let UserId = mname.length > 0 ? fname + '.' + ' ' + mname[0] + '.' + ' ' + sname[0] + shortId.generate() : fname + '.' + ' ' + sname[0] + shortId.generate();

    let screenName = mname.length > 0 ? fname + '.' + ' ' + mname[0] + '.' + ' ' + sname[0] : fname + '.' + ' ' + sname[0];


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

                //let result = poolConnection ? await insert_student_data(poolConnection) : 'connection error';

                insert_student_data(poolConnection)
                    .then((result) => {
                        res.send({ user: UserId, screen_name: screenName, bool: true, mssg: 'Data Was Saved Successfully', type: 'save' })
                    })
                    .catch((err) => {
                        res.send({ user: UserId, screen_name: screenName, bool: false, mssg: 'Data Was Not Saved Successfully Due To Database Malfunction, Please Try Again.' })
                        console.log(err)

                    })

            })

        } else {

            let db = marom_db(async (config) => {

                const sql = require('mssql');
                var poolConnection = await sql.connect(config);

                // let result = poolConnection ? await update_student_data(poolConnection) : 'connection error';
                update_student_data(poolConnection)
                    .then((result) => {
                        res.send({ user: UserId, screen_name: screenName, bool: true, mssg: 'Data Was Updated Successfully', type: 'update' })
                    })
                    .catch((err) => {
                        res.send({ user: UserId, screen_name: screenName, bool: false, mssg: 'Data Was Not Updated Successfully Due To Database Malfunction, Please Try Again.' })
                        console.log(err)
                    })
                //res.send({user: UserId, screen_name: screenName, bool: true, mssg: 'Data Was Updated Successfully'})

            })

        }
    })







    let get_action = async (poolConnection) => {
        let records = await poolConnection.request().query(`SELECT * FROM "StudentSetup" WHERE CONVERT(VARCHAR, Email) = '${email.length > 8 ? email : null}'`)
        let get_duplicate = await records.recordset;

        let result = get_duplicate.length > 0 ? false : true;
        return (result);
    }

    let insert_student_data = async (poolConnection) => {
        let records = await poolConnection.request().query(`INSERT INTO StudentSetup(FirstName, MiddleName, LastName, Email, Password, Cell, Language, AgeGrade, Grade, Address1, Address2, City, State, ZipCode, Country,  GMT, ParentEmail, ParentFirstName, ParentLastName, AcademyId, ScreenName, Photo, Status, ParentConsent)
        VALUES ('${fname}', '${mname}', '${sname}','${email}','${pwd}','${cell}','${lang}', '${is_18}', '${grade}', '${add1}','${add2}','${city}','${state}', '${zipCode}','${country}','${timeZone}','${parent_email}','${parent_fname}','${parent_lname}', '${UserId}','${screenName}','${photo}', 'Pending', '${parentConsent}')`)

        let result = await records.rowsAffected[0] === 1 ? true : false
        //console.log(result, 'boolean...')
        return (result);
    }

    let update_student_data = async (poolConnection) => {
        let records = await poolConnection.request().query(`UPDATE "StudentSetup" set Photo = '${photo}', Address1 = '${add1}', Address2 = '${add2}', City = '${city}', State = '${state}', ZipCode = '${zipCode}', Country = '${country}', Email = '${email}', Cell = '${cell}', GMT = '${timeZone}', Password = '${pwd}', Language='${lang}', AgeGrade='${is_18}', Grade='${grade}', ParentEmail='${parent_email}', ParentFirstName='${parent_fname}', ParentConsent='${parentConsent}', ParentLastName='${parent_lname}'  WHERE CONVERT(VARCHAR, AcademyId) = '${acadId}'`)

        let result = await records.rowsAffected[0] === 1 ? true : false
        return (result);
    }

}


let get_student_setup = (req, res) => {
    let { id } = req.query;
    console.log(id)
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        // console.log(poolConnection._connected)
        if (poolConnection) {
            poolConnection.request().query(
                `
                    SELECT * From StudentSetup WHERE CONVERT(VARCHAR, AcademyId) = '${id}' 
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
                .catch(err => console.log(err))

        }

    })
}

let get_tutor_subject = async (req, res) => {

    let { subject } = req.query;
    console.log(subject)
    let book = {}
    let document = []
    let subjectLength = 0

    let subjects = async () => await connecteToDB.then(poolConnection =>
        poolConnection.request().query(`SELECT * From SubjectRates  WHERE CONVERT(VARCHAR, faculty) =  '${subject}'`)
            .then((result) => {
                subjectLength = result.recordset.length;
                console.log(result)
                return result.recordset;
                //res.status(200).send()
                //console.log(result)
                //SELECT * From Education  WHERE CONVERT(VARCHAR, AcademyId) =  '${subject}'  
            })
            .catch(err => console.log(err))
    )

    let edu = (subjectsBook) => connecteToDB.then(poolConnection =>
        poolConnection.request().query(`SELECT * From Education  WHERE CONVERT(VARCHAR, AcademyId) =  '${subjectsBook.AcademyId}'`)
            .then((result) => {

                return result.recordset
                //res.status(200).send()
                //console.log(result)
                //SELECT * From Education  WHERE CONVERT(VARCHAR, AcademyId) =  '${subject}'  
            })
            .catch(err => console.log(err))
    )

    let tutor = (subjectsBook) => connecteToDB.then(poolConnection =>
        poolConnection.request().query(`SELECT TutorScreenname From TutorSetup  WHERE CONVERT(VARCHAR, AcademyId) =  '${subjectsBook.AcademyId}'`)
            .then(async (result) => {

                //return book[subjectsBook.AcademyId] = [...await edu(subjectsBook.AcademyId), ...result.recordset, subjectsBook]

                return result.recordset

            })
            .catch(err => console.log(err))
    )



    async function extratInfo() {
        let subject = await subjects();
        if (subject.length > 0) {

            subject.map((async (item) => {
                let tutorData = await tutor(item);
                let tutorEducation = await edu(item)

                book[shortId.generate()] = [(item), ...tutorEducation, ...tutorData];
                if (Object.keys(book).length === subjectLength) {

                    let data = Object.values(book)
                    console.log('data')
                    res.status(200).send(data)
                } else {
                    console.log(Object.keys(book).length, subjectLength)
                }

            }))
        } else { res.status(200).send([]) }
    }

    extratInfo()




}

let upload_student_short_list = async (req, res) => {

    let book = []
    let { items } = req.body;



    let checkDuplicates = async (subject, AcademyId, Student) => {

        let response = await connecteToDB
            .then((poolConnection) =>
                poolConnection.request().query(`SELECT * from StudentShortList WHERE CONVERT(VARCHAR, Student) =  '${Student}' AND CONVERT(VARCHAR, AcademyId) =  '${AcademyId}' AND CONVERT(VARCHAR, Subject) =  '${subject}'`)
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
                poolConnection.request().query(`INSERT INTO StudentShortList (Subject,AcademyId,date,ScreenName,Rate,Student) values('${list[1]}', '${list[0]}', '${Date().toString()}', '${list[3]}', '${list[2]}', '${list[4]}')`)
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

        let list = item.split('-');

        let bool = await checkDuplicates(list[1], list[0], list[4])
        if (bool) { uploadData(list) }



    })
}


let get_student_short_list = async (req, res) => {
    let tutorUserData = []
    let tutorDemoLesson = []

    let shortList = (() =>

        connecteToDB.then((poolConnection) =>
            poolConnection.request().query(`SELECT * From StudentShortList
            WHERE CONVERT(VARCHAR, Student) =  '${req.query.student}'
            ` )
                .then((result) => {
                    return result.recordset;
                })
                .catch(err => console.log(err))
        )
            .catch(err => console.log(err))
    )

    let getTutorDemo = async (item, shortList) => (
        //WHERE CONVERT(VARCHAR, AcademyId) = '${item.AcademyId}'
        connecteToDB.then(poolConnection =>
            poolConnection.request().query(`SELECT FreeDemoLesson,AcademyId From TutorRates
            `)
                .then((result) => {
                    //book[item.AcademyId] = [item,result.recordset[0], document[index]]
                    tutorDemoLesson.push(result.recordset)
                    /*if(tutorDemoLesson.length === shortList.length){
                        return tutorDemoLesson;
                    }*/
                    return tutorDemoLesson;
                })
                .catch(err => console.log(err))
        )


    )


    // WHERE CONVERT(VARCHAR, AcademyId) = '${item.AcademyId}'
    let getTutorDataViaShortList = ((item, shortList) =>

        connecteToDB.then((poolConnection) =>
            poolConnection.request().query(`SELECT * From TutorSetup`)
                .then((result) => {
                    tutorUserData.push(result.recordset);
                    //console.log(result.recordset.length)
                    /*if(tutorUserData.length === shortList.length){
                        return tutorUserData;
                    } */
                    return tutorUserData;
                })
                .catch(err => console.log(err))
        )



    )

    return new Promise(async (resolve, reject) => {
        let studentShortList = await shortList()
        resolve(studentShortList)
    })
        .then(async (studentShortList) => {
            /*let tutorProfile = await studentShortList.map((item) => {
                let response =  getTutorDataViaShortList(item,studentShortList);
                return response
            })*/
            let tutorProfile = await getTutorDataViaShortList();
            //return response
            return { studentShortList, tutorProfile }
        })
        .then(async ({ studentShortList, tutorProfile }) => {
            /*let demoLesson = studentShortList.map((item) => {
                let response =  getTutorDemo();
                return response
            })*/
            let demoLesson = await getTutorDemo();
            return { tutorProfile, demoLesson, studentShortList }
        })
        .catch((err) => {
            console.log(err);
        })
        .then(({ tutorProfile, demoLesson, studentShortList }) => {
            let studentBook = [];

            studentShortList.map((item, index) => {
                let tutorData = tutorProfile[0].filter(tutor => tutor.AcademyId === item.AcademyId)[0]
                let tutorDemoLesson = demoLesson[0].filter(tutor => tutor.AcademyId === item.AcademyId)[0]
                let bookName = shortId.generate();

                bookName = {
                    'tutorDemoLesson': tutorDemoLesson,
                    'tutorData': tutorData,
                    'tutorShortList': item
                };

                studentBook.push(bookName)

                if (studentBook.length === studentShortList.length) {
                    res.status(200).send(Object.values(studentBook))
                }
            })
        })





}

let get_my_data = async (req, res) => {
    let { AcademyId } = req.query;
    let books = []

    console.log(AcademyId)

    let response_0 = (resolve) => {
        marom_db(async (config) => {
            const sql = require('mssql');
            var poolConnection = await sql.connect(config);

            poolConnection.request().query(`SELECT * from StudentSetup WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}' `)
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



    let sender = (cb) => {
        //response_0(cb)

        new Promise((resolve) => {
            response_1(resolve)
        })
            .then(() => {
                response_0(cb)
            })
            .catch(err => console.log(err))
    }

    sender(() => {
        console.log(books)
        res.send(books)
    })








    //console.log(response_0, response_1);
}

let get_student_short_list_data = (req, res) => {

    connecteToDB.then(poolConnection =>
        poolConnection.request().query(`SELECT * From StudentShortList WHERE CONVERT(VARCHAR, Student) =  '${req.query.id}'`)
            .then((result) => {

                res.send(result.recordset);
                //res.status(200).send()
                //console.log(result)
                //SELECT * From Education  WHERE CONVERT(VARCHAR, AcademyId) =  '${subject}'  
            })
            .catch(err => console.log(err))
    )


}

let get_student_market_data = async (req, res) => {

    let { id } = req.query;


    let StudentData = await connecteToDB.then(poolConnection =>
        poolConnection.request().query(`SELECT * From StudentSetup WHERE CONVERT(VARCHAR, AcademyId) =  '${id}'`)
            .then((result) => {

                return (result.recordset);
                //res.status(200).send()
                //console.log(result)
                //SELECT * From Education  WHERE CONVERT(VARCHAR, AcademyId) =  '${subject}'  
            })
            .catch(err => console.log(err))
            .catch(err => console.log(err))
    )

    let Exprience = await connecteToDB.then(poolConnection =>
        poolConnection.request().query(`SELECT * FROM Experience`)
            .then((result) => {

                return (result.recordset);
                //res.status(200).send()
                //console.log(result)
                //SELECT * From Education  WHERE CONVERT(VARCHAR, AcademyId) =  '${subject}'  
            })
            .catch(err => console.log(err))
            .catch(err => console.log(err))
    )

    let EducationalLevel = await connecteToDB.then(poolConnection =>
        poolConnection.request().query(`SELECT * FROM EducationalLevel`)
            .then((result) => {

                return (result.recordset);
                //res.status(200).send()
                //console.log(result)
                //SELECT * From Education  WHERE CONVERT(VARCHAR, AcademyId) =  '${subject}'  
            })
            .catch(err => console.log(err))
            .catch(err => console.log(err))
    )

    let CertificateTypes = await connecteToDB.then(poolConnection =>
        poolConnection.request().query(`SELECT * FROM CertificateTypes`)
            .then((result) => {

                return (result.recordset);
                //res.status(200).send()
                //console.log(result)
                //SELECT * From Education  WHERE CONVERT(VARCHAR, AcademyId) =  '${subject}'  
            })
            .catch(err => console.log(err))
            .catch(err => console.log(err))
    )

    let Subjects = await connecteToDB.then(poolConnection =>
        poolConnection.request().query(`SELECT Id,FacultyId,SubjectName FROM Subjects`)
            .then((result) => {

                return (result.recordset);
                //res.status(200).send()
                //console.log(result)
                //SELECT * From Education  WHERE CONVERT(VARCHAR, AcademyId) =  '${subject}'  
            })
            .catch(err => console.log(err))
            .catch(err => console.log(err))
    )

    let Faculty = await connecteToDB.then(poolConnection =>
        poolConnection.request().query(`SELECT * FROM Faculty`)
            .then((result) => {

                return (result.recordset);
                //res.status(200).send()
                //console.log(result)
                //SELECT * From Education  WHERE CONVERT(VARCHAR, AcademyId) =  '${subject}'  
            })
            .catch(err => console.log(err))
            .catch(err => console.log(err))
    )

    let GMT = await connecteToDB.then(poolConnection =>
        poolConnection.request().query(`SELECT * FROM GMT`)
            .then((result) => {

                return (result.recordset);
                //res.status(200).send()
                //console.log(result)
                //SELECT * From Education  WHERE CONVERT(VARCHAR, AcademyId) =  '${subject}'  
            })
            .catch(err => console.log(err))
            .catch(err => console.log(err))
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
                            .catch(err => console.log(err)))

                }
                else {
                    connecteToDB.then(poolConnection =>
                        poolConnection.request().query(
                            insert('StudentBookings', req.body)
                        )
                            .then((result) => {
                                res.send(result.recordset);
                            })
                            .catch(err => console.log(err))
                    )
                }
            })
            .catch(err => console.log(err))
    )
}

const get_student_bookings = async (req, res) => {
    const { tutorId, studentId } = req.params;
    connecteToDB.then(poolConnection =>
        poolConnection.request().query(
            find('StudentBookings', { studentId, tutorId })
        )
            .then((result) => {
                res.send(result.recordset[0]);
            })
            .catch(err => console.log(err))
    )
}

module.exports = {
    upload_form_one,
    get_student_setup,
    get_student_grade,
    get_tutor_subject,
    get_student_short_list,
    upload_student_short_list,
    get_student_short_list_data,
    get_student_market_data,
    get_my_data,
    get_student_bookings,
    post_student_bookings
}
