import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorAction {
  label: string;
  href?: string;
  onClick?: () => void;
  primary?: boolean;
}

interface ErrorDisplayProps {
  title: string;
  description: string;
  error?: any;
  actions?: ErrorAction[];
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title,
  description,
  error,
  actions = []
}) => {
  return (
    <div className="bg-[#1A2033] border border-[#2A3142] rounded-lg p-8 text-center my-8">
      <div className="flex justify-center mb-4">
        <AlertTriangle className="h-16 w-16 text-amber-500" />
      </div>
      <h3 className="text-xl font-medium mb-2 text-white">{title}</h3>
      <p className="text-gray-400 mb-4">
        {description}
      </p>
      
      {error && (
        <div className="mt-4 mb-6 p-4 bg-[#171C2C] rounded border border-[#2A3142] text-left">
          <p className="text-sm text-gray-400 mb-2">Error details:</p>
          <pre className="text-xs text-red-400 overflow-auto whitespace-pre-wrap">
            {error instanceof Error ? error.message : JSON.stringify(error, null, 2)}
          </pre>
        </div>
      )}
      
      {actions.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center mt-6">
          {actions.map((action, index) => {
            const Component = action.href ? 'a' : 'button';
            return (
              <Component
                key={index}
                href={action.href}
                onClick={action.onClick}
                className={`px-4 py-2 rounded-md font-medium ${
                  action.primary
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'border border-gray-600 text-gray-300 hover:bg-[#171C2C]'
                }`}
              >
                {action.label}
              </Component>
            );
          })}
        </div>
      )}
    </div>
  );
};