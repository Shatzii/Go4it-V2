import React from 'react';
import { MessagingInterface } from '@/components/messaging/messaging-interface';
import { MessagingProvider } from '@/contexts/messaging-context';

export default function MessagingPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
        Messaging Center
      </h1>
      <div className="mb-8">
        <p className="text-muted-foreground">
          Connect with coaches and athletes in real-time to discuss opportunities, performance analysis, and training tips.
        </p>
      </div>
      
      <div className="grid place-items-center">
        <MessagingProvider>
          <MessagingInterface />
        </MessagingProvider>
      </div>
    </div>
  );
}