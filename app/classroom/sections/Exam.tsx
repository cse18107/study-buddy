import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, ChevronLeft, ChevronRight, Lightbulb, Calendar, Trophy, Clock, Loader2, AlertCircle, Zap } from "lucide-react";
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
          setError("FAILED TO RETRIEVE INTEL. ACCESS DENIED.");
        }
      } catch (err) {
        setError("LINK TERMINATED. CHECK CONNECTION.");
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
        alert("MISSION SUCCESSFUL. EVALUATION COMMENCING.");
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.delete("examid");
        router.push(`${window.location.pathname}?${urlParams.toString()}`);
      } else {
        alert("SUBMISSION FAILURE. RESYNC REQUIRED.");
      }
    } catch (error) {
      alert("CRITICAL SYNC ERROR.");
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
    const correctOptionIndex = currentQuestion.options.indexOf(currentQuestion.answer);

    return (
      <div className="space-y-4 mt-8">
        {currentQuestion.options.map((option, index) => {
          const isSelected = userAnswers[currentQuestion.id] === index;
          const isCorrect = showAnswer && index === correctOptionIndex;
          const isIncorrect = showAnswer && isSelected && index !== correctOptionIndex;

          let optionClasses = `bg-white border-4 border-black text-black px-6 py-5 cursor-pointer transition-all duration-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-black uppercase`;

          if (showAnswer) {
            if (isCorrect) {
              optionClasses = "bg-secondary text-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-shake font-black uppercase";
            } else if (isIncorrect) {
              optionClasses = "bg-red-500 border-4 border-black text-white shadow-none font-black uppercase line-through opacity-60";
            } else if (isSelected) {
              optionClasses = "bg-black text-white border-4 border-black opacity-40";
            } else {
              optionClasses = "bg-slate-100 border-4 border-black text-black/30 opacity-40";
            }
          } else if (isSelected) {
            optionClasses = "bg-primary border-4 border-black translate-x-[-2px] translate-y-[-2px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-black uppercase";
          }

          return (
            <div
              key={index}
              className={optionClasses}
              onClick={() => !showAnswer && handleAnswerChange(index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 border-4 border-black flex items-center justify-center font-black ${isSelected ? 'bg-black text-white' : 'bg-white text-black'}`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="font-black text-xl">{option}</span>
                </div>
                {isCorrect && <Check className="w-8 h-8" strokeWidth={4} />}
                {isIncorrect && <X className="w-8 h-8" strokeWidth={4} />}
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
      <div className="mt-8">
        <Textarea
          placeholder="INPUT YOUR KNOWLEDGE SEQUENCE... 💬"
          rows={currentQuestion.type === "Long" ? 10 : 5}
          value={userAnswers[currentQuestion.id] || ""}
          onChange={(e) => handleAnswerChange(e.target.value)}
          disabled={showAnswer}
          className="
            w-full bg-white border-8 border-black text-black
            placeholder:text-black/30 p-8 resize-none transition-all
            text-xl font-black uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
            focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px]
          "
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen bg-white">
        <Loader2 className="w-20 h-20 text-black animate-spin mb-6" strokeWidth={4} />
        <p className="text-3xl font-black text-black animate-pulse uppercase">INITIATING SECURE LINK...</p>
      </div>
    );
  }

  if (error || !examData || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen bg-[#FDFDFD] p-10">
        <div className="bg-white p-12 border-8 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] text-center max-w-2xl rotate-[-2deg]">
          <div className="bg-red-500 border-4 border-black w-24 h-24 flex items-center justify-center mx-auto mb-8 shadow-[8px_8px_0px_0px_black]">
            <AlertCircle className="w-12 h-12 text-white" strokeWidth={3} />
          </div>
          <h2 className="text-5xl font-black text-black mb-6 uppercase leading-tight">{error || "CRITICAL DATA LOSS"}</h2>
          <button 
            onClick={() => window.location.reload()}
            className="w-full neo-button bg-black text-white h-20 text-2xl uppercase"
          >
            RE-ESTABLISH LINK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen bg-[#FDFDFD] overflow-hidden">
      {/* Left Panel - Questions (70%) */}
      <div className="flex-1 overflow-auto p-6 md:p-12 relative">
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        {/* Header Section */}
        <div className="border-8 border-black bg-white p-8 mb-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary border-l-8 border-b-8 border-black"></div>
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-8">
              <div>
                <h1 className="text-4xl md:text-7xl font-black text-black flex items-center gap-4 font-heading uppercase leading-none">
                  {examData.title}
                </h1>
                <p className="text-black font-bold uppercase text-xs mt-4 border-l-4 border-secondary pl-3 opacity-60">{examData.description}</p>
              </div>
              <div className="text-left md:text-right bg-black text-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_white]">
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-black uppercase leading-none italic">
                    Q-{activeQuestionIndex + 1}
                  </span>
                </div>
                <p className="text-[10px] font-black uppercase opacity-60 tracking-[0.3em]">
                  PHASE {activeQuestionIndex + 1} OF {questions.length}
                </p>
              </div>
            </div>
            
            {/* Progress Bar (Neobrutalist) */}
            <div className="w-full h-8 bg-white border-4 border-black shadow-[4px_4px_0px_0px_black] overflow-hidden">
              <div
                className="h-full bg-secondary border-r-4 border-black transition-all duration-300"
                style={{
                  width: `${((activeQuestionIndex + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
        </div>

        {/* Question Card */}
        <div className="max-w-6xl mx-auto mb-20">
            <div className="bg-white border-8 border-black p-10 md:p-16 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-secondary border-l-8 border-b-8 border-black"></div>
              
              {/* Question Meta */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 pb-6 border-b-4 border-black/10">
                <div className="flex items-center gap-4">
                  <span className="px-5 py-2 bg-black text-white font-black uppercase text-xs">
                    {currentQuestion.type === 'Mcq' ? 'MCQ TYPE' : 'COMPLEX FORM'}
                  </span>
                  <span className="px-5 py-2 border-4 border-black bg-primary text-black font-black uppercase text-xs shadow-[4px_4px_0px_0px_black]">
                    INTEL LVL: {currentQuestion.difficulty}
                  </span>
                </div>
                <div className="bg-slate-100 border-4 border-black p-3 flex items-center gap-2">
                  <span className="text-xs font-black uppercase">VALUE:</span>
                  <span className="text-xl font-black text-black italic">{currentQuestion.assignedMarks} XP</span>
                </div>
              </div>

              {/* Question Text */}
              <h2 className="text-3xl md:text-5xl font-black mb-12 text-black leading-tight uppercase">
                {currentQuestion.question}
              </h2>

              {/* Answer Area */}
              {currentQuestion.type === "Mcq" ? renderMCQ() : renderSAQLAQ()}

              {/* Reveal Answer Button */}
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="w-full mt-12 neo-button bg-info text-black h-20 flex items-center justify-center gap-4 uppercase text-2xl"
              >
                <Lightbulb className="w-10 h-10" strokeWidth={3} />
                {showAnswer ? "SECURE INTEL" : "REVEAL MODEL INTEL"}
              </button>

              {/* Model Answer Display */}
              {showAnswer && (
                <div className="mt-12 p-8 border-8 border-black bg-primary/10 animate-shake">
                  <div className="flex flex-col md:flex-row items-start gap-8">
                    <div className="w-20 h-20 bg-secondary border-4 border-black flex items-center justify-center flex-shrink-0 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                      <Zap className="w-12 h-12 text-white" strokeWidth={4} />
                    </div>
                    <div>
                      <h3 className="font-black text-black mb-4 text-4xl uppercase leading-none">CORE TRUTH:</h3>
                      <p className="text-black font-bold uppercase text-2xl italic leading-snug">
                        &quot;{currentQuestion.answer}&quot;
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex flex-col md:flex-row justify-between mt-12 gap-8">
              <button
                onClick={handlePrev}
                disabled={activeQuestionIndex === 0}
                className="neo-button bg-white text-black h-20 md:w-56 flex items-center justify-center gap-4 text-xl uppercase disabled:opacity-30 disabled:shadow-none"
              >
                <ChevronLeft className="w-8 h-8" strokeWidth={4} /> BACK
              </button>

              <button
                onClick={activeQuestionIndex === questions.length - 1 ? handleFinish : handleNext}
                disabled={submitting}
                className="neo-button bg-secondary text-white h-20 px-10 flex items-center justify-center gap-4 text-2xl uppercase shadow-[10px_10px_0px_0px_black] active:shadow-none disabled:opacity-30"
              >
                {submitting && <Loader2 className="w-8 h-8 animate-spin" strokeWidth={4} />}
                {activeQuestionIndex === questions.length - 1
                  ? (submitting ? "FINALIZING..." : "COMMIT EXAM")
                  : "NEXT PHASE"}
                {!submitting && <ChevronRight className="w-8 h-8" strokeWidth={4} />}
              </button>
            </div>
        </div>
      </div>

      {/* Right Panel - Timer (30%) */}
      <div className="w-[30%] bg-white border-l-8 border-black p-12 flex flex-col hidden lg:flex shadow-[-16px_0_0_rgba(0,0,0,0.05)] overflow-auto custom-scrollbar">
        <div className="bg-black border-8 border-black p-10 mb-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rotate-[1.5deg] relative">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-secondary border-4 border-black"></div>
            <div className="flex items-center gap-4 mb-8">
                <Clock className="w-8 h-8 text-primary" strokeWidth={4} />
                <h3 className="text-2xl font-black text-white uppercase tracking-widest italic">REAL_TIME</h3>
            </div>
            <div className="text-white">
                <ThemedStopwatch />
            </div>
        </div>

        {/* Instructions */}
        <div className="bg-primary border-8 border-black p-10 flex-1 rotate-[-1deg] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-4 mb-10 border-b-4 border-black pb-6">
            <div className="p-3 bg-white border-4 border-black shadow-[4px_4px_0px_0px_black]">
              <Trophy className="w-10 h-10 text-black" strokeWidth={3} />
            </div>
            <h4 className="font-black text-black text-3xl uppercase leading-none">RULES</h4>
          </div>
          <ul className="space-y-8">
            {[
              "ANALYZE STRUCTURE",
              "PEAK PERFORMANCE",
              "LOGIC VERIFICATION",
              "ZERO INTERFERENCE",
              "VALUE MAXIMIZATION"
            ].map((tip, i) => (
              <li key={i} className="flex items-center gap-4 group">
                <div className="w-6 h-6 border-4 border-black bg-white group-hover:bg-black transition-colors" />
                <span className="font-black text-black text-xl uppercase italic group-hover:bg-white transition-colors">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* System Status Status Badge */}
        <div className="mt-12 border-8 border-black bg-secondary text-white p-6 font-black text-2xl uppercase tracking-widest flex items-center justify-center gap-6 shadow-[8px_8px_0px_0px_black]">
          <div className="w-6 h-6 bg-white border-4 border-black animate-pulse" />
          ACTIVE LINK
        </div>
      </div>
    </div>
  );
};

export default Exam;
