import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TestDashboard from "../components/TestDashboard";
import Exam from "./exam";

const sidebarItems = [
  { icon: "⊞", label: "Dashboard", page: "dashboard" },
  { icon: "📚", label: "My Courses", page: "courses" },
  { icon: "🛍️", label: "Order History", page: "orders" },
  { icon: "🅐", label: "Tests", page: "tests" },
];

const s = {
  shell: { display: "flex", minHeight: "100vh", width: "100%", background: "#F7F4EE" },
  sidebar: { width: 90, minHeight: "100vh", background: "#EDE6DC", display: "flex", flexDirection: "column", alignItems: "center", padding: "0 0 24px", flexShrink: 0, borderRight: "1px solid #DDD6CC" },
  logoBox: { width: "100%", background: "#D8CFC4", padding: "18px 8px", textAlign: "center", marginBottom: 24 },
  logoText: { fontSize: 11, fontWeight: 800, color: "#333", letterSpacing: 1, lineHeight: 1.4 },
  sideNav: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, width: "100%", flex: 1 },
  sideItem: { width: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "14px 8px", cursor: "pointer", borderRadius: 8 },
  sideIcon: { fontSize: 22, marginBottom: 4 },
  sideLabel: { fontSize: 9, color: "#666", textAlign: "center", fontWeight: 600, letterSpacing: 0.3 },
  main: { flex: 1, minWidth: 0, overflowY: "auto" },
};

export default function TestsPage() {
  const navigate = useNavigate();
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

      {/* SIDEBAR — matches StudentDashboard exactly */}
      <div style={s.sidebar}>
        <div style={s.logoBox}>
          <span style={s.logoText}>TUTOR<br />CONNECT</span>
        </div>

        <div style={s.sideNav}>
          {sidebarItems.map(item => (
            <div
              key={item.page}
              style={{
                ...s.sideItem,
                background: item.page === "tests" ? "#E8E0D4" : "transparent"
              }}
              onClick={() => {
                if (item.page === "dashboard") navigate("/dashboard");
                if (item.page === "courses") navigate("/courses");
                if (item.page === "orders") navigate("/orders");
              }}
            >
              <span style={s.sideIcon}>{item.icon}</span>
              <span style={s.sideLabel}>{item.label}</span>
            </div>
          ))}
        </div>

      </div>

      {/* MAIN CONTENT */}
      <div style={s.main}>
        <TestDashboard setSelectedExam={setSelectedExam}/>
      </div>

    </div>
  );
}