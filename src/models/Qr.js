const mongoose = require('mongoose');

const QrSchema = mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'users',
    },
    machine: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'machines',
    },
    code : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'codes',
    },
    activate: {
        type :Boolean,
        default : false
    },
},{
    timestamps:true
})

const Qr = mongoose.model('qrs', QrSchema);

module.exports = Qr;