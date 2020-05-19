const mongoose = require('mongoose');

const requestSchema = mongoose.Schema({
    type : {
        type: String,
        required: true,
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'users'
    },
    status: {
        type : String,
        required: true,
        default: "open"
    }
},{
    timestamps : true
})

const Request = mongoose.model('requests', requestSchema);

module.exports = Request;