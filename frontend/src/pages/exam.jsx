import { useEffect, useState } from "react";
import Question from "./question";
import Result from "./result";
import { OctagonX } from "lucide-react";

function Exam({ exam, onBack }) {
  const questions = [
    {
      question: "what is 2+2",
      options: ["1", "2", "3", "4"],
      answer: "4",
    },
    {
      question: "what is 2-2",
      options: ["0", "2", "3", "4"],
      answer: "0",
    },
  ];

  
  const [answers, setAnswers] = useState(
    Array(questions.length).fill(null)
  );

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningDisplayed, setWarningDisplayed] = useState(false);
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  //  SUBMIT LOGIC 
  const handleSubmit = () => {
    let finalScore = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) finalScore += 10;
    });
    setScore(finalScore);
  };

  //  TIMER
  useEffect(() => {
    if (!exam?.duration) return;

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
  }, [exam]);

  //  RESET (after exam has finished)
  const resetExam = () => {
    setCurrentQuestion(0);
    setAnswers(Array(questions.length).fill(null));
    setShowWarning(false);
    setWarningDisplayed(false);
    setScore(null);
  };

  //  RESULT SCREEN
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

  // TIMER FORMAT
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-white">
      <div className="relative w-full max-w-2xl bg-[#eeeff1] rounded-3xl shadow-lg p-8 mx-3 md:p-12 flex flex-col gap-6">

        {/* EXIT */}
        <button
          onClick={onBack}
          className="absolute top-5 right-5 px-4 py-2 bg-red-500 text-white rounded"
        >
          Leave Exam
        </button>

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center">
          {exam?.name}
        </h1>

        {/* TIMER */}
        <p
          className={`text-center font-semibold ${
            timeLeft <= 60 ? "text-red-500" : "text-gray-700"
          }`}
        >
          Time Left: {minutes}:{seconds.toString().padStart(2, "0")}
        </p>

        {/* QUESTION COUNT */}
        <p className="text-center text-gray-600">
          Question {currentQuestion + 1} / {questions.length}
        </p>

        {/* QUESTION */}
        <Question
          question={questions[currentQuestion].question}
          options={questions[currentQuestion].options}
          selectedAnswer={answers[currentQuestion]}
          onSelect={(option) => {
            
            const updated = [...answers];
            updated[currentQuestion] = option;
            setAnswers(updated);

            // check unanswered
            const hasUnanswered = updated.some(
              (ans) => ans == null
            );

            if (!hasUnanswered) {
              setShowWarning(false);
              setWarningDisplayed(false);
            }
          }}
        />

        {/* WARNING */}
        {showWarning && (
          <div className="flex items-center justify-center gap-2 text-red-500 font-semibold">
            <OctagonX size={18} />
            <span>You have unanswered questions</span>
          </div>
        )}

        {/* NAV BUTTONS */}
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
                const hasUnanswered = answers.some(
                  (ans) => ans == null
                );

                if (hasUnanswered && !warningDisplayed) {
                  setShowWarning(true);
                  setWarningDisplayed(true);
                  return;
                }

                handleSubmit();
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
              onClick={() => setCurrentQuestion((prev) => prev + 1)}
              className="px-4 py-2 bg-[#9fd200] rounded"
            >
              Next
            </button>
          )}
        </div>

        {/* QUESTION  NAVIGATOR */}
        <div className="flex flex-wrap justify-center gap-2 mt-6 max-h-40 overflow-y-auto">
          {questions.map((_, index) => {
            const isCurrent = index === currentQuestion;
            const isAnswered = answers[index] != null;

            return (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-full text-sm font-semibold transition
                  ${
                    isCurrent
                      ? "bg-[#165ee7] text-white"
                      : isAnswered
                      ? "bg-[#9fd200] text-white"
                      : "bg-gray-200"
                  }
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