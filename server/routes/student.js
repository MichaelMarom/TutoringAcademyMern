const {express, path, fs, parser, cookieParser, mocha, morgan, io, cors, shortId, jwt} = require('../modules');

const STUDENT_ROUTES = express.Router();

//STUDENT_ROUTES.get('/', )
//STUDENT_ROUTES.post('/', )

module.exports = {
    STUDENT_ROUTES
} 