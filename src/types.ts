export type Thought = {
  id: string;
  text: string;
  section: 'keep' | 'letgo' | null;
  hint?: 'keep' | 'letgo' | null;
  position?: { x: number; y: number };
};

export type SpeechState = {
  isListening: boolean;
  interimTranscript: string;
  finalTranscript: string;
  error: string | null;
};
