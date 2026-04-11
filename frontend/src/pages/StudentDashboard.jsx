
import { CentralContent } from "../components/CentralContent";
import { ProfileSection } from "../components/ProfileSection";
import { SideMenu } from "../components/SideMenu";


import { useState } from "react";

export function StudentDashboard(){
   const [section, setSection] = useState("home");


    return <div className="grid grid-cols-5 bg-[#fcedf2] h-screen   ">
  <SideMenu  onClickHome={()=> setSection("home")} onClickDoubts={() => setSection("doubts")} className="col-span-1 w-40 mt-8  ml-8 "/>
  
<CentralContent section={section}/>
   
       
    

  <ProfileSection/>
    </div>
}