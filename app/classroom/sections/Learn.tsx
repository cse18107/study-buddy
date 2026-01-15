import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, RefreshCw } from "lucide-react";
// import { dummyContent } from '../dummyContent';
import { generateClassroomHtml } from "@/lib/contentGenerator";
import { getApiUrl } from '@/lib/api-config';

// Initial props interface (flexible)
interface LearnProps {
  classroomDetails?: any;
}

const Learn: React.FC<LearnProps> = ({ classroomDetails }) => {
  const [content, setContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize content if available from parent details
  useEffect(() => {
    console.log(classroomDetails)
    if (classroomDetails?.sources[0].htmlContent) {
      setContent(classroomDetails.sources[0].htmlContent);
    }
    // Also check if 'description' contains HTML we should show? 
    // The previous mocked data had description. But user specifically mentions 'html content'.
    // We'll stick to 'html_content' or similar field, or let the user generate it.
  }, [classroomDetails]);

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    const token = localStorage.getItem("access_token");

    try {
      // Using the exact curl endpoint provided (which happens to be the classroom detail endpoint)
      // Assuming valid GET request triggers generation or returns the content field
      const response = await fetch(getApiUrl(`/api/sources/generate-content`), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "documentId": classroomDetails?.sources[0].document,
          "classroomId": classroomDetails?.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        setContent(data.data || "No content returned.");
      } else {
        console.error("Failed to generate content");
        alert("Failed to generate content. Please try again.");
      }
    } catch (error) {
      console.error("Error generating content:", error);
      alert("Error contacting the server.");
    } finally {
      setIsGenerating(false);
    }
  };

  // 1. Loading State
  if (isGenerating) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4 animate-bounce-in">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
          <h3 className="text-xl font-bold text-slate-800">Generating The content please be patient</h3>
          <p className="text-slate-500">Curating the best learning material for you...</p>
        </div>
      </div>
    );
  }

  // 2. Content Available State
  if (content) {
    return (
      <div className="bg-background min-h-screen p-8">
        <div className=" mx-auto space-y-6">
          {/* Top Bar with Generate Another Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleGenerateContent}
              className="bg-white text-purple-600 border-2 border-purple-100 hover:bg-purple-50 hover:border-purple-200 transition-all rounded-xl shadow-sm gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Generate another content
            </Button>
          </div>

          <iframe 
            className="w-full min-h-[900px] bg-white border-none"
            srcDoc={generateClassroomHtml(content)}
            title="Lesson Content"
          />
        </div>
      </div>
    );
  }

  // 3. Initial "Create Content" State
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-md space-y-6">
        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-10 h-10 text-purple-500" />
        </div>
        
        <h2 className="text-3xl font-bold text-slate-900">Start Learning</h2>
        <p className="text-slate-600 text-lg">
          No content has been generated for this classroom yet. Click below to create your first lesson!
        </p>

        <Button 
          onClick={handleGenerateContent}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl px-8 py-6 text-lg font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Create content
        </Button>
      </div>
    </div>
  );
}

export default Learn;