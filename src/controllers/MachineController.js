const Machine = require('../models/Machine');
const cryptoRandomString = require('crypto-random-string');

exports.createMachine = async (req,res) => {
    try {
        const machine = new Machine(req.body);
        const firstpart = cryptoRandomString({length: 3, type: 'distinguishable'});
        const secondpart = cryptoRandomString({length: 3, type: 'distinguishable'});
        machine.code = `${firstpart}-${secondpart}`;
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
    const fillables = ['iotString'];
    const isValidate = updates.every((update)=>fillables.includes(update))

    if(!isValidate){
        return res.status(400).send({error: 'Invalid updates'})
    }

    try{
        const machine = await Machine.findById(req.params.id);
        machine.iotString = req.body.iotString;
        await machine.save();
        res.send({ data : "A Machine is updated"});
    }catch(e){
        res.status(400).send({ error :e })
    }
}