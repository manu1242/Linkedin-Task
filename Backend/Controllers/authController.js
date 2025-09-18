const User = require('../Model/UserModel');
const register = async(req,res)=>{
    try{
        const {Name ,Email,Password,UserType}=req.body;
        if(!Email|| !Password||!Name){
            res.status(400).json({message:"required All feilds"})
        }


    }
    catch(err){
        res.status(500).json({message:err.message
        })
    }

}