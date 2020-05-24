const mongoose = require('mongoose');

const blacklistSchema = mongoose.Schema({
    user: {
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    active: {
        type: Boolean,
        default: false
    },
    reason: {
        type : String
    }
},{
    timestamps: true,
})

const BlackList = mongoose.model('blacklists',blacklistSchema);

module.exports = BlackList;