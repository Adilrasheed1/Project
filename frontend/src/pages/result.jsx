import { X,Check,OctagonX } from "lucide-react";
function Result({ score, questions, answers, resetExam, onBack }) {

  // -------------------------
  // 📊 Calculate stats
  // -------------------------
  let correct = 0;
  let wrong = 0;
  let unanswered = 0;

  questions.forEach((q, i) => {
    if (answers[i] === undefined) {
      unanswered++;
    } else if (answers[i] === q.answer) {
      correct++;
    } else {
      wrong++;
    }
  });

  // -------------------------
  // 🎨 Helper for option color
  // -------------------------
  const getOptionStyle = (option, q, index) => {
    if (option === q.answer) {
      return "bg-[#9fd200a1]"; // correct answer
    }
    if (answers[index] === option) {
      return "bg-[#F64515a1]"; // wrong selected
    }
    return "bg-gray-100"; // default
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-white relative">

      <div className="w-full max-w-4xl p-6">

        {/* ❌ CLOSE BUTTON */}
        <button
          onClick={() => {
            resetExam();
            onBack();
          }}
          className="absolute top-5 right-5 "
        >
          ❌
        </button>

        {/* -------------------------
            🧾 RESULT CARD
        ------------------------- */}
        <div className="bg-[#eeeff1] rounded-3xl shadow-lg p-6 md:p-10">

          <h2 className="text-4xl font-extrabold mb-6 text-center">
            Your Result
          </h2>

          {/* 🎯 SCORE BOX */}
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-2xl px-8 py-6 shadow-md text-center">
              <p className="text-lg text-gray-500">Score</p>
              <h3 className="text-4xl font-bold text-[#165ee7]">
                {score} / {questions.length * 10}
              </h3>
            </div>
          </div>



          {/* 📊 STATS*/}
          <div className="flex justify-center items-center gap-6 text-lg bg-white shadow-lg rounded-2xl font-semibold mb-6">

           <p className="flex items-center gap-2 text-[#9fd200]">
                <Check size={20}/> Correct: {correct}
              </p>

              <p className="flex items-center gap-2 text-[#F64515]">
                <X size={20}/> Wrong: {wrong}
              </p>

              <p className="flex items-center gap-2 text-black">
                <OctagonX size={20}/> Unanswered: {unanswered}
              </p>
          </div>
        </div>



        {/* -------------------------
            📚 QUESTION BREAKDOWN
        ------------------------- */}
        <div className="mt-8 space-y-6">

          {questions.map((q, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-md">

              {/* Question */}
              <p className="font-semibold mb-3">
                {i + 1}. {q.question}
              </p>


              <div className="text-sm mb-3 flex gap-6">

                    <p>
                      <span className="font-semibold">Your Answer:</span>{" "}
                      {answers[i] ?? "Not Answered"}
                    </p>

                    <p>
                      <span className="font-semibold">Correct Answer:</span>{" "}
                      {q.answer}
                    </p>

                  </div>




              {/* Options */}
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