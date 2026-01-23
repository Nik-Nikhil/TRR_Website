// src/pages/HallOfFame.tsx
import { useRef, useState, useEffect, type UIEvent, type PointerEvent } from "react";
import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { players } from "../data/players";

/* --------- Types --------- */
/* --------- Utilities --------- */
// Function to find player ID by nickname
const findPlayerIdByNickname = (nickname: string): string | null => {
  const player = players.find(p => p.nickname.toLowerCase() === nickname.toLowerCase());
  return player ? player.id : null;
};

/* --------- Season Champion Data --------- */
const seasonChampions = [
  {
    season: 1,
    year: "2023",
    champion: { 
      teamId: "godspeed", 
      teamName: "Imposters", 
      captain: "Godspeed",
      players: ["Godspeed", "Toby", "Narai", "Atomic", "GRIMM"]
    },
    runnerUp: { 
      teamId: "reciprocal", 
      teamName: "Pandey Randi", 
      captain: "r3ciprocal",
      players: ["r3ciprocal", "DeathShadow", "Machine", "Phola", "Slappy"]
    },
    third: { 
      teamId: "banner", 
      teamName: "LORDS", 
      captain: "Banner",
      players: ["Banner", "RockeR", "Server", "Skyie@", "LordImpaler"]
    }
  },
  {
    season: 2,
    year: "2023", 
    champion: { 
      teamId: "mslayer-s2", 
      teamName: "Stylish Slayers", 
      captain: "MSlayer",
      players: ["MSlayer", "Master Instinct", "Phola", "Billy", "Nabeel"]
    },
    runnerUp: { 
      teamId: "bazinga-s2", 
      teamName: "Ohh Yes Dabba Kardiya", 
      captain: "Bazinga",
      players: ["Bazinga", "Inner Peace-", "Irene", "Farhan", "Arindam7"]
    },
    third: { 
      teamId: "ngx-Irox-s2", 
      teamName: "Kasauli Tigers", 
      captain: "Irox",
      players: ["Irox", "RockeR", "Noob CA", "Guts", "AaRoN"]
    }
  },
  {
    season: 3,
    year: "2024",
    champion: { 
      teamId: "dynamodon-s3", 
      teamName: "Dynamite", 
      captain: "DynamoDon",
      players: ["DynamoDon", "Shiro", "Inner Peace-", "FOX", "Ov3rconfidenc3"]
    },
    runnerUp: { 
      teamId: "nemesisx001-s3", 
      teamName: "Nemesis", 
      captain: "Dr_Nemesis_X",
      players: ["Dr_Nemesis_X", "Master Instinct", "Billy", "Bazinga", "Yuno"]
    },
    third: { 
      teamId: "shaidota-s3", 
      teamName: "Something Sinister", 
      captain: "Shaidota",
      players: ["Shaidota", "Voodoo", "BrõwÑ ẞöy", "SSM-iwnl", "MYM|LUCKY13"]
    }
  },
  {
    season: 4,
    year: "2024",
    champion: { 
      teamId: "future-s4", 
      teamName: "Future", 
      captain: "Future",
      players: ["Future", "IM still Noob", "SKOOTI", "DeathShadow", "Porthos"]
    },
    runnerUp: { 
      teamId: "s1mpleo-s4", 
      teamName: "S1mpleO", 
      captain: "S1mpleO",
      players: ["S1mpleO", "BaPU", "Ultra.NoobPk", "zai_7", "TeRroRr"]
    },
    third: { 
      teamId: "helm-s4", 
      teamName: "Helm", 
      captain: "Helm",
      players: ["Helm", "Kunaka", "Gotatch captain", "FADE", "Madlad"]
    }
  },
  {
    season: 5,
    year: "2024",
    champion: { 
      teamId: "bull-s5", 
      teamName: "bull", 
      captain: "bull",
      players: ["bull", "Kunaka", "Rockrobin", "Mslayer", "Dracarys"]
    },
    runnerUp: { 
      teamId: "shadow-s5", 
      teamName: "shadow", 
      captain: "shadow",
      players: ["shadow", "dp", "Ming~ ^._.^", "CurserdTerror", "I will bully u"]
    },
    third: { 
      teamId: "sai-s5", 
      teamName: "Sai", 
      captain: "Sai",
      players: ["Sai", "Xcarnation", "Anzu", "Echo Salami", "*Foujii"]
    }
  }
];

