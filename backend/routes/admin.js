const express=require("express");

const adminMiddleware=require("../middlewares/admin");
const { Admin} = require("../db");
const router=express.Router();
router.post("/signup",(req,res)=>{
const username=req.body.username;
const password=req.body.password;
Admin.create({
    username,
    password
})
res.json({
    message: 'Admin created successfully'
})


})
module.exports=router;