const { marom_db, connecteToDB } = require('../db');
const {express, path, fs, parser, cookieParser, mocha, morgan, io, cors, shortId, jwt} = require('../modules');
require('dotenv').config();


let upload_form_one = (req,res) => {
    
    let {fname,mname,sname,email,lang,is_18,pwd,cell,grade,add1,add2,city,state,zipCode,country,timeZone,parent_fname,parent_lname,parent_email,photo,acadId} = req.body;
    console.log('data: ',fname,mname,sname,email,lang,is_18,pwd,cell,grade,add1,add2,city,state,zipCode,country,timeZone,parent_fname,parent_lname,parent_email,acadId)

    let UserId = mname.length > 0 ? fname + '.' + ' ' + mname[0] + '.' + ' ' + sname[0] + shortId.generate() : fname + '.' + ' ' + sname[0] + shortId.generate();

    let screenName = mname.length > 0 ?  fname + '.' + ' ' + mname[0] + '.' + ' ' + sname[0] : fname + '.' + ' ' + sname[0];


    let action = cb => {
        marom_db(async(config) => {
            const sql = require('mssql');
            var poolConnection = await sql.connect(config);

            let result = poolConnection ? await get_action(poolConnection) : 'connection error';
            cb(result);

        })
    }

    action((result) => {

        if(result){

            let db = marom_db(async(config) => {

                const sql = require('mssql');
                var poolConnection = await sql.connect(config);

                //let result = poolConnection ? await insert_student_data(poolConnection) : 'connection error';

                insert_student_data(poolConnection)
                .then((result) => {
                    res.send({user: UserId, screen_name: screenName, bool: true, mssg: 'Data Was Saved Successfully', type: 'save'}) 
                })
                .catch((err) => {
                    res.send({user: UserId, screen_name: screenName, bool: false, mssg: 'Data Was Not Saved Successfully Due To Database Malfunction, Please Try Again.'})
                    console.log(err)

                })
                
            })
            
        }else{

            let db = marom_db(async(config) => {

                const sql = require('mssql');
                var poolConnection = await sql.connect(config);

               // let result = poolConnection ? await update_student_data(poolConnection) : 'connection error';
                update_student_data(poolConnection)
                .then((result) => {
                    res.send({user: UserId, screen_name: screenName, bool: true, mssg: 'Data Was Updated Successfully', type: 'update'})
                })
                .catch((err) => {
                    res.send({user: UserId, screen_name: screenName, bool: false, mssg: 'Data Was Not Updated Successfully Due To Database Malfunction, Please Try Again.'})
                    console.log(err)
                })
                //res.send({user: UserId, screen_name: screenName, bool: true, mssg: 'Data Was Updated Successfully'})

            })

        }
    })



   


    
    let get_action = async(poolConnection) => {
        let records = await poolConnection.request().query(`SELECT * FROM "StudentSetup" WHERE CONVERT(VARCHAR, Email) = '${email.length > 8 ? email : null}'`)
        let get_duplicate = await records.recordset;

        let result = get_duplicate.length > 0 ? false : true;
        return(result);
    }

    let insert_student_data = async(poolConnection) => {
        let records = await poolConnection.request().query(`INSERT INTO StudentSetup(FirstName, MiddleName, LastName, Email, Password, Cell, Language, AgeGrade, Grade, Address1, Address2, City, State, ZipCode, Country,  GMT, ParentEmail, ParentFirstName, ParentLastName, AcademyId, ScreenName, Photo, Status)
        VALUES ('${fname}', '${mname}', '${sname}','${email}','${pwd}','${cell}','${lang}', '${is_18}', '${grade}', '${add1}','${add2}','${city}','${state}', '${zipCode}','${country}','${timeZone}','${parent_email}','${parent_fname}','${parent_lname}', '${UserId}','${screenName}','${photo}', 'Pending')`)

        let result =  await records.rowsAffected[0] === 1 ? true : false
        //console.log(result, 'boolean...')
        return(result);
    }

    let update_student_data = async(poolConnection) => {
        let records = await poolConnection.request().query(`UPDATE "StudentSetup" set Photo = '${photo}', Address1 = '${add1}', Address2 = '${add2}', City = '${city}', State = '${state}', ZipCode = '${zipCode}', Country = '${country}', Email = '${email}', Cell = '${cell}', GMT = '${timeZone}', Password = '${pwd}', Language='${lang}', AgeGrade='${is_18}', Grade='${grade}', ParentEmail='${parent_email}', ParentFirstName='${parent_fname}', ParentLastName='${parent_lname}'  WHERE CONVERT(VARCHAR, AcademyId) = '${acadId}'`)

        let result =  await records.rowsAffected[0] === 1 ? true : false
        return(result);
    }
    
} 


