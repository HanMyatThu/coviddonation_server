const Code = require('../models/Code');
const User = require('../models/User');
const Machine = require('../models/Machine');
const cryptoRandomString = require('crypto-random-string');

exports.createCode = async (req,res) => {
    try{
        const iscodeexisted = await Code.findOne({ owner : req.body.owner});
        if(iscodeexisted) {
            return res.status(400).send({ error : "Code is already existed"});
        }
        const user = await User.findById(req.body.owner);
        const machine = await Machine.findOne({ location: user.township });

        const frontpart = await cryptoRandomString({length: 5, type: 'distinguishable'});
        const backpart = await cryptoRandomString({length: 5, type: 'distinguishable'});
        const content = `${frontpart}-${backpart}`

        const code = new Code({...req.body,content: content, machine: machine._id});
        await code.save();
        res.send(code);
    }catch(e) {
        res.status(500).send(e)
    }
}

exports.getAllCode = async(req,res) => {
    try {
        const codes = await Code.find()
            .populate({ path: 'owner' ,select: 'name city'})
            .populate({ path: 'machine'});
        res.send(codes);
    } catch(e) {
        res.status(500).send(e);
    }
}


exports.getCodeByUser = async(req,res) => {
    try {
        const codes = await Code.findOne({ owner: req.user._id});
        if(codes.length === 0 ) {
            return res.status(400).send({ error : "You don't have any code"});
        }
        res.send(codes);
    } catch(e) {
        res.status(500).send(e);
    }
}

exports.getCodeByID = async (req,res) => {
    const _id = req.params.id
    try{
        const task = await Task.findOne({ _id, owner: req.user._id} )
        if(!task) {
            return res.status(404).send()
        }

        res.status(201).send(task)
    }catch(e){
        res.status(500).send(e)
    }
}

exports.deleteCodeByID = async (req,res) => {
    try{
        const task = await Code.findOneAndDelete({ _id : req.params.id, owner : '5ea3e772f478e896a2768dae'})
        if(!task) {
            return res.status(404).send({ error: "Code not found"})
        }
        return res.send({data : "successfully deleted"})
    }catch(e){
        return res.status(500).send(e)
    }
}


// // Get/tasks?completed=true
// // pagination
// // Get /tasks?limit=10&skip=10
// // Get /tasks?sortBy=createdAt_asc or createdAt:desc
// router.get('/tasks',auth, async(req,res)=>{
//     const match = {}
//     const sort = {}
   
//     if(req.query.completed) {
//         match.completed = req.query.completed === 'true'
//     }

//     if(req.query.sortBy) {
//         const parts = req.query.split(':')
//         // mhan yin desc ml -1 ka desc 
//         sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
//     }

//     try{
//         // const tasks = await Task.find({ owner : req.user._id    })
//         await req.user.populate({
//             path: 'tasks',
//             match ,
//             options : {
//                 limit : parseInt(req.query.limit),
//                 skip : parseInt(req.query.skip),
//                 sort 
//             }
//         }).execPopulate()
//         res.status(201).send(req.user.tasks)
//     }catch (e){ 
//         res.status(500).send(e)
//     }
//     // Task.find({}).then((tasks)=>{
//     //     res.send(tasks)
//     // }).catch((e)=>{
//     //     res.status(500).send()
//     // })
// })


// router.patch('/tasks/:id',auth, async (req,res)=>{
//     const updates = Object.keys(req.body)
//     const fillables = ['description','fillables']
//     const isValidate = updates.every((update)=>fillables.includes(update))

//     if(!isValidate){
//         return res.send({ Error : 'Invalide update'})
//     }

//     try{
//         const task = await Task.findOne({_id : req.params.id, owner : req.user._id})
//         // const task = await Task.findById(req.params.id)
//         if(!task){
//             return res.status(400).send()
//         }
//         updates.forEach((update) => task[update] = req.body[update] );
//         await task.save()
//         // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
//         //     new : true,
//         //     runValidators: true
//         // })
       
        
//         res.send(task)
//     }catch(e) {
//         res.status(500).send(e)
//     }
// })
