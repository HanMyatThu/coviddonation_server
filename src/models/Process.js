const mongoose = require('mongoose');

const processSchema = mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'users'
    },
    machine: {
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'machines'
    },
    code : {
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'codes'
    },
    status: {
        type: String,
        default : 'processing'
    }
},{
    timestamps:true
})

const Process = mongoose.model('processes', processSchema);

module.exports = Process