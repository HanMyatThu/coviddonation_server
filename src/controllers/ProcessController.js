const Process = require('../models/Process');
const User = require('../models/User');
const Machine = require('../models/Machine');
const IotController  = require('../controllers/iothubController');

exports.createProcess = async (req,res) => {
    try {
        const machine = await Machine.findOne({name : req.body.name, code: req.body.code});
        if(!machine) {
            return res.status(404).send({ error : "You code is not for that machine"});
        }
        const process = new Process({
            user: req.user._id,
            machine: machine._id
        });
        // const c2Dsg = {
        //     tranID : process._id,
        //     machineID: req.body.name,
        //     userID: req.user._id,
        //     status: process.status
        // }
        // await IotController.sendC2D(c2Dsg)
        await process.save();
        res.send(process);
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.getProcessByUser = async(req,res) => {
    try {
        const process = await Process.findOne({ user: req.user._id});
        if(!process) {
            return res.status(404).send({ data: "Process not existed"});
        }
        res.send(process);
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.getAllProcess = async (req,res) => {
    try {
        const processes = await Process.find().populate({ path: 'user', select: 'name' }).populate({ path: 'machine',select: ['name','code']});
        console.log(processes);
        res.send({ data: processes });
    } catch(e) {
        res.status(500).send(e);
    }   
}