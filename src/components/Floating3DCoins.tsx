import React from 'react';
import { CryptoSentryIcon } from './CryptoSentryIcon.tsx';

export const Floating3DCoins: React.FC = () => {
  return (
    <div className="relative w-full max-w-[500px] h-[460px] sm:h-[490px] flex items-center justify-center select-none">
      {/* Background Soft Lighting Beam */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] bg-gradient-to-tr from-[#D45060]/18 via-[#F3E6D5]/90 to-[#800020]/12 rounded-full blur-[85px] pointer-events-none" />

      {/* Decorative Subtle Orbital Path Guidelines (Crypto Constellation Grid) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 500 500"
        fill="none"
      >
        {/* Outer Orbital Ellipse */}
        <ellipse
          cx="250"
          cy="250"
          rx="185"
          ry="180"
          stroke="#D45060"
          strokeOpacity="0.14"
          strokeWidth="1.2"
          strokeDasharray="4 6"
        />
        {/* Inner Subtle Resonance Ring */}
        <ellipse
          cx="250"
          cy="250"
          rx="95"
          ry="92"
          stroke="#800020"
          strokeOpacity="0.08"
          strokeWidth="1"
          strokeDasharray="3 5"
        />
      </svg>

      {/* ==============================================================
          CENTRAL SENTRY CORE: CryptoSentry AI Brand Shield Icon
          Placed directly at the focal point of the 6-coin orbit
         ============================================================== */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center pointer-events-auto">
        {/* Soft Ambient Core Halo */}
        <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-[#D45060]/25 via-[#F3E6D5] to-[#800020]/20 blur-xl pointer-events-none" />

        {/* Central Icon Card */}
        <div
          className="relative w-[76px] h-[76px] sm:w-[84px] sm:h-[84px] rounded-[22px] bg-[#FFF9F2] border border-[#E5D2BE] shadow-xl shadow-[#800020]/15 flex items-center justify-center p-3.5 transition-transform hover:scale-105 duration-300 select-none group"
          style={{
            filter: 'drop-shadow(0 14px 22px rgba(128, 0, 32, 0.18))'
          }}
        >
          <CryptoSentryIcon className="w-full h-full group-hover:scale-105 transition-transform duration-300" />
        </div>
      </div>

      {/* ==============================================================
          COIN 1 (Top-Left): Vibrant Emerald 3D Tether (USDT)
          Coordinates: top-3 left-[14%] sm:left-[16%]
         ============================================================== */}
      <div
        className="absolute top-2 sm:top-3.5 left-[13%] sm:left-[15%] z-20 animate-float-delay transition-transform hover:scale-105 duration-300"
        style={{
          filter: 'drop-shadow(0 16px 22px rgba(0, 0, 0, 0.28)) drop-shadow(0 0 28px rgba(16, 185, 129, 0.32))'
        }}
      >
        <svg
          width="108"
          height="108"
          viewBox="0 0 120 120"
          className="transform rotate-[7deg]"
        >
          <defs>
            {/* Emerald Metallic Rim */}
            <linearGradient id="usdtRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ECFDF5" />
              <stop offset="25%" stopColor="#6EE7B7" />
              <stop offset="55%" stopColor="#10B981" />
              <stop offset="85%" stopColor="#047857" />
              <stop offset="100%" stopColor="#064E3B" />
            </linearGradient>

            {/* Radial Emerald Face */}
            <radialGradient id="usdtFace" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ECFDF5" />
              <stop offset="25%" stopColor="#34D399" />
              <stop offset="65%" stopColor="#10B981" />
              <stop offset="90%" stopColor="#059669" />
              <stop offset="100%" stopColor="#064E3B" />
            </radialGradient>

            {/* Thickness Extrusion Underlayer */}
            <linearGradient id="usdtEdgeDepth" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#064E3B" />
              <stop offset="100%" stopColor="#022C22" />
            </linearGradient>

            {/* Emblem Glyph Gradient */}
            <linearGradient id="usdtSymbolGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#ECFDF5" />
              <stop offset="100%" stopColor="#A7F3D0" />
            </linearGradient>
          </defs>

          {/* 3D Thickness Depth */}
          <ellipse cx="62" cy="62" rx="52" ry="50" fill="url(#usdtEdgeDepth)" />

          {/* Outer Coin Disc */}
          <ellipse cx="60" cy="58" rx="52" ry="50" fill="url(#usdtRim)" stroke="#A7F3D0" strokeWidth="1.5" />

          {/* Machined Inner Groove */}
          <ellipse cx="60" cy="58" rx="44" ry="42" fill="none" stroke="#047857" strokeWidth="1" strokeOpacity="0.8" />
          <ellipse cx="60" cy="58" rx="42" ry="40" fill="url(#usdtFace)" />

          {/* Specular Highlight Arc */}
          <path
            d="M 30 38 A 42 40 0 0 1 90 38"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Embossed 3D Tether ₮ Emblem */}
          <g transform="translate(60, 58)" filter="drop-shadow(0 2.5px 4px rgba(2, 44, 34, 0.65))">
            {/* Top Crossbar */}
            <rect x="-16" y="-16" width="32" height="5.5" rx="1.5" fill="url(#usdtSymbolGrad)" />
            {/* Central Oval Ring */}
            <path
              d="M -15 3 C -15 -3 -7 -5 0 -5 C 7 -5 15 -3 15 3 C 15 9 7 11 0 11 C -7 11 -15 9 -15 3 Z"
              fill="none"
              stroke="url(#usdtSymbolGrad)"
              strokeWidth="3.2"
            />
            {/* Vertical Stem */}
            <rect x="-3" y="-12" width="6" height="26" rx="1.5" fill="url(#usdtSymbolGrad)" />
          </g>
        </svg>
      </div>

      {/* ==============================================================
          COIN 2 (Top-Right): Metallic Silver 3D Ethereum Coin
          Coordinates: top-3 right-[14%] sm:right-[15%]
          Separated cleanly from Coin 1 by 120px+
         ============================================================== */}
      <div
        className="absolute top-2 sm:top-3.5 right-[13%] sm:right-[15%] z-20 animate-float-slow transition-transform hover:scale-105 duration-300"
        style={{
          filter: 'drop-shadow(0 16px 22px rgba(0, 0, 0, 0.28)) drop-shadow(0 0 28px rgba(148, 163, 184, 0.32))'
        }}
      >
        <svg
          width="108"
          height="108"
          viewBox="0 0 120 120"
          className="transform -rotate-[8deg]"
        >
          <defs>
            {/* Outer metallic rim gradient */}
            <linearGradient id="ethRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#E2E8F0" />
              <stop offset="50%" stopColor="#94A3B8" />
              <stop offset="75%" stopColor="#475569" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>

            {/* Inner coin bevel */}
            <radialGradient id="ethFaceGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#E2E8F0" />
              <stop offset="70%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </radialGradient>

            {/* 3D coin edge extrusion effect */}
            <linearGradient id="ethEdgeGrad" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#64748B" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>

            {/* Ethereum Diamond Facet Shading */}
            <linearGradient id="ethFacetTopLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
            <linearGradient id="ethFacetTopRight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            <linearGradient id="ethFacetBotLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
            <linearGradient id="ethFacetBotRight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            <filter id="coinInnerShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#0F172A" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* 3D Thickness underlayer (depth simulation) */}
          <ellipse cx="62" cy="63" rx="53" ry="51" fill="url(#ethEdgeGrad)" />

          {/* Outer Coin Disc */}
          <ellipse cx="60" cy="58" rx="53" ry="51" fill="url(#ethRimGrad)" stroke="#F8FAFC" strokeWidth="1.5" />

          {/* Inner Inset Rim (Machined Groove) */}
          <ellipse cx="60" cy="58" rx="46" ry="44" fill="none" stroke="#64748B" strokeWidth="1" strokeOpacity="0.6" />
          <ellipse cx="60" cy="58" rx="44" ry="42" fill="url(#ethFaceGrad)" />

          {/* Specular Highlight Arc */}
          <path
            d="M 28 38 A 42 40 0 0 1 92 38"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.75"
          />

          {/* Embossed 3D Ethereum Crystal Diamond */}
          <g transform="translate(60, 58)" filter="url(#coinInnerShadow)">
            {/* Top Pyramid - Left Face */}
            <polygon points="0,-26 -16,0 0,5" fill="url(#ethFacetTopLeft)" />
            {/* Top Pyramid - Right Face */}
            <polygon points="0,-26 16,0 0,5" fill="url(#ethFacetTopRight)" />

            {/* Bottom Pyramid - Left Face */}
            <polygon points="0,9 -16,3 0,26" fill="url(#ethFacetBotLeft)" />
            {/* Bottom Pyramid - Right Face */}
            <polygon points="0,9 16,3 0,26" fill="url(#ethFacetBotRight)" />

            {/* Center Split Highlights */}
            <line x1="0" y1="-26" x2="0" y2="5" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.9" />
            <line x1="0" y1="9" x2="0" y2="26" stroke="#475569" strokeWidth="0.8" opacity="0.9" />
          </g>
        </svg>
      </div>

      {/* ==============================================================
          COIN 3 (Middle-Left): Iridescent Cyan / Violet Web3 Shield Coin
          Coordinates: top-[37%] left-1 sm:left-2
         ============================================================== */}
      <div
        className="absolute top-[37%] sm:top-[38%] left-1 sm:left-2 z-20 animate-float-reverse transition-transform hover:scale-105 duration-300"
        style={{
          filter: 'drop-shadow(0 16px 22px rgba(0, 0, 0, 0.28)) drop-shadow(0 0 30px rgba(6, 182, 212, 0.35))'
        }}
      >
        <svg
          width="108"
          height="108"
          viewBox="0 0 120 120"
          className="transform -rotate-[5deg]"
        >
          <defs>
            {/* Iridescent Rim Gradient */}
            <linearGradient id="iriRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67E8F9" />
              <stop offset="35%" stopColor="#38BDF8" />
              <stop offset="70%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>

            {/* Holographic Face Gradient */}
            <radialGradient id="iriFace" cx="35%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#A5F3FC" />
              <stop offset="30%" stopColor="#38BDF8" />
              <stop offset="65%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </radialGradient>

            {/* Thickness Depth */}
            <linearGradient id="iriEdgeDepth" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E1B4B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            {/* Subtle gloss overlay */}
            <linearGradient id="iriGloss" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* 3D Depth Underlayer */}
          <ellipse cx="62" cy="62" rx="54" ry="51" fill="url(#iriEdgeDepth)" />

          {/* Outer Coin Disc */}
          <ellipse cx="60" cy="58" rx="54" ry="51" fill="url(#iriRim)" stroke="#CFFAFE" strokeWidth="1.5" />

          {/* Inner Groove & Face */}
          <ellipse cx="60" cy="58" rx="46" ry="43" fill="none" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.7" />
          <ellipse cx="60" cy="58" rx="44" ry="41" fill="url(#iriFace)" />
          <ellipse cx="60" cy="58" rx="44" ry="41" fill="url(#iriGloss)" />

          {/* Specular Edge Highlight */}
          <path
            d="M 28 36 A 44 41 0 0 1 92 36"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Embossed Geometric Shield / Crypto Wave Symbol */}
          <g transform="translate(60, 58)">
            {/* Top Crest */}
            <path
              d="M -18 -12 L 18 -12 L 12 -4 L -24 -4 Z"
              fill="#FFFFFF"
              opacity="0.9"
              filter="drop-shadow(0 2px 3px rgba(15, 23, 42, 0.5))"
            />
            {/* Middle Crest */}
            <path
              d="M -12 -2 L 24 -2 L 18 6 L -18 6 Z"
              fill="#E0E7FF"
              opacity="0.85"
              filter="drop-shadow(0 2px 3px rgba(15, 23, 42, 0.5))"
            />
            {/* Bottom Crest */}
            <path
              d="M -24 8 L 12 8 L 18 16 L -18 16 Z"
              fill="#FFFFFF"
              opacity="0.9"
              filter="drop-shadow(0 2px 3px rgba(15, 23, 42, 0.5))"
            />
          </g>
        </svg>
      </div>

      {/* ==============================================================
          COIN 4 (Middle-Right): Dark Glossy Solana Coin
          Coordinates: top-[37%] right-1 sm:right-2
          Perfect horizontal counterpart to Coin 3
         ============================================================== */}
      <div
        className="absolute top-[37%] sm:top-[38%] right-1 sm:right-2 z-20 animate-float-slow transition-transform hover:scale-105 duration-300"
        style={{
          filter: 'drop-shadow(0 16px 22px rgba(0, 0, 0, 0.28)) drop-shadow(0 0 28px rgba(20, 241, 149, 0.26))'
        }}
      >
        <svg
          width="108"
          height="108"
          viewBox="0 0 120 120"
          className="transform rotate-[7deg]"
        >
          <defs>
            {/* Dark metallic rim */}
            <linearGradient id="solDarkRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="30%" stopColor="#1E293B" />
              <stop offset="70%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            {/* Dark glossy face */}
            <radialGradient id="solDarkFace" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="45%" stopColor="#0F172A" />
              <stop offset="90%" stopColor="#020617" />
              <stop offset="100%" stopColor="#000000" />
            </radialGradient>

            {/* Solana Signature Gradient (Cyan to Magenta) */}
            <linearGradient id="solanaGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00FFA3" />
              <stop offset="100%" stopColor="#DC1FFF" />
            </linearGradient>
            <linearGradient id="solanaGrad2" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#00FFA3" />
              <stop offset="100%" stopColor="#DC1FFF" />
            </linearGradient>

            {/* 3D Depth Underlayer */}
            <linearGradient id="solEdgeDepth" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
          </defs>

          {/* 3D Thickness extrusion */}
          <ellipse cx="62" cy="62" rx="52" ry="50" fill="url(#solEdgeDepth)" />

          {/* Outer Coin Disc */}
          <ellipse cx="60" cy="58" rx="52" ry="50" fill="url(#solDarkRim)" stroke="#64748B" strokeWidth="1.2" />

          {/* Inner Groove */}
          <ellipse cx="60" cy="58" rx="44" ry="42" fill="none" stroke="#334155" strokeWidth="1" />
          <ellipse cx="60" cy="58" rx="42" ry="40" fill="url(#solDarkFace)" />

          {/* Specular Rim Light */}
          <path
            d="M 32 36 A 40 38 0 0 1 88 36"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.5"
          />

          {/* Embossed Solana 3-Stripe Emblem */}
          <g transform="translate(60, 58)">
            {/* Top Stripe */}
            <path
              d="M -22 -14 L 14 -14 L 22 -6 L -14 -6 Z"
              fill="url(#solanaGrad1)"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.6))"
            />
            {/* Middle Stripe */}
            <path
              d="M -14 -4 L 22 -4 L 14 4 L -22 4 Z"
              fill="url(#solanaGrad2)"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.6))"
            />
            {/* Bottom Stripe */}
            <path
              d="M -22 6 L 14 6 L 22 14 L -14 14 Z"
              fill="url(#solanaGrad1)"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.6))"
            />
          </g>
        </svg>
      </div>

      {/* ==============================================================
          COIN 5 (Bottom-Left): Polished Gold 3D Bitcoin Coin
          Coordinates: bottom-2 sm:bottom-3.5 left-[13%] sm:left-[15%]
         ============================================================== */}
      <div
        className="absolute bottom-2 sm:bottom-3.5 left-[13%] sm:left-[15%] z-20 animate-float-slow transition-transform hover:scale-105 duration-300"
        style={{
          filter: 'drop-shadow(0 16px 22px rgba(0, 0, 0, 0.28)) drop-shadow(0 0 30px rgba(245, 158, 11, 0.32))'
        }}
      >
        <svg
          width="108"
          height="108"
          viewBox="0 0 120 120"
          className="transform rotate-[6deg]"
        >
          <defs>
            {/* Rich Gold Metallic Rim */}
            <linearGradient id="btcGoldRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="25%" stopColor="#FDE68A" />
              <stop offset="55%" stopColor="#F59E0B" />
              <stop offset="85%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#92400E" />
            </linearGradient>

            {/* Brushed Radial Gold Face */}
            <radialGradient id="btcGoldFace" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="25%" stopColor="#FDE68A" />
              <stop offset="65%" stopColor="#F59E0B" />
              <stop offset="90%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </radialGradient>

            {/* 3D Thickness Extrusion Underlayer */}
            <linearGradient id="btcEdgeDepth" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#78350F" />
              <stop offset="100%" stopColor="#451A03" />
            </linearGradient>

            {/* Bitcoin Glyph Gradient */}
            <linearGradient id="btcSymbolGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#FFFBEB" />
              <stop offset="100%" stopColor="#FDE68A" />
            </linearGradient>
          </defs>

          {/* 3D Thickness Depth */}
          <ellipse cx="62" cy="62" rx="52" ry="50" fill="url(#btcEdgeDepth)" />

          {/* Outer Coin Disc */}
          <ellipse cx="60" cy="58" rx="52" ry="50" fill="url(#btcGoldRim)" stroke="#FEF3C7" strokeWidth="1.5" />

          {/* Machined Inner Groove */}
          <ellipse cx="60" cy="58" rx="44" ry="42" fill="none" stroke="#D97706" strokeWidth="1" strokeOpacity="0.8" />
          <ellipse cx="60" cy="58" rx="42" ry="40" fill="url(#btcGoldFace)" />

          {/* Specular Highlight Arc */}
          <path
            d="M 30 38 A 42 40 0 0 1 90 38"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Embossed 3D Bitcoin ₿ Symbol */}
          <g transform="translate(60, 58)" filter="drop-shadow(0 2.5px 4px rgba(69, 26, 3, 0.65))">
            {/* Top vertical prongs */}
            <rect x="-4" y="-24" width="3.2" height="6" rx="1.2" fill="url(#btcSymbolGrad)" />
            <rect x="2" y="-24" width="3.2" height="6" rx="1.2" fill="url(#btcSymbolGrad)" />

            {/* Bottom vertical prongs */}
            <rect x="-4" y="18" width="3.2" height="6" rx="1.2" fill="url(#btcSymbolGrad)" />
            <rect x="2" y="18" width="3.2" height="6" rx="1.2" fill="url(#btcSymbolGrad)" />

            {/* Main B Glyph Body */}
            <path
              d="M -14 -18 L 4 -18 C 11 -18 16 -14 16 -7 C 16 -2 13 1 8 2 C 14 3 18 8 18 14 C 18 21 12 21 4 21 L -14 21 Z M -7 -12 L -7 -2 L 3 -2 C 6 -2 9 -3 9 -7 C 9 -11 6 -12 3 -12 Z M -7 4 L -7 15 L 4 15 C 8 15 11 14 11 9.5 C 11 5 8 4 4 4 Z"
              fill="url(#btcSymbolGrad)"
            />
          </g>
        </svg>
      </div>

      {/* ==============================================================
          COIN 6 (Bottom-Right): Vibrant Pink / Magenta Polkadot Coin
          Coordinates: bottom-2 sm:bottom-3.5 right-[13%] sm:right-[15%]
          Separated cleanly from Coin 5 by 120px+
         ============================================================== */}
      <div
        className="absolute bottom-2 sm:bottom-3.5 right-[13%] sm:right-[15%] z-20 animate-float-delay transition-transform hover:scale-105 duration-300"
        style={{
          filter: 'drop-shadow(0 16px 22px rgba(0, 0, 0, 0.28)) drop-shadow(0 0 30px rgba(244, 63, 94, 0.32))'
        }}
      >
        <svg
          width="108"
          height="108"
          viewBox="0 0 120 120"
          className="transform -rotate-[7deg]"
        >
          <defs>
            {/* Vibrant Pink Metallic Rim */}
            <linearGradient id="pinkRim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDA4AF" />
              <stop offset="25%" stopColor="#FB7185" />
              <stop offset="55%" stopColor="#F43F5E" />
              <stop offset="85%" stopColor="#E11D48" />
              <stop offset="100%" stopColor="#9F1239" />
            </linearGradient>

            {/* Hot Pink Face Gradient */}
            <radialGradient id="pinkFace" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FECDD3" />
              <stop offset="25%" stopColor="#FB7185" />
              <stop offset="65%" stopColor="#E11D48" />
              <stop offset="100%" stopColor="#881337" />
            </radialGradient>

            {/* Thickness Underlayer */}
            <linearGradient id="pinkEdgeDepth" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#881337" />
              <stop offset="100%" stopColor="#4C0519" />
            </linearGradient>
          </defs>

          {/* 3D Depth Extrusion */}
          <ellipse cx="62" cy="62" rx="51" ry="49" fill="url(#pinkEdgeDepth)" />

          {/* Outer Coin Disc */}
          <ellipse cx="60" cy="58" rx="51" ry="49" fill="url(#pinkRim)" stroke="#FFE4E6" strokeWidth="1.5" />

          {/* Inner Groove */}
          <ellipse cx="60" cy="58" rx="43" ry="41" fill="none" stroke="#F43F5E" strokeWidth="1" strokeOpacity="0.8" />
          <ellipse cx="60" cy="58" rx="41" ry="39" fill="url(#pinkFace)" />

          {/* Specular Highlight Arc */}
          <path
            d="M 30 38 A 41 39 0 0 1 90 38"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Embossed 3D Polkadot 'P' / Token Logo */}
          <g transform="translate(60, 58)" filter="drop-shadow(0 2.5px 4px rgba(76, 5, 25, 0.6))">
            {/* Main Rounded P Loop */}
            <path
              d="M -12 -18 C -2 -18 14 -18 14 -3 C 14 10 -2 10 -12 10 L -12 20 L -20 20 L -20 -18 Z M -12 -10 L -12 2 C -4 2 6 2 6 -3 C 6 -10 -4 -10 -12 -10 Z"
              fill="#FFFFFF"
            />
            {/* Center Polkadot Dot Accent */}
            <circle cx="16" cy="16" r="4.5" fill="#FFFFFF" />
          </g>
        </svg>
      </div>

    </div>
  );
};
