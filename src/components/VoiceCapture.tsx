import React, { useEffect, useState } from 'react';
import { useSpeech } from '../hooks/useSpeech';

interface VoiceCaptureProps {
  onNewThoughts: (thoughts: string[]) => void;
  isListening: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
}

export function VoiceCapture({ 
  onNewThoughts, 
  isListening, 
  onStartListening, 
  onStopListening 
}: VoiceCaptureProps) {
  const {
    interimTranscript,
    finalTranscript,
    error,
    resetTranscript,
  } = useSpeech();

  const [lastFinalTranscript, setLastFinalTranscript] = useState('');

  // Process final transcript into thoughts
  useEffect(() => {
    if (finalTranscript !== lastFinalTranscript && finalTranscript.trim()) {
      const newText = finalTranscript.substring(lastFinalTranscript.length);
      if (newText.trim()) {
        const thoughts = splitIntoThoughts(newText);
        if (thoughts.length > 0) {
          onNewThoughts(thoughts);
        }
      }
      setLastFinalTranscript(finalTranscript);
    }
  }, [finalTranscript, lastFinalTranscript, onNewThoughts]);

  const splitIntoThoughts = (text: string): string[] => {
    // Split by sentence endings, common fillers, and pauses
    const sentences = text
      .split(/[.!?。！？\n]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const thoughts: string[] = [];
    
    sentences.forEach(sentence => {
      // Further split by common fillers
      const parts = sentence.split(/\s+(?:and then|I think|you know|like|um|uh|so|well)\s+/i);
      parts.forEach(part => {
        const trimmed = part.trim();
        if (trimmed.length > 3) { // Only include meaningful thoughts
          thoughts.push(trimmed);
        }
      });
    });

    return thoughts;
  };

  const handleToggleListening = () => {
    if (isListening) {
      onStopListening();
      resetTranscript();
    } else {
      onStartListening();
    }
  };

  if (error) {
    return (
      <div className="fixed top-4 right-4 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-2xl shadow-soft">
        <p className="text-sm">🎤 {error}</p>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Live transcript display */}
      {interimTranscript && (
        <div className="mb-4 bg-white/90 backdrop-blur-sm border border-pink/20 rounded-2xl p-4 shadow-soft max-w-xs">
          <p className="text-sm text-ink/80 mb-2">🎤 Listening...</p>
          <p className="text-sm text-ink animate-fade-in">
            {interimTranscript}
          </p>
        </div>
      )}

      {/* Mic button */}
      <button
        onClick={handleToggleListening}
        className={`
          w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-soft
          transition-all duration-300 transform hover:scale-110
          ${isListening 
            ? 'bg-gradient-to-br from-pink to-lavender text-white animate-bounce-gentle' 
            : 'bg-white/90 backdrop-blur-sm text-ink hover:bg-pink/20'
          }
        `}
        aria-label={isListening ? 'Stop listening' : 'Start listening'}
      >
        {isListening ? '🎤' : '🎤'}
      </button>
    </div>
  );
}
