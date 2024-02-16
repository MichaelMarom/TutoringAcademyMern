const { subjects,
    post_form_one,
    get_countries,
    get_gmt,
    get_state,
    get_experience,
    get_level,
    get_degree,
    get_certificates,
    get_user_data,
    get_response,
    subject_already_exist,
    upload_tutor_rates,
    get_my_data,
    get_rates,
    upload_tutor_bank,
    get_tutor_setup,
    post_tutor_rates_form,
    get_my_edu,
    get_tutor_rates,
    get_bank_details,
    storeEvents,
    fetchStudentsBookings,
    storeCalenderTutorRecord,
    get_tutor_status,
    faculties,
    post_new_subject,
    post_tutor_setup,
    get_tutor_market_data,
    get_tutor_students,
    getSessionsDetails,
    last_pay_day,
    get_tutor_profile_data,
    post_edu_form,
    remove_subject_rates,
    post_tutor_ad,
    get_tutor_ads,
    get_ad,
    put_ad,
    set_agreements_date_null_for_all,
    get_tutor_against_code,
    get_tutor_offered_subjects,
    dynamically_post_edu_info } = require('../controllers/tutor');

const Cookies = require("cookies");
const { express, path, fs, parser, cookieParser, mocha, morgan, cors, shortId, jwt } = require('../modules');


const TUTOR_ROUTES = express.Router();

const verifyToken = async (req, res, next) => {
    if (req.originalUrl === '/auth/signup' || req.originalUrl === '/auth/login'
        || req.originalUrl === '/user/:SID') next()
    const publicKey = process.env.JWT_SECRET ||
    `-----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7hBgNQubOaYJf8/le9+v
    HzAQ7Jd1pcdDFxHRV4aSDQDMrwpR4q6OZA8XVaKDAS5YgxM01t/Dq2ooQV7MxrXt
    qYD+FKmF9hBXmMpAZEijdrW7JdMyEN/qeWtM9g6qjRsIf/eh/fKY0r3EYcknxRZE
    z3nEI49DzV1RwJn6oF0R2GSDCI+whs2cfEPTjYUaNcS2M+DawyCRGqIxdA0ZnRy4
    z9BezsT3pgcD/RhNkMMoCcF5dO9WSzRIRlU72aaFuOZUmfMxdqGcSjDnWzR19mqt
    boLdNuHclpzYT3iEbDs7GjRBj9sexq0m0w/aC1RAHIJjqUfMf5GY5hdkJ8/cT+yF
    2wIDAQAB
    -----END PUBLIC KEY-----`;
    const cookies = new Cookies(req, res);
    const sessToken = cookies.get("__session");
    const token = req.headers.authorization.replace('Bearer ', "");

    if (sessToken === undefined && (token === undefined || token === 'undefined' || token === 'null')) {
        return res.status(401).json({ message: "not signed in" });
    }

    try {
        if (token) {
            console.log('start verifying token ....')

            const dec = jwt.verify(token, publicKey, algorithms = ['RS256']);
            console.log('end verifying token ....')
            next()
        }
    } catch (error) {
        console.error(error.message)
        res.status(401).json({
            message: error.message,
        });
        return;
    }
};

// TUTOR_ROUTES.use(verifyToken);

TUTOR_ROUTES.get('/tutor/tutor-status', get_tutor_status)
TUTOR_ROUTES.get('/tutor/subjects', subjects)
TUTOR_ROUTES.get('/tutor/newsubject/:subject', subject_already_exist)
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
TUTOR_ROUTES.get('/tutor/subjects/:id', get_tutor_offered_subjects)
TUTOR_ROUTES.get('/tutor/tutor-rate', get_tutor_rates)
TUTOR_ROUTES.get('/tutor/my-edu', get_my_edu)
TUTOR_ROUTES.get('/tutor/tutor-bank-details', get_bank_details)

TUTOR_ROUTES.get('/tutor/tutor-setup', parser, get_tutor_setup);

TUTOR_ROUTES.post('/tutor/payment', parser, upload_tutor_bank);
TUTOR_ROUTES.post('/tutor/rates/:faculty/:subject/:id', parser, upload_tutor_rates);
TUTOR_ROUTES.delete('/subject-rate/:id', parser, remove_subject_rates);

TUTOR_ROUTES.post('/tutor/form-one', parser, post_form_one);
// TUTOR_ROUTES.post('/tutor/edu', parser, post_edu_form);
TUTOR_ROUTES.post('/tutor/edu', parser, dynamically_post_edu_info);

TUTOR_ROUTES.post('/tutor/tutor-rates', parser, post_tutor_rates_form);
TUTOR_ROUTES.post('/tutor/new-subject', parser, post_new_subject);
TUTOR_ROUTES.get('/p-payment/last_payday', last_pay_day);

TUTOR_ROUTES.post("/api/store-event", parser, storeEvents);
TUTOR_ROUTES.get("/api/bookings/:tutorId", fetchStudentsBookings)
TUTOR_ROUTES.put("/tutor/update/:id", parser, storeCalenderTutorRecord);
TUTOR_ROUTES.post('/tutor/setup', parser, post_tutor_setup)
TUTOR_ROUTES.put('/tutor/agreement-updated', parser, set_agreements_date_null_for_all)
TUTOR_ROUTES.get('/tutor/market-data', get_tutor_market_data)

TUTOR_ROUTES.get('/tutor/get_students/:academyId', get_tutor_students)
TUTOR_ROUTES.get('/tutor/session/:tutorId', getSessionsDetails)
TUTOR_ROUTES.get('/profile/:tutorId/:studentId', get_tutor_profile_data)
TUTOR_ROUTES.post('/tutor/market-place', parser, post_tutor_ad)
TUTOR_ROUTES.get('/tutor/market-place/list/:AcademyId', get_tutor_ads)
TUTOR_ROUTES.get('/tutor/ad/:Id', get_ad)
TUTOR_ROUTES.put('/tutor/ad/:Id', parser, put_ad)
TUTOR_ROUTES.get('/tutor/rate/:code', get_tutor_against_code)

module.exports = {
    TUTOR_ROUTES
}