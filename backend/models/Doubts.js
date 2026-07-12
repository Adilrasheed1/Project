const mongoose=require("mongoose");
const doubtSchema=new mongoose.Schema({
    title:String,
    description:String,
    image:String
})
const Doubts=mongoose.model("Doubts",doubtSchema);
module.exports={Doubts};