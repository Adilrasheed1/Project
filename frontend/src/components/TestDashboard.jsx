import { useState, useEffect } from "react";
import ExamCard from "./ExamCard";
import { IndianRupee, Cctv } from "lucide-react";

const API_URL = "http://localhost:3000/exam";

function TestDashboard({ setSelectedExam }) {

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── FETCH EXAMS ON LOAD ──
  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setExams(data);
    } catch (err) {
      console.error("Failed to fetch exams:", err);
    } finally {
      setLoading(false);
    }
  };

  // ── SPLIT EXAMS BY TYPE ──
  const normalExams = exams.filter((exam) => exam.type === "normal");
  const proctoredExams = exams.filter((exam) => exam.type === "proctored");

  return (
    <div className="max-w-5xl mx-auto">

      <h2 className="text-5xl mt-5 font-extrabold tracking-wider text-center">
        PRACTICE MAKES YOU PERFECT
      </h2>

      {loading && (
        <p className="text-center text-gray-400 mt-10">Loading exams...</p>
      )}

      {/* ── FREE MOCK TESTS (NORMAL) ── */}
      {!loading && (
        <>
          <div className="max-w-60 h-10 m-4 flex rounded-3xl bg-[#9fd200] text-white items-center font-serif">
            <IndianRupee
              size={28}
              color="black"
              className="bg-white rounded-3xl p-1 ml-1"
            />
            <h4 className="text-sm px-2 font-bold">FREE MOCK TESTS</h4>
          </div>

          <div className="bg-[#eeeff1] rounded-3xl p-4 md:p-6 mt-4 mb-6">
            {normalExams.length === 0 ? (
              <p className="text-center text-gray-400 py-6">
                No normal exams available yet.
              </p>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6 justify-items-center">
                {normalExams.map((exam) => (
                  <ExamCard
                    key={exam._id}
                    title={exam.name}
                    color={exam.color}
                    subject={exam.subject}
                    onClick={() => setSelectedExam(exam)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── PROCTORED TESTS ── */}
          <div className="max-w-60 h-10 m-4 flex rounded-3xl bg-[#165EE7] text-white items-center font-serif">
            <Cctv
              size={28}
              color="black"
              className="bg-white rounded-3xl p-1 ml-1"
            />
            <h4 className="text-sm px-2 font-bold">PROCTORED TESTS</h4>
          </div>

          <div className="bg-[#eeeff1] rounded-3xl p-4 md:p-6 mt-4 mb-6">
            {proctoredExams.length === 0 ? (
              <p className="text-center text-gray-400 py-6">
                No proctored exams available yet.
              </p>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(360px,1fr))] gap-6 justify-items-center">
                {proctoredExams.map((exam) => (
                  <ExamCard
                    key={exam._id}
                    title={exam.name}
                    color={exam.color}
                    subject={exam.subject}
                    onClick={() => setSelectedExam(exam)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
}

export default TestDashboard;