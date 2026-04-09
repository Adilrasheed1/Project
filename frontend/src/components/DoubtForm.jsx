import { InputCompo } from "./InputCompo";
import { ButtonComp } from "./ButtonComp";
import { useState } from "react";

export function DoubtForm(){
    const[title,setTitle]=useState("");
    const[description,setDescription]=useState("");
    const[image,setImage]=useState("")
    return <div className="h-150 w-150  mx-5 my-5 rounded-lg border-1 border-gray-200 pt-5 pl-5 ">
        <InputCompo label="Doubt" Type="text"  className="w-80 h-10 px-3 text-sm text-gray-700  border-1 border-gray-200  rounded-lg  mb-5 " Placeholder="write the name of doubt" value={title} onchangemail={function(e){
            
                setTitle(e.target.value)

            }}/>
        <InputCompo label="Detailed Description" Type="text" className="w-80 h-20 px-3 text-sm text-gray-700  border-1 border-gray-200  rounded-lg " Placeholder="Explain your doubt in detail....." value={description} onchangemail={function(e){
                setDescription(e.target.value)
            }} />
        <InputCompo label="Attachments" Type="file" className="w-80 h-20 px-3 text-sm text-gray-700  border-1 border-gray-200  rounded-lg " Placeholder="choose image"value={image} onchangemail={function(e){
                setImage(e.target.value)
            }}/>
        <ButtonComp click={ ()=>{
         fetch("http://localhost:3000/doubts/DoubtSection", {
          method: "POST",
           headers: {
           "Content-Type": "application/json"
      },
          body: JSON.stringify({
         title,
         description,
         image
      })
    })
       .then(async function(res) {
       const json=await res.json();
     
  if (res.ok) {
   alert("doubt uploaded")
  } else {
    alert(json.msg || "doubt failed");
  }
      })
      .catch(err => {
  console.log(err);
  alert("Server error");
});
    }} title="Connect To Tutor" className={"bg-gray-200 text-gray-700 border-1 border-gray-200 mt-5 ml-3"} />
    </div>
}