let get_student_setup = (req,res) => {
    let {id} = req.query;
    console.log(id)
    marom_db(async(config) => {
        const sql = require('mssql');
    
        var poolConnection = await sql.connect(config);
       // console.log(poolConnection._connected)
        if(poolConnection){
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

let get_student_grade = (req,res) => {
    marom_db(async(config) => {
        const sql = require('mssql');
    
        var poolConnection = await sql.connect(config);
       // console.log(poolConnection._connected)
        if(poolConnection){
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

let get_tutor_subject = async(req,res) => {

    let {subject} = req.query;
    console.log(subject)
    let book = {}
    let document = []
    let subjectLength = 0

    let subjects = async() =>  await connecteToDB.then(poolConnection => 
        poolConnection.request().query( `SELECT * From SubjectRates  WHERE CONVERT(VARCHAR, faculty) =  '${subject}'` )
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
    
    let edu = (subjectsBook) =>  connecteToDB.then(poolConnection => 
        poolConnection.request().query( `SELECT * From Education  WHERE CONVERT(VARCHAR, AcademyId) =  '${subjectsBook.AcademyId}'` )
        .then((result) => {

            return result.recordset
            //res.status(200).send()
            //console.log(result)
            //SELECT * From Education  WHERE CONVERT(VARCHAR, AcademyId) =  '${subject}'  
        })
        .catch(err => console.log(err))
    )

    let tutor = (subjectsBook) =>  connecteToDB.then(poolConnection => 
        poolConnection.request().query( `SELECT TutorScreenname From TutorSetup  WHERE CONVERT(VARCHAR, AcademyId) =  '${subjectsBook.AcademyId}'` )
        .then(async(result) => {

            //return book[subjectsBook.AcademyId] = [...await edu(subjectsBook.AcademyId), ...result.recordset, subjectsBook]

            return result.recordset
           
        })
        .catch(err => console.log(err))
    )



    async function extratInfo(){
        let subject = await subjects();
        if(subject.length > 0){

            subject.map((async(item) => {
                let tutorData = await tutor(item);
                let tutorEducation = await edu(item)

                book[shortId.generate()] = [(item),...tutorEducation,...tutorData];
                if(Object.keys(book).length === subjectLength){
                    
                    let data = Object.values(book)
                    console.log('data')
                    res.status(200).send(data)
                }else{
                    console.log(Object.keys(book).length, subjectLength)
                }
                
            })) 
        }else{res.status(200).send([])}
    }

    extratInfo()



    
}

let upload_student_short_list = async(req,res) => {

    let book = []
    let {items} = req.body;

    

    let checkDuplicates = async(subject,AcademyId) => {

        let response  = await  connecteToDB
        .then((poolConnection) => 
            poolConnection.request().query( `select * from StudentShortList WHERE CONVERT(VARCHAR, AcademyId) =  '${AcademyId}' AND CONVERT(VARCHAR, Subject) =  '${subject}'` )
            .then((result) => {

                return result.recordset
                //res.status(200).send()
                //SELECT * From Education  WHERE CONVERT(VARCHAR, AcademyId) =  '${subject}'  
            })
            .catch(err => console.log(err))
        )


        return response.length > 0 ? false : true;
    }

    let uploadData = (list) => {
        connecteToDB
        .then((poolConnection) => 
            poolConnection.request().query( `INSERT INTO StudentShortList (Subject,AcademyId,date,ScreenName,Rate) values('${list[1]}', '${list[0]}', '${Date().toString()}', '${list[3]}', '${list[2]}')` )
            .then((result) => {

                book.push(result.rowsAffected[0]);
                if(book.subjectLength === items){
                    res.send(result.rowsAffected[0] === 1 ? true : false)

                }

                //res.status(200).send()
                //SELECT * From Education  WHERE CONVERT(VARCHAR, AcademyId) =  '${subject}'  
            })
            .catch(err => console.log(err))
        )
    }

    let deleteData = (subject,AcademyId) => {
        connecteToDB
        .then((poolConnection) => 
            poolConnection.request().query( `DELETE FROM StudentShortList WHERE CONVERT(VARCHAR, AcademyId) =  '${AcademyId}' AND CONVERT(VARCHAR, Subject) =  '${subject}'` )
            .then((result) => {

                book.push(result.rowsAffected[0]);
                if(book.subjectLength === items){
                    res.send(result.rowsAffected[0] === 1 ? true : false)

                }

                //res.status(200).send()
                //SELECT * From Education  WHERE CONVERT(VARCHAR, AcademyId) =  '${subject}'  
            })
            .catch(err => console.log(err))
        )
    }


    items.map(async(item) => {

        let list = item.split('-');

        let bool = await checkDuplicates(list[1],list[0])
        if(bool){ uploadData(list) } //else{deleteData(list[1],list[0])}

        

    })
}


let get_student_short_list = (req,res) => {
    let book = {}
    let document = [];

    let tutors =  async() =>  await connecteToDB.then(poolConnection => 
        poolConnection.request().query( `SELECT * From StudentShortList` )
        .then((result) => {
            return result.recordset;
            //res.status(200).send()
            //console.log(result)
            //SELECT * From Education  WHERE CONVERT(VARCHAR, AcademyId) =  '${subject}'  
        })
        .catch(err => console.log(err))
    )

    let getTutorDemo = async(tutor) => {
        let tutorList = await tutors();
        tutorList.map((item, index) => {
            connecteToDB.then(poolConnection => 
                poolConnection.request().query( `SELECT FreeDemoLesson From TutorRates
                WHERE CONVERT(VARCHAR, AcademyId) = '${item.AcademyId}'` )
                .then((result) => {

                    book[item.AcademyId] = [item,result.recordset[0], tutor[index]]

                    if(index + 1 === tutorList.length){
                        res.send(Object.values(book))
                    }
                  
                })
                .catch(err => console.log(err))
            )
        })
    }

   
    let getTutorData = async() => {

        let tutorList = await tutors();
        tutorList.map((item, index) => {
            connecteToDB.then(poolConnection => 
                poolConnection.request().query( `SELECT *  From TutorSetup WHERE CONVERT(VARCHAR, AcademyId) = '${item.AcademyId}'` )
                .then((result) => {

                    document.push(result.recordset);
                    if(index + 1 === tutorList.length){
                        getTutorDemo(document)
                    }
                  
                })
                .catch(err => console.log(err))
            )
        })
    }


    getTutorData();

    
}


let get_student_short_list_data = (req,res) => {

    connecteToDB.then(poolConnection => 
        poolConnection.request().query( `SELECT * From StudentShortList` )
        .then((result) => {

            res.send(result.recordset);
            //res.status(200).send()
            //console.log(result)
            //SELECT * From Education  WHERE CONVERT(VARCHAR, AcademyId) =  '${subject}'  
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
    get_student_short_list_data
}

