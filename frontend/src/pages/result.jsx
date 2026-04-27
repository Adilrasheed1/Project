function Result({ score, questions, answers, resetExam, onBack }) {

  let resultUI = [];
  let correct = 0;
  let wrong = 0;
  let unanswered = 0;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];

    if (answers[i] === undefined) {
      unanswered++;
    } else if (answers[i] === q.answer) {
      correct++;
    } else {
      wrong++;
    }

    let optionsUI = [];

    for (let j = 0; j < q.options.length; j++) {
      const option = q.options[j];

      let bgColor = "#eeeff1";

      if (option === q.answer) {
        bgColor = "#9fd200";
      } else if (answers[i] === option) {
        bgColor = "#f64515";
      }

      optionsUI.push(
        <p key={option} style={{ backgroundColor: bgColor, padding: "5px" }}>
          {option}
        </p>
      );
    }

    resultUI.push(
      <div key={i} style={{ marginBottom: "20px" }}>
        <p>{q.question}</p>
        {optionsUI}
      </div>
    );
  }

  return (
    <div style={{ margin: "10px", position: "relative" }}>

      {/* CLOSE BUTTON */}
      <button
        onClick={() => {
          resetExam();
          onBack();
        }}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          padding: "10px",
          cursor: "pointer"
        }}
      >
        ❌
      </button>

      <h2>Result</h2>

      {resultUI}

      <h3>Your Score: {score} / {questions.length * 10}</h3>

      <p>Correct: {correct}</p>
      <p>Wrong: {wrong}</p>
      <p>Unanswered: {unanswered}</p>

      {/* DASHBOARD BUTTON */}
      <button
        onClick={() => {
          resetExam();
          onBack();
        }}
        style={{
          position: "absolute",
          bottom: "5px",
          right: "0px",
          padding: "10px",
          cursor: "pointer",
          border: "none",
          borderRadius: "10px",
          backgroundColor: "#165ee7",
          fontFamily: "bebas neue",
          fontSize: "3vh",
          color: "white"
        }}
      >
        Visit Dashboard
      </button>

    </div>
  );
}

export default Result;