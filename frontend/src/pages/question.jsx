function Question({ question, options, selectedAnswer, onSelect }) {
  return (
    <div className="w-full">

      {/* Question */}
      <h2 className="text-xl font-semibold mb-6">
        {question}
      </h2>

      {/* Options */}
      <div className="flex flex-col gap-4">
        {options.map((option) => {
          const isSelected = selectedAnswer === option;

          return (
            <div
              key={option}
              onClick={() => onSelect(option)}
              className={`p-4 rounded-xl cursor-pointer border transition
                ${
                  isSelected
                    ? "bg-[#165ee7] text-white border-[#165ee7]"
                    : "bg-white hover:bg-gray-100 border-gray-300"
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