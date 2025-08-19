import { useState, useCallback, useRef } from 'react';

interface DragState {
  isDragging: boolean;
  dragOffset: { x: number; y: number };
  currentPosition: { x: number; y: number };
}

interface UseDragReturn {
  dragState: DragState;
  startDrag: (e: React.PointerEvent, initialPosition: { x: number; y: number }) => void;
  onDrag: (e: React.PointerEvent) => void;
  endDrag: () => void;
  getDropTarget: (position: { x: number; y: number }) => 'keep' | 'letgo' | null;
}

export function useDrag(): UseDragReturn {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
    currentPosition: { x: 0, y: 0 },
  });

  const dragRef = useRef<DragState>(dragState);

  const startDrag = useCallback((e: React.PointerEvent, initialPosition: { x: number; y: number }) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setDragState({
      isDragging: true,
      dragOffset: { x: offsetX, y: offsetY },
      currentPosition: initialPosition,
    });

    dragRef.current = {
      isDragging: true,
      dragOffset: { x: offsetX, y: offsetY },
      currentPosition: initialPosition,
    };

    // Prevent text selection during drag
    e.preventDefault();
  }, []);

  const onDrag = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.isDragging) return;

    const newX = e.clientX - dragRef.current.dragOffset.x;
    const newY = e.clientY - dragRef.current.dragOffset.y;

    setDragState(prev => ({
      ...prev,
      currentPosition: { x: newX, y: newY },
    }));

    dragRef.current.currentPosition = { x: newX, y: newY };
  }, []);

  const endDrag = useCallback(() => {
    setDragState(prev => ({
      ...prev,
      isDragging: false,
    }));
    dragRef.current.isDragging = false;
  }, []);

  const getDropTarget = useCallback((position: { x: number; y: number }): 'keep' | 'letgo' | null => {
    // Get the sections from the DOM
    const keepSection = document.querySelector('[data-section="keep"]');
    const letgoSection = document.querySelector('[data-section="letgo"]');

    if (!keepSection || !letgoSection) return null;

    const keepRect = keepSection.getBoundingClientRect();
    const letgoRect = letgoSection.getBoundingClientRect();

    // Check if position is within keep section
    if (
      position.x >= keepRect.left &&
      position.x <= keepRect.right &&
      position.y >= keepRect.top &&
      position.y <= keepRect.bottom
    ) {
      return 'keep';
    }

    // Check if position is within letgo section
    if (
      position.x >= letgoRect.left &&
      position.x <= letgoRect.right &&
      position.y >= letgoRect.top &&
      position.y <= letgoRect.bottom
    ) {
      return 'letgo';
    }

    return null;
  }, []);

  return {
    dragState,
    startDrag,
    onDrag,
    endDrag,
    getDropTarget,
  };
}
