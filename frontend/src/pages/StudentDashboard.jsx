import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SharedSidebar from "../components/SharedSidebar";
import {
  BookOpen,
  User,
  Trophy,
  ClipboardList,
  LogOut,
} from "lucide-react";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);

  // Crash protection: Handle missing or invalid localStorage data gracefully
  const token = localStorage.getItem("token") || "";
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch (e) {
      return {};
    }
  })();

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/student/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch dashboard data");

      const data = await res.json();
      setDashboard(data);
    } catch (err) {
      console.error("Dashboard load error:", err);
      // Fallback state to prevent loading forever if API fails
      setDashboard({ stats: { courses: 0, completedCourses: 0 }, myCourses: [] });
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  }

  if (!dashboard)
    return <h2 style={{ padding: 40, color: "#333" }}>Loading...</h2>;

  return (
    <div style={s.shell} className="app-shell">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { width:100%; min-height:100vh; }
        body { font-family: ui-sans-serif, system-ui, Arial, sans-serif; background:#ffffff; }

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
          .app-statsGrid { grid-template-columns: repeat(2, 1fr) !important; }
          .app-courseGrid { grid-template-columns: 1fr !important; }
          .app-topRow { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .app-pageTitle { font-size: 22px !important; }
        }
        @media (max-width: 480px) {
          .app-statsGrid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* SIDEBAR */}
      <SharedSidebar activePage="dashboard" />

      {/* MAIN */}
      <div style={s.main} className="app-main">
        {/* header */}
        <div style={s.topRow} className="app-topRow">
          <div>
            <h1 style={s.pageTitle} className="app-pageTitle">Student Dashboard</h1>
            <p style={s.pageSub}>Welcome back, {user?.firstName || "Student"}</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={s.exploreBtn} onClick={() => navigate("/courses")}>Explore Courses</button>
            <button style={s.logoutBtn} onClick={handleLogout}>
              <LogOut size={15} />
              Log Out
            </button>
          </div>
        </div>

        {/* stats */}
        <div style={s.statsGrid} className="app-statsGrid">
          {[
            {
              label: "Courses Enrolled",
              value: dashboard?.stats?.courses ?? 0,
              icon: BookOpen,
              color: "#9fd200",
              soft: "#EEFBD8",
            },
            {
              label: "Completed Courses",
              value: dashboard?.stats?.completedCourses ?? 0,
              icon: Trophy,
              color: "#F64515",
              soft: "#FDE6DF",
            },
          ].map((st) => (
            <div
              key={st.label}
              style={{
                ...s.statCard,
                border: `1.5px solid ${st.color}20`,
              }}
            >
              <div style={{ ...s.statIcon, background: st.soft, color: st.color }}>
                <st.icon size={22} />
              </div>
              <div>
                <div style={{ ...s.statVal, color: st.color }}>
                  {st.value}
                </div>
                <div style={s.statLabel}>
                  {st.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* enrolled courses */}
        <h2 style={s.sectionTitle}>My Enrolled Courses</h2>
        <div style={s.courseGrid} className="app-courseGrid">
          {(dashboard?.myCourses || []).map((item) => {
            const c = item?.course || {};
            return (
              <div key={c._id || Math.random()} style={s.courseCard}>
                <div style={{ ...s.courseTop, background: c.color || "#9fd200" }}>
                  <span style={s.courseSubj}>
                    {c.subject || "General"}
                  </span>
                  <span
                    style={s.resumeBtn}
                    onClick={() =>
                      navigate("/lecture", {
                        state: { courseId: c._id },
                      })
                    }
                  >
                    Resume →
                  </span>
                </div>

                <div style={s.courseBody}>
                  <p style={s.courseTitle}>
                    {c.title || "Untitled Course"}
                  </p>
                  <p style={s.courseTutor}>
                    by {c.tutor || "Unknown Instructor"}
                  </p>
                  <div style={s.progressRow}>
                    <div style={s.progressBg}>
                      <div
                        style={{
                          ...s.progressFill,
                          width: (item?.progress || 0) + "%",
                          background: c.color || "#9fd200",
                        }}
                      />
                    </div>
                    <span style={s.progressPct}>
                      {item?.progress || 0}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* recent activity */}
        <h2 style={{ ...s.sectionTitle, marginTop: 32 }}>Recent Activity</h2>
        <div style={s.activityList}>
          {(dashboard?.myCourses || []).map((item, index) => (
            <div key={index} style={s.activityItem}>
              <div style={s.activityIcon}><BookOpen size={18} /></div>
              <div style={{ flex: 1 }}>
                <p style={s.activityText}>
                  Studying {item?.course?.title || "Course"}
                </p>
                <p style={s.activityTime}>
                  {item?.progress || 0}% Completed
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={s.rightPanel} className="app-rightPanel">
        <div style={s.profileCard}>
          <div style={s.profileAvatar}><User size={28} /></div>
          <p style={s.profileName}>{user?.firstName || "Guest"} {user?.lastName || ""}</p>
          <p style={s.profileEmail}>{user?.email || "No email provided"}</p>
          <div style={s.profileBadge}>Student</div>
        </div>

        <h3 style={s.panelTitle}>Weekly Goal</h3>
        <div style={s.goalCard}>
          <p style={s.goalText}>Study 10 hours this week</p>
          <div style={s.goalBarBg}>
            <div style={{ ...s.goalBarFill, width: "60%" }} />
          </div>
          <p style={s.goalSub}>{dashboard?.stats?.completedCourses ?? 0} course(s) completed</p>
        </div>

        <h3 style={s.panelTitle}>Upcoming Tests</h3>
        {[
          { name: "Calculus Mid-term", date: "Jan 15, 2026" },
          { name: "Chemistry Quiz", date: "Jan 18, 2026" },
        ].map((t, i) => (
          <div key={i} style={s.testItem}>
            <span style={s.testIcon}><ClipboardList size={18} /></span>
            <div>
              <p style={s.testName}>{t.name}</p>
              <p style={s.testDate}>{t.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  shell: { display: "flex", height: "100vh", width: "100%", overflow: "hidden", background: "#ffffff" },
  main: { flex: 1, padding: "36px 32px", minWidth: 0, height: "100vh", overflowY: "auto" },
  topRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 },
  pageTitle: { fontSize: 26, fontWeight: 800, color: "#1A1A1A", letterSpacing: -0.5 },
  pageSub: { fontSize: 14, color: "#888", marginTop: 4 },
  exploreBtn: { background: "#F64515", color: "white", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
  logoutBtn: {
    background: "#F5F5F5",
    color: "#444",
    border: "1px solid #E3E6E9",
    borderRadius: 8,
    padding: "10px 18px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 },
  statCard: { background: "white", borderRadius: 14, padding: "20px 18px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" },
  statIcon: { width: 46, height: 46, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  statVal: { fontSize: 26, fontWeight: 800, letterSpacing: -0.5 },
  statLabel: { fontSize: 12, color: "#888", marginTop: 2 },
  sectionTitle: { fontSize: 17, fontWeight: 700, color: "#1A1A1A", marginBottom: 16 },
  courseGrid: { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 },
  courseCard: { background: "white", borderRadius: 14, overflow: "hidden", border: "1px solid #eeeff1" },
  courseTop: { padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  courseSubj: { color: "white", fontSize: 12, fontWeight: 700 },
  resumeBtn: { color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer", background: "rgba(255,255,255,0.2)", padding: "4px 10px", borderRadius: 100 },
  courseBody: { padding: "14px 16px" },
  courseTitle: { fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 4, lineHeight: 1.4 },
  courseTutor: { fontSize: 12, color: "#888", marginBottom: 12 },
  progressRow: { display: "flex", alignItems: "center", gap: 10 },
  progressBg: { flex: 1, height: 6, background: "#eeeff1", borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  progressPct: { fontSize: 12, fontWeight: 700, color: "#444", flexShrink: 0 },
  activityList: { display: "flex", flexDirection: "column", gap: 12 },
  activityItem: { background: "white", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, border: "1px solid #eeeff1" },
  activityIcon: { width: 36, height: 36, borderRadius: 10, background: "#eeeff1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#F64515" },
  activityText: { fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 3 },
  activityTime: { fontSize: 11, color: "#AAA" },
  rightPanel: { width: 260, height: "100vh", overflowY: "auto", background: "#eeeff1", padding: "24px 16px", flexShrink: 0 },
  profileCard: { background: "white", borderRadius: 14, padding: "20px", textAlign: "center", marginBottom: 20, border: "1px solid #e3e6e9" },
  profileAvatar: { width: 60, height: 60, borderRadius: "50%", background: "#eeeff1", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", color: "#1A1A1A" },
  profileName: { fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 2 },
  profileEmail: { fontSize: 12, color: "#888", marginBottom: 10 },
  profileBadge: { display: "inline-block", background: "#EEFBD8", color: "#7ba500", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 100 },
  panelTitle: { fontSize: 13, fontWeight: 700, color: "#444", marginBottom: 10, marginTop: 20 },
  goalCard: { background: "white", borderRadius: 12, padding: "14px 16px", border: "1px solid #e3e6e9", marginBottom: 20 },
  goalText: { fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 10 },
  goalBarBg: { height: 6, background: "#eeeff1", borderRadius: 3, overflow: "hidden", marginBottom: 6 },
  goalBarFill: { height: "100%", background: "#9fd200", borderRadius: 3 },
  goalSub: { fontSize: 11, color: "#888" },
  testItem: { background: "white", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, marginBottom: 8, border: "1px solid #e3e6e9" },
  testIcon: { color: "#165ee7", display: "flex", alignItems: "center" },
  testName: { fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 2 },
  testDate: { fontSize: 11, color: "#888" },
};