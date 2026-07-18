import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function PaymentPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const token = localStorage.getItem("token");

  const [course, setCourse] = useState(null);
  const [method, setMethod] = useState("card");
  const [done, setDone] = useState(false);
  const [alreadyPurchased, setAlreadyPurchased] = useState(false);
  const [paying, setPaying] = useState(false);
  const [form, setForm] = useState({
    name: "",
    card: "",
    expiry: "",
    cvv: "",
    upi: "",
  });

  const set = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  useEffect(() => {
    loadCourse();
    checkPurchased();
  }, [id]);

  async function loadCourse() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/${id}`);
      const data = await res.json();
      setCourse(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function checkPurchased() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return;

      const data = await res.json();
      const purchased = data.some((item) => item.course?._id === id);
      setAlreadyPurchased(purchased);
    } catch (err) {
      console.log(err);
    }
  }

  async function completePayment() {
    if (alreadyPurchased) {
      alert("You already purchased this course.");
      navigate("/courses");
      return;
    }

    setPaying(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/${id}/enroll`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Payment failed");

        if (data.message === "Already enrolled") {
          setAlreadyPurchased(true);
          navigate("/courses");
        }

        return;
      }

      setDone(true);
    } catch (err) {
      console.log(err);
      alert("Server Error");
    } finally {
      setPaying(false);
    }
  }

  if (!course) {
    return <div style={s.center}>Loading...</div>;
  }

  if (done) {
    return (
      <div style={s.center}>
        <div style={s.successCard}>
          <div style={s.successIcon}>✓</div>
          <h2 style={s.successTitle}>Payment Successful!</h2>
          <p style={s.successText}>
            You have successfully enrolled in <b>{course.title}</b>.
          </p>
          <button style={s.payBtn} onClick={() => navigate("/courses")}>
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={s.shell}>
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        html,body,#root { width:100%; min-height:100vh; }
        body { font-family:ui-sans-serif,system-ui,Arial,sans-serif; background:#eeeff1; }
      `}</style>

      <div style={s.nav}>
        <span style={s.navLogo}>TutorConnect</span>
        <span style={s.navSafe}>🔒 Secure Checkout</span>
      </div>

      <div style={s.body}>
        <div style={s.left}>
          <h2 style={s.pageTitle}>Checkout</h2>

          {alreadyPurchased && (
            <div style={s.notice}>
              You already purchased this course. You cannot buy it again.
            </div>
          )}

          <div style={s.card}>
            <h3 style={s.cardTitle}>Payment Method</h3>

            <div style={s.methodRow}>
              {[
                { key: "card", label: "💳 Credit / Debit Card" },
                { key: "upi", label: "📱 UPI" },
                { key: "netbanking", label: "🏦 Net Banking" },
              ].map((m) => (
                <div
                  key={m.key}
                  onClick={() => setMethod(m.key)}
                  style={{
                    ...s.methodBtn,
                    border:
                      method === m.key
                        ? "2px solid #165ee7"
                        : "1.5px solid #dfe3e6",
                    background: method === m.key ? "#E4EEFD" : "white",
                    color: method === m.key ? "#165ee7" : "#444",
                  }}
                >
                  {m.label}
                </div>
              ))}
            </div>

            {method === "card" && (
              <div style={{ marginTop: 20 }}>
                <Field label="Cardholder Name">
                  <Input placeholder="Name on card" value={form.name} onChange={set("name")} />
                </Field>

                <Field label="Card Number">
                  <Input
                    placeholder="1234 5678 9012 3456"
                    value={form.card}
                    onChange={set("card")}
                    maxLength={19}
                  />
                </Field>

                <div style={{ display: "flex", gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <Field label="Expiry Date">
                      <Input placeholder="MM / YY" value={form.expiry} onChange={set("expiry")} />
                    </Field>
                  </div>

                  <div style={{ flex: 1 }}>
                    <Field label="CVV">
                      <Input
                        placeholder="•••"
                        value={form.cvv}
                        onChange={set("cvv")}
                        maxLength={3}
                        type="password"
                      />
                    </Field>
                  </div>
                </div>
              </div>
            )}

            {method === "upi" && (
              <div style={{ marginTop: 20 }}>
                <Field label="UPI ID">
                  <Input placeholder="yourname@upi" value={form.upi} onChange={set("upi")} />
                </Field>
                <p style={s.smallText}>
                  You will receive a payment request on your UPI app.
                </p>
              </div>
            )}

            {method === "netbanking" && (
              <div style={{ marginTop: 20 }}>
                <Field label="Select Bank">
                  <select style={inputStyle}>
                    <option>State Bank of India</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Punjab National Bank</option>
                    <option>Other</option>
                  </select>
                </Field>
              </div>
            )}
          </div>

          <div style={s.card}>
            <h3 style={s.cardTitle}>Billing Details</h3>

            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <Field label="First Name">
                  <Input placeholder="First name" />
                </Field>
              </div>

              <div style={{ flex: 1 }}>
                <Field label="Last Name">
                  <Input placeholder="Last name" />
                </Field>
              </div>
            </div>

            <Field label="Email Address">
              <Input placeholder="you@email.com" type="email" />
            </Field>

            <Field label="Phone Number">
              <Input placeholder="+91 XXXXX XXXXX" type="tel" />
            </Field>
          </div>
        </div>

        <div style={s.right}>
          <div style={s.summaryCard}>
            <h3 style={s.cardTitle}>Order Summary</h3>

            <div style={s.courseRow}>
              <div style={{ ...s.courseThumb, background: course.color || "#165ee7" }}>
                <span style={s.thumbText}>{course.subject?.charAt(0) || "C"}</span>
              </div>

              <div style={{ flex: 1 }}>
                <p style={s.courseTitle}>{course.title}</p>
                <p style={s.courseTutor}>{course.tutor}</p>
              </div>
            </div>

            <div style={s.divider} />

            <div style={s.priceLines}>
              <div style={s.priceLine}>
                <span>Course Price</span>
                <span>₹{course.price}</span>
              </div>

              <div style={s.divider} />

              <div style={{ ...s.priceLine, fontWeight: 800, fontSize: 16 }}>
                <span>Total</span>
                <span>₹{course.price}</span>
              </div>
            </div>

            <button
              style={{
                ...s.payBtn,
                opacity: alreadyPurchased || paying ? 0.75 : 1,
                cursor: alreadyPurchased || paying ? "default" : "pointer",
              }}
              disabled={alreadyPurchased || paying}
              onClick={completePayment}
            >
              {alreadyPurchased
                ? "Already Purchased"
                : paying
                ? "Processing..."
                : `Pay ₹${course.price} Securely`}
            </button>

            <div style={s.trustRow}>
              <span style={s.trustItem}>🔒 SSL Secured</span>
              <span style={s.trustItem}>↩ 30-day refund</span>
              <span style={s.trustItem}>✓ Instant access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={s.fieldLabel}>{label}</label>
      {children}
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      style={inputStyle}
      onFocus={(e) => (e.target.style.borderColor = "#165ee7")}
      onBlur={(e) => (e.target.style.borderColor = "#dfe3e6")}
    />
  );
}

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 8,
  border: "1.5px solid #dfe3e6",
  fontSize: 14,
  color: "#111",
  background: "#FAFBFC",
  outline: "none",
  fontFamily: "inherit",
};

const s = {
  shell: { minHeight: "100vh", width: "100%", background: "#eeeff1" },
  center: {
    minHeight: "100vh",
    background: "#eeeff1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "ui-sans-serif,system-ui,Arial,sans-serif",
    padding: 20,
  },
  nav: {
    width: "100%",
    background: "white",
    borderBottom: "1px solid #eeeff1",
    padding: "0 40px",
    height: 62,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navLogo: { fontWeight: 800, fontSize: 20, color: "#165ee7" },
  navSafe: { fontSize: 13, fontWeight: 600, color: "#888" },
  body: {
    display: "flex",
    gap: 28,
    padding: "36px 40px",
    maxWidth: 1100,
    margin: "0 auto",
    alignItems: "flex-start",
  },
  left: { flex: 1, display: "flex", flexDirection: "column", gap: 20 },
  right: { width: 320, flexShrink: 0 },
  pageTitle: {
    fontSize: 26,
    fontWeight: 800,
    color: "#1A1A1A",
    marginBottom: 20,
  },
  notice: {
    background: "#FFF4E5",
    border: "1px solid #F4C16E",
    color: "#8A5A00",
    borderRadius: 10,
    padding: 14,
    fontSize: 14,
    fontWeight: 600,
  },
  card: {
    background: "white",
    borderRadius: 16,
    padding: "24px",
    border: "1px solid #eeeff1",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: "#1A1A1A",
    marginBottom: 16,
  },
  methodRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  methodBtn: {
    flex: 1,
    minWidth: 140,
    padding: "11px 8px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    textAlign: "center",
  },
  fieldLabel: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 6,
  },
  smallText: {
    fontSize: 12,
    color: "#888",
    marginTop: -8,
  },
  summaryCard: {
    background: "white",
    borderRadius: 16,
    padding: "24px",
    border: "1px solid #eeeff1",
    position: "sticky",
    top: 24,
  },
  courseRow: {
    display: "flex",
    gap: 14,
    alignItems: "center",
    marginBottom: 18,
  },
  courseThumb: {
    width: 56,
    height: 56,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  thumbText: {
    color: "white",
    fontWeight: 800,
    fontSize: 20,
  },
  courseTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#1A1A1A",
    marginBottom: 4,
    lineHeight: 1.4,
  },
  courseTutor: { fontSize: 12, color: "#888" },
  divider: {
    height: 1,
    background: "#eeeff1",
    margin: "14px 0",
  },
  priceLines: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 20,
  },
  priceLine: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 14,
    color: "#444",
  },
  payBtn: {
    width: "100%",
    padding: "14px",
    background: "#F64515",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    marginBottom: 14,
  },
  trustRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 8,
  },
  trustItem: {
    fontSize: 11,
    color: "#888",
    fontWeight: 600,
  },
  successCard: {
    background: "white",
    borderRadius: 20,
    padding: "56px 48px",
    textAlign: "center",
    maxWidth: 440,
    border: "1px solid #eeeff1",
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: "#F0FBE0",
    color: "#7CAA00",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 36,
    fontWeight: 900,
    margin: "0 auto 20px",
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 800,
    color: "#1A1A1A",
    marginBottom: 10,
  },
  successText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 28,
    lineHeight: 1.6,
  },
};