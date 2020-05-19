const Request = require('../models/Request')
const Code = require('../models/Code');

exports.createRequest = async(req,res) => {
    try {
        const requestExist = await Request.findOne({ user: req.user._id , status: 'open'});
        if(requestExist) {
            return res.status(400).send({ error : "You have already sent a request"});
        }
        const request = new Request({...req.body,user: req.user._id});
        await request.save();
        res.send(request);
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.getallRequests = async(req,res) => {
    try {
        const requests = await Request.find().populate({ path: 'user', select: 'name' });
        res.send({ data: requests})
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.updateRequets = async (req,res) => {
    try {
        const request = await Request.findById(req.params.id);
        if(!request) {
            return res.status(404).send({ error : "Request Not Found"})
        }
        const code = await Code.findOne({ owner: request.user});
        code.isUsed = false;
        await code.save();

        request.status = 'completed';

        await request.save();
    } catch(e) {
        res.status(500).send(e);
    }
}