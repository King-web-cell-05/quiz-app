import { useCallback, useEffect, useMemo, useState } from "react";
import "./Quiz.css";
import { data } from "../../assets/data";

const QUESTION_TIME = 30;

const Quiz = () => {
  const [quizState, setQuizState] = useState("welcome");
  const [name, setName] = useState("");

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);

  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  const currentQuestion = questions[currentIndex];

  const progress = useMemo(() => {
    if (!questions.length) return 0;

    return ((currentIndex + 1) / questions.length) * 100;
  }, [currentIndex, questions.length]);

  const percentage = useMemo(() => {
    if (!questions.length) return 0;

    return Math.round((score / questions.length) * 100);
  }, [score, questions.length]);

  const performanceMessage = useMemo(() => {
    if (percentage >= 90) {
      return {
        title: "Outstanding Performance!",
        description:
          "Excellent work. You demonstrated a very strong understanding of the questions.",
        icon: "🏆",
      };
    }

    if (percentage >= 75) {
      return {
        title: "Great Job!",
        description:
          "You performed very well. Keep building on what you already know.",
        icon: "🎯",
      };
    }

    if (percentage >= 50) {
      return {
        title: "Good Effort!",
        description:
          "You have a solid foundation. A little more practice can take you further.",
        icon: "👏",
      };
    }

    return {
      title: "Keep Practicing!",
      description:
        "Review the topics and try the quiz again to improve your score.",
      icon: "📚",
    };
  }, [percentage]);

  const startQuiz = () => {
    if (!name.trim()) return;

    setQuestions([...data]);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setAnsweredQuestions([]);
    setTimeLeft(QUESTION_TIME);
    setQuizState("playing");
  };

  const selectAnswer = useCallback(
    (answer) => {
      if (selectedAnswer !== null || !currentQuestion) return;

      setSelectedAnswer(answer);

      if (answer === currentQuestion.ans) {
        setScore((previousScore) => previousScore + 1);
      }

      setAnsweredQuestions((previous) => [
        ...previous,
        {
          question: currentIndex,
          selected: answer,
          correct: currentQuestion.ans,
        },
      ]);
    },
    [selectedAnswer, currentQuestion, currentIndex]
  );

  const nextQuestion = useCallback(() => {
    if (selectedAnswer === null) return;

    if (currentIndex === questions.length - 1) {
      setQuizState("result");
      return;
    }

    setCurrentIndex((previousIndex) => previousIndex + 1);
    setSelectedAnswer(null);
    setTimeLeft(QUESTION_TIME);
  }, [selectedAnswer, currentIndex, questions.length]);

  const skipQuestion = () => {
    if (selectedAnswer !== null) return;

    setAnsweredQuestions((previous) => [
      ...previous,
      {
        question: currentIndex,
        selected: null,
        correct: currentQuestion.ans,
      },
    ]);

    if (currentIndex === questions.length - 1) {
      setQuizState("result");
      return;
    }

    setCurrentIndex((previousIndex) => previousIndex + 1);
    setTimeLeft(QUESTION_TIME);
  };

  const restartQuiz = () => {
    setQuestions([...data]);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setAnsweredQuestions([]);
    setTimeLeft(QUESTION_TIME);
    setQuizState("playing");
  };

  const resetQuiz = () => {
    setQuizState("welcome");
    setName("");
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimeLeft(QUESTION_TIME);
    setAnsweredQuestions([]);
  };

  /*
   * Countdown timer
   */
  useEffect(() => {
    if (quizState !== "playing" || selectedAnswer !== null) {
      return;
    }

    if (timeLeft <= 0) {
      setSelectedAnswer(0);

      setAnsweredQuestions((previous) => [
        ...previous,
        {
          question: currentIndex,
          selected: null,
          correct: currentQuestion?.ans,
          timedOut: true,
        },
      ]);

      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previousTime) => previousTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [
    quizState,
    selectedAnswer,
    timeLeft,
    currentIndex,
    currentQuestion,
  ]);

  /*
   * Automatically move to the next question after timeout.
   */
  useEffect(() => {
    if (
      quizState === "playing" &&
      timeLeft === 0 &&
      selectedAnswer === 0
    ) {
      const timeout = setTimeout(() => {
        if (currentIndex === questions.length - 1) {
          setQuizState("result");
        } else {
          setCurrentIndex((previousIndex) => previousIndex + 1);
          setSelectedAnswer(null);
          setTimeLeft(QUESTION_TIME);
        }
      }, 1200);

      return () => clearTimeout(timeout);
    }
  }, [
    timeLeft,
    selectedAnswer,
    quizState,
    currentIndex,
    questions.length,
  ]);

  /*
   * Keyboard controls
   */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (quizState !== "playing") return;

      if (selectedAnswer === null) {
        if (event.key === "1") selectAnswer(1);
        if (event.key === "2") selectAnswer(2);
        if (event.key === "3") selectAnswer(3);
        if (event.key === "4") selectAnswer(4);
      }

      if (event.key === "Enter" && selectedAnswer !== null) {
        nextQuestion();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [quizState, selectedAnswer, selectAnswer, nextQuestion]);

  const getOptionClass = (optionNumber) => {
    if (selectedAnswer === null) return "";

    if (optionNumber === currentQuestion.ans) {
      return "correct";
    }

    if (
      optionNumber === selectedAnswer &&
      selectedAnswer !== currentQuestion.ans
    ) {
      return "wrong";
    }

    return "disabled";
  };

  const timerPercentage = (timeLeft / QUESTION_TIME) * 100;

  /*
   * WELCOME SCREEN
   */
  if (quizState === "welcome") {
    return (
      <main className="quiz-page">
        <section className="quiz-shell welcome-shell">
          <div className="brand">
            <div className="brand-icon">K</div>

            <div>
              <span>KINGSLEY</span>
              <strong>QUIZ</strong>
            </div>
          </div>

          <div className="welcome-content">
            <div className="welcome-badge">
              <span className="status-dot"></span>
              Interactive Knowledge Challenge
            </div>

            <h1>
              Test your knowledge.
              <span>Challenge yourself.</span>
            </h1>

            <p>
              Answer each question carefully, manage your time, and see how
              well you perform at the end of the challenge.
            </p>

            <div className="quiz-features">
              <div className="feature-card">
                <span>⏱</span>
                <div>
                  <strong>Timed Questions</strong>
                  <small>{QUESTION_TIME} seconds each</small>
                </div>
              </div>

              <div className="feature-card">
                <span>🎯</span>
                <div>
                  <strong>Instant Feedback</strong>
                  <small>See your answer results</small>
                </div>
              </div>

              <div className="feature-card">
                <span>📊</span>
                <div>
                  <strong>Performance Report</strong>
                  <small>Get your final score</small>
                </div>
              </div>
            </div>

            <div className="name-form">
              <label htmlFor="quiz-name">Enter your name</label>

              <input
                id="quiz-name"
                type="text"
                placeholder="e.g. Kingsley Dada"
                value={name}
                maxLength={40}
                onChange={(event) => setName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    startQuiz();
                  }
                }}
              />

              <button
                className="primary-button start-button"
                onClick={startQuiz}
                disabled={!name.trim()}
              >
                Start Quiz
                <span>→</span>
              </button>
            </div>
          </div>

          <div className="welcome-footer">
            <span>{data.length} Questions</span>
            <span>•</span>
            <span>Multiple Choice</span>
            <span>•</span>
            <span>Instant Results</span>
          </div>
        </section>
      </main>
    );
  }

  /*
   * RESULT SCREEN
   */
  if (quizState === "result") {
    return (
      <main className="quiz-page">
        <section className="quiz-shell result-shell">
          <div className="result-header">
            <div className="result-icon">{performanceMessage.icon}</div>

            <span className="result-label">QUIZ COMPLETED</span>

            <h1>{performanceMessage.title}</h1>

            <p>
              Well done, <strong>{name}</strong>. Here is your performance
              summary.
            </p>
          </div>

          <div className="score-circle">
            <div className="score-inner">
              <strong>{percentage}%</strong>
              <span>Score</span>
            </div>
          </div>

          <div className="result-stats">
            <div className="result-stat">
              <span className="stat-icon">✓</span>
              <div>
                <strong>{score}</strong>
                <span>Correct</span>
              </div>
            </div>

            <div className="result-stat">
              <span className="stat-icon incorrect">×</span>
              <div>
                <strong>{questions.length - score}</strong>
                <span>Incorrect</span>
              </div>
            </div>

            <div className="result-stat">
              <span className="stat-icon">#</span>
              <div>
                <strong>{questions.length}</strong>
                <span>Total</span>
              </div>
            </div>
          </div>

          <div className="performance-message">
            <strong>Performance Summary</strong>
            <p>{performanceMessage.description}</p>
          </div>

          <div className="result-actions">
            <button className="primary-button" onClick={restartQuiz}>
              Try Again
              <span>↻</span>
            </button>

            <button className="secondary-button" onClick={resetQuiz}>
              Exit Quiz
            </button>
          </div>

          <div className="result-footer">
            {score} out of {questions.length} questions answered correctly
          </div>
        </section>
      </main>
    );
  }

  /*
   * QUIZ SCREEN
   */
  return (
    <main className="quiz-page">
      <section className="quiz-shell quiz-active-shell">
        <header className="quiz-header">
          <div className="brand">
            <div className="brand-icon small">K</div>

            <div>
              <span>KINGSLEY</span>
              <strong>QUIZ</strong>
            </div>
          </div>

          <div className="header-user">
            <div className="avatar">
              {name.charAt(0).toUpperCase()}
            </div>

            <div className="user-details">
              <span>Participant</span>
              <strong>{name}</strong>
            </div>
          </div>
        </header>

        <div className="quiz-progress-section">
          <div className="progress-info">
            <span>
              Question <strong>{currentIndex + 1}</strong> of{" "}
              <strong>{questions.length}</strong>
            </span>

            <span>{Math.round(progress)}% completed</span>
          </div>

          <div className="progress-track">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="quiz-meta">
          <div className="question-label">
            <span>QUESTION {String(currentIndex + 1).padStart(2, "0")}</span>
            <small>Choose one answer</small>
          </div>

          <div
            className={`timer ${
              timeLeft <= 10 ? "timer-warning" : ""
            }`}
          >
            <div className="timer-icon">◷</div>

            <div>
              <span>Time remaining</span>
              <strong>00:{String(timeLeft).padStart(2, "0")}</strong>
            </div>

            <div className="timer-progress">
              <div
                style={{ width: `${timerPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="question-area">
          <h1>{currentQuestion.question}</h1>
        </div>

        <div className="options-grid">
          {[1, 2, 3, 4].map((optionNumber) => {
            const optionText = currentQuestion[`option${optionNumber}`];

            return (
              <button
                key={optionNumber}
                className={`option-card ${getOptionClass(
                  optionNumber
                )}`}
                onClick={() => selectAnswer(optionNumber)}
                disabled={selectedAnswer !== null}
              >
                <span className="option-number">
                  {String.fromCharCode(64 + optionNumber)}
                </span>

                <span className="option-text">{optionText}</span>

                <span className="option-status">
                  {selectedAnswer !== null &&
                  optionNumber === currentQuestion.ans
                    ? "✓"
                    : selectedAnswer === optionNumber &&
                      selectedAnswer !== currentQuestion.ans
                    ? "×"
                    : ""}
                </span>
              </button>
            );
          })}
        </div>

        {selectedAnswer !== null && (
          <div
            className={`answer-feedback ${
              selectedAnswer === currentQuestion.ans
                ? "feedback-correct"
                : selectedAnswer === 0
                ? "feedback-timeout"
                : "feedback-wrong"
            }`}
          >
            <div className="feedback-icon">
              {selectedAnswer === currentQuestion.ans
                ? "✓"
                : selectedAnswer === 0
                ? "⏱"
                : "!"}
            </div>

            <div>
              <strong>
                {selectedAnswer === currentQuestion.ans
                  ? "Correct answer!"
                  : selectedAnswer === 0
                  ? "Time's up!"
                  : "Not quite right."}
              </strong>

              <span>
                {selectedAnswer === currentQuestion.ans
                  ? "Excellent. Keep going."
                  : selectedAnswer === 0
                  ? "The correct answer has been highlighted."
                  : "The correct answer has been highlighted above."}
              </span>
            </div>
          </div>
        )}

        <footer className="quiz-footer">
          <div className="keyboard-hint">
            <span>Keyboard:</span>
            <kbd>1</kbd>
            <kbd>2</kbd>
            <kbd>3</kbd>
            <kbd>4</kbd>
            <small>to answer</small>
          </div>

          <div className="quiz-actions">
            {selectedAnswer === null && (
              <button
                className="skip-button"
                onClick={skipQuestion}
              >
                Skip
              </button>
            )}

            <button
              className="primary-button next-button"
              onClick={nextQuestion}
              disabled={selectedAnswer === null}
            >
              {currentIndex === questions.length - 1
                ? "Finish Quiz"
                : "Next Question"}

              <span>→</span>
            </button>
          </div>
        </footer>

        <div className="quiz-bottom-info">
          <span>
            Current score: <strong>{score}</strong>
          </span>

          <span>
            {answeredQuestions.length} / {questions.length} answered
          </span>
        </div>
      </section>
    </main>
  );
};

export default Quiz;