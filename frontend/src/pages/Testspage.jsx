import { useState } from "react";
import TestDashboard from "../components/TestDashboard";
import Exam from "./exam";

function TestsPage() {
  const [selectedExam, setSelectedExam] = useState(null);

  if (selectedExam) {
    return (
      <Exam
        exam={selectedExam}
        onBack={() => setSelectedExam(null)}
      />
    );
  }

  return <TestDashboard setSelectedExam={setSelectedExam} />;
}

export default TestsPage;