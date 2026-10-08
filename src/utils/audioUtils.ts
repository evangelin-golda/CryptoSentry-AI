/**
 * Audio Utilities for CryptoSentry AI
 * Supports Text-to-Speech (Listen feature) and Speech-to-Text (Voice input)
 */

export interface SpeechState {
  isSpeaking: boolean;
  isPaused: boolean;
  currentText: string | null;
}

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking = false;
  private isPaused = false;
  private listeners: Set<(state: SpeechState) => void> = new Set();
  private currentText: string | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public subscribe(listener: (state: SpeechState) => void) {
    this.listeners.add(listener);
    listener({ isSpeaking: this.isSpeaking, isPaused: this.isPaused, currentText: this.currentText });
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) =>
      fn({ isSpeaking: this.isSpeaking, isPaused: this.isPaused, currentText: this.currentText })
    );
  }

  public speak(text: string) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    // If currently paused with the same text, resume
    if (this.isPaused && this.currentText === text) {
      this.synth.resume();
      this.isPaused = false;
      this.isSpeaking = true;
      this.notify();
      return;
    }

    // Cancel any ongoing speech
    this.stop();

    // Clean markdown/special characters for speech
    const cleanText = text
      .replace(/[#*`_~]/g, '')
      .replace(/₹/g, ' Rupees ')
      .replace(/•/g, ', ')
      .replace(/https?:\/\/\S+/g, 'link');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95; // Clear and measured pace
    utterance.pitch = 1.0;

    // Pick a natural English voice if available
    const voices = this.synth.getVoices();
    const englishVoice = voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.isPaused = false;
      this.currentText = text;
      this.notify();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentText = null;
      this.currentUtterance = null;
      this.notify();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentText = null;
      this.currentUtterance = null;
      this.notify();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.isSpeaking && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
      this.notify();
    }
  }

  public resume() {
    if (this.synth && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      this.notify();
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentText = null;
      this.currentUtterance = null;
      this.notify();
    }
  }

  public getState() {
    return {
      isSpeaking: this.isSpeaking,
      isPaused: this.isPaused,
      currentText: this.currentText,
    };
  }
}

export const speechService = new SpeechService();
