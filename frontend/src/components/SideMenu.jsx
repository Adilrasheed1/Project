import { SideCompo } from "./SideCompo";
import { useState } from "react";
import { Home, HelpCircle, FileText, BarChart } from "lucide-react";
export function SideMenu(props){
  return (
    <div className={`${props.className} h-full flex items-center justify-center`}>
      
      <div className="bg-[#eeeff1] h-[90%] w-full ml-5 rounded-xl shadow-2xl flex flex-col items-center justify-evenly p-4">

        <SideCompo 
          title="Home"
          icon={Home}
          onClick={props.onClickHome}
          isActive={props.section === "home"}
        />

        <SideCompo 
          title="Doubts"
          icon={HelpCircle}
          onClick={props.onClickDoubts}
          isActive={props.section === "doubts"}
        />

        <SideCompo 
          title="Tests"
          icon={FileText}
          onClick={props.onClickTest}
          isActive={props.section === "Test"}
        />

        <SideCompo 
          title="Progress"
          icon={BarChart}
          onClick={() => {}}
          isActive={props.section === "Progress"}
        />

      </div>
 const [section, setSection] = useState("home");
    const navigate=useNavigate();
    return <div className={`${props.className}`}>
        <div className="h-138  w-60 bg-gray-300 flex flex-col pl-5 pt-20 text-lg font-semibold rounded-lg border-1 border-gray-400">
        <SideCompo title={props.title1} className={`${props.classHome}`} onClick=
            {props.onClickHome}
      />
            <SideCompo title={props.title2}  className={`${props.classDoubts}`}onClick={props.onClickDoubts}
                
                
                
                 />
            <SideCompo title={props.title3} className={`${props.classCourses}`} onClick={props.onClickCourses}/>
            <SideCompo title={props.title4} className={`${props.classTests}`}/>
            <SideCompo title={props.title5}/>
        </div>
    </div>
  );
}