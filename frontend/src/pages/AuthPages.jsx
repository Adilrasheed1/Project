import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API =  `${import.meta.env.VITE_API_URL}/api`;

export  function AuthPages() {
  const [page, setPage] = useState("login");
  if (page === "login") return <Login setPage={setPage} />;
  if (page === "register") return <Register setPage={setPage} />;
  if (page === "student") return <StudentRegister setPage={setPage} />;
  if (page === "teacher") return <TeacherRegister setPage={setPage} />;
}

function PageLayout({ children, wide }) {
  return (
    <div style={{
      minHeight: "100vh", width: "100vw", background: "#F7F8FA",
      fontFamily: "'Segoe UI', Arial, sans-serif", display: "flex", flexDirection: "column",
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { width: 100%; min-height: 100vh; overflow-x: hidden; }
        input, select, textarea, button { font-family: 'Segoe UI', Arial, sans-serif; }
      `}</style>
      <div style={{
        width: "100%", background: "white", borderBottom: "1px solid #E8ECF0",
        padding: "0 40px", height: 64, display: "flex", alignItems: "center", flexShrink: 0,
      }}>
        <span style={{ fontWeight: 800, fontSize: 22, color: "#4FB88A" }}>
         TutorConnect
       </span>
      </div>
      <div style={{
        flex: 1, display: "flex", justifyContent: "center",
        alignItems: "flex-start", padding: "48px 24px 80px", width: "100%",
      }}>
        <div style={{
          background: "white", borderRadius: 16, border: "1px solid #E8ECF0",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)", padding: "44px 48px",
          width: "100%", maxWidth: wide ? 560 : 460,
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <p style={{
      fontSize: 11, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase",
      color: "#4FB88A", borderBottom: "1px solid #F0F2F5", paddingBottom: 8,
      marginBottom: 18, marginTop: 32,
    }}>{children}</p>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "11px 14px", borderRadius: 8,
  border: "1.5px solid #E0E4EA", fontSize: 14, color: "#111",
  background: "#FAFBFC", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box",
};

function Input(props) {
  return (
    <input {...props} style={inputStyle}
      onFocus={e => e.target.style.borderColor = "#4FB88A"}
      onBlur={e => e.target.style.borderColor = "#E0E4EA"}
    />
  );
}

function SelectInput({ children, ...props }) {
  return (
    <select {...props} style={{ ...inputStyle, cursor: "pointer" }}
      onFocus={e => e.target.style.borderColor = "#4FB88A"}
      onBlur={e => e.target.style.borderColor = "#E0E4EA"}
    >{children}</select>
  );
}

function TextareaInput(props) {
  return (
    <textarea {...props} style={{ ...inputStyle, height: 100, resize: "vertical", lineHeight: 1.6 }}
      onFocus={e => e.target.style.borderColor = "#4FB88A"}
      onBlur={e => e.target.style.borderColor = "#E0E4EA"}
    />
  );
}

function PrimaryBtn({ children, onClick, loading }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      width: "100%", padding: "13px", background: loading ? "#9CA3AF" : "#4FB88A",
      color: "white", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700,
      cursor: loading ? "not-allowed" : "pointer", marginTop: 8, letterSpacing: 0.2,
    }}>
      {loading ? "Please wait..." : children}
    </button>
  );
}

function ErrorMsg({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      background: "#FBE6E4", border: "1px solid #D8493F", borderRadius: 8,
      padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#D8493F", fontWeight: 600,
    }}>{msg}</div>
  );
}

function SuccessMsg({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      background: "#E3F5EC", border: "1px solid #4FB88A", borderRadius: 8,
      padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#4FB88A", fontWeight: 600,
    }}>{msg}</div>
  );
}

function Row2({ children }) {
  return <div style={{ display: "flex", gap: 16 }}>{children}</div>;
}

function BottomNote({ children }) {
  return <p style={{ textAlign: "center", fontSize: 13, color: "#6B7280", marginTop: 22 }}>{children}</p>;
}

function Link({ children, onClick }) {
  return (
    <span onClick={onClick} style={{ color: "#4FB88A", fontWeight: 700, cursor: "pointer" }}>
      {children}
    </span>
  );
}

function FileField({ label, hint, onChange, file }) {
  return (
    <Field label={label}>
      <div style={{
        border: "1.5px dashed #D1D5DB", borderRadius: 8, padding: "14px 18px",
        display: "flex", alignItems: "center", gap: 14,
        background: file ? "#F0FBF6" : "#FAFBFC", cursor: "pointer", position: "relative",
      }}>
        <span style={{ fontSize: 22, flexShrink: 0 }}>{file ? "✅" : "📎"}</span>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: file ? "#4FB88A" : "#374151", marginBottom: 2 }}>
            {file ? file.name : "Click to upload"}
          </p>
          <p style={{ fontSize: 11, color: "#9CA3AF" }}>{hint}</p>
        </div>
        <input type="file" onChange={e => onChange(e.target.files[0])}
          style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }}
        />
      </div>
    </Field>
  );
}

const STATES = [
  "Andhra Pradesh", "Delhi", "Gujarat", "Jammu & Kashmir", "Karnataka",
  "Kerala", "Maharashtra", "Punjab", "Rajasthan", "Tamil Nadu", "Uttar Pradesh", "West Bengal"
];

// ── LOGIN ──────────────────────────────────────────────────
function Login({ setPage }) {
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }
      // Save token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      // Navigate based on role
      if (role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/courses");
      }
    } catch (err) {
      setError("Cannot connect to server. Make sure backend is running.");
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: "#111", marginBottom: 6 }}>Welcome back</h2>
      <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 30 }}>Log in to your TutorConnect account</p>

      <div style={{ display: "flex", background: "#F3F4F6", borderRadius: 8, padding: 4, marginBottom: 26 }}>
        {["student", "teacher"].map(r => (
          <button key={r} onClick={() => setRole(r)} style={{
            flex: 1, padding: "10px 0", borderRadius: 6, border: "none",
            fontWeight: 600, fontSize: 14, cursor: "pointer",
            background: role === r ? "white" : "transparent",
            color: role === r ? "#111" : "#9CA3AF",
            boxShadow: role === r ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
            transition: "all 0.2s",
          }}>{r === "student" ? "🎓  Student" : "📚  Teacher"}</button>
        ))}
      </div>

      <ErrorMsg msg={error} />

      <Field label="Email Address">
        <Input type="email" placeholder="you@tc.com" value={email} onChange={e => setEmail(e.target.value)} />
      </Field>
      <Field label="Password">
        <Input type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} />
      </Field>

      <div style={{ textAlign: "right", marginTop: -10, marginBottom: 22 }}>
        <span
          onClick={() => navigate("/forgot-password")}
          style={{
            fontSize: 13,
            color: "#4FB88A",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Forgot password?
        </span>
      </div>

      <PrimaryBtn onClick={handleLogin} loading={loading}>Log In</PrimaryBtn>
      <BottomNote>Don't have an account? <Link onClick={() => setPage("register")}>Register here</Link></BottomNote>
    </PageLayout>
  );
}

// ── REGISTER CHOICE ────────────────────────────────────────
function Register({ setPage }) {
  return (
    <PageLayout>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: "#111", marginBottom: 6 }}>Create an account</h2>
      <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 28 }}>Choose how you want to use TutorConnect</p>

      {[
        { key: "student", icon: "🎓", title: "Student", sub: "Learn, solve doubts, and take proctored exams" },
        { key: "teacher", icon: "📚", title: "Teacher", sub: "Upload courses and teach students live" },
      ].map(c => (
        <div key={c.key} onClick={() => setPage(c.key)}
          style={{
            display: "flex", alignItems: "center", gap: 18,
            padding: "20px 22px", border: "1.5px solid #E0E4EA",
            borderRadius: 12, cursor: "pointer", marginBottom: 14, transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#4FB88A"; e.currentTarget.style.background = "#F0FBF6"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#E0E4EA"; e.currentTarget.style.background = "white"; }}
        >
          <div style={{
            width: 52, height: 52, borderRadius: 12, background: "#F0FBF6",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0,
          }}>{c.icon}</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: "#111" }}>I am a {c.title}</p>
            <p style={{ fontSize: 13, color: "#6B7280" }}>{c.sub}</p>
          </div>
          <span style={{ color: "#CBD5E0", fontSize: 20, flexShrink: 0 }}>›</span>
        </div>
      ))}

      <BottomNote>Already have an account? <Link onClick={() => setPage("login")}>Log in</Link></BottomNote>
    </PageLayout>
  );
}

// ── STUDENT REGISTER ───────────────────────────────────────
function StudentRegister({ setPage }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [f, setF] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    dob: "", gender: "", grade: "", board: "", school: "",
    city: "", state: "", password: "", confirm: "",
  });
  const s = key => e => setF({ ...f, [key]: e.target.value });

  const handleRegister = async () => {
    setError("");
    if (!f.firstName || !f.lastName || !f.email || !f.password) {
      setError("Please fill in all required fields");
      return;
    }
    if (f.password !== f.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (f.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/student/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => navigate("/courses"), 1500);
    } catch (err) {
      setError("Cannot connect to server. Make sure backend is running.");
      setLoading(false);
    }
  };

  return (
    <PageLayout wide>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: "#111", marginBottom: 6 }}>Student Registration</h2>
      <p style={{ fontSize: 14, color: "#6B7280" }}>Fill in your details to get started</p>

      <ErrorMsg msg={error} />
      <SuccessMsg msg={success} />

      <SectionTitle>Personal Details</SectionTitle>
      <Row2>
        <div style={{ flex: 1 }}><Field label="First Name *"><Input placeholder="First name" value={f.firstName} onChange={s("firstName")} /></Field></div>
        <div style={{ flex: 1 }}><Field label="Last Name *"><Input placeholder="Last name" value={f.lastName} onChange={s("lastName")} /></Field></div>
      </Row2>
      <Field label="Email Address *"><Input type="email" placeholder="you@email.com" value={f.email} onChange={s("email")} /></Field>
      <Field label="Phone Number"><Input type="tel" placeholder="+91 XXXXX XXXXX" value={f.phone} onChange={s("phone")} /></Field>
      <Row2>
        <div style={{ flex: 1 }}><Field label="Date of Birth"><Input type="date" value={f.dob} onChange={s("dob")} /></Field></div>
        <div style={{ flex: 1 }}>
          <Field label="Gender">
            <SelectInput value={f.gender} onChange={s("gender")}>
              <option value="">Select</option>
              <option>Male</option><option>Female</option><option>Other</option>
            </SelectInput>
          </Field>
        </div>
      </Row2>

      <SectionTitle>Academic Details</SectionTitle>
      <Field label="Class / Grade">
        <SelectInput value={f.grade} onChange={s("grade")}>
          <option value="">Select grade</option>
          {["6th", "7th", "8th", "9th", "10th", "11th", "12th", "Undergraduate", "Postgraduate"].map(g => <option key={g}>{g}</option>)}
        </SelectInput>
      </Field>
      <Field label="Board / University">
        <SelectInput value={f.board} onChange={s("board")}>
          <option value="">Select board</option>
          <option>CBSE</option><option>ICSE</option><option>State Board</option>
          <option>IB</option><option>IGCSE</option><option>University</option>
        </SelectInput>
      </Field>
      <Field label="School / College Name">
        <Input placeholder="Your school or college" value={f.school} onChange={s("school")} />
      </Field>

      <SectionTitle>Location</SectionTitle>
      <Row2>
        <div style={{ flex: 1 }}><Field label="City"><Input placeholder="Your city" value={f.city} onChange={s("city")} /></Field></div>
        <div style={{ flex: 1 }}>
          <Field label="State">
            <SelectInput value={f.state} onChange={s("state")}>
              <option value="">Select state</option>
              {STATES.map(st => <option key={st}>{st}</option>)}
            </SelectInput>
          </Field>
        </div>
      </Row2>

      <SectionTitle>Create Password</SectionTitle>
      <Field label="Password *"><Input type="password" placeholder="Minimum 6 characters" value={f.password} onChange={s("password")} /></Field>
      <Field label="Confirm Password *"><Input type="password" placeholder="Repeat your password" value={f.confirm} onChange={s("confirm")} /></Field>

      <label style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13, color: "#6B7280", marginTop: 8, marginBottom: 20, cursor: "pointer" }}>
        <input type="checkbox" style={{ accentColor: "#4FB88A", width: 15, height: 15 }} />
        I agree to the <span style={{ color: "#4FB88A", fontWeight: 600 }}>Terms and Conditions</span>
      </label>

      <PrimaryBtn onClick={handleRegister} loading={loading}>Create Account</PrimaryBtn>
      <BottomNote>Already have an account? <Link onClick={() => setPage("login")}>Log in</Link></BottomNote>
    </PageLayout>
  );
}

// ── TEACHER REGISTER ───────────────────────────────────────
function TeacherRegister({ setPage }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [f, setF] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    dob: "", gender: "", city: "", state: "",
    qualification: "", subject: "", experience: "", bio: "",
    accountName: "", accountNumber: "", ifsc: "", upi: "",
    password: "", confirm: "",
  });
  const [resume, setResume] = useState(null);
  const [aadhar, setAadhar] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const s = key => e => setF({ ...f, [key]: e.target.value });

  const handleRegister = async () => {
    setError("");

    if (!f.firstName || !f.lastName || !f.email || !f.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (f.password !== f.confirm) {
      setError("Passwords do not match");
      return;
    }

    if (f.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!resume || !aadhar || !certificate) {
      setError("Please upload all required documents");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    Object.keys(f).forEach(key => {
      formData.append(key, f[key]);
    });

    formData.append("resume", resume);
    formData.append("aadhar", aadhar);
    formData.append("marksheet", certificate);

    try {
      const res = await fetch(`${API}/auth/teacher/register`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data);
        setError(data.error || data.message || "Registration failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccess("Application submitted! Redirecting...");

      setTimeout(() => navigate("/teacher"), 1500);
    } catch (err) {
      setError("Cannot connect to server. Make sure backend is running.");
      setLoading(false);
    }
  };

  return (
    <PageLayout wide>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: "#111", marginBottom: 6 }}>Teacher Registration</h2>
      <p style={{ fontSize: 14, color: "#6B7280" }}>Apply to become a verified tutor on TutorConnect</p>

      <ErrorMsg msg={error} />
      <SuccessMsg msg={success} />

      <SectionTitle>Personal Details</SectionTitle>
      <Row2>
        <div style={{ flex: 1 }}><Field label="First Name *"><Input placeholder="First name" value={f.firstName} onChange={s("firstName")} /></Field></div>
        <div style={{ flex: 1 }}><Field label="Last Name *"><Input placeholder="Last name" value={f.lastName} onChange={s("lastName")} /></Field></div>
      </Row2>
      <Field label="Email Address *"><Input type="email" placeholder="you@email.com" value={f.email} onChange={s("email")} /></Field>
      <Field label="Phone Number"><Input type="tel" placeholder="+91 XXXXX XXXXX" value={f.phone} onChange={s("phone")} /></Field>
      <Row2>
        <div style={{ flex: 1 }}><Field label="Date of Birth"><Input type="date" value={f.dob} onChange={s("dob")} /></Field></div>
        <div style={{ flex: 1 }}>
          <Field label="Gender">
            <SelectInput value={f.gender} onChange={s("gender")}>
              <option value="">Select</option>
              <option>Male</option><option>Female</option><option>Other</option>
            </SelectInput>
          </Field>
        </div>
      </Row2>
      <Row2>
        <div style={{ flex: 1 }}><Field label="City"><Input placeholder="Your city" value={f.city} onChange={s("city")} /></Field></div>
        <div style={{ flex: 1 }}>
          <Field label="State">
            <SelectInput value={f.state} onChange={s("state")}>
              <option value="">Select state</option>
              {STATES.map(st => <option key={st}>{st}</option>)}
            </SelectInput>
          </Field>
        </div>
      </Row2>

      <SectionTitle>Teaching Details</SectionTitle>
      <Field label="Highest Qualification">
        <SelectInput value={f.qualification} onChange={s("qualification")}>
          <option value="">Select qualification</option>
          <option>B.Sc</option><option>B.Tech / B.E.</option><option>B.A.</option>
          <option>M.Sc</option><option>M.Tech</option><option>MBA</option>
          <option>Ph.D</option><option>Other</option>
        </SelectInput>
      </Field>
      <Field label="Subject You Teach">
        <SelectInput value={f.subject} onChange={s("subject")}>
          <option value="">Select subject</option>
          <option>Mathematics</option><option>Physics</option><option>Chemistry</option>
          <option>Biology</option><option>English</option><option>History</option>
          <option>Economics</option><option>Computer Science</option>
          <option>Philosophy</option><option>Business Studies</option>
        </SelectInput>
      </Field>
      <Field label="Years of Teaching Experience">
        <SelectInput value={f.experience} onChange={s("experience")}>
          <option value="">Select experience</option>
          <option>Less than 1 year</option><option>1 to 3 years</option>
          <option>3 to 5 years</option><option>5 to 10 years</option>
          <option>More than 10 years</option>
        </SelectInput>
      </Field>
      <Field label="Short Bio">
        <TextareaInput placeholder="Tell students about your teaching style..." value={f.bio} onChange={s("bio")} />
      </Field>

      <SectionTitle>Upload Documents</SectionTitle>
      <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 18, marginTop: -10 }}>
        Verified by our team within 24 to 48 hours
      </p>
      <FileField label="Resume / CV" hint="PDF or Word, max 5MB" onChange={setResume} file={resume} />
      <FileField label="Aadhaar Card" hint="JPG, PNG or PDF" onChange={setAadhar} file={aadhar} />
      <FileField label="Degree / Teaching Certificate" hint="Your highest qualification" onChange={setCertificate} file={certificate} />

      <SectionTitle>Bank Details</SectionTitle>
      <Field label="Account Holder Name"><Input placeholder="As per bank records" value={f.accountName} onChange={s("accountName")} /></Field>
      <Row2>
        <div style={{ flex: 1 }}><Field label="Account Number"><Input placeholder="Account number" value={f.accountNumber} onChange={s("accountNumber")} /></Field></div>
        <div style={{ flex: 1 }}><Field label="IFSC Code"><Input placeholder="e.g. SBIN0001234" value={f.ifsc} onChange={s("ifsc")} /></Field></div>
      </Row2>
      <Field label="UPI ID (optional)"><Input placeholder="yourname@upi" value={f.upi} onChange={s("upi")} /></Field>

      <SectionTitle>Create Password</SectionTitle>
      <Field label="Password *"><Input type="password" placeholder="Minimum 6 characters" value={f.password} onChange={s("password")} /></Field>
      <Field label="Confirm Password *"><Input type="password" placeholder="Repeat your password" value={f.confirm} onChange={s("confirm")} /></Field>

      <label style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13, color: "#6B7280", marginTop: 8, marginBottom: 20, cursor: "pointer" }}>
        <input type="checkbox" style={{ accentColor: "#4FB88A", width: 15, height: 15 }} />
        I agree to the <span style={{ color: "#4FB88A", fontWeight: 600 }}>Terms and Conditions</span>
      </label>

      <PrimaryBtn onClick={handleRegister} loading={loading}>Submit Application</PrimaryBtn>
      <BottomNote>Already have an account? <Link onClick={() => setPage("login")}>Log in</Link></BottomNote>
    </PageLayout>
  );
}