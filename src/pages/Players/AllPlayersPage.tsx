// src/pages/AllPlayersPage.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RotatingPlayerCard from "./RotatingPlayerCard";
import { players, type Player } from "../data/players";

const SNAP_CYCLE = 10000; // 10 seconds

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
  // ⬇️ random order on first load
  const [playerOrder, setPlayerOrder] = useState<Player[]>(() => shuffleArray(players));
  const [query, setQuery] = useState("");

  const searching = query.trim() !== "";

  // 🔄 shift cards left every 10 seconds unless searching
  useEffect(() => {
    if (searching) return;

    const interval = setInterval(() => {
      setPlayerOrder((prev) => {
        if (prev.length === 0) return prev;
        return [...prev.slice(1), prev[0]]; // move 1st to the end
      });
    }, SNAP_CYCLE);

    return () => clearInterval(interval);
  }, [searching]);

  // 🔍 filter while searching (freezes shifting)
  const displayedPlayers = searching
    ? playerOrder.filter((p) =>
        p.nickname.toLowerCase().includes(query.toLowerCase())
      )
    : playerOrder;

  return (
    <main className="w-full flex justify-center pt-24 pb-16 bg-[#050608]">
      <div className="w-full max-w-[1120px] px-6">
        <h1 className="text-xl font-semibold tracking-[0.18em] uppercase text-slate-200 mb-6 text-center">
          Players
        </h1>

        {/* 🔍 Search bar */}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search player..."
          className="w-full max-w-[480px] mx-auto block mb-8 px-5 py-3.5 rounded-2xl
            bg-black/40 border border-slate-600/60 text-slate-200 text-sm
            focus:outline-none focus:ring-2 focus:ring-cyan-400/60 transition"
        />

        {/* 🔁 Grid */}
        <motion.div
          layout
          className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center"
        >
          <AnimatePresence>
            {displayedPlayers.map((player, index) => (
              <motion.div
                key={player.id}
                layout
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <RotatingPlayerCard player={player} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}
