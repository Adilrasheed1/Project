import {
  Monitor,
  BarChart2,
  Brain,
  Calculator,
  Microscope,
  BookOpen,
  Briefcase,
  Palette,
  FileText,
  Trophy,
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

// bestScore: number (e.g. 85) if the student has attempted this exam before,
// or null/undefined if they haven't. Parent component (TestDashboard) is
// responsible for figuring this out and passing it in — ExamCard just displays it.
function ExamCard({ title, color, subject = "General", bestScore = null, onClick }) {

  // get icon component for this subject
  // if subject not in map → fallback to FileText
  const IconComponent = subjectMap[subject] ?? FileText;

  // has the student attempted this exam at least once?
  const hasAttempted = bestScore !== null && bestScore !== undefined;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer
                 hover:shadow-lg hover:scale-105 transition duration-200
                 w-full max-w-[400px] relative self-start h-fit"
    >

      {/* BEST SCORE BADGE — only renders if the exam has been attempted.
          Positioned absolute so it floats over the top-right corner
          without disturbing the existing layout below it. */}
      {hasAttempted && (
        <div
          className="absolute top-3 right-3 z-10 flex items-center gap-1
                     bg-white/95 px-2.5 py-1 rounded-full shadow-md"
        >
          <Trophy size={14} color="#9fd200" />
          <span className="text-xs font-bold text-gray-700">
            Best: {bestScore}%
          </span>
        </div>
      )}

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
          {hasAttempted ? "Click to retry this exam" : "Click to start this exam"}
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