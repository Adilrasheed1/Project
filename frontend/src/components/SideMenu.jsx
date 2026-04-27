import { SideCompo } from "./SideCompo";
import { useNavigate } from "react-router-dom";

import { useState } from "react";
export function SideMenu(props){
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
}