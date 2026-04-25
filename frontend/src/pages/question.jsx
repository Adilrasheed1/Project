function Question({ question, options, selectedAnswer, onSelect }) {
  return (
    <div className="w-full max-w-xl mx-auto mt-6">

      {/* Question */}
      <h2 className="text-xl font-semibold mb-4 text-center">
        {question}
      </h2>

      {/* Options */}
      <div className="flex flex-col gap-3">

        {options.map((option) => {
          const isSelected = selectedAnswer === option;

          return (
            <div
              key={option}
              onClick={() => onSelect(option)}
              className={`p-3 rounded-lg cursor-pointer border transition text-center
                ${
                  isSelected
                    ? "bg-[#165ee7] text-white border-[#165ee7]"
                    : "bg-gray-100 hover:bg-gray-200 border-gray-300"
                }
              `}
            >
              {option}
            </div>
          );
        })}

      </div>
    </div>
  );
}

export default Question;