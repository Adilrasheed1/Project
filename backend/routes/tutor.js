const express=require("express");


const { Tutors} = require("../db");
const tutorMiddleware = require("../middlewares/tutor");
const router=express.Router();
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
router.post("/login", tutorMiddleware, (req, res) => {
  res.json({
    msg: "Login successful"
  });
});

module.exports=router;