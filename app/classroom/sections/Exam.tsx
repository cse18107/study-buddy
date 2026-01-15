import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, ChevronLeft, ChevronRight, Lightbulb, Calendar, Trophy, Clock, Loader2, AlertCircle } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getApiUrl } from '@/lib/api-config';

interface Question {
  id: string;
  question: string;
  options: string[];
  type: string;
  answer: string;
  difficulty: string;
  assignedMarks: number;
  givenMarks?: number; // Added field
}

interface ExamData {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  status?: "Created" | "Submitted" | "Evaluated"; // Added field
}

const Exam = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const examId = searchParams.get("examid");
  
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  
  // Pre-start Countdown State
  const [isCountingDown, setIsCountingDown] = useState(true);
  const [countdownTime, setCountdownTime] = useState(10);
  
  // Timer State
  const [totalDuration, setTotalDuration] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showEndModal, setShowEndModal] = useState(false);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const [submitting, setSubmitting] = useState(false);
  const questions = useMemo(() => examData?.questions || [], [examData]);
  
  // Use a ref for answers to ensure the timer effect remains stable 
  // and handleFinish always has access to the latest answers.
  const answersRef = React.useRef(userAnswers);
  useEffect(() => {
    answersRef.current = userAnswers;
  }, [userAnswers]);

  // Calculate score if evaluated - Move to top level to avoid conditional hook call
  const totalMarks = useMemo(() => questions.reduce((acc, q) => acc + (q.assignedMarks || 0), 0), [questions]);
  const obtainedMarks = useMemo(() => questions.reduce((acc, q) => acc + (q.givenMarks || 0), 0), [questions]);

  const handleFinish = useCallback(async (isAuto = false) => {
    setSubmitting(true);
    const token = typeof window !== 'undefined' ? (localStorage.getItem("access_token") || "") : "";

    const payload = questions.map(q => {
      const answerRaw = answersRef.current[q.id];
      let finalAnswer = "";
      if (q.type === "Mcq") {
        finalAnswer = typeof answerRaw === 'number' ? q.options[answerRaw] : (answerRaw || "");
      } else {
        finalAnswer = answerRaw || "";
      }
      return { [q.id]: finalAnswer };
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
        if (isAuto) {
          setShowEndModal(true);
        } else {
          alert("Success! You have finished the exam. Your performance is being evaluated.");
          const urlParams = new URLSearchParams(window.location.search);
          urlParams.delete("examid");
          router.push(`${window.location.pathname}?${urlParams.toString()}`);
        }
      } else {
        if (!isAuto) alert("Failed to submit exam. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
      if (!isAuto) alert("An error occurred while submitting your exam.");
    } finally {
      setSubmitting(false);
    }
  }, [questions, router]);

  // Pre-start Countdown Effect
  useEffect(() => {
    if (!isCountingDown) return;
    
    const interval = setInterval(() => {
      setCountdownTime((prev) => {
        if (prev <= 1) {
          setIsCountingDown(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCountingDown]);

  // Main Exam Timer Effect
  useEffect(() => {
    if (loading || !examData || showEndModal || isCountingDown || examData.status === "Evaluated") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinish(true); // Auto submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, examData, showEndModal, handleFinish, isCountingDown]);

  useEffect(() => {
    const fetchExam = async () => {
      if (!examId) return;
      
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("access_token");

      try {
        const response = await fetch(getApiUrl(`/api/exams/${examId}`), {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setExamData(data);
          
          // Calculate dynamic duration
          const duration = data.questions.reduce((acc: number, q: Question) => {
            if (q.type === 'Mcq') return acc + (2 * 60);
            if (q.type === 'Short') return acc + (5 * 60);
            if (q.type === 'Long') return acc + (10 * 60);
            return acc + (2 * 60); // Default to 2 mins if type is unknown
          }, 0);
          
          setTotalDuration(duration);
          // Only set timeLeft if not evaluated and we strictly want to reset/init it
          if (data.status !== "Evaluated") {
             setTimeLeft(duration);
          }

          // If exam is evaluated, set user answers to what was submitted
          if (data.status === "Evaluated") {
            setIsCountingDown(false); // Disable pre-start countdown
            const initialAnswers: Record<string, any> = {};
            data.questions.forEach((q: Question) => {
              if (q.type === "Mcq") {
                const optionIndex = q.options.indexOf(q.answer);
                if (optionIndex !== -1) {
                  initialAnswers[q.id] = optionIndex;
                }
              } else {
                initialAnswers[q.id] = q.answer;
              }
            });
            setUserAnswers(initialAnswers);
            setShowAnswer(true); // Force show answers in review mode
          }
        } else {
          setError("Failed to load exam. Please try again later.");
        }
      } catch (err) {
        console.error("Error fetching exam:", err);
        setError("A network error occurred. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId]);

  const currentQuestion = questions[activeQuestionIndex];

  const handleAnswerChange = (value: string | number) => {
    if (!currentQuestion) return;
    setUserAnswers({
      ...userAnswers,
      [currentQuestion.id]: value,
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

  const isEvaluated = examData?.status === "Evaluated";

  const renderMCQ = () => {
    if (!currentQuestion) return null;
    
    // Find correct option index from the model answer string
    const correctOptionIndex = currentQuestion.options.indexOf(currentQuestion.answer);
    const displayAnswers = showAnswer || isEvaluated;

    return (
      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => {
          const isSelected = userAnswers[currentQuestion.id] === index;
          const isCorrect = displayAnswers && index === correctOptionIndex;
          const isIncorrect = displayAnswers && isSelected && index !== correctOptionIndex;

          let optionClasses = `bg-white border-2 border-slate-200 text-slate-900 px-5 py-4 rounded-xl cursor-pointer transition-all duration-300 hover:border-orange-400 hover:shadow-md`;

          if (displayAnswers) {
            if (isCorrect) {
              optionClasses = "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-2 border-green-500 shadow-lg shadow-green-500/30 ring-2 ring-green-200 scale-[1.02]";
            } else if (isIncorrect) {
              optionClasses = "bg-red-50 border-2 border-red-300 text-red-600 opacity-80 cursor-not-allowed";
            } else if (isSelected) {
              optionClasses = "bg-slate-100 border-2 border-slate-300 opacity-50 cursor-not-allowed";
            } else {
              optionClasses = "bg-slate-50 border-2 border-slate-100 text-slate-400 cursor-not-allowed";
            }
          } else if (isSelected) {
            optionClasses = "bg-orange-50 border-2 border-orange-500 text-orange-900 shadow-md ring-2 ring-orange-100";
          }

          return (
            <div
              key={index}
              className={optionClasses}
              onClick={() => !displayAnswers && handleAnswerChange(index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border ${isSelected ? 'bg-orange-500 text-white border-orange-500' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="font-medium text-lg">{option}</span>
                </div>
                {isCorrect && <Check className="w-6 h-6 text-white" />}
                {isIncorrect && <X className="w-6 h-6 text-red-500" />}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSAQLAQ = () => {
    if (!currentQuestion) return null;
    return (
      <div>
        <Textarea
          placeholder="Type your comprehensive explanation here..."
          rows={currentQuestion.type === "Long" ? 10 : 5}
          value={userAnswers[currentQuestion.id] || ""}
          onChange={(e) => handleAnswerChange(e.target.value)}
          disabled={showAnswer || isEvaluated}
          className="
            w-full bg-white border-2 border-slate-200 text-slate-900
            placeholder-slate-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20
            rounded-2xl p-6 resize-none transition-all text-lg leading-relaxed
          "
        />
      </div>
    );
  };

  const difficultyColors = {
    Easy: "bg-emerald-100 text-emerald-700 border-emerald-300",
    Medium: "bg-blue-100 text-blue-700 border-blue-300",
    Hard: "bg-rose-100 text-rose-700 border-rose-300",
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen bg-slate-50">
        <Loader2 className="w-16 h-16 text-orange-500 animate-spin mb-4" />
        <p className="text-xl font-bold text-slate-600 animate-pulse">Initializing Secure Exam Session...</p>
      </div>
    );
  }

  if (error || !examData || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen bg-slate-50 p-6">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-200 text-center max-w-lg">
          <div className="bg-rose-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-rose-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Oops! Something went wrong</h2>
          <p className="text-slate-500 text-lg mb-8 font-medium">
            {error || "We couldn't find any questions for this exam. Please contact your coordinator."}
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="w-full bg-slate-900 hover:bg-black text-white rounded-2xl h-14 font-bold text-lg shadow-xl transition-all active:scale-95"
          >
            Refresh Interface
          </Button>
        </div>
      </div>
    );
  }

  if (isCountingDown && !loading && !error && examData) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen bg-slate-900 text-white p-6 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500 blur-[120px] rounded-full animate-pulse stagger-animation" />
        </div>

        <div className="relative z-10 text-center space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="space-y-4">
            <h2 className="text-xl font-black text-orange-400 uppercase tracking-[0.3em] opacity-80">Examination begins in</h2>
            <div className="text-[12rem] font-black leading-none tracking-tighter tabular-nums text-white drop-shadow-[0_20px_50px_rgba(249,115,22,0.3)]">
              {countdownTime}
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="max-w-md mx-auto p-8 bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 text-slate-300 font-medium leading-relaxed">
              Prepare your workspace and focus. The secure examination timer will start automatically when countdown hits zero.
            </div>

            <Button
              onClick={() => {
                const urlParams = new URLSearchParams(window.location.search);
                urlParams.delete("examid");
                router.push(`${window.location.pathname}?${urlParams.toString()}`);
              }}
              variant="outline"
              className="bg-transparent hover:bg-white/10 text-white border-white/20 rounded-2xl h-14 px-10 font-black text-lg transition-all hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5 mr-3 stroke-[3]" />
              Return to Classroom
            </Button>
          </div>
        </div>
      </div>
    );
  }



  // Handle "Submitted" state - Blocking view
  if (examData?.status === "Submitted") {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen bg-slate-50 p-6">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-200 text-center max-w-lg">
          <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-blue-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Exam Submitted</h2>
          <p className="text-slate-500 text-lg mb-8 font-medium">
            Your exam has been successfully submitted and is currently waiting for evaluation. Please check back later for your results.
          </p>
          <Button 
            onClick={() => {
                const urlParams = new URLSearchParams(window.location.search);
                urlParams.delete("examid");
                router.push(`${window.location.pathname}?${urlParams.toString()}`);
            }}
            className="w-full bg-slate-900 hover:bg-black text-white rounded-2xl h-14 font-bold text-lg shadow-xl transition-all active:scale-95"
          >
            Return to Classroom
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex w-full h-screen bg-slate-50/50 overflow-hidden font-sans">
      {/* Left Panel - Questions (70%) */}
      <div className="flex-1 overflow-auto">
        <div className="w-full bg-gradient-to-r from-orange-600 via-rose-600 to-violet-600 h-2 shadow-sm" />
        
        {/* Header */}
        <div className="p-10 bg-white border-b border-slate-200/60 sticky top-0 z-10 backdrop-blur-md bg-white/90">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                  <div className="p-2 bg-orange-50 rounded-xl">
                    <Trophy className="w-8 h-8 text-orange-600" />
                  </div>
                  {examData.title}
                  {isEvaluated && (
                    <span className="bg-emerald-100 text-emerald-700 text-sm px-3 py-1 rounded-full border border-emerald-300 ml-3">
                        result available
                    </span>
                  )}
                </h1>
                <p className="text-slate-500 mt-1 font-semibold opacity-75">{examData.description}</p>
              </div>
              
              {isEvaluated ? (
                 <div className="text-right">
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total Score</div>
                    <div className="text-4xl font-black text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-rose-600">
                        {obtainedMarks} <span className="text-xl text-slate-400">/ {totalMarks}</span>
                    </div>
                 </div>
              ) : (
                <div className="text-right">
                    <div className="flex items-center gap-2 mb-1 justify-end">
                    <Calendar className="w-5 h-5 text-orange-500" />
                    <span className="text-lg font-black text-slate-900">
                        Question {activeQuestionIndex + 1}
                    </span>
                    </div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                    of {questions.length} total
                    </p>
                </div>
              )}
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-orange-500 via-rose-500 to-violet-500 transition-all duration-700 ease-out rounded-full"
                style={{
                  width: `${((activeQuestionIndex + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="p-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200/60 p-12 relative overflow-hidden">
              {/* Question Header */}
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className={`px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-[0.2em] border-2 ${
                    currentQuestion.type === 'Mcq' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-violet-50 text-violet-700 border-violet-200'
                  }`}>
                    {currentQuestion.type === 'Mcq' ? 'Multiple Choice' : 'Long Form'}
                  </div>
                  <div className={`px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-[0.2em] border-2 ${
                    difficultyColors[currentQuestion.difficulty as keyof typeof difficultyColors]
                  }`}>
                    {currentQuestion.difficulty}
                  </div>
                </div>
                
                {isEvaluated ? (
                   <div className={`px-4 py-2 rounded-xl border-2 ${
                       (currentQuestion.givenMarks || 0) > 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
                   }`}>
                      <span className="text-xs font-black uppercase tracking-widest opacity-70">Score: </span>
                      <span className="text-lg font-black">{currentQuestion.givenMarks || 0}</span>
                      <span className="text-xs font-bold opacity-50"> / {currentQuestion.assignedMarks}</span>
                   </div>
                ) : (
                    <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Marks: </span>
                    <span className="text-sm font-black text-slate-900">{currentQuestion.assignedMarks}</span>
                    </div>
                )}
              </div>

              {/* Question Text */}
              <h2 className="text-3xl font-extrabold mb-12 text-slate-900 leading-[1.4] tracking-tight">
                {currentQuestion.question}
              </h2>

              {/* Answer Area */}
              {/* Pass isEvaluated to render methods if needed, or rely on showAnswer/global state checks inside them. */}
              {/* We want to show answers if evaluated */}
              {currentQuestion.type === "Mcq" ? renderMCQ() : renderSAQLAQ()}
              
              {/* Show Correct Answer Text for Non-MCQ if evaluated */}
              {isEvaluated && currentQuestion.type !== "Mcq" && (
                  <div className="mt-8 p-6 bg-emerald-50 border-2 border-emerald-100 rounded-2xl">
                      <h4 className="font-bold text-emerald-800 mb-2 uppercase tracking-wider text-xs">Model Answer</h4>
                      <p className="text-emerald-900 font-medium leading-relaxed">{currentQuestion.answer}</p>
                  </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-10">
              <Button
                onClick={handlePrev}
                disabled={activeQuestionIndex === 0}
                className="bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50 rounded-2xl px-8 h-14 transition-all duration-300 disabled:opacity-30 font-black"
              >
                <ChevronLeft className="w-6 h-6 mr-2" /> Back
              </Button>

              {isEvaluated ? (
                 <Button
                    onClick={() => activeQuestionIndex === questions.length - 1 ? 
                        router.push(`${window.location.pathname}?${new URLSearchParams(window.location.search).toString()}`.replace('examid', 'ignore')) // Just exit or something
                    : handleNext()
                    }
                    className="bg-slate-900 text-white rounded-2xl px-10 h-14 font-black shadow-xl"
                  >
                    {activeQuestionIndex === questions.length - 1 ? "Close Review" : "Next Question"}
                    {activeQuestionIndex !== questions.length - 1 && <ChevronRight className="w-6 h-6 ml-2" />}
                  </Button>
              ) : (
                 <Button
                    onClick={() => activeQuestionIndex === questions.length - 1 ? handleFinish(false) : handleNext()}
                    disabled={submitting}
                    className="bg-gradient-to-br from-orange-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white rounded-2xl px-10 h-14 transition-all duration-300 disabled:opacity-30 font-black shadow-xl shadow-orange-200 active:scale-95"
                >
                    {submitting && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
                    {activeQuestionIndex === questions.length - 1
                    ? (submitting ? "Finalizing..." : "Finalize Exam")
                    : "Validate & Continue"}
                    {!submitting && <ChevronRight className="w-6 h-6 ml-2" />}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Timer (30%) - Hide if evaluated */}
      {!isEvaluated && (
        <div className="w-[30%] bg-white border-l border-slate-200/60 p-10 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
            <div className="bg-white rounded-[2.5rem] shadow-xl p-8 flex-shrink-0 mb-8 border border-slate-200 relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-slate-400 tracking-[0.2em] uppercase">Time Remaining</h3>
                <Clock className={`w-5 h-5 ${timeLeft < 300 ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
            </div>
            <div className={`relative z-10 text-center text-6xl font-black tracking-tighter tabular-nums ${timeLeft < 300 ? 'text-rose-600' : 'text-slate-900'}`}>
                {formatTime(timeLeft)}
            </div>
            {/* Progress Mini Bar */}
            <div className="mt-6 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                className={`h-full transition-all duration-1000 ${timeLeft < 300 ? 'bg-rose-500' : 'bg-orange-500'}`}
                style={{ width: `${(timeLeft / totalDuration) * 100}%` }}
                />
            </div>
            </div>

            {/* Instructions */}
            <div className="bg-orange-50 rounded-[2.5rem] shadow-sm p-8 border border-orange-100 flex-1">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-500 rounded-xl">
                <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-black text-orange-900 text-lg uppercase tracking-wider">Exam Protocol</h4>
            </div>
            <ul className="space-y-4">
                {[
                "MCQ Questions: 2 minutes allocation",
                "Short Questions: 5 minutes allocation",
                "Long Questions: 10 minutes allocation",
                "Timer assumes this optimal distribution",
                "Auto-submission when timer hits zero"
                ].map((tip, i) => (
                <li key={i} className="flex items-center gap-3 text-orange-800 font-bold text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    {tip}
                </li>
                ))}
            </ul>
            </div>

            {/* System Status */}
            <div className="mt-8 flex items-center justify-center gap-2 text-emerald-500 font-black text-xs uppercase tracking-widest bg-emerald-50 py-3 rounded-2xl border border-emerald-100">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Secure Session Active
            </div>
        </div>
      )}
      <Dialog open={showEndModal} onOpenChange={setShowEndModal}>
        <DialogContent className="rounded-[2.5rem] p-0 overflow-hidden border-0 shadow-2xl max-w-md bg-white">
          <div className="bg-slate-900 p-8 text-center text-white">
             <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-10 h-10 text-white" />
             </div>
             <DialogTitle className="text-3xl font-black">Exam Session Ended</DialogTitle>
             <DialogDescription className="text-slate-400 font-medium mt-2">
               Your session has timed out. All your answers have been securely saved and submitted.
             </DialogDescription>
          </div>
          <div className="p-8 bg-white">
             <Button 
               onClick={() => {
                 const urlParams = new URLSearchParams(window.location.search);
                 urlParams.delete("examid");
                 router.push(`${window.location.pathname}?${urlParams.toString()}`);
               }}
               className="w-full bg-slate-900 hover:bg-black text-white h-14 rounded-2xl font-black text-lg shadow-xl"
             >
               Return to Classroom
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Exam;
