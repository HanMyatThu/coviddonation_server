const Process = require('../models/Process');
const User = require('../models/User');
const Machine = require('../models/Machine');
const Code = require('../models/Code');

exports.createProcess = async (req,res) => {
    try {
        const code = await Code.findOne({ owner : req.user._id });
        if(code.used === true) {
            return res.status(400).send({ error : "You already used that code"});
        } 
        const machine = await Machine.findById(req.body.machine);
        if(!machine) {
            return res.status(404).send({ error : "You code is not for that machine"});
        }
        const process = new Process({
            user: req.user._id,
            usedCode : code._id,
            machine: req.body.machine
        });
        await process.save();
        // save code to used
        code.used === true;
        await code.save();

        res.send(process);
    } catch(e) {
        res.status(500).send(e);
    }
}