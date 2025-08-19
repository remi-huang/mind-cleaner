import React from "react";
import { createContext, useContext, useReducer } from 'react';import type { ReactNode } from 'react';
import type { Thought } from './types';

interface AppState {
  thoughts: Thought[];
  isRitualActive: boolean;
}

type AppAction =
  | { type: 'ADD_THOUGHTS'; payload: string[] }
  | { type: 'UPDATE_THOUGHT'; payload: { id: string; updates: Partial<Thought> } }
  | { type: 'REMOVE_THOUGHT'; payload: string }
  | { type: 'CLEAR_ALL' }
  | { type: 'SET_RITUAL_ACTIVE'; payload: boolean };

const initialState: AppState = {
  thoughts: [],
  isRitualActive: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_THOUGHTS':
      const newThoughts: Thought[] = action.payload.map((text, index) => ({
        id: `${Date.now()}-${index}`,
        text: text.trim(),
        section: null,
        hint: getHint(text),
        position: {
          x: Math.random() * (window.innerWidth - 200) + 100,
          y: Math.random() * (window.innerHeight - 200) + 100,
        },
      }));
      return {
        ...state,
        thoughts: [...state.thoughts, ...newThoughts],
      };

    case 'UPDATE_THOUGHT':
      return {
        ...state,
        thoughts: state.thoughts.map(thought =>
          thought.id === action.payload.id
            ? { ...thought, ...action.payload.updates }
            : thought
        ),
      };

    case 'REMOVE_THOUGHT':
      return {
        ...state,
        thoughts: state.thoughts.filter(thought => thought.id !== action.payload),
      };

    case 'CLEAR_ALL':
      return {
        ...state,
        thoughts: [],
        isRitualActive: false,
      };

    case 'SET_RITUAL_ACTIVE':
      return {
        ...state,
        isRitualActive: action.payload,
      };

    default:
      return state;
  }
}

function getHint(text: string): 'keep' | 'letgo' | null {
  const lowerText = text.toLowerCase();
  
  const keepKeywords = ['todo', 'plan', 'call', 'email', 'buy', 'next step', 'remember', 'important', 'goal'];
  const letgoKeywords = ['worry', 'fear', 'useless', 'ruminate', "can't control", 'anxiety', 'stress', 'overthink'];
  
  if (keepKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'keep';
  }
  if (letgoKeywords.some(keyword => lowerText.includes(keyword))) {
    return 'letgo';
  }
  
  return null;
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return React.createElement(
    AppContext.Provider,
    { value: { state, dispatch } },
    children
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
}
