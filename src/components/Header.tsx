import React from 'react';
import { Search } from 'lucide-react';
import { CryptoSentryIcon } from './CryptoSentryIcon.tsx';

interface HeaderProps {
  onNavigateVerify: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateVerify, onNavigateSection }) => {
  return (
    <header className="w-full bg-[#FFF9F2]/90 backdrop-blur-md border-b border-[#E5D2BE] sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 cursor-pointer select-none group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-xl bg-[#FFF9F2] border border-[#E5D2BE] p-1.5 shadow-sm group-hover:bg-[#F3E6D5] transition-colors flex items-center justify-center">
            <CryptoSentryIcon className="w-full h-full group-hover:scale-105 transition-transform" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-[#800020]">
                CryptoSentry<span className="text-[#D45060]">AI</span>
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-wider text-[#785863] hidden sm:block uppercase font-medium">
              Verify Before You Invest
            </span>
          </div>
        </div>

        {/* Right: Minimal Navigation */}
        <nav className="flex items-center gap-3 sm:gap-6">
          <button
            type="button"
            onClick={() => onNavigateSection ? onNavigateSection('how-it-works') : document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-xs sm:text-sm font-semibold text-[#5A3844] hover:text-[#800020] transition-colors"
          >
            How It Works
          </button>

          <button
            type="button"
            onClick={() => onNavigateSection ? onNavigateSection('about') : document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-xs sm:text-sm font-semibold text-[#5A3844] hover:text-[#800020] transition-colors"
          >
            About
          </button>

          <button
            type="button"
            onClick={onNavigateVerify}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#800020] hover:bg-[#68001a] text-white font-semibold text-xs sm:text-sm tracking-wide shadow-md shadow-[#800020]/25 hover:shadow-[#D45060]/30 transition-all flex items-center gap-2 cursor-pointer group"
          >
            <Search className="w-3.5 h-3.5 text-[#F3E6D5] group-hover:scale-110 transition-transform" />
            <span>Verify Now</span>
          </button>
        </nav>

      </div>
    </header>
  );
};
