import { useState, useRef } from "react";
import "./Quiz.css";
import { data } from "../../assets/data";

const Quiz = () => {
  let [index, setIndex] = useState(0);
  let [question, setQuestion] = useState(data[0]);
  let [lock, setLock] = useState(false);
  let [score, setScore] = useState(0);
  let [result, setResult] = useState(false);
  let [name, setName] = useState("");
  let [hasStarted, setHasStarted] = useState(false);

  let Option1 = useRef(null);
  let Option2 = useRef(null);
  let Option3 = useRef(null);
  let Option4 = useRef(null);

  let option_array = [Option1, Option2, Option3, Option4];

  const checkAns = (e, ans) => {
  if (!lock) {
    if (question.ans === ans) {
      e.target.classList.add("correct");
      setScore((prev) => prev + 1);
    } else {
      e.target.classList.add("wrong");
      if (
        typeof question.ans === "number" &&
        question.ans >= 1 &&
        question.ans <= 4
      ) {
        option_array[question.ans - 1].current.classList.add("correct");
      }
    }

    
    option_array.forEach((option) => {
      option.current.classList.add("disabled");
    });

    setLock(true);
  }
};

const next = () => {
  if (lock) {
    if (index === data.length - 1) {
      setResult(true);
      return;
    }

    const newIndex = index + 1;
    if (newIndex < data.length) {
      setIndex(newIndex);
      setQuestion(data[newIndex]);
      setLock(false);

      option_array.forEach((option) => {
        option.current.classList.remove("correct", "wrong", "disabled");
      });
    }
  }
};

  const reset = () => {
    setIndex(0);
    setQuestion(data[0]);
    setLock(false);
    setScore(0);
    setResult(false);
    setHasStarted(false); 
    setName("");
  };

  const startQuiz = () => {
    if (name.trim() !== "") {
      setHasStarted(true);
    } else {
      alert("Please enter your name to start the quiz.");
    }
  };

  return (
    <div className="container">
      <h1>Kingsley Quiz App</h1>
      <hr />

      
      {!hasStarted ? (
        <div className="welcome-screen">
          <h2>Welcome to my Quiz App</h2>
          <p>Please enter your name to start:</p>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                startQuiz();
              }
            }}
          />
          <button onClick={startQuiz}>Start Quiz</button>
        </div>
      ) : (
        <>
          
          {result ? (
            <>
              <h2>
                {name} <br /> You scored {score} out of {data.length} 
              </h2>
              <button onClick={reset}>Reset</button>
            </>
          ) : (
            <>
              <h2>
                {index + 1}. {question.question}
              </h2>
              <ul>
                <li ref={Option1} onClick={(e) => checkAns(e, 1)}>
                  {question.option1}
                </li>
                <li ref={Option2} onClick={(e) => checkAns(e, 2)}>
                  {question.option2}
                </li>
                <li ref={Option3} onClick={(e) => checkAns(e, 3)}>
                  {question.option3}
                </li>
                <li ref={Option4} onClick={(e) => checkAns(e, 4)}>
                  {question.option4}
                </li>
              </ul>
              <button onClick={next}>Next</button>
              <div className="index">
                {index + 1} of {data.length} questions
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Quiz;
