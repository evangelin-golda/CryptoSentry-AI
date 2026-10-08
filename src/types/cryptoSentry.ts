export type RiskLevel = 'low' | 'generally_safe' | 'moderate' | 'high' | 'very_high';

export type EvidenceStatus = 'verified' | 'contradicted' | 'unverified';

export interface EvidenceCard {
  id: string;
  title: string;
  status: EvidenceStatus;
  claimedValue: string;
  referenceValue: string;
  explanation: string;
  whyItMatters: string;
  severity: 'critical' | 'warning' | 'neutral' | 'safe';
}

export interface BreakdownMetric {
  label: string;
  score: number; // 0 (safest) to 100 (highest risk)
  status: 'safe' | 'warning' | 'danger' | 'unknown';
}

export interface ClaimComparison {
  claim: string;
  check: string;
  result: string;
  status: EvidenceStatus;
}

export interface ManualVerificationStep {
  stepNumber: string;
  title: string;
  question: string;
  explanation: string;
  actionGuide: string;
}

export interface VerificationResult {
  id: string;
  score: number; // 0 to 100 Risk Score
  level: RiskLevel;
  levelLabel: string;
  confidence: number; // percentage
  confidenceLabel: 'High' | 'Moderate' | 'Limited';
  confidenceReason: string;
  availableEvidence: string[];
  unverifiedFields: string[];
  summary: string;
  assessmentText: string;
  recommendedAction: string;
  evidenceBreakdown: BreakdownMetric[];
  evidenceCards: EvidenceCard[];
  comparisons: ClaimComparison[];
  manualVerificationSteps: ManualVerificationStep[];
  infographicNodes: {
    priceStatus: 'verified' | 'contradicted' | 'unverified';
    websiteStatus: 'verified' | 'contradicted' | 'unverified';
    tokenStatus: 'verified' | 'contradicted' | 'unverified';
    behaviorStatus: 'verified' | 'contradicted' | 'unverified';
  };
  timestamp: string;
}

export interface ChatAttachment {
  type: 'image' | 'pdf' | 'url' | 'crypto_details';
  name: string;
  previewUrl?: string;
  size?: string;
  data?: {
    url?: string;
    coinName?: string;
    claimedPrice?: string;
    details?: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  attachments?: ChatAttachment[];
  isVerifying?: boolean;
  verificationSteps?: Array<{ label: string; done: boolean; inProgress?: boolean }>;
  verificationResult?: VerificationResult;
}
