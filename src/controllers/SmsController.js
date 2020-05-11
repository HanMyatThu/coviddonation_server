const fetch = require('node-fetch');
const base64 = require('js-base64').Base64;
const SMS_USERNAME = process.env.SMS_USERNAME;
const SMS_PASSWORD = process.env.SMS_PASSWORD;
const SMS_BODY = process.env.SMS_BODY;
const SMS_VALUE = process.env.SMS_VALUE;
const tokenurl = process.env.token_URL;
const smsurl = process.env.sms_URL;

exports.SendSMSToUserAfterApproved = async (req,res) => {
    const { phone, content} = req.body;

    try {
        const sms_params = new URLSearchParams();
        sms_params.append(SMS_BODY, SMS_VALUE);

        const getToken = await fetch(tokenurl, {
            method: 'POST',
            body: sms_params,
            headers: 
                {   "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Basic ${base64.encode(`${SMS_USERNAME}:${SMS_PASSWORD}`)}`}
            })
        const tokenData = await getToken.json();
        const token = tokenData.access_token;

        //sending sms
        const data = {
            "source": "Uni Net",
            "dest" : phone,
            "content": content
        }

        const sendSMS = await fetch(smsurl, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: 
                {   "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`}
            })
    
        const responseSMS = await sendSMS.json();
        console.log(responseSMS.errorCode);
        res.send({ data: "SMS is sent successfully"});
    }catch(e) {
        res.status(400).send({ error : "Failed to send SMS"});
    } 
}
