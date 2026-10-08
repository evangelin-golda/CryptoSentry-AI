import React from 'react';
import { RiskLevel } from '../types/cryptoSentry.ts';

interface RiskGaugeProps {
  score: number; // 0 to 100
  level: RiskLevel;
  levelLabel: string;
  size?: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  level,
  levelLabel,
  size = 240
}) => {
  // Semi-circle gauge geometry
  // Angle spans from -180deg (left, score 0) to 0deg (right, score 100)
  const radius = 88;
  const strokeWidth = 14;
  const center = size / 2;
  const circumference = Math.PI * radius; // Half-circle circumference
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Needle angle (-180deg to 0deg)
  const needleAngle = -180 + (score / 100) * 180;

  // Color mapping based on risk level
  const getColorScheme = () => {
    switch (level) {
      case 'low':
        return {
          stroke: '#10B981', // emerald
          glow: 'rgba(16, 185, 129, 0.3)',
          badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          dot: 'bg-emerald-400'
        };
      case 'generally_safe':
        return {
          stroke: '#38BDF8', // sky
          glow: 'rgba(56, 189, 248, 0.3)',
          badgeBg: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
          dot: 'bg-sky-400'
        };
      case 'moderate':
        return {
          stroke: '#FBBF24', // amber
          glow: 'rgba(251, 191, 36, 0.3)',
          badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          dot: 'bg-amber-400'
        };
      case 'high':
        return {
          stroke: '#F97316', // orange
          glow: 'rgba(249, 115, 22, 0.3)',
          badgeBg: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
          dot: 'bg-orange-400'
        };
      case 'very_high':
      default:
        return {
          stroke: '#EF4444', // red
          glow: 'rgba(239, 68, 68, 0.35)',
          badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          dot: 'bg-rose-500'
        };
    }
  };

  const scheme = getColorScheme();

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <div style={{ width: size, height: size * 0.62 }} className="relative flex items-center justify-center">
        <svg
          width={size}
          height={size * 0.65}
          viewBox={`0 0 ${size} ${size * 0.65}`}
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="25%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#FBBF24" />
              <stop offset="75%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>

            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={scheme.stroke} floodOpacity="0.45" />
            </filter>
          </defs>

          {/* Background Track Arc */}
          <path
            d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
            fill="none"
            stroke="#E5D2BE"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Dynamic Value Arc */}
          <path
            d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            filter="url(#gaugeGlow)"
            className="transition-all duration-1000 ease-out"
          />

          {/* Needle Center Pivot */}
          <circle cx={center} cy={center} r={6} fill="#800020" />
          <circle cx={center} cy={center} r={10} fill="none" stroke="#D45060" strokeWidth="2" />

          {/* Needle Arm */}
          <g transform={`rotate(${needleAngle} ${center} ${center})`} className="transition-transform duration-1000 ease-out">
            <line
              x1={center}
              y1={center}
              x2={center + radius - 16}
              y2={center}
              stroke="#800020"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>

          {/* Scale Labels */}
          <text x={center - radius - 2} y={center + 18} fill="#785863" fontSize="11" fontWeight="600" textAnchor="middle">0</text>
          <text x={center} y={center - radius + 2} fill="#785863" fontSize="11" fontWeight="600" textAnchor="middle">50</text>
          <text x={center + radius + 2} y={center + 18} fill="#785863" fontSize="11" fontWeight="600" textAnchor="middle">100</text>
        </svg>

        {/* Center Score Reading */}
        <div className="absolute top-[38%] left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold tracking-tight text-[#800020] font-mono">
              {score}
            </span>
            <span className="text-xs font-semibold text-[#785863]">/ 100</span>
          </div>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#785863] mt-0.5">
            Risk Score
          </span>
        </div>
      </div>

      {/* Visual Risk Label Badge */}
      <div className={`mt-1 inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${scheme.badgeBg}`}>
        <span className={`w-2 h-2 rounded-full ${scheme.dot} animate-pulse`} />
        <span>{levelLabel}</span>
      </div>
    </div>
  );
};
