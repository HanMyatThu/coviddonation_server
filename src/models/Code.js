const mongoose = require("mongoose");

const CodeSchema = mongoose.Schema({
    text : {
        type : String,
        required: true
    },
    owner: {
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    isUsed: {
        type: Boolean,
        default: false,
        required: true,
    }
}, {
    timestamps:true
})




const Code = mongoose.model('codes',CodeSchema);

module.exports = Code