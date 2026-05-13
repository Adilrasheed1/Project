import { LoginCard } from "../components/LoginCard";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
export const SignupPage=()=>{
  const navigate=useNavigate();
   const [email,setEmail]=useState("")
      const [password,setPassword]=useState("")
    return <div>
        
        <LoginCard msg="Sign up to continue learning" onclick={ ()=>{
         fetch("https://project-3-7kx1.onrender.com/user/signup", {
          method: "POST",
          headers: {
           "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username:email,
        password
      })
    })
       .then(async function(res) {
       const data=await res.json();
     
  if (res.ok) {
    console.log(data.username)
    localStorage.setItem("username", data.username);
   navigate("/StudentDashboard")
    alert("signup successful");
  } else {
    alert(data.msg || "signup failed");
  }
      })
      .catch(err => {
  console.log(err);
  alert("Server error");
});

    
    }} 
   onchangemail={function(e){
            
                setEmail(e.target.value)

            }}
            onchangepassword={function(e){
                setPassword(e.target.value)
            }} button="Create Student Account"/>
    </div>
}