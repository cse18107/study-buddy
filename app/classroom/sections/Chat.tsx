import React, {useState, useRef, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Bot, Send, Sparkles, User} from "lucide-react";

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
    {id: "1", text: "Yo! I'm your AI Brain Booster. What's the mission today? 🚀", sender: "bot"},
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
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

    const namespace = classroomDetails?.namespace || classroomDetails?.id || "a0281da8ad4f438793642d5924859a6d";
    const sourceId = classroomDetails?.sources?.[0]?.source_id || classroomDetails?.sources?.[0]?.id || "17e3a65c-87e0-4cdc-aafa-3edc11c77266";

    try {
      const response = await fetch('http://127.0.0.1:8000/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
          text: data.answer || "I couldn't generate an answer. Error code: VIBE_FAIL.",
          sender: "bot",
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        setMessages((prev) => [...prev, { id: Date.now().toString(), text: "System overload. Try again.", sender: "bot" }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { id: Date.now().toString(), text: "Offline. Sync failed.", sender: "bot" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden p-6 md:p-10">
      {/* Header Section */}
      <div className="border-8 border-black bg-primary p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between mb-8 rotate-[-0.5deg]">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 border-4 border-black bg-white flex items-center justify-center animate-shake shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Bot className="w-10 h-10 text-black" strokeWidth={3} />
          </div>
          <div>
            <h2 className="text-3xl md:text-5xl font-black font-heading uppercase leading-none">AI TUTOR</h2>
            <div className="bg-black text-white px-2 py-0.5 text-[10px] font-black uppercase inline-block mt-2">Status: Hyperactive</div>
          </div>
        </div>
        <Sparkles className="w-12 h-12 text-black hidden md:block" />
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden relative border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] bg-[#F8F8F8] mb-8">
        <ScrollArea className="h-full px-8 py-10">
          <div className="space-y-10 max-w-5xl mx-auto pb-10">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 ${
                  msg.sender === "user" ? "flex-row-reverse text-right" : "flex-row"
                }`}
              >
                <div className={`w-12 h-12 flex-shrink-0 border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                    msg.sender === "user" ? "bg-secondary" : "bg-primary"
                }`}>
                    {msg.sender === "user" ? <User strokeWidth={3}/> : <Bot strokeWidth={3}/>}
                </div>
                <div
                  className={`max-w-[80%] px-6 py-4 border-4 border-black font-bold text-sm uppercase leading-tight shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${
                    msg.sender === "user"
                      ? "bg-white text-black"
                      : "bg-[#000] text-white"
                  }`}
                >
                  {msg.sender === "bot" ? (
                      <div className="prose prose-invert max-w-none text-white text-sm" dangerouslySetInnerHTML={{ __html: msg.text }} />
                  ) : (
                    <p>{msg.text}</p>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-4">
                <div className="w-12 h-12 flex-shrink-0 border-4 border-black bg-primary flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse">
                    <Bot strokeWidth={3}/>
                </div>
                <div className="bg-black text-white px-6 py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-black uppercase italic">
                   Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="flex gap-6 items-end">
        <div className="flex-1 relative">
            <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { 
                e.preventDefault(); 
                sendMessage(); 
                }
            }}
            placeholder="TYPE YOUR QUESTION HERE... 💬"
            className="w-full bg-white border-8 border-black h-20 px-8 text-xl font-black uppercase placeholder:text-black/30 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all"
            />
        </div>
        <button
          onClick={sendMessage}
          disabled={isTyping || !input.trim()}
          className="neo-button bg-secondary text-black h-20 w-32 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <Send className="w-10 h-10 group-hover:scale-125 transition-transform" strokeWidth={4} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
