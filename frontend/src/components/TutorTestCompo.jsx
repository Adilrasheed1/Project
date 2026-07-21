import { useState, useEffect } from "react";

// ── CONSTANTS ──────────────────────────────────────
const subjects = [
  "Full Stack", "Data Science", "AI / ML",
  "Mathematics", "Science", "English",
  "Business", "Design", "General"
];

const colorOptions = ["#F64515", "#165ee7", "#9fd200", "#000000"];

const API_URL = `${import.meta.env.VITE_API_URL}/api/exam`;
const RESULT_API_URL = `${import.meta.env.VITE_API_URL}/api/result`;

// ── SHARED STYLE TOKENS ─────────────────────────────
// These match the tokens already used in TeacherDashboard.jsx (the `s` object there).
// Reusing the same values (radius, border color, font sizes) is what makes this
// component feel like part of the same page instead of a boxed-in widget.
const s = {
  pageTitle: { fontSize: 26, fontWeight: 800, color: "#1A1A1A", letterSpacing: -0.5, marginBottom: 4 },
  pageSub: { fontSize: 14, color: "#888" },
  topRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 },

  primaryBtn: {
    background: "#F64515", color: "white", border: "none", borderRadius: 8,
    padding: "11px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
  },
  secondaryBtn: {
    background: "#eeeff1", color: "#444", border: "none", borderRadius: 8,
    padding: "11px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
  },

  // Card that holds the whole create/edit form. White + thin border + soft shadow,
  // NOT a filled gray box — that's what made it feel "tight" and separate before.
  formCard: {
    background: "white", borderRadius: 16, padding: 24, marginBottom: 28,
    border: "1px solid #eeeff1", boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    display: "flex", flexDirection: "column", gap: 16,
  },

  input: {
    width: "100%", padding: "10px 14px", borderRadius: 8,
    border: "1.5px solid #E0E4EA", fontSize: 14, color: "#111",
    background: "#FAFBFC", outline: "none", fontFamily: "inherit",
  },

  typeBtn: (active) => ({
    padding: "10px 18px", borderRadius: 8, fontSize: 14, fontWeight: 700,
    fontFamily: "inherit", cursor: "pointer", textTransform: "capitalize",
    border: active ? "none" : "1.5px solid #E0E4EA",
    background: active ? "#165ee7" : "white",
    color: active ? "white" : "#444",
  }),

  // Same look as the LECTURE cards in TeacherDashboard's upload modal.
  questionCard: {
    border: "1.5px solid #E0E4EA", borderRadius: 12, padding: 16,
    background: "#FAFBFC", display: "flex", flexDirection: "column", gap: 10,
  },
  questionLabel: { fontSize: 11, fontWeight: 800, color: "#165ee7", letterSpacing: 0.5 },
  removeBtn: { background: "none", border: "none", color: "#F64515", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },

  addQuestionBtn: {
    padding: 12, border: "1.5px dashed #165ee7", borderRadius: 8, background: "none",
    color: "#165ee7", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
  },

  // Exam list rows — same shape as course rows in TeacherDashboard.
  examRow: {
    background: "white", borderRadius: 14, padding: "16px 20px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: 16, border: "1px solid #eeeff1", cursor: "pointer", marginBottom: 12,
  },
  examTitle: { fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 },
  examMeta: { fontSize: 12, color: "#888" },

  resultsPanel: {
    background: "white", border: "1px solid #eeeff1", borderRadius: 14,
    padding: 20, marginBottom: 16, marginTop: -6,
  },
  tableHeader: {
    display: "flex", padding: "10px 12px", background: "#eeeff1",
    fontSize: 11, fontWeight: 700, color: "#888", letterSpacing: "0.06em",
    textTransform: "uppercase", borderRadius: 8,
  },
  tableRow: { display: "flex", padding: "12px", borderBottom: "1px solid #eeeff1", fontSize: 13 },
};

