const mongoose = require('mongoose');

const SMSSchema = mongoose.Schema({
    name: {
        type : String,
        required: true
    },
    phone :{
        type : String,
        required :true
    },
},{
    timestamps:true
})

const Smslog = mongoose.model('smslogs', SMSSchema);

module.exports = Smslog;