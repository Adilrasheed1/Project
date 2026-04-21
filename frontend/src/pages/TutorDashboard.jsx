import { CentralContent } from "../components/CentralContent";
import { ProfileSection } from "../components/ProfileSection";
import { SideMenu } from "../components/SideMenu";


import { useEffect, useState } from "react";
import { TutorCentralContent } from "../components/TutorCentralContent";
export function TutorDashboard(){
  
    const [section, setSection] = useState("home");

  const [request, setRequest] = useState(null);
  useEffect(()=>{
    console.log("connecting to wss")
   const socket=new WebSocket('ws://localhost:8000')
   socket.onopen=()=>{
      socket.send(JSON.stringify({type:'tutor'}))
   }
   console.log("connected")

   socket.onmessage = (event) => {
   console.log("MESSAGE RECEIVED:", event.data); 
  const msg = JSON.parse(event.data);
  console.log(msg)

  if (msg.type === "incoming_request") {
    setRequest(msg); // show popup
  }
};
   },[])
   function accept() {
  console.log("Accepted request:", request);
  setRequest(null); // close popup
}
       return <div className="grid grid-cols-5 bg-[#fcedf2] h-screen   ">
     <SideMenu title1='Home' title2="Sessions" title3="Courses" title4="MyStudents" title5="Tests"  classHome={section==='home' ? "bg-sky-500 text-slate-800" : "bg-gray-200 text-gray-950" } onClickHome={()=> setSection("home")} onClickDoubts={() => setSection("doubts")} className="col-span-1 w-40 mt-8  ml-8 " classDoubts={section==='doubts' ? "bg-sky-500 text-slate-800" : "bg-gray-200 text-gray-950" } onClickCourses={() => setSection("courses")} className="col-span-1 w-40 mt-8  ml-8 " classCourses={section==='courses' ? "bg-sky-500 text-slate-800" : "bg-gray-200 text-gray-950" }/>
     
   <TutorCentralContent section={section}/>
      
          
       
   
     <ProfileSection/>
     {request && (
  <div>
    <h3>{request.title}</h3>
    <button onClick={accept}>Accept</button>
  </div>
)}
       </div>
}