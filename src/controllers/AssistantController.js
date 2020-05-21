const Assistant = require('../models/Assistant');
const Qr = require('../models/Qr');
const User = require('../models/User');
const Code = require('../models/Code');
const cryptoRandomString = require('crypto-random-string');
const encrypt = require('../utils/encrypt');

exports.createAssistant = async (req,res) => {
    try {
        const assistant = new Assistant({...req.body});
        if(req.user) {
            assistant.active = true;
        }
        assistant.createdBy = req.user._id;
        await assistant.save();
        res.send({ message : "RiceATM assistant is created successfully"});
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.getAllAssistants = async (req,res) => {
    try {
        const assistants = await Assistant.find()
                                    .populate({ path: 'createdBy', select: 'name' });
        res.send({ data: assistants})
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.loginAssistant = async (req,res) => {
    try {
        const { phone, password } =  req.body;
        const assistant = await Assistant.findByCredentials(phone,password);
        if(assistant.approved === false) {
            return res.status(200).send({ error: true, message : "User is not allowed to login", user : {}})
        }
        res.send({ error: false, message : "User login is successfully.", user: assistant });
    } catch(e) {
        res.status(200).send({ error: true, message: "User login is failed", user: {}});
    }
}

exports.UserLogout = async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })

        await req.user.save()

        res.send('Successfully Logout');
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.getQrByID = async (req,res) => {
    try {
        const qr = await Qr.findById(req.params.id);
        if(!qr) {
            return res.status(500).send({ error: true, qr: {}});
        }
        res.send({error: false,qr});
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.updateQrByID = async (req,res) => {
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
            return res.status(200).send({ error : true, message : "User already existed"});
        }
        const user = new User(newuser);
        await user.save();
    
        const codeData = {
            owner: user._id
        }
        const code = new Code(codeData);
        const codeExisted = await Code.findOne({ owner: user._id});
        if(codeExisted) {
            return res.status(200).send({ error :true, message: "User already have a code"});
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
        res.send({ error: false, message: "Qr is activated"});
    }catch(e){
        res.status(200).send({ error : true, message : "Error occurs at Server." })
    }
}

exports.updateAssistant = async (req,res) => {
    try {
        const assistant = await Assistant.findById(req.params.id);
        assistant.name = assistant.name;
        assistant.phone = assistant.phone;
        assistant.createdBy = assistant.createdBy;
        assistant.active = req.body.active;
        
        //console.log(assistant);
        await assistant.save();
        res.send({ message : "RiceATM assistant is Updated successfully"});
    } catch(e) {
        res.status(500).send(e);
    }
}