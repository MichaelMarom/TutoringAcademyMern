const { app } = require('@azure/functions');
const { Connection, Request } = require('tedious');
require('dotenv').config();

const config = {
    "server": process.env.SQL_SERVER,
    "authentication": {
        "type": "default",
        "options": {
            "userName": process.env.SQL_USERNAME,
            "password": process.env.SQL_PASSWORD
        }
    },
    "options": {
        "port": 1433,
        "database": "Tutoringacademy",
        "trustServerCertificate": true
    }

};

app.timer('newtriggerexpre', {
    schedule: '0 0 0 * * *',
    handler: (myTimer, context) => {
        getTutorAds(context)
            .then(data => {
                    // context.done();
            })
            .catch(err => {
                console.log(`ERROR: ${err}`);
            });
    }
});


/**
 * 
 * @returns Promise Object - return tutorAds array
 */
function getTutorAds() {
    return new Promise((resolve, reject) => {
        try {
            const connection = new Connection(config);
            // const query = 'Select * from TutorAds'
            const query = `
            UPDATE TutorAds
            SET Status = 'expired', Published_At = NULL
            WHERE Published_At < DATEADD(DAY, -7, GETDATE())`;

            connection.on('connect', err => {
                if (err) {
                    console.log(err);
                    reject(err);
                }

                const request = new Request(query, err => {
                    if (err) {
                        console.log(err);
                        reject(err);
                    } else {
                        console.log("Update successful");
                        resolve(); // Assuming resolve() is defined somewhere in your code
                    }
                });

                connection.execSql(request);
            });
            connection.connect();
        }
        catch (err) {
            context.log(err)
        }
    });
}
