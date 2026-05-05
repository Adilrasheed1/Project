import { useState } from "react";

// ── CONSTANTS ──────────────────────────────────────
// Subject list with emojis
const subjects = [
  "Full Stack", "Data Science", "AI / ML",
  "Mathematics", "Science", "English",
  "Business", "Design", "General"
];

// Card color options (matches your existing UI colors)
const colorOptions = ["#F64515", "#165ee7", "#9fd200", "#000000"];

// Option labels
const optionLabels = ["A", "B", "C", "D"];

// ── COMPONENT ──────────────────────────────────────
export function TutorTestCompo() {

  // controls form visibility
  const [showForm, setShowForm] = useState(false);

  // list of created exams
  const [exams, setExams] = useState([]);

  // what the teacher is currently filling in
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
    // dont allow removing if only one question left
    if (formData.questions.length === 1) return;

    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index) // _ : current question , i : current question index
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

  // ── SAVE EXAM ──
  const handleSave = () => {
    // basic validation
    if (!formData.name.trim()) {
      alert("Please enter an exam name");
      return;
    }

    const newExam = {
      ...formData,
      id: Date.now() // temporary id until backend
    };

    setExams((prev) => [...prev, newExam]);
    setShowForm(false);

    // reset form for next exam
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
  };

  // ── UI ──────────────────────────────────────────
  return (
    <div className="p-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Exams</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[#165ee7] text-white rounded-xl font-semibold"
        >
          {showForm ? "Cancel" : "+ Create Exam"}
        </button>
      </div>

      {/* EXAM CREATION FORM */}
      {showForm && (
        <div className="bg-[#eeeff1] rounded-2xl p-6 mb-6 flex flex-col gap-4">

          <h3 className="text-xl font-bold">Create New Exam</h3>

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

                {/* QUESTION HEADER */}
                <div className="flex justify-between items-center">
                  <p className="font-semibold">Question {qIndex + 1}</p>
                  <button
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-500 text-sm font-semibold"
                  >
                    Remove
                  </button>
                </div>

                {/* QUESTION TEXT */}
                <input
                  type="text"
                  placeholder="Enter question"
                  value={q.question}
                  onChange={(e) => updateQuestion(qIndex, e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg"
                />

                {/* OPTIONS */}
                {q.options.map((opt, oIndex) => (
                  <input
                    key={oIndex}
                    type="text"
                    placeholder={`Option ${optionLabels[oIndex]}`}
                    value={opt}
                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg"
                  />
                ))}

                {/* CORRECT ANSWER */}
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
            Create Exam
          </button>

        </div>
      )}

      {/* EXAM LIST */}
      {exams.length === 0 && !showForm && (
        <p className="text-gray-400 text-center mt-10">
          No exams created yet. Click "+ Create Exam" to start.
        </p>
      )}

      {exams.map((exam) => (
        <div
          key={exam.id}
          className="bg-white rounded-xl p-4 mb-3 shadow-sm flex justify-between items-center"
        >
          <div>
            <p className="font-bold text-lg">{exam.name}</p>
            <p className="text-gray-500 text-sm">
              {exam.subject} · {exam.type} · {exam.duration} mins · {exam.questions.length} questions
            </p>
          </div>
          <div
            style={{ backgroundColor: exam.color }}
            className="w-4 h-10 rounded-full"
          />
        </div>
      ))}

    </div>
  );
}