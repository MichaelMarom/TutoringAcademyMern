const smsClient = require("./sms");

async function sendingSMS(req, res) {
    const sendResults = await smsClient.send({
        from: "+18667769103",
        to: ["+923343165003", '+15166088464'],
        message: "Hello World 👋🏻 via SMS123"
    }, {
        enableDeliveryReport: true,
        tag: "profile status"
    });

    res.status(200).send(sendResults)
}

module.exports = {
    sendingSMS: sendingSMS
}