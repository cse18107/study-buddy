import React, {useState, useRef, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Bot, Send, Sparkles} from "lucide-react";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

    const token = localStorage.getItem("token") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzYWlrYXRAZ21haWwuY29tIiwiZXhwIjoxNzY1NjMzODU3fQ.KLK4GyPoU-7aw2bMmvIeP-pToo6ga3OzN8qbMEgLDzI";
    
    // Determine IDs from props or fallbacks
    // Use the first source's ID if available
    const namespace = classroomDetails?.namespace || classroomDetails?.id || "a0281da8ad4f438793642d5924859a6d";
    const sourceId = classroomDetails?.sources?.[0]?.source_id || classroomDetails?.sources?.[0]?.id || "17e3a65c-87e0-4cdc-aafa-3edc11c77266";

    try {
      const response = await fetch('http://127.0.0.1:8000/api/generate-content', {
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 justify-center">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading">AI Study Assistant</h2>
            <p className="text-sm opacity-90">Ask me anything about your studies!</p>
          </div>
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-full px-6 py-6" ref={scrollRef}>
          <div className="space-y-6 max-w-4xl mx-auto pb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                } animate-slide-up`}
              >
                {msg.sender === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mr-3 shadow-lg flex-shrink-0 mt-1">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] px-6 py-4 rounded-2xl text-sm shadow-md ${
                    msg.sender === "user"
                      ? "bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-tr-none"
                      : "bg-white text-slate-800 border border-slate-200 rounded-tl-none prose prose-slate max-w-none"
                  }`}
                >
                  {msg.sender === "bot" ? (
                     <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                  ) : (
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start animate-bounce-in">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mr-3 shadow-lg mt-1">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-md rounded-tl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            {/* Invisible div to scroll to */}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="flex gap-3 p-6 bg-white border-t border-slate-200 shadow-lg">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            // Use onKeyDown for better Enter handling (e.g. avoid double submit if IME)
            if (e.key === "Enter" && !e.shiftKey) { 
              e.preventDefault(); 
              sendMessage(); 
            }
          }}
          placeholder="Ask me anything... 💬"
          className="flex-1 bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl h-12 px-4"
        />
        <Button
          onClick={sendMessage}
          disabled={isTyping || !input.trim()}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 rounded-xl h-12 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default Chat;
