import React, { useState, useEffect } from 'react';
import { AppProvider, useAppState } from './appState';
import { HeaderBar } from './components/HeaderBar';
import { Sections } from './components/Sections';
import { BubbleBoard } from './components/BubbleBoard';
import { VoiceCapture } from './components/VoiceCapture';
import { Ritual } from './components/Ritual';
import { useSpeech } from './hooks/useSpeech';
import './styles/theme.css';

function AppContent() {
  const { state, dispatch } = useAppState();
  const [isListening, setIsListening] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  
  const {
    startListening,
    stopListening,
  } = useSpeech();

  const handleStartListening = () => {
    startListening();
    setIsListening(true);
  };

  const handleStopListening = () => {
    stopListening();
    setIsListening(false);
  };

  const handleNewThoughts = (thoughts: string[]) => {
    dispatch({ type: 'ADD_THOUGHTS', payload: thoughts });
  };

  const handleClearMind = () => {
    dispatch({ type: 'SET_RITUAL_ACTIVE', payload: true });
  };

  const handleRitualComplete = () => {
    dispatch({ type: 'CLEAR_ALL' });
    dispatch({ type: 'SET_RITUAL_ACTIVE', payload: false });
  };

  // Hide welcome message after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink/20 to-lavender/20 relative overflow-hidden">
      {/* Welcome Message */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm">
          <div className="text-center animate-fade-in">
            <div className="text-8xl mb-6 animate-bounce-gentle">🧘‍♀️</div>
            <h1 className="text-4xl font-bold text-ink mb-4">Welcome to Mind-Cleaner</h1>
            <p className="text-xl text-ink/80 mb-8">Breathe in... Breathe out... Speak freely.</p>
            <div className="text-2xl animate-pulse">🌸</div>
          </div>
        </div>
      )}

      {/* Header */}
      <HeaderBar
        isListening={isListening}
        onStartListening={handleStartListening}
        onStopListening={handleStopListening}
        onClearMind={handleClearMind}
      />

      {/* Main Content */}
      <main className="pt-24 h-screen relative">
        {/* Sections as background */}
        <Sections />
        
        {/* Bubble Board layered above */}
        <div className="absolute inset-0 pointer-events-auto">
          <BubbleBoard thoughts={state.thoughts} />
        </div>
      </main>

      {/* Voice Capture */}
      <VoiceCapture
        onNewThoughts={handleNewThoughts}
        isListening={isListening}
        onStartListening={handleStartListening}
        onStopListening={handleStopListening}
      />

      {/* Ritual */}
      <Ritual
        isActive={state.isRitualActive}
        onComplete={handleRitualComplete}
      />

      {/* Instructions Toast */}
      {!showWelcome && state.thoughts.length === 0 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm border border-pink/20 rounded-2xl px-6 py-4 shadow-soft animate-fade-in">
          <p className="text-ink text-center">
            🎤 Click the mic to start speaking, or use "Quick Add" to type your thoughts
          </p>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
