const { upload_form_one, get_student_setup, get_student_grade, get_tutor_subject, upload_student_short_list, get_student_short_list, get_student_short_list_data, get_student_market_data } = require('../controllers/student');
const {express, path, fs, parser, cookieParser, mocha, morgan, io, cors, shortId, jwt} = require('../modules');

const STUDENT_ROUTES = express.Router();

STUDENT_ROUTES.get('/student/setup', get_student_setup)
STUDENT_ROUTES.get('/student/grade', get_student_grade)
STUDENT_ROUTES.get('/student/tutor-subject', get_tutor_subject)
STUDENT_ROUTES.post('/student/short-list', parser, upload_student_short_list)
STUDENT_ROUTES.get('/student/short-list', get_student_short_list)
STUDENT_ROUTES.get('/student/short-list-data', get_student_short_list_data)
STUDENT_ROUTES.get('/student/market-data', get_student_market_data)
STUDENT_ROUTES.post('/student/setup', parser, upload_form_one)

module.exports = {
    STUDENT_ROUTES
} 