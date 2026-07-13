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

  // ── FETCH EXAMS ON LOAD ──
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

  // ── ADD A NEW EMPTY QUESTION ──
  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { question: "", options: ["", "", "", ""], answer: "" }
      ]
    }));
  };

  // ── REMOVE A QUESTION BY INDEX ──
  const removeQuestion = (index) => {
    if (formData.questions.length === 1) return;

    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  // ── UPDATE QUESTION TEXT ──
  const updateQuestion = (index, value) => {
    const updated = [...formData.questions];
    updated[index].question = value;
    setFormData((prev) => ({ ...prev, questions: updated }));
  };

  // ── UPDATE AN OPTION ──
  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...formData.questions];
    updated[qIndex].options[oIndex] = value;
    setFormData((prev) => ({ ...prev, questions: updated }));
  };

  // ── SET CORRECT ANSWER ──
  const updateAnswer = (qIndex, value) => {
    const updated = [...formData.questions];
    updated[qIndex].answer = value;
    setFormData((prev) => ({ ...prev, questions: updated }));
  };

  // ── RESET FORM TO BLANK ──
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

  // ── SAVE EXAM (CREATE OR UPDATE) ──
  const handleSave = async () => {
  if (!formData.name.trim()) {
    alert("Please enter an exam name");
    return;
  }

  // check every question is filled properly
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

  // ── CLICK EXISTING EXAM TO EDIT ──
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

  // ── DELETE EXAM ──
  const handleDelete = async (id, e) => {
    e.stopPropagation(); // prevent triggering edit click
    if (!confirm("Delete this exam? This cannot be undone.")) return;

    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      await fetchExams();
    } catch (err) {
      console.error("Failed to delete exam:", err);
    }
  };

  // ── CANCEL FORM ──
  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  // ── UI ──────────────────────────────────────────
  return (
    <div className="p-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Exams</h2>
        <button
          onClick={() => showForm ? handleCancel() : setShowForm(true)}
          className="px-4 py-2 bg-[#165ee7] text-white rounded-xl font-semibold"
        >
          {showForm ? "Cancel" : "+ Create Exam"}
        </button>
      </div>

      {/* EXAM CREATION / EDIT FORM */}
      {showForm && (
        <div className="bg-[#eeeff1] rounded-2xl p-6 mb-6 flex flex-col gap-4">

          <h3 className="text-xl font-bold">
            {editingId ? "Edit Exam" : "Create New Exam"}
          </h3>

          {/* EXAM NAME */}
          <input
            type="text"
            placeholder="Exam Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="p-3 rounded-xl border border-gray-300 bg-white"
          />

          {/* SUBJECT */}
          <select
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="p-3 rounded-xl border border-gray-300 bg-white"
          >
            {subjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* EXAM TYPE */}
          <div className="flex gap-4">
            {["normal", "proctored"].map((t) => (
              <button
                key={t}
                onClick={() => setFormData({ ...formData, type: t })}
                className={`px-4 py-2 rounded-xl font-semibold capitalize
                  ${formData.type === t
                    ? "bg-[#165ee7] text-white"
                    : "bg-white border border-gray-300"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* DURATION */}
          <input
            type="number"
            placeholder="Duration (minutes)"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
            className="p-3 rounded-xl border border-gray-300 bg-white"
          />

          {/* COLOR PICKER */}
          <div className="flex gap-3 items-center">
            <p className="font-semibold">Card Color:</p>
            {colorOptions.map((c) => (
              <div
                key={c}
                onClick={() => setFormData({ ...formData, color: c })}
                style={{ backgroundColor: c }}
                className={`w-8 h-8 rounded-full cursor-pointer transition
                  ${formData.color === c
                    ? "ring-4 ring-offset-2 ring-gray-400"
                    : ""
                  }`}
              />
            ))}
          </div>

          {/* QUESTIONS */}
          <div className="flex flex-col gap-6 mt-2">
            {formData.questions.map((q, qIndex) => (
              <div key={qIndex} className="bg-white rounded-xl p-4 flex flex-col gap-3">

                <div className="flex justify-between items-center">
                  <p className="font-semibold">Question {qIndex + 1}</p>
                  <button
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-500 text-sm font-semibold"
                  >
                    Remove
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Enter question"
                  value={q.question}
                  onChange={(e) => updateQuestion(qIndex, e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg"
                />

                {q.options.map((opt, oIndex) => (
                  <input
                    key={oIndex}
                    type="text"
                    placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                    value={opt}
                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg"
                  />
                ))}

                <select
                  value={q.answer}
                  onChange={(e) => updateAnswer(qIndex, e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg"
                >
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

          {/* ADD QUESTION */}
          <button
            onClick={addQuestion}
            className="px-4 py-2 bg-[#9fd200] text-white rounded-xl font-semibold"
          >
            + Add Question
          </button>

          {/* SAVE */}
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#165ee7] text-white rounded-xl font-semibold"
          >
            {editingId ? "Update Exam" : "Create Exam"}
          </button>

        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <p className="text-center text-gray-400">Loading exams...</p>
      )}

      {/* EMPTY STATE */}
      {!loading && exams.length === 0 && !showForm && (
        <p className="text-gray-400 text-center mt-10">
          No exams created yet. Click "+ Create Exam" to start.
        </p>
      )}

      {/* EXAM LIST — click to edit, X to delete */}
      {!loading &&
        exams.map((exam) => (
          <div key={exam._id}>
        <div
          onClick={() => handleEditClick(exam)}
          className="bg-white rounded-xl p-4 mb-3 shadow-sm flex justify-between items-center cursor-pointer hover:shadow-md transition"
        >
          <div>
            <p className="font-bold text-lg">{exam.name}</p>
            <p className="text-gray-500 text-sm">
              {exam.subject} · {exam.type} · {exam.duration} mins · {exam.questions.length} questions
            </p>
          </div>

         <div className="flex items-center gap-3">
  <div
    style={{ backgroundColor: exam.color }}
    className="w-4 h-10 rounded-full"
  />

  <button
    onClick={(e) => {
      e.stopPropagation();

      if (selectedExamId === exam._id) {
        setSelectedExamId(null);
        setResults([]);
      } else {
        fetchResults(exam._id);
      }
    }}
    className="text-blue-600 text-sm font-semibold hover:underline"
  >
    {selectedExamId === exam._id
      ? "Close Results"
      : "View Results"}
  </button>

  <button
    onClick={(e) => handleDelete(exam._id, e)}
    className="text-red-500 text-sm font-semibold hover:underline"
  >
    Delete
  </button>
</div>
        </div>

        {selectedExamId === exam._id && (
          <div className="bg-gray-50 border rounded-xl p-4 mb-4">
            <h3 className="text-lg font-bold mb-3">Student Results</h3>

            {results.length === 0 ? (
              <p className="text-gray-500">
                No students have taken this exam yet.
              </p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Student</th>
                    <th className="text-left p-2">Exam Score</th>
                    <th className="text-left p-2">Integrity</th>
                    <th className="text-left p-2">Final Score</th>
                    <th className="text-left p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result)=>(
                    <tr key={result._id} className="border-b">
                      <td className="p-2">{result.studentUsername}</td>
                      <td className="p-2">{result.examScore}/{result.totalMarks}</td>
                      <td className="p-2">{result.examType==="proctored"?`${result.integrityScore}%`:"-"}</td>
                      <td className="p-2">{result.finalScore}</td>
                      <td className="p-2">{new Date(result.submittedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
      ))}

    </div>
  )
}