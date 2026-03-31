const express=require("express");
console.log("Admin routes loaded");
const adminMiddleware=require("../middlewares/admin");
const { Admin} = require("../db");
const router=express.Router();
router.post("/signup",async(req,res)=>{
  
const username=req.body.username;
const password=req.body.password;
try {
    // 🔍 Step 1: Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });

    if (existingAdmin) {
      return res.status(403).json({
        msg: "Admin already exists"
      });
    }

Admin.create({
    username,
    password
})
res.json({
    message: 'Admin created successfully'
})
}
catch(err){
      res.status(500).json({
      msg: "Error creating admin"
    });
}
  


})
router.post("/login", adminMiddleware, (req, res) => {
    
  res.json({
    msg: "Login successful"
  });
});
module.exports=router;