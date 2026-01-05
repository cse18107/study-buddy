import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, ChevronLeft, ChevronRight, Lightbulb, Trophy, Target, Loader2, Zap } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

import { threadQuizData } from "./threadQuizData";

const Practice = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const practiceId = searchParams.get("practiceid");

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  useEffect(() => {
    const fetchQuizData = async () => {
      if (!practiceId) {
        setQuestions(threadQuizData.questions);
        return;
      }

      setLoading(true);
      const token = localStorage.getItem("token") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWlrYXRAZ21haWwuY29tIiwiZXhwIjoxNzY3OTIzODg3fQ.MrcP0skIR3MSfg4N2UTYKp60BwXxQoqILme9oDGWguU";

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/practices/${practiceId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          const mappedQuestions = data.questions.map((q: any) => {
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
              sourceReference: "MISSION_DATA" 
            };
          });
          setQuestions(mappedQuestions);
        } else {
            setQuestions(threadQuizData.questions);
        }
      } catch (error) {
        setQuestions(threadQuizData.questions);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [practiceId]);

  const handleFinish = async () => {
    setSubmitting(true);
    const token = localStorage.getItem("token") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWlrYXRAZ21haWwuY29tIiwiZXhwIjoxNzY3OTIzODg3fQ.MrcP0skIR3MSfg4N2UTYKp60BwXxQoqILme9oDGWguU";

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
        alert("MISSION COMPLETE! ANALYSIS PENDING.");
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.delete("practiceid");
        router.push(`${window.location.pathname}?${urlParams.toString()}`);
      } else {
        alert("LINK TERMINATED. SUBMISSION FAILED.");
      }
    } catch (error) {
      alert("CRITICAL ERROR DURING SYNC.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full mx-auto bg-white min-h-screen flex items-center justify-center">
        <Loader2 className="w-20 h-20 text-black animate-spin" strokeWidth={4} />
      </div>
    );
  }

  if (questions.length === 0) {
      return (
        <div className="w-full mx-auto bg-white min-h-screen flex items-center justify-center p-10">
             <div className="text-center border-8 border-black p-12 bg-primary shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
                <Target className="w-20 h-20 text-black mx-auto mb-6" strokeWidth={3} />
                <h3 className="text-4xl font-black text-black uppercase">NO DATA FOUND</h3>
             </div>
        </div>
      );
  }

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

  const renderMCQ = () => (
    <div className="space-y-4 mt-8">
      {currentQuestion.options!.map((option: string, index: number) => {
        const isSelected = userAnswers[currentQuestion.questionId] === index;
        const isCorrect = showAnswer && index === currentQuestion.correctOptionIndex;
        const isIncorrect = showAnswer && isSelected && index !== currentQuestion.correctOptionIndex;

        let optionClasses = `bg-white border-4 border-black text-black px-6 py-5 cursor-pointer transition-all duration-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-black uppercase`;

        if (showAnswer) {
          if (isCorrect) {
            optionClasses = "bg-secondary text-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-shake font-black uppercase";
          } else if (isIncorrect) {
            optionClasses = "bg-red-500 border-4 border-black text-white shadow-none font-black uppercase line-through";
          } else if (isSelected) {
            optionClasses = `bg-black text-white border-4 border-black opacity-50`;
          }
        } else if (isSelected) {
          optionClasses = `bg-primary border-4 border-black translate-x-[-2px] translate-y-[-2px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-black uppercase`;
        }

        return (
          <div
            key={index}
            className={optionClasses}
            onClick={() => !showAnswer && handleAnswerChange(index)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-2xl">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="text-lg">{option}</span>
              </div>
              {isCorrect && <Check className="w-8 h-8" strokeWidth={4} />}
              {isIncorrect && <X className="w-8 h-8" strokeWidth={4} />}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderSAQLAQ = () => (
    <div className="mt-8">
      <Textarea
        placeholder="INPUT YOUR KNOWLEDGE SEQUENCE... 💬"
        rows={currentQuestion.type === "LAQ" ? 10 : 5}
        value={userAnswers[currentQuestion.questionId] || ""}
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

  const difficultyColors = {
    Easy: "bg-green-400 text-black border-black",
    Medium: "bg-info text-black border-black",
    Hard: "bg-primary text-black border-black",
  };

  const typeIcons = {
    MCQ: Target,
    SAQ: Lightbulb,
    LAQ: Lightbulb,
  };

  const TypeIcon = typeIcons[currentQuestion.type as keyof typeof typeIcons] || Target;

  return (
    <div className="w-full mx-auto bg-[#FDFDFD] min-h-screen p-6 md:p-12">
      {/* Header and Progress */}
      <div className="border-8 border-black bg-white p-8 mb-10 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] rotate-[-0.5deg]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-6">
            <div className="flex flex-col gap-2">
                <span className="text-secondary font-black uppercase tracking-[0.2em] text-xl">Operational Phase</span>
                <h1 className="text-5xl md:text-8xl font-black text-black flex items-center gap-6 font-heading uppercase leading-none">
                    PRACTICE
                </h1>
            </div>
            
            <div className="bg-black text-white px-6 py-3 flex items-center gap-4 border-4 border-black shadow-[4px_4px_0px_0px_white]">
              <Trophy className="w-8 h-8" strokeWidth={3} />
              <span className="text-2xl font-black uppercase">
                {activeQuestionIndex + 1} / {questions.length}
              </span>
            </div>
          </div>
          
          {/* Progress Bar (Neobrutalist) */}
          <div className="w-full h-12 bg-white border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative">
            <div
              className="h-full bg-primary border-r-8 border-black transition-all duration-300"
              style={{
                width: `${((activeQuestionIndex + 1) / questions.length) * 100}%`,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center font-black text-black pointer-events-none uppercase">
                {Math.round(((activeQuestionIndex + 1) / questions.length) * 100)}% COMPLETE
            </div>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white border-8 border-black p-10 md:p-16 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary border-l-8 border-b-8 border-black"></div>
            
            {/* Question Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-secondary border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <TypeIcon className="w-8 h-8 text-black" strokeWidth={3} />
                </div>
                <div className="flex gap-4">
                  <span className="px-4 py-2 bg-black text-white font-black uppercase text-sm">
                    {currentQuestion.type}
                  </span>
                  <span className={`px-4 py-2 font-black uppercase text-sm border-4 ${
                    difficultyColors[currentQuestion.difficulty as keyof typeof difficultyColors]
                  }`}>
                    {currentQuestion.difficulty}
                  </span>
                </div>
              </div>
              <span className="text-xs font-black uppercase bg-slate-200 px-3 py-1 border-2 border-black">
                REF: {currentQuestion.sourceReference || "N/A"}
              </span>
            </div>

            {/* Question Text */}
            <h2 className="text-3xl md:text-5xl font-black mb-12 text-black leading-none uppercase">
              {currentQuestion.text}
            </h2>

            {/* Answer Area */}
            {currentQuestion.type === "MCQ" ? renderMCQ() : renderSAQLAQ()}

            {/* Reveal Answer Button */}
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="w-full mt-10 neo-button bg-info text-black flex items-center justify-center gap-4 uppercase text-xl"
            >
              <Lightbulb className="w-8 h-8" strokeWidth={3} />
              {showAnswer ? "HIDE INTEL" : "REVEAL MODEL INTEL"}
            </button>

            {/* Model Answer Display */}
            {showAnswer && (
              <div className="mt-10 p-8 border-8 border-black bg-primary/10 animate-shake">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="w-16 h-16 bg-primary border-4 border-black flex items-center justify-center flex-shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Zap className="w-10 h-10 text-black" strokeWidth={3} />
                  </div>
                  <div>
                    <h3 className="font-black text-black mb-4 text-3xl uppercase leading-none">THE TRUTH:</h3>
                    <p className="text-black font-bold uppercase text-xl leading-snug">
                      {currentQuestion.modelAnswer}
                    </p>
                  </div>
                </div>
              </div>
            )}
        </div>

        {/* Navigation */}
        <div className="flex flex-col md:flex-row justify-between mt-12 gap-6">
            <button
                onClick={handlePrev}
                disabled={activeQuestionIndex === 0 || submitting}
                className="neo-button bg-white text-black flex items-center justify-center gap-3 disabled:opacity-30 disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-none"
            >
                <ChevronLeft className="w-8 h-8" strokeWidth={4} />
                <span className="text-xl">BACK</span>
            </button>

            <button
                onClick={activeQuestionIndex === questions.length - 1 ? handleFinish : handleNext}
                disabled={submitting}
                className="neo-button bg-secondary text-black flex items-center justify-center gap-3 disabled:opacity-30"
            >
                {submitting ? (
                <Loader2 className="w-8 h-8 animate-spin" strokeWidth={4} />
                ) : null}
                <span className="text-xl">
                {activeQuestionIndex === questions.length - 1
                    ? (submitting ? "UPLOADING..." : "FINISH MISSION")
                    : "NEXT PHASE"}
                </span>
                {!submitting && <ChevronRight className="w-8 h-8" strokeWidth={4} />}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Practice;
