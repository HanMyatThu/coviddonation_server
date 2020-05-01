const mongoose = require('mongoose');

const processSchema = mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'users'
    },
    usedCode : {
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref : 'codes'
    },
    machine: {
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'machines'
    },
},{
    timestamps:true
})

const Process = mongoose.model('processes', processSchema);

module.exports = Process