import React from 'react';
import { VerificationResult } from '../types/cryptoSentry.ts';
import { CheckCircle2, AlertTriangle, HelpCircle, ShieldAlert, Cpu, Layers } from 'lucide-react';

interface ResultInfographicProps {
  result: VerificationResult;
}

export const ResultInfographic: React.FC<ResultInfographicProps> = ({ result }) => {
  const { infographicNodes, score, levelLabel } = result;

  const renderStatusTag = (status: 'verified' | 'contradicted' | 'unverified', safeLabel = 'Verified', dangerLabel = 'Mismatch') => {
    if (status === 'verified') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
          {safeLabel}
        </span>
      );
    }
    if (status === 'contradicted') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#800020] bg-[#D45060]/20 border border-[#D45060]/40 px-2 py-0.5 rounded">
          <AlertTriangle className="w-3 h-3 text-[#D45060]" />
          {dangerLabel}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#785863] bg-[#E8D5BF]/60 border border-[#E5D2BE] px-2 py-0.5 rounded">
        <HelpCircle className="w-3 h-3 text-[#785863]" />
        Unverified
      </span>
    );
  };

  return (
    <div className="w-full bg-[#FFF9F2] border border-[#E5D2BE] rounded-xl p-5 sm:p-6 overflow-hidden relative shadow-sm">
      {/* Background glow decoration */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#D45060]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#800020]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider text-[#D45060] font-bold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#D45060]" />
            Verification Flow Architecture
          </span>
          <h4 className="text-base font-bold text-[#800020] mt-0.5">
            How The Evidence Was Evaluated
          </h4>
        </div>
        <span className="text-xs text-[#785863] font-mono hidden sm:inline-block font-semibold">
          Evidence Pipeline Active
        </span>
      </div>

      <div className="flex flex-col items-center">
        {/* Node 1: Top Offer */}
        <div className="relative group">
          <div className="px-5 py-2.5 rounded-lg bg-[#F3E6D5] border border-[#E5D2BE] text-center shadow-xs">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#785863] block font-semibold">Input Source</span>
            <span className="text-sm font-bold text-[#800020] tracking-wide">CRYPTO OFFER CLAIMS</span>
          </div>
          {/* Connector down */}
          <div className="w-0.5 h-6 bg-gradient-to-b from-[#800020] to-[#D45060] mx-auto" />
        </div>

        {/* Node 2: Middle Branch (Grid of 3 parallel checks) */}
        <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-3 gap-3 relative my-1">
          {/* Subtle horizontal connecting bar on desktop */}
          <div className="hidden sm:block absolute -top-3 left-[16.6%] right-[16.6%] h-0.5 bg-[#E5D2BE]" />

          {/* Sub-node: Price */}
          <div className="p-3 rounded-lg bg-[#F3E6D5] border border-[#E5D2BE] hover:border-[#D45060]/40 transition-colors flex flex-col items-center text-center shadow-xs">
            <span className="text-xs font-bold text-[#800020] mb-1">CLAIMED PRICE</span>
            {renderStatusTag(infographicNodes.priceStatus, 'Normal Price', 'Price Mismatch')}
            <span className="text-[10px] text-[#5A3844] mt-1.5 line-clamp-1">
              {infographicNodes.priceStatus === 'contradicted' ? 'Extreme discount detected' : 'Compared to market'}
            </span>
          </div>

          {/* Sub-node: Website */}
          <div className="p-3 rounded-lg bg-[#F3E6D5] border border-[#E5D2BE] hover:border-[#D45060]/40 transition-colors flex flex-col items-center text-center shadow-xs">
            <span className="text-xs font-bold text-[#800020] mb-1">DOMAIN & PORTAL</span>
            {renderStatusTag(infographicNodes.websiteStatus, 'Established', 'Suspicious')}
            <span className="text-[10px] text-[#5A3844] mt-1.5 line-clamp-1">
              {infographicNodes.websiteStatus === 'contradicted' ? 'High-risk domain profile' : 'Domain integrity'}
            </span>
          </div>

          {/* Sub-node: Token */}
          <div className="p-3 rounded-lg bg-[#F3E6D5] border border-[#E5D2BE] hover:border-[#D45060]/40 transition-colors flex flex-col items-center text-center shadow-xs">
            <span className="text-xs font-bold text-[#800020] mb-1">ASSET IDENTITY</span>
            {renderStatusTag(infographicNodes.tokenStatus, 'Verified Listed', 'Unverified Contract')}
            <span className="text-[10px] text-[#5A3844] mt-1.5 line-clamp-1">
              {infographicNodes.tokenStatus === 'verified' ? 'Identified in global registry' : 'Check contract source'}
            </span>
          </div>
        </div>

        {/* Node 3: Convergence into Risk Engine */}
        <div className="relative mt-2">
          <div className="w-0.5 h-6 bg-gradient-to-b from-[#D45060] to-[#800020] mx-auto" />
          <div className="px-5 py-2.5 rounded-lg bg-[#800020] text-white text-center flex items-center gap-2 shadow-md shadow-[#800020]/25">
            <Cpu className="w-4 h-4 text-[#F3E6D5] animate-pulse" />
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#F3E6D5] block font-semibold">AI Evaluation Engine</span>
              <span className="text-xs font-bold text-white tracking-wide">CRYPTOSENTRY RISK ANALYSIS</span>
            </div>
          </div>
          <div className="w-0.5 h-6 bg-gradient-to-b from-[#800020] to-[#D45060] mx-auto" />
        </div>

        {/* Node 4: Final Output Verdict */}
        <div className="w-full max-w-sm mt-1 p-3.5 rounded-xl bg-[#F3E6D5] border border-[#E5D2BE] text-center flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 text-left">
            <div className="p-2 rounded-lg bg-[#FFF9F2] text-[#800020] border border-[#E5D2BE]">
              <ShieldAlert className="w-5 h-5 text-[#800020]" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-mono text-[#785863] block font-semibold">Synthesis Outcome</span>
              <span className="text-sm font-bold text-[#800020]">{levelLabel}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xl font-mono font-extrabold text-[#800020]">{score}</span>
            <span className="text-xs text-[#785863]">/100</span>
          </div>
        </div>
      </div>
    </div>
  );
};
