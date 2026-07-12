import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const subjects = ["All", "Mathematics", "Physics", "Chemistry", "Biology", "English", "Computer Science"];

const sidebarItems = [
  { icon: "⊞", label: "Dashboard", page: "dashboard" },
  { icon: "🛍️", label: "Order History", page: "orders" },
  { icon: "☝️", label: "Doubts", page: "doubts" },
  { icon: "🅐", label: "Tests", page: "tests" },
];

export  function CoursesPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [activeSubject, setActiveSubject] = useState("All");
  const [allCourses, setAllCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    loadCourses();
    loadMyCourses();
    loadStudent();
  }, []);

  async function loadCourses() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/courses`);
      const data = await res.json();
      // Ensure data is an array and filter out any accidental null values
      setAllCourses(Array.isArray(data) ? data.filter(c => c !== null) : []);
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
      // Only keep records where the course relationship successfully loaded
      setMyCourses(Array.isArray(data) ? data.filter(item => item && item.course) : []);
    } catch (err) {
      console.log(err);
    }
  }

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

  const purchasedIds = useMemo(() => {
    return new Set(myCourses.map((item) => item.course?._id).filter(Boolean));
  }, [myCourses]);

  const filtered = useMemo(() => {
    if (!Array.isArray(allCourses)) return [];
    const validCourses = allCourses.filter(c => c && c._id);
    return activeSubject === "All"
      ? validCourses
      : validCourses.filter((c) => c.subject === activeSubject);
  }, [allCourses, activeSubject]);

  function CourseCard({ course }) {
    if (!course || !course._id) return null;
    const purchased = purchasedIds.has(course._id);

    return (
      <div
        style={{ ...s.card, background: course.color || "#4FB88A" }}
        onClick={() => navigate(`/course/${course._id}`)}
      >
        <div style={s.cardTop}>
          <span style={s.cardSubj}>
            <i style={{ fontSize: 11 }}>ƒ(x)</i> {course.subject || "General"}
          </span>
          <span style={s.cardRating}>⭐ {course.rating || 0}</span>
        </div>

        <p style={s.cardTitle}>{course.title || "Untitled Course"}</p>
        <p style={s.cardTutor}>{course.tutor || "Unknown Tutor"}</p>

        <button
          style={{
            ...s.buyBtn,
            opacity: purchased ? 0.75 : 1,
            cursor: purchased ? "default" : "pointer",
          }}
          disabled={purchased}
          onClick={(e) => {
            e.stopPropagation();
            if (!purchased) navigate(`/course/${course._id}`);
          }}
        >
          {purchased ? "Purchased" : "Buy Now"}
        </button>
      </div>
    );
  }

  return (
    <div style={s.shell} className="app-shell">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { width: 100%; min-height: 100vh; overflow-x: hidden; }
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #F7F4EE; }

        @media (max-width: 900px) {
          .app-shell { flex-direction: column !important; }
          .app-sidebar {
            position: fixed !important; bottom: 0 !important; left: 0 !important; right: 0 !important; top: auto !important;
            width: 100% !important; height: 64px !important; min-height: 64px !important;
            flex-direction: row !important; padding: 0 !important; border-right: none !important;
            border-top: 1px solid #DDD6CC; z-index: 200 !important;
          }
          .app-logoBox { display: none !important; }
          .app-sideNav { flex-direction: row !important; width: 100% !important; height: 100% !important; justify-content: space-around !important; }
          .app-sideItem { padding: 6px 4px !important; border-radius: 0 !important; flex: 1 !important; }
          .app-sideBottom { display: none !important; }
          .app-main { padding: 16px 14px 84px !important; width: 100% !important; order: 2 !important; }
          .app-rightPanel { width: 100% !important; min-height: auto !important; border-left: none !important; border-bottom: 1px solid #DDD6CC; order: 1 !important; }
          .app-heroTitle { font-size: 22px !important; }
          .app-grid { grid-template-columns: 1fr !important; }
          .app-pillRow { overflow-x: auto !important; flex-wrap: nowrap !important; padding-bottom: 6px; }
          .app-pillRow::-webkit-scrollbar { display: none; }
        }
      `}</style>

      <div style={s.sidebar} className="app-sidebar">
        <div style={s.logoBox} className="app-logoBox">
          <span style={s.logoText}>TUTOR{"\n"}CONNECT</span>
        </div>

        <div style={s.sideNav} className="app-sideNav">
          {sidebarItems.map((item) => (
            <div
              key={item.page}
              style={s.sideItem}
              className="app-sideItem"
              onClick={() => {
                if (item.page === "dashboard") navigate("/dashboard");

                if (item.page === "orders") navigate("/orders");

                if (item.page === "doubts") navigate("/DoubtSection");
              }}
            >
              <span style={s.sideIcon}>{item.icon}</span>
              <span style={s.sideLabel}>{item.label}</span>
            </div>
          ))}
        </div>

        <div
          style={{ ...s.sideBottom, cursor: "pointer" }}
          className="app-sideBottom"
          onClick={() => navigate("/student-profile")}
        >
          <div style={s.avatarCircle}>👤</div>
          <span style={s.sideLabel}>Profile</span>
        </div>
      </div>

      <div style={s.main} className="app-main">
        <h1 style={s.heroTitle} className="app-heroTitle">
          COURSES THAT TEACH.
          <br />
          TUTORS THAT GUIDE.
        </h1>

        <div style={s.pillRow} className="app-pillRow">
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubject(sub)}
              style={{
                ...s.pill,
                border: activeSubject === sub ? "2px solid #7A73D8" : "1.5px solid #D8D2C8",
                background: activeSubject === sub ? "#F0EFFD" : "white",
                color: activeSubject === sub ? "#7A73D8" : "#444",
              }}
            >
              {sub === "Mathematics" && <span style={{ ...s.pillIcon, background: "#4FB88A" }}>∫</span>}
              {sub === "Physics" && <span style={{ ...s.pillIcon, background: "#7A73D8" }}>⚗</span>}
              {sub === "Chemistry" && <span style={{ ...s.pillIcon, background: "#E89B3C" }}>⚛</span>}
              {sub === "Biology" && <span style={{ ...s.pillIcon, background: "#D8493F" }}>🧬</span>}
              {sub === "English" && <span style={{ ...s.pillIcon, background: "#4A90D9" }}>✎</span>}
              {sub === "Computer Science" && <span style={{ ...s.pillIcon, background: "#333" }}>💻</span>}
              {sub}
            </button>
          ))}
        </div>

        <p style={s.sectionLabel}>SUGGESTED FOR YOU</p>
        <div style={s.grid} className="app-grid">
          {filtered.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>

        <p style={{ ...s.sectionLabel, marginTop: 32 }}>TRENDING COURSES</p>
        <div style={s.grid} className="app-grid">
          {filtered.slice(0, 2).map((course) => (
            <CourseCard key={`trending-${course._id}`} course={course} />
          ))}
        </div>
      </div>

      <div style={s.rightPanel} className="app-rightPanel">
        <div style={s.profileBox}>
          <div style={s.profileAvatar}>
            {student?.firstName?.charAt(0).toUpperCase() || "👤"}
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
              if (!c || !c._id) return null; // Safe guard: bypass broken relationships entirely

              const progress = item.progress || 0;

              return (
                <div key={c._id} style={{ ...s.myCourseCard, background: c.color || "#4FB88A" }}>
                  <div style={s.cardTop}>
                    <span style={s.cardSubj}>{c.subject || "General"}</span>
                    <span style={s.cardRating}>⭐ {c.rating || 0}</span>
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
    </div>
  );
}

