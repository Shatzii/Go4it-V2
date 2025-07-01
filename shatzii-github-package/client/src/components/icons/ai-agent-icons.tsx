import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const PharaohIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="pharaoh-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    {/* Crown/Pharaoh headdress */}
    <path
      d="M12 2L15 6H18L16 9L18 12H15L12 8L9 12H6L8 9L6 6H9L12 2Z"
      fill="url(#pharaoh-gradient)"
      stroke="currentColor"
      strokeWidth="0.5"
    />
    {/* Brain/Intelligence center */}
    <circle
      cx="12"
      cy="14"
      r="6"
      fill="none"
      stroke="url(#pharaoh-gradient)"
      strokeWidth="1.5"
      strokeDasharray="2 2"
    />
    {/* Neural connections */}
    <path
      d="M8 14L10 12M16 14L14 12M12 10L12 8"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.6"
    />
    {/* Marketing signals */}
    <circle cx="7" cy="17" r="1" fill="url(#pharaoh-gradient)" opacity="0.8" />
    <circle cx="17" cy="17" r="1" fill="url(#pharaoh-gradient)" opacity="0.8" />
    <circle cx="12" cy="20" r="1" fill="url(#pharaoh-gradient)" opacity="0.8" />
  </svg>
);

export const SentinelIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="sentinel-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    {/* Shield base */}
    <path
      d="M12 2L20 6V12C20 18 12 22 12 22C12 22 4 18 4 12V6L12 2Z"
      fill="none"
      stroke="url(#sentinel-gradient)"
      strokeWidth="1.5"
    />
    {/* Inner shield pattern */}
    <path
      d="M12 4L17 7V12C17 16 12 19 12 19C12 19 7 16 7 12V7L12 4Z"
      fill="url(#sentinel-gradient)"
      opacity="0.3"
    />
    {/* Sales target/crosshair */}
    <circle
      cx="12"
      cy="12"
      r="3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    />
    <path
      d="M12 9V15M9 12H15"
      stroke="currentColor"
      strokeWidth="1"
    />
    {/* Success indicators */}
    <circle cx="12" cy="12" r="1" fill="url(#sentinel-gradient)" />
  </svg>
);

export const NeuralIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
    </defs>
    {/* Brain outline */}
    <path
      d="M9 4C7 4 5 6 5 8C5 9 5.5 10 5.5 11C5.5 13 7 14 8 15C9 16 10 17 12 17C14 17 15 16 16 15C17 14 18.5 13 18.5 11C18.5 10 19 9 19 8C19 6 17 4 15 4C14 4 13 4.5 12 4.5C11 4.5 10 4 9 4Z"
      fill="none"
      stroke="url(#neural-gradient)"
      strokeWidth="1.5"
    />
    {/* Neural pathways */}
    <path
      d="M8 8L10 10L8 12M16 8L14 10L16 12M12 6L12 8M12 13L12 15"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.7"
    />
    {/* Support connections */}
    <circle cx="6" cy="18" r="1.5" fill="none" stroke="url(#neural-gradient)" strokeWidth="1" />
    <circle cx="12" cy="20" r="1.5" fill="none" stroke="url(#neural-gradient)" strokeWidth="1" />
    <circle cx="18" cy="18" r="1.5" fill="none" stroke="url(#neural-gradient)" strokeWidth="1" />
    {/* Connection lines */}
    <path
      d="M8 15L6.5 17M12 17L12 18.5M16 15L17.5 17"
      stroke="url(#neural-gradient)"
      strokeWidth="1"
      opacity="0.6"
    />
  </svg>
);

export const QuantumIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="quantum-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
    </defs>
    {/* Quantum orbital rings */}
    <circle
      cx="12"
      cy="12"
      r="8"
      fill="none"
      stroke="url(#quantum-gradient)"
      strokeWidth="1"
      opacity="0.4"
    />
    <ellipse
      cx="12"
      cy="12"
      rx="8"
      ry="4"
      fill="none"
      stroke="url(#quantum-gradient)"
      strokeWidth="1"
      opacity="0.6"
      transform="rotate(45 12 12)"
    />
    <ellipse
      cx="12"
      cy="12"
      rx="8"
      ry="4"
      fill="none"
      stroke="url(#quantum-gradient)"
      strokeWidth="1"
      opacity="0.6"
      transform="rotate(-45 12 12)"
    />
    {/* Central core */}
    <circle
      cx="12"
      cy="12"
      r="2"
      fill="url(#quantum-gradient)"
    />
    {/* Data points */}
    <circle cx="12" cy="4" r="1" fill="currentColor" opacity="0.8" />
    <circle cx="20" cy="12" r="1" fill="currentColor" opacity="0.8" />
    <circle cx="12" cy="20" r="1" fill="currentColor" opacity="0.8" />
    <circle cx="4" cy="12" r="1" fill="currentColor" opacity="0.8" />
    {/* Analytics lines */}
    <path
      d="M6 6L10 10M18 6L14 10M6 18L10 14M18 18L14 14"
      stroke="url(#quantum-gradient)"
      strokeWidth="0.5"
      opacity="0.5"
    />
  </svg>
);

export const ApolloIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="apollo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#dc2626" />
      </linearGradient>
    </defs>
    {/* Rocket body */}
    <path
      d="M12 2L15 6V14L12 18L9 14V6L12 2Z"
      fill="none"
      stroke="url(#apollo-gradient)"
      strokeWidth="1.5"
    />
    {/* Rocket fins */}
    <path
      d="M9 14L6 16L9 18M15 14L18 16L15 18"
      stroke="url(#apollo-gradient)"
      strokeWidth="1.5"
    />
    {/* Control systems */}
    <circle
      cx="12"
      cy="8"
      r="2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    />
    <path
      d="M10 8L14 8M12 6L12 10"
      stroke="currentColor"
      strokeWidth="1"
    />
    {/* Exhaust/operations */}
    <path
      d="M10 20L12 22L14 20"
      stroke="url(#apollo-gradient)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Operation indicators */}
    <circle cx="8" cy="10" r="0.5" fill="url(#apollo-gradient)" opacity="0.8" />
    <circle cx="16" cy="10" r="0.5" fill="url(#apollo-gradient)" opacity="0.8" />
    <circle cx="12" cy="12" r="0.5" fill="url(#apollo-gradient)" opacity="0.8" />
  </svg>
);

// Composite AI Agent Icon for general use
export const AIAgentIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="ai-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="50%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
    </defs>
    {/* AI Brain core */}
    <circle
      cx="12"
      cy="12"
      r="6"
      fill="none"
      stroke="url(#ai-gradient)"
      strokeWidth="2"
    />
    {/* Neural network */}
    <path
      d="M12 6V10M12 14V18M6 12H10M14 12H18M8.5 8.5L10.5 10.5M13.5 13.5L15.5 15.5M15.5 8.5L13.5 10.5M10.5 13.5L8.5 15.5"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.6"
    />
    {/* Processing nodes */}
    <circle cx="12" cy="12" r="2" fill="url(#ai-gradient)" opacity="0.8" />
    <circle cx="12" cy="6" r="1" fill="currentColor" opacity="0.6" />
    <circle cx="18" cy="12" r="1" fill="currentColor" opacity="0.6" />
    <circle cx="12" cy="18" r="1" fill="currentColor" opacity="0.6" />
    <circle cx="6" cy="12" r="1" fill="currentColor" opacity="0.6" />
  </svg>
);