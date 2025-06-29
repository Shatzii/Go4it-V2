import React from 'react';
import { HybridCoachChat } from '@/modules/myplayer/ai-coach/components/HybridCoachChat';

export default function HybridAiCoachPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Hybrid AI Coach
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get personalized training and feedback from our advanced AI coaching system that uses both Claude and GPT models
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <div className="bg-violet-100 dark:bg-violet-950/30 rounded-lg p-3 flex items-center">
            <div className="bg-violet-200 dark:bg-violet-800 rounded-full p-2 mr-2">
              <span className="font-semibold">Claude</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Great for detailed training plans and technique analysis
            </span>
          </div>
          
          <div className="bg-emerald-100 dark:bg-emerald-950/30 rounded-lg p-3 flex items-center">
            <div className="bg-emerald-200 dark:bg-emerald-800 rounded-full p-2 mr-2">
              <span className="font-semibold">GPT</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Excels at stats analysis and quick tactical advice
            </span>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <HybridCoachChat />
      </div>
      
      <div className="mt-12 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">How to Get the Most from Your AI Coach</h2>
        
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Be Specific</h3>
            <p className="text-sm text-muted-foreground">
              The more specific your questions, the more targeted advice you'll receive. Include details about your sport, skill level, and goals.
            </p>
          </div>
          
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Try Different Models</h3>
            <p className="text-sm text-muted-foreground">
              For technical analysis and detailed training plans, Claude often excels. For quick stats and tactical advice, GPT might be better.
            </p>
          </div>
          
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">ADHD-Friendly Techniques</h3>
            <p className="text-sm text-muted-foreground">
              Ask specifically about ADHD-friendly approaches to training, focus techniques, or workout structure if you need accommodations.
            </p>
          </div>
          
          <div className="rounded-lg border p-4">
            <h3 className="font-medium">Describe Videos Clearly</h3>
            <p className="text-sm text-muted-foreground">
              When using video analysis, describe what happens in detail—your form, movements, duration, and the context of the activity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}