import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, User } from "lucide-react";

export default function StudentRightPanel() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // This component owns its own data now — it doesn't need props
  // from the parent page. Every page that renders <StudentRightPanel />
  // gets fresh data automatically.
  const [student, setStudent] = useState(null);
  const [myCourses, setMyCourses] = useState([]);

  useEffect(() => {
    loadStudent();
    loadMyCourses();
  }, []); // empty array = run once, when the component first mounts

  async function loadStudent() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/student/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStudent(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function loadMyCourses() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;

      const data = await res.json();
      // Keep only entries where the linked course actually loaded.
      // (Guards against a deleted course still being referenced.)
      setMyCourses(Array.isArray(data) ? data.filter((item) => item && item.course) : []);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div style={s.rightPanel} className="app-rightPanel">
      <div style={s.profileBox}>
        <div style={s.profileAvatar}>
          {student?.firstName?.charAt(0).toUpperCase() || <User size={26} />}
        </div>
        <p style={s.profileName}>
          WELCOME, {student?.firstName?.toUpperCase() || "STUDENT"}
        </p>
      </div>

      <div style={s.panelHeader}>
        <span style={s.panelLabel}>MY COURSES</span>
        <span
          style={{ ...s.panelLabel, cursor: "pointer", textDecoration: "underline" }}
          onClick={() => navigate("/dashboard")}
        >
          VISIT DASHBOARD
        </span>
      </div>

      <div style={s.myCoursesList}>
        {myCourses.length === 0 ? (
          <p style={{ textAlign: "center", color: "#777", marginTop: 20, fontSize: 13 }}>
            No Purchased Courses
          </p>
        ) : (
          myCourses.map((item) => {
            const c = item?.course;
            if (!c || !c._id) return null; // skip broken/missing course links

            const progress = item.progress || 0;

            return (
              <div
                key={c._id}
                style={{ ...s.myCourseCard, background: c.color || "#9fd200" }}
                onClick={() => navigate(`/course/${c._id}`)}
              >
                <div style={s.cardTop}>
                  <span style={s.cardSubj}>{c.subject || "General"}</span>
                  <span style={s.cardRating}>
                    <Star size={10} fill="#222" /> {c.rating || 0}
                  </span>
                </div>

                <p style={{ ...s.cardTitle, fontSize: 12, marginBottom: 8 }}>
                  {c.title || "Untitled Course"}
                </p>

                <div style={s.progressRow}>
                  <div style={s.progressBar}>
                    <div style={{ ...s.progressFill, width: `${progress}%` }} />
                  </div>
                  <span style={s.progressText}>{progress}% COMPLETED</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const s = {
  rightPanel: { width: 260, height: "100vh", overflowY: "auto", background: "#eeeff1", padding: "20px 16px", flexShrink: 0 },
  profileBox: { display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 },
  profileAvatar: { width: 64, height: 64, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, marginBottom: 8, boxShadow: "0 2px 6px rgba(0,0,0,0.12)", color: "#1A1A1A" },
  profileName: { fontSize: 11, fontWeight: 700, color: "#444", letterSpacing: 0.5 },
  panelHeader: { display: "flex", justifyContent: "space-between", marginBottom: 12 },
  panelLabel: { fontSize: 9, fontWeight: 700, color: "#888", letterSpacing: "0.08em" },
  myCoursesList: { display: "flex", flexDirection: "column", gap: 10 },
  myCourseCard: { borderRadius: 12, padding: "12px 12px 10px", color: "white", cursor: "pointer" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  cardSubj: { background: "rgba(255,255,255,0.22)", padding: "3px 8px", borderRadius: 100, fontSize: 10, fontWeight: 700 },
  cardRating: { display: "flex", alignItems: "center", gap: 3, background: "white", color: "#222", padding: "3px 8px", borderRadius: 100, fontSize: 10, fontWeight: 700 },
  cardTitle: { fontSize: 13, fontWeight: 800, lineHeight: 1.3, textTransform: "uppercase", color: "white" },
  progressRow: { display: "flex", alignItems: "center", gap: 8 },
  progressBar: { flex: 1, height: 4, background: "rgba(255,255,255,0.3)", borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", background: "white", borderRadius: 2 },
  progressText: { fontSize: 9, fontWeight: 700, opacity: 0.9, whiteSpace: "nowrap" },
};