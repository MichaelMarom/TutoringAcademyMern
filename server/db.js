const { express,path,fs,parser,cookieParser,mocha,mongodb,morgan,io,cors,shortId,jwt } = require('./modules');
const mysql = require('mysql');
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
let {MongoClient} = mongodb

let ConnectToMongoDb = async(cb) => {
    let localUri = 'mongodb://localhost:27017'
    let uri = "mongodb+srv://marom:A!nianuli82003@cluster0.f0ldt6w.mongodb.net/?retryWrites=true&w=majority";
    let client = new MongoClient(localUri);
    //let conn = await client.connect();
    cb(client)
}

let marom_db  = async(cb) => {
    const sql = require('mssql');

    const config = {
        user: 'michael', // better stored in an app setting such as process.env.DB_USER
        password: '43Naomi333', // better stored in an app setting such as process.env.DB_PASSWORD
        server: 'tutoringacademy.database.windows.net', // better stored in an app setting such as process.env.DB_SERVER
        port: 1433, // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
        database: 'Tutoringacademy', // better stored in an app setting such as process.env.DB_NAME
        authentication: {
            type: 'default'
        },
        
        options: {
            encrypt: true,
            "requestTimeout": 300000
        }
    }

    cb(config)
}

/*let knex = require('knex')({
    client: 'mssql',
    connection: {
      host : 'tutoringacademy.database.windows.net',
      port : 1433,
      user : 'michael',
      password : '43Naomi333',
      database : 'Tutoringacademy'
    },
    dialect: 'mssql',
    dialectOptions: { 
      options: {
        encrypt: true
      }
    }
  });
*/


const knex = require('knex')({
  client: 'mssql',
  connection: {
    options: {
      mapBinding: value => {
        // bind all strings to varchar instead of nvarchar
        if (typeof value === 'string') {
          return {
            type: TYPES.VarChar,
            value
          };
        }

        // allow devs to pass tedious type at query time
        if (value != null && value.type) {
          return {
            type: value.type,
            value: value.value
          };
        }

        // undefined is returned; falling back to default mapping function
      },
      encrypt: true
    },
    host : 'tutoringacademy.database.windows.net',
    port : 1433,
    user : 'michael',
    password : '43Naomi333',
    database : 'Tutoringacademy'

  }
});

module.exports = {
    ConnectToMongoDb,
    marom_db,
    knex
}