const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://Adil:Adil123@cluster0.ldkvky8.mongodb.net/");
const adminSchema= new mongoose.Schema({
username:String,
password:String
})
const userSchema= new mongoose.Schema({
username:String,
password:String,
})
const Admin=mongoose.model('Admin',adminSchema);
const User=mongoose.model('User',userSchema);
module.exports={
Admin,
User
}