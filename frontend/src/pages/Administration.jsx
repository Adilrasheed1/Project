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
  const [tab, setTab] = useState("pending"); // "pending" | "directory" | "students" | "support"
  const [pending, setPending] = useState([]);
  const [directory, setDirectory] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [teacherSearch, setTeacherSearch] = useState("");
  const [teacherSearchInput, setTeacherSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [rejectReasonFor, setRejectReasonFor] = useState(null);
  const [rejectReasonText, setRejectReasonText] = useState("");
  const [actionError, setActionError] = useState("");
  const [lightbox, setLightbox] = useState(null); // { url, label, type }

  // ---- Students tab state ----
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [studentSearch, setStudentSearch] = useState("");
  const [studentSearchInput, setStudentSearchInput] = useState("");
  const [courses, setCourses] = useState([]);
  const [courseFilter, setCourseFilter] = useState([]); // array of course ids, OR'd together
  const [blockedFilter, setBlockedFilter] = useState("All"); // "All" | "Active" | "Blocked"
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [blockReasonFor, setBlockReasonFor] = useState(null); // { id, type: "teacher"|"student" }
  const [blockReasonText, setBlockReasonText] = useState("");

  // ---- Support tab state ----
  // NOTE: GET /api/support has no query params on the backend — it just returns
  // everything. So status/role/search filtering happens client-side here instead
  // of being sent to the server.
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [ticketStatusFilter, setTicketStatusFilter] = useState("All"); // All | Pending | In Progress | Resolved
  const [ticketRoleFilter, setTicketRoleFilter] = useState("All"); // All | student | teacher
  const [ticketSearchInput, setTicketSearchInput] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Debounce search inputs so we're not firing a request on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setTeacherSearch(teacherSearchInput), 350);
    return () => clearTimeout(t);
  }, [teacherSearchInput]);

  useEffect(() => {
    const t = setTimeout(() => setStudentSearch(studentSearchInput), 350);
    return () => clearTimeout(t);
  }, [studentSearchInput]);

  useEffect(() => {
    if (tab === "pending") loadPending();
    if (tab === "directory") loadDirectory(statusFilter, teacherSearch);
    if (tab === "students") loadStudents();
    if (tab === "support") loadTickets();
  }, [tab, statusFilter, teacherSearch]);

  useEffect(() => {
    if (tab === "students") loadStudents();
  }, [studentSearch, courseFilter, blockedFilter]);

  useEffect(() => {
    loadCourses();
  }, []);

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

  // Support requests live at /api/support (its own top-level route), not nested
  // under /api/admin-panel like everything else — hence a separate helper.
  async function supportFetch(path, options = {}) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/support${path}`, {
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

  async function loadDirectory(status, search) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status && status !== "All") params.set("status", status);
      if (search && search.trim()) params.set("search", search.trim());
      const query = params.toString() ? `?${params.toString()}` : "";
      const res = await authedFetch(`/teachers${query}`);
      const data = await res.json();
      setDirectory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadStudents() {
    setStudentsLoading(true);
    try {
      const params = new URLSearchParams();
      if (studentSearch && studentSearch.trim()) params.set("search", studentSearch.trim());
      if (courseFilter.length > 0) params.set("course", courseFilter.join(","));
      if (blockedFilter === "Blocked") params.set("blocked", "true");
      if (blockedFilter === "Active") params.set("blocked", "false");

      const query = params.toString() ? `?${params.toString()}` : "";
      const res = await authedFetch(`/students${query}`);
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    } finally {
      setStudentsLoading(false);
    }
  }

  async function loadCourses() {
    try {
      const res = await authedFetch("/courses");
      if (!res.ok) return; // don't break the page if this endpoint isn't set up yet
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    }
  }

  function toggleCourseFilter(id) {
    setCourseFilter((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  async function loadTickets() {
    setTicketsLoading(true);
    try {
      const res = await supportFetch("");
      const data = await res.json();
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    } finally {
      setTicketsLoading(false);
    }
  }

  async function updateTicketStatus(id, status) {
    setActionError("");
    try {
      const res = await supportFetch(`/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.message || "Failed to update ticket");
        return;
      }
      // The PATCH response only confirms success — it doesn't echo the updated
      // document — so update the local copy directly with the new status.
      setTickets((prev) => prev.map((tk) => (tk._id === id ? { ...tk, status } : tk)));
      setSelectedTicket((prev) => (prev && prev._id === id ? { ...prev, status } : prev));
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteTicket(id) {
    setActionError("");
    try {
      const res = await supportFetch(`/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.message || "Failed to delete request");
        return;
      }
      setTickets((prev) => prev.filter((tk) => tk._id !== id));
      setSelectedTicket((prev) => (prev && prev._id === id ? null : prev));
    } catch (err) {
      console.log(err);
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
      if (tab === "directory") loadDirectory(statusFilter, teacherSearch);
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
      if (tab === "directory") loadDirectory(statusFilter, teacherSearch);
    } catch (err) {
      console.log(err);
    }
  }

  function handleLogoutClick() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    onLogout();
  }

  async function blockTeacher(id, reason) {
    setActionError("");
    try {
      const res = await authedFetch(`/teachers/${id}/block`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.message || "Failed to block teacher");
        return;
      }
      setDirectory((prev) => prev.map((t) => (t._id === id ? data.teacher : t)));
      setSelectedTeacher((prev) => (prev && prev._id === id ? data.teacher : prev));
      setBlockReasonFor(null);
      setBlockReasonText("");
    } catch (err) {
      console.log(err);
    }
  }

  async function unblockTeacher(id) {
    setActionError("");
    try {
      const res = await authedFetch(`/teachers/${id}/unblock`, { method: "PUT" });
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.message || "Failed to unblock teacher");
        return;
      }
      setDirectory((prev) => prev.map((t) => (t._id === id ? data.teacher : t)));
      setSelectedTeacher((prev) => (prev && prev._id === id ? data.teacher : prev));
    } catch (err) {
      console.log(err);
    }
  }

  async function blockStudent(id, reason) {
    setActionError("");
    try {
      const res = await authedFetch(`/students/${id}/block`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.message || "Failed to block student");
        return;
      }
      setStudents((prev) => prev.map((st) => (st._id === id ? data.student : st)));
      setSelectedStudent((prev) => (prev && prev._id === id ? data.student : prev));
      setBlockReasonFor(null);
      setBlockReasonText("");
    } catch (err) {
      console.log(err);
    }
  }

  async function unblockStudent(id) {
    setActionError("");
    try {
      const res = await authedFetch(`/students/${id}/unblock`, { method: "PUT" });
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.message || "Failed to unblock student");
        return;
      }
      setStudents((prev) => prev.map((st) => (st._id === id ? data.student : st)));
      setSelectedStudent((prev) => (prev && prev._id === id ? data.student : prev));
    } catch (err) {
      console.log(err);
    }
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
          <button
            style={{ ...s.tabBtn, ...(tab === "students" ? s.tabBtnActive : {}) }}
            onClick={() => setTab("students")}
          >
            Students {students.length > 0 && `(${students.length})`}
          </button>
          <button
            style={{ ...s.tabBtn, ...(tab === "support" ? s.tabBtnActive : {}) }}
            onClick={() => setTab("support")}
          >
            Support{" "}
            {tickets.filter((t) => t.status !== "Resolved").length > 0 &&
              `(${tickets.filter((t) => t.status !== "Resolved").length})`}
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
            <input
              style={s.searchInput}
              type="text"
              placeholder="Search name, email, subject..."
              value={teacherSearchInput}
              onChange={(e) => setTeacherSearchInput(e.target.value)}
            />
          </div>
        )}

        {tab !== "students" && tab !== "support" && actionError && <div style={s.errorBox}>{actionError}</div>}

        {tab !== "students" && tab !== "support" && (loading ? (
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
                  <th style={s.th}>Applied</th>
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
                    <td style={s.td}>{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "—"}</td>
                    <td style={s.td}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <StatusBadge status={t.status} />
                        {t.isBlocked && <BlockedBadge />}
                      </div>
                    </td>
                    <td style={s.td}>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {t.status === "Pending" ? (
                          <>
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
                          </>
                        ) : (
                          <span style={s.mutedText}>
                            {t.reviewedAt ? new Date(t.reviewedAt).toLocaleDateString() : "—"}
                          </span>
                        )}
                        {t.isBlocked ? (
                          <button style={s.unblockBtn} onClick={() => unblockTeacher(t._id)}>
                            Unblock
                          </button>
                        ) : (
                          <button
                            style={s.blockBtn}
                            onClick={() => {
                              setBlockReasonFor({ id: t._id, type: "teacher" });
                              setBlockReasonText("");
                            }}
                          >
                            Block
                          </button>
                        )}
                      </div>
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
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                      <StatusBadge status={t.status} />
                      {t.isBlocked && <BlockedBadge />}
                    </div>
                  </div>
                  <p style={s.cardEmail}>{t.email}</p>
                  <p style={s.cardMeta}>{t.subject || "General"} · {t.experience || "N/A"}</p>
                  <p style={s.cardMeta}>
                    Applied {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "—"}
                  </p>
                  <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                    {t.status === "Pending" && (
                      <>
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
                      </>
                    )}
                    {t.isBlocked ? (
                      <button style={{ ...s.unblockBtn, flex: 1 }} onClick={() => unblockTeacher(t._id)}>
                        Unblock
                      </button>
                    ) : (
                      <button
                        style={{ ...s.blockBtn, flex: 1 }}
                        onClick={() => {
                          setBlockReasonFor({ id: t._id, type: "teacher" });
                          setBlockReasonText("");
                        }}
                      >
                        Block
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ))}

        {tab === "students" && (
          <>
            <div style={s.filterRow}>
              {["All", "Active", "Blocked"].map((opt) => (
                <button
                  key={opt}
                  style={{
                    ...s.filterPill,
                    ...(blockedFilter === opt ? s.filterPillActive : {}),
                  }}
                  onClick={() => setBlockedFilter(opt)}
                >
                  {opt}
                </button>
              ))}
              <input
                style={s.searchInput}
                type="text"
                placeholder="Search name or email..."
                value={studentSearchInput}
                onChange={(e) => setStudentSearchInput(e.target.value)}
              />
            </div>

            {courses.length > 0 && (
              <div style={s.courseFilterRow}>
                <span style={s.courseFilterLabel}>Enrolled in:</span>
                {courses.map((c) => (
                  <button
                    key={c._id}
                    style={{
                      ...s.filterPill,
                      ...(courseFilter.includes(c._id) ? s.filterPillActive : {}),
                    }}
                    onClick={() => toggleCourseFilter(c._id)}
                  >
                    {c.title || c.name || c.subject}
                  </button>
                ))}
                {courseFilter.length > 0 && (
                  <button style={s.clearFilterBtn} onClick={() => setCourseFilter([])}>
                    Clear
                  </button>
                )}
              </div>
            )}

            {actionError && <div style={s.errorBox}>{actionError}</div>}

            {studentsLoading ? (
              <p style={s.loadingText}>Loading...</p>
            ) : students.length === 0 ? (
              <div style={s.emptyState}>
                <p style={s.emptyTitle}>No students found.</p>
                <p style={s.emptySub}>Try a different search or filter.</p>
              </div>
            ) : (
              <>
                {/* Table view (desktop) */}
                <table style={s.table} className="adm-table">
                  <thead>
                    <tr>
                      <th style={s.th}>Name</th>
                      <th style={s.th}>Email</th>
                      <th style={s.th}>Courses Enrolled</th>
                      <th style={s.th}>Enrolled On</th>
                      <th style={s.th}>Status</th>
                      <th style={s.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((st) => (
                      <tr key={st._id} style={s.tr}>
                        <td style={s.td}>
                          <button style={s.linkBtn} onClick={() => setSelectedStudent(st)}>
                            {st.firstName} {st.lastName}
                          </button>
                        </td>
                        <td style={s.td}>{st.email}</td>
                        <td style={s.td}>
                          {st.enrolledCourses && st.enrolledCourses.length > 0
                            ? st.enrolledCourses
                                .map((ec) => ec.course?.title || ec.course?.name || "Untitled")
                                .join(", ")
                            : "—"}
                        </td>
                        <td style={s.td}>
                          {st.enrolledCourses && st.enrolledCourses.length > 0
                            ? new Date(
                                Math.min(...st.enrolledCourses.map((ec) => new Date(ec.enrolledAt).getTime()))
                              ).toLocaleDateString()
                            : "—"}
                        </td>
                        <td style={s.td}>
                          {st.isBlocked ? <BlockedBadge /> : <ActiveBadge />}
                        </td>
                        <td style={s.td}>
                          {st.isBlocked ? (
                            <button style={s.unblockBtn} onClick={() => unblockStudent(st._id)}>
                              Unblock
                            </button>
                          ) : (
                            <button
                              style={s.blockBtn}
                              onClick={() => {
                                setBlockReasonFor({ id: st._id, type: "student" });
                                setBlockReasonText("");
                              }}
                            >
                              Block
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Card view (mobile) */}
                <div style={s.cardsWrap} className="adm-cards">
                  {students.map((st) => (
                    <div key={st._id} style={s.teacherCard}>
                      <div style={s.cardTopRow}>
                        <button style={s.linkBtn} onClick={() => setSelectedStudent(st)}>
                          {st.firstName} {st.lastName}
                        </button>
                        {st.isBlocked ? <BlockedBadge /> : <ActiveBadge />}
                      </div>
                      <p style={s.cardEmail}>{st.email}</p>
                      <p style={s.cardMeta}>
                        {st.enrolledCourses && st.enrolledCourses.length > 0
                          ? st.enrolledCourses
                              .map((ec) => ec.course?.title || ec.course?.name || "Untitled")
                              .join(", ")
                          : "No courses enrolled"}
                      </p>
                      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                        {st.isBlocked ? (
                          <button style={{ ...s.unblockBtn, flex: 1 }} onClick={() => unblockStudent(st._id)}>
                            Unblock
                          </button>
                        ) : (
                          <button
                            style={{ ...s.blockBtn, flex: 1 }}
                            onClick={() => {
                              setBlockReasonFor({ id: st._id, type: "student" });
                              setBlockReasonText("");
                            }}
                          >
                            Block
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {tab === "support" && (() => {
          const q = ticketSearchInput.trim().toLowerCase();
          const filteredTickets = tickets.filter((tk) => {
            if (ticketStatusFilter !== "All" && tk.status !== ticketStatusFilter) return false;
            if (ticketRoleFilter !== "All" && tk.role !== ticketRoleFilter) return false;
            if (q) {
              const haystack = `${tk.name || ""} ${tk.email || ""} ${tk.phone || ""}`.toLowerCase();
              if (!haystack.includes(q)) return false;
            }
            return true;
          });

          return (
            <>
              <div style={s.filterRow}>
                {["All", "Pending", "In Progress", "Resolved"].map((opt) => (
                  <button
                    key={opt}
                    style={{
                      ...s.filterPill,
                      ...(ticketStatusFilter === opt ? s.filterPillActive : {}),
                    }}
                    onClick={() => setTicketStatusFilter(opt)}
                  >
                    {opt}
                  </button>
                ))}
                {["All", "student", "teacher"].map((opt) => (
                  <button
                    key={opt}
                    style={{
                      ...s.filterPill,
                      ...(ticketRoleFilter === opt ? s.filterPillActive : {}),
                    }}
                    onClick={() => setTicketRoleFilter(opt)}
                  >
                    {opt === "All" ? "All Roles" : opt === "student" ? "🎓 Student" : "📚 Teacher"}
                  </button>
                ))}
                <input
                  style={s.searchInput}
                  type="text"
                  placeholder="Search name, email, phone..."
                  value={ticketSearchInput}
                  onChange={(e) => setTicketSearchInput(e.target.value)}
                />
              </div>

              {actionError && <div style={s.errorBox}>{actionError}</div>}

              {ticketsLoading ? (
                <p style={s.loadingText}>Loading...</p>
              ) : filteredTickets.length === 0 ? (
                <div style={s.emptyState}>
                  <p style={s.emptyTitle}>No support requests found.</p>
                  <p style={s.emptySub}>
                    {tickets.length === 0 ? "Requests submitted via the support form will appear here." : "Try a different search or filter."}
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
                        <th style={s.th}>Role</th>
                        <th style={s.th}>Reason</th>
                        <th style={s.th}>Submitted</th>
                        <th style={s.th}>Status</th>
                        <th style={s.th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTickets.map((tk) => (
                        <tr key={tk._id} style={s.tr}>
                          <td style={s.td}>
                            <button style={s.linkBtn} onClick={() => setSelectedTicket(tk)}>
                              {tk.name}
                            </button>
                          </td>
                          <td style={s.td}>{tk.email}</td>
                          <td style={s.td}>{tk.role === "teacher" ? "📚 Teacher" : "🎓 Student"}</td>
                          <td style={s.td}>{tk.reason || "—"}</td>
                          <td style={s.td}>{tk.createdAt ? new Date(tk.createdAt).toLocaleDateString() : "—"}</td>
                          <td style={s.td}>
                            <TicketStatusBadge status={tk.status} />
                          </td>
                          <td style={s.td}>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                              {tk.status !== "In Progress" && (
                                <button style={s.progressBtn} onClick={() => updateTicketStatus(tk._id, "In Progress")}>
                                  In Progress
                                </button>
                              )}
                              {tk.status !== "Resolved" && (
                                <button style={s.approveBtn} onClick={() => updateTicketStatus(tk._id, "Resolved")}>
                                  Resolve
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Card view (mobile) */}
                  <div style={s.cardsWrap} className="adm-cards">
                    {filteredTickets.map((tk) => (
                      <div key={tk._id} style={s.teacherCard}>
                        <div style={s.cardTopRow}>
                          <button style={s.linkBtn} onClick={() => setSelectedTicket(tk)}>
                            {tk.name}
                          </button>
                          <TicketStatusBadge status={tk.status} />
                        </div>
                        <p style={s.cardEmail}>{tk.email} · {tk.phone}</p>
                        <p style={s.cardMeta}>
                          {tk.role === "teacher" ? "📚 Teacher" : "🎓 Student"} · {tk.reason || "General"}
                        </p>
                        <p style={s.cardMeta}>
                          Submitted {tk.createdAt ? new Date(tk.createdAt).toLocaleDateString() : "—"}
                        </p>
                        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                          {tk.status !== "In Progress" && (
                            <button style={{ ...s.progressBtn, flex: 1 }} onClick={() => updateTicketStatus(tk._id, "In Progress")}>
                              In Progress
                            </button>
                          )}
                          {tk.status !== "Resolved" && (
                            <button style={{ ...s.approveBtn, flex: 1 }} onClick={() => updateTicketStatus(tk._id, "Resolved")}>
                              Resolve
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          );
        })()}
      </div>

      {/* Teacher detail modal */}
      {selectedTeacher && (
        <div style={s.modalOverlay} onClick={() => setSelectedTeacher(null)}>
          <div style={s.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>
                {selectedTeacher.firstName} {selectedTeacher.lastName}
              </h2>
              <div style={{ display: "flex", gap: 6 }}>
                <StatusBadge status={selectedTeacher.status} />
                {selectedTeacher.isBlocked && <BlockedBadge />}
              </div>
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
          
              <DetailRow
                label="Applied On"
                value={selectedTeacher.createdAt ? new Date(selectedTeacher.createdAt).toLocaleDateString() : null}
              />
            </div>

            {selectedTeacher.bio && (
              <div style={{ marginTop: 14 }}>
                <p style={s.detailLabel}>Bio</p>
                <p style={s.bioText}>{selectedTeacher.bio}</p>
              </div>
            )}

            {(selectedTeacher.accountName ||
              selectedTeacher.accountNumber ||
              selectedTeacher.ifsc ||
              selectedTeacher.upi) && (
              <div style={{ marginTop: 14 }}>
                <p style={s.detailLabel}>Banking Details</p>
                <div style={s.modalGrid}>
                  <DetailRow label="Account Name" value={selectedTeacher.accountName} />
                  <DetailRow label="Account Number" value={maskAccountNumber(selectedTeacher.accountNumber)} />
                  <DetailRow label="IFSC" value={selectedTeacher.ifsc} />
                  <DetailRow label="UPI ID" value={selectedTeacher.upi} />
                </div>
              </div>
            )}

            <div style={{ marginTop: 16 }}>
              <p style={s.detailLabel}>Documents</p>
              <div style={s.docGrid}>
                <DocumentPreview label="Aadhar" url={selectedTeacher.aadharUrl} onExpand={setLightbox} />
                <DocumentPreview label="Resume" url={selectedTeacher.resumeUrl} onExpand={setLightbox} />
                <DocumentPreview label="Marksheet" url={selectedTeacher.marksheetUrl} onExpand={setLightbox} />
              </div>
            </div>

            {selectedTeacher.status === "Rejected" && selectedTeacher.rejectionReason && (
              <div style={{ ...s.errorBox, marginTop: 16 }}>
                <b>Rejection reason:</b> {selectedTeacher.rejectionReason}
              </div>
            )}

            {selectedTeacher.isBlocked && selectedTeacher.blockReason && (
              <div style={{ ...s.errorBox, marginTop: 16 }}>
                <b>Block reason:</b> {selectedTeacher.blockReason}
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
              {selectedTeacher.isBlocked ? (
                <button style={s.unblockBtn} onClick={() => unblockTeacher(selectedTeacher._id)}>
                  Unblock Teacher
                </button>
              ) : (
                <button
                  style={s.blockBtn}
                  onClick={() => {
                    setBlockReasonFor({ id: selectedTeacher._id, type: "teacher" });
                    setBlockReasonText("");
                  }}
                >
                  Block Teacher
                </button>
              )}
              <button style={s.closeBtn} onClick={() => setSelectedTeacher(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student detail modal */}
      {selectedStudent && (
        <div style={s.modalOverlay} onClick={() => setSelectedStudent(null)}>
          <div style={s.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>
                {selectedStudent.firstName} {selectedStudent.lastName}
              </h2>
              {selectedStudent.isBlocked ? <BlockedBadge /> : <ActiveBadge />}
            </div>

            <div style={s.modalGrid}>
              <DetailRow label="Email" value={selectedStudent.email} />
              <DetailRow label="Phone" value={selectedStudent.phone} />
              <DetailRow label="Grade" value={selectedStudent.grade} />
              <DetailRow label="Board" value={selectedStudent.board} />
              <DetailRow label="School" value={selectedStudent.school} />
              <DetailRow label="City" value={selectedStudent.city} />
              <DetailRow label="State" value={selectedStudent.state} />
              <DetailRow label="Gender" value={selectedStudent.gender} />
              <DetailRow label="DOB" value={selectedStudent.dob} />
      
              <DetailRow
                label="Joined On"
                value={selectedStudent.createdAt ? new Date(selectedStudent.createdAt).toLocaleDateString() : null}
              />
            </div>

            <div style={{ marginTop: 16 }}>
              <p style={s.detailLabel}>Enrolled Courses</p>
              {selectedStudent.enrolledCourses && selectedStudent.enrolledCourses.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                  {selectedStudent.enrolledCourses.map((ec, i) => (
                    <div key={i} style={s.courseRow}>
                      <div>
                        <p style={s.detailValue}>
                          {ec.course?.title || ec.course?.name || "Untitled course"}
                        </p>
                        <p style={s.mutedText}>
                          Enrolled {ec.enrolledAt ? new Date(ec.enrolledAt).toLocaleDateString() : "—"}
                        </p>
                      </div>
                      <span style={s.progressPill}>{ec.progress ?? 0}% complete</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={s.mutedText}>Not enrolled in any courses yet.</p>
              )}
            </div>

            {selectedStudent.isBlocked && selectedStudent.blockReason && (
              <div style={{ ...s.errorBox, marginTop: 16 }}>
                <b>Block reason:</b> {selectedStudent.blockReason}
              </div>
            )}

            <div style={s.modalActions}>
              {selectedStudent.isBlocked ? (
                <button style={s.unblockBtn} onClick={() => unblockStudent(selectedStudent._id)}>
                  Unblock Student
                </button>
              ) : (
                <button
                  style={s.blockBtn}
                  onClick={() => {
                    setBlockReasonFor({ id: selectedStudent._id, type: "student" });
                    setBlockReasonText("");
                  }}
                >
                  Block Student
                </button>
              )}
              <button style={s.closeBtn} onClick={() => setSelectedStudent(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block reason modal (shared by teachers + students) */}
      {blockReasonFor && (
        <div style={s.modalOverlay} onClick={() => setBlockReasonFor(null)}>
          <div style={s.reasonCard} onClick={(e) => e.stopPropagation()}>
            <h3 style={s.modalTitle}>Reason for blocking</h3>
            <p style={s.emptySub}>
              Optional — helps track why this {blockReasonFor.type} was blocked. They won't be able to log in while blocked.
            </p>
            <textarea
              style={s.textarea}
              value={blockReasonText}
              onChange={(e) => setBlockReasonText(e.target.value)}
              placeholder="e.g. Policy violation, fraudulent documents, payment dispute..."
              rows={4}
            />
            <div style={s.modalActions}>
              <button
                style={s.blockBtn}
                onClick={() =>
                  blockReasonFor.type === "teacher"
                    ? blockTeacher(blockReasonFor.id, blockReasonText)
                    : blockStudent(blockReasonFor.id, blockReasonText)
                }
              >
                Confirm Block
              </button>
              <button style={s.closeBtn} onClick={() => setBlockReasonFor(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Support ticket detail modal */}
      {selectedTicket && (
        <div style={s.modalOverlay} onClick={() => setSelectedTicket(null)}>
          <div style={s.modalCard} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>{selectedTicket.name}</h2>
              <TicketStatusBadge status={selectedTicket.status} />
            </div>

            <div style={s.modalGrid}>
              <DetailRow label="Email" value={selectedTicket.email} />
              <DetailRow label="Phone" value={selectedTicket.phone} />
              <DetailRow label="Role" value={selectedTicket.role === "teacher" ? "Teacher" : "Student"} />
              <DetailRow label="Reason" value={selectedTicket.reason} />
              <DetailRow
                label="Submitted On"
                value={selectedTicket.createdAt ? new Date(selectedTicket.createdAt).toLocaleDateString() : null}
              />
            </div>

            <div style={{ marginTop: 14 }}>
              <p style={s.detailLabel}>Issue Description</p>
              <p style={s.bioText}>{selectedTicket.description}</p>
            </div>

            <div style={s.modalActions}>
              {selectedTicket.status !== "Pending" && (
                <button
                  style={s.closeBtn}
                  onClick={() => updateTicketStatus(selectedTicket._id, "Pending")}
                >
                  Reopen
                </button>
              )}
              {selectedTicket.status !== "In Progress" && (
                <button
                  style={s.progressBtn}
                  onClick={() => updateTicketStatus(selectedTicket._id, "In Progress")}
                >
                  Mark In Progress
                </button>
              )}
              {selectedTicket.status !== "Resolved" && (
                <button
                  style={s.approveBtn}
                  onClick={() => updateTicketStatus(selectedTicket._id, "Resolved")}
                >
                  Mark Resolved
                </button>
              )}
              <button
                style={s.rejectBtn}
                onClick={() => {
                  if (window.confirm(`Delete this support request from ${selectedTicket.name}? This can't be undone.`)) {
                    deleteTicket(selectedTicket._id);
                  }
                }}
              >
                Delete
              </button>
              <button style={s.closeBtn} onClick={() => setSelectedTicket(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Document lightbox */}
      {lightbox && (
        <div style={s.modalOverlay} onClick={() => setLightbox(null)}>
          <div style={s.lightboxCard} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalHeader}>
              <h3 style={s.modalTitle}>{lightbox.label}</h3>
              <button style={s.closeBtn} onClick={() => setLightbox(null)}>
                Close
              </button>
            </div>
            {lightbox.type === "image" ? (
              <img src={lightbox.url} alt={lightbox.label} style={s.lightboxImg} />
            ) : (
              <iframe src={lightbox.url} title={lightbox.label} style={s.lightboxIframe} />
            )}
            <a href={lightbox.url} target="_blank" rel="noreferrer" style={s.docDownloadLink}>
              Open original in new tab ↗
            </a>
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

function BlockedBadge() {
  return (
    <span style={{ ...s.badge, background: "#FBE6E4", color: "#B23B2E" }}>
      Blocked
    </span>
  );
}

function ActiveBadge() {
  return (
    <span style={{ ...s.badge, background: "#E3F5EC", color: "#1f7a68" }}>
      Active
    </span>
  );
}

function TicketStatusBadge({ status }) {
  const colors = {
    Pending: { bg: "#FFF4E5", color: "#8A5A00" },
    "In Progress": { bg: "#E4EEFD", color: "#165ee7" },
    Resolved: { bg: "#E3F5EC", color: "#1f7a68" },
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

function DocumentPreview({ label, url, onExpand }) {
  if (!url) {
    return (
      <div style={s.docCard}>
        <p style={s.docCardLabel}>{label}</p>
        <div style={s.docCardEmpty}>Not uploaded</div>
      </div>
    );
  }

  const isImage = /\.(jpe?g|png|webp|gif)$/i.test(url);
  const isPdf = /\.pdf$/i.test(url);

  return (
    <div style={s.docCard}>
      <p style={s.docCardLabel}>{label}</p>
      {isImage ? (
        <button style={s.docThumbBtn} onClick={() => onExpand({ url, label, type: "image" })}>
          <img src={url} alt={label} style={s.docThumbImg} />
        </button>
      ) : (
        <button
          style={s.docThumbBtn}
          onClick={() => onExpand({ url, label, type: isPdf ? "pdf" : "other" })}
        >
          <div style={s.docThumbPdf}>📄 View {isPdf ? "PDF" : "file"}</div>
        </button>
      )}
    </div>
  );
}

function maskAccountNumber(num) {
  if (!num) return null;
  const str = String(num);
  if (str.length <= 4) return str;
  return "•".repeat(str.length - 4) + str.slice(-4);
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

  searchInput: {
    flex: "1 1 220px",
    minWidth: 180,
    padding: "8px 14px",
    borderRadius: 100,
    border: "1.5px solid #E0E4EA",
    fontSize: 13,
    color: "#111",
    background: "white",
    outline: "none",
    fontFamily: "inherit",
  },

  courseFilterRow: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 20 },
  courseFilterLabel: { fontSize: 12, fontWeight: 700, color: "#888", marginRight: 4 },
  clearFilterBtn: {
    background: "none",
    border: "none",
    color: "#B23B2E",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    textDecoration: "underline",
  },

  blockBtn: {
    background: "white",
    color: "#B23B2E",
    border: "1.5px solid #E8A69E",
    borderRadius: 6,
    padding: "7px 14px",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  unblockBtn: {
    background: "#4FB88A",
    color: "white",
    border: "none",
    borderRadius: 6,
    padding: "7px 14px",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  progressBtn: {
    background: "#E4EEFD",
    color: "#165ee7",
    border: "1.5px solid #cfe0fb",
    borderRadius: 6,
    padding: "7px 14px",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
  },

  courseRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #E8E2D8",
    borderRadius: 10,
    padding: "10px 14px",
    background: "#FAFAF7",
  },
  progressPill: {
    fontSize: 11,
    fontWeight: 700,
    color: "#7A73D8",
    background: "#F0EFFD",
    borderRadius: 100,
    padding: "4px 10px",
    whiteSpace: "nowrap",
  },

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

  // ---- Document previews ----
  docGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 },
  docCard: { border: "1px solid #E8E2D8", borderRadius: 10, padding: 10, background: "#FAFAF7" },
  docCardLabel: { fontSize: 11, fontWeight: 700, color: "#999", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" },
  docCardEmpty: { fontSize: 12, color: "#BBB", padding: "20px 0", textAlign: "center" },
  docThumbBtn: { width: "100%", padding: 0, border: "none", background: "none", cursor: "pointer" },
  docThumbImg: { width: "100%", height: 90, objectFit: "cover", borderRadius: 6, border: "1px solid #E0E4EA" },
  docThumbPdf: { width: "100%", height: 90, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", fontSize: 12, fontWeight: 700, color: "#7A73D8", background: "#F0EFFD", borderRadius: 6 },
  docDownloadLink: { display: "inline-block", marginTop: 12, fontSize: 12, fontWeight: 700, color: "#7A73D8", textDecoration: "none" },

  // ---- Lightbox ----
  lightboxCard: { background: "white", borderRadius: 16, padding: 24, width: "100%", maxWidth: 720, maxHeight: "90vh", overflowY: "auto" },
  lightboxImg: { width: "100%", borderRadius: 8, border: "1px solid #E8E2D8" },
  lightboxIframe: { width: "100%", height: "70vh", border: "1px solid #E8E2D8", borderRadius: 8 },
};