
import { LoginCard } from "../components/LoginCard";

 import { useState } from "react"
export function LoginPage(){
   const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    return <div>
     
            
     
      <LoginCard  onclick={ ()=>{
         fetch("http://localhost:3000/user/login", {
          method: "POST",
          headers: {
        username: email,
        password: password
      }
      
    })
       .then(async function(res) {
       const json=await res.json();
     
  if (res.ok) {
    alert("Login successful");
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
