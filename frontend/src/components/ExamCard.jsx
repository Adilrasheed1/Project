import {
  Monitor,
  BarChart2,
  Brain,
  Calculator,
  Microscope,
  BookOpen,
  Briefcase,
  Palette,
  FileText
} from "lucide-react";

// ── SUBJECT → ICON MAP ────────────────────────────
const subjectMap = {
  "Full Stack":   Monitor,
  "Data Science": BarChart2,
  "AI / ML":      Brain,
  "Mathematics":  Calculator,
  "Science":      Microscope,
  "English":      BookOpen,
  "Business":     Briefcase,
  "Design":       Palette,
  "General":      FileText,
};

function ExamCard({ title, color, subject = "General", onClick }) {

  // get icon component for this subject
  // if subject not in map → fallback to FileText
  const IconComponent = subjectMap[subject] ?? FileText;

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
        <div className="h-10 w-10 flex items-center justify-center bg-white rounded-full">
          <IconComponent size={20} color="black" />
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