const Assistant = require('../models/Assistant');

const basicAuth = async(req,res,next) => {
    try {
        if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
            return res.status(401).json({ error: true, message: 'Missing Authorization Header' });
        }
        // verify auth credentials
        const base64Credentials =  req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [phone, password] = credentials.split(':');

        const assistant = await Assistant.findByCredentials(phone,password);
        if(assistant.approved === false) {
            return res.status(405).send({ error: true, message: "User is not allowed to login"})
        }
        if(!assistant) {
            return res.status(405).send({ error: true, message : "Wrong credentials"});
        }
        req.user = assistant;

        next();
        
    } catch(e) {
        res.send({ error: true, message: "No permission"});
    }
    
}

module.exports = basicAuth