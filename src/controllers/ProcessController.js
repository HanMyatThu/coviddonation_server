const Process = require('../models/Process');
const User = require('../models/User');
const Machine = require('../models/Machine');
const IotController  = require('../controllers/iothubController');
const Code = require('../models/Code');

exports.createProcess = async (req,res) => {
    try {
        const machine = await Machine.findOne({name : req.body.name });
        if(!machine || machine.status === 'unavailable' || machine.status === 'failed') {
            return res.status(404).send({ error : "You code is not for that machine"});
        }
        const previousProcess = await Process.find({ user: req.user._id}).sort({_id:-1}).limit(1);
        if(previousProcess.length !== 0) {
            if(previousProcess[0].status === 'processing' || previousProcess[0].status === 'unavailable') {
                return res.status(500).send({ error : "You are not ready for this action"});
            }
        }

        //code update
        const code = await Code.findOne({ text : req.body.code, owner: req.user._id});
        if(!code) {
            return res.status(404).send({ error : "You code is not for that user"});
        }
       
        code.isUsed = false;
        await code.save();

        const newprocess = new Process({
            user: req.user._id,
            machine: machine._id,
            code : code._id,
            status: "completed"
        });
        const c2Dsg = {
            tranID : process._id,
            machineID: req.body.name,
            userID: req.user._id,
            status: process.status
        }
        await IotController.sendC2D(c2Dsg,machine.iotString);
        await newprocess.save();
        res.send({newprocess,code});
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.getProcessByUser = async(req,res) => {
    try {
        const process = await Process.find({ user: req.user._id}).sort({_id:-1}).limit(1).populate({ path: 'machine',select: ['name','location']});
        if(process.length === 0) {
            return res.status(404).send({ data: "Process not existed"});
        }
        res.send(process);
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.getAllProcess = async (req,res) => {
    try {
        const processes = await Process.find().populate({ path: 'user', select: 'name' }).populate({ path: 'machine',select: ['name','code']}).populate({ path: 'code',select: ['text']});
        res.send({ data: processes });
    } catch(e) {
        res.status(500).send(e);
    }   
}

exports.deleteProcess = async (req,res) => {
    try {
        const process = await Process.findById(req.params.id);
        await process.delete();
        res.send({ data : "successfully deleted"});
    } catch(e) {
        res.status(500).send(e);
    }
}



exports.updateProccessById = async (req,res) => {
    try{
        if(req.body.tranID === '0') {
            const machine = await Machine.findOne({ name : req.body.machineId});
            if(req.body.status === 'unavailable' || req.body.status === 'failed') {
                machine.status === req.body.status;
                await machine.save();
                res.status(200).send('ok');
            }
        } else {
            const process = await Process.findById(req.body.tranID);
            process.status = req.body.status;
            await process.save();
            res.status(200).send('ok');
        }
        
    }catch(e){
        res.status(500).send({ error :e })
    }
}

exports.createProcessFromAdmin = async(req,res) => {
    try {
        const machine = await Machine.findOne({name : req.body.name });
        if(!machine || machine.status === 'unavailable' || machine.status === 'failed') {
            return res.status(404).send({ error : "You code is not for that machine"});
        }
        const previousProcess = await Process.find({ user: req.body._id}).sort({_id:-1}).limit(1);
        if(previousProcess.length !== 0) {
            if(previousProcess[0].status === 'processing' || previousProcess[0].status === 'unavailable') {
                return res.status(500).send({ error : "You are not ready for this action"});
            }
        }

        //code update
        const code = await Code.findOne({ text : req.body.code, owner: req.body._id});
        if(!code) {
            return res.status(404).send({ error : "You code is not for that user"});
        }
       
        code.isUsed = false;
        await code.save();

        const newprocess = new Process({
            user: req.body._id,
            machine: machine._id,
            code : code._id,
            status: "completed"
        });
        const c2Dsg = {
            tranID : process._id,
            machineID: req.body.name,
            userID: req.body._id,
            status: process.status
        }
        await IotController.sendC2D(c2Dsg,machine.iotString);
        await newprocess.save();
        res.send({newprocess,code});
    } catch(e) {
        res.status(500).send(e);
    }
}