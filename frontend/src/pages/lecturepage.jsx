import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
const API = `${import.meta.env.VITE_API_URL}/api/courses`;

export default function LecturePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const courseId = location.state?.courseId;
  console.log("LECTURE PAGE courseId:", courseId);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedLectures, setCompletedLectures] = useState([]);

  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      return;
    }
    loadCourse();
    loadMyProgress();
  }, [courseId]);

  async function loadCourse() {
    try {
      const res = await fetch(`${API}/${courseId}`);
      const data = await res.json();
      if (res.ok) setCourse(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadMyProgress() {
    if (!token) return;
    try {
      const res = await fetch(`${API}/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      const item = data.find((i) => i.course?._id === courseId);
      if (item) {
        setProgress(item.progress || 0);
        setCompletedLectures(item.completedLectures || []);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function markLectureComplete(lectureIndex) {
    if (!token || !courseId) return;
    try {
      const res = await fetch(`${API}/${courseId}/progress`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lectureIndex }),
      });
      const data = await res.json();
      if (res.ok) {
        setProgress(data.progress);
        setCompletedLectures((prev) =>
          prev.includes(lectureIndex) ? prev : [...prev, lectureIndex]
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (!courseId) {
    return (
      <div style={{ padding: 40, fontFamily: "'Segoe UI',Arial,sans-serif" }}>
        <h2>No course selected.</h2>
        <p style={{ color: "#888", marginTop: 8 }}>
          Open this page from "My Courses" or "Resume" so it knows which course to load.
        </p>
        <button style={s.greenBtn2} onClick={() => navigate("/courses")}>Go to Courses</button>
      </div>
    );
  }

  if (loading) return <h2 style={{ padding: 40, fontFamily: "sans-serif" }}>Loading lecture...</h2>;

  if (!course) return <h2 style={{ padding: 40, fontFamily: "sans-serif" }}>Course not found.</h2>;

  const lectures = course.lectures || [];
  const current = lectures[activeIdx];

  const handleNext = () => {
    markLectureComplete(activeIdx);
    if (activeIdx < lectures.length - 1) {
      setActiveIdx((i) => i + 1);
    }
  };

  const handleVideoEnd = () => {
    markLectureComplete(activeIdx);
  };

  return (
    <div style={s.shell}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { width: 100%; min-height: 100vh; overflow-x: hidden; }
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #F7F4EE; }

        @media (max-width: 800px) {
          .lp-content { flex-direction: column !important; padding: 16px !important; gap: 20px !important; }
          .lp-right { width: 100% !important; }
          .lp-btnRow { flex-direction: column !important; }
          .lp-topBar { padding: 0 16px !important; }
          .lp-topTitle { font-size: 15px !important; }
        }
      `}</style>

      <div style={s.topBar} className="lp-topBar">
        <button style={s.backBtn} onClick={() => navigate("/courses")}>← Back</button>
        <span style={s.topTitle} className="lp-topTitle">TutorConnect</span>
        <span />
      </div>

      <div style={s.content} className="lp-content">
        <div style={s.left}>
          {lectures.length === 0 ? (
            <div style={{ ...s.videoBox, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 14 }}>
              No lectures uploaded yet for this course.
            </div>
          ) : (
            <div style={s.videoBox}>
              <video
                key={current.videoUrl}
                src={current.videoUrl}
                controls
                style={s.videoEl}
                onEnded={handleVideoEnd}
              />
            </div>
          )}

          {current && (
            <div style={s.lectureInfo}>
              <span style={s.lectureName}>{current.title}</span>
            </div>
          )}
          <div style={s.btnRow} className="lp-btnRow">
            <button style={s.greenBtn} onClick={handleNext} disabled={activeIdx >= lectures.length - 1}>
              NEXT LECTURE
            </button>
            <button style={s.greenBtn} onClick={() => alert("Raising a doubt — tutor will join in 60 seconds!")}>
              RAISE A DOUBT
            </button>
          </div>
        </div>

        <div style={s.right} className="lp-right">
          <div style={s.progressSection}>
            <div style={s.progressTop}>
              <span style={s.progressPct}>{progress}%</span>
            </div>
            <div style={s.progressBarBg}>
              <div style={{ ...s.progressBarFill, width: progress + "%" }} />
            </div>
          </div>
          

          <div style={s.lectureList}>
            {lectures.length === 0 && (
              <p style={{ fontSize: 13, color: "#888" }}>No lectures yet.</p>
            )}
            {lectures.map((lec, idx) => (
              <div key={idx}
                style={{
                  ...s.lectureItem,
                  background: activeIdx === idx ? "#D8E8FF" : "#E8E2D8",
                  border: activeIdx === idx ? "1.5px solid #7A73D8" : "1.5px solid transparent",
                }}
                onClick={() => setActiveIdx(idx)}
              >
                <div style={s.lecThumb}>
                  <div style={{ ...s.lecThumbInner, background: completedLectures.includes(idx) ? "#4FB88A" : activeIdx === idx ? "#7A73D8" : "#9BA8B8" }}>
                    <span style={{ color: "white", fontSize: 14 }}>
                      {completedLectures.includes(idx) ? "✓" : activeIdx === idx ? "⏸" : "▶"}
                    </span>
                  </div>
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={s.lecTitle}>{lec.title}</p>

                  {lec.notes && lec.notes.length > 0 && (
                    <button
                      style={s.noteBtn}
                      onClick={(e) => {
                        e.stopPropagation(); // prevents changing lecture
                        window.open(lec.notes[0].fileUrl, "_blank");
                      }}
                    >
                      📄 Notes
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  shell: { minHeight: "100vh", width: "100%", background: "#F7F4EE", display: "flex", flexDirection: "column" },
  topBar: { width: "100%", background: "white", borderBottom: "1px solid #E8E2D8", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" },
  backBtn: { background: "none", border: "none", fontSize: 14, fontWeight: 600, color: "#4FB88A", cursor: "pointer", fontFamily: "inherit" },
  topTitle: { fontWeight: 800, fontSize: 18, color: "#4FB88A" },
  content: { flex: 1, display: "flex", gap: 40, padding: "32px 40px", maxWidth: 1100, margin: "0 auto", width: "100%", alignItems: "flex-start" },
  left: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0, width: "100%" },
  videoBox: { width: "100%", aspectRatio: "16/9", background: "#1A2A3A", borderRadius: 16, overflow: "hidden", position: "relative", border: "2px solid #7A73D8" },
  videoEl: { width: "100%", height: "100%", display: "block", objectFit: "contain", background: "black" },
  lectureInfo: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#EDE6DC", padding: "12px 18px", borderRadius: 8, marginTop: 14 },
  lectureName: { fontSize: 13, fontWeight: 700, color: "#333" },
  btnRow: { display: "flex", gap: 16, marginTop: 16 },
  greenBtn: { flex: 1, padding: "13px 0", background: "#4FB88A", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.5 },
  greenBtn2: { marginTop: 16, padding: "12px 22px", background: "#4FB88A", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
  right: { width: 300, flexShrink: 0 },
  progressSection: { marginBottom: 20 },
  progressTop: { marginBottom: 6 },
  progressPct: { background: "#4FB88A", color: "white", fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 100 },
  progressBarBg: { height: 8, background: "#DDD6CC", borderRadius: 4, overflow: "hidden" },
  progressBarFill: { height: "100%", background: "#4FB88A", borderRadius: 4 },
  lectureList: { display: "flex", flexDirection: "column", gap: 10 },
  lectureItem: { display: "flex", alignItems: "center", gap: 14, padding: "10px 14px", borderRadius: 12, cursor: "pointer" },
  lecThumb: { flexShrink: 0 },
  lecThumbInner: { width: 52, height: 40, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" },
  lecTitle: { fontSize: 12, fontWeight: 700, color: "#222", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  noteBtn: {
  marginTop: 8,
  padding: "6px 14px",
  border: "1.5px solid #7A73D8",
  borderRadius: 20,
  background: "#fff",
  color: "#7A73D8",
  fontSize: 11,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "inherit",
  },
};