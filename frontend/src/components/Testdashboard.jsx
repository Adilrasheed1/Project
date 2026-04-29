import ExamCard from "./ExamCard";
import { IndianRupee, Cctv } from "lucide-react";

function TestDashboard({ setSelectedExam }) {
  return (
    <div className="max-w-5xl mx-auto">

      <h2 className="text-5xl mt-5 font-extrabold tracking-wider text-center">
        PRACTICE MAKES YOU PERFECT
      </h2>

      {/* FREE MOCK TESTS */}
      <div className="max-w-60 h-10 m-4 flex rounded-3xl bg-[#9fd200] text-white items-center font-serif">
        <IndianRupee
          size={28}
          color="black"
          className="bg-white rounded-3xl p-1 ml-1"
        />
        <h4 className="text-sm px-2 font-bold">FREE MOCK TESTS</h4>
      </div>

      <div className="bg-[#eeeff1] rounded-3xl p-4 md:p-6 mt-4 mb-6">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6 justify-items-center">

          <ExamCard
            title="MOCK TEST 1"
            color="#F64515"
            onClick={() =>
              setSelectedExam({
                id: 1,
                name: "MOCK TEST 1",
                type: "normal",
              })
            }
          />

          <ExamCard
            title="MOCK TEST 2"
            color="#165ee7"
            onClick={() =>
              setSelectedExam({
                id: 2,
                name: "MOCK TEST 2",
                type: "normal",
              })
            }
          />

          <ExamCard
            title="MOCK TEST 3"
            color="#9fd200"
            onClick={() =>
              setSelectedExam({
                id: 3,
                name: "MOCK TEST 3",
                type: "normal",
              })
            }
          />

          <ExamCard
            title="MOCK TEST 4"
            color="black"
            onClick={() =>
              setSelectedExam({
                id: 4,
                name: "MOCK TEST 4",
                type: "normal",
              })
            }
          />

        </div>
      </div>

      {/* PROCTORED TESTS */}
      <div className="max-w-60 h-10 m-4 flex rounded-3xl bg-[#165EE7] text-white items-center font-serif">
        <Cctv
          size={28}
          color="black"
          className="bg-white rounded-3xl p-1 ml-1"
        />
        <h4 className="text-sm px-2 font-bold">PROCTORED TESTS</h4>
      </div>

      <div className="bg-[#eeeff1] rounded-3xl p-4 md:p-6 mt-4 mb-6">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(360px,1fr))] gap-6 justify-items-center">

          <ExamCard
            title="MOCK TEST 5"
            color="#F64515"
            onClick={() =>
              setSelectedExam({
                id: 5,
                name: "MOCK TEST 5",
                type: "proctored",
              })
            }
          />

          <ExamCard
            title="MOCK TEST 6"
            color="#165ee7"
            onClick={() =>
              setSelectedExam({
                id: 6,
                name: "MOCK TEST 6",
                type: "proctored",
              })
            }
          />

          <ExamCard
            title="MOCK TEST 7"
            color="#9fd200"
            onClick={() =>
              setSelectedExam({
                id: 7,
                name: "MOCK TEST 7",
                type: "proctored",
              })
            }
          />

          <ExamCard
            title="MOCK TEST 8"
            color="black"
            onClick={() =>
              setSelectedExam({
                id: 8,
                name: "MOCK TEST 8",
                type: "proctored",
              })
            }
          />

        </div>
      </div>

    </div>
  );
}

export default TestDashboard;