// src/pages/seasons/Season6Standings.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Season6Standings() {
  const [currentBg, setCurrentBg] = useState(1);

  // Auto-cycle backgrounds every 20 seconds - same as homepage
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg(prev => {
        if (prev === 1) return 2;
        if (prev === 2) return 3;
        return 1;
      });
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const backgrounds = [


    { id: 1, url: '/bg1.jpg', name: 'BG1' },
    { id: 2, url: '/bg2.jpg', name: 'BG2' },
    { id: 3, url: '/bg3.jpg', name: 'BG3' }
  ];

  return (
    <>
      {/* Fixed Background - Same pattern as Homepage */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
          style={{ 
            backgroundImage: `url(${backgrounds.find(bg => bg.id === currentBg)?.url})`,
          }}
        />
        {/* Much lighter overlay to make background visible */}
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 0% 0%, rgba(192,192,192,0.05), transparent 60%), radial-gradient(circle at 100% 100%, rgba(136,144,150,0.03), transparent 60%), rgba(5,7,10,0.3)"
          }}
        />
        <div className="absolute inset-0 bg-linear-to-br from-gray-800/10 via-slate-900/15 to-gray-900/20" />
        {/* Subtle animated orbs with reduced opacity */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-linear-to-r from-gray-400/5 to-slate-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-linear-to-r from-slate-500/5 to-gray-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main Content - Same pattern as Homepage */}
      <main className="relative py-1 pt-24">
        <div className="relative z-10 min-h-0">
          <div className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-6">
            
            {/* Header - Same pattern as Homepage */}
            <div className="text-center mb-6 relative pt-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-linear-to-rrom-orange-400 via-red-400 to-orange-500 bg-clip-text text-transparent mb-2">
                  Season 6 Standings
                </h1>
                <p className="text-base md:text-lg lg:text-xl text-gray-400">Current tournament standings and results</p>
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="w-full flex justify-center pb-4">
              <div className="w-full max-w-[1100px] px-3 sm:px-4 md:px-6 relative">
                
                {/* TBA Card with Homepage styling */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gray-800/20 backdrop-blur-xl border border-gray-600/30 rounded-xl p-8 hover:border-gray-400/50 hover:bg-gray-700/20 transition-all duration-300 group text-center relative"
                >
                  {/* Subtle glow effect on hover */}
                  <div className="absolute inset-0 bg-linear-to-br from-gray-400/5 to-slate-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center">
                        <span className="text-orange-400 text-2xl">🏆</span>
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mb-2">Season 6 Standings</h2>
                    <p className="text-gray-300 text-lg mb-6">Tournament standings will be available once Season 6 begins</p>
                    
                    <div className="inline-block px-6 py-3 bg-linear-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-full text-orange-300 font-medium">
                      <span className="text-xl font-semibold tracking-wider uppercase">Coming Soon</span>
                    </div>
                  </div>
                </motion.div>

              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
