import { InputCompo } from "./InputCompo";
import { ButtonComp } from "./ButtonComp";
import { useState } from "react";
export function CreatenewCourse(){
      const[title,setTitle]=useState("");
        const[description,setDescription]=useState("");
        const[image,setImage]=useState("")
    return <>
    <div className="mt-5 ml-5 pl-5 pt-3 pb-5 bg-gray-300 rounded-sm">
       <InputCompo label="Title*" Type="text"  className="w-80 h-10 px-3 text-sm text-gray-700  border-1 border-gray-200  rounded-lg  mb-5 " Placeholder="write the title of new course"  value={title} onchangemail={function(e){
            
                setTitle(e.target.value)

            }}/> 
        <InputCompo label="Description*" Type="text"  className="w-80 h-10 px-3 text-sm text-gray-700  border-1 border-gray-200  rounded-lg  mb-5 " Placeholder="write the description of your course" value={description} onchangemail={function(e){
                setDescription(e.target.value)
            }}/> 
        <InputCompo label="Attachments" Type="file" className="w-80 h-20 px-3 text-sm text-gray-700  border-1 border-gray-200  rounded-lg " Placeholder="Add resources" value={image} onchangemail={function(e){
                setImage(e.target.value)
            }}/>
         <ButtonComp  click={ ()=>{
         fetch("http://localhost:3000/courses/", {
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
   alert("Course uploaded")
  } else {
    alert(json.msg || "course upload failed");
  }
      })
      .catch(err => {
  console.log(err);
  alert("Server error");
});
    }} title="Add new Course" className={"bg-gray-200 text-gray-700 border-1 border-gray-200 mt-5 ml-3 hover:bg-blue-500 hover:text-white"} />
    </div>
    </>
}