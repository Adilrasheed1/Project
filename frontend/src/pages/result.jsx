import { X, Check, OctagonX } from "lucide-react";
import { useState } from "react";

function Result({ score, examScore, integrityScore, examType, violations, questions, answers, resetExam, onBack }) {

  const [showViolations, setShowViolations] = useState(false);

  let correct = 0;
  let wrong = 0;
  let unanswered = 0;

  questions.forEach((q, i) => {
    if (answers[i] === null) unanswered++;
    else if (answers[i] === q.answer) correct++;
    else wrong++;
  });

  const getOptionStyle = (option, q, index) => {
    if (option === q.answer) return "bg-[#9fd200a1]";
    if (answers[index] === option) return "bg-[#F64515a1]";
    return "bg-gray-100";
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-white relative">
      <div className="w-full max-w-4xl p-6">

        {/* CLOSE */}
        <button
          onClick={() => { resetExam(); onBack(); }}
          className="absolute top-5 right-5 text-xl"
        >
          ❌
        </button>

        {/* RESULT CARD */}
        <div className="bg-[#eeeff1] rounded-3xl shadow-lg p-6 md:p-10">

          <h2 className="text-4xl font-extrabold mb-6 text-center">
            Your Result
          </h2>

          {/* SCORES */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">

            {/* EXAM SCORE — always shown */}
            <div className="bg-white rounded-2xl px-8 py-6 shadow-md text-center">
              <p className="text-lg text-gray-500">Exam Score</p>
              <h3 className="text-4xl font-bold text-[#165ee7]">
                {examScore} / {questions.length * 10}
              </h3>
            </div>

            {/* INTEGRITY + FINAL SCORE — proctored only */}
            {examType === "proctored" && (
              <>
                <div className="bg-white rounded-2xl px-8 py-6 shadow-md text-center">
                  <p className="text-lg text-gray-500">Integrity Score</p>
                  <h3 className="text-4xl font-bold text-orange-400">
                    {integrityScore} / 100
                  </h3>
                </div>

                <div className="bg-white rounded-2xl px-8 py-6 shadow-md text-center">
                  <p className="text-lg text-gray-500">Final Score</p>
                  <h3 className="text-4xl font-bold text-[#9fd200]">
                    {score}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    (Exam + Integrity) / 2
                  </p>
                </div>
              </>
            )}

          </div>

          {/* STATS */}
          <div className="flex justify-center gap-6 text-lg bg-white shadow-lg rounded-2xl font-semibold mb-6 p-4">
            <p className="flex items-center gap-2 text-[#9fd200]">
              <Check size={20}/> CORRECT {correct}
            </p>
            <p className="flex items-center gap-2 text-[#F64515]">
              <X size={20}/> WRONG {wrong}
            </p>
            <p className="flex items-center gap-2">
              <OctagonX size={20}/> UNANSWERED {unanswered}
            </p>
          </div>

          {/* VIOLATIONS LOG — proctored only */}
          {examType === "proctored" && (
            <div className="mb-6">
              <button
                onClick={() => setShowViolations(!showViolations)}
                className="w-full py-3 bg-white border-2 border-red-400 text-red-500 font-bold rounded-2xl"
              >
                {showViolations ? "Hide Integrity Deductions" : "Check Integrity Deductions"}
              </button>

              {showViolations && (
                <div className="mt-4 bg-white rounded-2xl p-4 flex flex-col gap-3">
                  {violations.length === 0 ? (
                    <p className="text-center text-green-500 font-semibold">
                      ✅ No violations detected. Perfect integrity!
                    </p>
                  ) : (
                    violations.map((v, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-3 bg-red-50 rounded-xl border border-red-200"
                      >
                        <div>
                          <p className="font-semibold text-red-500">{v.type}</p>
                          <p className="text-sm text-gray-500">{v.time}</p>
                        </div>
                        <p className="font-bold text-red-500">-{v.deduction}%</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

        </div>

        {/* QUESTIONS REVIEW */}
        <div className="mt-8 space-y-6">
          {questions.map((q, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-md">

              <p className="font-semibold mb-3">
                {i + 1}. {q.question}
              </p>

              <div className="text-sm mb-3 flex gap-6">
                <p><span className="font-semibold">Your:</span> {answers[i] ?? "Not Answered"}</p>
                <p><span className="font-semibold">Correct:</span> {q.answer}</p>
              </div>

              <div className="flex flex-col gap-2">
                {q.options.map((option) => (
                  <p
                    key={option}
                    className={`${getOptionStyle(option, q, i)} px-3 py-2 rounded`}
                  >
                    {option}
                  </p>
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Result;