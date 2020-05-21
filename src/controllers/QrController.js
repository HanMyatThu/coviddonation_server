const User = require('../models/User');
const Qr = require('../models/Qr');
const Code = require('../models/Code');
const cryptoRandomString = require('crypto-random-string');

exports.scanningQR = async (req,res) => {
    try {
        if (req.session.views) {
            req.session.views++
            if(req.session.views > 255) {
                return res.render('error',{ error : "Too Many Request"});
            }
        } else {
            req.session.views = 1
        }
        const qrid =  req.params.qrid;
        const qr = await Qr.findById(qrid);

        //check if qr is activated or nor 
        if(qr.activate === false) {
            return res.render('qractivate', { data : qr._id});
        }
        const user = await User.findById(qr.user);
        if(user.qruser === false) {
            return res.render('error',{ error : "You don't have permission to access this page"});
        }

        res.render('qr',{data: qr._id});
    } catch(e) {
        res.render('error',{ error : "Permission Error"});
    }
}

exports.getQrById = async(req,res) => {
    try {
        const qr = await Qr.findById(req.params.id).populate({ path: 'code', select: ['isUsed'] });
        if(!qr) {
            return res.status(400).send(e);
        }
        res.send(qr);
    } catch(e) {
        res.status(500).send(e)
    }
}

exports.updateQrById = async(req,res) => {
    const updates = Object.keys(req.body);
    const fillables = ['name','phone','street','township'];
    const isValidate = updates.every((update)=>fillables.includes(update))

    if(!isValidate){
        return res.status(400).send({error: 'Invalid updates'})
    }

    try{
        const { name, phone,street,township} = req.body;
        const newuser = {
            name ,
            phone,
            township,
            password : '123456',
            street,
            approved: true,
            qruser: true
        }  
        const existedUser = await User.findOne({ phone});
        if(existedUser) {
        return res.status(400).send({ error : "User already existed"});
        }
        const user = new User(newuser);
        await user.save();
    
        const codeData = {
        owner: user._id
        }
        const code = new Code(codeData);
        const codeExisted = await Code.findOne({ owner: user._id});
        if(codeExisted) {
            return res.status(400).send({ error : "User already have a code"});
        } 
        const firstpart = cryptoRandomString({length: 3, type: 'distinguishable'});
        const secondpart = cryptoRandomString({length: 3, type: 'distinguishable'});
        code.text = `${firstpart}-${secondpart}`;
        await code.save();
        
        //update qr here
        const qr = await Qr.findById(req.params.id);
        qr.activate = true;
        qr.user = user._id;
        qr.code = code._id;
        await qr.save();
        res.send(qr);
    }catch(e){
        res.status(400).send({ error :e })
    }
}

exports.getQrList = async(req,res) => {
    try {
        const processes = await Qr.find({activate : 'true'})
                        .populate({ path: 'user', select: ['name', 'phone'] })
                        .populate({ path: 'machine',select: ['name','status']})
                        .populate({ path: 'code',select: ['text', 'isUsed']});

        res.send({ data: processes});
    } catch(e) {
        res.status(500).send(e);
    }
};