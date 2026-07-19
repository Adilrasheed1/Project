import { LayoutGrid, HelpCircle, Users, Wallet, FileText, User } from "lucide-react";

const sidebarItems = [
    { icon: LayoutGrid, label: "Dashboard", page: "dashboard" },
    { icon: HelpCircle, label: "Doubts", page: "courses" },
    { icon: Users, label: "Students", page: "students" },
    { icon: Wallet, label: "Earnings", page: "earnings" },
    { icon: FileText, label: "Tests", page: "tests" },
];

export function TutorSidebar({ activeTab, setActiveTab, onSupportClick }) {
    return (
        <>
            {/*
              Same technique as the student SharedSidebar: both versions of
              the nav exist in the DOM at once, CSS just toggles which one
              is visible at the 899px line. No JS/resize logic needed, and
              no single element has to be restyled into two different shapes.
            */}
            <style>{`
                @media (max-width: 899px) {
                    .app-sidebar { display: none !important; }
                    .tutor-mobile-nav { display: flex !important; }
                }
            `}</style>

            {/* ============ DESKTOP RAIL (>=900px) ============ */}
            <div style={styles.sidebar} className="app-sidebar">
                <div style={styles.sidebarInner}>
                    <div style={styles.sideNav} className="app-sideNav">
                        {sidebarItems.map((item) => {
                            const Icon = item.icon;
                            const active = activeTab === item.page;
                            return (
                                <div
                                    key={item.page}
                                    style={styles.sideItem}
                                    className="app-sideItem"
                                    onClick={() => setActiveTab(item.page)}
                                >
                                    <div
                                        style={{
                                            ...styles.sideIconCircle,
                                            background: active ? "#F64515" : "white",
                                            color: active ? "white" : "#000000",
                                        }}
                                    >
                                        <Icon size={20} />
                                    </div>
                                    <span style={{ ...styles.sideLabel, color: active ? "#F64515" : "#666" }}>
                                        {item.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ ...styles.sideItem, cursor: "pointer" }} className="app-sideBottom" onClick={onSupportClick}>
                        <div style={styles.sideIconCircle}>
                            <User size={20} />
                        </div>
                        <span style={styles.sideLabel}>Support</span>
                    </div>
                </div>
            </div>

            {/* ============ FLOATING BOTTOM NAV (<900px) ============ */}
            {/* Support is tab-based here (calls onSupportClick), not a route
                like the student Profile link, but visually it slots in as
                the 6th icon exactly the same way. */}
            <div style={styles.mobileBar} className="tutor-mobile-nav">
                {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const active = activeTab === item.page;
                    return (
                        <div key={item.page} style={styles.mobileItem} onClick={() => setActiveTab(item.page)}>
                            <div style={{ ...styles.mobileCircle, background: active ? "#F64515" : "white" }}>
                                <Icon size={20} color={active ? "white" : "#1A1A1A"} />
                            </div>
                        </div>
                    );
                })}
                <div style={styles.mobileItem} onClick={onSupportClick}>
                    <div style={styles.mobileCircle}>
                        <User size={20} color="#1A1A1A" />
                    </div>
                </div>
            </div>
        </>
    );
}

const styles = {
    sidebar: {
        width: 110,
        height: "100vh",
        position: "sticky",
        top: 0,
        alignSelf: "flex-start",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 0",
        flexShrink: 0,
    },
    sidebarInner: {
        background: "#eeeff1",
        height: "100%",
        width: "100%",
        marginLeft: 12,
        borderRadius: 16,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
        padding: 16,
    },
    sideNav: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: "100%", flex: 1, justifyContent: "center" },
    sideItem: { width: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 4px", cursor: "pointer" },
    sideIconCircle: { width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "white", boxShadow: "0 2px 6px rgba(0,0,0,0.12)", marginBottom: 4 },
    sideLabel: { fontSize: 12, color: "#666", textAlign: "center", fontWeight: 600 },

    // ── floating bottom nav — identical recipe to SharedSidebar's tube ──
    mobileBar: {
        display: "none",
        position: "fixed",
        bottom: 16, left: 16, right: 16,
        height: 68,
        background: "#eeeff1",
        borderRadius: 999,
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.10), 0 14px 34px rgba(0,0,0,0.22)",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "0 10px",
        zIndex: 50,
    },
    mobileItem: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
    },
    mobileCircle: {
        width: 44,
        height: 44,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.15s ease",
    },
};