'use client';

import React from 'react';

interface SmoothTransitionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function SmoothTransition({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  direction = 'up',
}: SmoothTransitionProps) {
  return <div className={className}>{children}</div>;
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function StaggeredList({
  children,
  className = '',
}: {
  children: React.ReactNode[];
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function SlideInCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function FadeInUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function ScaleIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function SmoothProgress({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`bg-slate-700 rounded-full h-2 ${className}`}>
      <div
        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
