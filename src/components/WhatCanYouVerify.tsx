import React from 'react';
import { 
  TrendingUp, Coins, Globe, Link2, AlertOctagon, 
  ArrowRight, ShieldCheck, Zap 
} from 'lucide-react';

interface WhatCanYouVerifyProps {
  onSelectSample: (query: string) => void;
  onVerifyNow: () => void;
}

const VERIFY_CARDS = [
  {
    icon: TrendingUp,
    title: 'Market Price',
    tag: 'Price Consistency',
    description: 'Compare the claimed price with independent global market information to catch extreme discount advance-fee traps.'
  },
  {
    icon: Coins,
    title: 'Token',
    tag: 'Asset Identity',
    description: 'Check whether the cryptocurrency can be independently identified in official global registries or if it is an unlisted duplicate.'
  },
  {
    icon: Globe,
    title: 'Website',
    tag: 'Domain Integrity',
    description: 'Analyze available website and domain registration age, SSL profiles, and deceptive clone domain patterns.'
  },
  {
    icon: Link2,
    title: 'Blockchain',
    tag: 'Contract Analysis',
    description: 'Check available smart contract and blockchain evidence, looking for honeypots, transfer locks, and fake liquidity.'
  },
  {
    icon: AlertOctagon,
    title: 'Investment Claims',
    tag: 'Behavioral Flags',
    description: 'Identify unrealistic guaranteed returns, psychological countdown urgency, and MLM referral recruitment pressure.'
  }
];

const PRESET_SCENARIOS = [
  {
    title: 'Extreme Discount Trap',
    claim: 'Someone offered me 1 Bitcoin for ₹5,000 on WhatsApp. Is this safe?',
    tag: 'WhatsApp DM',
    risk: 'High Risk',
    isDanger: true
  },
  {
    title: 'Guaranteed Yield Bot',
    claim: 'Telegram group offering an automated USDT bot with 15% daily guaranteed returns and no risk.',
    tag: 'Telegram Bot',
    risk: 'High Risk',
    isDanger: true
  },
  {
    title: 'Phishing Seed Phrase',
    claim: 'Website claim-solana-bonus.xyz asking me to enter my 12-word recovery seed phrase to receive free tokens.',
    tag: 'Phishing Domain',
    risk: 'Critical Risk',
    isDanger: true
  },
  {
    title: 'Legitimate Purchase',
    claim: 'I am buying 0.5 ETH on Kraken exchange at the current market rate of $3,350.',
    tag: 'Regulated Exchange',
    risk: 'Low Risk',
    isDanger: false
  }
];

export const WhatCanYouVerify: React.FC<WhatCanYouVerifyProps> = ({
  onSelectSample,
  onVerifyNow
}) => {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-[#FFF9F2] relative border-t border-[#E5D2BE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-wider text-[#D45060] font-bold">
            <ShieldCheck className="w-4 h-4 text-[#D45060]" />
            <span>Multi-Vector Security Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#800020] tracking-tight">
            What Can You Verify?
          </h2>
          <p className="text-[#5A3844] text-sm sm:text-base leading-relaxed">
            You don't need technical expertise or blockchain knowledge. Submit any piece of evidence you have, and CryptoSentry AI cross-checks it against independent parameters.
          </p>
        </div>

        {/* 5 Core Visual Cards (30% Surface #F3E6D5, 10% Accent #800020 & #D45060) */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {VERIFY_CARDS.map((card, idx) => {
            const Icon = card.icon;

            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#F3E6D5] border border-[#E5D2BE] hover:border-[#D45060]/50 hover:bg-[#EEDBC7] transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FFF9F2] border border-[#E5D2BE] flex items-center justify-center group-hover:border-[#D45060]/60 transition-colors shadow-sm">
                    <Icon className="w-6 h-6 text-[#800020] group-hover:scale-110 transition-transform" />
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#785863] block mb-1 font-semibold">
                      {card.tag}
                    </span>
                    <h3 className="text-lg font-bold text-[#800020] tracking-tight">
                      {card.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[#5A3844] leading-relaxed font-normal">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive 1-Click Verification Scenarios */}
        <div className="pt-8 border-t border-[#E5D2BE] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono uppercase text-[#D45060] font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                Live Demo Scenarios
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#800020] mt-0.5">
                Try 1-Click Verification Examples
              </h3>
            </div>
            <span className="text-xs text-[#785863]">
              Click any sample scenario to launch full analysis
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRESET_SCENARIOS.map((scenario, idx) => (
              <div
                key={idx}
                onClick={() => onSelectSample(scenario.claim)}
                className="p-4 sm:p-5 rounded-xl bg-[#F3E6D5] border border-[#E5D2BE] hover:border-[#800020]/40 hover:bg-[#EEDBC7] transition-all cursor-pointer flex flex-col justify-between group shadow-sm hover:shadow-md"
              >
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-mono text-[#800020] font-bold uppercase">
                      {scenario.tag}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      scenario.isDanger
                        ? 'text-[#800020] bg-[#D45060]/15 border border-[#D45060]/30'
                        : 'text-emerald-800 bg-emerald-100 border border-emerald-300'
                    }`}>
                      {scenario.risk}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#800020] group-hover:text-[#D45060] transition-colors">
                    {scenario.title}
                  </h4>

                  <p className="text-xs text-[#5A3844] italic line-clamp-2">
                    "{scenario.claim}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E5D2BE] flex items-center justify-between text-xs text-[#800020] font-bold group-hover:text-[#D45060]">
                  <span>Run Verification</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Callout (30% Surface #F3E6D5, 10% Accent #800020 & #D45060) */}
        <div id="about" className="p-6 sm:p-8 rounded-2xl bg-[#F3E6D5] border border-[#E5D2BE] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold text-[#800020]">
              Built for Ordinary People, Powered by Deep Intelligence
            </h3>
            <p className="text-xs sm:text-sm text-[#5A3844] max-w-2xl leading-relaxed">
              Crypto scammers rely on confusion, technical jargon, and artificial urgency. CryptoSentry AI strips away the noise to give you an objective, evidence-based assessment with clear next steps.
            </p>
          </div>

          <button
            type="button"
            onClick={onVerifyNow}
            className="px-6 py-3 rounded-xl bg-[#800020] hover:bg-[#68001a] text-white font-bold text-sm tracking-wide shadow-md shadow-[#800020]/20 flex items-center gap-2 shrink-0 cursor-pointer transition-colors"
          >
            <span>Start Free Verification</span>
            <ArrowRight className="w-4 h-4 text-[#F3E6D5]" />
          </button>
        </div>

      </div>
    </section>
  );
};
