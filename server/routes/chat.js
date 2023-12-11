const { fetch_chats, fetch_chat_messages, post_message } = require("../controllers/chat");
const {
    express,
    parser,
} = require('../modules');
const CHAT_ROUTES = express.Router();

CHAT_ROUTES.get('/chats/:role/:userId', fetch_chats);
CHAT_ROUTES.get('/messages/:chatId', fetch_chat_messages);
CHAT_ROUTES.post('/message', parser, post_message);




module.exports = CHAT_ROUTES