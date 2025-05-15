import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

// Simple homepage without complex components or API calls
export default function SimpleHome() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
          Go4It Sports Platform
        </h1>
        
        <p className="text-xl mb-8 text-gray-300">
          Advanced sports analytics for neurodivergent student athletes
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 py-3 rounded-lg shadow-lg">
            <Link href="/auth">
              Get Started
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-900/20 px-8 py-3 rounded-lg">
            <Link href="/about">
              Learn More
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}