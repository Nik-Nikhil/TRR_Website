// src/pages/AllPlayersPage.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RotatingPlayerCard from "./RotatingPlayerCard";
import { players, type Player } from "../../data/players";

const CARDS_PER_PAGE = 36; // Show 36 cards per page (6x6 grid on large screens)

// Role filter options
const ROLE_FILTERS = [
  { label: "All Roles", value: "all" },
  { label: "Carry", value: "Carry", icon: "/icons/pos_1.png" },
  { label: "Mid", value: "Mid", icon: "/icons/pos_2.png" },
  { label: "Offlaner", value: "Offlaner", icon: "/icons/pos_3.png" },
  { label: "Soft Support", value: "Soft Support", icon: "/icons/pos_4.png" },
  { label: "Hard Support", value: "Hard Support", icon: "/icons/pos_5.png" },
];

// 🔀 Fisher-Yates shuffle for fair randomness
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function AllPlayersPage() {
  const [playerOrder] = useState<Player[]>(() => shuffleArray(players));
  const [query, setQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const searching = query.trim() !== "";

  // 🔍 filter by search and role
  const filteredPlayers = playerOrder.filter((p) => {
    const matchesSearch = searching
      ? p.nickname.toLowerCase().includes(query.toLowerCase())
      : true;
    
    const matchesRole = selectedRole === "all"
      ? true
      : p.roles.some(role => role.label === selectedRole);
    
    return matchesSearch && matchesRole;
  });

  // Reset to page 1 when search or role changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedRole]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPlayers.length / CARDS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const endIndex = startIndex + CARDS_PER_PAGE;
  const displayedPlayers = filteredPlayers.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPrevPage = () => {
    if (currentPage > 1) goToPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) goToPage(currentPage + 1);
  };

  // Generate page numbers to show (max 7 buttons)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <>
      {/* Fixed Background */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/bg5.jpg)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-slate-900/95 to-purple-950/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
        
        {/* Subtle glow effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-indigo-500/40 animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl bg-purple-500/30 animate-pulse" style={{ animationDuration: '10s', animationDelay: '3s' }} />
        </div>
      </div>

      <main className="relative z-10 w-full flex justify-center pt-20 sm:pt-24 pb-12 sm:pb-16 px-3 sm:px-4 md:px-6">
        <div className="w-full max-w-[1600px]">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6 sm:mb-8"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase mb-2 bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(139,92,246,0.4)]"
            >
              Players
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-zinc-400"
            >
              {players.length} registered players
            </motion.p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4 sm:mb-6"
          >
            <div className="relative max-w-md mx-auto">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search players..."
                className="w-full px-4 py-2.5 rounded-lg
                  bg-black/30 backdrop-blur-sm border border-indigo-500/20 text-zinc-100 text-sm
                  placeholder:text-zinc-500
                  focus:outline-none focus:ring-1 focus:ring-indigo-400/40 focus:border-indigo-400/40
                  transition-all duration-200"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-indigo-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Role Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex flex-wrap items-center justify-center gap-2">
              {ROLE_FILTERS.map((role) => (
                <motion.button
                  key={role.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedRole(role.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    selectedRole === role.value
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/50'
                      : 'bg-black/30 backdrop-blur-sm border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/10 hover:border-indigo-400/30'
                  }`}
                >
                  {role.icon && (
                    <img src={role.icon} alt={role.label} className="w-4 h-4 object-contain" />
                  )}
                  <span>{role.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Results info */}
          {(searching || selectedRole !== "all" || totalPages > 1) && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-xs text-zinc-500 mb-4"
            >
              {(searching || selectedRole !== "all") && `${filteredPlayers.length} ${filteredPlayers.length === 1 ? 'result' : 'results'} • `}
              {totalPages > 1 && `Page ${currentPage} of ${totalPages} • `}
              Showing {startIndex + 1}-{Math.min(endIndex, filteredPlayers.length)} of {filteredPlayers.length}
            </motion.p>
          )}

          {/* Grid - More columns for smaller cards */}
          <motion.div
            layout
            className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 mb-8"
          >
            <AnimatePresence mode="popLayout">
              {displayedPlayers.map((player, index) => (
                <motion.div
                  key={`${player.id}-${currentPage}`}
                  initial={{ 
                    opacity: 0, 
                    y: 40,
                    scale: 0.95,
                  }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: 1,
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: -20,
                    scale: 0.95,
                  }}
                  transition={{ 
                    duration: 0.4,
                    delay: index * 0.025,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="w-full"
                >
                  <RotatingPlayerCard player={player} index={index} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty state */}
          {searching && displayedPlayers.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-5xl mb-3 opacity-20">🔍</div>
              <p className="text-lg text-zinc-400 mb-1">No players found</p>
              <p className="text-sm text-zinc-600">Try a different search term or role filter</p>
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && displayedPlayers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-1.5 flex-wrap"
            >
              {/* Previous */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-all ${
                  currentPage === 1
                    ? 'bg-black/20 text-zinc-700 cursor-not-allowed'
                    : 'bg-black/30 backdrop-blur-sm border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/10 hover:border-indigo-400/30'
                }`}
              >
                ← Prev
              </motion.button>

              {/* Page numbers */}
              {getPageNumbers().map((page, idx) => {
                if (page === '...') {
                  return (
                    <span key={`ellipsis-${idx}`} className="px-1 text-zinc-600 text-xs">
                      ...
                    </span>
                  );
                }

                const pageNum = page as number;
                const isActive = pageNum === currentPage;

                return (
                  <motion.button
                    key={pageNum}
                    whileHover={{ scale: isActive ? 1 : 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => goToPage(pageNum)}
                    className={`w-8 h-8 rounded-md font-bold text-xs transition-all ${
                      isActive
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                        : 'bg-black/30 backdrop-blur-sm border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/10 hover:border-indigo-400/30'
                    }`}
                  >
                    {pageNum}
                  </motion.button>
                );
              })}

              {/* Next */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-all ${
                  currentPage === totalPages
                    ? 'bg-black/20 text-zinc-700 cursor-not-allowed'
                    : 'bg-black/30 backdrop-blur-sm border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/10 hover:border-indigo-400/30'
                }`}
              >
                Next →
              </motion.button>
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}
