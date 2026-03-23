import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search } from 'lucide-react';
import { players } from '../../data/players';

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

function PlayerAvatar({ avatarUrl, nickname }: { avatarUrl: string; nickname: string }) {
  const [error, setError] = useState(false);
  if (!avatarUrl || error) {
    return (
      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getColorFromName(nickname)} flex items-center justify-center border-2 border-blue-500 mx-auto mb-2`}>
        <span className="font-bold text-white text-sm">{getInitials(nickname)}</span>
      </div>
    );
  }
  return (
    <img
      src={avatarUrl}
      alt={nickname}
      className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 mx-auto mb-2"
      onError={() => setError(true)}
    />
  );
}

export function PlayerManagement() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = players.filter(p =>
    p.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.realName && p.realName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-blue-500/40">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search players..."
            className="w-full pl-10 pr-4 py-3 bg-black/60 border border-blue-500/40 rounded-lg text-blue-200 placeholder-blue-400/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Player Grid */}
      <div className="bg-black/60 backdrop-blur-sm rounded-xl border border-blue-500/40">
        <div className="p-6 border-b border-blue-500/20">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-400" />
            Players ({filtered.length})
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto">
            {filtered.map((player) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-lg p-4 border bg-black/40 border-blue-500/20 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="text-center mb-3">
                  <PlayerAvatar avatarUrl={player.avatarUrl} nickname={player.nickname} />
                  <h4 className="text-white font-bold text-sm truncate">{player.nickname}</h4>
                  {player.realName && (
                    <p className="text-blue-300/70 text-xs truncate">{player.realName}</p>
                  )}
                  <p className="text-blue-400/60 text-xs">{player.currentMedalLabel}</p>
                </div>
                <div className="text-center">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-600 text-white">ACTIVE</span>
                </div>
              </motion.div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No players found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
