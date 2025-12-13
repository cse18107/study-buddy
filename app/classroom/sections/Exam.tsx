import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Check, X, ChevronLeft, ChevronRight, Lightbulb} from "lucide-react";
import ThemedStopwatch from "@/components/ThemedStopwatch";

// Assuming the data is exported from the file above
import {threadQuizData} from "./threadQuizData";

// --- Component Definition ---

// Define colors for strict adherence
const BG_DARK = "bg-black";
const BG_MEDIUM = "bg-[#252525]";
const NEON_TEXT = "text-[#eeffab]";
const NEON_BORDER = "border-[#eeffab]";
const NEON_HOVER = "hover:bg-[#eeffab] hover:text-black";

const Exam = () => {
  const questions = threadQuizData.questions;

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  const currentQuestion = questions[activeQuestionIndex];

  const handleAnswerChange = (value: any) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.questionId]: value,
    });
  };

  const handleNext = () => {
    setShowAnswer(false);
    if (activeQuestionIndex < questions.length - 1) {
      setActiveQuestionIndex(activeQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    setShowAnswer(false);
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(activeQuestionIndex - 1);
    }
  };

  // --- Render Functions (Unchanged for Question Logic) ---

  const renderMCQ = () => (
    <div className="space-y-4">
      {currentQuestion.options!.map((option, index) => {
        const isSelected = userAnswers[currentQuestion.questionId] === index;
        const isCorrect =
          showAnswer && index === currentQuestion.correctOptionIndex;
        const isIncorrect =
          showAnswer &&
          isSelected &&
          index !== currentQuestion.correctOptionIndex;

        let optionClasses = `${BG_MEDIUM} text-white border border-[#252525] p-4 rounded-lg cursor-pointer transition-all duration-200`;

        if (showAnswer) {
          if (isCorrect) {
            optionClasses =
              "bg-[#eeffab] text-black border-2 border-black shadow-lg"; // Highlight correct answer
          } else if (isIncorrect) {
            optionClasses =
              "bg-black border-2 border-[#eeffab]/50 opacity-60 line-through"; // Dim incorrect choice
          } else if (isSelected) {
            optionClasses = `${BG_MEDIUM} ${NEON_BORDER} border-2 opacity-50`;
          }
        } else if (isSelected) {
          optionClasses = `bg-black ${NEON_BORDER} border-2`;
        } else {
          optionClasses += ` ${NEON_HOVER}`;
        }

        return (
          <div
            key={index}
            className={optionClasses}
            onClick={() => !showAnswer && handleAnswerChange(index)}
          >
            <span className="font-mono text-sm mr-4">
              {String.fromCharCode(65 + index)}.
            </span>
            {option}
            {isCorrect && (
              <Check className="w-5 h-5 ml-auto inline-block text-black" />
            )}
            {isIncorrect && (
              <X className="w-5 h-5 ml-auto inline-block text-[#eeffab]" />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderSAQLAQ = () => (
    <div>
      <Textarea
        placeholder="Type your explanation here..."
        rows={currentQuestion.type === "LAQ" ? 8 : 4}
        value={userAnswers[currentQuestion.questionId] || ""}
        onChange={(e) => handleAnswerChange(e.target.value)}
        disabled={showAnswer}
        className={`
          w-full ${BG_MEDIUM} text-white ${NEON_BORDER} border-2 p-4 rounded-lg
          placeholder-[#eeffab] placeholder-opacity-50 focus:border-[#eeffab] focus:ring-1 focus:ring-[#eeffab]
          resize-none
        `}
      />
    </div>
  );

  return (
    // Outer container for 70/30 split, spanning full height
    <div className={`flex w-full ${BG_DARK} min-h-screen`}>
      {/* --- 1. Quiz Content Area (70% Width) --- */}
      <div className="w-full overflow-y-auto">
        {/* Original Top Neon Bar */}
        <div className="w-full bg-[#eeffab] h-[30px]  mb-6"></div>

        {/* Header and Progress */}
        <div className={`p-6 `}>
          <h1 className={`text-3xl font-extrabold ${NEON_TEXT} mb-2`}>
            OS Threads Practice Quiz
          </h1>
          <p className="text-sm opacity-70 text-white">
            Question {activeQuestionIndex + 1} of {questions.length}
          </p>
          <div className="w-full h-1 mt-3 bg-[#252525] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#eeffab]"
              style={{
                width: `${
                  ((activeQuestionIndex + 1) / questions.length) * 100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className={`p-8   mb-8`}>
          <div className="flex justify-between items-center mb-4">
            <span
              className={`text-sm text-white font-semibold uppercase opacity-80`}
            >
              {currentQuestion.type} ({currentQuestion.difficulty})
            </span>
            <span className={`text-sm text-white opacity-50`}>
              Ref: {currentQuestion.sourceReference || "N/A"}
            </span>
          </div>

          <h2 className={`text-xl font-bold mb-8 ${NEON_TEXT}`}>
            {currentQuestion.text}
          </h2>

          {/* Answer Area */}
          {currentQuestion.type === "MCQ" ? renderMCQ() : renderSAQLAQ()}

          {/* Reveal Answer Button */}
          {(currentQuestion.type === "SAQ" ||
            currentQuestion.type === "LAQ" ||
            currentQuestion.type === "MCQ") && (
            <Button
              onClick={() => setShowAnswer(!showAnswer)}
              className={`w-full mt-6 ${BG_DARK} border ${NEON_BORDER} text-white ${NEON_HOVER} transition-all duration-300`}
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              {showAnswer ? "Hide Model Answer" : "Reveal Model Answer"}
            </Button>
          )}

          {/* Model Answer Display (conditionally rendered) */}
          {showAnswer && (
            <div
              className={`mt-6 p-4 rounded-lg border border-[#eeffab] bg-black text-[#eeffab]`}
            >
              <h3 className="font-bold mb-2">Model Answer:</h3>
              <p className="opacity-80 leading-relaxed text-sm text-white">
                {currentQuestion.modelAnswer}
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pb-10">
          <Button
            onClick={handlePrev}
            disabled={activeQuestionIndex === 0}
            className={`${BG_MEDIUM} ${NEON_TEXT} ${NEON_HOVER} rounded-none transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={activeQuestionIndex === questions.length - 1}
            className={`${BG_MEDIUM} ${NEON_TEXT} ${NEON_HOVER} rounded-none transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            {activeQuestionIndex === questions.length - 1
              ? "Finish Quiz"
              : "Next Question"}
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </div>

      {/* --- 2. Stopwatch Sidebar (30% Width, Full Height) --- */}
      <div
        className={`
          w-[30%] h-screen sticky top-0 
          p-8 flex flex-col items-center justify-center
          ${BG_MEDIUM} border-l-2 border-[#252525]
        `}
      >
        {/* Placeholder title for the sidebar */}
        <div
          className={`text-xl font-bold ${NEON_TEXT} mb-12 uppercase tracking-widest opacity-80`}
        >
          Timer
        </div>

        {/* The Stopwatch Component */}
        <ThemedStopwatch />

        <div className={`text-xs ${NEON_TEXT} opacity-40 mt-16 text-center`}>
          Focus Mode: Timer ensures strict time management.
        </div>
      </div>
    </div>
  );
};

export default Exam;