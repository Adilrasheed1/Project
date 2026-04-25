import { useState } from "react";
import Question from "./question";
import Result from "./result";

function Exam({ examName, onBack }) {

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
    <div className="h-screen w-full flex flex-col items-center justify-center p-6 relative">

      {/* EXIT BUTTON */}
      <button
        onClick={onBack}
        className="absolute top-5 right-5 px-4 py-2 bg-red-500 text-white rounded"
      >
        Leave Exam
      </button>

      <h1 className="text-3xl font-bold mb-4">{examName}</h1>

      <p className="mb-2">
        Question {currentQuestion + 1} / {questions.length}
      </p>

      <Question
        question={questions[currentQuestion].question}
        options={questions[currentQuestion].options}
        selectedAnswer={answers[currentQuestion]}
        onSelect={(option) =>
          setAnswers((prev) => ({
            ...prev,
            [currentQuestion]: option,
          }))
        }
      />

      <div className="mt-4 flex gap-4">

        <button
          onClick={() => setcurrentQuestion(prev => prev - 1)}
          disabled={currentQuestion === 0}
          className="px-4 py-2 bg-[#9fd200] rounded"
        >
          Prev
        </button>

        {currentQuestion === questions.length - 1 ? (
          <button
            onClick={() => {
              let score = 0;
              for (let i = 0; i < questions.length; i++) {
                if (answers[i] === questions[i].answer) {
                  score += 10;
                }
              }
              setScore(score);
            }}
            className="px-4 py-2 bg-[#9fd200] rounded"
          >
            Submit
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
  );
}

export default Exam;