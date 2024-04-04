const moment = require('moment-timezone')

function checkSessionStatus(session, timezone) {
    console.log(timezone)
    const currentTime = moment().tz(timezone);
    const sessionStart = moment(session.start).tz(timezone);
    const sessionEnd = moment(session.end).tz(timezone);

    if (currentTime.isBefore(sessionStart)) {
        return "future";
    } else if (currentTime.isAfter(sessionEnd)) {
        return "past";
    } else {
        return "current";
    }
}


module.exports = { checkSessionStatus }