const { marom_db, connecteToDB } = require('../db');
const { insert, find, findByAnyIdColumn, update } = require('../helperfunctions/crud_queries');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    // const { password } = req.body;
    // const hashedPassword = await bcrypt.hash(password, 10);

    marom_db(async (config) => {
        try {
            const sql = require('mssql');
            const poolConnection = await sql.connect(config);
            console.log(req.body)

            if (poolConnection) {
                const result = await poolConnection.request().query(
                    insert('Users1', req.body)
                );
                res.status(200).send(result.recordset);
            }
        } catch (err) {
            console.log(err);
            if (err.message.includes('UNIQUE KEY constraint')) {
                res.status(400).send({ message: "Email already exist" });
            }
            else res.status(400).send({ message: "Failed to Register User" });
        }
    })
};

const login = async (req, res) => {
    marom_db(async (config) => {
        try {
            const sql = require('mssql');
            const poolConnection = await sql.connect(config);
            if (poolConnection) {
                const result = await poolConnection.request().query(
                    find('Users', { email: req.body.email })
                );

                if (result.recordset.length === 0) {
                    throw new Error('Authentication Failed!');
                }

                const passwordMatch = await bcrypt.compare(req.body.password, result.recordset[0].password);
                if (!passwordMatch) {
                    throw new Error('Authentication Failed!');
                }

                const token = jwt.sign(req.body, process.env.JWTSECRETKEY, {
                    expiresIn: '1h',
                });

                res.status(200).send({ ...result.recordset, token });
            }
        } catch (err) {
            console.log(err.message);
            res.status(400).send({ message: err.message });
        }
    })
};

const get_user_detail = async (req, res) => {
    marom_db(async (config) => {
        try {
            const sql = require('mssql');
            const poolConnection = await sql.connect(config);

            if (poolConnection) {
                const result = await poolConnection.request().query(
                    findByAnyIdColumn('Users', req.params)
                );

                res.status(200).send(result.recordset[0]);
            }
        } catch (err) {
            console.log(err);
            res.status(400).send({ message: err.message });
        }
    })
}

const get_setup_detail = async (req, res) => {
    marom_db(async (config) => {
        try {
            const { role, userId } = req.params
            const sql = require('mssql');
            const poolConnection = await sql.connect(config);

            if (poolConnection) {
                let result;
                if (role === 'tutor') {
                    result = await poolConnection.request().query(
                        find('TutorSetup', { userId }, 'AND', { userId: 'varchar(max)' })
                    );
                }
                else {
                    result = await poolConnection.request().query(
                        find('StudentSetup', { userId }, 'AND', { userId: 'varchar(max)' })
                    )
                }
                res.status(200).send(result.recordset[0]);
            }
        } catch (err) {
            console.log(err);
            res.status(400).send({ message: err.message });
        }
    })
}

const forget_password = async (req, res) => {
    const { email } = req.params;
    marom_db(async (config) => {
        try {
            const sql = require('mssql');
            const poolConnection = await sql.connect(config);

            if (poolConnection) {
                const result = await poolConnection.request().query(
                    findByAnyIdColumn('Users', req.params)
                );
                if (!result.recordset.length) throw new Error(`user with email = ${email} not found`);
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                const updateData = await poolConnection.request().query(
                    update('Users', { password: hashedPassword }, { email })
                );

                res.status(200).send(updateData.recordset[0]);
            }
        } catch (err) {
            console.log(err);
            res.status(400).send({ message: err.message });
        }
    })
}

module.exports = {
    login,
    get_user_detail,
    forget_password,
    signup,
    get_setup_detail
};
