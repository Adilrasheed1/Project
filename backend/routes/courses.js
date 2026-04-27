const express=require("express");


const { Courses} = require("../db");
const router=express.Router();
router.post("/",(req,res)=>{
    res.json({
        message:"running"
    })
const title=req.body.title;
const description=req.body.description;

Courses.create({
    title,
    description,


})
console.log(req.body)
res.json({
    message: 'Course created successfully'
})


})
router.get("/", async (req, res) => {
  try {
    const courses = await Courses.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports=router;