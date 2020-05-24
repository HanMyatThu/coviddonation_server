const mongoose = require('mongoose')
const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Code = require('../models/Code');
const Qr = require('../models/Qr');
const Process = require('../models/Process');
const Request = require('../models/Request')
const BlackList = require('../models/Blacklist');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    township: {
        type : String,
        required: true,
        trim: true,
        lowercase: true,
    },
    street :{
        type: String,
        default : 'street'
    },
    city: {
        type : String,
        default: 'yangon',
        trim: true,
        lowercase: true,
    },
    country :{
        type : String,
        default: 'myanmar',
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        trim : true,
        unique : true,
    },
    familyNo : {
        type: Number,
        required: true,
        default: 1,
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 5,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('passowrd cannot contain password' )
            }
        }
    },
    approved: {
        type: Boolean,
        default: false
    },
    qruser: {
        type: Boolean,
        default: false
    },
    tokens : [{
        token : {
            type : String,
        }
    }],
})



// relationship chate
UserSchema.virtual('codes',{
    ref: 'codes',
    localField: '_id',
    foreignField: 'owner'
})

// jwt instance method , object ko access ma ya woo
UserSchema.methods.generateAuthToken = async function() {
    const user = this;

    const token = jwt.sign({ _id : user._id.toString() }, process.env.JWT_KEY,{ expiresIn : '2 days'})

    user.tokens = user.tokens.concat({
        token
    })
    await user.save();

    return token
}


// object ko access ya dl
UserSchema.statics.findByCredentials = async(phone,password)=>{
    const user = await User.findOne({ phone });

    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch) {
        throw new Error('Different Credientials')
    }
    return user
}


// password ma pya chin lo
UserSchema.methods.toJSON =  function(){
    const user = this
    const userObj = user.toObject()

    delete userObj.password
    delete userObj.tokens
    return userObj

}

// use standard function hash the password before saving
UserSchema.pre('save', async function(next) {
    const user = this

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password,8)
    }

    next()
})

// Delete codes and process when user is removed
UserSchema.pre('remove',async function(next){
    const user = this
    await Code.deleteOne({ owner: user._id});
    await Process.deleteMany({ user: user._id });
    await Request.deleteMany({ user: user._id });
    await Qr.deleteOne({ user: user._id});
    await BlackList.deleteOne({ user: user._id});
    next()
})


const User = mongoose.model('users',UserSchema);

module.exports = User