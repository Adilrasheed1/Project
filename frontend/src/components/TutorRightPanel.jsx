import { User, Upload, Users, Wallet, FileText } from "lucide-react";

export function TutorRightPanel({ teacher, onUploadClick, setActiveTab }) {
    return (
        <div style={styles.rightPanel} className="app-rightPanel">
            <div style={styles.profileCard}>
                <div style={styles.profileAvatar}>
                    <User size={28} />
                </div>
                <p style={styles.profileName}>{teacher.firstName} {teacher.lastName}</p>
                <p style={styles.profileEmail}>{teacher.email}</p>
                <div style={{ ...styles.profileBadge, background: "#E4EEFD", color: "#165ee7" }}>Verified Tutor</div>
            </div>

            <h3 style={styles.panelTitle}>Quick Actions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button style={styles.quickBtn} onClick={onUploadClick}>
                    <Upload size={16} /> Upload New Course
                </button>
                <button style={styles.quickBtn} onClick={() => setActiveTab("students")}>
                    <Users size={16} /> View Students
                </button>
                <button style={styles.quickBtn} onClick={() => setActiveTab("earnings")}>
                    <Wallet size={16} /> View Earnings
                </button>
                <button style={styles.quickBtn} onClick={() => setActiveTab("tests")}>
                    <FileText size={16} /> Manage Tests
                </button>
            </div>
        </div>
    );
}

const styles = {
    // Same fix as the sidebar: fixed height + sticky + alignSelf so this panel
    // stays pinned to the viewport instead of stretching with main content.
    rightPanel: {
        width: 260,
        height: "100vh",
        position: "sticky",
        top: 0,
        alignSelf: "flex-start",
        overflowY: "auto",
        background: "#eeeff1",
        padding: "24px 16px",
        flexShrink: 0,
    },
    profileCard: { background: "white", borderRadius: 14, padding: "20px", textAlign: "center", marginBottom: 20, border: "1px solid #e3e6e9" },
    profileAvatar: { width: 60, height: 60, borderRadius: "50%", background: "#eeeff1", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", color: "#000000" },
    profileName: { fontSize: 15, fontWeight: 700, color: "#000000", marginBottom: 2 },
    profileEmail: { fontSize: 12, color: "#888", marginBottom: 10 },
    profileBadge: { display: "inline-block", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 100 },
    panelTitle: { fontSize: 13, fontWeight: 700, color: "#444", marginBottom: 10 },
    quickBtn: { width: "100%", padding: "11px", background: "white", color: "#000000", border: "1px solid #e3e6e9", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textAlign: "left", display: "flex", alignItems: "center", gap: 8 },
};