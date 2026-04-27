const express=require("express");

const router=express.Router();
const { Tutors} = require("../db");
const tutorMiddleware = require("../middlewares/tutor");
router.post("/login",  tutorMiddleware,(req, res) => {
   
  res.json({
    msg: "Login successful"
  });
});
router.post("/signup",(req,res)=>{
const username=req.body.username;
const password=req.body.password;
Tutors.create({
    username,
    password
})
res.json({
    message: 'Tutor created successfully'
})


})


module.exports=router;