import React from 'react';
import { Search, ArrowRight, ShieldCheck } from 'lucide-react';
import { Floating3DCoins } from './Floating3DCoins.tsx';

interface HeroSectionProps {
  onVerifyNow: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onVerifyNow }) => {
  return (
    <section className="relative overflow-hidden py-10 sm:py-16 lg:py-20 bg-[#FFF9F2]">
      {/* Background ambient lighting glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#D45060]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#800020]/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[460px]">
          
          {/* LEFT SIDE: Hero Content */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left flex flex-col justify-center">
            {/* Main Title & Subtitle */}
            <div className="space-y-2.5">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#800020] tracking-tight leading-[1.08]">
                Verify Before <br />
                <span className="bg-gradient-to-r from-[#D45060] via-[#800020] to-[#D45060] bg-clip-text text-transparent">
                  You Invest.
                </span>
              </h1>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#4A1E29] tracking-tight">
                Multimodal Scam Detection & Verification
              </h2>
            </div>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-[#5A3844] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              AI-powered verification for cryptocurrency investment offers. Submit whatever information you have and understand the risk before you send your money.
            </p>

            {/* Clean Action Button */}
            <div className="pt-1 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                type="button"
                onClick={onVerifyNow}
                className="w-full sm:w-auto px-9 py-3.5 rounded-xl bg-[#800020] hover:bg-[#68001a] text-white font-bold text-base shadow-lg shadow-[#800020]/25 hover:shadow-[#D45060]/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer group active:scale-[0.98]"
              >
                <Search className="w-4 h-4 text-[#F3E6D5] group-hover:scale-110 transition-transform" />
                <span>Verify Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Trust Statement */}
            <div className="pt-0.5">
              <p className="text-xs sm:text-sm font-mono text-[#785863] tracking-wide">
                <span className="text-[#800020] font-bold">Supported formats:</span> Text <span className="text-[#D45060] font-bold">•</span> Voice <span className="text-[#D45060] font-bold">•</span> Image <span className="text-[#D45060] font-bold">•</span> PDF <span className="text-[#D45060] font-bold">•</span> Crypto Details
              </p>
            </div>

          </div>

          {/* RIGHT SIDE: Harmonious 3D Floating Coins Constellation */}
          <div className="lg:col-span-6 flex items-center justify-center lg:justify-end">
            <Floating3DCoins />
          </div>

        </div>
      </div>
    </section>
  );
};
