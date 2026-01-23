// src/pages/Announcements.tsx
import { motion } from "framer-motion";

export default function Announcements() {
  return (
    <>
      {/* Fixed Background with bg5.webp - Cyan/Teal Theme */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/bg5.webp)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-cyan-950/80 to-teal-950/90" />
        
        {/* Mystical glow effects - Cyan/Teal theme */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-cyan-500/40 animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl bg-teal-500/30 animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full blur-3xl bg-blue-500/25 animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
        </div>
      </div>

      <main className="relative z-10 w-full min-h-screen flex justify-center pt-20 sm:pt-24 pb-12 sm:pb-16 px-3 sm:px-4 md:px-6">
        <div className="w-full max-w-[1600px]">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-teal-200 to-blue-200 drop-shadow-[0_0_30px_rgba(6,182,212,0.5)] mb-4">
              Announcements
            </h1>
            <p className="text-lg text-cyan-300/70 max-w-2xl mx-auto">
              Stay updated with the latest news, tournament updates, and community announcements
            </p>
          </motion.div>

          {/* Empty State */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col items-center justify-center min-h-[500px] text-center"
          >
            {/* Main Card */}
            <div className="rounded-3xl border border-cyan-500/20 bg-black/40 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.8)] p-12 max-w-2xl mx-auto">
              {/* Animated Icon */}
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-8xl mb-8"
              >
                📢
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-300 mb-4"
              >
                No Announcements Yet
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-cyan-200/70 text-lg leading-relaxed mb-8"
              >
                We're preparing exciting updates and announcements for the community. 
                Check back soon for tournament news, rule updates, and special events!
              </motion.p>

              {/* Decorative Elements */}
              <div className="flex justify-center gap-4 mb-6">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3
                    }}
                    className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-teal-500"
                  />
                ))}
              </div>

              {/* Coming Soon Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-400/30 backdrop-blur-sm"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full"
                />
                <span className="text-orange-300 font-semibold text-sm uppercase tracking-wider">
                  Coming Soon
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}