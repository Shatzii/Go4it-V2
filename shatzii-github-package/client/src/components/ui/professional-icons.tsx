import React from "react";

// Professional SVG icons with enhanced styling
export const ProfessionalShield = ({ className = "w-6 h-6", color = "currentColor" }: { className?: string; color?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#1E40AF" />
      </linearGradient>
    </defs>
    <path
      d="M12 2L3 7V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V7L12 2Z"
      fill="url(#shieldGradient)"
      stroke="none"
    />
    <path
      d="M9 12L11 14L15 10"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export const ProfessionalBrain = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#5B21B6" />
      </linearGradient>
    </defs>
    <path
      d="M12 3C16.97 3 21 7.03 21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3Z"
      fill="url(#brainGradient)"
    />
    <circle cx="8" cy="10" r="1.5" fill="white" opacity="0.8" />
    <circle cx="16" cy="10" r="1.5" fill="white" opacity="0.8" />
    <path
      d="M7 14.5C8.5 16 10.5 17 12 17C13.5 17 15.5 16 17 14.5"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M9 8C9.5 7.5 10.2 7 12 7C13.8 7 14.5 7.5 15 8"
      stroke="white"
      strokeWidth="1"
      strokeLinecap="round"
      fill="none"
      opacity="0.6"
    />
  </svg>
);

export const ProfessionalChart = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="chartGradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="18" height="18" rx="2" fill="url(#chartGradient)" />
    <rect x="7" y="11" width="2" height="6" fill="white" opacity="0.9" />
    <rect x="11" y="9" width="2" height="8" fill="white" opacity="0.9" />
    <rect x="15" y="7" width="2" height="10" fill="white" opacity="0.9" />
    <circle cx="8" cy="10" r="1" fill="white" />
    <circle cx="12" cy="8" r="1" fill="white" />
    <circle cx="16" cy="6" r="1" fill="white" />
    <path d="M8 10L12 8L16 6" stroke="white" strokeWidth="1" opacity="0.7" />
  </svg>
);

export const ProfessionalTruck = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="truckGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <rect x="2" y="8" width="14" height="8" rx="1" fill="url(#truckGradient)" />
    <rect x="16" y="10" width="6" height="6" rx="1" fill="url(#truckGradient)" />
    <circle cx="6" cy="18" r="2" fill="#374151" />
    <circle cx="18" cy="18" r="2" fill="#374151" />
    <circle cx="6" cy="18" r="1" fill="white" />
    <circle cx="18" cy="18" r="1" fill="white" />
    <rect x="4" y="6" width="8" height="2" rx="1" fill="white" opacity="0.3" />
    <rect x="17" y="12" width="3" height="1" rx="0.5" fill="white" opacity="0.5" />
  </svg>
);

export const ProfessionalCpu = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cpuGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#4F46E5" />
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="16" height="16" rx="2" fill="url(#cpuGradient)" />
    <rect x="7" y="7" width="10" height="10" rx="1" fill="white" opacity="0.2" />
    <rect x="9" y="9" width="6" height="6" rx="1" fill="white" opacity="0.9" />
    <rect x="2" y="8" width="2" height="2" fill="#6366F1" />
    <rect x="2" y="11" width="2" height="2" fill="#6366F1" />
    <rect x="2" y="14" width="2" height="2" fill="#6366F1" />
    <rect x="20" y="8" width="2" height="2" fill="#6366F1" />
    <rect x="20" y="11" width="2" height="2" fill="#6366F1" />
    <rect x="20" y="14" width="2" height="2" fill="#6366F1" />
    <rect x="8" y="2" width="2" height="2" fill="#6366F1" />
    <rect x="11" y="2" width="2" height="2" fill="#6366F1" />
    <rect x="14" y="2" width="2" height="2" fill="#6366F1" />
    <rect x="8" y="20" width="2" height="2" fill="#6366F1" />
    <rect x="11" y="20" width="2" height="2" fill="#6366F1" />
    <rect x="14" y="20" width="2" height="2" fill="#6366F1" />
  </svg>
);

