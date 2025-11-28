// src/pages/Players/RotatingPlayerCard.tsx
import { motion } from "framer-motion";
import PlayerSummaryCard from "./PlayerSummaryCard";
import type { Player } from "../data/players";

interface RotatingPlayerCardProps {
  player: Player;
  index: number; // 0..15 inside the current 4x4 window
}

export default function RotatingPlayerCard({ player, index }: RotatingPlayerCardProps) {
  return (
    <motion.div
      className="relative rounded-4xl cursor-pointer overflow-hidden border border-white/5 bg-slate-950/70"
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{
        type: "spring",
        stiffness: 170,
        damping: 22,
        // slight column-based delay so movement looks like a wave
        delay: (index % 4) * 0.03,
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        boxShadow: "0 26px 60px rgba(0,0,0,0.9)",
      }}
    >
      <PlayerSummaryCard
        id={player.id}
        nickname={player.nickname}
        avatarUrl={player.avatarUrl}
        seasonBadges={player.seasonBadges}
        hasWonCup={player.hasWonCup}
        cupRank={player.cupRank}
        cupTooltip={player.cupTooltip}
        roles={player.roles}
      />
    </motion.div>
  );
}
