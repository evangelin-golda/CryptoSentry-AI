import React, { useState } from 'react';
import { VerificationResult } from '../types/cryptoSentry.ts';
import { SpeakerControl } from './SpeakerControl.tsx';
import { 
  X, CheckSquare, Square, ChevronDown, ChevronUp, ShieldCheck, 
  Printer, BookOpen, AlertCircle
} from 'lucide-react';

interface ManualVerificationModalProps {
  result: VerificationResult;
  isOpen: boolean;
  onClose: () => void;
}

interface ChecklistItem {
  id: string;
  title: string;
  explanation: string;
  category: 'price' | 'contract' | 'domain' | 'security' | 'psychology';
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  {
    id: 'check-price',
    title: 'Check the original market price',
    explanation: 'Search the token ticker on independent aggregators (CoinMarketCap, CoinGecko). If someone is selling high-cap crypto at a 50%+ discount, it is virtually always a fraudulent advance-fee trap.',
    category: 'price'
  },
  {
    id: 'check-token',
    title: 'Verify the token exists',
    explanation: 'Check whether the token has real trading volume and listed exchange pairs. Anyone can generate a counterfeit token with the exact same name as Bitcoin or Tether in minutes.',
    category: 'contract'
  },
  {
    id: 'check-contract',
    title: 'Verify the official contract address',
    explanation: 'Never trust a contract address pasted in a private message. Always cross-check the address with the project’s official documentation and certified GitHub or CoinMarketCap page.',
    category: 'contract'
  },
  {
    id: 'check-liquidity',
    title: 'Check trading and liquidity information',
    explanation: 'Examine if liquidity is locked on DexScreener or Uniswap. Malicious tokens allow you to buy, but their smart contract code blocks you from selling (honeypot trap).',
    category: 'contract'
  },
  {
    id: 'check-domain',
    title: 'Check the website independently',
    explanation: 'Do not click links sent in Telegram or WhatsApp. Type the known web address directly into your browser. Check domain age on whois.domaintools.com — brand-new domains claiming years of track record are fraudulent.',
    category: 'domain'
  },
  {
    id: 'check-returns',
    title: 'Question guaranteed-return claims',
    explanation: 'No legal financial entity in the world can guarantee fixed daily or weekly yields in crypto markets. Promoters promising "10% daily risk-free" are operating Ponzi structures.',
    category: 'psychology'
  },
  {
    id: 'check-referral',
    title: 'Understand referral / commission conditions',
    explanation: 'If withdrawing your original deposit requires you to recruit 3 more people, or pay an "unlock tax", you are participating in a multi-level marketing pyramid trap.',
    category: 'psychology'
  },
  {
    id: 'check-privkey',
    title: 'Never share your private key',
    explanation: 'Your private key controls complete cryptographic ownership of your funds. Never copy, paste, or type it into any website or customer support portal.',
    category: 'security'
  },
  {
    id: 'check-seed',
    title: 'Never share your seed phrase',
    explanation: 'Your 12- or 24-word recovery phrase is your vault master key. Legitimate wallets and administrators will NEVER ask for it under any circumstance.',
    category: 'security'
  },
  {
    id: 'check-otp',
    title: 'Never share OTP / passwords',
    explanation: 'One-time authentication codes sent to your phone or authenticator app are strictly private. Scammers often pretend to be "support fraud agents" attempting to stop a fake withdrawal.',
    category: 'security'
  },
  {
    id: 'check-pressure',
    title: 'Do not invest because someone pressures you',
    explanation: 'Artificial countdowns ("offer ends in 30 minutes", "only 2 seats remaining") are psychological manipulation tricks designed to trigger FOMO and disable your logical scrutiny.',
    category: 'psychology'
  }
];

