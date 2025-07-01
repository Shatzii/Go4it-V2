import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Chatbot({ isOpen, onToggle }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hi! I'm your AI assistant for Shatzii's products. I can help you with questions about our AI solutions, pricing, technical details, and more. How can I assist you today?",
      role: "assistant",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      
      return await response.json();
    },
    onSuccess: (response) => {
      const assistantMessage: Message = {
        id: Date.now().toString() + "-assistant",
        content: response.reply,
        role: "assistant",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    },
    onError: (error) => {
      const errorMessage: Message = {
        id: Date.now().toString() + "-error",
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment or contact our support team directly.",
        role: "assistant",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  });

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString() + "-user",
      content: inputValue,
      role: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    chatMutation.mutate(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
      isMinimized ? "w-16 h-16" : "w-96 h-[600px]"
    }`}>
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden h-full flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            {!isMinimized && (
              <div>
                <h3 className="text-white font-semibold">AI Assistant</h3>
                <p className="text-blue-100 text-xs">
                  {chatMutation.isPending ? "Thinking..." : "Online"}
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {!isMinimized && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="text-white hover:bg-white/20"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            )}
            {isMinimized && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(false)}
                className="text-white hover:bg-white/20"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === "user" 
                        ? "bg-blue-600" 
                        : "bg-gradient-to-br from-indigo-500 to-purple-600"
                    }`}>
                      {message.role === "user" ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={`flex-1 max-w-[80%] ${
                      message.role === "user" ? "text-right" : ""
                    }`}>
                      <div className={`p-3 rounded-2xl ${
                        message.role === "user"
                          ? "bg-blue-600 text-white ml-auto"
                          : "bg-gray-100 text-gray-900"
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {chatMutation.isPending && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-100 p-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={chatMutation.isPending}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || chatMutation.isPending}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Ask about our AI solutions, pricing, or technical details
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}