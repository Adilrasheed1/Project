import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const sidebarItems = [
  { icon: "⊞", label: "Dashboard", page: "dashboard" },
  { icon: "📚", label: "My Courses", page: "courses" },
  { icon: "🛍️", label: "Order History", page: "orders" },
  { icon: "🅐", label: "Tests", page: "tests" },
];

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

  if (!dashboard)
    return <h2 style={{ padding: 40, fontFamily: 'Segoe UI', color: '#333' }}>Loading...</h2>;

  return (
    <div style={s.shell} className="app-shell">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { width:100%; min-height:100vh; }
        body { font-family:'Segoe UI',Arial,sans-serif; background:#F7F4EE; }

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
          .app-rightPanel { width: 100% !important; border-left: none !important; border-bottom: 1px solid #DDD6CC; min-height: auto !important; order: 1 !important; }
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
      <div style={s.sidebar} className="app-sidebar">
        <div style={s.logoBox} className="app-logoBox"><span style={s.logoText}>TUTOR<br />CONNECT</span></div>
        <div style={s.sideNav} className="app-sideNav">
          {sidebarItems.map(item => (
            <div key={item.page}
              style={{ ...s.sideItem, background: item.page === "dashboard" ? "#E8E0D4" : "transparent" }}
              className="app-sideItem"
              onClick={() => {
                if (item.page === "courses") navigate("/courses");
                if (item.page === "orders") navigate("/orders");
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

      {/* MAIN */}
      <div style={s.main} className="app-main">
        {/* header */}
        <div style={s.topRow} className="app-topRow">
          <div>
            <h1 style={s.pageTitle} className="app-pageTitle">Student Dashboard</h1>
            <p style={s.pageSub}>Welcome back, {user?.firstName || "Student"} 👋</p>
          </div>
          <button style={s.exploreBtn} onClick={() => navigate("/courses")}>Explore Courses</button>
        </div>

        {/* stats */}
        <div style={s.statsGrid} className="app-statsGrid">
          {[
            {
              label: "Courses Enrolled",
              value: dashboard?.stats?.courses ?? 0,
              icon: "📚",
              color: "#4FB88A",
              soft: "#E3F5EC",
            },
            {
              label: "Completed Courses",
              value: dashboard?.stats?.completedCourses ?? 0,
              icon: "🏆",
              color: "#D8493F",
              soft: "#FBE6E4",
            },
          ].map((st) => (
            <div
              key={st.label}
              style={{
                ...s.statCard,
                border: `1.5px solid ${st.color}20`,
              }}
            >
              <div style={{ ...s.statIcon, background: st.soft }}>
                {st.icon}
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
                <div style={{ ...s.courseTop, background: c.color || "#4FB88A" }}>
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
                          background: c.color || "#4FB88A",
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
              <div style={s.activityIcon}>📚</div>
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
          <div style={s.profileAvatar}>👤</div>
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
            <span style={s.testIcon}>📝</span>
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
  shell: { display: "flex", minHeight: "100vh", width: "100%", background: "#F7F4EE" },
  sidebar: { width: 90, minHeight: "100vh", background: "#EDE6DC", display: "flex", flexDirection: "column", alignItems: "center", padding: "0 0 24px", flexShrink: 0, borderRight: "1px solid #DDD6CC" },
  logoBox: { width: "100%", background: "#D8CFC4", padding: "18px 8px", textAlign: "center", marginBottom: 24 },
  logoText: { fontSize: 11, fontWeight: 800, color: "#333", letterSpacing: 1, lineHeight: 1.4 },
  sideNav: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, width: "100%", flex: 1 },
  sideItem: { width: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "14px 8px", cursor: "pointer", borderRadius: 8 },
  sideIcon: { fontSize: 22, marginBottom: 4 },
  sideLabel: { fontSize: 9, color: "#666", textAlign: "center", fontWeight: 600, letterSpacing: 0.3 },
  sideBottom: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  avatarCircle: { width: 44, height: 44, borderRadius: "50%", background: "#C8BFB4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 4 },
  main: { flex: 1, padding: "36px 32px", minWidth: 0 },
  topRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 },
  pageTitle: { fontSize: 26, fontWeight: 800, color: "#1A1A1A", letterSpacing: -0.5 },
  pageSub: { fontSize: 14, color: "#888", marginTop: 4 },
  exploreBtn: { background: "#4FB88A", color: "white", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 },
  statCard: { background: "white", borderRadius: 14, padding: "20px 18px", display: "flex", alignItems: "center", gap: 14 },
  statIcon: { width: 46, height: 46, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 },
  statVal: { fontSize: 26, fontWeight: 800, letterSpacing: -0.5 },
  statLabel: { fontSize: 12, color: "#888", marginTop: 2 },
  sectionTitle: { fontSize: 17, fontWeight: 700, color: "#1A1A1A", marginBottom: 16 },
  courseGrid: { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 },
  courseCard: { background: "white", borderRadius: 14, overflow: "hidden", border: "1px solid #EDE6DC" },
  courseTop: { padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  courseSubj: { color: "white", fontSize: 12, fontWeight: 700 },
  resumeBtn: { color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer", background: "rgba(255,255,255,0.2)", padding: "4px 10px", borderRadius: 100 },
  courseBody: { padding: "14px 16px" },
  courseTitle: { fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 4, lineHeight: 1.4 },
  courseTutor: { fontSize: 12, color: "#888", marginBottom: 12 },
  progressRow: { display: "flex", alignItems: "center", gap: 10 },
  progressBg: { flex: 1, height: 6, background: "#F0EAE0", borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  progressPct: { fontSize: 12, fontWeight: 700, color: "#444", flexShrink: 0 },
  activityList: { display: "flex", flexDirection: "column", gap: 12 },
  activityItem: { background: "white", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, border: "1px solid #EDE6DC" },
  activityIcon: { width: 36, height: 36, borderRadius: 10, background: "#F0EAE0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 },
  activityText: { fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 3 },
  activityTime: { fontSize: 11, color: "#AAA" },
  rightPanel: { width: 260, background: "#EDE6DC", padding: "24px 16px", flexShrink: 0, borderLeft: "1px solid #DDD6CC" },
  profileCard: { background: "white", borderRadius: 14, padding: "20px", textAlign: "center", marginBottom: 20, border: "1px solid #E8E2D8" },
  profileAvatar: { width: 60, height: 60, borderRadius: "50%", background: "#C8BFB4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 10px", border: "3px solid #EDE6DC" },
  profileName: { fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 2 },
  profileEmail: { fontSize: 12, color: "#888", marginBottom: 10 },
  profileBadge: { display: "inline-block", background: "#E3F5EC", color: "#4FB88A", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 100 },
  panelTitle: { fontSize: 13, fontWeight: 700, color: "#444", marginBottom: 10, marginTop: 20 },
  goalCard: { background: "white", borderRadius: 12, padding: "14px 16px", border: "1px solid #E8E2D8", marginBottom: 20 },
  goalText: { fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 10 },
  goalBarBg: { height: 6, background: "#F0EAE0", borderRadius: 3, overflow: "hidden", marginBottom: 6 },
  goalBarFill: { height: "100%", background: "#4FB88A", borderRadius: 3 },
  goalSub: { fontSize: 11, color: "#888" },
  testItem: { background: "white", borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, marginBottom: 8, border: "1px solid #E8E2D8" },
  testIcon: { fontSize: 20 },
  testName: { fontSize: 13, fontWeight: 600, color: "#1A1A1A", marginBottom: 2 },
  testDate: { fontSize: 11, color: "#888" },
};