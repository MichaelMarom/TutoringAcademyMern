const { upload_form_one, get_student_setup, get_student_grade } = require('../controllers/student');
const {express, path, fs, parser, cookieParser, mocha, morgan, io, cors, shortId, jwt} = require('../modules');

const STUDENT_ROUTES = express.Router();

STUDENT_ROUTES.get('/student/setup', get_student_setup)
STUDENT_ROUTES.get('/student/grade', get_student_grade)

STUDENT_ROUTES.post('/student/setup', parser, upload_form_one)

module.exports = {
    STUDENT_ROUTES
} 