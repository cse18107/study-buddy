import React, {useState, useRef, useEffect} from "react";
import {Button} from "@/components/ui/button"; // Adjust path if needed
import {Input} from "@/components/ui/input";
import {ScrollArea} from "@/components/ui/scroll-area";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {id: "1", text: "Hello! How can I help you today?", sender: "bot"},
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: input,
        sender: "user",
      };
      setMessages((prev) => [...prev, newMessage]);
      setInput("");

      // Simulate bot response (replace with real logic)
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Thanks for your message! I'm processing it.",
          sender: "bot",
        };
        setMessages((prev) => [...prev, botMessage]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-900  overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r bg-[#eeffab] p-4 text-black font-semibold text-center">
        CHAT WITH OUR SPECIALIZED AI
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 bg-black" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              } animate-fade-in`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : "bg-[#252525] text-gray-200"
                } shadow-md`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="flex p-4 bg-[#252525] border-t ">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 bg-[#252525] border-[#252525] text-white placeholder-gray-400 outline-none focus:ring-0"
        />
        <Button
          onClick={sendMessage}
          className="ml-2 bg-[#eeffab] hover:bg-[#c2cf8c] text-black px-4 py-2 rounded-lg transition-all duration-200"
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default Chat;
