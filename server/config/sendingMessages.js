const smsClient = require("./sms");

async function sendingSMS(req, res) {
    const sendResults = await smsClient.send({
        from: "+18667769103",
        to: ["+15163308032", '+15166088464', '+923343165003'],
        message: "New Message from Tutoring Academy!"
    }, {
        enableDeliveryReport: true,
        tag: "profile status"
    });

    res.status(200).send(sendResults)
}

module.exports = {
    sendingSMS: sendingSMS
}