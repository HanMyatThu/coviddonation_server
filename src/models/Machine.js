const mongoose = require('mongoose');

const machineSchema = mongoose.Schema({
    name : {
        type : String,
        trim: true,
    },
    location : {
        type : String,
        required : true,
        trim: true,
        lowercase: true,
    },
    iotString : {
        type : String,
        default: null,
    },
    status: {
        type : String,
        default : 'Working'
    }
})


// relationship chate
machineSchema.virtual('processes',{
    ref: 'processes',
    localField: '_id',
    foreignField: 'machine'
})


// // Delete user tasks when user is removed
// machineSchema.pre('remove',async function(next){
//     const machine = this
//     await Code.deleteMany({ machine: machine._id});

//     next();
// })

const Machine = mongoose.model('machines',machineSchema);

module.exports = Machine