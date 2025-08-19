import React, { useState } from 'react';
import { Thought } from '../types';
import { useDrag } from '../hooks/useDrag';
import { useAppState } from '../appState';

interface BubbleBoardProps {
  thoughts: Thought[];
}

export function BubbleBoard({ thoughts }: BubbleBoardProps) {
  const { dragState, startDrag, onDrag, endDrag, getDropTarget } = useDrag();
  const { dispatch } = useAppState();
  const [draggedThought, setDraggedThought] = useState<Thought | null>(null);

  const handlePointerDown = (e: React.PointerEvent, thought: Thought) => {
    const position = thought.position || { x: 0, y: 0 };
    startDrag(e, position);
    setDraggedThought(thought);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragState.isDragging) {
      onDrag(e);
      
      // Check for drop target highlighting
      const dropTarget = getDropTarget(dragState.currentPosition);
      const keepSection = document.querySelector('[data-section="keep"]');
      const letgoSection = document.querySelector('[data-section="letgo"]');
      
      if (keepSection) {
        keepSection.classList.toggle('highlight', dropTarget === 'keep');
      }
      if (letgoSection) {
        letgoSection.classList.toggle('highlight', dropTarget === 'letgo');
      }
    }
  };

  const handlePointerUp = () => {
    if (dragState.isDragging && draggedThought) {
      const dropTarget = getDropTarget(dragState.currentPosition);
      
      if (dropTarget) {
        dispatch({
          type: 'UPDATE_THOUGHT',
          payload: { id: draggedThought.id, updates: { section: dropTarget } }
        });
      }
      
      // Remove highlighting
      const keepSection = document.querySelector('[data-section="keep"]');
      const letgoSection = document.querySelector('[data-section="letgo"]');
      if (keepSection) keepSection.classList.remove('highlight');
      if (letgoSection) letgoSection.classList.remove('highlight');
    }
    
    endDrag();
    setDraggedThought(null);
  };

  const handleRemoveThought = (thoughtId: string) => {
    dispatch({ type: 'REMOVE_THOUGHT', payload: thoughtId });
  };

  const getBubbleStyle = (thought: Thought) => {
    const position = thought.position || { x: 0, y: 0 };
    const isBeingDragged = draggedThought?.id === thought.id && dragState.isDragging;
    
    return {
      position: 'absolute' as const,
      left: isBeingDragged ? dragState.currentPosition.x : position.x,
      top: isBeingDragged ? dragState.currentPosition.y : position.y,
      transform: isBeingDragged ? 'scale(1.1)' : 'scale(1)',
      zIndex: isBeingDragged ? 1000 : 1,
    };
  };

  const getBubbleColors = (thought: Thought) => {
    if (thought.section === 'keep') {
      return 'bg-gradient-to-br from-blue to-green text-ink';
    } else if (thought.section === 'letgo') {
      return 'bg-gradient-to-br from-pink to-lavender text-ink';
    } else {
      return 'bg-white/90 backdrop-blur-sm text-ink border border-pink/20';
    }
  };

  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {thoughts.map((thought) => (
        <div
          key={thought.id}
          className={`
            bubble absolute cursor-grab active:cursor-grabbing
            ${getBubbleColors(thought)}
            ${draggedThought?.id === thought.id && dragState.isDragging ? 'dragging' : ''}
            rounded-2xl px-4 py-2 shadow-soft max-w-xs
            transition-all duration-300
          `}
          style={getBubbleStyle(thought)}
          onPointerDown={(e) => handlePointerDown(e, thought)}
        >
          <div className="relative">
            <p className="text-sm leading-relaxed break-words">
              {thought.text}
            </p>
            
            {/* Hint badge */}
            {thought.hint && (
              <div className={`hint-badge hint-${thought.hint}`}>
                {thought.hint === 'keep' ? '💖' : '🌬️'}
              </div>
            )}
            
            {/* Remove button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveThought(thought.id);
              }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-400 hover:bg-red-500 text-white rounded-full flex items-center justify-center text-xs transition-colors duration-200"
              aria-label="Remove thought"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
