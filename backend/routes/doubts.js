const express=require("express");


const { Doubts} = require("../db");
const router=express.Router();
router.post("/DoubtSection",(req,res)=>{
    res.json({
        message:"running"
    })
const title=req.body.title;
const description=req.body.description;
const image=req.body.image;
Doubts.create({
    title,
    description,
    image

})
console.log(req.body)
res.json({
    message: 'doubt created successfully'
})


})
router.get("/DoubtSection", async (req, res) => {
  try {
    const doubts = await Doubts.find();
    res.json(doubts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports=router;