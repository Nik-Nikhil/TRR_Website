import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface AuctionGavelProps {
  show?: boolean;
}

export const AuctionGavel = ({ show = true }: AuctionGavelProps) => {
  const [activeBids, setActiveBids] = useState<Array<{ id: number; position: number }>>([]);
  const bidPositions = [10, 25, 40, 55, 70, 85];
  const [nextId, setNextId] = useState(0);

  useEffect(() => {
    const addBid = () => {
      setActiveBids(prev => {
        // Get positions that are currently occupied
        const occupiedPositions = prev.map(bid => bid.position);
        
        // Get available positions
        const availablePositions = bidPositions.filter(pos => !occupiedPositions.includes(pos));
        
        // If no positions available, remove oldest bid first
        if (availablePositions.length === 0) {
          return prev.slice(1);
        }
        
        // Pick random available position
        const randomPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)];
        
        // Add new bid
        const newBid = { id: nextId, position: randomPosition };
        setNextId(prev => prev + 1);
        
        // Keep max 3 bids
        const updated = [...prev, newBid];
        return updated.length > 3 ? updated.slice(1) : updated;
      });
    };

    // Schedule bids at constant intervals with random timing
    const scheduleNext = () => {
      const randomDelay = Math.random() * 3000 + 3000; // 3000-6000ms constant
      return setTimeout(() => {
        addBid();
        timeoutRef.current = scheduleNext();
      }, randomDelay);
    };

    // Start with first scheduled bid (no immediate bid)
    const timeoutRef = { current: scheduleNext() };

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [nextId]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center justify-center py-8"
        >
          <div className="relative w-64 h-48">
            {/* Sound block base - bigger */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-32 h-8 bg-gradient-to-b from-amber-800 to-amber-950 rounded-lg shadow-xl">
              <div className="absolute inset-1 bg-amber-900/50 rounded-md" />
            </div>

            {/* Gavel - Starts higher and stops at table top */}
            <motion.div
              className="absolute top-4 left-1/2 z-10"
              style={{ 
                transformOrigin: '80% 50%',
                x: '-40%',
              }}
              animate={{
                rotate: [-50, 0, -50],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: [0.4, 0, 0.2, 1],
                times: [0, 0.3, 1]
              }}
            >
              {/* Gavel - horizontal orientation, bigger */}
              <div className="relative flex items-center">
                {/* Handle - horizontal, bigger */}
                <div className="w-20 h-5 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 rounded-full shadow-lg">
                  {/* Wood grain lines */}
                  <div className="absolute inset-0 flex items-center justify-around px-2">
                    <div className="w-px h-4 bg-amber-800/30" />
                    <div className="w-px h-4 bg-amber-800/30" />
                    <div className="w-px h-4 bg-amber-800/30" />
                  </div>
                  {/* Highlight */}
                  <div className="absolute top-0 left-2 right-2 h-1 bg-amber-400/40 rounded-full blur-sm" />
                </div>
                
                {/* Gavel head at left end, bigger */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-9 h-12 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 rounded-lg shadow-xl">
                  {/* Top highlight */}
                  <div className="absolute top-1 left-1 right-1 h-1 bg-amber-300/50 rounded-full" />
                  {/* Bottom detail */}
                  <div className="absolute bottom-1 left-1 right-1 h-1 bg-amber-900/50 rounded" />
                  {/* Metal band */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-1 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400" />
                </div>
              </div>
            </motion.div>

            {/* Impact effect when gavel hits */}
            <motion.div
              className="absolute bottom-22 left-1/2 -translate-x-1/2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                times: [0, 0.35, 0.5],
              }}
            >
              <div className="w-16 h-2 bg-amber-400/60 rounded-full blur-md" />
            </motion.div>

            {/* Radiating lines on impact */}
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={`line-${i}`}
                className="absolute bottom-22 left-1/2 -translate-x-1/2 w-1 h-8 bg-gradient-to-t from-amber-400 to-transparent origin-bottom"
                style={{
                  rotate: `${i * 45 - 67.5}deg`,
                }}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{
                  scaleY: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  times: [0, 0.35, 0.5],
                }}
              />
            ))}

            {/* BID signs - Multiple cards, no overlapping */}
            <AnimatePresence>
              {activeBids.map((bid) => (
                <motion.div
                  key={bid.id}
                  className="absolute bottom-0"
                  style={{
                    left: `${bid.position}%`,
                  }}
                  initial={{ y: 20, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -20, opacity: 0, scale: 0.8 }}
                  transition={{
                    duration: 0.5,
                    ease: "easeInOut"
                  }}
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg border-2 border-purple-700 flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xs">BID</span>
                    </div>
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-1 h-6 bg-amber-700" />
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 w-4 h-3 bg-amber-200 rounded-full" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
