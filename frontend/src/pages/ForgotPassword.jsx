import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = `${import.meta.env.VITE_API_URL}/api`;

const inputStyle = {
  width: "100%",
  padding: "13px 16px",
  borderRadius: 10,
  border: "1.5px solid #eeeff1",
  background: "#FAFBFC",
  fontSize: 14,
  outline: "none",
  marginBottom: 18,
  transition: "0.2s",
  boxSizing: "border-box",
  color: "#1A1A1A",
};

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "student",
    reason: "Forgot Password",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
  setLoading(true);
  setError("");
  setSuccess("");

  const missingFields = [];
  if (!form.name.trim()) missingFields.push("Full Name");
  if (!form.email.trim()) missingFields.push("Email Address");
  if (!form.phone.trim()) missingFields.push("Phone Number");
  if (!form.description.trim()) missingFields.push("Issue Description");

  if (missingFields.length > 0) {
    if (missingFields.length === 1) {
      setError(`Please enter your ${missingFields[0]}.`);
    } else {
      setError(`Please fill in the following required fields: ${missingFields.join(", ")}.`);
    }
    setLoading(false);
    return;
  }

  try {
    const res = await fetch(`${API}/support`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.message && data.message.includes("validation failed")) {
        setError("Please ensure all fields are filled out correctly before submitting.");
      } else {
        setError(data.message || "An error occurred.");
      }
      setLoading(false);
      return;
    }

    setSuccess(
      "Support request submitted successfully. Our support team will contact you shortly."
    );

    setTimeout(() => {
      navigate("/");
    }, 2000);
  } catch (err) {
    setError("Unable to connect to server. Please check your internet connection.");
  }

  setLoading(false);
};

  return (
    <div
      className="fp-shell"
      style={{
        minHeight: "100vh",
        width: "100vw",
        position: "absolute",
        top: 0,
        left: 0,
        background: "#eeeff1",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "30px 20px 60px",
        overflowY: "auto",
        boxSizing: "border-box",
        fontFamily: "'Segoe UI', Arial, sans-serif",
      }}
    >
      {/*
        This page had zero responsive rules before — the card's padding
        was a fixed "44px 48px" regardless of screen size, which eats a
        huge chunk of a phone's width. The media query below only touches
        padding/font-size (never layout structure), since this is already
        just a single centered card — nothing needs to reflow, it just
        needs to breathe less aggressively on small screens.
      */}
      <style>{`
        @media (max-width: 600px) {
          .fp-shell { padding: 16px 12px 40px !important; }
          .fp-card { padding: 26px 20px !important; }
          .fp-heading { font-size: 24px !important; }
        }
      `}</style>

      <div
        className="fp-card"
        style={{
          width: "100%",
          maxWidth: "1000px",
          background: "white",
          borderRadius: 12,
          border: "1px solid #eeeff1",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          padding: "44px 48px",
        }}
      >
        <h1
          className="fp-heading"
          style={{
            textAlign: "center",
            fontSize: 32,
            fontWeight: 800,
            marginBottom: 8,
            color: "#1A1A1A",
          }}
        >
          Support System
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#1A1A1A",
            fontSize: 15,
            marginBottom: 30,
            lineHeight: 1.7,
          }}
        >
          Submit a support request. Our TutorConnect team will verify your
          account and help you recover access as soon as possible.
        </p>

        <div
          style={{
            background: "#E4EEFD",
            border: "1px solid #cfe0fb",
            borderRadius: 10,
            padding: 18,
            marginBottom: 28,
            color: "#374151",
            lineHeight: 1.7,
            fontSize: 14,
          }}
        >
          <strong>Need Help?</strong>
          <br />
          Fill in your registered details below. Once verified, our support team
          will contact you through your registered email or phone number.
        </div>
                <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="email"
          type="email"
          placeholder="Registered Email Address"
          value={form.email}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          name="phone"
          placeholder="Registered Phone Number"
          value={form.phone}
          onChange={handleChange}
          style={inputStyle}
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          style={{
            ...inputStyle,
            cursor: "pointer",
          }}
        >
          <option value="student">🎓 Student</option>
          <option value="teacher">📚 Teacher</option>
        </select>

        <textarea
          name="description"
          placeholder="Describe your issue in detail..."
          value={form.description}
          onChange={handleChange}
          style={{
            ...inputStyle,
            height: 150,
            resize: "vertical",
            lineHeight: 1.6,
          }}
        />

        {error && (
          <div
            style={{
              background: "#FBE6E4",
              border: "1px solid #D8493F",
              color: "#D8493F",
              padding: 12,
              borderRadius: 8,
              marginBottom: 18,
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: "#E4EEFD",
              border: "1px solid #165ee7",
              color: "#165ee7",
              padding: 12,
              borderRadius: 8,
              marginBottom: 18,
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            {success}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px",
            background: loading ? "#9CA3AF" : "#F64515",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            transition: ".2s",
          }}
        >
          {loading ? "Submitting..." : "Submit Support Request"}
        </button>

        <button
          onClick={() => navigate("/")}
          style={{
            width: "100%",
            marginTop: 15,
            padding: "15px",
            background: "#fff",
            color: "#165ee7",
            border: "2px solid #165ee7",
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ← Back to Login
        </button>

        <div
          style={{
            marginTop: 35,
            paddingTop: 25,
            borderTop: "1px solid #eeeff1",
            textAlign: "center",
            color: "#6B7280",
            fontSize: 13,
            lineHeight: 1.8,
          }}
        >
          <strong style={{ color: "#1A1A1A" }}>TutorConnect Support</strong>
          <br />
          We usually respond within <strong>24 hours</strong>.
          <br />
          Please ensure the email address and phone number entered above are
          the same as those used during registration.
        </div>
      </div>
    </div>
  );
}