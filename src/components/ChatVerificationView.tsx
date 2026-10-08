import React, { useState, useRef, useEffect } from 'react';
import { 
  ChatMessage, ChatAttachment, VerificationResult 
} from '../types/cryptoSentry.ts';
import { analyzeCryptoOffer } from '../utils/verificationEngine.ts';
import { VerificationResultCard } from './VerificationResultCard.tsx';
import { 
  Plus, Send, Mic, MicOff, Image as ImageIcon, FileText, 
  Globe, Coins, ArrowLeft, RefreshCw, X, Check, Loader2, 
  Sparkles, Shield, AlertCircle
} from 'lucide-react';

interface ChatVerificationViewProps {
  onBackToHome: () => void;
  initialQuery?: string;
}

export const ChatVerificationView: React.FC<ChatVerificationViewProps> = ({
  onBackToHome,
  initialQuery
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // URL input dialog
  const [showUrlDialog, setShowUrlDialog] = useState(false);
  const [dialogUrlInput, setDialogUrlInput] = useState('');

  // Crypto details dialog
  const [showCryptoDialog, setShowCryptoDialog] = useState(false);
  const [dialogCoinName, setDialogCoinName] = useState('');
  const [dialogPrice, setDialogPrice] = useState('');
  const [dialogPlatform, setDialogPlatform] = useState('');

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isVoiceTranscribing, setIsVoiceTranscribing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Hidden file inputs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize initial greeting on load
  useEffect(() => {
    const initialGreeting: ChatMessage = {
      id: 'msg_welcome',
      sender: 'assistant',
      text: "Hi! I'm CryptoSentry AI.\n\nTell me what you were offered. You don't need to have complete information.\n\nYou can type the details, upload a screenshot/PDF/URL, or simply tell me what the person told you.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([initialGreeting]);

    // If an initial query was passed from Home hero/case studies
    if (initialQuery) {
      setTimeout(() => {
        handleSendMessage(initialQuery);
      }, 400);
    }
  }, [initialQuery]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  // Voice timer handler
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Voice Recognition Setup
  const startVoiceRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Fallback simulated voice test for demonstration
      setIsRecording(true);
      setRecordingSeconds(0);
      setVoiceTranscript('');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setVoiceTranscript(transcript);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
    } catch {
      setIsRecording(true);
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsRecording(false);
    setIsVoiceTranscribing(true);

    setTimeout(() => {
      setIsVoiceTranscribing(false);
      // If voice transcript was empty (e.g. mic permission denied or simulated demo)
      const finalRecordedText = voiceTranscript.trim() || 'Someone contacted me on WhatsApp offering Bitcoin for ₹5,000 and promised 10% daily returns.';
      setInputText(finalRecordedText);
      setVoiceTranscript('');
      textareaRef.current?.focus();
    }, 700);
  };

  const cancelVoiceRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }
    setIsRecording(false);
    setVoiceTranscript('');
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const newAttachment: ChatAttachment = {
        type: 'image',
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        previewUrl: event.target?.result as string
      };
      setAttachments((prev) => [...prev, newAttachment]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
    setIsMenuOpen(false);
  };

  // PDF Upload Handler
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newAttachment: ChatAttachment = {
      type: 'pdf',
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
    };
    setAttachments((prev) => [...prev, newAttachment]);
    e.target.value = '';
    setIsMenuOpen(false);
  };

  // Add Website Dialog Submit
  const handleAddWebsite = () => {
    if (!dialogUrlInput.trim()) return;
    let url = dialogUrlInput.trim();
    if (!url.startsWith('http')) url = `https://${url}`;

    const newAttachment: ChatAttachment = {
      type: 'url',
      name: url,
      data: { url }
    };
    setAttachments((prev) => [...prev, newAttachment]);
    setDialogUrlInput('');
    setShowUrlDialog(false);
    setIsMenuOpen(false);
  };

  // Add Crypto Details Dialog Submit
  const handleAddCryptoDetails = () => {
    if (!dialogCoinName.trim()) return;

    const newAttachment: ChatAttachment = {
      type: 'crypto_details',
      name: `${dialogCoinName} (${dialogPrice || 'Price not specified'})`,
      data: {
        coinName: dialogCoinName,
        claimedPrice: dialogPrice,
        details: dialogPlatform ? `Platform: ${dialogPlatform}` : ''
      }
    };
    setAttachments((prev) => [...prev, newAttachment]);
    setDialogCoinName('');
    setDialogPrice('');
    setDialogPlatform('');
    setShowCryptoDialog(false);
    setIsMenuOpen(false);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Main Send & AI Verification Workflow
  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText !== undefined ? customText : inputText).trim();
    const currentAttachments = [...attachments];

    if (!textToSend && currentAttachments.length === 0) return;

    // 1. Add User Message
    const userMsgId = `user_${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
      attachments: currentAttachments.length > 0 ? currentAttachments : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setAttachments([]);
    setIsProcessing(true);

    // 2. Add preliminary acknowledgement if files were uploaded
    let ackText = '';
    if (currentAttachments.some((a) => a.type === 'image')) {
      ackText = "I've received the image. I'll extract the available information and verify the claims.";
    } else if (currentAttachments.some((a) => a.type === 'pdf')) {
      ackText = "I'll examine the information available in this document.";
    } else {
      // Check for partial info phrasing
      const lower = textToSend.toLowerCase();
      if ((lower.includes('bitcoin') || lower.includes('eth') || lower.includes('sol')) && (lower.includes('5000') || lower.includes('₹') || lower.includes('$')) && !lower.includes('http')) {
        ackText = "I can verify the cryptocurrency and compare the claimed price with independent market information. However, I don't have a website, contract address or promoter information yet. I'll assess what can currently be verified.";
      } else {
        ackText = "I'm analyzing the details you provided. Evaluating independent market listings, domain indicators, and financial risk patterns...";
      }
    }

    // 3. Temporary Verification Stepper Message
    const assistantMsgId = `asst_${Date.now()}`;
    const initialSteps = [
      { label: 'Understanding your information...', done: true },
      { label: 'Extracting crypto claims...', done: true },
      { label: 'Checking market information...', done: false, inProgress: true },
      { label: 'Checking token information...', done: false },
      { label: 'Checking available security evidence...', done: false },
      { label: 'Preparing your risk assessment...', done: false }
    ];

    const initialAiMsg: ChatMessage = {
      id: assistantMsgId,
      sender: 'assistant',
      text: ackText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isVerifying: true,
      verificationSteps: initialSteps
    };

    setMessages((prev) => [...prev, initialAiMsg]);

    // Animate the verification pipeline steps smoothly
    await new Promise((r) => setTimeout(r, 600));

    setMessages((prev) =>
      prev.map((m) =>
        m.id === assistantMsgId
          ? {
              ...m,
              verificationSteps: [
                { label: 'Understanding your information...', done: true },
                { label: 'Extracting crypto claims...', done: true },
                { label: 'Checking market information...', done: true },
                { label: 'Checking token information...', done: true },
                { label: 'Checking available security evidence...', done: false, inProgress: true },
                { label: 'Preparing your risk assessment...', done: false }
              ]
            }
          : m
      )
    );

    await new Promise((r) => setTimeout(r, 700));

    // Run verification engine
    const result = analyzeCryptoOffer({
      text: textToSend,
      attachments: currentAttachments
    });

    // Complete steps and attach full Verification Result
    setMessages((prev) =>
      prev.map((m) =>
        m.id === assistantMsgId
          ? {
              ...m,
              isVerifying: false,
              verificationSteps: [
                { label: 'Understanding your information...', done: true },
                { label: 'Extracting crypto claims...', done: true },
                { label: 'Checking market information...', done: true },
                { label: 'Checking token information...', done: true },
                { label: 'Checking available security evidence...', done: true },
                { label: 'Preparing your risk assessment...', done: true }
              ],
              verificationResult: result
            }
          : m
      )
    );

    setIsProcessing(false);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'msg_welcome',
        sender: 'assistant',
        text: "Hi! I'm CryptoSentry AI.\n\nTell me what you were offered. You don't need to have complete information.\n\nYou can type the details, upload a screenshot/PDF/URL, or simply tell me what the person told you.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setInputText('');
    setAttachments([]);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-[#FFF9F2] text-[#2A0812] overflow-hidden relative">
      
      {/* Hidden File Upload Inputs */}
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={pdfInputRef}
        onChange={handlePdfUpload}
        accept="application/pdf"
        className="hidden"
      />

      {/* 1. Header Bar */}
      <header className="px-4 sm:px-8 py-3.5 bg-[#FFF9F2]/95 backdrop-blur-md border-b border-[#E5D2BE] flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToHome}
            className="p-2 rounded-lg bg-[#F3E6D5] hover:bg-[#EBD6C1] text-[#800020] border border-[#E5D2BE] transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4 text-[#800020]" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#800020] to-[#D45060] flex items-center justify-center shadow-md shadow-[#800020]/20">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-[#800020] tracking-tight">CryptoSentry AI</h1>
                <span className="text-[10px] font-mono uppercase bg-[#F3E6D5] border border-[#E5D2BE] text-[#800020] px-1.5 py-0.2 rounded font-bold">Active</span>
              </div>
              <p className="text-[11px] text-[#785863]">Verify an Investment Offer</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetChat}
            title="Start new verification session"
            className="p-2 rounded-lg bg-[#F3E6D5] hover:bg-[#EBD6C1] text-[#800020] border border-[#E5D2BE] transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#800020]" />
            <span className="hidden sm:inline">New Session</span>
          </button>
        </div>
      </header>

      {/* 2. Main Conversation Area */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6 max-w-5xl w-full mx-auto">
        {messages.map((message) => {
          const isUser = message.sender === 'user';

          return (
            <div
              key={message.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}
            >
              {/* Sender Kicker */}
              <div className="flex items-center gap-2 text-[11px] text-[#785863] font-mono font-medium">
                <span>{isUser ? 'You' : 'CryptoSentry AI'}</span>
                <span>·</span>
                <span>{message.timestamp}</span>
              </div>

              {/* Message Bubble Container */}
              <div
                className={`rounded-2xl max-w-3xl transition-all ${
                  isUser
                    ? 'bg-[#800020] text-white p-4 sm:p-5 rounded-tr-none shadow-md shadow-[#800020]/20'
                    : 'bg-[#F3E6D5] border border-[#E5D2BE] text-[#2A0812] p-5 sm:p-6 rounded-tl-none shadow-sm w-full'
                }`}
              >
                {/* Text Body */}
                <div className="text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
                  {message.text}
                </div>

                {/* User Attachments Preview (if any) */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/20 space-y-2">
                    {message.attachments.map((att, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-black/15 p-2.5 rounded-xl border border-white/20">
                        {att.type === 'image' && att.previewUrl ? (
                          <div className="flex items-center gap-3">
                            <img
                              src={att.previewUrl}
                              alt={att.name}
                              className="w-16 h-16 object-cover rounded-lg border border-white/20"
                            />
                            <div>
                              <span className="text-xs font-semibold block">{att.name}</span>
                              <span className="text-[11px] opacity-80">{att.size}</span>
                            </div>
                          </div>
                        ) : att.type === 'pdf' ? (
                          <div className="flex items-center gap-2.5">
                            <FileText className="w-5 h-5 text-amber-200" />
                            <div>
                              <span className="text-xs font-semibold block">{att.name}</span>
                              <span className="text-[11px] opacity-80">{att.size}</span>
                            </div>
                          </div>
                        ) : att.type === 'url' ? (
                          <div className="flex items-center gap-2.5">
                            <Globe className="w-4 h-4 text-[#F3E6D5]" />
                            <span className="text-xs font-mono font-medium truncate max-w-xs">{att.name}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2.5">
                            <Coins className="w-4 h-4 text-amber-200" />
                            <span className="text-xs font-medium">{att.name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Verification Pipeline Animation */}
                {message.verificationSteps && (
                  <div className="mt-4 pt-4 border-t border-[#E5D2BE] space-y-2">
                    <span className="text-xs font-mono uppercase text-[#D45060] font-bold block mb-2">
                      {message.isVerifying ? 'Verification In Progress...' : 'Verification Completed'}
                    </span>
                    <div className="space-y-1.5 font-mono text-xs">
                      {message.verificationSteps.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[#5A3844]">
                          {step.done ? (
                            <span className="text-emerald-700 font-bold">✓</span>
                          ) : step.inProgress ? (
                            <Loader2 className="w-3.5 h-3.5 text-[#D45060] animate-spin" />
                          ) : (
                            <span className="text-[#800020]/40">○</span>
                          )}
                          <span className={step.done ? 'text-[#2A0812]' : step.inProgress ? 'text-[#800020] font-bold' : 'text-[#785863]'}>
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Full Interactive Result Card (if verification result produced) */}
              {message.verificationResult && (
                <div className="w-full mt-3">
                  <VerificationResultCard result={message.verificationResult} />
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      {/* 3. Voice Recording Overlay / Bar */}
      {isRecording && (
        <div className="bg-[#F3E6D5] border-t border-[#D45060]/50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 z-20 shrink-0 shadow-xl animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="w-4 h-4 rounded-full bg-[#D45060] block animate-ping absolute inset-0" />
              <span className="w-4 h-4 rounded-full bg-[#D45060] block relative" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#800020]">🎤 Listening...</span>
                <span className="font-mono text-[#D45060] text-xs font-bold">
                  00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
                </span>
              </div>
              <p className="text-xs text-[#5A3844]">
                Speak clearly about what the promoter offered, the price, or what they asked you to do.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={cancelVoiceRecording}
              className="px-3.5 py-1.5 rounded-lg bg-[#FFF9F2] hover:bg-[#EBD6C1] text-[#800020] border border-[#E5D2BE] text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={startVoiceRecording}
              className="px-3.5 py-1.5 rounded-lg bg-[#FFF9F2] hover:bg-[#EBD6C1] text-[#800020] border border-[#E5D2BE] text-xs font-semibold transition-colors"
            >
              Re-record
            </button>
            <button
              type="button"
              onClick={stopVoiceRecording}
              className="px-4 py-1.5 rounded-lg bg-[#800020] hover:bg-[#68001a] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Done Speaking</span>
            </button>
          </div>
        </div>
      )}

      {isVoiceTranscribing && (
        <div className="bg-[#F3E6D5] border-t border-[#E5D2BE] px-6 py-3 flex items-center gap-3 z-20 shrink-0">
          <Loader2 className="w-4 h-4 text-[#800020] animate-spin" />
          <span className="text-xs text-[#800020] font-mono font-bold">Converting your voice to text...</span>
        </div>
      )}

      {/* 4. Pending Attachments Ribbon (before user hits send) */}
      {attachments.length > 0 && !isRecording && (
        <div className="px-4 sm:px-8 py-2 bg-[#F3E6D5] border-t border-[#E5D2BE] flex items-center gap-2 overflow-x-auto z-20 shrink-0">
          <span className="text-[11px] font-mono uppercase text-[#785863] font-bold shrink-0">Attachments:</span>
          {attachments.map((att, idx) => (
            <div key={idx} className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#FFF9F2] text-xs text-[#800020] border border-[#E5D2BE] shrink-0 font-medium">
              {att.type === 'image' && <ImageIcon className="w-3.5 h-3.5 text-[#800020]" />}
              {att.type === 'pdf' && <FileText className="w-3.5 h-3.5 text-amber-700" />}
              {att.type === 'url' && <Globe className="w-3.5 h-3.5 text-[#D45060]" />}
              {att.type === 'crypto_details' && <Coins className="w-3.5 h-3.5 text-amber-700" />}
              <span className="truncate max-w-[150px] font-semibold">{att.name}</span>
              <button
                type="button"
                onClick={() => removeAttachment(idx)}
                className="text-[#785863] hover:text-[#D45060] ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 5. Bottom Chat Input Bar */}
      <footer className="p-3 sm:p-5 bg-[#FFF9F2] border-t border-[#E5D2BE] relative z-20 shrink-0">
        
        {/* Compact Plus (+) Menu Popover */}
        {isMenuOpen && (
          <div className="absolute bottom-20 left-4 sm:left-8 bg-[#FFF9F2] border border-[#E5D2BE] rounded-xl shadow-2xl p-2 w-64 space-y-1 z-30 animate-fade-in">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#785863] px-3 py-1 font-bold">
              Add Evidence
            </div>

            <button
              type="button"
              onClick={() => {
                imageInputRef.current?.click();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs text-[#2A0812] hover:bg-[#F3E6D5] hover:text-[#800020] transition-colors"
            >
              <div className="p-1.5 rounded-md bg-[#F3E6D5] text-[#800020]">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold block">Image</span>
                <span className="text-[10px] text-[#785863]">Screenshot, poster, photo</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                pdfInputRef.current?.click();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs text-[#2A0812] hover:bg-[#F3E6D5] hover:text-[#800020] transition-colors"
            >
              <div className="p-1.5 rounded-md bg-[#F3E6D5] text-amber-800">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold block">PDF</span>
                <span className="text-[10px] text-[#785863]">Whitepaper or brochure</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowUrlDialog(true);
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs text-[#2A0812] hover:bg-[#F3E6D5] hover:text-[#800020] transition-colors"
            >
              <div className="p-1.5 rounded-md bg-[#F3E6D5] text-[#D45060]">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold block">Website</span>
                <span className="text-[10px] text-[#785863]">Enter portal URL</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowCryptoDialog(true);
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-xs text-[#2A0812] hover:bg-[#F3E6D5] hover:text-[#800020] transition-colors"
            >
              <div className="p-1.5 rounded-md bg-[#F3E6D5] text-amber-700">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold block">Crypto Details</span>
                <span className="text-[10px] text-[#785863]">Coin name & quoted price</span>
              </div>
            </button>
          </div>
        )}

        <div className="max-w-4xl mx-auto flex items-center gap-2 sm:gap-3 bg-[#F3E6D5] border border-[#E5D2BE] rounded-2xl p-2 sm:p-2.5 shadow-sm focus-within:border-[#800020]/60 focus-within:ring-1 focus-within:ring-[#800020]/20 transition-all">
          
          {/* Left: Plus Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            title="Attach evidence (Image, PDF, URL, Crypto details)"
            className={`p-2.5 rounded-xl transition-all ${
              isMenuOpen
                ? 'bg-[#800020] text-white rotate-45'
                : 'bg-[#FFF9F2] hover:bg-[#EBD6C1] text-[#800020] border border-[#E5D2BE]'
            }`}
          >
            <Plus className="w-5 h-5 transition-transform" />
          </button>

          {/* Center: Text Input */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type what they told you... (e.g. 'They are selling Bitcoin for ₹5,000 on WhatsApp...')"
            disabled={isProcessing || isRecording}
            className="flex-1 bg-transparent border-0 outline-none resize-none text-sm sm:text-base text-[#2A0812] placeholder-[#785863] py-1.5 px-2 max-h-32 min-h-[28px]"
          />

          {/* Right: Mic Button */}
          <button
            type="button"
            onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
            title={isRecording ? 'Stop voice recording' : 'Speak your details'}
            disabled={isProcessing}
            className={`p-2.5 rounded-xl transition-all ${
              isRecording
                ? 'bg-[#D45060] text-white animate-pulse'
                : 'bg-[#FFF9F2] hover:bg-[#EBD6C1] text-[#800020] hover:text-[#D45060] border border-[#E5D2BE]'
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* Send Arrow Button */}
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={isProcessing || (!inputText.trim() && attachments.length === 0)}
            title="Send for AI verification"
            className={`p-2.5 rounded-xl font-bold transition-all ${
              inputText.trim() || attachments.length > 0
                ? 'bg-[#800020] hover:bg-[#68001a] text-white shadow-md shadow-[#800020]/25 cursor-pointer'
                : 'bg-[#E5D2BE] text-[#785863] cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </footer>

      {/* URL Dialog Modal */}
      {showUrlDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A0812]/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#FFF9F2] border border-[#E5D2BE] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#800020]">
                <Globe className="w-5 h-5 text-[#D45060]" />
                <h3 className="text-base font-bold text-[#800020]">Enter Website URL</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowUrlDialog(false)}
                className="text-[#785863] hover:text-[#800020]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#5A3844]">
              Provide the web address given by the promoter (e.g., https://example-trading.top)
            </p>

            <input
              type="text"
              value={dialogUrlInput}
              onChange={(e) => setDialogUrlInput(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F3E6D5] border border-[#E5D2BE] text-[#2A0812] text-sm focus:outline-none focus:border-[#800020] font-mono"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowUrlDialog(false)}
                className="px-4 py-2 rounded-lg bg-[#F3E6D5] hover:bg-[#EBD6C1] text-[#800020] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddWebsite}
                className="px-4 py-2 rounded-lg bg-[#800020] hover:bg-[#68001a] text-white text-xs font-bold"
              >
                Add Website
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Crypto Details Dialog Modal */}
      {showCryptoDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A0812]/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#FFF9F2] border border-[#E5D2BE] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#800020]">
                <Coins className="w-5 h-5 text-amber-700" />
                <h3 className="text-base font-bold text-[#800020]">Enter Crypto Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCryptoDialog(false)}
                className="text-[#785863] hover:text-[#800020]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-mono uppercase text-[#785863] block mb-1 font-bold">
                  Cryptocurrency / Token Name *
                </label>
                <input
                  type="text"
                  value={dialogCoinName}
                  onChange={(e) => setDialogCoinName(e.target.value)}
                  placeholder="e.g. Bitcoin, Solana, Tether, MetaMoon"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F3E6D5] border border-[#E5D2BE] text-[#2A0812] text-sm focus:outline-none focus:border-[#800020]"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-[#785863] block mb-1 font-bold">
                  Quoted / Claimed Price
                </label>
                <input
                  type="text"
                  value={dialogPrice}
                  onChange={(e) => setDialogPrice(e.target.value)}
                  placeholder="e.g. ₹5,000 or $50"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F3E6D5] border border-[#E5D2BE] text-[#2A0812] text-sm focus:outline-none focus:border-[#800020] font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-[#785863] block mb-1 font-bold">
                  Where was this offered?
                </label>
                <input
                  type="text"
                  value={dialogPlatform}
                  onChange={(e) => setDialogPlatform(e.target.value)}
                  placeholder="e.g. WhatsApp, Telegram group, Instagram DM"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F3E6D5] border border-[#E5D2BE] text-[#2A0812] text-sm focus:outline-none focus:border-[#800020]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCryptoDialog(false)}
                className="px-4 py-2 rounded-lg bg-[#F3E6D5] hover:bg-[#EBD6C1] text-[#800020] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCryptoDetails}
                className="px-4 py-2 rounded-lg bg-[#800020] hover:bg-[#68001a] text-white text-xs font-bold"
              >
                Attach Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
