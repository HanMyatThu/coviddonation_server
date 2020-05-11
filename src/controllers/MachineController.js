const Machine = require('../models/Machine');
const cryptoRandomString = require('crypto-random-string');

exports.createMachine = async (req,res) => {
    try {
        const machine = new Machine(req.body);
        await machine.save();
        res.send(machine);
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.getMachineByID = async (req,res) => {
    try {
        const machine = await Machine.findById(req.params.id);
        if(!machine) {
            return res.status(400).send({ error : "Machine not found"});
        }
        res.send(machine);
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.deleteMachineByID = async (req,res) => {
    try {
        const machine = await Machine.findById(req.params.id);
        await machine.remove();
        res.send({ data: "Machine succesfully removed"});
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.getAllMachines = async (req,res) => {
    try {
        const machines = await Machine.find();
        res.send({ data: machines })
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.updateMachineById = async (req,res) => {
    const updates = Object.keys(req.body);
    const fillables = ['name','iotString'];
    const isValidate = updates.every((update)=>fillables.includes(update))

    if(!isValidate){
        return res.status(400).send({error: 'Invalid updates'})
    }

    try{
        const machine = await Machine.findById(req.params.id);
        (req.body.name)? machine.name = req.body.name : machine.name = machine.name;
        (req.body.iotString)? machine.iotString = req.body.iotString : machine.iotString = machine.iotString;
        
        await machine.save();
        res.send({ data : "A Machine is updated"});
    }catch(e){
        res.status(500).send({ error :e })
    }
}