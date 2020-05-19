const Smslog = require('../models/Smslogs');

exports.getAlllogs = async (req,res) => {
    try {
        const logs = await Smslog.find();
        res.send({data: logs})
    } catch(e) {
        res.status(500).send(e);
    }   
}