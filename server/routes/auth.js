const { login, signup, get_user_detail } = require("../controllers/auth");
const {
    express,
    parser,
} = require('../modules');
const AUTH_ROUTERS = express.Router();

AUTH_ROUTERS.post('/auth/login', parser, login);
AUTH_ROUTERS.post('/auth/signup', parser, signup);
AUTH_ROUTERS.get('/user/:SID', get_user_detail);


module.exports = AUTH_ROUTERS