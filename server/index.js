

const { express,path,Pusher,fs,parser,cookieParser,mocha,mongodb,morgan,io,cors,shortId,jwt} = require('./modules');
const {ConnectToMongoDb, marom_db, sql, connecteToDB} = require('./db')
const { STUDENT_ROUTES } = require('./routes/student');
const { ADMIN_ROUTES } = require('./routes/admin');
const { TUTOR_ROUTES } = require('./routes/tutor');



require('dotenv').config();

const app = express();
app.use(cors({origin: '*'}))
app.use(TUTOR_ROUTES);
app.use(ADMIN_ROUTES);
app.use(STUDENT_ROUTES);
app.use(morgan('tiny')); 


var server = app.listen(process.env.PORT,_ => console.log('app is live @',process.env.PORT));


io(server, {cors: {origin: '*'}}).on('connection', socket => {

    socket.on('studentIllShorList', ({id}) => {

        let deleteData = (subject,AcademyId,Student) => {
            connecteToDB
            .then((poolConnection) => 
                poolConnection.request().query( `DELETE FROM StudentShortList WHERE  CONVERT(VARCHAR, Student) =  '${Student}' AND CONVERT(VARCHAR, AcademyId) =  '${AcademyId}' AND CONVERT(VARCHAR, Subject) =  '${subject}'` )
                .then((result) => {
    
                    console.log('deleted data successfully')
    
                    //res.status(200).send()
                    //SELECT * From Education  WHERE CONVERT(VARCHAR, AcademyId) =  '${subject}'  
                })
                .catch(err => console.log(err))
            )
        }
        let list = id.id.split('-');
        deleteData(list[1],list[0],list[4]);
    })  



    socket.on('join-room', (room_id, user_id)=> {

        socket.join(room_id);
        socket.broadcast.to(room_id).emit("user-connected", user_id);

        socket.on('disconnect', () => {
            socket.broadcast.to(room_id).emit('user-disconnected', user_id);
        })

    });


    socket.on('canvas-start', (pX, pY, color, thickness, fill)=> {
        socket.broadcast.emit('canvas-start', pX, pY, color, thickness, fill)
        
    });

    socket.on('email', (email)=> {

        marom_db(async(config) => {
            const sql = require('mssql');
            console.log('uploading data...')
        
            var poolConnection = await sql.connect(config);
            let records = await poolConnection.request().query(`SELECT * FROM "TutorSetup" WHERE CONVERT(VARCHAR, Email) = '${email}'`)
            let get_duplicate = records.recordset;

            let result = get_duplicate.length > 0 ? false : true;

            if(!result){
                socket.emit('email', false);

            }else{
                socket.emit('email', true);
            }

        })
        
    });

    socket.on('tool', (tool)=> {
        socket.broadcast.emit('tool', tool)
        console.log(tool)
        
    });

    socket.on('fill', (checkbox)=> {
        socket.broadcast.emit('fill', checkbox)
        
    });

    socket.on('eraser-width', (value)=> {
        socket.broadcast.emit('eraser-width', value)
    });

    socket.on('note', ({txt, y, x})=> {
        socket.broadcast.emit('note', txt, y, x)
    });

    socket.on('img', ({img, y, x})=> {
        socket.broadcast.emit('img', img, y, x)
    });

    socket.on('accessGranted', () => {
        socket.broadcast.emit('accessGranted')
    });

    socket.on('accessRestricted', () => {
        socket.broadcast.emit('accessRestricted')
    });


    socket.on('canvas-move', (tool, cX, cY, oX, oY, pX, pY)=> {
        socket.broadcast.emit('canvas-move', cX, cY, oX, oY, pX, pY)
        
    });

    socket.on('canvas-end', () => {
        socket.broadcast.emit('canvas-end', {})
        
    });


    socket.on('permissiontoUseBoardTools', id => {
        socket.broadcast.emit('permissiontoUseBoardTools', id)
    })

    socket.on('PermissionResponse', action => {
        socket.broadcast.emit('PermissionResponse', action)
    })

    socket.on('NewLecture', Info => {

        ConnectToMongoDb(async(client) => {
            try {

                let conn = await client.connect();
            
                if(conn){
                    let db = client.db('mm_telecom_room_ids');
                    let coll = db.collection('_id_data');
                    let result = await coll.insertOne(Info);
                    result.acknowledged === true ? socket.emit('NewLecture', true) : socket.emit('NewLecture', false);
                }
                 
            } catch (e) {
                console.error(e);
            }
        })
    })
 
    socket.on('getLecture', _ => {
        ConnectToMongoDb(async(client) => {
            try {
                let conn = await client.connect();
            
                if(conn){
                    let db = client.db('mm_telecom_room_ids');
                    let coll = db.collection('_id_data');
        
                    let cursor = await coll.find({});
                    let result = await cursor.toArray();
                    socket.emit('getLecture', result)
                }
                 
              
            } catch (e) { 
                console.error(e);
            } 
        })
        
    })

    socket.on('chat', ({room, mssg, role}) => {
        ConnectToMongoDb(async(client) => {
            try{
                let conn = await client.connect();

                if(conn){
                    let db = client.db('mm_telecom_room_ids');
                    let coll = await db.listCollections().toArray();
                    let filteredCollection = coll.filter(item => item.name === `room_${room}`);


                    if(filteredCollection.length === 0){

                        new Promise((resolve, reject) => {
                            db.createCollection(`room_${room}`, async(err, res) => {
                                if(!err){
                                    resolve()
                                }else{
                                    reject(err)
                                }
                            })
                        })
                        .then(async() => {
                            let coll = db.collection(`room_${room}`);
    
                            let result = await coll.insertOne({
                                message: mssg,
                                date: new Date,
                                role, role

                            })

                            result.acknowledged === true ? socket.broadcast.emit('chat', mssg) : socket.broadcast.emit('chat', false);
                        })
                        .catch(err => console.log(err))

                        

                    }else{

                        let coll = db.collection(`${filteredCollection[0].name}`);
                        let result = await coll.insertOne({
                            message: mssg,
                            date: new Date,
                            role: role
                        })

                        result.acknowledged === true ? socket.broadcast.emit('chat', mssg) : socket.broadcast.emit('chat', false);
                    }
                }
            }

            catch(err){
                console.log(err)
            }
        })
    })

    socket.on('getChat', ({id}) => {
        ConnectToMongoDb(async(client) => {
            try {
                let conn = await client.connect();
            
                if(conn){
                    let db = client.db('mm_telecom_room_ids');
                    let coll = db.collection(`room_${id}`);
        
                    let cursor = await coll.find({});
                    let result = await cursor.toArray();
                    socket.emit('getChat', result)
                }
                 
              
            } catch (e) { 
                console.error(e);
            } 
        })
    })
});


/*
marom_db(async(config) => {
    const sql = require('mssql');

    var poolConnection = await sql.connect(config);
    console.log(poolConnection._connected)
    if(poolConnection){
        var resultSet = await poolConnection.request().query(
            `
                SELECT Id,FacultyId,SubjectName FROM Subjects
            `
        )

       
    }

})
*/

var {PeerServer} = require("peer"); 
var myPeerServer = PeerServer({port: 8080});

myPeerServer.on("connection", function({id}) {
    console.log(id + " has connected to the PeerServer");
});

myPeerServer.on("disconnect", function({id}) {
    console.log(id + " has disconnected from the PeerServer");
});
  


process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', reason.stack || reason)
  // Recommended: send the information to sentry.io
  // or whatever crash reporting service you use
})

