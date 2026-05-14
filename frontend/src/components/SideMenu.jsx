import SideCompo from "./SideCompo";
import { Home, HelpCircle, FileText, BarChart, NotebookTabs } from "lucide-react";

export function SideMenu(props) {
  const { isMobile } = props;

  return (
    <div className={
      isMobile
        ? "fixed bottom-0 left-0 w-full z-40 bg-[#eeeff1] border-t border-gray-200 shadow-lg h-16 flex flex-row items-center justify-around px-2"
        : "fixed top-0 left-0 h-screen w-44 z-40 flex items-center justify-center py-6"
    }>
     
      {!isMobile && (
        <div className="bg-[#eeeff1] h-full w-full ml-5 rounded-xl shadow-2xl flex flex-col items-center justify-evenly p-4">
          <SideCompo title="Home" icon={Home} onClick={props.onClickHome} isActive={props.section === "home"} />
          <SideCompo title="Doubts" icon={HelpCircle} onClick={props.onClickDoubts} isActive={props.section === "doubts"} />
          <SideCompo title="Courses" icon={NotebookTabs} onClick={props.onClickCourses} isActive={props.section === "courses"} />
          <SideCompo title="Tests" icon={FileText} onClick={props.onClickTest} isActive={props.section === "Test"} />
          <SideCompo title="Progress" icon={BarChart} onClick={props.onClickProgress} isActive={props.section === "Progress"} />
        </div>
      )}

      {isMobile && (
        <>
          <SideCompo title="Home" icon={Home} onClick={props.onClickHome} isActive={props.section === "home"} isMobile />
          <SideCompo title="Doubts" icon={HelpCircle} onClick={props.onClickDoubts} isActive={props.section === "doubts"} isMobile />
          <SideCompo title="Courses" icon={NotebookTabs} onClick={props.onClickCourses} isActive={props.section === "courses"} isMobile />
          <SideCompo title="Tests" icon={FileText} onClick={props.onClickTest} isActive={props.section === "Test"} isMobile />
          <SideCompo title="Progress" icon={BarChart} onClick={props.onClickProgress} isActive={props.section === "Progress"} isMobile />
        </>
      )}
    </div>
  );
}