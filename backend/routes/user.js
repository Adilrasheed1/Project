const express=require("express");

const userMiddleware=require("../middlewares/user");
const { User} = require("../db");
const router=express.Router();
router.post("/signup",(req,res)=>{
const username=req.body.username;
const password=req.body.password;
User.create({
    username,
    password
})
res.json({
    message: 'User created successfully'
})


})
router.post("/login", userMiddleware, (req, res) => {
  res.json({
    msg: "Login successful"
  });
});
module.exports=router;