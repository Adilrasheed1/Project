const subjectMap = {
  "Full Stack":   "🖥️",
  "Data Science": "📊",
  "AI / ML":      "🤖",
  "Mathematics":  "📐",
  "Science":      "🔬",
  "English":      "📖",
  "Business":     "💼",
  "Design":       "🎨",
  "General":      "📝",
};

function ExamCard({ title, color, subject = "General", onClick }) {

  // Look up emoji for this subject, fallback to 📝
  const icon = subjectMap[subject] ?? "📝";

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer 
                 hover:shadow-lg hover:scale-105 transition duration-200 
                 w-full max-w-[400px]"
    >

      {/* TOP BAR */}
      <div
        style={{ backgroundColor: color }}
        className="h-20 flex items-center gap-3 px-3"
      >
        {/* ICON CIRCLE */}
        <div className="h-10 w-10 flex items-center justify-center bg-white rounded-full text-xl">
          {icon}
        </div>

        {/* SUBJECT NAME */}
        <h3 className="text-white tracking-wider text-xl font-bold">
          {subject}
        </h3>
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-2xl font-bold tracking-wide">
          {title}
        </h3>
        <p className="text-sm text-gray-500">
          Click to start this exam
        </p>
      </div>

      {/* BOTTOM BAR */}
      <div
        style={{ backgroundColor: color }}
        className="h-6"
      />

    </div>
  );
}

export default ExamCard;