import { useState, useEffect } from 'react';

interface RitualProps {
  isActive: boolean;
  onComplete: () => void;
}

export function Ritual({ isActive, onComplete }: RitualProps) {
  // const { state } = useAppState();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    if (isActive && !showConfirm) {
      setShowConfirm(true);
    }
  }, [isActive, showConfirm]);

  const handleConfirm = () => {
    setShowConfirm(false);
    setIsAnimating(true);
    
    // Create sparkles
    const newSparkles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    }));
    setSparkles(newSparkles);

    // Animate bubbles popping
    const bubbles = document.querySelectorAll('.bubble');
    bubbles.forEach((bubble, index) => {
      setTimeout(() => {
        bubble.classList.add('pop');
      }, index * 100);
    });

    // Complete ritual after animation
    setTimeout(() => {
      setIsAnimating(false);
      setSparkles([]);
      onComplete();
    }, 3000);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    onComplete();
  };

  if (!isActive) return null;

  return (
    <>
      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 shadow-soft animate-scale-in">
            <div className="text-center">
              <div className="text-6xl mb-4">🧘‍♀️</div>
              <h2 className="text-2xl font-bold text-ink mb-4">Ready to let go?</h2>
              <p className="text-ink/80 mb-6">
                This will clear all your thoughts and start fresh. 
                This won't be saved.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3 bg-gray-100 text-ink rounded-pill font-medium hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink to-lavender text-white rounded-pill font-medium shadow-soft hover:shadow-glow transition-all duration-300"
                >
                  Let Go 💖
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ritual Animation Overlay */}
      {isAnimating && (
        <div className="fixed inset-0 z-40 ritual-overlay flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-8xl mb-8 animate-bounce-gentle">🌸</div>
            <h2 className="text-4xl font-bold mb-4">Clearing your mind...</h2>
            <p className="text-xl opacity-90">Breathe in... Breathe out...</p>
          </div>
          
          {/* Sparkles */}
          {sparkles.map((sparkle) => (
            <div
              key={sparkle.id}
              className="sparkle"
              style={{
                left: sparkle.x,
                top: sparkle.y,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
