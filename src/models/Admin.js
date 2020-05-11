const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator')

const adminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    occupation: {
        type : String,
        required: true,
    },
    nationalID: {
        type : String,
        unique: true,
        required: true,
    },
    address: {
        type : String,
        required: true,
    },
    city: {
        type : String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    email : {
        type : String,
        unique: true,
        required: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid Email")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('passowrd cannot contain password' )
            }
        }
    },
    tokens : [{
        token : {
            type : String,
        }
    }],
    setting : {
        type: Number,
        default: 3
    }
})

adminSchema.methods.generateAuthToken = async function() {
    const admin = this;

    const token = jwt.sign({ _id : admin._id.toString() }, process.env.JWT_KEY,{ expiresIn : '2 days'})

    admin.tokens = admin.tokens.concat({
        token
    })
    await admin.save();

    return token
}


// object ko access ya dl
adminSchema.statics.findByCredentials = async(phone,password)=>{
    const admin = await Admin.findOne({ phone });

    if(!admin){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password,admin.password)
    if(!isMatch) {
        throw new Error('Different Credientials')
    }
    return admin
}


// password ma pya chin lo
adminSchema.methods.toJSON =  function(){
    const admin = this
    const adminObj = admin.toObject()

    // delete adminObj.password
    // delete adminObj.tokens
    return adminObj

}

// use standard function hash the password before saving
adminSchema.pre('save', async function(next) {
    const admin = this

    if(admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password,8)
    }

    next()
})

const Admin = mongoose.model('admins', adminSchema);

module.exports = Admin;