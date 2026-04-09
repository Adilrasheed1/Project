const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://Adil:Adil123@cluster0.ldkvky8.mongodb.net/DoubtsolvingApp");

const adminSchema= new mongoose.Schema({
username:String,
password:String
})
const userSchema= new mongoose.Schema({
username:String,
password:String,
})
const doubtsSchema=new mongoose.Schema({
    title:String,
    description:String,
    image:String
})
const Admin=mongoose.model('Admin',adminSchema);
const User=mongoose.model('User',userSchema);
const Doubts=mongoose.model('Doubts',doubtsSchema);
module.exports={
Admin,
User,
Doubts
}
