import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const sidebarItems = [
  { icon: "🛍️", label: "Order History", page: "orders" },
  { icon: "⊞", label: "Dashboard", page: "courses" },
  { icon: "☝️", label: "Doubts", page: "doubts" },
  { icon: "🅐", label: "Tests and Tutorials", page: "tests" },
];

export default function OrdersPage() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [myCourses, setMyCourses] = useState([]);

  const token = localStorage.getItem("token");
  
  // Safe parsing fallback for user info
  const user = (() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    loadOrders();
    loadMyCourses();
  }, []);

  async function loadOrders() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    }
  }

  async function loadMyCourses() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setMyCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div style={s.shell} className="app-shell">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { width: 100%; min-height: 100vh; }
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
          .app-main { padding: 16px 14px 84px !important; width: 100% !important; }
          .app-rightPanel { width: 100% !important; min-height: auto !important; border-left: none !important; border-top: 1px solid #DDD6CC; order: 3 !important; }
          .app-orderCard { flex-direction: column !important; }
          .app-orderLeft { width: 100% !important; }
          .app-orderMid { border-right: none !important; border-bottom: 1px solid #F0EAE0; }
          .app-helpBox { flex-direction: column !important; text-align: center !important; padding: 24px 20px !important; }
          .app-pageTitle { font-size: 22px !important; }
        }
      `}</style>

      {/* ── SIDEBAR ── */}
      <div style={s.sidebar} className="app-sidebar">
        <div style={s.logoBox} className="app-logoBox">
          <span style={s.logoText}>TUTOR<br />CONNECT</span>
        </div>
        <div style={s.sideNav} className="app-sideNav">
          {sidebarItems.map(item => (
            <div
              key={item.page}
              style={{
                ...s.sideItem,
                background: item.page === "orders" ? "#E8E0D4" : "transparent",
              }}
              className="app-sideItem"
              onClick={() => {
                if (item.page === "courses") navigate("/courses");
                if (item.page === "dashboard") navigate("/dashboard");
                if (item.page === "tests") navigate("/testdashboard");
              }}
            >
              <span style={s.sideIcon}>{item.icon}</span>
              <span style={s.sideLabel}>{item.label}</span>
            </div>
          ))}
        </div>
        <div style={s.sideBottom} className="app-sideBottom" onClick={() => navigate("/student-profile")} style={{ cursor: "pointer" }}>
          <div style={s.avatarCircle}>👤</div>
          <span style={s.sideLabel}>Profile</span>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={s.main} className="app-main">
        <h1 style={s.pageTitle} className="app-pageTitle">ORDER HISTORY</h1>
        <p style={s.sectionLabel}>PURCHASED COURSES</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
          {orders.map((order) => {
            const course = order?.course;
            
            // If the course doesn't exist, use fallbacks instead of crashing
            const cardBg = course?.color || "#7A73D8";
            const subject = course?.subject || "Deleted Course";
            const rating = course?.rating || "N/A";
            const title = course?.title || "Course No Longer Available";
            const tutor = course?.tutor || "Unknown Tutor";
            const totalLectures = course?.lectures?.length || 0;

            return (
              <div key={order._id || order.id} style={s.orderCard} className="app-orderCard">
                {/* left: course card view */}
                <div style={{ ...s.orderLeft, background: cardBg }} className="app-orderLeft">
                  <div style={s.cardTop}>
                    <span style={s.cardSubj}><i style={{ fontSize: 10 }}>ƒ(x)</i> {subject}</span>
                    <span style={s.cardRating}>⭐ {rating}</span>
                  </div>
                  <p style={s.cardTitle}>{title}</p>
                  <p style={s.cardTutor}>{tutor}</p>
                </div>

                {/* middle: order metadata */}
                <div style={s.orderMid} className="app-orderMid">
                  <p style={s.orderInfo}>
                    <b>PURCHASED:</b> {order.purchasedAt ? new Date(order.purchasedAt).toLocaleDateString() : "N/A"}
                  </p>
                  <p style={s.orderInfo}><b>PAYMENT:</b> {order.paymentStatus || "Completed"}</p>
                  <p style={s.orderInfo}><b>AMOUNT:</b> {"₹" + (order.amount || 0)}</p>
                  <p style={s.orderInfo}>
                    <b>TIME:</b> {order.purchasedAt ? new Date(order.purchasedAt).toLocaleTimeString() : "N/A"}
                  </p>
                </div>

                {/* right: course specifications */}
                <div style={s.orderRight}>
                  <p style={s.orderInfo}><b>CATEGORY:</b> {subject}</p>
                  <p style={s.orderInfo}><b>LECTURES:</b> {totalLectures}</p>
                  <p style={s.orderInfo}><b>DURATION:</b> {totalLectures} Lectures</p>
                  <p style={s.orderInfo}><b>TUTOR:</b> {tutor}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* help panel wrapper */}
        <div style={s.helpBox} className="app-helpBox">
          <span style={s.helpIcon}>🎧</span>
          <p style={s.helpText}>
            TO CONTACT US YOU CAN SEND US YOUR<br />
            QUERY BELOW IN OUR HELP SECTION
          </p>
          <button style={s.helpBtn} onClick={() => navigate("/forgot-password")}>
            HELP
          </button>
        </div>
      </div>

      {/* ── RIGHT MINI PANEL ── */}
      <div style={s.rightPanel} className="app-rightPanel">
        <div style={s.profileBox}>
          <div style={s.profileAvatar}>👤</div>
          <p style={s.profileName}>WELCOME, {user?.firstName ? user.firstName.toUpperCase() : "STUDENT"}</p>
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
          {myCourses.map((item) => {
            const c = item?.course;
            if (!c) return null; // Safe guard loop skip

            return (
              <div key={c._id} style={{ ...s.myCourseCard, background: c.color || "#4FB88A" }} onClick={() => navigate("/lecture")}>
                <div style={s.cardTop}>
                  <span style={s.cardSubj}><i style={{ fontSize: 10 }}>ƒ(x)</i> {c.subject || "General"}</span>
                  <span style={s.cardRating}>⭐ {c.rating || 0}</span>
                </div>
                <p style={{ ...s.cardTitle, fontSize: 12 }}>{c.title || "Untitled Course"}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const s = {
  shell: { display: "flex", minHeight: "100vh", width: "100%", background: "#F7F4EE" },
  sidebar: { width: 90, minHeight: "100vh", background: "#EDE6DC", display: "flex", flexDirection: "column", alignItems: "center", padding: "0 0 24px", flexShrink: 0, borderRight: "1px solid #DDD6CC" },
  logoBox: { width: "100%", background: "#D8CFC4", padding: "18px 8px", textAlign: "center", marginBottom: 24 },
  logoText: { fontSize: 11, fontWeight: 800, color: "#333", letterSpacing: 1, lineHeight: 1.4 },
  sideNav: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", flex: 1 },
  sideItem: { width: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "14px 8px", cursor: "pointer", borderRadius: 8 },
  sideIcon: { fontSize: 22, marginBottom: 4 },
  sideLabel: { fontSize: 9, color: "#666", textAlign: "center", fontWeight: 600, letterSpacing: 0.3 },
  sideBottom: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginTop: "auto" },
  avatarCircle: { width: 44, height: 44, borderRadius: "50%", background: "#C8BFB4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 4 },
  main: { flex: 1, padding: "40px 36px", minWidth: 0 },
  pageTitle: { fontFamily: "Arial Black, Arial, sans-serif", fontSize: 30, fontWeight: 900, color: "#1A1A1A", marginBottom: 20, letterSpacing: -0.5 },
  sectionLabel: { fontSize: 11, fontWeight: 700, color: "#999", letterSpacing: "0.1em", marginBottom: 14 },
  orderCard: { display: "flex", gap: 0, background: "white", borderRadius: 16, overflow: "hidden", border: "1px solid #E8E2D8", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
  orderLeft: { width: 220, padding: "16px 16px 14px", color: "white", flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" },
  orderMid: { flex: 1, padding: "20px 24px", borderRight: "1px solid #F0EAE0" },
  orderRight: { flex: 1, padding: "20px 24px" },
  orderInfo: { fontSize: 12, color: "#444", marginBottom: 8, lineHeight: 1.5 },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  cardSubj: { background: "rgba(255,255,255,0.22)", padding: "3px 8px", borderRadius: 100, fontSize: 10, fontWeight: 700 },
  cardRating: { background: "white", color: "#222", padding: "3px 8px", borderRadius: 100, fontSize: 10, fontWeight: 700 },
  cardTitle: { fontSize: 13, fontWeight: 800, lineHeight: 1.3, textTransform: "uppercase", color: "white", marginBottom: 6, flex: 1 },
  cardTutor: { fontSize: 9, opacity: 0.85, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "white" },
  helpBox: { background: "#F0EAE0", borderRadius: 16, padding: "28px 36px", display: "flex", alignItems: "center", gap: 24 },
  helpIcon: { fontSize: 48, flexShrink: 0 },
  helpText: { fontSize: 14, fontWeight: 700, color: "#333", lineHeight: 1.5, textTransform: "uppercase" },
  helpBtn: { background: "#4FB88A", color: "white", border: "none", borderRadius: 100, padding: "12px 32px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
  rightPanel: { width: 240, minHeight: "100vh", background: "#EDE6DC", padding: "20px 14px", flexShrink: 0, borderLeft: "1px solid #DDD6CC" },
  profileBox: { display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 },
  profileAvatar: { width: 64, height: 64, borderRadius: "50%", background: "#C8BFB4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, marginBottom: 8, border: "3px solid white" },
  profileName: { fontSize: 11, fontWeight: 700, color: "#444", letterSpacing: 0.5 },
  panelHeader: { display: "flex", justifyContent: "space-between", marginBottom: 12 },
  panelLabel: { fontSize: 9, fontWeight: 700, color: "#888", letterSpacing: "0.08em" },
  myCoursesList: { display: "flex", flexDirection: "column", gap: 10 },
  myCourseCard: { borderRadius: 12, padding: "12px 12px 10px", color: "white", cursor: "pointer" },
};