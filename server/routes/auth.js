const { login, signup } = require("../controllers/auth");
const {
    express,
    parser,
} = require('../modules');
const AUTH_ROUTERS = express.Router();

AUTH_ROUTERS.post('/auth/login', parser, login);
AUTH_ROUTERS.post('/auth/signup', parser, signup);

module.exports = AUTH_ROUTERS