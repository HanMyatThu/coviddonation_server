const mongoose = require('mongoose');
const Code = require('./Code');

const machineSchema = mongoose.Schema({
    name : {
        type : String
    },
    location : {
        type : String,
        required : true,
        trim: true,
        lowercase: true,
    },
    iotStream : {
        type : String,
    }
})


// relationship chate
machineSchema.virtual('codes',{
    ref: 'codes',
    localField: '_id',
    foreignField: 'machine'
})


// Delete user tasks when user is removed
machineSchema.pre('remove',async function(next){
    const machine = this
    await Code.deleteMany({ machine: machine._id});

    next();
})

const Machine = mongoose.model('machines',machineSchema);

module.exports = Machine