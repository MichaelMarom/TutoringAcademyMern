const moment = require('moment-timezone')

function checkSessionStatus(session) {
    const currentTime = moment();
    const sessionStart = moment(session.start);
    const sessionEnd = moment(session.end);

    if (currentTime.isBefore(sessionStart)) {
        return "future";
    } else if (currentTime.isAfter(sessionEnd)) {
        return "past";
    } else {
        return "current";
    }
}


module.exports = { checkSessionStatus }