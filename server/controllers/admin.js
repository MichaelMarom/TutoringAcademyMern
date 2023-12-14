const { marom_db, connecteToDB } = require('../db');
const { insert, update } = require('../helperfunctions/crud_queries');
const { shortId } = require('../modules');



let get_tutor_data = (req, res) => {
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        // console.log(poolConnection._connected)
        if (poolConnection) {
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
    let { Id, Status } = req.body;
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        // console.log(poolConnection._connected)
        if (poolConnection) {
            poolConnection.request().query(
                `
                    UPDATE TutorSetup SET Status = '${Status}' WHERE CONVERT(VARCHAR, AcademyId) = '${Id}'
                `
            )
                .then((result) => {

                    result.rowsAffected[0] === 1 ? res.status(200).send({ bool: true, mssg: 'Tutor status was updated successfully' }) : res.status(200).send({ bool: false, mssg: 'Tutor status was not updated successfully please try' })

                    //result.recordset.map(item => item.AcademyId === user_id ? item : null)
                })
                .catch(err =>
                    res.status(200).send({ bool: false, mssg: 'Database Error, Please Try Again...' })
                )

        }

    })
}


let get_student_data = (req, res) => {
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        // console.log(poolConnection._connected)
        if (poolConnection) {
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
    let { Id, Status } = req.body;
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        // console.log(poolConnection._connected)
        if (poolConnection) {
            poolConnection.request().query(
                `
                    UPDATE StudentSetup SET Status = '${Status}' WHERE CONVERT(VARCHAR, AcademyId) = '${Id}'
                `
            )
                .then((result) => {

                    result.rowsAffected[0] === 1 ? res.status(200).send({ bool: true, mssg: 'Student status was updated successfully' }) : res.status(200).send({ bool: false, mssg: 'Tutor status was not updated successfully please try' })

                    //result.recordset.map(item => item.AcademyId === user_id ? item : null)
                })
                .catch(err =>
                    res.status(200).send({ bool: false, mssg: 'Database Error, Please Try Again...' })
                )

        }

    })
}

let get_tutor_new_subject = async (req, res) => {
    marom_db(async (config) => {
        try {
            const sql = require('mssql');
            const poolConnection = await sql.connect(config);

            if (poolConnection) {
                const result = await poolConnection.request().query(
                    `SELECT * From NewTutorSubject as ts 
                        join TutorSetup as t on t.AcademyId = CAST(ts.AcademyId as varchar(max)) `
                );
                res.status(200).send(result.recordset);
            }
        }
        catch (err) {
            res.status(400).send({ message: err.message })
        }
    })
}



let accept_new_subject = async (req, res) => {
    let { id, subject, AcademyId } = req.body;

    let insert = await connecteToDB
        .then(async (poolConnection) => {

            const query = `INSERT INTO Subjects (FacultyId, SubjectName, CreatedOn) 
               VALUES ('${id}', '${subject}', GETUTCDATE())`;
            console.log(query)
            const result = await poolConnection.request().query(query)
            return result.rowsAffected[0] === 1 ? true : false
        })
        .catch(() => {
            res.status(200).send({ bool: false, mssg: 'Database Error, Please Try Again...' })
            return;
        })


    if (insert) {

        connecteToDB
            .then(async (poolConnection) => {
                poolConnection.request().query(` DELETE FROM NewTutorSubject WHERE CONVERT(VARCHAR, subject) = '${subject}' 
                AND CONVERT(VARCHAR, AcademyId) = '${AcademyId}' `)
                    .then((result) => {
                        result.rowsAffected[0] === 1 ? res.status(200).send({ bool: true, mssg: 'Data was uploaded successfully' }) : res.status(200).send({ bool: false, mssg: 'Database Error, Please Try Again...' })
                    })
                    .catch(err => console.log(err))
            })
            .catch(() =>
                res.status(200).send({ bool: false, mssg: 'Database Error, Please Try Again...' })
            )

    } else {
        console.log('error inserting data to db')
        res.status(200).send({ bool: false, mssg: 'Database Error, Please Try Again...' })
    }
}


let decline_new_subject = (req, res) => {
    let { subject, AcademyId } = req.body;


    connecteToDB
        .then(async (poolConnection) => {
            poolConnection.request().query(`Update NewTutorSubject set IsRejected = 1 
            WHERE CONVERT(VARCHAR, subject) = '${subject}' AND CONVERT(VARCHAR, AcademyId) = '${AcademyId}' `)
                .then((result) => {

                    result.rowsAffected[0] === 1 ? res.status(200).send({ bool: true, mssg: 'Data was uploaded successfully' }) : res.status(200).send({ bool: false, mssg: 'Error uploading files, Please Try Again...' })

                })
                .catch(err => console.log(err))

        })
        .catch((err) => {
            res.status(200).send({ bool: false, mssg: 'Database Error, Please Try Again...' })
            console.log(err)
        })


}
const postTerms = async (req, res) => {
    await marom_db(async (config) => {
        const sql = require('mssql');
        const poolConnection = await sql.connect(config);
        try {
            // Check if there's an existing record for the tutorId
            const existingRecord =
                await poolConnection.request().query(`
          SELECT * FROM Constants WHERE ID = 1
        `);

            if (existingRecord.recordset.length) {
                // Update the existing record

                    if (poolConnection) {
                        const result = await poolConnection.request().query(update('Constants', req.body,{ID:1}));

                        if (result.rowsAffected[0] === 1) {
                            res.status(200).json(result.recordset[0]);
                        } else {
                            res.status(500).json({ success: false, message: 'Failed to update terms.' });
                        }
                    }
            } else {
                // Insert a new record
                if (poolConnection) {
                    const result = await poolConnection.request().query(
                        insert('Constants', req.body)
                    );

                    if (result.rowsAffected[0] === 1) {
                        res.status(200).json({ success: true, message: 'Terms stored successfully.' });
                    } else {
                        res.status(500).json({ success: false, message: 'Failed to store terms.' });
                    }
                }

            }
        }

        catch (error) {
            console.error('Error storing terms:', error.message);
            res.status(500).json({ success: false, message: 'Internal server error.' });
        }
    })
};
let get_Constants = (req, res) => {
    marom_db(async (config) => {
        const sql = require('mssql');

        var poolConnection = await sql.connect(config);
        // console.log(poolConnection._connected)
        if (poolConnection) {
            poolConnection.request().query(
                `
                    SELECT * From Constants where ID = 1 
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
    postTerms,
    get_Constants,
    get_tutor_data,
    get_student_data,
    set_tutor_status,
    set_student_status,
    get_tutor_new_subject,
    accept_new_subject,
    decline_new_subject
}
