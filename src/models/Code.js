const mongoose = require('mongoose');

const CodeSchema = mongoose.Schema({
    content : {
        type : String,
        trim: true,
        required: true
    },
    used : {
        type : Boolean,
        default : false,
    },
    owner :{
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'users'
    },
    machine : {
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref : 'machines'
    }
}, {
    timestamps:true
})

const Code = mongoose.model('codes', CodeSchema);
module.exports = Code