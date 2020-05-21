const Code = require('../models/Code');
const cryptoRandomString = require('crypto-random-string');
const User = require('../models/User');

exports.createCode = async (req,res) => {
    try {
        const code = new Code(req.body);

        const codeExisted = await Code.findOne({ owner: req.body.owner});
        if(codeExisted) {
            return res.status(400).send({ error : "User already have a code"});
        } 
        const firstpart = cryptoRandomString({length: 3, type: 'distinguishable'});
        const secondpart = cryptoRandomString({length: 3, type: 'distinguishable'});
        code.text = `${firstpart}-${secondpart}`;
        await code.save();
        res.send(code);
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.deleteCode = async (req,res) => {
    try {
        const code = await Code.findById(req.params.id);
        if(!code) {
            return res.status(404).send({ data : "code not found"});
        }
        await code.delete();
        res.send({data : "Code is successfully deleted"});
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.updateCode = async (req,res) => {
    const updates = Object.keys(req.body);
    const fillables = ['isUsed','process'];
    const isValidate = updates.every((update)=>fillables.includes(update))

    if(!isValidate){
        return res.status(400).send({error: 'Invalid updates'})
    }

    try{
        const code = await Code.findById(req.params.id);
        (req.body.isUsed !== null) ? code.isUsed = req.body.isUsed : code.isUsed = code.isUsed;
        (req.body.process) ? code.process = req.body.process : code.process = code.process;
        await code.save();
        res.send(code);
    }catch(e){
        res.status(400).send({ error :e })
    }
}


exports.getCodeByLogin = async(req,res) => {
    try {
        const code = await Code.findOne({ owner: req.user._id });
        if(!code) {
            return res.status(404).send('A user does not have a code');
        }
        delete code._id;
        res.send(code);
    } catch(e) {    
        res.status(500).send(e);
    }
}

exports.getCodeByUser = async(req,res) => {
    try {
        const code = await Code.findOne({ owner: req.params.id });
        if(!code) {
            return res.status(404).send('A user does not have a code');
        }
        res.send(code);
    } catch(e) {    
        res.status(500).send(e);
    }
}

exports.deleteCodeByID = async (req,res) => {
    try {
        const code = await Code.findById(req.params.id);
        if(!code) {
            return res.status(404).send('A user does not have a code');
        }
        await code.delete();
        res.send({data: "A code is deleted successfully"});
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.getAllCode = async(req,res) => {
    try {
        const codes = await Code.find().populate({ path: 'owner', select: ['name']});
        res.send({data : codes});
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.getAllCodesForLogicApp = async (req,res) => {
    try {
        const codes = await Code.find();
        res.send(codes);
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.renewCodeForLogicApp = async (req,res) => {
    const updates = Object.keys(req.body);
    const fillables = ['renew'];
    const isValidate = updates.every((update)=>fillables.includes(update))

    if(!isValidate){
        return res.status(400).send({error: 'Invalid updates'})
    }

    try{
        const code = await Code.findById(req.params.id);
        const firstpart = cryptoRandomString({length: 3, type: 'distinguishable'});
        const secondpart = cryptoRandomString({length: 3, type: 'distinguishable'});
        code.text = `${firstpart}-${secondpart}`;
        code.isUsed = false;
        await code.save();
        res.send(code);
    }catch(e){
        res.status(400).send({ error :e })
    }
}

exports.CodeIsUsed = async (req, res) => {
    const updates = Object.keys(req.body);
    const fillables = ["Already Used"];
    const isValidate = updates.every((update) => fillables.includes(update));
  
    if (!isValidate) {
      return res.status(400).send({ error: "Invalid updates" });
    }
  
    try {
      const code = await Code.findById(req.params.id);
      code.isUsed = true;
      await code.save();
      res.send({ data: code });
    } catch (e) {
      res.status(400).send({ error: e });
    }
  };