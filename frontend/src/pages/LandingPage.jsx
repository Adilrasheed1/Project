import { useNavigate } from "react-router-dom";
import {
  Zap,
  ShieldCheck,
  BookOpen,
  Sigma,
  FlaskConical,
  Brain,
  Briefcase,
  PenLine,
  ScrollText,
  Star,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

// Brand palette — 4 primary colors
const C = {
  orange: "#f64515",
  orangeDark: "#d83c10",   // orange, darkened for hover states
  green: "#9fd200",
  blue: "#165ee7",
  dark: "#000000",         // black — text & dark surfaces
  cream: "#FAF8F4",
  white: "#FFFFFF",
  border: "#E8E2D9",
  muted: "#9B9488",
  card: "#FFFFFF",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    width: 100%;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .tc-page {
    width: 100%;
    min-height: 100vh;
    background: ${C.cream};
    font-family: 'Inter', sans-serif;
    color: ${C.dark};
    overflow-x: hidden;
  }

  /* ── NAV ── */
  .tc-nav {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 60px;
    height: 68px;
    background: rgba(250,248,244,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid ${C.border};
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .tc-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
    font-size: 17px;
    letter-spacing: -0.3px;
    text-decoration: none;
    color: ${C.dark};
  }

  .tc-logo-mark {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 800;
    font-size: 18px;
  }

  .tc-nav-links {
    display: flex;
    align-items: center;
    gap: 32px;
  }

  .tc-nav-link {
    font-size: 14px;
    font-weight: 500;
    color: ${C.muted};
    cursor: pointer;
    transition: color 0.15s;
    background: none;
    border: none;
    font-family: 'Inter', sans-serif;
  }
  .tc-nav-link:hover { color: ${C.dark}; }

  .tc-nav-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .tc-btn {
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 14px;
    padding: 9px 20px;
    border-radius: 8px;
    cursor: pointer;
    border: none;
    transition: all 0.15s ease;
    white-space: nowrap;
  }
  .tc-btn-ghost {
    background: transparent;
    color: ${C.dark};
    border: 1.5px solid ${C.border};
  }
  .tc-btn-ghost:hover {
    background: white;
    border-color: #C8C0B4;
  }
  .tc-btn-dark {
    background: ${C.dark};
    color: white;
  }
  .tc-btn-dark:hover {
    background: #2A2A28;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.18);
  }
  .tc-btn-orange {
    background: ${C.orange};
    color: white;
  }
  .tc-btn-orange:hover {
    background: ${C.orangeDark};
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(79,184,138,0.3);
  }
  .tc-btn-lg {
    padding: 13px 28px;
    font-size: 15px;
    border-radius: 10px;
  }

  /* ── HERO ── */
  .tc-hero {
    width: 100%;
    padding: 80px 60px 60px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
    max-width: 1400px;
    margin: 0 auto;
  }

  .tc-hero-left {}

  .tc-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: white;
    border: 1px solid ${C.border};
    border-radius: 100px;
    padding: 6px 14px 6px 8px;
    font-size: 12px;
    font-weight: 600;
    color: ${C.muted};
    margin-bottom: 24px;
  }

  .tc-hero-badge-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${C.orange};
    animation: tc-pulse 1.8s ease-in-out infinite;
  }

  @keyframes tc-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.85); }
  }

  .tc-hero h1 {
    font-family: 'Archivo Black', sans-serif;
    font-size: 58px;
    line-height: 1.02;
    letter-spacing: -1.5px;
    margin-bottom: 20px;
    color: ${C.dark};
  }

  .tc-hero h1 .tc-h1-orange { color: ${C.orange}; }
  .tc-hero h1 .tc-h1-green { color: ${C.green}; }
  .tc-hero h1 .tc-h1-blue { color: ${C.blue}; }

  .tc-hero-sub {
    font-size: 17px;
    line-height: 1.65;
    color: #6B6760;
    max-width: 460px;
    margin-bottom: 36px;
  }

  .tc-hero-cta {
    display: flex;
    gap: 12px;
    margin-bottom: 48px;
    flex-wrap: wrap;
  }

  .tc-hero-stats {
    display: flex;
    gap: 36px;
    padding-top: 32px;
    border-top: 1px solid ${C.border};
  }

  .tc-stat-val {
    font-family: 'Archivo Black', sans-serif;
    font-size: 24px;
    color: ${C.dark};
    letter-spacing: -0.5px;
  }

  .tc-stat-lbl {
    font-size: 12px;
    color: ${C.muted};
    margin-top: 2px;
  }

  /* ── HERO RIGHT ── */
  .tc-hero-right {
    position: relative;
    height: 480px;
  }

  .tc-fc {
    position: absolute;
    background: white;
    border-radius: 16px;
    border: 1px solid ${C.border};
    box-shadow: 0 12px 40px rgba(0,0,0,0.08);
    padding: 18px 20px;
  }

  .tc-fc-connect {
    top: 20px;
    left: 0;
    width: 270px;
    background: linear-gradient(135deg, ${C.orange}, ${C.orangeDark});
    border: none;
    color: white;
    animation: tc-float 5s ease-in-out infinite;
  }

  .tc-fc-connect-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,0.2);
    border-radius: 100px;
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .tc-fc-connect h4 {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .tc-fc-connect p {
    font-size: 12px;
    opacity: 0.8;
  }

  .tc-fc-timer {
    top: 0;
    right: 20px;
    width: 130px;
    text-align: center;
    animation: tc-float 4.5s ease-in-out infinite 0.5s;
  }

  .tc-fc-timer-num {
    font-family: 'Archivo Black', sans-serif;
    font-size: 36px;
    color: ${C.green};
    letter-spacing: -1px;
  }

  .tc-fc-timer-lbl {
    font-size: 11px;
    color: ${C.muted};
    font-weight: 600;
    margin-top: 2px;
  }

  .tc-fc-exam {
    bottom: 100px;
    right: 10px;
    width: 200px;
    animation: tc-float 5.5s ease-in-out infinite 1s;
  }

  .tc-fc-exam-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .tc-fc-exam-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: #DEE9FD;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .tc-fc-exam-t1 {
    font-size: 13px;
    font-weight: 700;
    color: ${C.dark};
  }

  .tc-fc-exam-t2 {
    font-size: 11px;
    color: ${C.muted};
    margin-top: 1px;
  }

  .tc-fc-course {
    bottom: 20px;
    left: 30px;
    width: 200px;
    animation: tc-float 4.8s ease-in-out infinite 1.5s;
  }

  .tc-fc-course-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .tc-fc-course-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${C.muted};
  }

  .tc-fc-course-rating {
    font-size: 12px;
    font-weight: 700;
    color: ${C.blue};
  }

  .tc-fc-course h5 {
    font-size: 13px;
    font-weight: 700;
    line-height: 1.4;
    margin-bottom: 8px;
  }

  .tc-fc-course-bar {
    height: 4px;
    background: ${C.border};
    border-radius: 2px;
    overflow: hidden;
  }

  .tc-fc-course-fill {
    height: 100%;
    width: 35%;
    background: ${C.orange};
    border-radius: 2px;
  }

  .tc-fc-course-pct {
    font-size: 10px;
    color: ${C.muted};
    margin-top: 4px;
    font-weight: 600;
  }

  @keyframes tc-float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
  }

  /* ── SUBJECTS ── */
  .tc-subjects {
    width: 100%;
    padding: 0 60px 64px;
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .tc-subject-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 18px 8px 8px;
    border-radius: 100px;
    background: white;
    border: 1.5px solid ${C.border};
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .tc-subject-pill:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.06);
  }

  .tc-subject-icon {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    color: white;
    font-weight: 700;
  }

  /* ── FEATURES ── */
  .tc-features {
    width: 100%;
    background: white;
    padding: 80px 60px;
  }

  .tc-features-inner {
    max-width: 1400px;
    margin: 0 auto;
  }

  .tc-section-eyebrow {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${C.muted};
    margin-bottom: 10px;
  }

  .tc-section-title {
    font-family: 'Archivo Black', sans-serif;
    font-size: 36px;
    letter-spacing: -0.8px;
    margin-bottom: 48px;
    max-width: 480px;
    line-height: 1.1;
  }

  .tc-features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .tc-feat-card {
    border-radius: 18px;
    padding: 28px 24px;
    border: 1.5px solid ${C.border};
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: default;
  }

  .tc-feat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.07);
  }

  .tc-feat-icon {
    width: 50px;
    height: 50px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    margin-bottom: 20px;
  }

  .tc-feat-tag {
    display: inline-block;
    font-size: 11px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 100px;
    margin-bottom: 12px;
    letter-spacing: 0.04em;
  }

  .tc-feat-card h3 {
    font-size: 19px;
    font-weight: 700;
    margin-bottom: 10px;
    letter-spacing: -0.3px;
  }

  .tc-feat-card p {
    font-size: 14px;
    color: #6B6760;
    line-height: 1.65;
  }

  /* ── COURSES ── */
  .tc-courses {
    width: 100%;
    padding: 80px 60px;
    max-width: 1400px;
    margin: 0 auto;
  }

  .tc-courses-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 32px;
  }

  .tc-view-all {
    font-size: 13px;
    font-weight: 600;
    color: ${C.dark};
    cursor: pointer;
    background: none;
    border: none;
    font-family: 'Inter', sans-serif;
    padding-bottom: 2px;
    border-bottom: 1.5px solid ${C.dark};
    transition: opacity 0.15s;
  }
  .tc-view-all:hover { opacity: 0.6; }

  .tc-courses-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  .tc-course-card {
    border-radius: 16px;
    padding: 18px;
    color: white;
    min-height: 180px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .tc-course-card:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow: 0 16px 40px rgba(0,0,0,0.15);
  }

  .tc-course-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tc-course-subj {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,0.22);
    padding: 4px 10px;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 700;
  }

  .tc-course-rating {
    background: white;
    color: ${C.dark};
    padding: 4px 8px;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 700;
  }

  .tc-course-card h4 {
    font-size: 14px;
    font-weight: 700;
    line-height: 1.4;
    margin: 12px 0 6px;
  }

  .tc-course-tutor {
    font-size: 11px;
    opacity: 0.8;
    font-weight: 500;
  }

  /* ── HOW ── */
  .tc-how {
    width: 100%;
    background: white;
    padding: 80px 60px;
  }

  .tc-how-inner {
    max-width: 1400px;
    margin: 0 auto;
  }

  .tc-how-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 40px;
    position: relative;
    margin-top: 48px;
  }

  .tc-how-grid::after {
    content: '';
    position: absolute;
    top: 20px;
    left: 80px;
    right: 80px;
    height: 1px;
    background: repeating-linear-gradient(
      to right,
      ${C.border} 0px,
      ${C.border} 8px,
      transparent 8px,
      transparent 18px
    );
  }

  .tc-how-step {
    position: relative;
    z-index: 1;
  }

  .tc-how-num {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: white;
    border: 1.5px solid ${C.dark};
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 15px;
    margin-bottom: 20px;
  }

  .tc-how-step h4 {
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 8px;
    letter-spacing: -0.2px;
  }

  .tc-how-step p {
    font-size: 13px;
    color: #6B6760;
    line-height: 1.6;
  }

  /* ── CTA BANNER ── */
  .tc-cta-wrap {
    padding: 40px 60px 80px;
    max-width: 1400px;
    margin: 0 auto;
  }

  .tc-cta {
    background: ${C.dark};
    border-radius: 24px;
    padding: 64px 60px;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 40px;
    position: relative;
    overflow: hidden;
  }

  .tc-cta::before {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, ${C.orange}40, transparent 70%);
    top: -180px;
    right: -100px;
    pointer-events: none;
  }

  .tc-cta::after {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, ${C.green}30, transparent 70%);
    bottom: -150px;
    left: 200px;
    pointer-events: none;
  }

  .tc-cta h2 {
    font-family: 'Archivo Black', sans-serif;
    font-size: 36px;
    color: white;
    letter-spacing: -0.8px;
    line-height: 1.1;
    margin-bottom: 12px;
    position: relative;
    z-index: 1;
  }

  .tc-cta p {
    font-size: 15px;
    color: #A8A39C;
    position: relative;
    z-index: 1;
    max-width: 420px;
  }

  .tc-cta-btns {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
    min-width: 200px;
  }

  .tc-btn-white {
    background: white;
    color: ${C.dark};
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 14px;
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.15s;
    text-align: center;
  }
  .tc-btn-white:hover { background: #F0EDE8; }

  .tc-btn-outline-white {
    background: transparent;
    color: white;
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 14px;
    padding: 12px 24px;
    border-radius: 8px;
    border: 1.5px solid rgba(255,255,255,0.25);
    cursor: pointer;
    transition: all 0.15s;
    text-align: center;
  }
  .tc-btn-outline-white:hover { background: rgba(255,255,255,0.08); }

  /* ── FOOTER ── */
  .tc-footer {
    width: 100%;
    border-top: 1px solid ${C.border};
    padding: 28px 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1400px;
    margin: 0 auto;
  }

  .tc-footer-copy {
    font-size: 13px;
    color: ${C.muted};
  }

  .tc-footer-links {
    display: flex;
    gap: 24px;
  }

  .tc-footer-link {
    font-size: 13px;
    color: ${C.muted};
    cursor: pointer;
    transition: color 0.15s;
    background: none;
    border: none;
    font-family: 'Inter', sans-serif;
  }
  .tc-footer-link:hover { color: ${C.dark}; }

  /* ── RESPONSIVE ── */
  @media (max-width: 1024px) {
    .tc-nav { padding: 0 30px; }
    .tc-nav-links { display: none; }
    .tc-hero { padding: 60px 30px 40px; gap: 40px; }
    .tc-hero h1 { font-size: 44px; }
    .tc-hero-right { height: 380px; }
    .tc-subjects { padding: 0 30px 48px; }
    .tc-features { padding: 60px 30px; }
    .tc-features-grid { grid-template-columns: 1fr; gap: 16px; }
    .tc-courses { padding: 60px 30px; }
    .tc-courses-grid { grid-template-columns: 1fr 1fr; }
    .tc-how { padding: 60px 30px; }
    .tc-how-grid { grid-template-columns: 1fr 1fr; gap: 28px; }
    .tc-how-grid::after { display: none; }
    .tc-cta-wrap { padding: 30px 30px 60px; }
    .tc-cta { padding: 44px 36px; grid-template-columns: 1fr; }
    .tc-footer { padding: 24px 30px; }
  }

  @media (max-width: 700px) {
    .tc-hero { grid-template-columns: 1fr; }
    .tc-hero h1 { font-size: 36px; }
    .tc-hero-right { display: none; }
    .tc-courses-grid { grid-template-columns: 1fr; }
    .tc-how-grid { grid-template-columns: 1fr; }
    .tc-hero-stats { gap: 20px; flex-wrap: wrap; }
    .tc-footer { flex-direction: column; gap: 14px; text-align: center; }
  }
`;

const features = [
  {
    color: C.orange,
    soft: "#FDE7E0",
    icon: Zap,
    tag: "60-second connect",
    title: "Doubt solved before you lose momentum",
    body: "Post your question and get pulled into a live video call with a matched tutor in under 60 seconds. No forms, no waiting rooms, no tickets.",
  },
  {
    color: C.green,
    soft: "#EEF9D6",
    icon: ShieldCheck,
    tag: "Proctored exams",
    title: "Scores that actually mean something",
    body: "Sit timed tests with live or AI proctoring, identity checks, and screen monitoring built in — so the certificate carries real weight.",
  },
  {
    color: C.blue,
    soft: "#DEE9FD",
    icon: BookOpen,
    tag: "Course marketplace",
    title: "Full courses built by real tutors",
    body: "Video lectures, notes, and assignments uploaded directly by tutors. Learn at your pace, then jump on a live call the moment you get stuck.",
  },
];

const courses = [
  { subj: "Math", title: "Integral Calculus Bootcamp", tutor: "Meshart Hilal", rating: "4.9", color: C.orange },
  { subj: "Physics", title: "Mechanics & Waves Full Course", tutor: "Adil Rashid", rating: "4.8", color: C.green },
  { subj: "Chemistry", title: "Organic Chemistry Foundations", tutor: "Kareem Delgado", rating: "4.9", color: C.blue },
  { subj: "Philosophy", title: "Logic & Critical Thinking", tutor: "Sana Wei", rating: "5.0", color: C.green },
];

const subjects = [
  { name: "Math", icon: Sigma, color: C.orange },
  { name: "Science", icon: FlaskConical, color: C.blue },
  { name: "Philosophy", icon: Brain, color: C.green },
  { name: "Business", icon: Briefcase, color: C.orange },
  { name: "English", icon: PenLine, color: C.blue },
  { name: "History", icon: ScrollText, color: C.green },
];

export  function LandingPage() {
  const navigate = useNavigate();

  const goAuth = () => navigate("/auth");

  return (
    <div className="tc-page">
      <style>{styles}</style>

      {/* NAV */}
      <nav className="tc-nav">
        <div className="tc-logo">
          TutorConnect
        </div>
        <div className="tc-nav-links">
          <button
            className="tc-nav-link"
            onClick={() =>
              document.getElementById("courses")?.scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            Courses
          </button>

          <button
            className="tc-nav-link"
            onClick={() => navigate("/auth")}
            
          >
            Find a Tutor
          </button>

          <button
            className="tc-nav-link"
            onClick={() => navigate("/auth")}
          >
            Teach
          </button>

          <button
            className="tc-nav-link"
            onClick={() => navigate("/forgot-password")}
          >
            Contact Us
          </button>
        </div>
        <div className="tc-nav-actions">
          <button className="tc-btn tc-btn-ghost" onClick={goAuth}>Log in</button>
          <button className="tc-btn tc-btn-dark" onClick={goAuth}>Get started</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="tc-hero">
        <div className="tc-hero-left">
          <div className="tc-hero-badge">
            <span className="tc-hero-badge-dot" />
            Live tutors online right now
          </div>
          <h1>
            <span className="tc-h1-orange">Learn</span> it.<br />
            <span className="tc-h1-blue">Understand</span> it.<br />
            <span className="tc-h1-green">Prove</span> it.
          </h1>
          <p className="tc-hero-sub">
            Get stuck? A real tutor joins your screen in under 60 seconds.
            Take full courses, sit proctored exams, and actually know your subject.
          </p>
          <div className="tc-hero-cta">
            <button className="tc-btn tc-btn-orange tc-btn-lg" onClick={goAuth}>
              Start as Student
            </button>
            <button className="tc-btn tc-btn-ghost tc-btn-lg" onClick={goAuth}>
              Become a Tutor
            </button>
          </div>
          <div className="tc-hero-stats">
            <div>
              <div className="tc-stat-val">&lt;60s</div>
              <div className="tc-stat-lbl">avg. connect time</div>
            </div>
            <div>
              <div className="tc-stat-val">32+</div>
              <div className="tc-stat-lbl">verified tutors</div>
            </div>
            <div>
              <div className="tc-stat-val">100+</div>
              <div className="tc-stat-lbl">doubts solved monthly</div>
            </div>
          </div>
        </div>

        <div className="tc-hero-right">
          <div className="tc-fc tc-fc-connect">
            <div className="tc-fc-connect-badge">
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "white", display: "inline-block" }} />
              Connecting now
            </div>
            <h4>Adil Rashid</h4>
            <p>Math tutor · joining video call</p>
          </div>

          <div className="tc-fc tc-fc-timer">
            <div className="tc-fc-timer-num">47s</div>
            <div className="tc-fc-timer-lbl">until connected</div>
          </div>

          <div className="tc-fc tc-fc-exam">
            <div className="tc-fc-exam-row">
              <div className="tc-fc-exam-icon"><ShieldCheck size={18} color={C.blue} /></div>
              <div>
                <div className="tc-fc-exam-t1">Exam proctored</div>
                <div className="tc-fc-exam-t2" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  Identity verified <CheckCircle2 size={12} color={C.green} />
                </div>
              </div>
            </div>
          </div>

          <div className="tc-fc tc-fc-course">
            <div className="tc-fc-course-top">
              <span className="tc-fc-course-label">In progress</span>
              <span className="tc-fc-course-rating" style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Star size={11} fill={C.blue} color={C.blue} /> 4.9
              </span>
            </div>
            <h5>Integral Calculus Bootcamp</h5>
            <div className="tc-fc-course-bar">
              <div className="tc-fc-course-fill" />
            </div>
            <div className="tc-fc-course-pct">35% complete</div>
          </div>
        </div>
      </section>

      {/* SUBJECTS */}
      <div className="tc-subjects">
        {subjects.map(s => (
          <div className="tc-subject-pill" key={s.name}
            style={{ borderColor: C.border }}
            onMouseEnter={e => e.currentTarget.style.borderColor = s.color}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
          >
            <span className="tc-subject-icon" style={{ background: s.color }}>
              <s.icon size={14} strokeWidth={2.5} />
            </span>
            {s.name}
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <section className="tc-features">
        <div className="tc-features-inner">
          <div className="tc-section-eyebrow">Why TutorConnect</div>
          <h2 className="tc-section-title" style={{ color: "#161614" }}>Three things every student actually needs</h2>
          <div className="tc-features-grid">
            {features.map(f => (
              <div className="tc-feat-card" key={f.title} style={{ background: C.white }}>
                <div className="tc-feat-icon" style={{ background: f.soft }}>
                  <f.icon size={24} color={f.color} strokeWidth={2} />
                </div>
                <span className="tc-feat-tag" style={{ background: f.soft, color: f.color }}>{f.tag}</span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section className="tc-courses" id="courses">
        <div className="tc-courses-head">
          <div>
            <div className="tc-section-eyebrow">Marketplace</div>
            <h2 className="tc-section-title" style={{ marginBottom: 0, fontSize: 28 }}>Trending courses</h2>
          </div>
          <button className="tc-view-all" onClick={goAuth} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            View all courses <ArrowRight size={14} />
          </button>
        </div>
        <div className="tc-courses-grid">
          {courses.map((c, i) => (
            <div className="tc-course-card" key={i} style={{ background: c.color }} onClick={goAuth}>
              <div className="tc-course-top">
                <span className="tc-course-subj">
                  <span style={{ fontSize: 12, fontStyle: "italic" }}>ƒ(x)</span>
                  {c.subj}
                </span>
                <span className="tc-course-rating" style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <Star size={11} fill={C.dark} color={C.dark} /> {c.rating}
                </span>
              </div>
              <div>
                <h4>{c.title}</h4>
                <div className="tc-course-tutor">{c.tutor}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="tc-how">
        <div className="tc-how-inner">
          <div className="tc-section-eyebrow">How it works</div>
          <h2 className="tc-section-title" style={{ color: "#161614" }}>From stuck to solved in minutes</h2>
          <div className="tc-how-grid">
            {[
              { n: "1", t: "Ask your question", b: "Type or photograph the problem you're stuck on." },
              { n: "2", t: "Get matched instantly", b: "Paired with a verified tutor in your subject in under 60 seconds." },
              { n: "3", t: "Join the video call", b: "Work through it together on a shared live screen." },
              { n: "4", t: "Learn, then prove it", b: "Take the full course and sit a proctored exam to certify your knowledge." },
            ].map(s => (
              <div className="tc-how-step" key={s.n}>
                <div className="tc-how-num">{s.n}</div>
                <h4>{s.t}</h4>
                <p>{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <div className="tc-cta-wrap">
        <div className="tc-cta">
          <div>
            <h2>Ready to stop being stuck?</h2>
            <p>Join students and tutors already on TutorConnect. Takes 2 minutes to sign up.</p>
          </div>
          <div className="tc-cta-btns">
            <button className="tc-btn-white" onClick={goAuth}>Log in as Student</button>
            <button className="tc-btn-outline-white" onClick={goAuth}>Log in as Tutor</button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${C.border}` }}>
  <div className="tc-footer">
    <div className="tc-footer-copy">© 2026 TutorConnect</div>
    <div className="tc-footer-links">
      <button className="tc-footer-link">Privacy</button>
      <button className="tc-footer-link">Terms</button>
      <button className="tc-footer-link">Contact</button>
      <button className="tc-footer-link" onClick={() => navigate("/adminstration")}>
        Admin
      </button>
    </div>
  </div>
</footer>
    </div>
  );
}