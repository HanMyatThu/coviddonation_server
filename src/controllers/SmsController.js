const fetch = require('node-fetch');

exports.SendSMSToUserAfterApproved = async (phone) => {
    const data = await fetch(`https://api.manychat.com/fb/subscriber/getInfo?subscriber_id=${request.euserid}`, {
                method: 'GET', // or 'PUT'
                headers: {
                    'Authorization': `Bearer ${merchant.mc_secret}`,
                },
                })
}
