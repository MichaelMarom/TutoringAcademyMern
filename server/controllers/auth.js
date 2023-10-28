const { marom_db, connecteToDB } = require('../db');
const { insert, find, findByAnyIdColumn } = require('../helperfunctions/crud_queries');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    marom_db(async (config) => {
        try {
            const sql = require('mssql');
            const poolConnection = await sql.connect(config);

            if (poolConnection) {
                const result = await poolConnection.request().query(
                    insert('Users', { ...req.body, password: hashedPassword })
                );
                res.status(200).send(result.recordset);
            }
        } catch (err) {
            console.log(err);
            res.status(400).send({ error: err.message });
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
            console.log(err);
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

                res.status(200).send(result.recordset[0] );
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
    signup,
};
