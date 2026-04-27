import { SideCompo } from "./SideCompo";
import { Home, HelpCircle, FileText, BarChart } from "lucide-react";

export function SideMenu(props) {
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

    </div>
  );
}