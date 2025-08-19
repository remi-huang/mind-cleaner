import React from 'react';
import { useAppState } from '../appState';

export function Sections() {
  const { state } = useAppState();
  
  const keepThoughts = state.thoughts.filter(t => t.section === 'keep');
  const letgoThoughts = state.thoughts.filter(t => t.section === 'letgo');

  return (
    <div className="absolute inset-0 flex flex-col lg:flex-row">
      {/* Keep Section */}
      <div
        data-section="keep"
        className="section-zone flex-1 bg-gradient-to-br from-blue to-green p-8 flex flex-col items-center justify-center relative overflow-hidden"
      >
        <div className="text-center z-10">
          <h2 className="text-4xl font-bold text-ink mb-4">Keep 💖</h2>
          <p className="text-ink/80 mb-6 max-w-md">
            Important thoughts, tasks, and ideas to remember
          </p>
          <div className="bg-white/30 backdrop-blur-sm rounded-2xl px-6 py-3">
            <span className="text-2xl font-bold text-ink">{keepThoughts.length}</span>
            <p className="text-sm text-ink/80">thoughts</p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-4 left-4 text-4xl opacity-20">💖</div>
        <div className="absolute bottom-4 right-4 text-3xl opacity-20">✨</div>
        <div className="absolute top-1/2 left-1/4 text-2xl opacity-15 animate-float">🌟</div>
      </div>

      {/* Let Go Section */}
      <div
        data-section="letgo"
        className="section-zone flex-1 bg-gradient-to-br from-pink to-lavender p-8 flex flex-col items-center justify-center relative overflow-hidden"
      >
        <div className="text-center z-10">
          <h2 className="text-4xl font-bold text-ink mb-4">Let Go 🌬️</h2>
          <p className="text-ink/80 mb-6 max-w-md">
            Worries, fears, and thoughts to release
          </p>
          <div className="bg-white/30 backdrop-blur-sm rounded-2xl px-6 py-3">
            <span className="text-2xl font-bold text-ink">{letgoThoughts.length}</span>
            <p className="text-sm text-ink/80">thoughts</p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 text-4xl opacity-20">🌬️</div>
        <div className="absolute bottom-4 left-4 text-3xl opacity-20">🍃</div>
        <div className="absolute top-1/2 right-1/4 text-2xl opacity-15 animate-float">💨</div>
      </div>
    </div>
  );
}
