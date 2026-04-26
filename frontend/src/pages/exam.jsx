import { useState } from "react";
import Question from "./question";
import Result from "./result";

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
console.log(exam?.type);
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center p-6 relative">

      {/* EXIT BUTTON */}
      <button
        onClick={onBack}
        className="absolute top-5 right-5 px-4 py-2 bg-red-500 text-white rounded"
      >
        Leave Exam
      </button>

      <h1 className="text-3xl font-bold mb-4">{exam?.name}</h1>

      <p className="mb-2">
        Question {currentQuestion + 1} / {questions.length}
      </p>

      <Question
        question={questions[currentQuestion].question}
        options={questions[currentQuestion].options}
        selectedAnswer={answers[currentQuestion]}

       onSelect={(option) => {
        setAnswers((prev) => ({
          ...prev,
          [currentQuestion]: option,
        }));

        // check if all answered AFTER this selection
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


          {showWarning && (
  <p className="text-red-500 font-semibold mb-2">
    ⚠ You have unanswered questions
  </p>
)}


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
  const hasUnanswered = questions.some((_, i) => answers[i] === undefined);

  // first click → show warning
  if (hasUnanswered && !warningDisplayed) {
    setShowWarning(true);
    setwarningDisplayed(true);
    return;
  }

  // second click OR no unanswered → submit
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
    warningDisplayed ? "bg-red-500 text-white" : "bg-[#9fd200]"
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
  );
}

export default Exam;