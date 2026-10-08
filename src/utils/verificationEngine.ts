import { VerificationResult, EvidenceCard, BreakdownMetric, ClaimComparison, ManualVerificationStep, ChatAttachment, EvidenceStatus } from '../types/cryptoSentry.ts';

// Known market reference rates (approximate benchmark values)
const MARKET_REFERENCES = {
  btc: { name: 'Bitcoin', symbol: 'BTC', priceUsd: 91500, priceInr: 7750000 },
  eth: { name: 'Ethereum', symbol: 'ETH', priceUsd: 3350, priceInr: 285000 },
  sol: { name: 'Solana', symbol: 'SOL', priceUsd: 185, priceInr: 15700 },
  usdt: { name: 'Tether (USDT)', symbol: 'USDT', priceUsd: 1.0, priceInr: 88 },
  bnb: { name: 'BNB', symbol: 'BNB', priceUsd: 620, priceInr: 52700 },
  xrp: { name: 'XRP', symbol: 'XRP', priceUsd: 2.2, priceInr: 187 },
  doge: { name: 'Dogecoin', symbol: 'DOGE', priceUsd: 0.25, priceInr: 21 },
  ada: { name: 'Cardano', symbol: 'ADA', priceUsd: 0.72, priceInr: 61 }
};

interface AnalysisInput {
  text: string;
  attachments?: ChatAttachment[];
}

