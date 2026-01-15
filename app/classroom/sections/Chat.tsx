import React, {useState, useRef, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Bot, Send, Sparkles, Trash2, Copy, Check} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import { getApiUrl } from '@/lib/api-config';

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

interface ChatProps {
  classroomDetails?: any;
}

const Chat: React.FC<ChatProps> = ({ classroomDetails }) => {
  const [messages, setMessages] = useState<Message[]>([
    {id: "1", text: "Hello! I'm your AI study buddy. How can I help you learn today? 📚", sender: "bot"},
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Summarize this topic",
    "Key concepts to remember",
    "Create a quiz for me",
    "Explain like I'm five"
  ];

  const clearChat = () => {
    setMessages([{id: "1", text: "Hello! I'm your AI study buddy. How can I help you learn today? 📚", sender: "bot"}]);
  };

  const copyToClipboard = (text: string, id: string) => {
    // Strip HTML for copying
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = text;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";
    navigator.clipboard.writeText(plainText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // const token = localStorage.getItem("access_token");
    
    // Determine IDs from props or fallbacks
    // Use the first source's ID if available
    const namespace = classroomDetails?.sources[0]?.document;
    const sourceId = classroomDetails?.sources?.[0]?.source_id || classroomDetails?.sources?.[0]?.id || "17e3a65c-87e0-4cdc-aafa-3edc11c77266";

    try {
      const response = await fetch(getApiUrl('/api/generate-content'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}` // Endpoint might not need auth in the example, but good to have if needed. 
          // User curl didn't show Auth header, but standard practice usually needs it. 
          // I will replicate the user's cURL exactly first, but maybe keep Auth if it was used elsewhere?
          // User cURL: "curl --location ... --header 'Content-Type: application/json' ..."
          // No Authorization header in the user's snippet. Use cautiously.
        },
        body: JSON.stringify({
          question: userMessage.text,
          namespace: namespace,
          source_id: sourceId
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.answer || "I couldn't generate an answer. Please try again.",
          sender: "bot",
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        console.error("Failed to get response");
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Sorry, I encountered an error getting the answer.",
          sender: "bot",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, something went wrong. Please check your connection.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };



  return (
    <div className="flex flex-col h-screen w-full bg-[#f8fafc] overflow-hidden">
      {/* Header with Glassmorphism */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200/60 p-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent leading-none mb-1">
                Study Buddy AI
              </h2>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-green-500" />
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Online & Ready</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearChat}
                    className="h-10 w-10 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors rounded-xl"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Clear conversation</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-full" ref={scrollRef}>
          <div className="space-y-8 max-w-4xl mx-auto px-6 py-10">
            {messages.map((msg, idx) => (
              <div
                key={msg.id}
                className={`flex group ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                } animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {msg.sender === "bot" && (
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mr-4 shadow-sm flex-shrink-0 mt-1">
                    <Bot className="w-6 h-6 text-blue-600" />
                  </div>
                )}
                
                <div className={`relative max-w-[80%] ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                  <div
                    className={`inline-block px-5 py-3.5 rounded-3xl text-[0.9375rem] shadow-sm relative transition-all duration-300 ${
                      msg.sender === "user"
                        ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-tr-none hover:shadow-blue-200/50 hover:shadow-lg"
                        : "bg-white text-slate-700 border border-slate-200/60 rounded-tl-none hover:border-slate-300 group-hover:shadow-md"
                    }`}
                  >
                    {msg.sender === "bot" ? (
                      <div className="flex flex-col gap-2">
                        <div 
                          className="prose prose-slate prose-chat prose-sm sm:prose-base max-w-none leading-relaxed prose-headings:text-slate-900 prose-p:text-slate-700 prose-strong:text-slate-900 prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-blue-600 prose-code:before:content-none prose-code:after:content-none"
                          dangerouslySetInnerHTML={{ __html: msg.text }} 
                        />
                        <div className="flex items-center justify-end border-t border-slate-100 pt-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            onClick={() => copyToClipboard(msg.text, msg.id)}
                          >
                            {copiedId === msg.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mr-4 shadow-sm mt-1">
                  <Bot className="w-6 h-6 text-blue-600" />
                </div>
                <div className="bg-white px-5 py-4 rounded-3xl border border-slate-200/60 shadow-sm rounded-tl-none">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-duration:0.8s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="relative z-10 max-w-5xl mx-auto w-full px-6 pb-8 pt-2">
        {/* Suggestions */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
          {suggestions.map((text) => (
            <button
              key={text}
              onClick={() => {
                setInput(text);
                // Optional: Auto-send after click? Maybe not, let user edit.
              }}
              className="whitespace-nowrap px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3" />
              {text}
            </button>
          ))}
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[1.5rem] blur opacity-10 group-focus-within:opacity-20 transition duration-300" />
          <div className="relative flex items-end gap-3 p-2 bg-white border border-slate-200 shadow-xl rounded-[1.4rem]">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                // Auto-resize textarea
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { 
                  e.preventDefault(); 
                  sendMessage(); 
                }
              }}
              placeholder="Ask a question about your studies..."
              className="flex-1 bg-transparent border-0 text-slate-900 placeholder-slate-400 focus:ring-0 rounded-xl py-3 px-4 resize-none max-h-32 text-[0.9375rem] leading-relaxed"
            />
            <Button
              onClick={sendMessage}
              disabled={isTyping || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-[1rem] h-11 w-11 p-0 flex-shrink-0 shadow-lg shadow-blue-200 transition-all duration-300 disabled:opacity-50 disabled:bg-slate-200 disabled:shadow-none mb-0.5"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-3 font-medium uppercase tracking-widest">
          AI-generated responses may contain inaccuracies. Verify important info.
        </p>
      </div>
    </div>
  );
};

export default Chat;
