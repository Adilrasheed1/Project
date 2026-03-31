import { LoginCard } from "../components/LoginCard";
import { useState } from "react"
export const SignupPage=()=>{
   const [email,setEmail]=useState("")
      const [password,setPassword]=useState("")
    return <div>
        
        <LoginCard  onclick={ ()=>{
         fetch("http://localhost:3000/user/signup", {
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
       const json=await res.json();
     
  if (res.ok) {
    alert("signup successful");
  } else {
    alert(json.msg || "signup failed");
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