const Nexmo = require('nexmo')

const nexmo = new Nexmo({
    apiKey: "5ae8faa2",
    apiSecret: "O7gIZrtj1GsltaeL"
})


const from = '13852403539'
const to = phoneNumber
const text = 'Hello, this is Dear Time. Thanks for subscribing us. We will help you to get to your place on time '

nexmo.message.sendSms(from, to, text, (err, responseData) => {
    if (err) {
        console.log(err);
    } else {
        if (responseData.messages[0]['status'] === "0") {
            console.log("Message sent successfully.");
        } else {
            console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
        }
    }
})