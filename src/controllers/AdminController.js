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



exports.AdminLogoutAll = async (req,res) => {
    try {
        req.user.tokens = [];
        await req.user.save();

        res.send('Successfully logout');
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.updateSetting = async(req,res) => {
    const updates = Object.keys(req.body);
    const fillables = ['setting'];
    const isValidate = updates.every((update)=>fillables.includes(update))

    if(!isValidate){
        return res.status(400).send({error: 'Invalid updates'})
    }

    try{
        req.user.setting = req.body.setting;
        await req.user.save();
        res.send({ data : "A Machine is updated"});
    }catch(e){
        res.status(500).send({ error :e })
    }
}

exports.getProfile = async(req,res) => {
    try {
        res.send(req.user);
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.changePassword = async (req,res) => {
    const updates = Object.keys(req.body);
    const fillables = ['password'];
    const isValidate = updates.every((update)=>fillables.includes(update))

    if(!isValidate){
        return res.status(400).send({error: 'Invalid updates'})
    }
    try {
        req.user.password = req.body.password;
        await req.user.save();
        res.send({ data: "Password reset successfully"});
    } catch(e) {
        res.status(500).send(e);
    }  
}