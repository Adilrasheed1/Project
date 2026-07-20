import { useEffect, useState } from "react";

// Separate token key so it never collides with student/teacher auth in localStorage
const ADMIN_TOKEN_KEY = "adminToken";

export default function Administration() {
  const [adminToken, setAdminToken] = useState(localStorage.getItem(ADMIN_TOKEN_KEY) || "");

  if (!adminToken) {
    return <AdminLogin onLogin={(token) => setAdminToken(token)} />;
  }

  return <AdminDashboard adminToken={adminToken} onLogout={() => setAdminToken("")} />;
}

// =======================================
// LOGIN SCREEN
// =======================================
function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin-panel/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      onLogin(data.token);
    } catch (err) {
      console.log(err);
      setError("Server error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.loginShell}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { width: 100%; min-height: 100vh; }
        body { font-family: 'Segoe UI', Arial, sans-serif; }
      `}</style>

      <form style={s.loginCard} onSubmit={handleLogin}>
        <div style={s.loginBadge}>ADMIN</div>
        <h1 style={s.loginTitle}>Administration</h1>
        <p style={s.loginSub}>Sign in to manage teachers, courses, and reviews.</p>

        {error && <div style={s.errorBox}>{error}</div>}

        <label style={s.label}>Email</label>
        <input
          style={s.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />

        <label style={s.label}>Password</label>
        <input
          style={s.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button style={s.loginBtn} disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

// =======================================
// DASHBOARD (post-login)
// =======================================
function AdminDashboard({ adminToken, onLogout }) {
  const [tab, setTab] = useState("pending"); // "pending" | "directory"
  const [pending, setPending] = useState([]);
  const [directory, setDirectory] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [rejectReasonFor, setRejectReasonFor] = useState(null);
  const [rejectReasonText, setRejectReasonText] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    if (tab === "pending") loadPending();
    if (tab === "directory") loadDirectory(statusFilter);
  }, [tab, statusFilter]);

  async function authedFetch(path, options = {}) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin-panel${path}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${adminToken}`,
      },
    });

    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      onLogout();
      throw new Error("Session expired");
    }

    return res;
  }

  async function loadPending() {
    setLoading(true);
    try {
      const res = await authedFetch("/teachers/pending");
      const data = await res.json();
      setPending(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadDirectory(status) {
    setLoading(true);
    try {
      const query = status && status !== "All" ? `?status=${status}` : "";
      const res = await authedFetch(`/teachers${query}`);
      const data = await res.json();
      setDirectory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function approveTeacher(id) {
    setActionError("");
    try {
      const res = await authedFetch(`/teachers/${id}/approve`, { method: "PUT" });
      const data = await res.json();

      if (!res.ok) {
        setActionError(data.message || "Failed to approve");
        return;
      }

      setPending((prev) => prev.filter((t) => t._id !== id));
      setSelectedTeacher(null);
      if (tab === "directory") loadDirectory(statusFilter);
    } catch (err) {
      console.log(err);
    }
  }

  async function rejectTeacher(id, reason) {
    setActionError("");
    try {
      const res = await authedFetch(`/teachers/${id}/reject`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();

      if (!res.ok) {
        setActionError(data.message || "Failed to reject");
        return;
      }

      setPending((prev) => prev.filter((t) => t._id !== id));
      setSelectedTeacher(null);
      setRejectReasonFor(null);
      setRejectReasonText("");
      if (tab === "directory") loadDirectory(statusFilter);
    } catch (err) {
      console.log(err);
    }
  }

  function handleLogoutClick() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    onLogout();
  }

  const listToShow = tab === "pending" ? pending : directory;

  return (
    <div style={s.shell}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { width: 100%; min-height: 100vh; }
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #F7F4EE; }

        @media (max-width: 800px) {
          .adm-topBar { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; padding: 16px !important; }
          .adm-main { padding: 16px !important; }
          .adm-table { display: none !important; }
          .adm-cards { display: flex !important; }
        }
        .adm-cards { display: none; }
      `}</style>

      <div style={s.topBar} className="adm-topBar">
        <div style={s.topBarLeft}>
          <span style={s.logo}>TutorConnect</span>
          <span style={s.logoSub}>Administration</span>
        </div>
        <button style={s.logoutBtn} onClick={handleLogoutClick}>
          Log Out
        </button>
      </div>

      <div style={s.main} className="adm-main">
        <div style={s.tabRow}>
          <button
            style={{ ...s.tabBtn, ...(tab === "pending" ? s.tabBtnActive : {}) }}
            onClick={() => setTab("pending")}
          >
            Pending Approval {pending.length > 0 && `(${pending.length})`}
          </button>
          <button
            style={{ ...s.tabBtn, ...(tab === "directory" ? s.tabBtnActive : {}) }}
            onClick={() => setTab("directory")}
          >
            Teacher Directory
          </button>
        </div>

        {tab === "directory" && (
          <div style={s.filterRow}>
            {["All", "Pending", "Approved", "Rejected"].map((status) => (
              <button
                key={status}
                style={{
                  ...s.filterPill,
                  ...(statusFilter === status ? s.filterPillActive : {}),
                }}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        )}

        {actionError && <div style={s.errorBox}>{actionError}</div>}

        {loading ? (
          <p style={s.loadingText}>Loading...</p>
        ) : listToShow.length === 0 ? (
          <div style={s.emptyState}>
            <p style={s.emptyTitle}>
              {tab === "pending" ? "No pending approvals." : "No teachers found."}
            </p>
            <p style={s.emptySub}>
              {tab === "pending"
                ? "New teacher signups will appear here for review."
                : "Try a different status filter."}
            </p>
          </div>
        ) : (
          <>
            {/* Table view (desktop) */}
            <table style={s.table} className="adm-table">
              <thead>
                <tr>
                  <th style={s.th}>Name</th>
                  <th style={s.th}>Email</th>
                  <th style={s.th}>Subject</th>
                  <th style={s.th}>Experience</th>
                  <th style={s.th}>Status</th>
                  <th style={s.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listToShow.map((t) => (
                  <tr key={t._id} style={s.tr}>
                    <td style={s.td}>
                      <button style={s.linkBtn} onClick={() => setSelectedTeacher(t)}>
                        {t.firstName} {t.lastName}
                      </button>
                    </td>
                    <td style={s.td}>{t.email}</td>
                    <td style={s.td}>{t.subject || "—"}</td>
                    <td style={s.td}>{t.experience || "—"}</td>
                    <td style={s.td}>
                      <StatusBadge status={t.status} />
                    </td>
                    <td style={s.td}>
                      {t.status === "Pending" ? (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button style={s.approveBtn} onClick={() => approveTeacher(t._id)}>
                            Approve
                          </button>
                          <button
                            style={s.rejectBtn}
                            onClick={() => {
                              setRejectReasonFor(t._id);
                              setRejectReasonText("");
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span style={s.mutedText}>
                          {t.reviewedAt ? new Date(t.reviewedAt).toLocaleDateString() : "—"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Card view (mobile) */}
            <div style={s.cardsWrap} className="adm-cards">
              {listToShow.map((t) => (
                <div key={t._id} style={s.teacherCard}>
                  <div style={s.cardTopRow}>
                    <button style={s.linkBtn} onClick={() => setSelectedTeacher(t)}>
                      {t.firstName} {t.lastName}
                    </button>
                    <StatusBadge status={t.status} />
                  </div>
                  <p style={s.cardEmail}>{t.email}</p>
                  <p style={s.cardMeta}>{t.subject || "General"} · {t.experience || "N/A"}</p>
                  {t.status === "Pending" && (
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <button style={{ ...s.approveBtn, flex: 1 }} onClick={() => approveTeacher(t._id)}>
                        Approve
                      </button>
                      <button
                        style={{ ...s.rejectBtn, flex: 1 }}
                        onClick={() => {
                          setRejectReasonFor(t._id);
                          setRejectReasonText("");
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Teacher detail modal */}
      {selectedTeacher && (
        <div style={s.modalOverlay} onClick={() => setSelectedTeacher(null)}>
          <div style={s.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>
                {selectedTeacher.firstName} {selectedTeacher.lastName}
              </h2>
              <StatusBadge status={selectedTeacher.status} />
            </div>

            <div style={s.modalGrid}>
              <DetailRow label="Email" value={selectedTeacher.email} />
              <DetailRow label="Phone" value={selectedTeacher.phone} />
              <DetailRow label="Subject" value={selectedTeacher.subject} />
              <DetailRow label="Qualification" value={selectedTeacher.qualification} />
              <DetailRow label="Experience" value={selectedTeacher.experience} />
              <DetailRow label="City" value={selectedTeacher.city} />
              <DetailRow label="State" value={selectedTeacher.state} />
              <DetailRow label="Gender" value={selectedTeacher.gender} />
              <DetailRow label="DOB" value={selectedTeacher.dob} />
            </div>

            {selectedTeacher.bio && (
              <div style={{ marginTop: 14 }}>
                <p style={s.detailLabel}>Bio</p>
                <p style={s.bioText}>{selectedTeacher.bio}</p>
              </div>
            )}

            <div style={{ marginTop: 16 }}>
              <p style={s.detailLabel}>Documents</p>
              <div style={s.docRow}>
                {selectedTeacher.resumeUrl && (
                  <a href={selectedTeacher.resumeUrl} target="_blank" rel="noreferrer" style={s.docLink}>
                    📄 Resume
                  </a>
                )}
                {selectedTeacher.aadharUrl && (
                  <a href={selectedTeacher.aadharUrl} target="_blank" rel="noreferrer" style={s.docLink}>
                    🪪 Aadhar
                  </a>
                )}
                {selectedTeacher.marksheetUrl && (
                  <a href={selectedTeacher.marksheetUrl} target="_blank" rel="noreferrer" style={s.docLink}>
                    🎓 Marksheet
                  </a>
                )}
                {!selectedTeacher.resumeUrl && !selectedTeacher.aadharUrl && !selectedTeacher.marksheetUrl && (
                  <span style={s.mutedText}>No documents uploaded</span>
                )}
              </div>
            </div>

            {selectedTeacher.status === "Rejected" && selectedTeacher.rejectionReason && (
              <div style={{ ...s.errorBox, marginTop: 16 }}>
                <b>Rejection reason:</b> {selectedTeacher.rejectionReason}
              </div>
            )}

            <div style={s.modalActions}>
              {selectedTeacher.status === "Pending" && (
                <>
                  <button style={s.approveBtn} onClick={() => approveTeacher(selectedTeacher._id)}>
                    Approve Teacher
                  </button>
                  <button
                    style={s.rejectBtn}
                    onClick={() => {
                      setRejectReasonFor(selectedTeacher._id);
                      setRejectReasonText("");
                    }}
                  >
                    Reject Teacher
                  </button>
                </>
              )}
              <button style={s.closeBtn} onClick={() => setSelectedTeacher(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject reason modal */}
      {rejectReasonFor && (
        <div style={s.modalOverlay} onClick={() => setRejectReasonFor(null)}>
          <div style={s.reasonCard} onClick={(e) => e.stopPropagation()}>
            <h3 style={s.modalTitle}>Reason for rejection</h3>
            <p style={s.emptySub}>This will be visible to the teacher (optional but recommended).</p>
            <textarea
              style={s.textarea}
              value={rejectReasonText}
              onChange={(e) => setRejectReasonText(e.target.value)}
              placeholder="e.g. Incomplete documents, unverifiable qualifications..."
              rows={4}
            />
            <div style={s.modalActions}>
              <button
                style={s.rejectBtn}
                onClick={() => rejectTeacher(rejectReasonFor, rejectReasonText)}
              >
                Confirm Rejection
              </button>
              <button style={s.closeBtn} onClick={() => setRejectReasonFor(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    Pending: { bg: "#FFF4E5", color: "#8A5A00" },
    Approved: { bg: "#E3F5EC", color: "#1f7a68" },
    Rejected: { bg: "#FBE6E4", color: "#B23B2E" },
  };
  const c = colors[status] || colors.Pending;

  return (
    <span style={{ ...s.badge, background: c.bg, color: c.color }}>
      {status || "Pending"}
    </span>
  );
}

function DetailRow({ label, value }) {
  return (
    <div>
      <p style={s.detailLabel}>{label}</p>
      <p style={s.detailValue}>{value || "—"}</p>
    </div>
  );
}

const s = {
  // ---- Login screen ----
  loginShell: {
    minHeight: "100vh",
    width: "100%",
    background: "#F7F4EE",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loginCard: {
    background: "white",
    borderRadius: 16,
    border: "1px solid #E8E2D8",
    padding: "36px 32px",
    width: "100%",
    maxWidth: 380,
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
  },
  loginBadge: {
    display: "inline-block",
    background: "#1A1A1A",
    color: "white",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 1,
    padding: "4px 10px",
    borderRadius: 100,
    marginBottom: 14,
  },
  loginTitle: { fontSize: 24, fontWeight: 800, color: "#1A1A1A", marginBottom: 6 },
  loginSub: { fontSize: 13, color: "#888", marginBottom: 22, lineHeight: 1.5 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6, marginTop: 14 },
  input: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 8,
    border: "1.5px solid #E0E4EA",
    fontSize: 14,
    color: "#111",
    background: "#FAFBFC",
    outline: "none",
    fontFamily: "inherit",
  },
  loginBtn: {
    width: "100%",
    marginTop: 22,
    padding: "13px",
    background: "#4FB88A",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  errorBox: {
    background: "#FBE6E4",
    border: "1px solid #E8A69E",
    color: "#B23B2E",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 8,
  },

  // ---- Dashboard shell ----
  shell: { minHeight: "100vh", width: "100%", background: "#F7F4EE" },
  topBar: {
    width: "100%",
    background: "white",
    borderBottom: "1px solid #E8E2D8",
    padding: "0 32px",
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topBarLeft: { display: "flex", alignItems: "baseline", gap: 10 },
  logo: { fontWeight: 800, fontSize: 18, color: "#4FB88A" },
  logoSub: { fontSize: 13, color: "#888", fontWeight: 600 },
  logoutBtn: {
    background: "#F0EAE0",
    color: "#444",
    border: "none",
    borderRadius: 8,
    padding: "9px 16px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  main: { maxWidth: 1100, margin: "0 auto", padding: "32px 40px" },

  tabRow: { display: "flex", gap: 10, marginBottom: 20 },
  tabBtn: {
    background: "white",
    border: "1.5px solid #E0E4EA",
    borderRadius: 8,
    padding: "10px 18px",
    fontSize: 13,
    fontWeight: 700,
    color: "#555",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  tabBtnActive: { border: "1.5px solid #4FB88A", background: "#F0FBF6", color: "#1f7a68" },

  filterRow: { display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" },
  filterPill: {
    background: "white",
    border: "1px solid #E0E4EA",
    borderRadius: 100,
    padding: "6px 14px",
    fontSize: 12,
    fontWeight: 700,
    color: "#666",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  filterPillActive: { border: "1px solid #7A73D8", background: "#F0EFFD", color: "#7A73D8" },

  loadingText: { fontSize: 14, color: "#888", padding: "20px 0" },

  emptyState: {
    background: "white",
    border: "1px solid #E8E2D8",
    borderRadius: 14,
    padding: "48px 24px",
    textAlign: "center",
  },
  emptyTitle: { fontSize: 16, fontWeight: 700, color: "#1A1A1A", marginBottom: 6 },
  emptySub: { fontSize: 13, color: "#888" },

  table: { width: "100%", borderCollapse: "collapse", background: "white", borderRadius: 14, overflow: "hidden", border: "1px solid #E8E2D8" },
  th: { textAlign: "left", fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: "0.05em", padding: "14px 16px", background: "#FAFAF7", borderBottom: "1px solid #E8E2D8", textTransform: "uppercase" },
  tr: { borderBottom: "1px solid #F0EAE0" },
  td: { padding: "14px 16px", fontSize: 13, color: "#333" },

  cardsWrap: { flexDirection: "column", gap: 12 },
  teacherCard: { background: "white", border: "1px solid #E8E2D8", borderRadius: 12, padding: 16 },
  cardTopRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  cardEmail: { fontSize: 12, color: "#888", marginBottom: 4 },
  cardMeta: { fontSize: 12, color: "#666" },

  linkBtn: { background: "none", border: "none", padding: 0, fontSize: 13, fontWeight: 700, color: "#1A1A1A", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit" },

  badge: { display: "inline-block", padding: "4px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700 },

  approveBtn: { background: "#4FB88A", color: "white", border: "none", borderRadius: 6, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
  rejectBtn: { background: "#D8493F", color: "white", border: "none", borderRadius: 6, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
  closeBtn: { background: "#F0EAE0", color: "#444", border: "none", borderRadius: 6, padding: "7px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },

  mutedText: { fontSize: 12, color: "#AAA" },

  // ---- Modal ----
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 1000 },
  modalCard: { background: "white", borderRadius: 16, padding: 28, width: "100%", maxWidth: 560, maxHeight: "85vh", overflowY: "auto" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  modalTitle: { fontSize: 19, fontWeight: 800, color: "#1A1A1A" },
  modalGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  detailLabel: { fontSize: 11, fontWeight: 700, color: "#999", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 3 },
  detailValue: { fontSize: 14, color: "#222", fontWeight: 600 },
  bioText: { fontSize: 13, color: "#444", lineHeight: 1.6 },
  docRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  docLink: { fontSize: 12, fontWeight: 700, color: "#7A73D8", textDecoration: "none", border: "1.5px solid #7A73D8", borderRadius: 8, padding: "8px 12px" },
  modalActions: { display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" },

  reasonCard: { background: "white", borderRadius: 16, padding: 28, width: "100%", maxWidth: 440 },
  textarea: {
    width: "100%",
    marginTop: 14,
    padding: "11px 14px",
    borderRadius: 8,
    border: "1.5px solid #E0E4EA",
    fontSize: 14,
    color: "#111",
    fontFamily: "inherit",
    resize: "vertical",
  },
};