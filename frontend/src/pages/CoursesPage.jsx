import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SharedSidebar from "../components/SharedSidebar";
import StudentRightPanel from "../components/StudentRightPanel";
import { Star } from "lucide-react";

const subjects = ["All", "Mathematics", "Physics", "Chemistry", "Biology", "English", "Computer Science"];

export function CoursesPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [activeSubject, setActiveSubject] = useState("All");
  const [allCourses, setAllCourses] = useState([]);
  // myCourses is still needed here — it drives the "Purchased" vs "Buy Now"
  // state on each course card below. StudentRightPanel fetches its own
  // separate copy for the sidebar list, which is fine — they're used for
  // different things.
  const [myCourses, setMyCourses] = useState([]);

  useEffect(() => {
    loadCourses();
    loadMyCourses();
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
        style={{ ...s.card, background: course.color || "#9fd200" }}
        onClick={() => navigate(`/course/${course._id}`)}
      >
        <div style={s.cardTop}>
          <span style={s.cardSubj}>
            <i style={{ fontSize: 11 }}>ƒ(x)</i> {course.subject || "General"}
          </span>
          <span style={s.cardRating}><Star size={11} fill="#222" /> {course.rating || 0}</span>
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
        body { font-family: ui-sans-serif, system-ui, Arial, sans-serif; background: #ffffff; }

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
          /* right panel removed on small screens (team decision pending) —
             .app-main is flex:1 already, so once the panel is gone it
             just stretches to fill the freed-up width on its own */
          .app-rightPanel { display: none !important; }
          .app-main { padding: 16px 14px 100px !important; width: 100% !important; }
          .app-heroTitle { font-size: 22px !important; }
          .app-grid { grid-template-columns: 1fr !important; }
          .app-pillRow { overflow-x: auto !important; flex-wrap: nowrap !important; padding-bottom: 6px; }
          .app-pillRow::-webkit-scrollbar { display: none; }
        }
      `}</style>

      <SharedSidebar activePage="courses" />

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
                border: activeSubject === sub ? "2px solid #165ee7" : "1.5px solid #dfe3e6",
                background: activeSubject === sub ? "#E4EEFD" : "white",
                color: activeSubject === sub ? "#165ee7" : "#444",
              }}
            >
              {sub === "Mathematics" && <span style={{ ...s.pillIcon, background: "#9fd200" }}>∫</span>}
              {sub === "Physics" && <span style={{ ...s.pillIcon, background: "#165ee7" }}>⚗</span>}
              {sub === "Chemistry" && <span style={{ ...s.pillIcon, background: "#F64515" }}>⚛</span>}
              {sub === "Biology" && <span style={{ ...s.pillIcon, background: "#000000" }}>❊</span>}
              {sub === "English" && <span style={{ ...s.pillIcon, background: "#165ee7" }}>✎</span>}
              {sub === "Computer Science" && <span style={{ ...s.pillIcon, background: "#000000" }}>{"</>"}</span>}
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

      <StudentRightPanel />
    </div>
  );
}

const s = {
  shell: { display: "flex", height: "100vh", width: "100%", overflow: "hidden", background: "#ffffff" },
  main: { flex: 1, padding: "40px 36px", minWidth: 0, height: "100vh", overflowY: "auto" },
  heroTitle: { fontFamily: "inherit", fontSize: 32, fontWeight: 900, color: "#1A1A1A", lineHeight: 1.15, marginBottom: 28, letterSpacing: 0 },
  pillRow: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 },
  pill: { display: "flex", alignItems: "center", gap: 8, padding: "8px 8px 8px 8px", borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 },
  pillIcon: { width: 24, height: 24, borderRadius: "50%", color: "white", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 },
  sectionLabel: { fontSize: 11, fontWeight: 700, color: "#999", letterSpacing: "0.1em", marginBottom: 16 },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 },
  card: { borderRadius: 16, padding: "18px 18px 14px", color: "white", cursor: "pointer", minHeight: 240, display: "flex", flexDirection: "column", justifyContent: "space-between" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 10 },
  cardSubj: { background: "rgba(255,255,255,0.22)", padding: "4px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700 },
  cardRating: { display: "flex", alignItems: "center", gap: 3, background: "white", color: "#222", padding: "4px 9px", borderRadius: 100, fontSize: 11, fontWeight: 700 },
  cardTitle: { fontSize: 14, fontWeight: 800, lineHeight: 1.35, textTransform: "uppercase", flex: 1, margin: "8px 0" },
  cardTutor: { fontSize: 10, opacity: 0.85, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 },
  buyBtn: { marginTop: 14, border: "none", borderRadius: 8, padding: "10px", width: "100%", background: "white", color: "#111", fontWeight: 700, fontSize: 13 },
};