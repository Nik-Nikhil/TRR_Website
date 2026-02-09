import { motion } from "framer-motion";

interface AnimatedHammerProps {
  show: boolean;
}

export function AnimatedHammer({ show }: AnimatedHammerProps) {
  if (!show) return null;

  return (
    <div className="relative w-32 h-32 mx-auto">
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          rotate: [0, -25, 0, -25, 0],
          scale: [1, 1.1, 1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-2xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Hammer Head */}
          <motion.rect
            x="55"
            y="15"
            width="35"
            height="20"
            rx="3"
            className="fill-gradient-to-r from-gray-400 to-gray-600"
            fill="url(#hammerGradient)"
            animate={{
              fill: ["#9CA3AF", "#6B7280", "#9CA3AF"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
          
          {/* Hammer Handle */}
          <motion.rect
            x="45"
            y="30"
            width="8"
            height="55"
            rx="4"
            fill="#8B4513"
            animate={{
              fill: ["#8B4513", "#A0522D", "#8B4513"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />

          {/* Impact Effect */}
          <motion.circle
            cx="49"
            cy="85"
            r="8"
            fill="#FFD700"
            opacity="0"
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              times: [0, 0.5, 1],
            }}
          />

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="hammerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D1D5DB" />
              <stop offset="100%" stopColor="#6B7280" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />
    </div>
  );
}
