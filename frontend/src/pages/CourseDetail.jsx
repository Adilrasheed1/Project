import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CourseDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [alreadyPurchased, setAlreadyPurchased] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setCourse(null);
    setError(false);
    fetchCourse();
    checkPurchased();
  }, [id]);

  async function fetchCourse() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/${id}`);

      if (!res.ok) {
        setError(true);
        return;
      }

      const data = await res.json();

      if (!data || !data._id) {
        setError(true);
        return;
      }

      setCourse(data);
    } catch (err) {
      console.log(err);
      setError(true);
    }
  }

  async function checkPurchased() {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return;

      const data = await res.json();
      const purchased = Array.isArray(data)
        ? data.some((item) => item?.course?._id === id)
        : false;
      setAlreadyPurchased(purchased);
    } catch (err) {
      console.log(err);
    }
  }

  if (error) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h2 style={{ marginBottom: 12 }}>Course not found.</h2>
        <button
          style={{
            background: "#4FB88A",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "10px 20px",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
          }}
          onClick={() => navigate("/courses")}
        >
          ← Back to Courses
        </button>
      </div>
    );
  }

  if (!course) return <h2 style={{ padding: "50px" }}>Loading...</h2>;

  return (
    <div style={s.shell}>
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        html,body,#root { width:100%; min-height:100vh; overflow-x: hidden; }
        body { font-family:'Segoe UI',Arial,sans-serif; background:#F7F4EE; }

        @media (max-width: 900px) {
          .cd-nav { padding: 0 16px !important; }
          .cd-navLinks { display: none; }
          .cd-heroInner { padding: 0 20px !important; }
          .cd-heroTitle { font-size: 22px !important; }
          .cd-heroMeta { gap: 12px !important; }
          .cd-body { flex-direction: column !important; padding: 20px 16px !important; gap: 20px !important; }
          .cd-priceCard { width: 100% !important; position: static !important; order: -1; }
          .cd-learnGrid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={s.nav} className="cd-nav">
        <span style={s.navLogo}>TutorConnect</span>
        <div style={s.navLinks} className="cd-navLinks">
          <button style={s.navLink} onClick={() => navigate("/courses")}>
            ← Back to Courses
          </button>
        </div>
        <button style={s.navBtn} onClick={() => navigate("/courses")}>
          My Learning
        </button>
      </div>

      <div style={{ ...s.heroBanner, background: course.color || "#4FB88A" }}>
        <div style={s.heroInner} className="cd-heroInner">
          <span style={s.heroTag}>{course.subject}</span>
          <h1 style={s.heroTitle} className="cd-heroTitle">{course.title}</h1>
          <p style={s.heroSub}>
            {course.description ? course.description.slice(0, 120) : ""}...
          </p>
          <div style={s.heroMeta} className="cd-heroMeta">
            <span style={s.metaItem}>⭐ {course.rating || 0} ({course.reviews || 0} reviews)</span>
            <span style={s.metaItem}>👥 {(course.students || 0).toLocaleString()} students</span>
            <span style={s.metaItem}>⏱ {course.duration || "Not Specified"}</span>
            <span style={s.metaItem}>📊 {course.level || "Beginner"}</span>
          </div>
          <p style={s.heroTutor}>
            Created by <b>{course.tutor}</b>
          </p>
        </div>
      </div>

      <div style={s.body} className="cd-body">
        <div style={s.leftCol}>
          <div style={s.card}>
            <h2 style={s.cardTitle}>What you will learn</h2>
            <div style={s.learnGrid} className="cd-learnGrid">
              {(course.whatYouLearn || []).map((item, i) => (
                <div key={i} style={s.learnItem}>
                  <span style={s.checkIcon}>✓</span>
                  <span style={s.learnText}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={s.card}>
            <h2 style={s.cardTitle}>Course Curriculum</h2>
            <p style={s.curriculumSub}>
              {course.lectures ? course.lectures.length : 0} lectures ·{" "}
              {course.duration || "Not Specified"} total
            </p>

            <div style={s.curriculumList}>
              {(course.lectures || []).map((lecture, i) => (
                <div key={i} style={s.curriculumItem}>
                  <div style={s.curriculumLeft}>
                    <span style={s.curriculumNum}>{i + 1}</span>
                    <div>
                      <p style={s.curriculumTitle}>{lecture.title}</p>
                      <p style={s.curriculumMeta}>
                        1 lecture · {lecture.duration || ""}
                      </p>
                    </div>
                  </div>
                  <span style={s.curriculumLock}>🔒</span>
                </div>
              ))}
            </div>
          </div>

          <div style={s.card}>
            <h2 style={s.cardTitle}>Your Tutor</h2>
            <div style={s.tutorRow}>
              <div style={s.tutorAvatar}>👤</div>
              <div>
                <p style={s.tutorName}>{course.tutor}</p>
                <p style={s.tutorSubject}>{course.subject} Specialist</p>
                <div style={s.tutorStats}>
                  <span style={s.tStat}>⭐ {course.rating || 0} Rating</span>
                  <span style={s.tStat}>👥 {course.students || 0} Students</span>
                </div>
                <p style={s.tutorBio}>
                  Learn step by step with a structured course designed to make
                  concepts clear and practical.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div style={s.priceCard} className="cd-priceCard">
          <div style={s.priceBody}>
            <p><b>Duration:</b> {course.duration || "N/A"}</p>
            <p><b>Level:</b> {course.level || "Beginner"}</p>
            <p><b>Lectures:</b> {course.lectures ? course.lectures.length : 0}</p>
            <p><b>Students:</b> {course.students || 0}</p>

            <div style={{ ...s.priceRow, marginTop: "14px" }}>
              <span style={s.priceVal}>₹{course.price}</span>
            </div>

            {alreadyPurchased ? (
              <button style={{ ...s.buyBtn, opacity: 0.8, cursor: "default" }} disabled>
                Already Purchased
              </button>
            ) : (
              <button style={s.buyBtn} onClick={() => navigate(`/payment/${course._id}`)}>
                Buy Now
              </button>
            )}

            <p style={s.guarantee}>30-Day Money-Back Guarantee</p>

            <div style={s.includes}>
              <p style={s.includesTitle}>This course includes:</p>
              {[
                `⏱ ${course.duration || "Not Specified"} of video content`,
                `📄 ${course.notes ? course.notes.length : 0} Notes`,
                "📱 Access on mobile & desktop",
                "🏆 Certificate of completion",
                `🎥 ${course.lectures ? course.lectures.length : 0} Video Lectures`,
              ].map((item, i) => (
                <p key={i} style={s.includeItem}>{item}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  shell: { minHeight: "100vh", width: "100%", background: "#F7F4EE" },
  nav: {
    width: "100%",
    background: "white",
    borderBottom: "1px solid #E8E2D8",
    padding: "0 40px",
    height: 62,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navLogo: { fontWeight: 800, fontSize: 20, color: "#4FB88A" },
  navLinks: { display: "flex", gap: 24 },
  navLink: {
    background: "none",
    border: "none",
    fontSize: 14,
    fontWeight: 600,
    color: "#4FB88A",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  navBtn: {
    background: "#4FB88A",
    color: "white",
    border: "none",
    borderRadius: 8,
    padding: "9px 18px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  heroBanner: { width: "100%", padding: "48px 0" },
  heroInner: { maxWidth: 860, margin: "0 auto", padding: "0 40px", color: "white" },
  heroTag: {
    background: "rgba(255,255,255,0.22)",
    padding: "4px 12px",
    borderRadius: 100,
    fontSize: 12,
    fontWeight: 700,
    display: "inline-block",
    marginBottom: 14,
  },
  heroTitle: { fontSize: 30, fontWeight: 800, lineHeight: 1.2, marginBottom: 14 },
  heroSub: { fontSize: 15, opacity: 0.9, lineHeight: 1.6, marginBottom: 18 },
  heroMeta: { display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 12 },
  metaItem: { fontSize: 13, fontWeight: 600, opacity: 0.95 },
  heroTutor: { fontSize: 13, opacity: 0.85 },
  body: {
    display: "flex",
    gap: 32,
    padding: "36px 40px",
    maxWidth: 1200,
    margin: "0 auto",
    alignItems: "flex-start",
  },
  leftCol: { flex: 1, display: "flex", flexDirection: "column", gap: 20, minWidth: 0 },
  card: { background: "white", borderRadius: 16, padding: "28px", border: "1px solid #E8E2D8" },
  cardTitle: { fontSize: 20, fontWeight: 700, color: "#1A1A1A", marginBottom: 18 },
  learnGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  learnItem: { display: "flex", gap: 10, alignItems: "flex-start" },
  checkIcon: { color: "#4FB88A", fontWeight: 800, fontSize: 15, flexShrink: 0 },
  learnText: { fontSize: 14, color: "#333", lineHeight: 1.5 },
  curriculumSub: { fontSize: 13, color: "#888", marginBottom: 16 },
  curriculumList: { display: "flex", flexDirection: "column" },
  curriculumItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 0",
    borderBottom: "1px solid #F0EAE0",
  },
  curriculumLeft: { display: "flex", alignItems: "center", gap: 14 },
  curriculumNum: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "#F0EAE0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
    color: "#666",
    flexShrink: 0,
  },
  curriculumTitle: { fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginBottom: 3 },
  curriculumMeta: { fontSize: 12, color: "#888" },
  curriculumLock: { fontSize: 16 },
  tutorRow: { display: "flex", gap: 20, alignItems: "flex-start" },
  tutorAvatar: {
    width: 70,
    height: 70,
    borderRadius: "50%",
    background: "#EDE6DC",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 32,
    flexShrink: 0,
  },
  tutorName: { fontSize: 17, fontWeight: 700, color: "#1A1A1A", marginBottom: 3 },
  tutorSubject: { fontSize: 13, color: "#888", marginBottom: 10 },
  tutorStats: { display: "flex", gap: 16, marginBottom: 12 },
  tStat: { fontSize: 12, fontWeight: 600, color: "#555" },
  tutorBio: { fontSize: 13, color: "#555", lineHeight: 1.6 },
  priceCard: {
    width: 300,
    flexShrink: 0,
    background: "white",
    borderRadius: 16,
    border: "1px solid #E8E2D8",
    overflow: "hidden",
    position: "sticky",
    top: 80,
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
  },
  priceBody: { padding: "20px" },
  priceRow: { display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 },
  priceVal: { fontSize: 28, fontWeight: 800, color: "#1A1A1A" },
  buyBtn: {
    width: "100%",
    padding: "13px",
    background: "#4FB88A",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    marginBottom: 14,
    fontFamily: "inherit",
  },
  guarantee: { textAlign: "center", fontSize: 12, color: "#888", marginBottom: 16 },
  includes: { borderTop: "1px solid #F0EAE0", paddingTop: 14 },
  includesTitle: { fontSize: 13, fontWeight: 700, color: "#1A1A1A", marginBottom: 10 },
  includeItem: { fontSize: 13, color: "#555", marginBottom: 7, lineHeight: 1.5 },
};