export const ManualVerificationModal: React.FC<ManualVerificationModalProps> = ({
  result,
  isOpen,
  onClose
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'check-price': true,
    'check-privkey': true
  });

  if (!isOpen) return null;

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrint = () => {
    window.print();
  };

  // Compile narration script for SpeakerControl
  const fullNarrationScript = [
    `How to verify this offer yourself.`,
    ...result.manualVerificationSteps.map(
      (s) => `Step ${s.stepNumber}: ${s.title}. Key question: ${s.question}. ${s.explanation}`
    ),
    `Final recommendation: ${result.recommendedAction}`
  ].join(' ');

  const totalChecked = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#2A0812]/50 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#FFF9F2] border border-[#E5D2BE] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E5D2BE] flex items-center justify-between bg-[#F3E6D5] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#FFF9F2] border border-[#E5D2BE] text-[#800020]">
              <ShieldCheck className="w-5 h-5 text-[#800020]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono tracking-wider text-[#D45060] font-bold">Self-Reliance Toolkit</span>
                <span className="text-xs text-[#785863]">·</span>
                <span className="text-xs text-[#5A3844] font-medium">Interactive Due Diligence</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#800020]">
                How to Verify This Offer Yourself
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <SpeakerControl textToSpeak={fullNarrationScript} label="Listen to Guide" />
            
            <button
              onClick={handlePrint}
              type="button"
              title="Print checklist"
              className="p-2 rounded-lg bg-[#FFF9F2] hover:bg-[#EBD6C1] text-[#800020] border border-[#E5D2BE] transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              type="button"
              className="p-2 rounded-lg bg-[#FFF9F2] hover:bg-[#EBD6C1] text-[#800020] border border-[#E5D2BE] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-8 divide-y divide-[#E5D2BE]">
          
          {/* Section 1: Dynamic Tailored Steps based on detected risk profile */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-mono uppercase text-[#785863] font-bold">
                  Personalized Instructions
                </span>
                <h3 className="text-base font-bold text-[#800020] mt-0.5">
                  Action Steps Tailored to Your Specific Risk Indicators
                </h3>
              </div>
              <span className="text-xs text-[#785863]">
                Generated from detected indicators
              </span>
            </div>

            <div className="space-y-4">
              {result.manualVerificationSteps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-4 sm:p-5 rounded-xl bg-[#F3E6D5] border border-[#E5D2BE] hover:border-[#D45060]/50 transition-all shadow-xs"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl font-mono font-black text-[#800020] shrink-0">
                      {step.stepNumber}
                    </span>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className="text-base font-bold text-[#800020]">
                          {step.title}
                        </h4>
                        <SpeakerControl 
                          textToSpeak={`${step.title}. Key question: ${step.question}. ${step.explanation}`} 
                          label="Listen" 
                        />
                      </div>

                      <div className="p-2.5 rounded-lg bg-[#FFF9F2] border border-[#E5D2BE]">
                        <span className="text-[11px] font-mono uppercase text-[#D45060] block mb-0.5 font-bold">
                          Questions to ask the promoter:
                        </span>
                        <p className="text-xs sm:text-sm font-medium text-[#2A0812] italic">
                          "{step.question}"
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-[#5A3844] leading-relaxed">
                        {step.explanation}
                      </p>

                      <div className="pt-2 text-xs text-[#800020] flex items-center gap-1.5 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D45060]" />
                        <span>Action: {step.actionGuide}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Interactive "Before You Invest" Checklist */}
          <div className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <span className="text-xs font-mono uppercase text-[#D45060] font-bold flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#D45060]" />
                  Universal Protection Matrix
                </span>
                <h3 className="text-base font-bold text-[#800020] mt-0.5">
                  Before You Invest: Self-Defense Checklist
                </h3>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#800020] bg-[#F3E6D5] px-3 py-1 rounded-lg border border-[#E5D2BE] font-bold">
                  Completed: <strong className="text-[#D45060]">{totalChecked}</strong> / {DEFAULT_CHECKLIST.length}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#5A3844] mb-4">
              Check off each item once you have verified it independently. Click any item to reveal simple explanations. Never proceed with an investment until all critical safety criteria are satisfied.
            </p>

            <div className="space-y-2.5">
              {DEFAULT_CHECKLIST.map((item) => {
                const isChecked = !!checkedItems[item.id];
                const isExpanded = !!expandedItems[item.id];

                return (
                  <div
                    key={item.id}
                    className={`rounded-xl border transition-all ${
                      isChecked
                        ? 'bg-emerald-50 border-emerald-300'
                        : 'bg-[#F3E6D5] border-[#E5D2BE] hover:border-[#D45060]/40'
                    }`}
                  >
                    <div className="p-3 sm:p-4 flex items-center justify-between gap-3 cursor-pointer select-none" onClick={() => toggleExpand(item.id)}>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCheck(item.id);
                          }}
                          className="text-[#800020] hover:text-[#D45060] transition-colors"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-5 h-5 text-emerald-700" />
                          ) : (
                            <Square className="w-5 h-5 text-[#800020]" />
                          )}
                        </button>
                        <span className={`text-sm font-semibold ${isChecked ? 'text-emerald-900 line-through opacity-80' : 'text-[#800020]'}`}>
                          {item.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(item.id);
                          }}
                          className="p-1 text-[#785863] hover:text-[#800020]"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 border-t border-[#E5D2BE] ml-8 text-xs sm:text-sm text-[#5A3844] space-y-2 bg-[#FFF9F2] rounded-b-xl">
                        <p className="leading-relaxed text-[#5A3844] pt-2">
                          {item.explanation}
                        </p>
                        <SpeakerControl textToSpeak={item.explanation} label="Listen to rationale" className="mt-2" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Summary Disclaimer & Final Advice */}
          <div className="pt-6">
            <div className="p-4 rounded-xl bg-[#F3E6D5] border border-[#E5D2BE] flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#800020] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="text-xs font-bold text-[#800020] uppercase tracking-wider">
                  Golden Rule of Cryptocurrency
                </h5>
                <p className="text-xs text-[#5A3844] leading-relaxed">
                  Cryptocurrency blockchain transactions are irreversible. Once you transfer funds to an unknown address or sign a malicious contract transaction, neither banks, law enforcement, nor support staff can claw your money back. Always verify first.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E5D2BE] bg-[#F3E6D5] flex items-center justify-between shrink-0">
          <span className="text-xs text-[#785863] font-medium">
            CryptoSentry AI Independent Defense Engine
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#800020] hover:bg-[#68001a] text-white font-semibold text-xs tracking-wide transition-colors shadow-sm"
          >
            Done Reviewing
          </button>
        </div>

      </div>
    </div>
  );
};
