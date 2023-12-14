const { marom_db } = require('../db');
const { getAll, insert, find, update } = require('../helperfunctions/crud_queries');

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const fetch_chats = async (req, res) => {

    marom_db(async (config) => {
        try {
            const sql = require('mssql');
            const poolConnection = await sql.connect(config);

            if (poolConnection) {
                const result = await poolConnection.request().query(
                    req.params.role === 'student' ?
                        `Select ch.ChatID, ch.LastSeen, ts.AcademyId, ch.User1ID,ch.UnRead, ch.User2ID, 
                        ts.Photo, ts.FirstName, ts.LastName,
                    ts.Online from Chat as ch join TutorSetup as ts on ts.AcademyId = ch.User2ID
                     WHERE User1ID = '${req.params.userId}' OR User2ID = '${req.params.userId}'` :
                        `Select ch.ChatID, ch.LastSeen, ts.AcademyId,ch.User1ID,ch.UnRead, ch.User2ID, ts.Photo, 
                        ts.FirstName, ts.LastName,ts.Online from Chat as ch join StudentSetup as ts on 
                        cast(ts.AcademyId as varchar)= ch.User1ID
                      WHERE User1ID = '${req.params.userId}' OR User2ID = '${req.params.userId}'`
                );

                const formatedResult = result.recordset.map(record => ({
                    id: record.ChatID,
                    name: `${capitalizeFirstLetter(record.FirstName)} ${capitalizeFirstLetter(record.LastName)}`,
                    avatarSrc: record.Photo,
                    unread: record.UnRead,
                    online: record.Online,
                    AcademyId: record.AcademyId
                }))

                res.status(200).send(formatedResult);
            }
        } catch (err) {
            console.log(err);
            res.status(400).send({ message: err.message });
        }
    })
};

const fetch_chat_messages = async (req, res) => {

    marom_db(async (config) => {
        try {
            const sql = require('mssql');
            const poolConnection = await sql.connect(config);

            if (poolConnection) {
                const result = await poolConnection.request().query(
                    `
                    SELECT * FROM Message AS ms JOIN (
                      SELECT CAST(AcademyId AS VARCHAR(MAX)) AS AcademyId, CAST(Photo AS VARCHAR(MAX))
                    AS Photo, CAST(FirstName AS VARCHAR(MAX)) AS FirstName, 
                    CAST(LastName AS VARCHAR(MAX)) AS LastName FROM StudentSetup
                    UNION
                        SELECT CAST(AcademyId AS VARCHAR(MAX)) AS AcademyId, CAST(Photo AS VARCHAR(MAX))
                        AS Photo, CAST(FirstName AS VARCHAR(MAX)) AS FirstName,
                        CAST(LastName AS VARCHAR(MAX)) AS LastName FROM TutorSetup
                        ) AS combinedSetup ON ms.Sender = combinedSetup.AcademyId
                     WHERE ms.ChatID = ${req.params.chatId}
                     ORDER BY Date DESC
                     `
                );
                const formatedResult = result.recordset.map(record =>
                ({
                    id: record.MessageID,
                    text: record.Text,
                    date: record.Date,
                    senderId: record.Sender,
                    photo: record.Photo,
                    name: `${capitalizeFirstLetter(record.FirstName)} ${capitalizeFirstLetter(record.LastName)}`
                }))
                formatedResult.sort((a, b) => new Date(a.date) - new Date(b.date));

                res.status(200).send(formatedResult);
            }
        } catch (err) {
            console.log(err);
            res.status(400).send({ message: err.message });
        }
    })
};

const post_message = async (req, res) => {
    marom_db(async (config) => {
        try {
            const sql = require('mssql');
            const poolConnection = await sql.connect(config);

            if (poolConnection) {
                const result = await poolConnection.request().query(
                    insert("Message", req.body)
                );

                res.status(200).send(result.recordset);
            }
        } catch (err) {
            console.log(err);
            res.status(400).send({ message: err.message });
        }
    })
};

const create_chat = async (req, res) => {
    marom_db(async (config) => {
        try {
            const sql = require('mssql');
            const poolConnection = await sql.connect(config);

            if (poolConnection) {
                const data = await poolConnection.request().query(
                    find("Chat", req.body)
                );
                if (!data.recordset.length) {
                    const result = await poolConnection.request().query(
                        insert("Chat", req.body)
                    );
                    res.status(200).send(result.recordset);
                    return
                }
                res.status(200).send([])
            }
        } catch (err) {
            console.log(err);
            res.status(400).send({ message: err.message });
        }
    })
}


const set_status = async (req, res) => {
    marom_db(async (config) => {
        try {
            const sql = require('mssql');
            const poolConnection = await sql.connect(config);
            const tableName = req.params.role === 'tutor' ? "TutorSetup" : 'StudentSetup'

            if (poolConnection) {
                const data = await poolConnection.request().query(
                    update(tableName, req.body, { AcademyId: req.params.AcademyId }, { AcademyId: 'varchar' })
                );
                res.status(200).send(data)
            }
        } catch (err) {
            console.log(err);
            res.status(400).send({ message: err.message });
        }
    })
}

module.exports = {
    fetch_chats,
    fetch_chat_messages,
    post_message,
    create_chat,
    set_status
}
