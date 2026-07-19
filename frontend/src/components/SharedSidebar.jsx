import { useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  BookOpen,
  ShoppingBag,
  FileText,
  HelpCircle,
  User
} from "lucide-react";

const sidebarItems = [
  { icon: LayoutGrid, label: "Dashboard", page: "dashboard", path: "/dashboard" },
  { icon: BookOpen, label: "My Courses", page: "courses", path: "/courses" },
  { icon: ShoppingBag, label: "Orders", page: "orders", path: "/orders" },
  { icon: HelpCircle, label: "Doubts", page: "doubts", path: "/DoubtSection" },
  { icon: FileText, label: "Tests", page: "tests", path: "/testdashboard" },
];

// bottom nav re-uses the same items + adds Profile, so both lists stay in sync
const mobileNavItems = [
  ...sidebarItems,
  { icon: User, label: "Profile", page: "profile", path: "/student-profile" },
];

const s = {
  sidebar: {
    width: 110,
    height: "100vh",
    background: "transparent",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "24px 0", flexShrink: 0
  },
  inner: {
    background: "#eeeff1", height: "100%", width: "100%", marginLeft: 12,
    borderRadius: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "space-between", padding: "20px 8px"
  },
  logo: {
    fontSize: 10, fontWeight: 800, color: "#1A1A1A", textAlign: "center",
    letterSpacing: 1, lineHeight: 1.4, cursor: "pointer", padding: "8px 4px"
  },
  nav: {
    display: "flex", flexDirection: "column", alignItems: "center",
    gap: 6, width: "100%", flex: 1, justifyContent: "center"
  },
  item: {
    width: "100%", display: "flex", flexDirection: "column",
    alignItems: "center", padding: "10px 4px", cursor: "pointer"
  },
  circle: {
    width: 48, height: 48, borderRadius: "50%", display: "flex",
    alignItems: "center", justifyContent: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.12)", marginBottom: 4
  },
  label: {
    fontSize: 10, textAlign: "center", fontWeight: 600
  },

  // ── bottom nav (tablet + mobile) ──
  mobileBar: {
    display: "none",
    position: "fixed",
    bottom: 16, left: 16, right: 16,
    height: 68,
    background: "#eeeff1",
    borderRadius: 999,
    // thin edge so the pill separates from a white page even where the shadow is faint
    border: "1px solid rgba(0,0,0,0.06)",
    // two shadow layers instead of one: a tight close shadow (grounds it) +
    // a softer far one (makes it look lifted/floating rather than just "dark")
    boxShadow: "0 2px 8px rgba(0,0,0,0.10), 0 14px 34px rgba(0,0,0,0.22)",
    alignItems: "center", justifyContent: "space-around",
    padding: "0 10px",
    zIndex: 50
  },
  mobileItem: {
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer"
  },
  mobileCircle: {
    width: 44, height: 44, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background 0.15s ease"
  }
};

export default function SharedSidebar({ activePage }) {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @media (max-width: 899px) {
          .sidebar-desktop { display: none !important; }
          .sidebar-mobile { display: flex !important; }
        }
      `}</style>

      {/* ============ DESKTOP RAIL (≥900px) ============ */}
      <div style={s.sidebar} className="sidebar-desktop">
        <div style={s.inner}>
          <div
            style={s.logo}
            onClick={() => navigate("/courses")}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#F64515")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#1A1A1A")}
          >
            TUTOR<br />CONNECT
          </div>

          <div style={s.nav}>
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = activePage === item.page;
              return (
                <div key={item.page} style={s.item} onClick={() => navigate(item.path)}>
                  <div style={{
                    ...s.circle,
                    background: active ? "#F64515" : "white",
                    color: active ? "white" : "#1A1A1A"
                  }}>
                    <Icon size={20} />
                  </div>
                  <span style={{ ...s.label, color: active ? "#F64515" : "#666" }}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={s.item} onClick={() => navigate("/student-profile")}>
            <div style={{ ...s.circle, background: "white", color: "#1A1A1A" }}>
              <User size={20} />
            </div>
            <span style={{ ...s.label, color: "#666" }}>Profile</span>
          </div>
        </div>
      </div>

      {/* ============ BOTTOM NAV (<900px: tablet + mobile) ============ */}
      <div style={s.mobileBar} className="sidebar-mobile">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.page;
          return (
            <div key={item.page} style={s.mobileItem} onClick={() => navigate(item.path)}>
              <div style={{
                ...s.mobileCircle,
                background: active ? "#F64515" : "white"
              }}>
                <Icon size={20} color={active ? "white" : "#1A1A1A"} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}