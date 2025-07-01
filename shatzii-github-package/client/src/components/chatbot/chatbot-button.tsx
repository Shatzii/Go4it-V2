import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Chatbot from "./chatbot";

export default function ChatbotButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {!isChatOpen && (
        <Button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-4 right-4 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          size="lg"
        >
          <MessageSquare className="w-6 h-6 text-white" />
          <span className="sr-only">Open AI Assistant</span>
        </Button>
      )}
      
      <Chatbot 
        isOpen={isChatOpen} 
        onToggle={() => setIsChatOpen(!isChatOpen)} 
      />
      
      {/* Pulsing notification dot */}
      {!isChatOpen && (
        <div className="fixed bottom-16 right-16 z-50 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
      )}
    </>
  );
}