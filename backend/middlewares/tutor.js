const {Tutors}=require("../db");
function tutorMiddleware(req,res,next){
    const username=req.headers.username;
    const password=req.headers.password;
    Tutors.findOne({
        username:username,
        password:password
    })
    .then(function(value){
        if(value){
            
            next();
        }else{
            res.status(403).json({
                msg:"Tutor does not exist"
            })
            
        }
    })
}
module.exports=tutorMiddleware;