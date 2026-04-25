import ExamCard from "./examcard";

function TestDashboard({ setSelectedExam }) {
  return (
    <div className="max-w-5xl mx-auto">

      <h2 className="text-5xl mt-5 font-extrabold tracking-wider">
        PRACTICE MAKES YOU PERFECT
      </h2>

      {/* SECTION 1 */}
      <div className="bg-[#eeeff1] rounded-3xl p-4 md:p-6 mt-4">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 justify-items-center">

          <ExamCard title="MOCK TEST 1" color="#F64515"
            onClick={() => setSelectedExam("MOCK TEST 1")} />

          <ExamCard title="MOCK TEST 2" color="#165ee7"
            onClick={() => setSelectedExam("MOCK TEST 2")} />

          <ExamCard title="MOCK TEST 3" color="#9fd200"
            onClick={() => setSelectedExam("MOCK TEST 3")} />

          <ExamCard title="MOCK TEST 4" color="black"
            onClick={() => setSelectedExam("MOCK TEST 4")} />

        </div>
      </div>

      {/* SECTION 2 */}
      <div className="bg-[#eeeff1] rounded-3xl p-4 md:p-6 mt-6">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 justify-items-center">

          <ExamCard title="MOCK TEST 5" color="#F64515"
            onClick={() => setSelectedExam("MOCK TEST 5")} />

          <ExamCard title="MOCK TEST 6" color="#165ee7"
            onClick={() => setSelectedExam("MOCK TEST 6")} />

          <ExamCard title="MOCK TEST 7" color="#9fd200"
            onClick={() => setSelectedExam("MOCK TEST 7")} />

          <ExamCard title="MOCK TEST 8" color="black"
            onClick={() => setSelectedExam("MOCK TEST 8")} />

        </div>
      </div>

    </div>
  );
}

export default TestDashboard;