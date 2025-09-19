const requireRole = (roles=[])=>(req,res,next)=>{
    if(!Array.isArray(roles)) roles=[roles];
    if(!roles.includes(req.User.UserType)){
        res.status(400).json({
            message:"unknown role"
        })
    }
    next();
}