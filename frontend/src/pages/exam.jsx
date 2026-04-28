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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningDisplayed, setWarningDisplayed] = useState(false);
  const [score, setScore] = useState(null);

  const resetExam = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowWarning(false);
    setWarningDisplayed(false);
    setScore(null);
  };

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

      <div className="relative w-full max-w-2xl bg-[#eeeff1] rounded-3xl shadow-lg p-8 mx-3 md:p-12 flex flex-col gap-6">

        <button
          onClick={onBack}
          className="absolute top-5 right-5 px-4 py-2 bg-red-500 text-white rounded"
        >
          Leave Exam
        </button>

        <h1 className="text-3xl font-bold text-center">
          {exam?.name}
        </h1>

        <p className="text-center text-gray-600">
          Question {currentQuestion + 1} / {questions.length}
        </p>

        <Question
          question={questions[currentQuestion].question}
          options={questions[currentQuestion].options}
          selectedAnswer={answers[currentQuestion]}
          onSelect={(option) => {
            const updated = { ...answers, [currentQuestion]: option };
            setAnswers(updated);

            const hasUnanswered = questions.some(
              (_, i) => updated[i] === undefined
            );

            if (!hasUnanswered) {
              setShowWarning(false);
              setWarningDisplayed(false);
            }
          }}
        />

        {showWarning && (
          <div className="flex items-center justify-center gap-2 text-red-500 font-semibold">
            <OctagonX size={18} />
            <span>You have unanswered questions</span>
          </div>
        )}

        <div className="flex gap-4 justify-center">

          <button
            onClick={() => setCurrentQuestion(prev => prev - 1)}
            disabled={currentQuestion === 0}
            className="px-4 py-2 bg-[#9fd200] rounded disabled:opacity-50"
          >
            Prev
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={() => {
                const hasUnanswered = questions.some(
                  (_, i) => answers[i] === undefined
                );

                if (hasUnanswered && !warningDisplayed) {
                  setShowWarning(true);
                  setWarningDisplayed(true);
                  return;
                }

                let finalScore = 0;
                questions.forEach((q, i) => {
                  if (answers[i] === q.answer) finalScore += 10;
                });

                setScore(finalScore);
              }}
              className={`px-4 py-2 rounded ${
                warningDisplayed ? "bg-red-500 text-white" : "bg-[#9fd200]"
              }`}
            >
              {warningDisplayed ? "Submit Anyway" : "Submit"}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(prev => prev + 1)}
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