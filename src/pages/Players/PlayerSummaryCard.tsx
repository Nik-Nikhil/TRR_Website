// src/components/PlayerSummaryCard.tsx
import { useState } from "react";
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

function getInitials(name: string): string {
  if (!name) return '??';
  const words = name.trim().split(' ');
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function getColorFromName(name: string): string {
  const colors = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-pink-500 to-pink-600',
    'from-red-500 to-red-600',
    'from-orange-500 to-orange-600',
    'from-yellow-500 to-yellow-600',
    'from-green-500 to-green-600',
    'from-teal-500 to-teal-600',
    'from-cyan-500 to-cyan-600',
    'from-indigo-500 to-indigo-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function PlayerSummaryCard({
  id,
  nickname,
  avatarUrl,
}: PlayerSummaryCardProps) {
  const [imageError, setImageError] = useState(false);
  const showFallback = !avatarUrl || imageError;

  return (
    <Link to={`/players/${id}`} className="group block w-full">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600 hover:bg-slate-700/40 transition-all duration-300"
      >
        {/* Avatar */}
        <div className="relative mb-3">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-600 group-hover:border-slate-500 transition-colors">
            {showFallback ? (
              <div className={`w-full h-full bg-gradient-to-br ${getColorFromName(nickname)} flex items-center justify-center`}>
                <span className="font-bold text-white text-lg">{getInitials(nickname)}</span>
              </div>
            ) : (
              <img
                src={avatarUrl}
                alt={nickname}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
                onError={() => setImageError(true)}
              />
            )}
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
