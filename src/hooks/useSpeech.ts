import { useState, useCallback, useEffect } from 'react';
import { SpeechState } from '../types';

interface UseSpeechReturn {
  isListening: boolean;
  interimTranscript: string;
  finalTranscript: string;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  onNewThoughts: (thoughts: string[]) => void;
}

export function useSpeech(): UseSpeechReturn {
  const [state, setState] = useState<SpeechState>({
    isListening: false,
    interimTranscript: '',
    finalTranscript: '',
    error: null,
  });

  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setState(prev => ({ ...prev, error: 'Speech recognition not supported in this browser' }));
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US,zh-CN'; // Support English and Chinese

    recognitionInstance.onstart = () => {
      setState(prev => ({ ...prev, isListening: true, error: null }));
    };

    recognitionInstance.onend = () => {
      setState(prev => ({ ...prev, isListening: false }));
    };

    recognitionInstance.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setState(prev => ({
        ...prev,
        interimTranscript,
        finalTranscript: prev.finalTranscript + finalTranscript,
      }));
    };

    recognitionInstance.onerror = (event: any) => {
      setState(prev => ({
        ...prev,
        error: `Speech recognition error: ${event.error}`,
        isListening: false,
      }));
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognition && !state.isListening) {
      try {
        recognition.start();
      } catch (error) {
        setState(prev => ({ ...prev, error: 'Failed to start speech recognition' }));
      }
    }
  }, [recognition, state.isListening]);

  const stopListening = useCallback(() => {
    if (recognition && state.isListening) {
      recognition.stop();
    }
  }, [recognition, state.isListening]);

  const resetTranscript = useCallback(() => {
    setState(prev => ({ ...prev, interimTranscript: '', finalTranscript: '' }));
  }, []);

  const onNewThoughts = useCallback((thoughts: string[]) => {
    // This will be called by the component using this hook
    console.log('New thoughts:', thoughts);
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    resetTranscript,
    onNewThoughts,
  };
}
