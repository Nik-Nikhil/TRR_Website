// src/components/PlayerSummaryCard.tsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface PlayerSummaryCardProps {
  id: string;
  nickname: string;
  avatarUrl: string;
  seasonBadges: string[] | number[];
  hasWonCup: boolean;
  cupSeason?: number;
  cupRank?: "gold" | "silver" | "bronze";
  cupTooltip?: string;
  roles: any[];
}

export default function PlayerSummaryCard({
  id,
  nickname,
  avatarUrl,
}: PlayerSummaryCardProps) {
  return (
    <Link
      to={`/players/${id}`}
      className="group block w-full"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600 hover:bg-slate-700/40 transition-all duration-300"
      >
        {/* Avatar */}
        <div className="relative mb-3">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-600 group-hover:border-slate-500 transition-colors">
            <img
              src={avatarUrl}
              alt={nickname}
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        </div>

        {/* Name */}
        <div className="w-full">
          <h3 className="text-sm font-semibold text-white group-hover:text-slate-200 transition-colors truncate">
            {nickname}
          </h3>
        </div>
      </motion.div>
    </Link>
  );
}
