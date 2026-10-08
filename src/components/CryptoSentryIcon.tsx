import React from 'react';

interface CryptoSentryIconProps {
  className?: string;
  size?: number;
}

export const CryptoSentryIcon: React.FC<CryptoSentryIconProps> = ({
  className = "w-10 h-10",
  size
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      <defs>
        <linearGradient id="csBrandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#800020" />
          <stop offset="50%" stopColor="#9E1B32" />
          <stop offset="100%" stopColor="#D45060" />
        </linearGradient>
      </defs>

      {/* Outer rounded squircle with open top-right corner */}
      <path
        d="M 67 15 L 34 15 C 23.5 15 15 23.5 15 34 L 15 66 C 15 76.5 23.5 85 34 85 L 66 85 C 76.5 85 85 76.5 85 66 L 85 34"
        stroke="url(#csBrandGradient)"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Top-Right Solid Circular Dot Accent */}
      <circle cx="86" cy="14" r="8.5" fill="#D45060" />

      {/* Inner Contoured Security Shield */}
      <path
        d="M 36 39.5 C 43 37.5 46.5 36.5 50 38 C 53.5 36.5 57 37.5 64 39.5 C 64 54.5 57.5 66.5 50 72.5 C 42.5 66.5 36 54.5 36 39.5 Z"
        stroke="url(#csBrandGradient)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};
