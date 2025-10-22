'use client';

import { useEffect, useRef } from 'react';

interface GPTEmbedProps {
  assistantId?: string;
  threadId?: string;
  className?: string;
  height?: string;
  width?: string;
}

export default function GPTEmbed({
  assistantId = "asst_go4it_sports_gpt_v4",
  threadId,
  className = "",
  height = "600px",
  width = "100%"
}: GPTEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load ChatGPT script if not already loaded
    if (!document.querySelector('script[src*="chatgpt.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://cdn.openai.com/chatgpt-plugin.js';
      script.async = true;
      document.head.appendChild(script);
    }

    // Initialize the embed when the script loads
    const initEmbed = () => {
      if (window.ChatGPT && containerRef.current) {
        window.ChatGPT.init({
          assistantId,
          threadId,
          container: containerRef.current,
          config: {
            theme: 'light',
            primaryColor: '#1e40af',
            height,
            width,
            welcomeMessage: "Welcome to Go4it Sports Academy! I'm your AI assistant. How can I help you today?",
            placeholder: "Ask me about our programs, events, or how to get started..."
          }
        });
      }
    };

    // Check if script is already loaded
    if (window.ChatGPT) {
      initEmbed();
    } else {
      // Wait for script to load
      const checkScript = setInterval(() => {
        if (window.ChatGPT) {
          clearInterval(checkScript);
          initEmbed();
        }
      }, 100);

      // Cleanup after 10 seconds
      setTimeout(() => clearInterval(checkScript), 10000);
    }
  }, [assistantId, threadId, height, width]);

  return (
    <div
      ref={containerRef}
      className={`gpt-embed-container ${className}`}
      style={{ height, width, minHeight: '400px' }}
    >
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Go4it Sports GPT...</p>
        </div>
      </div>
    </div>
  );
}

// TypeScript declaration for ChatGPT global
declare global {
  interface Window {
    ChatGPT: {
      init: (config: {
        assistantId: string;
        threadId?: string;
        container: HTMLElement;
        config: {
          theme: string;
          primaryColor: string;
          height: string;
          width: string;
          welcomeMessage: string;
          placeholder: string;
        };
      }) => void;
    };
  }
}