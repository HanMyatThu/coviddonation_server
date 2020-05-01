const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const auth = async (req,res,next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const data = jwt.verify(token,process.env.JWT_KEY);
        
        // koz server ka htoke tae user lr check tr
        const admin = await Admin.findOne({ _id: data._id , 'tokens.token': token})
    
        if(!admin){
            throw new Error('Admin not found');
        }
    
        req.token = token;
        req.user = admin;   
    
        next();
    }catch(e) {
        res.status(401).send({
            error : 'Please authenticate'
        })
    }
}

module.exports = auth