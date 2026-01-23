// src/pages/Players/RotatingPlayerCard.tsx
import { motion } from "framer-motion";
import PlayerSummaryCard from "./PlayerSummaryCard";
import type { Player } from "../../data/players";

interface RotatingPlayerCardProps {
  player: Player;
  index: number;
}

export default function RotatingPlayerCard({ player, index }: RotatingPlayerCardProps) {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
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
