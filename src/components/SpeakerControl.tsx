import React, { useEffect, useState } from 'react';
import { Volume2, Pause, Play, Square } from 'lucide-react';
import { speechService } from '../utils/audioUtils.ts';

interface SpeakerControlProps {
  textToSpeak: string;
  label?: string;
  className?: string;
}

export const SpeakerControl: React.FC<SpeakerControlProps> = ({
  textToSpeak,
  label = 'Listen',
  className = ''
}) => {
  const [speechState, setSpeechState] = useState(speechService.getState());

  useEffect(() => {
    const unsubscribe = speechService.subscribe((state) => {
      setSpeechState(state);
    });
    return unsubscribe;
  }, []);

  const isCurrentText = speechState.currentText === textToSpeak;
  const isPlaying = isCurrentText && speechState.isSpeaking && !speechState.isPaused;
  const isPaused = isCurrentText && speechState.isPaused;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCurrentText) {
      speechService.speak(textToSpeak);
    } else if (isPlaying) {
      speechService.pause();
    } else if (isPaused) {
      speechService.resume();
    } else {
      speechService.speak(textToSpeak);
    }
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    speechService.stop();
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <button
        type="button"
        onClick={handleToggle}
        title={isPlaying ? 'Pause narration' : isPaused ? 'Resume narration' : 'Listen to this explanation'}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          isPlaying
            ? 'bg-[#D45060]/20 text-[#800020] border border-[#D45060]/50 shadow-sm animate-pulse'
            : isPaused
            ? 'bg-[#F3E6D5] text-[#800020] border border-[#800020]/40'
            : 'bg-[#F3E6D5] hover:bg-[#EBD6C1] text-[#800020] border border-[#E5D2BE] shadow-xs'
        }`}
      >
        {isPlaying ? (
          <>
            <Pause className="w-3.5 h-3.5 text-[#D45060]" />
            <span>Playing...</span>
          </>
        ) : isPaused ? (
          <>
            <Play className="w-3.5 h-3.5 text-[#800020] fill-[#800020]" />
            <span>Resume</span>
          </>
        ) : (
          <>
            <Volume2 className="w-3.5 h-3.5 text-[#800020]" />
            <span>{label}</span>
          </>
        )}
      </button>

      {(isPlaying || isPaused) && (
        <button
          type="button"
          onClick={handleStop}
          title="Stop narration"
          className="p-1.5 rounded-lg bg-[#F3E6D5] text-[#5A3844] hover:text-[#800020] hover:bg-[#EBD6C1] border border-[#E5D2BE] transition-colors"
        >
          <Square className="w-3 h-3 fill-current" />
        </button>
      )}
    </div>
  );
};
