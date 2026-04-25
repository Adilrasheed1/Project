import { useState } from "react";
import { CentralContent } from "../components/CentralContent";
import { ProfileSection } from "../components/ProfileSection";
import { SideMenu } from "../components/SideMenu";
import { Home, HelpCircle, FileText, BarChart } from "lucide-react";
import TestDashboard from "../components/TestDashboard";
import Exam from "../pages/exam";

export function StudentDashboard() {
  const [section, setSection] = useState("home");
  const [selectedExam, setSelectedExam] = useState(null);

  // FULL SCREEN EXAM MODE
  if (selectedExam) {
    return (
      <div className="h-screen w-full bg-white">
        <Exam
          examName={selectedExam}
          onBack={() => setSelectedExam(null)}
        />
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-white flex overflow-hidden">

      {/* LEFT SIDEBAR */}
      <div className="hidden md:flex w-[90px] justify-center items-center">
        <SideMenu
          section={section}
          onClickTest={() => setSection("Test")}
          onClickHome={() => setSection("home")}
          onClickDoubts={() => setSection("doubts")}
        />
      </div>

      {/* MAIN CONTENT */}
      <CentralContent
        section={section}
        setSelectedExam={setSelectedExam}   // 🔥 PASS THIS
        className="flex-1 overflow-y-auto no-scrollbar overflow-x-hidden px-3 sm:px-6 md:px-8"
      />

      {/* RIGHT PANEL */}
      <div className="hidden lg:flex w-[260px] justify-center items-center">
        <ProfileSection />
      </div>

      {/* MOBILE NAV */}
      <div className="fixed bottom-2 w-full flex justify-center md:hidden">
        <div className="bg-[#eeeff1] rounded-2xl w-[92%] py-3 px-2 flex justify-evenly shadow-xl">

          <button onClick={() => setSection("home")}>Home</button>
          <button onClick={() => setSection("doubts")}>Doubts</button>
          <button onClick={() => setSection("Test")}>Tests</button>
          <button onClick={() => setSection("Progress")}>Progress</button>

        </div>
      </div>

    </div>
  );
}