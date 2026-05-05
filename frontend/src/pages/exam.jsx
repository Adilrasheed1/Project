import { useEffect, useState, useRef } from "react";
import Question from "./question";
import Result from "./result";
import { OctagonX } from "lucide-react";

function Exam({ exam, onBack }) {

  // ─── QUESTIONS DATA ───────────────────────────────
  // Hardcoded for now, will come from exam prop later
  const questions = exam.questions;

  // ─── STATE ────────────────────────────────────────
  // One slot per question, null = not answered yet
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningDisplayed, setWarningDisplayed] = useState(false);
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);

  // ─── REF ──────────────────────────────────────────
  //  holds the latest answers
  // We need this because the timer cannot read state directly
  const answersRef = useRef(answers);

  // Keep the ref in sync every time answers changes
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // ─── SUBMIT ───────────────────────────────────────
 
  const handleSubmit = () => {
    let finalScore = 0;
    questions.forEach((q, i) => {
      if (answersRef.current[i] === q.answer) finalScore += 10;
    });
    setScore(finalScore);
  };

  // ─── TIMER ────────────────────────────────────────
  // Starts when exam loads, auto-submits when time runs out
useEffect(() => {
  if (!exam?.duration) return;
  if (showInstructions) return; // ← don't start until instructions dismissed

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
     
  return () => clearInterval(timer);  // Cleanup: stop timer if component unmounts
}, [exam, showInstructions]); 

    
   
  // ─── RESET ────────────────────────────────────────
  const resetExam = () => {
    setCurrentQuestion(0);
    setAnswers(Array(questions.length).fill(null));
    setShowWarning(false);
    setWarningDisplayed(false);
    setScore(null);
  };

  // ─── ANSWER SELECTION ─────────────────────────────
  const handleSelect = (option) => {
    const updated = [...answers];
    updated[currentQuestion] = option;
    setAnswers(updated);

    // If all questions answered, hide the warning
    const hasUnanswered = updated.some((ans) => ans === null);
    if (!hasUnanswered) {
      setShowWarning(false);
      setWarningDisplayed(false);
    }
  };

  // ─── PRE EXAM SCREEN ────────────────────────────
if (showInstructions) {
  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-white">
      <div className="w-full max-w-2xl bg-[#eeeff1] rounded-3xl shadow-lg p-8 mx-3 flex flex-col gap-6">

        {/* EXAM TITLE */}
        <h1 className="text-3xl font-bold text-center">{exam?.name}</h1>

        {/* EXAM DETAILS */}
        <div className="bg-white rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
          <h2 className="text-lg font-bold">Exam Details</h2>
          <p>📋 Total Questions: <span className="font-semibold">{questions.length}</span></p>
          <p>🏆 Marks per Question: <span className="font-semibold">10</span></p>
          <p>⏱ Duration: <span className="font-semibold">{exam?.duration} minutes</span></p>
          <p>📊 Total Marks: <span className="font-semibold">{questions.length * 10}</span></p>
        </div>

        {/* COLOR LEGEND */}
        <div className="bg-white rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
          <h2 className="text-lg font-bold">Question Navigator Guide</h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#9fd200]"/>
            <p>Answered</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-400"/>
            <p>Marked for Review</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200"/>
            <p>Unanswered</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#165ee7]"/>
            <p>Current Question</p>
          </div>
        </div>

        {/* GENERAL RULES */}
        <div className="bg-white rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
          <h2 className="text-lg font-bold">Rules</h2>
          <p>✅ You can navigate between questions freely</p>
          <p>✅ You can mark questions for review and return later</p>
          <p>⚠️ If time runs out your exam will be submitted automatically</p>
          <p>⚠️ Leaving the exam will not save your progress</p>
        </div>

        {/* PROCTORING RULES — only for proctored exams */}
        {exam?.type === "proctored" && (
          <div className="bg-white rounded-2xl p-5 flex flex-col gap-3 shadow-sm border-2 border-red-400">
            <h2 className="text-lg font-bold text-red-500">⚠️ Proctoring Rules</h2>
            <p>🔴 Tab switch detected → <span className="font-semibold">-2.5% integrity score</span></p>
            <p>🔴 Camera turned off → <span className="font-semibold">-5% integrity score</span></p>
            <p>🔴 Multiple people detected → <span className="font-semibold">-5% integrity score</span></p>
            <p>🔴 Blurred camera → <span className="font-semibold">warning first, then -2.5%</span></p>
            <p>📷 Please ensure your camera is on and your face is clearly visible</p>
            <p>👤 Make sure you are alone in the frame</p>
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
        score={score}
        questions={questions}
        answers={answers}
        resetExam={resetExam}
        onBack={onBack}
      />
    );
  }

  // ─── TIMER DISPLAY FORMAT ─────────────────────────
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // ─── UI ───────────────────────────────────────────
  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-white">
      <div className="relative w-full max-w-2xl bg-[#eeeff1] rounded-3xl shadow-lg p-8 mx-3 md:p-12 flex flex-col gap-6">

        {/* EXIT BUTTON */}
        <button
          onClick={onBack}
          className="absolute top-5 right-5 px-4 py-2 bg-red-500 text-white rounded"
        >
          Leave Exam
        </button>

        {/* EXAM TITLE */}
        <h1 className="text-3xl font-bold text-center">{exam?.name}</h1>

        {/* TIMER — turns red in last 60 seconds */}
        <p className={`text-center font-semibold ${timeLeft <= 60 ? "text-red-500" : "text-gray-700"}`}>
          Time Left: {minutes}:{seconds.toString().padStart(2, "0")}
        </p>

        {/* QUESTION COUNTER */}
        <p className="text-center text-gray-600">
          Question {currentQuestion + 1} / {questions.length}
        </p>

        {/* QUESTION + OPTIONS */}
        <Question
          question={questions[currentQuestion].question}
          options={questions[currentQuestion].options}
          selectedAnswer={answers[currentQuestion]}
          onSelect={handleSelect}
        />

        {/* UNANSWERED WARNING */}
        {showWarning && (
          <div className="flex items-center justify-center gap-2 text-red-500 font-semibold">
            <OctagonX size={18} />
            <span>You have unanswered questions</span>
          </div>
        )}

        {/* PREV / NEXT / SUBMIT BUTTONS */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setCurrentQuestion((prev) => prev - 1)}
            disabled={currentQuestion === 0}
            className="px-4 py-2 bg-[#9fd200] rounded disabled:opacity-50"
          >
            Prev
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
              className={`px-4 py-2 rounded ${warningDisplayed ? "bg-red-500 text-white" : "bg-[#9fd200]"}`}
            >
              {warningDisplayed ? "Submit Anyway" : "Submit"}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion((prev) => prev + 1)}
              className="px-4 py-2 bg-[#9fd200] rounded"
            >
              Next
            </button>
          )}
        </div>

        {/* QUESTION NAVIGATOR — jump to any question */}
        <div className="flex flex-wrap justify-center gap-2 mt-6 max-h-40 overflow-y-auto">
          {questions.map((_, index) => {
            const isCurrent = index === currentQuestion;
            const isAnswered = answers[index] !== null;

            return (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-full text-sm font-semibold transition
                  ${isCurrent ? "bg-[#165ee7] text-white"
                    : isAnswered ? "bg-[#9fd200] text-white"
                    : "bg-gray-200"}
                `}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default Exam;