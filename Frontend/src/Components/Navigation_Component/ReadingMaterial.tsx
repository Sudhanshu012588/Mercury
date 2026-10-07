import { useState } from "react";

interface Question {
  question: string;
  options: string[];
  correct_answer: string; // "A", "B", etc.
  explanation: string;
}

interface ModuleType {
  module_number: number;
  title: string;
  description: string;
  coverage_source_text_range: string;
  test: {
    instructions: string;
    questions: Question[];
  };
}

interface Props {
  modules: ModuleType[];
}

const ReadingMaterial = ({ modules }: Props) => {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [showTest, setShowTest] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentModule = modules[currentModuleIndex];
  const questions = currentModule.test.questions;
  const question = questions[currentQuestionIndex];

  const resetTestState = () => {
    setCurrentQuestionIndex(0);
    setSelected(null);
    setFeedback(null);
  };

  const handleAnswer = (option: string) => {
    if (feedback) return;

    setSelected(option);

    const selectedLetter = option.trim().charAt(0);
    const correctLetter = question.correct_answer.trim();

    if (selectedLetter === correctLetter) {
      setFeedback(`Correct!\n${question.explanation}`);
    } else {
      setFeedback(
        `Wrong.\nCorrect Answer: ${correctLetter}\n${question.explanation}`
      );
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelected(null);
      setFeedback(null);
    } else {
      // Test finished
      setShowTest(false);
      resetTestState();
    }
  };

  const nextModule = () => {
    if (currentModuleIndex < modules.length - 1) {
      setCurrentModuleIndex((prev) => prev + 1);
      setShowTest(false);
      resetTestState();
    }
  };

  const prevModule = () => {
    if (currentModuleIndex > 0) {
      setCurrentModuleIndex((prev) => prev - 1);
      setShowTest(false);
      resetTestState();
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Module {currentModule.module_number}: {currentModule.title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {currentModule.coverage_source_text_range}
        </p>
      </div>

      {/* Reading Section */}
      {!showTest && (
        <>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {currentModule.description}
          </p>

          <button
            onClick={() => setShowTest(true)}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Start Test ({questions.length} Questions)
          </button>
        </>
      )}

      {/* Test Section */}
      {showTest && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2 text-gray-900 dark:text-white">
            {currentModule.test.instructions}
          </h2>

          <p className="text-sm mb-2 text-gray-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>

          <p className="font-medium mb-4 text-gray-900 dark:text-white">
            {question.question}
          </p>

          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={!!feedback}
                className={`w-full text-left p-3 border rounded-lg transition
                  ${
                    selected === option
                      ? "bg-blue-100 dark:bg-gray-700 border-blue-500"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
              >
                {option}
              </button>
            ))}
          </div>

          {feedback && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg whitespace-pre-line">
              {feedback}
            </div>
          )}

          {feedback && (
            <button
              onClick={nextQuestion}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              {currentQuestionIndex < questions.length - 1
                ? "Next Question"
                : "Finish Test"}
            </button>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={prevModule}
          disabled={currentModuleIndex === 0}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg disabled:opacity-40"
        >
          Previous Module
        </button>

        <button
          onClick={nextModule}
          disabled={currentModuleIndex === modules.length - 1}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-40"
        >
          Next Module
        </button>
      </div>
    </div>
  );
};

export default ReadingMaterial;
