import { CentralContent } from "../components/CentralContent";
import { ProfileSection } from "../components/ProfileSection";
import { SideMenu } from "../components/SideMenu";


import { useState } from "react";
import { TutorCentralContent } from "../components/TutorCentralContent";
export function TutorDashboard(){
    const [section, setSection] = useState("home");
   
   
       return <div className="grid grid-cols-5 bg-[#fcedf2] h-screen   ">
     <SideMenu title1='Home' title2="Sessions" title3="Courses" title4="MyStudents" title5="Tests"  classHome={section==='home' ? "bg-sky-500 text-slate-800" : "bg-gray-200 text-gray-950" } onClickHome={()=> setSection("home")} onClickDoubts={() => setSection("doubts")} className="col-span-1 w-40 mt-8  ml-8 " classDoubts={section==='doubts' ? "bg-sky-500 text-slate-800" : "bg-gray-200 text-gray-950" }/>
     
   <TutorCentralContent section={section}/>
      
          
       
   
     <ProfileSection/>
       </div>
}