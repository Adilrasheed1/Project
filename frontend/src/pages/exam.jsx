import { useState } from "react";
import Question from "./question";
import Result from "./result";
import { OctagonX } from "lucide-react";

function Exam({ exam, onBack }) {

  const questions = [
    {
      question: "what is 2+2",
      options: ["1","2","3","4"],
      answer: "4"
    },
    {
      question: "what is 2-2",
      options: ["0","2","3","4"],
      answer: "0"
    }
  ];

  const [answers, setAnswers] = useState({});
  const [currentQuestion, setcurrentQuestion] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningDisplayed, setwarningDisplayed] = useState(false);
  const [score, setScore] = useState(null);

  const resetExam = () => {
    setcurrentQuestion(0);
    setAnswers({});
    setShowWarning(false);
    setwarningDisplayed(false);
    setScore(null);
  };

  // RESULT SCREEN
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

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-white">

      {/* CARD */}
      <div className="relative w-full max-w-2xl bg-[#eeeff1] rounded-3xl shadow-lg p-8 md:p-12 flex flex-col gap-6">

        {/* EXIT BUTTON (now correctly positioned inside card) */}
        <button
          onClick={onBack}
          className="absolute top-5 right-5 px-4 py-2 bg-red-500 text-white rounded"
        >
          Leave Exam
        </button>

        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-6 text-center">
          {exam?.name}
        </h1>

        {/* QUESTION COUNTER */}
        <p className="mb-6 text-center text-gray-600">
          Question {currentQuestion + 1} / {questions.length}
        </p>

        {/* QUESTION */}
        <div className="w-full mb-6">
          <Question
            question={questions[currentQuestion].question}
            options={questions[currentQuestion].options}
            selectedAnswer={answers[currentQuestion]}

            onSelect={(option) => {
              setAnswers((prev) => ({
                ...prev,
                [currentQuestion]: option,
              }));

              const updatedAnswers = {
                ...answers,
                [currentQuestion]: option,
              };

              const hasUnanswered = questions.some(
                (_, i) => updatedAnswers[i] === undefined
              );

              if (!hasUnanswered) {
                setShowWarning(false);
                setwarningDisplayed(false);
              }
            }}
          />
        </div>

        {/* WARNING */}
        {showWarning && (
          <div className="flex items-center justify-center gap-2 text-red-500 font-semibold mb-6">
            <OctagonX size={18} />
            <span>You have unanswered questions</span>
          </div>
        )}

        {/* BUTTONS */}
        <div className="mt-8 flex gap-4 justify-center">

          {/* PREV */}
          <button
            onClick={() => setcurrentQuestion(prev => prev - 1)}
            disabled={currentQuestion === 0}
            className="px-4 py-2 bg-[#9fd200] rounded disabled:opacity-50"
          >
            Prev
          </button>

          {/* NEXT / SUBMIT */}
          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={() => {
                const hasUnanswered = questions.some(
                  (_, i) => answers[i] === undefined
                );

                if (hasUnanswered && !warningDisplayed) {
                  setShowWarning(true);
                  setwarningDisplayed(true);
                  return;
                }

                setShowWarning(false);

                let score = 0;
                for (let i = 0; i < questions.length; i++) {
                  if (answers[i] === questions[i].answer) {
                    score += 10;
                  }
                }

                setScore(score);
              }}
              className={`px-4 py-2 rounded ${
                warningDisplayed
                  ? "bg-red-500 text-white"
                  : "bg-[#9fd200]"
              }`}
            >
              {warningDisplayed ? "Submit Anyway" : "Submit"}
            </button>
          ) : (
            <button
              onClick={() => setcurrentQuestion(prev => prev + 1)}
              className="px-4 py-2 bg-[#9fd200] rounded"
            >
              Next
            </button>
          )}

        </div>

      </div>
    </div>
  );
}

export default Exam;