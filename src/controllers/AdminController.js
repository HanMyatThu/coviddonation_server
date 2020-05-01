const Admin = require('../models/Admin');

exports.AdminLogin = async (req,res) => {
    try {
        const admin = await Admin.findByCredentials(req.body.phone,req.body.password);
        const token = await admin.generateAuthToken();
        res.send({admin,token});
    } catch(e) {
        res.status(401).send(e);
    }
}

exports.AdminRegister = async (req,res) => {
    try {
        const admin = new Admin(req.body);
        await admin.save();
        res.send(admin);
    } catch (e) {
        res.status(401).send(e);
    }
}

exports.AdminLogout = async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token;
        })
        await req.user.save();
        res.send('Logout Successfully');
    } catch(e) {
        res.status(401).send(e);
    }
}

