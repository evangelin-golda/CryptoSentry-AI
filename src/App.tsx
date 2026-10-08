/**
 * CryptoSentry AI
 * Verify Before You Invest.
 */

import React, { useState } from 'react';
import { Header } from './components/Header.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { WhatCanYouVerify } from './components/WhatCanYouVerify.tsx';
import { ChatVerificationView } from './components/ChatVerificationView.tsx';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'verify'>('home');
  const [initialQuery, setInitialQuery] = useState<string | undefined>(undefined);

  const handleStartVerification = (query?: string) => {
    setInitialQuery(query);
    setCurrentView('verify');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setInitialQuery(undefined);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] text-[#2A0812] flex flex-col font-sans selection:bg-[#D45060]/25 selection:text-[#800020]">
      {currentView === 'home' ? (
        <>
          <Header
            onNavigateVerify={() => handleStartVerification()}
            onNavigateSection={(sectionId) => {
              const el = document.getElementById(sectionId);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
          <main className="flex-1">
            <HeroSection onVerifyNow={() => handleStartVerification()} />
            <WhatCanYouVerify
              onSelectSample={(sampleQuery) => handleStartVerification(sampleQuery)}
              onVerifyNow={() => handleStartVerification()}
            />
          </main>
        </>
      ) : (
        <ChatVerificationView
          onBackToHome={handleBackToHome}
          initialQuery={initialQuery}
        />
      )}
    </div>
  );
}
