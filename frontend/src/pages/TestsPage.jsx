import { useState } from "react";
import TestDashboard from "../components/TestDashboard";
import Exam from "./exam";
import SharedSidebar from "../components/SharedSidebar";
import StudentRightPanel from "../components/StudentRightPanel";

const s = {
  shell: {
    display: "flex",
    height: "100vh",
    width: "100%",
    overflow: "hidden",
    background: "#ffffff",
  },

  main: {
    flex: 1,
    padding: "40px 36px",
    minWidth: 0,
    height: "100vh",
    overflowY: "auto",
  },
};

export default function TestsPage() {
  const [selectedExam, setSelectedExam] = useState(null);

  if (selectedExam) {
    return (
      <Exam
        exam={selectedExam}
        onBack={() => setSelectedExam(null)}
      />
    );
  }

  return (
    <div style={s.shell}>
      {/* This hides the scrollbar on the main content and right panel.
          CoursesPage has this same block — once you have more pages
          using SharedSidebar/StudentRightPanel, move this into your
          global index.css instead of repeating it per page. */}
      <style>{`
        .app-main::-webkit-scrollbar,
        .app-rightPanel::-webkit-scrollbar {
          display: none;
        }
        .app-main,
        .app-rightPanel {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        @media (max-width: 900px) {
          /* this page had no responsive rules at all before — right panel
             removed on small screens (team decision pending), and bottom
             padding added so the floating nav pill doesn't sit on top of
             the last test card */
          .app-rightPanel { display: none !important; }
          .app-main { padding: 16px 14px 100px !important; width: 100% !important; }
        }
      `}</style>

      {/* ── SIDEBAR ── */}
      <SharedSidebar activePage="tests" />

      {/* MAIN CONTENT */}
      <div style={s.main} className="app-main">
        <TestDashboard setSelectedExam={setSelectedExam} />
      </div>

      <StudentRightPanel />
    </div>
  );
}