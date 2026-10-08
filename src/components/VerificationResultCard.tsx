import React, { useState } from 'react';
import { VerificationResult } from '../types/cryptoSentry.ts';
import { RiskGauge } from './RiskGauge.tsx';
import { SpeakerControl } from './SpeakerControl.tsx';
import { ResultInfographic } from './ResultInfographic.tsx';
import { ManualVerificationModal } from './ManualVerificationModal.tsx';
import { 
  AlertTriangle, CheckCircle2, HelpCircle, 
  ArrowRight, Compass, ShieldAlert, Share2, 
  ChevronRight, Info
} from 'lucide-react';

interface VerificationResultCardProps {
  result: VerificationResult;
}

export const VerificationResultCard: React.FC<VerificationResultCardProps> = ({ result }) => {
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const verifiedCount = result.evidenceCards.filter((e) => e.status === 'verified').length;
  const contradictedCount = result.evidenceCards.filter((e) => e.status === 'contradicted').length;
  const unverifiedCount = result.evidenceCards.filter((e) => e.status === 'unverified').length;

  const handleShare = () => {
    const textToCopy = `CryptoSentry AI Assessment:\nRisk Score: ${result.score}/100 (${result.levelLabel})\nConfidence: ${result.confidence}% (${result.confidenceLabel})\nRecommendation: ${result.recommendedAction}`;
    navigator.clipboard?.writeText(textToCopy);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const fullReportNarration = `Verification Result: Risk score ${result.score} out of 100, classified as ${result.levelLabel}. Evidence confidence is ${result.confidence} percent, which is ${result.confidenceLabel}. ${result.assessmentText}. Recommended action: ${result.recommendedAction}.`;

  return (
    <div className="w-full bg-[#FFF9F2] border border-[#E5D2BE] rounded-2xl overflow-hidden shadow-lg transition-all">
      
      {/* 1. Header Banner */}
      <div className="bg-[#F3E6D5] border-b border-[#E5D2BE] px-5 sm:px-7 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#FFF9F2] border border-[#E5D2BE] text-[#800020] shadow-xs">
            <ShieldAlert className="w-5 h-5 text-[#800020]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#D45060] font-bold">
                Official AI Verification Report
              </span>
              <span className="text-xs text-[#785863]">·</span>
              <span className="text-xs text-[#785863] font-mono">{result.timestamp}</span>
            </div>
            <h3 className="text-lg font-bold text-[#800020]">
              Cryptocurrency Offer Risk Assessment
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <SpeakerControl textToSpeak={fullReportNarration} label="Listen to Report" />
          
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFF9F2] hover:bg-[#EBD6C1] text-[#800020] border border-[#E5D2BE] text-xs font-semibold transition-colors shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5 text-[#800020]" />
            <span>{copiedShare ? 'Copied Link' : 'Share'}</span>
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-7 space-y-8">
        
        {/* 2. Primary Risk Gauge & Evidence Confidence Top Cluster */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-[#F3E6D5] border border-[#E5D2BE] rounded-2xl p-5 sm:p-6 shadow-xs">
          
          {/* Left Column: Risk Gauge */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-[#E5D2BE] pb-6 lg:pb-0 lg:pr-6">
            <RiskGauge
              score={result.score}
              level={result.level}
              levelLabel={result.levelLabel}
            />
          </div>

          {/* Right Column: Evidence Confidence & Assessment Summary */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Confidence Metric */}
            <div className="flex items-start justify-between gap-4 p-3.5 rounded-xl bg-[#FFF9F2] border border-[#E5D2BE]">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#785863] block mb-0.5 font-bold">
                  Evidence Confidence
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold font-mono text-[#800020]">
                    {result.confidence}%
                  </span>
                  <span className="text-xs font-bold text-[#5A3844]">
                    — {result.confidenceLabel}
                  </span>
                </div>
                <p className="text-xs text-[#5A3844] mt-1 leading-relaxed">
                  {result.confidenceReason}
                </p>
              </div>

              <div className="p-2 rounded-lg bg-[#F3E6D5] text-[#800020] shrink-0 border border-[#E5D2BE]">
                <Info className="w-4 h-4" />
              </div>
            </div>

            {/* Assessment Statement */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#785863] font-bold">
                  Executive Assessment
                </span>
                <SpeakerControl textToSpeak={result.assessmentText} label="Listen" />
              </div>
              <p className="text-sm text-[#2A0812] leading-relaxed">
                {result.assessmentText}
              </p>
            </div>

            {/* Available vs Unverified Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <div className="p-2.5 rounded-lg bg-[#FFF9F2] border border-[#E5D2BE]">
                <span className="text-[10px] font-mono uppercase text-emerald-800 font-bold block mb-1">
                  ✓ Available Evidence Analyzed ({result.availableEvidence.length})
                </span>
                <ul className="text-xs text-[#5A3844] space-y-1">
                  {result.availableEvidence.map((ev, i) => (
                    <li key={i} className="flex items-center gap-1.5 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                      <span className="truncate">{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-2.5 rounded-lg bg-[#FFF9F2] border border-[#E5D2BE]">
                <span className="text-[10px] font-mono uppercase text-[#785863] font-bold block mb-1">
                  ? Pending / Undisclosed Info ({result.unverifiedFields.length})
                </span>
                <ul className="text-xs text-[#785863] space-y-1">
                  {result.unverifiedFields.map((un, i) => (
                    <li key={i} className="flex items-center gap-1.5 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#785863] shrink-0" />
                      <span className="truncate">{un}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Verification Summary Quick Cards & Evidence Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left: Summary Metrics */}
          <div className="md:col-span-5 space-y-4">
            <span className="text-xs font-mono uppercase text-[#785863] font-bold block">
              Verification Tally
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-center">
                <div className="flex items-center justify-center gap-1 text-emerald-800 mb-0.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span className="text-base font-bold font-mono">{verifiedCount}</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-emerald-800">Verified</span>
              </div>

              <div className="p-3 rounded-xl bg-[#D45060]/15 border border-[#D45060]/30 text-center">
                <div className="flex items-center justify-center gap-1 text-[#800020] mb-0.5">
                  <AlertTriangle className="w-4 h-4 text-[#D45060]" />
                  <span className="text-base font-bold font-mono">{contradictedCount}</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-[#800020]">Contradicted</span>
              </div>

              <div className="p-3 rounded-xl bg-[#F3E6D5] border border-[#E5D2BE] text-center">
                <div className="flex items-center justify-center gap-1 text-[#785863] mb-0.5">
                  <HelpCircle className="w-4 h-4 text-[#785863]" />
                  <span className="text-base font-bold font-mono">{unverifiedCount}</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-[#785863]">Unverified</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F3E6D5] border border-[#E5D2BE] space-y-2">
              <span className="text-[11px] font-mono uppercase text-[#D45060] font-bold block">
                Recommended Action
              </span>
              <p className="text-sm font-bold text-[#800020] leading-snug">
                {result.recommendedAction}
              </p>
              <SpeakerControl textToSpeak={result.recommendedAction} label="Listen to Action" className="mt-2" />
            </div>
          </div>

          {/* Right: Evidence Breakdown Progress Bars */}
          <div className="md:col-span-7 p-4 sm:p-5 rounded-xl bg-[#F3E6D5] border border-[#E5D2BE] space-y-3.5">
            <span className="text-xs font-mono uppercase text-[#785863] font-bold block">
              Evidence Breakdown Across Critical Vectors
            </span>

            <div className="space-y-3">
              {result.evidenceBreakdown.map((item, idx) => {
                let barColor = 'bg-emerald-600';
                if (item.score > 70) barColor = 'bg-[#800020]';
                else if (item.score > 40) barColor = 'bg-[#D45060]';

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#2A0812] font-semibold">{item.label}</span>
                      <span className="font-mono text-[#785863] font-medium">
                        {item.score > 70 ? 'High Risk' : item.score > 40 ? 'Moderate' : 'Consistent'} ({item.score}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#E5D2BE] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                        style={{ width: `${Math.max(item.score, 6)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* 4. "Why did we get this result?" - Deep Visual Evidence Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase text-[#D45060] font-bold">
                Reasoning & Evidence Logs
              </span>
              <h4 className="text-base font-bold text-[#800020] mt-0.5">
                Why Did We Get This Result?
              </h4>
            </div>
            <span className="text-xs text-[#785863]">
              Clear non-technical comparisons
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {result.evidenceCards.map((card) => {
              const isBad = card.status === 'contradicted';
              const isGood = card.status === 'verified';

              return (
                <div
                  key={card.id}
                  className={`p-5 rounded-xl border transition-all ${
                    isBad
                      ? 'bg-[#F3E6D5] border-[#D45060]/40'
                      : isGood
                      ? 'bg-emerald-50/40 border-emerald-300'
                      : 'bg-[#F3E6D5] border-[#E5D2BE]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${
                        isBad ? 'bg-[#D45060]/20 text-[#800020]' : isGood ? 'bg-emerald-100 text-emerald-800' : 'bg-[#E5D2BE] text-[#785863]'
                      }`}>
                        {isBad ? <AlertTriangle className="w-4 h-4" /> : isGood ? <CheckCircle2 className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
                      </div>
                      <h5 className="text-base font-bold text-[#800020]">
                        {card.title}
                      </h5>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isBad ? 'text-[#800020] bg-[#D45060]/20' : isGood ? 'text-emerald-800 bg-emerald-100' : 'text-[#785863] bg-[#FFF9F2]'
                      }`}>
                        {card.status}
                      </span>
                      <SpeakerControl 
                        textToSpeak={`${card.title}. Claimed by promoter: ${card.claimedValue}. Independent reference: ${card.referenceValue}. ${card.explanation}. Why this matters: ${card.whyItMatters}`} 
                        label="Listen" 
                      />
                    </div>
                  </div>

                  {/* Claim vs Reference Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
                    <div className="p-3 rounded-lg bg-[#FFF9F2] border border-[#E5D2BE]">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#785863] block mb-0.5 font-bold">
                        Claimed by Promoter
                      </span>
                      <span className="text-sm font-semibold text-[#2A0812] font-mono">
                        {card.claimedValue}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#FFF9F2] border border-[#E5D2BE]">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#800020] block mb-0.5 font-bold">
                        Independent Market Reference
                      </span>
                      <span className="text-sm font-semibold text-[#800020] font-mono">
                        {card.referenceValue}
                      </span>
                    </div>
                  </div>

                  {/* Explanation text */}
                  <p className="text-xs sm:text-sm text-[#5A3844] leading-relaxed mb-3">
                    {card.explanation}
                  </p>

                  {/* Why this matters callout */}
                  <div className="p-3 rounded-lg bg-[#FFF9F2] border border-[#E5D2BE] flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-[#D45060] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-bold text-[#800020] uppercase tracking-wide block mb-0.5">
                        Why does this matter?
                      </span>
                      <p className="text-xs text-[#5A3844] leading-relaxed">
                        {card.whyItMatters}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Claim vs Evidence Flowchart comparison */}
        {result.comparisons.length > 0 && (
          <div className="p-5 rounded-xl bg-[#F3E6D5] border border-[#E5D2BE] space-y-4">
            <span className="text-xs font-mono uppercase text-[#785863] font-bold block">
              Claim vs. Independent Check Direct Mapping
            </span>

            <div className="space-y-3">
              {result.comparisons.map((comp, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#FFF9F2] border border-[#E5D2BE] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div className="flex-1 space-y-0.5">
                    <span className="text-[10px] font-mono uppercase text-[#D45060] block font-bold">Promoter Claim</span>
                    <span className="text-[#2A0812] font-semibold">{comp.claim}</span>
                  </div>

                  <ArrowRight className="w-4 h-4 text-[#800020] shrink-0 hidden md:block" />

                  <div className="flex-1 space-y-0.5">
                    <span className="text-[10px] font-mono uppercase text-[#800020] block font-bold">Independent Check</span>
                    <span className="text-[#5A3844]">{comp.check}</span>
                  </div>

                  <ArrowRight className="w-4 h-4 text-[#800020] shrink-0 hidden md:block" />

                  <div className="flex-1 space-y-0.5">
                    <span className="text-[10px] font-mono uppercase text-[#800020] block font-bold">Analysis Outcome</span>
                    <span className="text-[#800020] font-bold">{comp.result}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Result Infographic Component */}
        <ResultInfographic result={result} />

        {/* 7. Action Button: "🔎 Verify It Yourself" */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#F3E6D5] border border-[#E5D2BE] shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-bold text-[#800020] flex items-center justify-center sm:justify-start gap-2">
              <Compass className="w-5 h-5 text-[#800020]" />
              Empower Your Decision: Manual Verification Guide
            </h4>
            <p className="text-xs sm:text-sm text-[#5A3844] max-w-xl">
              Don't just take the AI's word for it. Learn the exact questions to ask the promoter and how to verify market trackers, domain registries, and smart contracts yourself.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsManualModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#800020] hover:bg-[#68001a] text-white font-bold text-sm tracking-wide shadow-md shadow-[#800020]/25 flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer"
          >
            <span>🛡 Verify It Yourself</span>
            <ChevronRight className="w-4 h-4 text-[#F3E6D5]" />
          </button>
        </div>

      </div>

      {/* Manual Verification Modal / Sheet */}
      <ManualVerificationModal
        result={result}
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
      />
    </div>
  );
};
