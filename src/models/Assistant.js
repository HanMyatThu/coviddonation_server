const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AssistantSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type : String,
        required :true,
        unique : true,

    },
    createdBy: {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'admins'
    },
    active: {
        type : Boolean,
        default : false
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('passowrd cannot contain password' )
            }
        }
    }
}, {
    timestamps : true,
})

// object ko access ya dl
AssistantSchema.statics.findByCredentials = async(phone,password)=>{
    const user = await Assistant.findOne({ phone });

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
AssistantSchema.methods.toJSON =  function(){
    const user = this
    const userObj = user.toObject()

    delete userObj.password
    return userObj

}

// use standard function hash the password before saving
AssistantSchema.pre('save', async function(next) {
    const user = this

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password,8)
    }

    next()
})


const Assistant = mongoose.model('assistants', AssistantSchema);

module.exports =  Assistant;