// ── COMPONENT ──────────────────────────────────────
export function TutorTestCompo() {

  const [showForm, setShowForm] = useState(false);
  const [exams, setExams] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [results, setResults] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    subject: "General",
    type: "normal",
    duration: 30,
    color: "#F64515",
    questions: [
      { question: "", options: ["", "", "", ""], answer: "" }
    ]
  });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setExams(data);
    } catch (err) {
      console.error("Failed to fetch exams:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async (examId) => {
    try {
      const response = await fetch(`${RESULT_API_URL}/exam/${examId}`);
      const data = await response.json();
      setResults(data);
      setSelectedExamId(examId);
    } catch (err) {
      console.error("Failed to fetch results:", err);
    }
  };

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { question: "", options: ["", "", "", ""], answer: "" }
      ]
    }));
  };

  const removeQuestion = (index) => {
    if (formData.questions.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const updateQuestion = (index, value) => {
    const updated = [...formData.questions];
    updated[index].question = value;
    setFormData((prev) => ({ ...prev, questions: updated }));
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...formData.questions];
    updated[qIndex].options[oIndex] = value;
    setFormData((prev) => ({ ...prev, questions: updated }));
  };

  const updateAnswer = (qIndex, value) => {
    const updated = [...formData.questions];
    updated[qIndex].answer = value;
    setFormData((prev) => ({ ...prev, questions: updated }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      subject: "General",
      type: "normal",
      duration: 30,
      color: "#F64515",
      questions: [
        { question: "", options: ["", "", "", ""], answer: "" }
      ]
    });
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Please enter an exam name");
      return;
    }

    const hasInvalidQuestion = formData.questions.some((q) => {
      const emptyOption = q.options.some((opt) => !opt.trim());
      return !q.question.trim() || emptyOption || !q.answer.trim();
    });

    if (hasInvalidQuestion) {
      alert("Please fill in all question fields, options, and select a correct answer for every question.");
      return;
    }

    try {
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;
      const method = editingId ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      await fetchExams();
      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error("Failed to save exam:", err);
      alert("Something went wrong while saving. Check console.");
    }
  };

  const handleEditClick = (exam) => {
    setFormData({
      name: exam.name,
      subject: exam.subject,
      type: exam.type,
      duration: exam.duration,
      color: exam.color,
      questions: exam.questions
    });
    setEditingId(exam._id);
    setShowForm(true);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this exam? This cannot be undone.")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      await fetchExams();
    } catch (err) {
      console.error("Failed to delete exam:", err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  // ── UI ──────────────────────────────────────────
  return (
    <div>

      {/* HEADER — matches pageTitle/pageSub used everywhere else in the dashboard */}
      <div style={s.topRow}>
        <div>
          <h1 style={s.pageTitle}>My Exams</h1>
          <p style={s.pageSub}>Create and manage exams for your students</p>
        </div>
        <button
          onClick={() => (showForm ? handleCancel() : setShowForm(true))}
          style={showForm ? s.secondaryBtn : s.primaryBtn}
        >
          {showForm ? "Cancel" : "+ Create Exam"}
        </button>
      </div>

      {/* EXAM CREATION / EDIT FORM — white card, not a filled gray box */}
      {showForm && (
        <div style={s.formCard}>

          <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1A1A1A" }}>
            {editingId ? "Edit Exam" : "Create New Exam"}
          </h3>

          <input
            type="text"
            placeholder="Exam Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={s.input}
          />

          <select
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            style={s.input}
          >
            {subjects.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>

          <div style={{ display: "flex", gap: 10 }}>
            {["normal", "proctored"].map((t) => (
              <button key={t} onClick={() => setFormData({ ...formData, type: t })} style={s.typeBtn(formData.type === t)}>
                {t}
              </button>
            ))}
          </div>

          <input
            type="number"
            placeholder="Duration (minutes)"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
            style={s.input}
          />

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Card Color:</p>
            {colorOptions.map((c) => (
              <div
                key={c}
                onClick={() => setFormData({ ...formData, color: c })}
                style={{
                  backgroundColor: c, width: 28, height: 28, borderRadius: "50%", cursor: "pointer",
                  border: formData.color === c ? "3px solid #1A1A1A" : "2px solid #E0E4EA",
                }}
              />
            ))}
          </div>

          {/* QUESTIONS — same "labelled card" pattern as LectureCard in TeacherDashboard */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {formData.questions.map((q, qIndex) => (
              <div key={qIndex} style={s.questionCard}>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={s.questionLabel}>QUESTION {qIndex + 1}</span>
                  <button onClick={() => removeQuestion(qIndex)} style={s.removeBtn}>Remove</button>
                </div>

                <input
                  type="text"
                  placeholder="Enter question"
                  value={q.question}
                  onChange={(e) => updateQuestion(qIndex, e.target.value)}
                  style={s.input}
                />

                {q.options.map((opt, oIndex) => (
                  <input
                    key={oIndex}
                    type="text"
                    placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                    value={opt}
                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                    style={s.input}
                  />
                ))}

                <select value={q.answer} onChange={(e) => updateAnswer(qIndex, e.target.value)} style={s.input}>
                  <option value="">Select correct answer</option>
                  {q.options.map((opt, oIndex) => (
                    <option key={oIndex} value={opt}>
                      {opt || `Option ${String.fromCharCode(65 + oIndex)}`}
                    </option>
                  ))}
                </select>

              </div>
            ))}
          </div>

          <button onClick={addQuestion} style={s.addQuestionBtn}>+ Add Question</button>

          <button onClick={handleSave} style={s.primaryBtn}>
            {editingId ? "Update Exam" : "Create Exam"}
          </button>

        </div>
      )}

      {loading && <p style={{ textAlign: "center", color: "#888" }}>Loading exams...</p>}

      {!loading && exams.length === 0 && !showForm && (
        <p style={{ textAlign: "center", color: "#888", marginTop: 40 }}>
          No exams created yet. Click "+ Create Exam" to start.
        </p>
      )}

      {/* EXAM LIST */}
      {!loading &&
        exams.map((exam) => (
          <div key={exam._id}>
            <div onClick={() => handleEditClick(exam)} style={s.examRow}>
              <div>
                <p style={s.examTitle}>{exam.name}</p>
                <p style={s.examMeta}>
                  {exam.subject} · {exam.type} · {exam.duration} mins · {exam.questions.length} questions
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ backgroundColor: exam.color, width: 6, height: 34, borderRadius: 4 }} />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedExamId === exam._id) {
                      setSelectedExamId(null);
                      setResults([]);
                    } else {
                      fetchResults(exam._id)
                    }
                  }}
                  style={s.secondaryBtn}
                >
                  {selectedExamId === exam._id ? "Close Results" : "View Results"}
                </button>

                <button onClick={(e) => handleDelete(exam._id, e)} style={{ ...s.secondaryBtn, color: "#F64515" }}>
                  Delete
                </button>
              </div>
            </div>

            {selectedExamId === exam._id && (
              <div style={s.resultsPanel}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Student Results</h3>

                {results.length === 0 ? (
                  <p style={{ color: "#888", fontSize: 13 }}>No students have taken this exam yet.</p>
                ) : (
                  <div>
                    <div style={s.tableHeader}>
                      <span style={{ flex: 2 }}>Student</span>
                      <span style={{ flex: 1 }}>Exam Score</span>
                      <span style={{ flex: 1 }}>Integrity</span>
                      <span style={{ flex: 1 }}>Final Score</span>
                      <span style={{ flex: 1 }}>Date</span>
                    </div>
                    {results.map((result) => (
                      <div key={result._id} style={s.tableRow}>
                        <span style={{ flex: 2 }}>{result.studentUsername}</span>
                        <span style={{ flex: 1 }}>{result.examScore}/{result.totalMarks}</span>
                        <span style={{ flex: 1 }}>{result.examType === "proctored" ? `${result.integrityScore}%` : "-"}</span>
                        <span style={{ flex: 1 }}>{result.finalScore}</span>
                        <span style={{ flex: 1 }}>{new Date(result.submittedAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

    </div>
  );
}