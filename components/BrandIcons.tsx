"use client";

import React from "react";

export type BrandIconProps = {
  size?: number;
  className?: string;
  title?: string;
};

// All icons use currentColor for fill/stroke so they inherit color from CSS (e.g., .icon-blueglow)

export const InstagramIcon: React.FC<BrandIconProps> = ({ size = 22, className = "", title = "Instagram" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    aria-label={title}
    role="img"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export const FacebookIcon: React.FC<BrandIconProps> = ({ size = 22, className = "", title = "Facebook" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    aria-label={title}
    role="img"
    className={className}
    fill="currentColor"
  >
    <path d="M22 12.07C22 6.48 17.52 2 11.93 2 6.35 2 1.86 6.48 1.86 12.07c0 4.86 3.54 8.89 8.17 9.79v-6.93H7.88v-2.86h2.15V9.86c0-2.12 1.26-3.3 3.18-3.3.92 0 1.88.16 1.88.16v2.06h-1.06c-1.04 0-1.36.65-1.36 1.31v1.57h2.31l-.37 2.86h-1.94v6.93c4.64-.9 8.17-4.93 8.17-9.79z" />
  </svg>
);

export const XIcon: React.FC<BrandIconProps> = ({ size = 22, className = "", title = "X (Twitter)" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    aria-label={title}
    role="img"
    className={className}
    fill="currentColor"
  >
    <path d="M18.244 2H21l-6.52 7.45L22.5 22h-6.24l-4.35-6.12L6.9 22H4.14l7.06-8.07L1.5 2h6.36l3.93 5.58L18.244 2Zm-1.09 18h1.53L6.92 4h-1.5l11.734 16Z" />
  </svg>
);

export const TikTokIcon: React.FC<BrandIconProps> = ({ size = 22, className = "", title = "TikTok" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    aria-label={title}
    role="img"
    className={className}
    fill="currentColor"
  >
    <path d="M21 8.5a6.5 6.5 0 0 1-5.4-2.92v8.4a5.98 5.98 0 1 1-6.74-5.93v2.61a3.42 3.42 0 1 0 2.37 3.27V2h2.63a6.49 6.49 0 0 0 5.14 5.03V8.5Z" />
  </svg>
);

export const YouTubeIcon: React.FC<BrandIconProps> = ({ size = 22, className = "", title = "YouTube" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    aria-label={title}
    role="img"
    className={className}
    fill="currentColor"
  >
    <path d="M23 12s0-3.37-.43-4.85a3.06 3.06 0 0 0-2.16-2.16C18.93 4.56 12 4.56 12 4.56s-6.93 0-8.41.43A3.06 3.06 0 0 0 1.43 7.15C1 8.63 1 12 1 12s0 3.37.43 4.85a3.06 3.06 0 0 0 2.16 2.16c1.48.43 8.41.43 8.41.43s6.93 0 8.41-.43a3.06 3.06 0 0 0 2.16-2.16C23 15.37 23 12 23 12ZM9.75 15.02V8.98L15.5 12l-5.75 3.02Z" />
  </svg>
);

const BrandIcons = { InstagramIcon, FacebookIcon, XIcon, TikTokIcon, YouTubeIcon };
export default BrandIcons;
