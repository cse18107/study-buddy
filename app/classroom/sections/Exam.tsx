import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, ChevronLeft, ChevronRight, Lightbulb, Calendar, Trophy, Clock, Loader2, AlertCircle } from "lucide-react";
import ThemedStopwatch from "@/components/ThemedStopwatch";
import { useSearchParams, useRouter } from "next/navigation";

interface Question {
  id: string;
  question: string;
  options: string[];
  type: string;
  answer: string;
  difficulty: string;
  assignedMarks: number;
}

interface ExamData {
  id: string;
  title: string;
  description: string;
  questions: Question[];
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

  useEffect(() => {
    const fetchExam = async () => {
      if (!examId) return;
      
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWlrYXRAZ21haWwuY29tIiwiZXhwIjoxNzY3OTIzODg3fQ.MrcP0skIR3MSfg4N2UTYKp60BwXxQoqILme9oDGWguU";

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/exams/${examId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setExamData(data);
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

  const questions = examData?.questions || [];
  const [submitting, setSubmitting] = useState(false);

  const handleFinish = async () => {
    setSubmitting(true);
    const token = typeof window !== 'undefined' ? (localStorage.getItem("token") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWlrYXRAZ21haWwuY29tIiwiZXhwIjoxNzY3OTIzODg3fQ.MrcP0skIR3MSfg4N2UTYKp60BwXxQoqILme9oDGWguU") : "";

    // Prepare payload in format [{[id]: answerText}]
    const payload = questions.map(q => {
      const answerRaw = userAnswers[q.id];
      let finalAnswer = "";

      if (q.type === "Mcq") {
        finalAnswer = typeof answerRaw === 'number' ? q.options[answerRaw] : (answerRaw || "");
      } else {
        finalAnswer = answerRaw || "";
      }

      return { [q.id]: finalAnswer };
    });

    try {
      const response = await fetch('http://localhost:8000/api/questions/bulk-update-answers', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Success! You have finished the exam. Your performance is being evaluated.");
        
        // Use URLSearchParams to preserve other params like 'id' and 'set'
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.delete("examid");
        router.push(`${window.location.pathname}?${urlParams.toString()}`);
      } else {
        const errData = await response.json();
        console.error("Failed to submit answers:", errData);
        alert("Failed to submit exam. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
      alert("An error occurred while submitting your exam.");
    } finally {
      setSubmitting(false);
    }
  };

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

  const renderMCQ = () => {
    if (!currentQuestion) return null;
    
    // Find correct option index from the model answer string
    const correctOptionIndex = currentQuestion.options.indexOf(currentQuestion.answer);

    return (
      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => {
          const isSelected = userAnswers[currentQuestion.id] === index;
          const isCorrect = showAnswer && index === correctOptionIndex;
          const isIncorrect = showAnswer && isSelected && index !== correctOptionIndex;

          let optionClasses = `bg-white border-2 border-slate-200 text-slate-900 px-5 py-4 rounded-xl cursor-pointer transition-all duration-300 hover:border-orange-400 hover:shadow-md`;

          if (showAnswer) {
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
              onClick={() => !showAnswer && handleAnswerChange(index)}
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
          disabled={showAnswer}
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
                </h1>
                <p className="text-slate-500 mt-1 font-semibold opacity-75">{examData.description}</p>
              </div>
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
                <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Marks: </span>
                  <span className="text-sm font-black text-slate-900">{currentQuestion.assignedMarks}</span>
                </div>
              </div>

              {/* Question Text */}
              <h2 className="text-3xl font-extrabold mb-12 text-slate-900 leading-[1.4] tracking-tight">
                {currentQuestion.question}
              </h2>

              {/* Answer Area */}
              {currentQuestion.type === "Mcq" ? renderMCQ() : renderSAQLAQ()}

              {/* Reveal Answer Button */}
              <Button
                onClick={() => setShowAnswer(!showAnswer)}
                className="w-full mt-10 bg-slate-900 hover:bg-black text-white h-14 rounded-2xl font-black text-lg transition-all duration-300 shadow-xl active:scale-[0.98]"
              >
                <Lightbulb className="w-6 h-6 mr-3 text-yellow-400" />
                {showAnswer ? "Secure Model Answer" : "Validate Against Model"}
              </Button>

              {/* Model Answer Display */}
              {showAnswer && (
                <div className="mt-8 p-8 rounded-3xl border-2 border-orange-200 bg-orange-50/50 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-200">
                      <Check className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-orange-900 mb-2 text-xl tracking-tight">Model Solution:</h3>
                      <p className="text-slate-800 leading-relaxed text-lg font-medium italic">
                        &quot;{currentQuestion.answer}&quot;
                      </p>
                    </div>
                  </div>
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

              <Button
                onClick={activeQuestionIndex === questions.length - 1 ? handleFinish : handleNext}
                disabled={submitting}
                className="bg-gradient-to-br from-orange-600 to-rose-600 hover:from-orange-700 hover:to-rose-700 text-white rounded-2xl px-10 h-14 transition-all duration-300 disabled:opacity-30 font-black shadow-xl shadow-orange-200 active:scale-95"
              >
                {submitting && <Loader2 className="w-5 h-5 animate-spin mr-2" />}
                {activeQuestionIndex === questions.length - 1
                  ? (submitting ? "Finalizing..." : "Finalize Exam")
                  : "Validate & Continue"}
                {!submitting && <ChevronRight className="w-6 h-6 ml-2" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Timer (30%) */}
      <div className="w-[30%] bg-white border-l border-slate-200/60 p-10 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
        <div className="bg-slate-900 rounded-[2.5rem] shadow-2xl p-8 flex-shrink-0 mb-8 border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full -mr-16 -mt-16" />
          <div className="relative z-10 flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-orange-400" />
            <h3 className="text-xl font-black text-white tracking-tight uppercase">Session Clock</h3>
          </div>
          <div className="relative z-10 text-white">
            <ThemedStopwatch />
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
              "Analyze question structure thoroughly",
              "Maintain consistent high performance",
              "Review logic paths frequently",
              "Ensure zero external interference",
              "Verify final marks allocation"
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
    </div>
  );
};

export default Exam;
