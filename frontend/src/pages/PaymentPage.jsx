import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Test key only — no key_secret here. Real signature verification needs a
// backend route that creates the order (and verifies payment.success)
// using the key_secret, which should never live in frontend code.
const RAZORPAY_KEY = "rzp_test_TG6BLiHbIXiQV3";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const token = localStorage.getItem("token");
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch (e) {
      return {};
    }
  })();

  const [course, setCourse] = useState(null);
  const [done, setDone] = useState(false);
  const [alreadyPurchased, setAlreadyPurchased] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

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

  async function enrollAfterPayment(paymentId) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/${id}/enroll`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message === "Already enrolled") {
          setAlreadyPurchased(true);
          setDone(true);
          return;
        }
        setPayError(
          data.message ||
            "Payment succeeded but enrollment failed. Please contact support with payment ID " +
              paymentId +
              "."
        );
        return;
      }

      setDone(true);
    } catch (err) {
      console.log(err);
      setPayError(
        "Payment succeeded but we couldn't confirm enrollment. Please contact support with payment ID " +
          paymentId +
          "."
      );
    } finally {
      setPaying(false);
    }
  }

  async function handlePayment() {
    if (alreadyPurchased) {
      navigate("/courses");
      return;
    }

    setPayError("");
    setPaying(true);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setPayError("Couldn't load the payment gateway. Check your connection and try again.");
      setPaying(false);
      return;
    }

    const options = {
      key: RAZORPAY_KEY,
      amount: Math.round((course.price || 0) * 100), // amount in paise
      currency: "INR",
      name: "TutorConnect",
      description: course.title,
      handler: function (response) {
        enrollAfterPayment(response.razorpay_payment_id);
      },
      prefill: {
        name: [user?.firstName, user?.lastName].filter(Boolean).join(" "),
        email: user?.email || "",
      },
      theme: { color: course.color || "#165ee7" },
      modal: {
        ondismiss: function () {
          setPaying(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function () {
      setPayError("Payment failed. Please try again.");
      setPaying(false);
    });
    rzp.open();
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
          <button style={s.payBtn} onClick={() => navigate("/dashboard")}>
            Go to Dashboard
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
        <div style={s.summaryCard}>
          <h2 style={s.pageTitle}>Order Summary</h2>

          {alreadyPurchased && (
            <div style={s.notice}>
              You already purchased this course. You cannot buy it again.
            </div>
          )}

          <div style={s.courseRow}>
            <div style={{ ...s.courseThumb, background: course.color || "#165ee7" }}>
              <span style={s.thumbText}>{course.subject?.charAt(0) || "C"}</span>
            </div>

            <div style={{ flex: 1 }}>
              <p style={s.courseTitle}>{course.title}</p>
              <p style={s.courseTutor}>{course.tutor}</p>
              <p style={s.courseSubject}>{course.subject}</p>
            </div>
          </div>

          <div style={s.divider} />

          <div style={s.priceLines}>
            <div style={s.priceLine}>
              <span>Course Price</span>
              <span>₹{course.price}</span>
            </div>

            <div style={s.divider} />

            <div style={{ ...s.priceLine, fontWeight: 800, fontSize: 17 }}>
              <span>Total</span>
              <span>₹{course.price}</span>
            </div>
          </div>

          {payError && <div style={s.errorBox}>{payError}</div>}

          <button
            style={{
              ...s.payBtn,
              opacity: alreadyPurchased || paying ? 0.75 : 1,
              cursor: alreadyPurchased || paying ? "default" : "pointer",
            }}
            disabled={alreadyPurchased || paying}
            onClick={handlePayment}
          >
            {alreadyPurchased
              ? "Already Purchased"
              : paying
              ? "Processing..."
              : `Confirm & Pay ₹${course.price}`}
          </button>

          <p style={s.smallPrint}>You'll be redirected to Razorpay to complete payment securely.</p>

          <div style={s.trustRow}>
            <span style={s.trustItem}>🔒 SSL Secured</span>
            <span style={s.trustItem}>↩ 30-day refund</span>
            <span style={s.trustItem}>✓ Instant access</span>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    justifyContent: "center",
    padding: "48px 20px",
    maxWidth: 1100,
    margin: "0 auto",
  },
  pageTitle: {
    fontSize: 20,
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
    marginBottom: 18,
  },
  summaryCard: {
    background: "white",
    borderRadius: 16,
    padding: "28px",
    border: "1px solid #eeeff1",
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
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
    fontSize: 14,
    fontWeight: 700,
    color: "#1A1A1A",
    marginBottom: 4,
    lineHeight: 1.4,
  },
  courseTutor: { fontSize: 12, color: "#888", marginBottom: 2 },
  courseSubject: { fontSize: 11, color: "#AAA" },
  divider: {
    height: 1,
    background: "#eeeff1",
    margin: "14px 0",
  },
  priceLines: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 8,
  },
  priceLine: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 14,
    color: "#444",
  },
  errorBox: {
    background: "#FBE6E4",
    border: "1px solid #E8A69E",
    color: "#B23B2E",
    borderRadius: 8,
    padding: "10px 12px",
    fontSize: 12,
    fontWeight: 600,
    marginTop: 16,
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
    marginTop: 20,
    marginBottom: 10,
  },
  smallPrint: {
    textAlign: "center",
    fontSize: 11,
    color: "#999",
    marginBottom: 16,
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