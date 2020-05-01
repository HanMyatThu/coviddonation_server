const Machine = require('../models/Machine');

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