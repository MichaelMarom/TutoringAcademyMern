const { get_tutor_data, set_tutor_status, get_student_data, set_student_status } = require('../controllers/admin');
const {express, path, fs, parser, cookieParser, mocha, morgan, io, cors, shortId, jwt} = require('../modules');


const ADMIN_ROUTES = express.Router();

//ADMIN_ROUTES.post('/', )

ADMIN_ROUTES.get('/admin/tutor-data', get_tutor_data)
ADMIN_ROUTES.get('/admin/student-data', get_student_data)

ADMIN_ROUTES.post('/admin/set-tutor-status', parser, set_tutor_status);
ADMIN_ROUTES.post('/admin/set-student-status', parser, set_student_status);

module.exports = {
    ADMIN_ROUTES
}