/* --------- Utilities --------- */
const rowVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, ease: [0.22, 0.61, 0.36, 1] },
  }),
  hover: { scale: 1.01, translateY: -2 },
};

/* --------- Season Hall of Fame Card --------- */
function SeasonHallOfFameCard({ seasonData }: { seasonData: typeof seasonChampions[0] }) {
  const podium = [
    { ...seasonData.champion, rank: "champion", icon: "🏆", position: "1st" },
    { ...seasonData.runnerUp, rank: "runnerUp", icon: "🥈", position: "2nd" },
    { ...seasonData.third, rank: "third", icon: "🥉", position: "3rd" }
  ];

  return (
    <div className="w-full flex justify-center pb-4">
      <div className="w-full max-w-[1100px] px-3 sm:px-4 md:px-6 relative pt-2">
        <div className="rounded-lg sm:rounded-xl border border-cyan-500/20 shadow-[0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden relative group" style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}>
          
          {/* Compact Header */}
          <div className="px-2 sm:px-3 py-1.5 sm:py-2 text-center bg-gradient-to-br from-black/40 via-gray-900/30 to-black/20 border-b border-cyan-500/30">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <h3 className="text-sm sm:text-base md:text-lg uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-200 to-yellow-300 font-bold mb-0.5">
                Season {seasonData.season} Champions
              </h3>
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto rounded-full shadow-[0_0_6px_rgba(251,191,36,0.6)]"></div>
            </motion.div>
          </div>

          {/* Podium Layout */}
          <div className="p-1.5 sm:p-2">
            <div className="flex flex-col items-center max-w-4xl mx-auto">
              
              {/* Team Cards with Medals - Grid Layout for Perfect Centering */}
              <div className="relative w-full max-w-[800px] mx-auto mb-1">
                {/* Cards positioned using CSS Grid for perfect alignment */}
                <div className="grid grid-cols-3 gap-0 items-end justify-items-center relative">
                  {/* 2nd Place Card - Left Column - Centered on Silver Podium */}
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    custom={1}
                    variants={rowVariants}
                    whileHover="hover"
                    className="flex flex-col items-center justify-self-center"
                    style={{ 
                      marginBottom: '4px' // Same distance above podium as gold card
                    }}
                  >
                    <div 
                      className="w-52 sm:w-56 rounded-lg border p-2.5 mb-1 backdrop-blur-sm mt-4"
                      style={{
                        background: 'linear-gradient(135deg, rgba(173,173,173,0.9), rgba(173,173,173,0.8), rgba(173,173,173,0.7))',
                        borderColor: 'rgba(173,173,173,0.5)',
                        boxShadow: '0 0 15px rgba(173,173,173,0.4)'
                      }}
                      onMouseEnter={(e) => {
                        const tooltip = e.currentTarget.querySelector('.medal-tooltip');
                        if (tooltip) tooltip.classList.remove('opacity-0');
                      }}
                      onMouseLeave={(e) => {
                        const tooltip = e.currentTarget.querySelector('.medal-tooltip');
                        if (tooltip) tooltip.classList.add('opacity-0');
                      }}
                    >
                      <div className="w-8 h-8 mx-auto mb-1.5 flex items-center justify-center">
                        <motion.div
                          whileHover={{ scale: 1.15, rotate: 10 }}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm relative"
                          style={{
                            background: 'linear-gradient(135deg, #adadad, #9a9a9a)',
                            boxShadow: '0 0 10px rgba(173,173,173,0.6)'
                          }}
                        >
                          🥈
                          <div className="medal-tooltip pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 transition-opacity duration-300 z-30">
                            <div className="rounded-lg px-2 py-1 text-xs whitespace-nowrap shadow-lg" style={{ backgroundColor: 'rgba(173,173,173,0.95)', borderColor: 'rgba(173,173,173,0.5)', color: 'black' }}>
                              Runner-up
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      <div className="text-center space-y-1">
                        <Link 
                          to={`/teams/${podium[1].teamId}`}
                          className="text-xs font-bold hover:text-black transition-colors block text-black"
                        >
                          {podium[1].teamName}
                        </Link>
                        
                        <div className="rounded-lg p-2 backdrop-blur-sm" style={{ borderColor: 'rgba(173,173,173,0.3)', backgroundColor: 'rgba(173,173,173,0.8)' }}>
                          <div className="space-y-1">
                            {podium[1].players.map((player, idx) => {
                              const playerId = findPlayerIdByNickname(player);
                              const isCaptain = idx === 0;
                              
                              return (
                                <div key={idx} className={`group relative flex items-center justify-between p-1.5 rounded transition-all duration-300 ${
                                  isCaptain ? 'bg-slate-700/50' : 'hover:bg-slate-700/30'
                                }`}>
                                  <div className="flex-1">
                                    {playerId ? (
                                      <Link 
                                        to={`/players/${playerId}`}
                                        className="font-medium transition-all duration-300 hover:underline hover:scale-105 hover:shadow-lg rounded px-1 py-0.5 text-xs text-black hover:text-black"
                                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(173,173,173,0.4)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                                      >
                                        {player}
                                      </Link>
                                    ) : (
                                      <span className="font-medium text-xs text-black">
                                        {player}
                                      </span>
                                    )}
                                  </div>

                                  {isCaptain && (
                                    <div className="relative">
                                      <div 
                                        className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md border border-blue-400/50 cursor-pointer hover:scale-110 transition-transform duration-300"
                                        onMouseEnter={(e) => {
                                          e.stopPropagation();
                                          const tooltip = e.currentTarget.nextElementSibling;
                                          if (tooltip) tooltip.classList.remove('opacity-0');
                                        }}
                                        onMouseLeave={(e) => {
                                          e.stopPropagation();
                                          const tooltip = e.currentTarget.nextElementSibling;
                                          if (tooltip) tooltip.classList.add('opacity-0');
                                        }}
                                      >
                                        C
                                      </div>
                                      <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 transition-opacity duration-300 z-30">
                                        <div className="rounded px-2 py-1 text-xs whitespace-nowrap shadow-lg" style={{ backgroundColor: 'rgba(173,173,173,0.95)', borderColor: 'rgba(173,173,173,0.5)', color: 'black' }}>
                                          Captain
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* 1st Place Card - Center Column - Centered on Gold Podium */}
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    custom={0}
                    variants={rowVariants}
                    whileHover="hover"
                    className="flex flex-col items-center justify-self-center"
                    style={{ 
                      marginBottom: '4px' // Reduced margin because gold podium is tallest - same visual gap
                    }}
                  >
                    <div 
                      className="w-52 sm:w-56 rounded-lg border p-2.5 mb-1 backdrop-blur-sm mt-4"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,215,0,0.9), rgba(255,215,0,0.8), rgba(255,215,0,0.7))',
                        borderColor: 'rgba(255,215,0,0.7)',
                        boxShadow: '0 0 20px rgba(255,215,0,0.5)'
                      }}
                      onMouseEnter={(e) => {
                        const tooltip = e.currentTarget.querySelector('.medal-tooltip');
                        if (tooltip) tooltip.classList.remove('opacity-0');
                      }}
                      onMouseLeave={(e) => {
                        const tooltip = e.currentTarget.querySelector('.medal-tooltip');
                        if (tooltip) tooltip.classList.add('opacity-0');
                      }}
                    >
                      <div className="w-10 h-10 mx-auto mb-1.5 flex items-center justify-center">
                        <motion.div
                          whileHover={{ scale: 1.15, rotate: 10 }}
                          className="w-10 h-10 rounded-full flex items-center justify-center text-lg relative"
                          style={{
                            background: 'linear-gradient(135deg, #ffd700, #e6c200)',
                            boxShadow: '0 0 15px rgba(255,215,0,0.7)'
                          }}
                        >
                          🏆
                          <div className="medal-tooltip pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 transition-opacity duration-300 z-30">
                            <div className="rounded-lg px-2 py-1 text-xs whitespace-nowrap shadow-lg" style={{ backgroundColor: 'rgba(204,153,0,0.9)', borderColor: 'rgba(204,153,0,0.5)', color: 'black' }}>
                              Champion
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      <div className="text-center space-y-1">
                        <Link 
                          to={`/teams/${podium[0].teamId}`}
                          className="text-sm font-bold hover:text-black transition-colors block text-black"
                        >
                          {podium[0].teamName}
                        </Link>
                        
                        <div className="rounded-lg p-2 backdrop-blur-sm" style={{ borderColor: 'rgba(204,153,0,0.4)', backgroundColor: 'rgba(204,153,0,0.7)' }}>
                          <div className="space-y-1">
                            {podium[0].players.map((player, idx) => {
                              const playerId = findPlayerIdByNickname(player);
                              const isCaptain = idx === 0;
                              
                              return (
                                <div key={idx} className="group relative flex items-center justify-between p-1.5 rounded transition-all duration-300" style={{ backgroundColor: isCaptain ? 'rgba(204,153,0,0.4)' : 'transparent' }} onMouseEnter={(e) => { if (!isCaptain) e.currentTarget.style.backgroundColor = 'rgba(204,153,0,0.2)'; }} onMouseLeave={(e) => { if (!isCaptain) e.currentTarget.style.backgroundColor = 'transparent'; }}>
                                  <div className="flex-1">
                                    {playerId ? (
                                      <Link 
                                        to={`/players/${playerId}`}
                                        className="font-medium transition-all duration-300 hover:underline hover:scale-105 hover:shadow-lg rounded px-1 py-0.5 text-xs text-black hover:text-black"
                                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(204,153,0,0.3)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                                      >
                                        {player}
                                      </Link>
                                    ) : (
                                      <span className="font-medium text-xs text-black">
                                        {player}
                                      </span>
                                    )}
                                  </div>

                                  {isCaptain && (
                                    <div className="relative">
                                      <div 
                                        className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md border border-blue-400/50 cursor-pointer hover:scale-110 transition-transform duration-300"
                                        onMouseEnter={(e) => {
                                          e.stopPropagation();
                                          const tooltip = e.currentTarget.nextElementSibling;
                                          if (tooltip) tooltip.classList.remove('opacity-0');
                                        }}
                                        onMouseLeave={(e) => {
                                          e.stopPropagation();
                                          const tooltip = e.currentTarget.nextElementSibling;
                                          if (tooltip) tooltip.classList.add('opacity-0');
                                        }}
                                      >
                                        C
                                      </div>
                                      <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 transition-opacity duration-300 z-30">
                                        <div className="rounded px-2 py-1 text-xs whitespace-nowrap shadow-lg" style={{ backgroundColor: 'rgba(204,153,0,0.9)', borderColor: 'rgba(204,153,0,0.5)', color: 'black' }}>
                                          Captain
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* 3rd Place Card - Right Column - Centered on Bronze Podium */}
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    custom={2}
                    variants={rowVariants}
                    whileHover="hover"
                    className="flex flex-col items-center justify-self-center"
                    style={{ 
                      marginBottom: '4px' // Same distance as gold card
                    }}
                  >
                    <div 
                      className="w-52 sm:w-56 rounded-lg border p-2.5 mb-1 backdrop-blur-sm mt-4"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,119,92,0.9), rgba(255,119,92,0.8), rgba(255,119,92,0.7))',
                        borderColor: 'rgba(255,119,92,0.5)',
                        boxShadow: '0 0 15px rgba(255,119,92,0.4)'
                      }}
                      onMouseEnter={(e) => {
                        const tooltip = e.currentTarget.querySelector('.medal-tooltip');
                        if (tooltip) tooltip.classList.remove('opacity-0');
                      }}
                      onMouseLeave={(e) => {
                        const tooltip = e.currentTarget.querySelector('.medal-tooltip');
                        if (tooltip) tooltip.classList.add('opacity-0');
                      }}
                    >
                      <div className="w-7 h-7 mx-auto mb-1.5 flex items-center justify-center">
                        <motion.div
                          whileHover={{ scale: 1.15, rotate: 10 }}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-sm relative"
                          style={{
                            background: 'linear-gradient(135deg, #ff775c, #e6654a)',
                            boxShadow: '0 0 10px rgba(255,119,92,0.5)'
                          }}
                        >
                          🥉
                          <div className="medal-tooltip pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 transition-opacity duration-300 z-30">
                            <div className="rounded-lg px-2 py-1 text-xs whitespace-nowrap shadow-lg" style={{ backgroundColor: 'rgba(255,119,92,0.95)', borderColor: 'rgba(255,119,92,0.5)', color: 'black' }}>
                              Third Place
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      <div className="text-center space-y-1">
                        <Link 
                          to={`/teams/${podium[2].teamId}`}
                          className="text-xs font-bold hover:text-black transition-colors block text-black"
                        >
                          {podium[2].teamName}
                        </Link>
                        
                        <div className="rounded-lg p-2 backdrop-blur-sm" style={{ borderColor: 'rgba(255,119,92,0.3)', backgroundColor: 'rgba(255,119,92,0.8)' }}>
                          <div className="space-y-1">
                            {podium[2].players.map((player, idx) => {
                              const playerId = findPlayerIdByNickname(player);
                              const isCaptain = idx === 0;
                              
                              return (
                                <div key={idx} className={`group relative flex items-center justify-between p-1.5 rounded transition-all duration-300`} style={{ backgroundColor: isCaptain ? 'rgba(255,119,92,0.5)' : 'transparent' }} onMouseEnter={(e) => { if (!isCaptain) e.currentTarget.style.backgroundColor = 'rgba(255,119,92,0.3)'; }} onMouseLeave={(e) => { if (!isCaptain) e.currentTarget.style.backgroundColor = 'transparent'; }}>
                                  <div className="flex-1">
                                    {playerId ? (
                                      <Link 
                                        to={`/players/${playerId}`}
                                        className="font-medium transition-all duration-300 hover:underline hover:scale-105 hover:shadow-lg rounded px-1 py-0.5 text-xs text-black hover:text-black"
                                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,119,92,0.4)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                                      >
                                        {player}
                                      </Link>
                                    ) : (
                                      <span className="font-medium text-xs text-white">
                                        {player}
                                      </span>
                                    )}
                                  </div>

                                  {isCaptain && (
                                    <div className="relative">
                                      <div 
                                        className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md border border-blue-400/50 cursor-pointer hover:scale-110 transition-transform duration-300"
                                        onMouseEnter={(e) => {
                                          e.stopPropagation();
                                          const tooltip = e.currentTarget.nextElementSibling;
                                          if (tooltip) tooltip.classList.remove('opacity-0');
                                        }}
                                        onMouseLeave={(e) => {
                                          e.stopPropagation();
                                          const tooltip = e.currentTarget.nextElementSibling;
                                          if (tooltip) tooltip.classList.add('opacity-0');
                                        }}
                                      >
                                        C
                                      </div>
                                      <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 transition-opacity duration-300 z-30">
                                        <div className="rounded px-2 py-1 text-xs whitespace-nowrap shadow-lg" style={{ backgroundColor: 'rgba(255,119,92,0.95)', borderColor: 'rgba(255,119,92,0.5)', color: 'black' }}>
                                          Captain
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Extended Podium Steps - Clean Design */}
              <div className="flex items-end justify-center relative">
                {/* 2nd Place Podium */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="w-64 sm:w-68 h-8 sm:h-10 rounded-tl-lg border-2"
                  style={{
                    background: 'linear-gradient(to top, #6a6a6a, #7d7d7d, #909090)',
                    borderColor: 'rgba(173,173,173,0.5)',
                    boxShadow: '0 0 25px rgba(173,173,173,0.6)'
                  }}
                />

                {/* 1st Place Podium */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="w-68 sm:w-72 h-12 sm:h-14 rounded-t-lg border-2"
                  style={{
                    background: 'linear-gradient(to top, #cc9900, #e6b300, #ffcc00)',
                    borderColor: 'rgba(255,215,0,0.7)',
                    boxShadow: '0 0 35px rgba(255,215,0,0.8)'
                  }}
                />

                {/* 3rd Place Podium */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="w-60 sm:w-64 h-6 sm:h-8 rounded-tr-lg border-2"
                  style={{
                    background: 'linear-gradient(to top, #cc4d33, #e6553a, #ff5d41)',
                    borderColor: 'rgba(255,119,92,0.5)',
                    boxShadow: '0 0 20px rgba(255,119,92,0.6)'
                  }}
                />
              </div>

              {/* Enhanced Glowing Line Below Extended Podium */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="w-full max-w-6xl h-1.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_25px_rgba(251,191,36,0.9)] rounded-full mt-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------- Main Hall of Fame Component --------- */
export default function HallOfFame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);

  useEffect(() => window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }), []);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const width = el.clientWidth || 1;
    const idx = Math.round(el.scrollLeft / width);
    if (idx !== activeIndex) setActiveIndex(idx);
  };

  const scrollToIndex = (index: number) => {
    const el = containerRef.current;
    if (!el) return;
    const width = el.clientWidth;
    el.scrollTo({ left: width * index, behavior: 'smooth' });
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const target = e.target as HTMLElement | null;
    if (target && target.closest("a, button, input, textarea, select, label, [role='button'], [role='link'], [data-no-drag]")) return;
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartScrollRef.current = el.scrollLeft;
    try {
      el.setPointerCapture(e.pointerId);
    } catch (err) {
      void err;
    }
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const el = containerRef.current;
    if (!el) return;
    const dx = e.clientX - dragStartXRef.current;
    el.scrollLeft = dragStartScrollRef.current - dx;
  };

  const endDrag = (e?: PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    if (e && containerRef.current)
      try {
        containerRef.current.releasePointerCapture(e.pointerId);
      } catch (err) {
        void err;
      }
  };

  return (
    <>
      {/* Fixed Background with bg5.webp - Magenta Theme */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/bg5.webp)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-fuchsia-950/80 to-purple-950/90" />
        
        {/* Mystical glow effects - Magenta theme */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: '#ff00ff40', animationDuration: '8s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: '#ff00ff30', animationDuration: '10s', animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: '#ff00ff25', animationDuration: '12s', animationDelay: '4s' }} />
        </div>
      </div>

      <main className="hall-of-fame-page relative py-1">
        <div className="relative z-10 min-h-0">
          <div className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-6">
            {/* Header */}
            <motion.div 
              initial={{ opacity: 0, y: 6 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.7 }} 
              className="text-center mb-2 relative"
            >
              <h1 className="relative inline-block font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-200 via-pink-200 to-purple-200 text-lg sm:text-xl md:text-2xl">
                HALL OF FAME
              </h1>
              <span className="pointer-events-none absolute inset-0 text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight blur-lg opacity-20" style={{ color: '#ff00ff', transform: "translate(-1px, -1px)" }}>
                HALL OF FAME
              </span>
              <motion.div
                animate={{ x: [-40, 160], opacity: [0, 0.6, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="pointer-events-none absolute -top-4 -left-20 w-40 h-32 bg-gradient-to-r from-transparent to-transparent blur-2xl"
                style={{ background: 'linear-gradient(to right, transparent, #ff00ff70, transparent)' }}
              />
              <p className="mt-1 text-[0.5rem] sm:text-[8px] font-light tracking-[0.3em] sm:tracking-[0.35em] uppercase" style={{ color: '#ff00ff80' }}>
                Drag / Click to explore champions
              </p>
            </motion.div>

            {/* Timeline - Standings Style */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-xl px-2 mt-8" style={{ height: 52 }}>
                <div className="absolute left-4 sm:left-6 right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                  <div className="h-0.5 rounded-full shadow-[0_0_10px_rgba(255,0,255,0.5)]" style={{ background: 'linear-gradient(to right, #c026d3, #ff00ff, #c026d3)' }} />
                </div>

                <div className="relative z-30 flex justify-between items-center h-6 px-2" style={{ top: '60%', transform: 'translateY(-50%)' }}>
                  {seasonChampions.map((season, index) => {
                    const isActive = index === activeIndex;
                    return (
                      <button 
                        key={season.season} 
                        onClick={() => scrollToIndex(index)} 
                        className={`relative w-10 h-10 rounded-full border-2 transition-all duration-300 cursor-pointer ${
                          isActive 
                            ? 'bg-gradient-to-br from-fuchsia-400 to-purple-500 border-fuchsia-300 scale-110' 
                            : 'bg-gradient-to-br from-fuchsia-600 to-purple-700 border-fuchsia-400 hover:scale-105'
                        }`}
                        style={{
                          boxShadow: isActive 
                            ? '0 0 28px #ff00ff, 0 0 60px rgba(255,0,255,0.85)' 
                            : 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.boxShadow = '0 0 20px rgba(255,0,255,0.8)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.boxShadow = 'none';
                          }
                        }}
                        type="button" 
                        aria-label={`Go to season ${season.season}`}
                      >
                        <span className={`text-sm font-bold ${isActive ? 'text-purple-900' : 'text-fuchsia-100'}`}>
                          {season.season}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="absolute left-1/2 z-10 pointer-events-none hidden sm:block" style={{ top: '100%', transform: 'translate(-50%, 6px)' }}>
                  <div className="px-2 py-0.5 rounded-full border text-[0.5rem] uppercase tracking-wider" style={{ backgroundColor: '#ff00ff40', borderColor: '#ff00ff30', color: '#ff00ff' }}>
                    Drag / Click to explore champions
                  </div>
                </div>
              </div>
            </div>

            {/* Carousel */}
            <div
              ref={containerRef}
              onScroll={handleScroll}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endDrag}
              onPointerLeave={endDrag}
              className="hall-of-fame-carousel flex overflow-x-auto snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing select-none mt-4 sm:mt-6 items-start"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
              aria-label="Hall of Fame carousel"
            >
              {seasonChampions.map((seasonData, index) => (
                <section 
                  key={seasonData.season} 
                  className="snap-start snap-always shrink-0 w-full flex justify-center items-start px-1 pt-1" 
                  role="group" 
                  aria-roledescription="season"
                >
                  <motion.div 
                    initial={{ opacity: 0.98, scale: 0.998 }} 
                    animate={{ 
                      opacity: activeIndex === index ? 1 : 0.92, 
                      scale: activeIndex === index ? 1 : 0.997 
                    }} 
                    transition={{ duration: 0.28 }} 
                    className="w-full max-w-[900px] origin-top pt-1 pb-1"
                  >
                    <SeasonHallOfFameCard seasonData={seasonData} />
                  </motion.div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}