export const ProfessionalDatabase = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="dbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#0891B2" />
      </linearGradient>
    </defs>
    <ellipse cx="12" cy="6" rx="8" ry="3" fill="url(#dbGradient)" />
    <ellipse cx="12" cy="6" rx="6" ry="2" fill="white" opacity="0.3" />
    <rect x="4" y="6" width="16" height="6" fill="url(#dbGradient)" />
    <ellipse cx="12" cy="12" rx="8" ry="3" fill="url(#dbGradient)" />
    <ellipse cx="12" cy="12" rx="6" ry="2" fill="white" opacity="0.2" />
    <rect x="4" y="12" width="16" height="6" fill="url(#dbGradient)" />
    <ellipse cx="12" cy="18" rx="8" ry="3" fill="url(#dbGradient)" />
    <ellipse cx="12" cy="18" rx="6" ry="2" fill="white" opacity="0.3" />
  </svg>
);

export const ProfessionalUsers = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="usersGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#BE185D" />
      </linearGradient>
    </defs>
    <circle cx="9" cy="7" r="4" fill="url(#usersGradient)" />
    <circle cx="15" cy="9" r="3" fill="url(#usersGradient)" opacity="0.8" />
    <path
      d="M3 21V19C3 16.7909 4.79086 15 7 15H11C13.2091 15 15 16.7909 15 19V21"
      fill="url(#usersGradient)"
    />
    <path
      d="M16 21V20C16 18.3431 17.3431 17 19 17H20C20.5523 17 21 17.4477 21 18V21"
      fill="url(#usersGradient)"
      opacity="0.8"
    />
    <circle cx="9" cy="7" r="2" fill="white" opacity="0.3" />
    <circle cx="15" cy="9" r="1.5" fill="white" opacity="0.3" />
  </svg>
);

export const ProfessionalActivity = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="activityGradient" x1="0%" y1="50%" x2="100%" y2="50%">
        <stop offset="0%" stopColor="#EF4444" />
        <stop offset="50%" stopColor="#F97316" />
        <stop offset="100%" stopColor="#EAB308" />
      </linearGradient>
    </defs>
    <path
      d="M3 12H6L8 6L12 18L16 9L18 12H21"
      stroke="url(#activityGradient)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <circle cx="8" cy="6" r="2" fill="#EF4444" />
    <circle cx="12" cy="18" r="2" fill="#F97316" />
    <circle cx="16" cy="9" r="2" fill="#EAB308" />
  </svg>
);

export const ProfessionalGlobe = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="globeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0EA5E9" />
        <stop offset="100%" stopColor="#0284C7" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" fill="url(#globeGradient)" />
    <circle cx="12" cy="12" r="8" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
    <circle cx="12" cy="12" r="6" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
    <circle cx="12" cy="12" r="4" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
    <path d="M2 12H22" stroke="white" strokeWidth="1" opacity="0.6" />
    <path d="M12 2V22" stroke="white" strokeWidth="1" opacity="0.6" />
    <path
      d="M8 4C10 6 10 10 8 12C10 14 10 18 8 20"
      stroke="white"
      strokeWidth="1"
      opacity="0.6"
      fill="none"
    />
    <path
      d="M16 4C14 6 14 10 16 12C14 14 14 18 16 20"
      stroke="white"
      strokeWidth="1"
      opacity="0.6"
      fill="none"
    />
  </svg>
);

export const ProfessionalLock = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7C3AED" />
        <stop offset="100%" stopColor="#5B21B6" />
      </linearGradient>
    </defs>
    <rect x="5" y="11" width="14" height="10" rx="2" fill="url(#lockGradient)" />
    <path
      d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11"
      stroke="url(#lockGradient)"
      strokeWidth="2"
      fill="none"
    />
    <circle cx="12" cy="16" r="2" fill="white" opacity="0.9" />
    <rect x="11" y="17" width="2" height="2" fill="white" opacity="0.9" />
  </svg>
);