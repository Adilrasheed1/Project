import { SideCompo } from "./SideCompo";
import { useNavigate } from "react-router-dom";

import { useState } from "react";
export function SideMenu(props){
 const [section, setSection] = useState("home");
    const navigate=useNavigate();
    return <div className={`${props.className}`}>
        <div className="h-138  w-60 bg-gray-300 flex flex-col pl-5 pt-20 text-lg font-semibold rounded-lg border-1 border-orange-800">
        <SideCompo title="Home" className={`${props.classHome}`} onClick=
            {props.onClickHome}
      />
            <SideCompo title="DoubtSection"  className={`${props.classDoubts}`}onClick={props.onClickDoubts}
                
                
                
                 />
            <SideCompo title="Courses"/>
            <SideCompo title="Progress"/>
            <SideCompo title="Tests"/>
        </div>
    </div>
}