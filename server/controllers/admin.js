const { marom_db } = require('../db');
const { shortId } = require('../modules');



let get_tutor_data = (req,res) => {
    marom_db(async(config) => {
        const sql = require('mssql');
    
        var poolConnection = await sql.connect(config);
       // console.log(poolConnection._connected)
        if(poolConnection){
            poolConnection.request().query(
                `
                    SELECT * From TutorSetup 
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

let set_tutor_status = (req, res) => {
    let{Id, Status} = req.body;
    marom_db(async(config) => {
        const sql = require('mssql');
    
        var poolConnection = await sql.connect(config);
       // console.log(poolConnection._connected)
        if(poolConnection){
            poolConnection.request().query(
                `
                    UPDATE TutorSetup SET Status = '${Status}' WHERE CONVERT(VARCHAR, AcademyId) = '${Id}'
                `
            )
            .then((result) => {
                
                result.rowsAffected[0] === 1 ? res.status(200).send({bool: true, mssg: 'Tutor status was updated successfully'}) : res.status(200).send({bool: false, mssg: 'Tutor status was not updated successfully please try'})

                //result.recordset.map(item => item.AcademyId === user_id ? item : null)
            })
            .catch(err =>
                res.status(200).send({bool: false, mssg: 'Database Error, Please Try Again...'})
            )

        }
    
    })
}


let get_student_data = (req,res) => {
    marom_db(async(config) => {
        const sql = require('mssql');
    
        var poolConnection = await sql.connect(config);
       // console.log(poolConnection._connected)
        if(poolConnection){
            poolConnection.request().query(
                `
                    SELECT * From StudentSetup 
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

let set_student_status = (req, res) => {
    let{Id, Status} = req.body;
    marom_db(async(config) => {
        const sql = require('mssql');
    
        var poolConnection = await sql.connect(config);
       // console.log(poolConnection._connected)
        if(poolConnection){
            poolConnection.request().query(
                `
                    UPDATE StudentSetup SET Status = '${Status}' WHERE CONVERT(VARCHAR, AcademyId) = '${Id}'
                `
            )
            .then((result) => {
                
                result.rowsAffected[0] === 1 ? res.status(200).send({bool: true, mssg: 'Student status was updated successfully'}) : res.status(200).send({bool: false, mssg: 'Tutor status was not updated successfully please try'})

                //result.recordset.map(item => item.AcademyId === user_id ? item : null)
            })
            .catch(err =>
                res.status(200).send({bool: false, mssg: 'Database Error, Please Try Again...'})
            )

        }
    
    })
}


module.exports = {
    get_tutor_data,
    get_student_data,
    set_tutor_status,
    set_student_status
}
