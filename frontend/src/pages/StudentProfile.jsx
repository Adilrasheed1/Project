import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  grade: "",
  board: "",
  school: "",
  city: "",
  state: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function StudentProfile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadProfile();
  }, []);

  const displayName = useMemo(() => {
    const fullName = `${form.firstName || ""} ${form.lastName || ""}`.trim();
    return fullName || "Student";
  }, [form.firstName, form.lastName]);

  const avatarLetter = (form.firstName || form.email || "S").charAt(0).toUpperCase();

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function loadProfile() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/student/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.log("Failed to load profile:", res.status);
        return;
      }

      const data = await res.json();
      setForm((prev) => ({ ...prev, ...data }));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile() {
    setSaving(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/student/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      alert(data.message);

      if (res.ok && data.student) {
        setForm((prev) => ({ ...prev, ...data.student }));
      }
    } catch (err) {
      console.log(err);
      alert("Server Error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={s.loading}>Loading...</div>;

  return (
    <div style={s.page} className="sp-page">
      <style>{`
        * { box-sizing: border-box; }
        html, body, #root { width: 100%; min-height: 100vh; margin: 0; padding: 0; overflow-x: hidden; }

        @media (max-width: 800px) {
          .sp-layout { grid-template-columns: 1fr !important; }
          .sp-header { flex-direction: column; align-items: stretch !important; text-align: center; gap: 12px !important; }
          .sp-header > div:last-child { order: -1; }
          .sp-container { padding: 20px 14px !important; }
          .sp-btnRow { justify-content: stretch !important; }
          .sp-btnRow button { flex: 1; }
        }
      `}</style>
      <div style={s.container} className="sp-container">
        <header style={s.header} className="sp-header">
          <button style={s.backBtn} onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </button>

          <div>
            <h1 style={s.title}>Student Profile</h1>
            <p style={s.subtitle}>Keep your personal, academic, and account details up to date.</p>
          </div>
        </header>

        <main style={s.layout} className="sp-layout">
          <aside style={s.profileCard}>
            <div style={s.avatar}>{avatarLetter}</div>
            <h2 style={s.name}>{displayName}</h2>
            <p style={s.email}>{form.email || "No email added"}</p>
            <div style={s.badge}>Student</div>
          </aside>

          <section style={s.formCard}>
            <Section title="Personal Information">
              <Field label="First Name" value={form.firstName} onChange={(v) => updateField("firstName", v)} />
              <Field label="Last Name" value={form.lastName} onChange={(v) => updateField("lastName", v)} />
              <Field label="Email" type="email" value={form.email} onChange={(v) => updateField("email", v)} />
              <Field label="Phone Number" type="tel" value={form.phone} onChange={(v) => updateField("phone", v)} />
              <Field label="Date of Birth" type="date" value={form.dob ? form.dob.slice(0, 10) : ""} onChange={(v) => updateField("dob", v)} />

              <div style={s.field}>
                <label style={s.label}>Gender</label>
                <select style={s.input} value={form.gender} onChange={(e) => updateField("gender", e.target.value)}>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </Section>

            <Section title="Academic Information">
              <Field label="Grade" value={form.grade} onChange={(v) => updateField("grade", v)} />
              <Field label="Board" value={form.board} onChange={(v) => updateField("board", v)} />
              <Field wide label="School / College" value={form.school} onChange={(v) => updateField("school", v)} />
            </Section>

            <Section title="Address">
              <Field label="City" value={form.city} onChange={(v) => updateField("city", v)} />
              <Field label="State" value={form.state} onChange={(v) => updateField("state", v)} />
            </Section>

            <Section title="Change Password">
              <Field label="Current Password" type="password" value={form.currentPassword} onChange={(v) => updateField("currentPassword", v)} />
              <Field label="New Password" type="password" value={form.newPassword} onChange={(v) => updateField("newPassword", v)} />
              <Field wide label="Confirm Password" type="password" value={form.confirmPassword} onChange={(v) => updateField("confirmPassword", v)} />
            </Section>

            <div style={s.btnRow} className="sp-btnRow">
              <button style={s.cancelBtn} onClick={() => navigate("/dashboard")}>
                Cancel
              </button>
              <button style={s.saveBtn} onClick={saveProfile} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={s.sectionBlock}>
      <h2 style={s.sectionTitle}>{title}</h2>
      <div style={s.grid}>{children}</div>
    </div>
  );
}

function Field({ label, type = "text", value, onChange, wide = false }) {
  return (
    <div style={wide ? s.wideField : s.field}>
      <label style={s.label}>{label}</label>
      <input style={s.input} type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "#f5f7fb",
    color: "#172033",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    boxSizing: "border-box",
  },
  container: {
    width: "100%",
    maxWidth: "none",
    margin: "0 auto",
    padding: "32px clamp(16px, 4vw, 44px)",
    boxSizing: "border-box",
  },

  loading: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f7fb",
    fontSize: 22,
    fontWeight: 700,
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
    flexWrap: "wrap",
    marginBottom: 24,
  },

  backBtn: {
    background: "#1f7a68",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
  },
  title: {
    fontSize: "clamp(26px, 4vw, 38px)",
    lineHeight: 1.1,
    fontWeight: 800,
    margin: 0,
    color: "#172033",
    textAlign: "center",
  },

  subtitle: {
    color: "#64857c",
    fontSize: 15,
    margin: "8px 0 0",
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(240px, 300px) minmax(0, 1fr)",
    gap: 24,
    alignItems: "start",
  },

  profileCard: {
    background: "#fff",
    border: "1px solid #e4e8f0",
    borderRadius: 8,
    padding: 28,
    textAlign: "center",
    boxShadow: "0 14px 36px rgba(22, 32, 51, .08)",
    boxSizing: "border-box",
  },

  avatar: {
    width: 112,
    height: 112,
    borderRadius: "50%",
    background: "#1f7a68",
    color: "#172033",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
    fontSize: 44,
    fontWeight: 800,
  },

  name: {
    margin: "18px 0 0",
    fontSize: 23,
    color: "#172033",
    lineHeight: 1.25,
    fontWeight: 800,
  },

  email: {
    color: "#647085",
    margin: "8px 0 18px",
    wordBreak: "break-word",
    fontSize: 14,
  },

  badge: {
    display: "inline-flex",
    background: "#e7f5ef",
    color: "#1f7a68",
    padding: "7px 18px",
    borderRadius: 999,
    fontWeight: 800,
    fontSize: 13,
  },

  formCard: {
    background: "#fff",
    border: "1px solid #e4e8f0",
    borderRadius: 8,
    padding: "28px clamp(18px, 3vw, 34px)",
    boxShadow: "0 14px 36px rgba(22, 32, 51, .08)",
    boxSizing: "border-box",
    minWidth: 0,
  },

  sectionBlock: {
    paddingBottom: 28,
    marginBottom: 28,
    borderBottom: "1px solid #edf0f5",
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: 800,
    margin: "0 0 18px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
    gap: 18,
  },

  field: {
    minWidth: 0,
  },

  wideField: {
    minWidth: 0,
    gridColumn: "1 / -1",
  },

  label: {
    display: "block",
    marginBottom: 8,
    fontWeight: 700,
    color: "#3e4859",
    fontSize: 14,
  },

  input: {
    width: "100%",
    minHeight: 46,
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid #cfd6e2",
    color: "#172033",
    fontSize: 15,
    outline: "none",
    background: "#fff",
    boxSizing: "border-box",
  },

  btnRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    flexWrap: "wrap",
  },

  cancelBtn: {
    minHeight: 46,
    padding: "12px 24px",
    background: "#eef1f6",
    color: "#3e4859",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 15,
  },

  saveBtn: {
    minHeight: 46,
    padding: "12px 28px",
    background: "#1f7a68",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 15,
  },
};