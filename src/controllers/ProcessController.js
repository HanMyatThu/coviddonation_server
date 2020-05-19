const Process = require('../models/Process');
const User = require('../models/User');
const Machine = require('../models/Machine');
const IotController  = require('../controllers/iothubController');
const Code = require('../models/Code');
const durationSetting = process.env.DURATION_SETTING;
const Qr = require('../models/Qr');

exports.createProcess = async (req,res) => {
    try {
        const machine = await Machine.findOne({name : req.body.name });
        if(!machine || machine.status === 'unavailable' || machine.status === 'failed') {
            return res.status(404).send({ error : "You code is not for that machine"});
        }
        const lastestProcess = await Process.find({ machine: machine._id}).sort({ _id: -1}).limit(1);
        if(lastestProcess[0].status === 'processing') {
            return res.status(400).send({ error : "Please wait for a moment" });
        }

        const previousProcess = await Process.find({ user: req.user._id}).sort({_id:-1}).limit(1);
        if(previousProcess.length !== 0) {
            if(previousProcess[0].status === 'processing' || previousProcess[0].status === 'unavailable') {
                return res.status(500).send({ error : "You are not ready for this action"});
            }
            const setting = durationSetting;
            const today = new Date();
            const date = new Date(previousProcess[0].createdAt);
            const next3days = new Date(date.getFullYear(), date.getMonth(), date.getDate() + setting);

            if(previousProcess[0].status !== 'failed') {
                if(today < next3days ) {
                    return res.status(401).send({ error : "You have no permission to create the process"});
                }
            }
        }

        //code update
        const code = await Code.findOne({ text : req.body.code, owner: req.user._id});
        if(!code) {
            return res.status(404).send({ error : "You code is not for that user"});
        }
        if(code.isUsed === true) {
            return res.status(400).send({ error : "You have already used that code"});
        }
       
        code.isUsed = true;
        await code.save();

        const newprocess = new Process({
            user: req.user._id,
            machine: machine._id,
            code : code._id,
            status: "processing"
        });
        const c2Dsg = {
            tranID : newprocess._id,
            machineID: req.body.name,
            userID: req.user._id,
            status: newprocess.status
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
        const process = await Process.find({ user: req.user._id})
                                .sort({_id:-1}).limit(1)
                                .populate({ path: 'machine',select: ['name','location']});
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
        const processes = await Process.find()
                                .populate({ path: 'user', select: 'name' })
                                .populate({ path: 'machine',select: ['name','code']})
                                .populate({ path: 'code',select: ['text']});
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
            const machine = await Machine.findOne({ name: req.body.machineID});
            if(!machine) {
                return res.status(404).send({ error : "Machine not existed"})
            }
            if(req.body.status === 'unavailable' || req.body.status === 'failed' || req.body.status === 'unavaiable' || req.body.status ==='available' || req.body.status === 'avaiable') {
                if(req.body.status === 'unavaiable') {
                    machine.status === 'unavailable';
                } else if(req.body.status === 'available' || req.body.status === 'avaiable') {
                    machine.status === 'working';
                } else {
                    machine.status === req.body.status;
                }
                await machine.save();

                res.status(200).send(machine);
            } else {
                res.status(200).send('ok');
            }
        } else {
            if(req.body.status === 'failed') {
                const process = await Process.findById(req.body.tranID);
                const usedCode = await Code.findById(process.code);
                usedCode.isUsed = false;
                await usedCode.save();
            }
            const process = await Process.findById(req.body.tranID);
            process.status = req.body.status;
            await process.save();
            res.status(200).send(process);
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
        const lastestProcess = await Process.find({ machine: machine._id}).sort({ _id: -1}).limit(1);
        if(lastestProcess[0].status === 'processing') {
            return res.status(400).send({ error : "Please wait for a moment" });
        }
        const previousProcess = await Process.find({ user: req.body.userid}).sort({_id:-1}).limit(1);
        if(previousProcess.length !== 0) {
            if(previousProcess[0].status === 'processing' || previousProcess[0].status === 'unavailable') {
                return res.status(405).send({ error : "You are not ready for this action"});
            }

            //check process with setting
            let setting = '';
            (req.user)? setting = req.user.setting: setting = durationSetting;
            const today = new Date();
            const date = new Date(previousProcess[0].createdAt);
            const next3days = new Date(date.getFullYear(), date.getMonth(), date.getDate() + setting);
        
            if(previousProcess[0].status !== 'failed') {
                if(today < next3days ) {
                    return res.status(401).send({ error : "You have no permission to create the process"});
                }
            }
        }

        //code update
        const code = await Code.findOne({ text : req.body.code, owner: req.body.userid});
        if(!code) {
            return res.status(404).send({ error : "You code is not for that user"});
        }
        if(code.isUsed === true) {
            return res.status(400).send({ error : "You have already used that code"});
        }
       
        code.isUsed = true;
        await code.save();

        const newprocess = new Process({
            user: req.body.userid,
            machine: machine._id,
            code : code._id,
            status: "processing"
        });
        const c2Dsg = {
            tranID : newprocess._id,
            machineID: req.body.name,
            userID: req.body.userid,
            status: newprocess.status
        }
        await IotController.sendC2D(c2Dsg,machine.iotString);
        await newprocess.save();
        // destory the session
        if(req.session.views) {
            await req.session.destroy();
        }
        res.send({newprocess,code});
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.createProcessFromQr = async(req,res) => {
    try {
        const qrid =  req.body.qrid;
        const qr = await Qr.findById(qrid);
        const machine = await Machine.findById(qr.machine);
        if(!machine || machine.status === 'unavailable' || machine.status === 'failed') {
            return res.status(404).send({ error : "You code is not for that machine"});
        }
        const lastestProcess = await Process.find({ machine: machine._id}).sort({ _id: -1}).limit(1);
        if(lastestProcess[0].status === 'processing') {
            return res.status(400).send({ error : "Please wait for a moment" });
        }
        const previousProcess = await Process.find({ user: qr.user}).sort({_id:-1}).limit(1);
        if(previousProcess.length !== 0) {
            if(previousProcess[0].status === 'processing' || previousProcess[0].status === 'unavailable') {
                return res.status(405).send({ error : "You are not ready for this action"});
            }

            //check process with setting
            let setting = '';
            (req.user)? setting = req.user.setting: setting = durationSetting;
            const today = new Date();
            const date = new Date(previousProcess[0].createdAt);
            const next3days = new Date(date.getFullYear(), date.getMonth(), date.getDate() + setting);
        
            if(previousProcess[0].status !== 'failed') {
                if(today < next3days ) {
                    return res.status(401).send({ error : "You have no permission to create the process"});
                }
            }
        }

        //code update
        const code = await Code.findById(qr.code);
        if(!code) {
            return res.status(404).send({ error : "You code is not for that user"});
        }
        if(code.isUsed === true) {
            return res.status(400).send({ error : "You have already used that code"});
        }
       
        code.isUsed = true;
        await code.save();

        const newprocess = new Process({
            user: qr.user,
            machine: machine._id,
            code : code._id,
            status: "processing"
        });
        const c2Dsg = {
            tranID : newprocess._id,
            machineID: machine.name,
            userID: qr.userid,
            status: newprocess.status
        }
        await IotController.sendC2D(c2Dsg,machine.iotString);
        await newprocess.save();
        // destory the session
        if(req.session.views) {
            await req.session.destroy();
        }
        res.send({ data: 'Success'});
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.testDevice = async(req,res) => {
    try {
        const machine = await Machine.findOne({name : req.body.name });
        if(!machine || machine.status === 'unavailable' || machine.status === 'failed') {
            return res.status(400).send({ error : "Machine is unavailable"});
        }
        const newprocess = new Process({
            user: '5ebe30f31238fd0828952408',
            machine: machine._id,
            code : '5ebe30f31238fd0828952409',
            status: "completed"
        });
        await newprocess.save();

        const c2Dsg = {
            tranID : newprocess._id,
            machineID: req.body.name,
            userID: '5ebe30f31238fd0828952408',
            status: newprocess.status
        }
        await IotController.sendC2D(c2Dsg,machine.iotString);
        res.send({ data: "success"});
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.filterProcess = async(req,res) => {
    try {
        const type = req.query.sortBy;
        const processes = [];
        switch (type) {
            case 'qruser':
                processes = await Process.find()
                                    .populate({ path: 'user', select: 'name' })
                                    .populate({ path: 'machine',select: ['name','code']})
                                    .populate({ path: 'code',select: ['text']})
                break
            default:
                break;
        }
        res.send({ data: processes});
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.filterProcessByTime = async (req,res) => {
    try {
        const { from, to } = req.params;
        const processes = await Process.find({ createdAt :{ $gte: from, $lte: to}})
                                    .populate({ path: 'user', select: 'name' })
                                    .populate({ path: 'machine',select: ['name','code']})
                                    .populate({ path: 'code',select: ['text']});
        res.send({ data: processes});
    } catch(e){
        res.status(500).send(e);
    }
}