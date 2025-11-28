// src/pages/AllPlayersPage.tsx
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RotatingPlayerCard from "./RotatingPlayerCard";
import { players, type Player } from "../data/players";

// 4 cards per row -> 8 cards = 2 rows

const WINDOW_SIZE = 8; // show exactly 2 rows (8 cards)
const SNAP_CYCLE = 4; // seconds between rotations

export default function AllPlayersPage() {
  const [startIndex, setStartIndex] = useState(0);
  const [query, setQuery] = useState("");

  // 8-player circular window
  const visiblePlayers: Player[] = useMemo(() => {
    if (players.length === 0) return [];
    const list: Player[] = [];
    for (let i = 0; i < WINDOW_SIZE && i < players.length; i++) {
      const idx = (startIndex + i) % players.length;
      list.push(players[idx]);
    }
    return list;
  }, [startIndex]);

  // Filter by nickname if searching, otherwise use rotating window
  const filteredPlayers = query.trim()
    ? players.filter((p) =>
        p.nickname.toLowerCase().includes(query.toLowerCase())
      )
    : visiblePlayers;

  // Auto rotation (pause while searching)
  useEffect(() => {
    if (query.trim() !== "" || players.length === 0) return;

    const timeout = setTimeout(() => {
      setStartIndex((prev) => (prev + WINDOW_SIZE) % players.length);
    }, SNAP_CYCLE * 1000);

    return () => clearTimeout(timeout);
  }, [query, startIndex]);

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
          className="w-full max-w-[420px] mx-auto block mb-8 px-4 py-3 rounded-2xl
                     bg-black/40 border border-slate-600/60 text-slate-200 text-sm
                     focus:outline-none focus:ring-2 focus:ring-cyan-400/60 transition"
        />

        {/* 🔁 Grid + Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={query.trim() ? "search" : startIndex} // whole grid re-animates when row changes
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center"
          >
            {filteredPlayers.length > 0 ? (
              filteredPlayers.map((player, index) => (
                <RotatingPlayerCard
                  key={player.id}
                  player={player}
                  index={index}
                />
              ))
            ) : (
              <motion.p
                className="text-slate-400 text-sm col-span-full mt-10 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ❌ No players found.
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
