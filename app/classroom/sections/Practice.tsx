import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, ChevronLeft, ChevronRight, Lightbulb, Trophy, Target, Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { threadQuizData } from "./threadQuizData";
import { useAuth } from "@/context/AuthContext";
import { getApiUrl } from '@/lib/api-config';

const Practice = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const practiceId = searchParams.get("practiceid");
  const { logout } = useAuth();

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [practiceStatus, setPracticeStatus] = useState<"Created" | "Submitted" | "Evaluated">("Created");

  useEffect(() => {
    const fetchQuizData = async () => {
      if (!practiceId) {
        // Fallback to dummy data if no ID (or handle as empty)
        setQuestions(threadQuizData.questions);
        return;
      }

      setLoading(true);
      const token = localStorage.getItem("access_token");

      try {
        const response = await fetch(getApiUrl(`/api/practices/${practiceId}`), {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setPracticeStatus(data.status || "Created");
          
          // Map API questions to internal format
          const mappedQuestions = data.questions.map((q: any) => {
            // Find correct option index for MCQ
            let correctIndex = -1;
            if (q.type === "Mcq" && q.options) {
              correctIndex = q.options.findIndex((opt: string) => opt === q.answer);
            }

            return {
              questionId: q.id,
              text: q.question,
              type: q.type === "Mcq" ? "MCQ" : (q.type === "Short" ? "SAQ" : "LAQ"),
              options: q.options || [],
              correctOptionIndex: correctIndex,
              modelAnswer: q.answer,
              difficulty: q.difficulty,
              sourceReference: "Fetched from API",
              givenMarks: q.givenMarks,
              assignedMarks: q.assignedMarks || 1 // Default if missing
            };
          });
          setQuestions(mappedQuestions);

          // If evaluated, populate user answers
          if (data.status === "Evaluated") {
             const initialAnswers: Record<string, any> = {};
             data.questions.forEach((q: any) => {
                 // Try to find submitted answer field, falling back or checking structure
                 // Assuming 'submittedAnswer' based on pattern
                 const ans = q.submittedAnswer || ""; 
                 
                 if (q.type === "Mcq" && q.options) {
                     const ansIdx = q.options.indexOf(ans);
                     if (ansIdx !== -1) initialAnswers[q.id] = ansIdx;
                 } else {
                     initialAnswers[q.id] = ans;
                 }
             });
             setUserAnswers(initialAnswers);
             setShowAnswer(true);
          }
        } else if (response.status === 401) {
            logout(); // Handle 401 Unauthorized
        } else {
            console.error("Failed to fetch quiz");
            setQuestions(threadQuizData.questions); // Fallback on error?
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setQuestions(threadQuizData.questions);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [practiceId, logout]);

  const handleFinish = async () => {
    setSubmitting(true);
    const token = localStorage.getItem("access_token");

    // Prepare payload in format [{[id]: answerText}]
    const payload = questions.map(q => {
      const answerRaw = userAnswers[q.questionId];
      let finalAnswer = "";

      if (q.type === "MCQ") {
        finalAnswer = typeof answerRaw === 'number' ? q.options[answerRaw] : (answerRaw || "");
      } else {
        finalAnswer = answerRaw || "";
      }

      return { [q.questionId]: finalAnswer };
    });

    try {
      const response = await fetch(getApiUrl('/api/questions/bulk-update-answers'), {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Success! You have finished the practice test. Your test is in evaluation, please wait.");
        // Redirect back to practice list
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.delete("practiceid");
        router.push(`${window.location.pathname}?${urlParams.toString()}`);
      } else if (response.status === 401) {
          logout();
      } else {
        const errData = await response.json();
        console.error("Failed to submit answers:", errData);
        alert("Failed to submit answers. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("An error occurred while submitting your quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full mx-auto bg-background min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  // Submitted / Blocking State
  if (practiceStatus === "Submitted") {
      return (
        <div className="flex flex-col items-center justify-center w-full h-screen bg-slate-50 p-6">
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-200 text-center max-w-lg">
                <div className="bg-purple-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Target className="w-10 h-10 text-purple-500" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Practice Submitted</h2>
                <p className="text-slate-500 text-lg mb-8">
                    Your practice session has been submitted and is currently being evaluated. Please check back soon.
                </p>
                <Button 
                    onClick={() => {
                        const urlParams = new URLSearchParams(window.location.search);
                        urlParams.delete("practiceid");
                        router.push(`${window.location.pathname}?${urlParams.toString()}`);
                    }}
                    className="w-full bg-slate-900 hover:bg-black text-white rounded-xl h-14 font-bold text-lg shadow-lg"
                >
                    Return to Classroom
                </Button>
            </div>
        </div>
      );
  }

  if (questions.length === 0) {
      return (
        <div className="w-full mx-auto bg-background min-h-screen flex items-center justify-center">
             <div className="text-center">
                <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900">No questions found</h3>
             </div>
        </div>
      );
  }

  const currentQuestion = questions[activeQuestionIndex];
  const isEvaluated = practiceStatus === "Evaluated";

  const handleAnswerChange = (value: any) => {
    // Disable changes if evaluated
    if (isEvaluated) return;
    
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
  
  // Calculate marks
  const totalMarks = questions.reduce((sum, q) => sum + (q.assignedMarks || 1), 0);
  const obtainedMarks = questions.reduce((sum, q) => sum + (q.givenMarks || 0), 0);

  const renderMCQ = () => (
    <div className="space-y-3">
      {currentQuestion.options!.map((option: string, index: number) => {
        const isSelected = userAnswers[currentQuestion.questionId] === index;
        const isCorrect =
          (showAnswer || isEvaluated) && index === currentQuestion.correctOptionIndex;
        const isIncorrect =
          (showAnswer || isEvaluated) &&
          isSelected &&
          index !== currentQuestion.correctOptionIndex;

        let optionClasses = `bg-white border-2 border-slate-200 text-slate-900 px-5 py-4 rounded-xl cursor-pointer transition-all duration-300 hover:border-purple-400 hover:shadow-md`;

        if (showAnswer || isEvaluated) {
          if (isCorrect) {
            optionClasses =
              "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-2 border-green-500 shadow-lg shadow-green-500/30 animate-success-pop";
          } else if (isIncorrect) {
            optionClasses =
              "bg-red-50 border-2 border-red-300 text-red-600 opacity-60 line-through";
          } else if (isSelected) {
            optionClasses = `bg-slate-100 border-2 border-slate-300 opacity-50`;
          } else {
             optionClasses = `bg-slate-50 border-2 border-slate-100 text-slate-400 opacity-50`;
          }
        } else if (isSelected) {
          optionClasses = `bg-purple-50 border-2 border-purple-500 text-purple-900 shadow-md`;
        }

        return (
          <div
            key={index}
            className={optionClasses}
            onClick={() => (!showAnswer && !isEvaluated) && handleAnswerChange(index)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="font-medium">{option}</span>
              </div>
              {isCorrect && (
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
              )}
              {isIncorrect && (
                <X className="w-5 h-5" />
              )}
            </div>
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
        disabled={showAnswer || isEvaluated}
        className="
          w-full bg-white border-2 border-slate-200 text-slate-900
          placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20
          rounded-xl p-4 resize-none transition-all
        "
      />
    </div>
  );

  const difficultyColors = {
    Easy: "bg-green-100 text-green-700 border-green-300",
    Medium: "bg-blue-100 text-blue-700 border-blue-300",
    Hard: "bg-orange-100 text-orange-700 border-orange-300",
  };

  const typeIcons = {
    MCQ: Target,
    SAQ: Lightbulb,
    LAQ: Lightbulb,
  };

  const TypeIcon = typeIcons[currentQuestion.type as keyof typeof typeIcons] || Target;

  return (
    <div className="w-full mx-auto bg-background min-h-screen">
      {/* Colorful Top Bar */}
      <div className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-2"></div>
      
      {/* Header and Progress */}
      <div className="p-8 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3 font-heading">
              <Target className="w-8 h-8 text-blue-500" />
              Practice Quiz
              {isEvaluated && <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded ml-2">Review Mode</span>}
            </h1>
            
            {isEvaluated ? (
                 <div className="flex items-center gap-4">
                    <div className="text-right">
                       <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">Total Score</p>
                       <p className="text-2xl font-black text-purple-600">{obtainedMarks} / {totalMarks}</p>
                    </div>
                 </div>
            ) : (
                <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-semibold text-slate-600">
                    Question {activeQuestionIndex + 1} of {questions.length}
                </span>
                </div>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 rounded-full"
              style={{
                width: `${((activeQuestionIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 animate-slide-up">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <TypeIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold border border-blue-300">
                    {currentQuestion.type}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                    difficultyColors[currentQuestion.difficulty as keyof typeof difficultyColors]
                  }`}>
                    {currentQuestion.difficulty}
                  </span>
                </div>
              </div>
              
              {isEvaluated ? (
                 <div className={`px-3 py-1 rounded-lg border ${
                     (currentQuestion.givenMarks || 0) > 0 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                 }`}>
                     <span className="text-sm font-bold">Score: {currentQuestion.givenMarks || 0} / {currentQuestion.assignedMarks || 1}</span>
                 </div>
              ) : (
                <span className="text-sm text-slate-500">
                    Ref: {currentQuestion.sourceReference || "N/A"}
                </span>
              )}
            </div>

            {/* Question Text */}
            <h2 className="text-2xl font-bold mb-8 text-slate-900 leading-relaxed">
              {currentQuestion.text}
            </h2>

            {/* Answer Area */}
            {currentQuestion.type === "MCQ" ? renderMCQ() : renderSAQLAQ()}

            {/* Reveal Answer Button - Hide in review since auto shown */}
            {!isEvaluated && (
                <Button
                onClick={() => setShowAnswer(!showAnswer)}
                className="w-full mt-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white h-12 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                <Lightbulb className="w-5 h-5 mr-2" />
                {showAnswer ? "Hide Model Answer" : "Reveal Model Answer"}
                </Button>
            )}

            {/* Model Answer Display */}
            {(showAnswer || isEvaluated) && (
              <div className="mt-6 p-6 rounded-xl border-2 border-purple-200 bg-purple-50 animate-slide-up">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-purple-900 mb-2 text-lg">Model Answer:</h3>
                    <p className="text-slate-700 leading-relaxed">
                      {currentQuestion.modelAnswer}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button
              onClick={handlePrev}
              disabled={activeQuestionIndex === 0 || submitting}
              className="bg-white border-2 border-slate-300 text-slate-700 hover:border-purple-500 hover:text-purple-700 rounded-xl px-6 h-12 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed font-semibold"
            >
              <ChevronLeft className="w-5 h-5 mr-1" /> Previous
            </Button>
            
            {isEvaluated ? (
                <Button
                onClick={() => {
                     if (activeQuestionIndex === questions.length - 1) {
                         const urlParams = new URLSearchParams(window.location.search);
                         urlParams.delete("practiceid");
                         router.push(`${window.location.pathname}?${urlParams.toString()}`);
                     } else {
                         handleNext();
                     }
                }}
                className="bg-slate-900 text-white hover:bg-black rounded-xl px-6 h-12 transition-all font-semibold shadow-lg"
                >
                {activeQuestionIndex === questions.length - 1 ? "Close Review" : "Next"} {' '}
                {activeQuestionIndex !== questions.length - 1 && <ChevronRight className="w-5 h-5 ml-1" />}
                </Button>
            ) : (
                <Button
                onClick={activeQuestionIndex === questions.length - 1 ? handleFinish : handleNext}
                disabled={submitting}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl px-6 h-12 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed font-semibold shadow-lg"
                >
                {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : null}
                {activeQuestionIndex === questions.length - 1
                    ? (submitting ? "Submitting..." : "Finish Quiz")
                    : "Next Question"}
                {!submitting && <ChevronRight className="w-5 h-5 ml-1" />}
                </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Practice;
