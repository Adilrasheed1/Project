const express=require("express");
const cors = require("cors");


const bodyParser=require("body-parser");
const app=express();
app.use(cors());
app.use(express.json()); 
const adminRouter=require("./routes/admin");
const userRouter=require("./routes/user");
app.use(bodyParser.json());
app.use("/admin",adminRouter);
app.use("/user",userRouter);
const port=3000;
app.listen(port,()=>{
    console.log(`server running on port ${port}`)
   
})