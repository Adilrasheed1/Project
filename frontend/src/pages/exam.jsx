import { useEffect, useState, useRef } from "react";
import Question from "./question";
import Result from "./result";
import {
  OctagonX,
  ClipboardList,
  Trophy,
  Timer,
  BarChart2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Camera,
  User
} from "lucide-react";

import ExamCameraFeed from "../components/ExamCameraFeed";

function Exam({ exam, onBack }) {

  // ─── QUESTIONS DATA ───────────────────────────────
  const questions = exam.questions;

  // ─── STATE ────────────────────────────────────────
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [markedForReview, setMarkedForReview] = useState(Array(questions.length).fill(false));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningDisplayed, setWarningDisplayed] = useState(false);
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [integrityScore, setIntegrityScore] = useState(100);
  const [violations, setViolations] = useState([]);

  // ─── REFS ─────────────────────────────────────────
  const answersRef = useRef(answers);
  const integrityRef = useRef(100);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    integrityRef.current = integrityScore;
  }, [integrityScore]);

  // ─── INTEGRITY DEDUCTION ──────────────────────────
  const deductIntegrity = (reason, amount) => {
    const time = new Date().toLocaleTimeString();
    setViolations((prev) => [
      ...prev,
      { type: reason, time, deduction: amount }
    ]);
    setIntegrityScore((prev) => Math.max(0, prev - amount));
  };

  // ─── SUBMIT ───────────────────────────────────────
  const handleSubmit = () => {
    let examScore = 0;
    questions.forEach((q, i) => {
      if (answersRef.current[i] === q.answer) examScore += 10;
    });

    const finalScore = exam?.type === "proctored"
      ? Math.round((examScore + integrityRef.current) / 2)
      : examScore;

    setScore({ examScore, finalScore });
  };

  // ─── TIMER ────────────────────────────────────────
  useEffect(() => {
    if (!exam?.duration) return;
    if (showInstructions) return;

    setTimeLeft(exam.duration * 60);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [exam, showInstructions]);

 // ─── TAB SWITCH DETECTION ─────────────────────────
useEffect(() => {
  if (exam?.type !== "proctored") return;
  if (showInstructions) return;

  const handleVisibility = () => {
    if (document.visibilityState === "hidden") {
      deductIntegrity("Tab Switch", 2.5);
    }
  };

  document.addEventListener("visibilitychange", handleVisibility);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibility);
  };
}, [exam, showInstructions]);

  // ─── RESET ────────────────────────────────────────
  const resetExam = () => {
    setCurrentQuestion(0);
    setAnswers(Array(questions.length).fill(null));
    setMarkedForReview(Array(questions.length).fill(false));
    setShowWarning(false);
    setWarningDisplayed(false);
    setScore(null);
    setIntegrityScore(100);
    setViolations([]);
  };

  // ─── ANSWER SELECTION ─────────────────────────────
  const handleSelect = (option) => {
    const updated = [...answers];
    updated[currentQuestion] = option;
    setAnswers(updated);

    const hasUnanswered = updated.some((ans) => ans === null);
    if (!hasUnanswered) {
      setShowWarning(false);
      setWarningDisplayed(false);
    }
  };

  // ─── MARK FOR REVIEW ──────────────────────────────
  const handleMark = () => {
    const updated = [...markedForReview];
    updated[currentQuestion] = !updated[currentQuestion];
    setMarkedForReview(updated);
  };

  // ─── TIMER DISPLAY FORMAT ─────────────────────────
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // ─── PRE EXAM SCREEN ──────────────────────────────
if (showInstructions) {
  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-white">
      <div className="w-full max-w-2xl bg-[#eeeff1] rounded-3xl shadow-lg p-8 mx-3 flex flex-col gap-6">

        <h1 className="text-3xl font-bold text-center">{exam?.name}</h1>

        {/* EXAM DETAILS */}
        <div className="bg-white rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
          <h2 className="text-lg font-bold">Exam Details</h2>

          <div className="flex items-center gap-3 text-gray-700">
            <ClipboardList size={18} className="text-[#165ee7]"/>
            <p>Total Questions: <span className="font-semibold">{questions.length}</span></p>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <Trophy size={18} className="text-[#9fd200]"/>
            <p>Marks per Question: <span className="font-semibold">10</span></p>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <Timer size={18} className="text-orange-400"/>
            <p>Duration: <span className="font-semibold">{exam?.duration} minutes</span></p>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <BarChart2 size={18} className="text-[#165ee7]"/>
            <p>Total Marks: <span className="font-semibold">{questions.length * 10}</span></p>
          </div>
        </div>

        {/* COLOR LEGEND */}
        <div className="bg-white rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
          <h2 className="text-lg font-bold">Question Navigator Guide</h2>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#9fd200]"/>
            <p className="text-gray-700">Answered</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-orange-400"/>
            <p className="text-gray-700">Marked for Review</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-gray-200"/>
            <p className="text-gray-700">Unanswered</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#165ee7]"/>
            <p className="text-gray-700">Current Question</p>
          </div>
        </div>

        {/* GENERAL RULES */}
        <div className="bg-white rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
          <h2 className="text-lg font-bold">Rules</h2>

          <div className="flex items-center gap-3 text-gray-700">
            <CheckCircle size={18} className="text-[#9fd200]"/>
            <p>You can navigate between questions freely</p>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <CheckCircle size={18} className="text-[#9fd200]"/>
            <p>You can mark questions for review and return later</p>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <AlertTriangle size={18} className="text-orange-400"/>
            <p>If time runs out your exam will be submitted automatically</p>
          </div>

          <div className="flex items-center gap-3 text-gray-700">
            <AlertTriangle size={18} className="text-orange-400"/>
            <p>Leaving the exam will not save your progress</p>
          </div>
        </div>

        {/* PROCTORING RULES — proctored only */}
        {exam?.type === "proctored" && (
          <div className="bg-white rounded-2xl p-5 flex flex-col gap-3 shadow-sm border-2 border-red-400">
            <h2 className="text-lg font-bold text-red-500 flex items-center gap-2">
              <AlertTriangle size={20}/> Proctoring Rules
            </h2>

            <div className="flex items-center gap-3 text-gray-700">
              <XCircle size={18} className="text-red-500"/>
              <p>Tab switch detected → <span className="font-semibold">-2.5% integrity</span></p>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <XCircle size={18} className="text-red-500"/>
              <p>Camera turned off → <span className="font-semibold">-5% integrity</span></p>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <XCircle size={18} className="text-red-500"/>
              <p>Multiple people detected → <span className="font-semibold">-5% integrity</span></p>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <Camera size={18} className="text-[#165ee7]"/>
              <p>Ensure your camera is on and face is clearly visible</p>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <User size={18} className="text-[#165ee7]"/>
              <p>Make sure you are alone in the frame</p>
            </div>

          </div>
        )}

        {/* START BUTTON */}
        <button
          onClick={() => setShowInstructions(false)}
          className="w-full py-3 bg-[#165ee7] text-white text-lg font-bold rounded-2xl"
        >
          {exam?.type === "proctored" ? "I Agree — Start Exam" : "Start Exam"}
        </button>

      </div>
    </div>
  );
}
  // ─── RESULT SCREEN ────────────────────────────────
  if (score !== null) {
    return (
      <Result
        score={score.finalScore}
        examScore={score.examScore}
        integrityScore={integrityRef.current}
        examType={exam?.type}
        violations={violations}
        questions={questions}
        answers={answers}
        resetExam={resetExam}
        onBack={onBack}
      />
    );
  }

  // ─── MAIN EXAM UI ─────────────────────────────────
  return (
    <div className="min-h-screen w-full bg-white">
      <div className="w-full max-w-6xl mx-auto p-4 flex flex-col gap-4">

        {/* ── TOP BAR ── */}
        <div className="bg-[#eeeff1] rounded-2xl p-4 flex items-center justify-between">

          <h1 className="text-xl font-bold">{exam?.name}</h1>

          <div className="flex items-center gap-4">

            {/* TIMER */}
            <p className={`font-semibold ${timeLeft <= 60 ? "text-red-500" : "text-gray-700"}`}>
              ⏱ {minutes}:{seconds.toString().padStart(2, "0")}
            </p>

            {/* INTEGRITY INDICATOR — proctored only */}
            {exam?.type === "proctored" && (
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full transition
                  ${integrityScore < 80 ? "bg-red-500" : "bg-green-500"}
                `}/>
                <p className="text-sm font-semibold">
                  Integrity: {integrityScore}%
                </p>
              </div>
            )}

          </div>

          <button
            onClick={onBack}
            className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold"
          >
            Leave Exam
          </button>

        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="flex gap-4 items-start">

          {/* ── LEFT COLUMN ── */}
          <div className="flex-1 bg-[#eeeff1] rounded-2xl p-6 flex flex-col gap-6">

            <p className="text-gray-600 font-semibold">
              Question {currentQuestion + 1} / {questions.length}
            </p>

            <Question
              question={questions[currentQuestion].question}
              options={questions[currentQuestion].options}
              selectedAnswer={answers[currentQuestion]}
              onSelect={handleSelect}
            />

            {showWarning && (
              <div className="flex items-center gap-2 text-red-500 font-semibold">
                <OctagonX size={18} />
                <span>You have unanswered questions</span>
              </div>
            )}

            {/* NAV BUTTONS */}
            <div className="flex gap-4 justify-center">

              <button
                onClick={() => setCurrentQuestion((prev) => prev - 1)}
                disabled={currentQuestion === 0}
                className="px-4 py-2 bg-[#9fd200] text-white rounded-xl disabled:opacity-50"
              >
                Prev
              </button>

              {/* MARK FOR REVIEW */}
              <button
                onClick={handleMark}
                className={`px-4 py-2 rounded-xl font-semibold transition
                  ${markedForReview[currentQuestion]
                    ? "bg-orange-400 text-white"
                    : "bg-white border border-orange-400 text-orange-400"}
                `}
              >
                {markedForReview[currentQuestion] ? "✓ Marked" : "Mark"}
              </button>

              {currentQuestion === questions.length - 1 ? (
                <button
                  onClick={() => {
                    const hasUnanswered = answers.some((ans) => ans === null);
                    if (hasUnanswered && !warningDisplayed) {
                      setShowWarning(true);
                      setWarningDisplayed(true);
                      return;
                    }
                    handleSubmit();
                  }}
                  className={`px-4 py-2 rounded-xl text-white ${warningDisplayed ? "bg-red-500" : "bg-[#9fd200]"}`}
                >
                  {warningDisplayed ? "Submit Anyway" : "Submit"}
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestion((prev) => prev + 1)}
                  className="px-4 py-2 bg-[#9fd200] text-white rounded-xl"
                >
                  Next
                </button>
              )}

            </div>

          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="w-72 flex flex-col gap-4">

            {/* NAVIGATOR PANEL */}
            <div className="bg-[#eeeff1] rounded-2xl p-4 flex flex-col gap-3">

              <p className="font-bold text-sm">Question Navigator</p>

              <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                {questions.map((_, index) => {
                  const isCurrent = index === currentQuestion;
                  const isAnswered = answers[index] !== null;
                  const isMarked = markedForReview[index];

                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`w-9 h-9 rounded-full text-sm font-semibold transition
                        ${isCurrent ? "bg-[#165ee7] text-white"
                          : isMarked ? "bg-orange-400 text-white"
                          : isAnswered ? "bg-[#9fd200] text-white"
                          : "bg-gray-200"}
                      `}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              {/* COLOR LEGEND */}
              <div className="flex flex-col gap-1 mt-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#165ee7]"/>
                  <p>Current</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#9fd200]"/>
                  <p>Answered</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-400"/>
                  <p>Marked for Review</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-200"/>
                  <p>Unanswered</p>
                </div>
              </div>

            </div>

           {/* CAMERA — proctored only */}
              {exam?.type === "proctored" && (
                <div className="bg-[#eeeff1] rounded-2xl p-4 flex flex-col gap-2">
                  <p className="font-bold flex items-center gap-2 text-sm"><Camera size={16} /> You are being proctored</p>

                 <ExamCameraFeed onViolation={deductIntegrity} />

                </div>
              )}

          </div>

        </div>
      </div>
    </div>
  );
}

export default Exam;