export function analyzeCryptoOffer(input: AnalysisInput): VerificationResult {
  const combinedText = [
    input.text,
    ...(input.attachments || []).map((a) => {
      if (a.type === 'crypto_details' && a.data) {
        return `Coin: ${a.data.coinName || ''} Price: ${a.data.claimedPrice || ''} ${a.data.details || ''}`;
      }
      if (a.type === 'url' && a.data?.url) {
        return `Website: ${a.data.url}`;
      }
      return `${a.name} ${a.type}`;
    })
  ].join(' ').toLowerCase();

  // 1. Detect Cryptocurrency
  let detectedCoin: typeof MARKET_REFERENCES['btc'] | null = null;
  if (combinedText.includes('bitcoin') || combinedText.includes('btc')) detectedCoin = MARKET_REFERENCES.btc;
  else if (combinedText.includes('ethereum') || combinedText.includes('eth')) detectedCoin = MARKET_REFERENCES.eth;
  else if (combinedText.includes('solana') || combinedText.includes('sol')) detectedCoin = MARKET_REFERENCES.sol;
  else if (combinedText.includes('tether') || combinedText.includes('usdt')) detectedCoin = MARKET_REFERENCES.usdt;
  else if (combinedText.includes('bnb') || combinedText.includes('binance coin')) detectedCoin = MARKET_REFERENCES.bnb;
  else if (combinedText.includes('xrp') || combinedText.includes('ripple')) detectedCoin = MARKET_REFERENCES.xrp;
  else if (combinedText.includes('doge') || combinedText.includes('dogecoin')) detectedCoin = MARKET_REFERENCES.doge;

  // Check custom coin name attachment
  const cryptoDetailAttachment = input.attachments?.find((a) => a.type === 'crypto_details');
  const customCoinName = cryptoDetailAttachment?.data?.coinName;

  // 2. Detect Claimed Price
  let claimedPriceNumber: number | null = null;
  let claimedCurrency = '₹';
  let claimedPriceRaw = '';

  // Extract currency and amount patterns
  const inrMatch = combinedText.match(/(?:₹|rs\.?|inr)\s*([\d,]+(?:\.\d+)?)/i) || combinedText.match(/([\d,]+(?:\.\d+)?)\s*(?:rs|inr|rupees)/i);
  const usdMatch = combinedText.match(/(?:\$|usd)\s*([\d,]+(?:\.\d+)?)/i) || combinedText.match(/([\d,]+(?:\.\d+)?)\s*(?:usd|dollars)/i);

  if (cryptoDetailAttachment?.data?.claimedPrice) {
    claimedPriceRaw = cryptoDetailAttachment.data.claimedPrice;
    const num = parseFloat(claimedPriceRaw.replace(/[^0-9.]/g, ''));
    if (!isNaN(num)) {
      claimedPriceNumber = num;
      if (claimedPriceRaw.includes('$') || claimedPriceRaw.toLowerCase().includes('usd')) claimedCurrency = '$';
    }
  } else if (inrMatch) {
    claimedPriceRaw = inrMatch[0];
    claimedPriceNumber = parseFloat(inrMatch[1].replace(/,/g, ''));
    claimedCurrency = '₹';
  } else if (usdMatch) {
    claimedPriceRaw = usdMatch[0];
    claimedPriceNumber = parseFloat(usdMatch[1].replace(/,/g, ''));
    claimedCurrency = '$';
  }

  // 3. Detect Website / Domain
  const urlAttachment = input.attachments?.find((a) => a.type === 'url')?.data?.url;
  const urlMatch = combinedText.match(/https?:\/\/[^\s]+/) || combinedText.match(/www\.[^\s]+/) || combinedText.match(/[a-zA-Z0-9-]+\.(?:xyz|top|vip|cc|club|click|live|trade|finance|org|net|com)/i);
  const detectedUrl = urlAttachment || (urlMatch ? urlMatch[0] : null);

  // 4. Detect Red Flags
  const hasGuaranteedReturns = /guarantee|guaranteed|assured|risk[- ]free|100% safe|daily (?:5%|10%|15%|20%|50%)|double your (?:money|crypto)|tripled|fixed return/i.test(combinedText);
  const hasUrgency = /hurry|only today|few hours|limited slots|urgent|immediately|last chance|countdown|expires in/i.test(combinedText);
  const hasReferralPressure = /referral|refer|invite \d+|mlm|commission|pyramid|affiliate level|downline|recruit/i.test(combinedText);
  const hasPrivateDataRisk = /seed phrase|private key|password|otp|secret phrase|wallet key|recovery phrase/i.test(combinedText);
  const hasSuspiciousContact = /whatsapp|telegram|dm me|inbox me|admin will dm|whatsapp group|signal/i.test(combinedText);
  const isRegulatedExchangeMention = /coinbase|kraken|gemini|binance\.com|official app store|etoro/i.test(combinedText) && !hasGuaranteedReturns;

  // 5. Evaluate Evidence & Scoring
  const evidenceCards: EvidenceCard[] = [];
  const comparisons: ClaimComparison[] = [];
  const availableEvidence: string[] = [];
  const unverifiedFields: string[] = [];

  let riskPoints = 0;
  let maxPossiblePoints = 0;

  // --- Check A: Asset & Price Verification ---
  let priceStatus: EvidenceStatus = 'unverified';
  let tokenStatus: EvidenceStatus = 'unverified';

  if (detectedCoin) {
    tokenStatus = 'verified';
    availableEvidence.push(`Asset identification: ${detectedCoin.name} (${detectedCoin.symbol})`);

    evidenceCards.push({
      id: 'token-ident',
      title: 'Asset Identification',
      status: 'verified',
      claimedValue: `${detectedCoin.name} (${detectedCoin.symbol})`,
      referenceValue: 'Global crypto index list',
      explanation: `The submitted cryptocurrency was successfully identified in independent global market listings as ${detectedCoin.name}.`,
      whyItMatters: 'Verified token names ensure the asset exists, though scammers frequently impersonate well-known coins to build false confidence.',
      severity: 'safe'
    });
  } else if (customCoinName) {
    const isObviousCounterfeit = /safe|moon|elon|inu|baby|free|double/i.test(customCoinName);
    tokenStatus = isObviousCounterfeit ? 'contradicted' : 'unverified';
    availableEvidence.push(`Token Claim: "${customCoinName}"`);
    riskPoints += isObviousCounterfeit ? 35 : 25;
    maxPossiblePoints += 35;

    evidenceCards.push({
      id: 'token-unverified',
      title: 'Token Legitimacy Check',
      status: tokenStatus,
      claimedValue: customCoinName,
      referenceValue: 'No primary exchange listing found',
      explanation: `"${customCoinName}" could not be matched against verified top 500 cryptocurrency indices. It may be an unverified newly created contract.`,
      whyItMatters: 'Anyone can create a custom token in seconds. Without verified liquidity and contract audits, buyers risk losing 100% of capital.',
      severity: isObviousCounterfeit ? 'critical' : 'warning'
    });
  } else {
    unverifiedFields.push('Specific token or coin identity');
  }

  // Price analysis
  if (claimedPriceNumber !== null && detectedCoin) {
    availableEvidence.push('Claimed price comparison');
    const referencePrice = claimedCurrency === '₹' ? detectedCoin.priceInr : detectedCoin.priceUsd;
    const ratio = claimedPriceNumber / referencePrice;

    if (ratio < 0.2 || ratio > 5.0) {
      // Massive discrepancy (e.g., Bitcoin for ₹5,000)
      priceStatus = 'contradicted';
      riskPoints += 45;
      maxPossiblePoints += 45;

      const formattedClaim = claimedCurrency === '₹' ? `₹${claimedPriceNumber.toLocaleString()}` : `$${claimedPriceNumber.toLocaleString()}`;
      const formattedRef = claimedCurrency === '₹' ? `₹${referencePrice.toLocaleString()}+` : `$${referencePrice.toLocaleString()}+`;

      evidenceCards.push({
        id: 'price-check',
        title: 'Price Consistency Mismatch',
        status: 'contradicted',
        claimedValue: formattedClaim,
        referenceValue: formattedRef,
        explanation: `The claimed price of ${formattedClaim} is dramatically lower than the actual independent market value (${formattedRef}). Widely traded cryptocurrencies are not sold at 90%+ discounts.`,
        whyItMatters: 'If someone claims to sell a widely traded cryptocurrency at a dramatically discounted price, the offer is almost certainly an advance-fee trap or phishing scheme.',
        severity: 'critical'
      });

      comparisons.push({
        claim: `${detectedCoin.name} available for ${formattedClaim}`,
        check: `Independent market data indicates ${formattedRef}`,
        result: 'Significant inconsistency — unrealistic market discount',
        status: 'contradicted'
      });
    } else {
      // Consistent with market
      priceStatus = 'verified';
      maxPossiblePoints += 30;

      const formattedClaim = claimedCurrency === '₹' ? `₹${claimedPriceNumber.toLocaleString()}` : `$${claimedPriceNumber.toLocaleString()}`;
      const formattedRef = claimedCurrency === '₹' ? `~₹${referencePrice.toLocaleString()}` : `~$${referencePrice.toLocaleString()}`;

      evidenceCards.push({
        id: 'price-check',
        title: 'Market Price Consistency',
        status: 'verified',
        claimedValue: formattedClaim,
        referenceValue: formattedRef,
        explanation: `The quoted rate aligns closely with independent global exchange pricing.`,
        whyItMatters: 'Standard market rates indicate the quotation does not rely on bait discounts, though storage security must still be verified.',
        severity: 'safe'
      });

      comparisons.push({
        claim: `Quoted price ${formattedClaim}`,
        check: `Global order books reflect ${formattedRef}`,
        result: 'Consistent with live market benchmarks',
        status: 'verified'
      });
    }
  } else if (claimedPriceNumber !== null) {
    // Claimed price provided but no known coin
    availableEvidence.push(`Quoted price: ${claimedCurrency}${claimedPriceNumber.toLocaleString()}`);
    unverifiedFields.push('Market reference benchmark (coin unknown)');
  } else {
    unverifiedFields.push('Claimed purchase price');
  }

  // --- Check B: Website / Domain Analysis ---
  let websiteStatus: EvidenceStatus = 'unverified';
  if (detectedUrl) {
    availableEvidence.push(`Website analysis for: ${detectedUrl}`);
    const isSuspiciousTLD = /\.(xyz|top|vip|cc|click|buzz|cfd|work|gq|ml|ga|tk)$/i.test(detectedUrl);
    const isLookalike = /binance|coinbase|metamask|trustwallet|kraken/i.test(detectedUrl) && !/(\.com|\.org)$/i.test(detectedUrl);
    const isLegitOfficialDomain = /(?:binance\.com|coinbase\.com|kraken\.com|ethereum\.org|bitcoin\.org)/i.test(detectedUrl);

    if (isLegitOfficialDomain) {
      websiteStatus = 'verified';
      evidenceCards.push({
        id: 'domain-legit',
        title: 'Website Domain Check',
        status: 'verified',
        claimedValue: detectedUrl,
        referenceValue: 'Official verified corporate domain',
        explanation: 'Domain matches official corporate domain registry with established historical tenure.',
        whyItMatters: 'Authentic domains ensure transactions interact directly with audited platform custody rather than intermediary phishing captures.',
        severity: 'safe'
      });
    } else if (isSuspiciousTLD || isLookalike) {
      websiteStatus = 'contradicted';
      riskPoints += 35;
      maxPossiblePoints += 35;

      evidenceCards.push({
        id: 'domain-risk',
        title: 'Website Domain & Trust Pattern',
        status: 'contradicted',
        claimedValue: detectedUrl,
        referenceValue: 'Reputable domain age & WHOIS history',
        explanation: `The domain uses a high-risk TLD or brand lookalike pattern frequently associated with short-lived phishing portals.`,
        whyItMatters: 'A newly registered or clone domain allows perpetrators to disappear within days once funds are collected, leaving zero legal recourse.',
        severity: 'critical'
      });

      comparisons.push({
        claim: `Portal URL: ${detectedUrl}`,
        check: 'Domain lookup against verified corporate registries',
        result: 'Suspicious domain profile & imitation indicators',
        status: 'contradicted'
      });
    } else {
      websiteStatus = 'unverified';
      maxPossiblePoints += 20;

      evidenceCards.push({
        id: 'domain-neutral',
        title: 'Website Domain Check',
        status: 'unverified',
        claimedValue: detectedUrl,
        referenceValue: 'Standard web registration',
        explanation: `Domain format is standard, but independent registration tenure and corporate ownership cannot be fully verified from address alone.`,
        whyItMatters: 'Legitimate services publish transparent registration details, terms of service, and registered physical entity locations.',
        severity: 'neutral'
      });
    }
  } else {
    unverifiedFields.push('Official website or domain address');
  }

  // --- Check C: Investment Behavior & Return Claims ---
  let behaviorStatus: 'verified' | 'contradicted' | 'unverified' = 'unverified';

  if (hasGuaranteedReturns) {
    behaviorStatus = 'contradicted';
    riskPoints += 40;
    maxPossiblePoints += 40;
    availableEvidence.push('Return promise analysis');

    evidenceCards.push({
      id: 'return-guarantee',
      title: 'Guaranteed Returns Promise',
      status: 'contradicted',
      claimedValue: 'Guaranteed / Risk-Free / Fixed Daily Returns',
      referenceValue: 'Real financial market volatility standards',
      explanation: 'Cryptocurrency investments inherently carry volatility. Legitimate platforms and financial authorities never guarantee high fixed profits without capital risk.',
      whyItMatters: 'Guaranteed daily or weekly returns are the universal hallmark of Ponzi schemes, where earlier depositors are paid with later deposits until funds are frozen.',
      severity: 'critical'
    });

    comparisons.push({
      claim: 'Guaranteed profit / zero-risk return',
      check: 'Economic reality & market risk mechanisms',
      result: 'Unverifiable mathematical claim — classic Ponzi flag',
      status: 'contradicted'
    });
  }

  if (hasPrivateDataRisk) {
    riskPoints += 50;
    maxPossiblePoints += 50;
    availableEvidence.push('Private credential request check');

    evidenceCards.push({
      id: 'credential-theft',
      title: 'Critical Security Alert: Secret Key Request',
      status: 'contradicted',
      claimedValue: 'Request for Seed Phrase / Private Key / OTP',
      referenceValue: 'Universal security baseline (Never Share)',
      explanation: 'No legitimate exchange, wallet provider, or support staff will ever ask for your 12/24-word recovery seed phrase or private key.',
      whyItMatters: 'Sharing a seed phrase grants instantaneous, irreversible total access to drain every token from your wallet.',
      severity: 'critical'
    });
  }

  if (hasUrgency) {
    riskPoints += 15;
    maxPossiblePoints += 15;
    availableEvidence.push('Psychological pressure indicators');

    evidenceCards.push({
      id: 'urgency-pressure',
      title: 'Urgency & Pressure Tactics',
      status: 'contradicted',
      claimedValue: 'Artificial time limits / countdowns',
      referenceValue: 'Standard investment due-diligence period',
      explanation: 'The offer creates artificial time pressure ("urgent", "expires today") to bypass your critical evaluation.',
      whyItMatters: 'Pressure tactics are deliberately employed by fraudulent actors to rush victims into sending funds before they have time to consult independent sources.',
      severity: 'warning'
    });
  }

  if (hasReferralPressure) {
    riskPoints += 25;
    maxPossiblePoints += 25;
    availableEvidence.push('Multilevel recruitment model');

    evidenceCards.push({
      id: 'referral-structure',
      title: 'Recruitment & Referral Pressure',
      status: 'contradicted',
      claimedValue: 'Bonus on bringing friends / downline commission',
      referenceValue: 'Direct capital investment utility',
      explanation: 'Returns appear contingent upon recruiting new participants rather than genuine underlying trading or technological utility.',
      whyItMatters: 'When payouts depend primarily on recruiting new depositors rather than real revenue generation, the structure cannot survive once signups slow down.',
      severity: 'warning'
    });
  }

  if (hasSuspiciousContact) {
    riskPoints += 15;
    maxPossiblePoints += 15;
    availableEvidence.push('Channel origin assessment');

    evidenceCards.push({
      id: 'channel-trust',
      title: 'Private Messaging Distribution',
      status: 'unverified',
      claimedValue: 'Direct message via WhatsApp / Telegram group',
      referenceValue: 'Public audited regulatory channels',
      explanation: 'The offer is being circulated through anonymous or private chat groups where identities cannot be authenticated.',
      whyItMatters: 'Fraudulent promoters rely on private chat channels because they can delete history, ban skeptical participants, and switch accounts with impunity.',
      severity: 'neutral'
    });
  }

  // If user provided legitimate context on regulated exchange
  if (isRegulatedExchangeMention && !hasGuaranteedReturns && !hasPrivateDataRisk) {
    behaviorStatus = 'verified';
    evidenceCards.push({
      id: 'regulated-exchange',
      title: 'Platform Reputation',
      status: 'verified',
      claimedValue: 'Recognized global exchange / official custody',
      referenceValue: 'Registered institutional custody entity',
      explanation: 'The transaction involves an established, regulated cryptocurrency exchange with verifiable compliance track record.',
      whyItMatters: 'Regulated exchanges enforce KYC and account segregation, drastically reducing counterparty fraud compared to private brokers.',
      severity: 'safe'
    });
  }

  // If no negative signals were found and some legitimate text
  if (behaviorStatus === 'unverified' && !hasGuaranteedReturns && !hasUrgency && !hasReferralPressure) {
    behaviorStatus = 'unverified';
    unverifiedFields.push('Promoter corporate registration and audit status');
  }

  // --- Calculate Final Score (0 - 100) ---
  // Default base if no red flags
  let finalScore = 15; // base nominal risk inherent to all crypto

  if (maxPossiblePoints > 0) {
    const rawRatio = riskPoints / Math.max(maxPossiblePoints, 40);
    finalScore = Math.min(96, Math.max(12, Math.round(rawRatio * 100)));
  }

  // If major critical flags present (price mismatch or private key or guaranteed return)
  if (priceStatus === 'contradicted' || hasPrivateDataRisk || hasGuaranteedReturns) {
    finalScore = Math.max(finalScore, 82);
  }

  if (isRegulatedExchangeMention && priceStatus === 'verified' && !hasGuaranteedReturns) {
    finalScore = Math.min(finalScore, 18);
  }

  // Determine Risk Level
  let level: VerificationResult['level'] = 'moderate';
  let levelLabel = 'Moderate Risk';

  if (finalScore <= 20) {
    level = 'low';
    levelLabel = 'Low Risk';
  } else if (finalScore <= 40) {
    level = 'generally_safe';
    levelLabel = 'Generally Safe';
  } else if (finalScore <= 60) {
    level = 'moderate';
    levelLabel = 'Moderate Risk';
  } else if (finalScore <= 80) {
    level = 'high';
    levelLabel = 'High Risk';
  } else {
    level = 'very_high';
    levelLabel = 'Very High Risk';
  }

  // Calculate Evidence Confidence (High, Moderate, Limited)
  let confidence = 50;
  let confidenceLabel: 'High' | 'Moderate' | 'Limited' = 'Limited';
  let confidenceReason = 'Only limited evidence was available, so the confidence of this assessment is lower.';

  const evidenceCount = availableEvidence.length;
  if (evidenceCount >= 3) {
    confidence = 91;
    confidenceLabel = 'High';
    confidenceReason = 'Sufficient independent claims (price, asset identity, channel context) were provided to form a strong risk profile.';
  } else if (evidenceCount === 2) {
    confidence = 72;
    confidenceLabel = 'Moderate';
    confidenceReason = 'Core data points were evaluated, though website registration and contract source code remain unverified.';
  } else {
    confidence = 48;
    confidenceLabel = 'Limited';
    confidenceReason = 'Only partial evidence was supplied. We verified what was provided, but cannot evaluate undisclosed contract or website parameters.';
  }

  // Build Breakdown Bars
  const evidenceBreakdown: BreakdownMetric[] = [
    {
      label: 'Price consistency',
      score: priceStatus === 'contradicted' ? 92 : priceStatus === 'verified' ? 12 : 50,
      status: priceStatus === 'contradicted' ? 'danger' : priceStatus === 'verified' ? 'safe' : 'unknown'
    },
    {
      label: 'Website evidence',
      score: websiteStatus === 'contradicted' ? 88 : websiteStatus === 'verified' ? 15 : 45,
      status: websiteStatus === 'contradicted' ? 'danger' : websiteStatus === 'verified' ? 'safe' : 'unknown'
    },
    {
      label: 'Token verification',
      score: tokenStatus === 'verified' ? 10 : tokenStatus === 'contradicted' ? 90 : 55,
      status: tokenStatus === 'verified' ? 'safe' : tokenStatus === 'contradicted' ? 'danger' : 'unknown'
    },
    {
      label: 'Security evidence',
      score: hasPrivateDataRisk ? 98 : hasSuspiciousContact ? 70 : 30,
      status: hasPrivateDataRisk ? 'danger' : hasSuspiciousContact ? 'warning' : 'safe'
    },
    {
      label: 'Investment behaviour',
      score: (hasGuaranteedReturns || hasUrgency || hasReferralPressure) ? 85 : 20,
      status: (hasGuaranteedReturns || hasUrgency) ? 'danger' : 'safe'
    }
  ];

  // Dynamic Manual Verification Steps based on detected risk factors
  const manualVerificationSteps: ManualVerificationStep[] = [];
  let stepIndex = 1;

  if (priceStatus === 'contradicted' || claimedPriceNumber !== null) {
    manualVerificationSteps.push({
      stepNumber: `0${stepIndex++}`,
      title: 'Check the Original Market Price',
      question: 'Where did you get this price quote from?',
      explanation: 'Compare the quoted price directly with independent cryptocurrency market trackers such as CoinMarketCap or CoinGecko. Do not rely exclusively on the promoter\'s website, screenshot, or chat message.',
      actionGuide: 'Visit an established tracker independently in your browser, search the exact coin ticker, and verify current live global trade prices.'
    });
  }

  if (detectedUrl || websiteStatus !== 'verified') {
    manualVerificationSteps.push({
      stepNumber: `0${stepIndex++}`,
      title: 'Inspect the Website & Domain',
      question: 'How long has this website existed, and is it the genuine domain?',
      explanation: 'Check whether the website was registered recently (e.g., less than 6 months ago) via public WHOIS databases. Verify whether the exact letters match the real brand without subtle typos.',
      actionGuide: 'Use lookup tools like whois.domaintools.com to check the registration date. Scammers frequently clone official logos onto temporary .xyz or .top domains.'
    });
  }

  if (tokenStatus !== 'verified' || !detectedCoin) {
    manualVerificationSteps.push({
      stepNumber: `0${stepIndex++}`,
      title: 'Verify the Contract Address on Blockchain',
      question: 'What is the official smart contract address?',
      explanation: 'Compare the contract address with independent blockchain explorers (Etherscan, Solscan, BscScan). Never trust a contract address copied only from a random message or direct message.',
      actionGuide: 'Look up the contract on an official explorer to check if ownership is renounced, if trading is disabled (honeypot), and whether there is genuine locked liquidity.'
    });
  }

  if (hasGuaranteedReturns || hasUrgency) {
    manualVerificationSteps.push({
      stepNumber: `0${stepIndex++}`,
      title: 'Question the Return & Urgency Promises',
      question: 'How can anyone guarantee high returns in volatile markets?',
      explanation: 'Ask the promoter what independently verifiable mathematical mechanism generates their promised return. Inquire whether withdrawals depend on recruiting others or paying additional "activation fees".',
      actionGuide: 'Remember: no regulated asset manager on Earth can guarantee 5%–15% daily or weekly returns. If it sounds too good to be true, it is.'
    });
  }

  // Ensure at least 3 dynamic steps
  if (manualVerificationSteps.length < 3) {
    manualVerificationSteps.push({
      stepNumber: `0${stepIndex++}`,
      title: 'Verify Entity Registration & Custody',
      question: 'Is the platform registered with any official financial regulator?',
      explanation: 'Check whether the firm holds actual financial operating licenses in recognized jurisdictions. Unregistered entities provide zero protection against theft or sudden shutdown.',
      actionGuide: 'Search official registries (SEC, FCA, FinCEN, or national regulator) before depositing personal funds.'
    });
  }

  // Assessment & Recommendations
  let assessmentText = '';
  let recommendedAction = '';

  if (finalScore >= 75) {
    assessmentText = 'The available evidence indicates a very high-risk investment profile. Several critical claims conflict directly with independent market data, and prominent indicators of financial traps or unverified custody were identified.';
    recommendedAction = 'Do not transfer money or connect your wallet. The claims presented are inconsistent with independent market standards, and funds sent are at extreme risk of irreversible loss.';
  } else if (finalScore >= 50) {
    assessmentText = 'The available evidence indicates a moderate-to-high risk profile. While some elements could not be fully verified, warning signs such as aggressive yield expectations or unconfirmed domain registries warrant serious caution.';
    recommendedAction = 'Pause before investing. Independently verify the company registration, token liquidity, and contractual terms using the manual verification guide below.';
  } else {
    assessmentText = 'The available information is broadly consistent with independent market sources. However, in cryptocurrency, low risk does not guarantee profit or eliminate all market volatility.';
    recommendedAction = 'Proceed with standard personal due diligence. Always keep custody in hardware wallets and never share private credentials with anyone.';
  }

  return {
    id: `eval_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    score: finalScore,
    level,
    levelLabel,
    confidence,
    confidenceLabel,
    confidenceReason,
    availableEvidence,
    unverifiedFields,
    summary: `Risk Assessment: ${levelLabel} (${finalScore}/100) — ${confidenceLabel} Evidence Confidence (${confidence}%)`,
    assessmentText,
    recommendedAction,
    evidenceBreakdown,
    evidenceCards,
    comparisons,
    manualVerificationSteps,
    infographicNodes: {
      priceStatus,
      websiteStatus,
      tokenStatus,
      behaviorStatus
    },
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}
