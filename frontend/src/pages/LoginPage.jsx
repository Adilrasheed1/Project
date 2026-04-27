
import { LoginCard } from "../components/LoginCard";
import { useNavigate } from "react-router-dom";

 import { useState } from "react"
export function LoginPage(){
  const navigate=useNavigate()
   const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    return <div>
     
            
     
      <LoginCard  msg="Sign in to continue learning" onclick={  ()=>{
         fetch("http://localhost:3000/user/login", {
          method: "POST",
          headers: {
        username: email,
        password: password
      }
      
    })
       .then(async function(res) {
       const data=await res.json()
   
       
     
  if (res.ok) {
   
      localStorage.setItem("username", data.username);
   navigate("/StudentDashboard")
  } else {
    alert(json.msg || "Login failed");
  }
      })
      .catch(err => {
  console.log(err);
  alert("Server error");
});

    
    }} onchangemail={function(e){
            
                setEmail(e.target.value)

            }}
            onchangepassword={function(e){
                setPassword(e.target.value)
            }}

    button="Sign In"/>
    </div>

  }
