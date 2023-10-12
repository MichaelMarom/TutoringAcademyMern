const { subjects, post_form_one, get_countries, get_gmt, get_state, get_experience, get_level, get_degree, get_certificates, post_form_two, get_user_data, get_response, upload_tutor_rates, get_my_data, get_rates, upload_form_four, get_tutor_setup, post_form_three, get_my_edu, get_tutor_rates, get_bank_details, storeEvents, fetchStudentsBookings, storeCalenderTutorRecord, get_tutor_status, faculties, post_new_subject } = require('../controllers/tutor');
const { express, path, fs, parser, cookieParser, mocha, morgan, io, cors, shortId, jwt } = require('../modules');


const TUTOR_ROUTES = express.Router();

//TUTOR_ROUTES.post('/', )

TUTOR_ROUTES.get('/tutor/tutor-status', get_tutor_status)
TUTOR_ROUTES.get('/tutor/subjects', subjects)
TUTOR_ROUTES.get('/tutor/faculties', faculties)
TUTOR_ROUTES.get('/tutor/countries', get_countries)
TUTOR_ROUTES.get('/tutor/state', get_state)
TUTOR_ROUTES.get('/tutor/gmt', get_gmt)
TUTOR_ROUTES.get('/tutor/experience', get_experience)
TUTOR_ROUTES.get('/tutor/level', get_level)
TUTOR_ROUTES.get('/tutor/degree', get_degree)
TUTOR_ROUTES.get('/tutor/certificates', get_certificates)
TUTOR_ROUTES.get('/tutor/education', get_user_data)
TUTOR_ROUTES.get('/tutor/response', get_response)
TUTOR_ROUTES.get('/tutor/my-data', get_my_data)
TUTOR_ROUTES.get('/tutor/my-rate', get_rates)
TUTOR_ROUTES.get('/tutor/tutor-rate', get_tutor_rates)
TUTOR_ROUTES.get('/tutor/my-edu', get_my_edu)
TUTOR_ROUTES.get('/tutor/tutor-bank-details', get_bank_details)

TUTOR_ROUTES.get('/tutor/tutor-setup', parser, get_tutor_setup);



TUTOR_ROUTES.post('/tutor/payment', parser, upload_form_four);
TUTOR_ROUTES.post('/tutor/rates', parser, upload_tutor_rates);
TUTOR_ROUTES.post('/tutor/form-one', parser, post_form_one);
TUTOR_ROUTES.post('/tutor/form-two', parser, post_form_two);
TUTOR_ROUTES.post('/tutor/form-three', parser, post_form_three);
TUTOR_ROUTES.post('/tutor/new-subject', parser, post_new_subject);

TUTOR_ROUTES.post("/api/store-event", parser, storeEvents);
TUTOR_ROUTES.get("/api/bookings/:tutorId", fetchStudentsBookings)
TUTOR_ROUTES.put("/tutor/update/:id", parser, storeCalenderTutorRecord)

module.exports = {
    TUTOR_ROUTES
}