const s = {
  shell: { display: "flex", minHeight: "100vh", width: "100%", background: "#F7F4EE" },
  sidebar: { width: 90, minHeight: "100vh", background: "#EDE6DC", display: "flex", flexDirection: "column", alignItems: "center", padding: "0 0 24px", flexShrink: 0, borderRight: "1px solid #DDD6CC" },
  logoBox: { width: "100%", background: "#D8CFC4", padding: "18px 8px", textAlign: "center", marginBottom: 24 },
  logoText: { fontSize: 11, fontWeight: 800, color: "#333", letterSpacing: 1, lineHeight: 1.6, whiteSpace: "pre-line" },
  sideNav: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, width: "100%", flex: 1 },
  sideItem: { width: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "14px 8px", cursor: "pointer", borderRadius: 8 },
  sideIcon: { fontSize: 22, marginBottom: 4 },
  sideLabel: { fontSize: 9, color: "#666", textAlign: "center", fontWeight: 600, letterSpacing: 0.3 },
  sideBottom: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginTop: "auto" },
  avatarCircle: { width: 44, height: 44, borderRadius: "50%", background: "#C8BFB4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 4, fontWeight: 700, color: "#444" },
  main: { flex: 1, padding: "40px 36px", minWidth: 0 },
  heroTitle: { fontFamily: "Arial Black, Arial, sans-serif", fontSize: 32, fontWeight: 900, color: "#1A1A1A", lineHeight: 1.15, marginBottom: 28, letterSpacing: 0 },
  pillRow: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 },
  pill: { display: "flex", alignItems: "center", gap: 8, padding: "8px 18px 8px 8px", borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 },
  pillIcon: { width: 24, height: 24, borderRadius: "50%", color: "white", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 },
  sectionLabel: { fontSize: 11, fontWeight: 700, color: "#999", letterSpacing: "0.1em", marginBottom: 16 },
  grid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 },
  card: { borderRadius: 16, padding: "18px 18px 14px", color: "white", cursor: "pointer", minHeight: 170, display: "flex", flexDirection: "column", justifyContent: "space-between" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 10 },
  cardSubj: { background: "rgba(255,255,255,0.22)", padding: "4px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700 },
  cardRating: { background: "white", color: "#222", padding: "4px 9px", borderRadius: 100, fontSize: 11, fontWeight: 700 },
  cardTitle: { fontSize: 14, fontWeight: 800, lineHeight: 1.35, textTransform: "uppercase", flex: 1, margin: "8px 0" },
  cardTutor: { fontSize: 10, opacity: 0.85, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 },
  buyBtn: { marginTop: 14, border: "none", borderRadius: 8, padding: "10px", width: "100%", background: "white", color: "#111", fontWeight: 700, fontSize: 13 },
  rightPanel: { width: 260, minHeight: "100vh", background: "#EDE6DC", padding: "20px 16px", flexShrink: 0, borderLeft: "1px solid #DDD6CC" },
  profileBox: { display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 },
  profileAvatar: { width: 72, height: 72, borderRadius: "50%", background: "#C8BFB4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "#444", marginBottom: 8, border: "3px solid white" },
  profileName: { fontSize: 12, fontWeight: 700, color: "#444", letterSpacing: 0.5 },
  panelHeader: { display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 12 },
  panelLabel: { fontSize: 10, fontWeight: 700, color: "#888", letterSpacing: "0.08em" },
  myCoursesList: { display: "flex", flexDirection: "column", gap: 12 },
  myCourseCard: { borderRadius: 14, padding: "14px 14px 12px", color: "white", cursor: "default", userSelect: "none" },
  progressRow: { display: "flex", alignItems: "center", gap: 8 },
  progressBar: { flex: 1, height: 4, background: "rgba(255,255,255,0.3)", borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", background: "white", borderRadius: 2 },
  progressText: { fontSize: 9, fontWeight: 700, opacity: 0.9, whiteSpace: "nowrap" },
};