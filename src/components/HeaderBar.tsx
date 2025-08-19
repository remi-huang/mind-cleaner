import React, { useState } from 'react';
import { useAppState } from '../appState';

interface HeaderBarProps {
  isListening: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onClearMind: () => void;
}

export function HeaderBar({ 
  isListening, 
  onStartListening, 
  onStopListening, 
  onClearMind 
}: HeaderBarProps) {
  const { dispatch } = useAppState();
  const [quickAddText, setQuickAddText] = useState('');

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickAddText.trim()) {
      dispatch({ type: 'ADD_THOUGHTS', payload: [quickAddText.trim()] });
      setQuickAddText('');
    }
  };

  const handleMicToggle = () => {
    if (isListening) {
      onStopListening();
    } else {
      onStartListening();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-sm border-b border-pink/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink to-lavender rounded-2xl flex items-center justify-center text-2xl shadow-soft shimmer">
              🧘‍♀️
            </div>
            <div>
              <h1 className="text-2xl font-bold text-ink">Mind-Cleaner</h1>
              <p className="text-sm text-ink/60">Voice your thoughts, organize your mind</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Quick Add */}
            <form onSubmit={handleQuickAdd} className="flex items-center space-x-2">
              <input
                type="text"
                value={quickAddText}
                onChange={(e) => setQuickAddText(e.target.value)}
                placeholder="Quick add a thought..."
                className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-pink/20 rounded-pill text-sm text-ink placeholder-ink/50 focus:outline-none focus:border-pink/40 transition-colors duration-200"
              />
              <button
                type="submit"
                disabled={!quickAddText.trim()}
                className="px-4 py-2 bg-gradient-to-r from-blue to-green text-white rounded-pill text-sm font-medium hover:shadow-soft transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </form>

            {/* Mic Button */}
            <button
              onClick={handleMicToggle}
              className={`
                w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-soft
                transition-all duration-300 transform hover:scale-110
                ${isListening 
                  ? 'bg-gradient-to-br from-pink to-lavender text-white animate-bounce-gentle' 
                  : 'bg-white/80 backdrop-blur-sm text-ink hover:bg-pink/20 border border-pink/20'
                }
              `}
              aria-label={isListening ? 'Stop listening' : 'Start listening'}
            >
              {isListening ? '🎤' : '🎤'}
            </button>

            {/* Clear Mind Button */}
            <button
              onClick={onClearMind}
              className="px-6 py-3 bg-gradient-to-r from-pink to-lavender text-white rounded-pill font-medium shadow-soft hover:shadow-glow transition-all duration-300 transform hover:scale-105"
            >
              Clear Mind 🌸
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
