import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, RefreshCw, Zap } from "lucide-react";
import { generateClassroomHtml } from "@/lib/contentGenerator";

interface LearnProps {
  classroomDetails?: any;
}

const Learn: React.FC<LearnProps> = ({ classroomDetails }) => {
  const [content, setContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (classroomDetails?.sources[0]?.htmlContent) {
      setContent(classroomDetails.sources[0].htmlContent);
    }
  }, [classroomDetails]);

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    const token = localStorage.getItem("token") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWlrYXRAZ21haWwuY29tIiwiZXhwIjoxNzY1NjMzODU3fQ.KLK4GyPoU-7aw2bMmvIeP-pToo6ga3OzN8qbMEgLDzI";

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/sources/generate-content`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "documentId": classroomDetails?.sources[0]?.document,
          "classroomId": classroomDetails?.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        setContent(data.data || "No content returned.");
      } else {
        alert("Failed to generate content.");
      }
    } catch (error) {
      alert("Error contacting the server.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
        <div className="bg-primary p-12 border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-6 animate-shake">
          <Loader2 className="w-20 h-20 text-black animate-spin" strokeWidth={4} />
          <h3 className="text-4xl font-black text-black uppercase text-center leading-none">COOKING<br/>THE DATA...</h3>
          <p className="text-black font-bold uppercase text-xs bg-white px-2 py-1 border-2 border-black">Please be patient, wizard at work</p>
        </div>
      </div>
    );
  }

  if (content) {
    return (
      <div className="bg-[#FDFDFD] min-h-screen p-8 lg:p-12">
        <div className="mx-auto space-y-10">
          <div className="flex justify-between items-end border-b-8 border-black pb-6 gap-6">
            <div className="flex flex-col">
                <span className="text-secondary font-black uppercase text-2xl tracking-widest">Knowledge Stream</span>
                <h2 className="text-5xl md:text-7xl font-black text-black font-heading uppercase leading-none">MODULE 01</h2>
            </div>
            <button 
              onClick={handleGenerateContent}
              className="neo-button bg-primary text-black flex items-center gap-3 uppercase"
            >
              <RefreshCw className="w-6 h-6" strokeWidth={3} />
              RE-GENERATE
            </button>
          </div>

          <div className="border-8 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
            <iframe 
                className="w-full min-h-[1000px] border-none"
                srcDoc={generateClassroomHtml(content)}
                title="Lesson Content"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-2xl space-y-10 border-8 border-black p-12 bg-white shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary border-l-8 border-b-8 border-black rotate-45 translate-x-16 translate-y-[-64px]"></div>
        
        <div className="w-32 h-32 bg-primary border-4 border-black flex items-center justify-center mx-auto mb-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <Zap className="w-20 h-20 text-black" strokeWidth={3} />
        </div>
        
        <h2 className="text-5xl md:text-7xl font-black text-black font-heading uppercase leading-none">READY TO<br/>UPGRADE?</h2>
        <p className="text-black text-xl font-bold uppercase border-y-4 border-black py-4">
          The knowledge database is empty for this deck. Launch the generation sequence now.
        </p>

        <button 
          onClick={handleGenerateContent}
          className="w-full neo-button bg-secondary text-black text-2xl h-24 uppercase"
        >
          GENERATE LESSON ⚡
        </button>
      </div>
    </div>
  );
}

export default Learn;