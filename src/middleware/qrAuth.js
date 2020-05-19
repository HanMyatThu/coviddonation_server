const basicAuth = async(req,res,next) => {
    try {
        if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
            return res.status(401).json({ message: 'Missing Authorization Header' });
        }
        // verify auth credentials
        const base64Credentials =  req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');

        if (username === 'qr_admin_1' && password === 'qr_admin_123!@#') {
            // attach user to request object
            req.user = 'user';
        
            next();
        }
        return res.status(400).send({ errro : "Wrong credentials"});
        
    } catch(e) {
        res.send('No permission');
    }
    
}

module.exports = basicAuth