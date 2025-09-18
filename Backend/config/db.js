const mongoose = require('mongoose');

const ConnectDB = async(req,res)=>{
    try{
        const connection  = await mongoose.connect(process.env.MONGO_URI);
        console.log(`DB Connected:${connection.connection.host}`);

    }
    catch(err){
        console.log("error")
        res.status(400).josn({message:err.message})

    }
}
module.exports = ConnectDB