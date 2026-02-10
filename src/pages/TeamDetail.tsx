import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Users } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import captainService from '../services/captainService';
import { supabase } from '../lib/supabase';
import { players } from '../data/players';

export default function TeamDetail() {
  const { teamName } = useParams<{ teamName: string }>();
  const navigate = useNavigate();
  const [captain, setCaptain] = useState<any>(null);
  const [teamPlayers, setTeamPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeamData();
  }, [teamName]);

  const loadTeamData = async () => {
    if (!teamName) return;

    setLoading(true);

    // Get captain info
    const captains = await captainService.getCaptains();
    const teamCaptain = captains.find(c => c.teamName === decodeURIComponent(teamName));
    
    if (teamCaptain) {
      setCaptain(teamCaptain);

      // Get sold players for this team
      const { data: soldPlayers } = await supabase
        .from('auction_results')
        .select('*')
        .eq('sold_to_team_name', teamCaptain.teamName)
        .order('sold_at', { ascending: false });

      if (soldPlayers) {
        const playersWithData = soldPlayers.map((sp: any) => ({
          ...sp.player_data,
          soldFor: sp.final_price,
          soldAt: sp.sold_at
        }));
        setTeamPlayers(playersWithData);
      }
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading team...</div>
      </div>
    );
  }

  if (!captain) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Team not found</div>
      </div>
    );
  }

  const captainPlayer = players.find(p => p.id === captain.playerId);
  const totalSpent = teamPlayers.reduce((sum, p) => sum + (p.soldFor || 0), 0);
  const remainingBudget = captain.budget;
  const totalBudget = remainingBudget + totalSpent;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/auction')}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 text-white rounded-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Auction
        </button>

        {/* Team Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-500/40 rounded-2xl p-8 mb-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{captain.teamName}</h1>
                <div className="flex items-center gap-2">
                  <Avatar
                    src={captainPlayer?.avatarUrl}
                    alt={captain.playerNickname}
                    name={captain.playerNickname}
                    size="sm"
                    className="border-2 border-purple-400"
                  />
                  <div>
                    <p className="text-purple-300 text-sm">Captain</p>
                    <p className="text-white font-semibold">{captain.playerNickname}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Stats */}
            <div className="flex gap-4">
              <div className="bg-black/40 rounded-xl p-4 border border-green-500/40 min-w-[140px]">
                <p className="text-green-400 text-xs mb-1">Remaining Budget</p>
                <p className="text-2xl font-bold text-green-300">🪙 {remainingBudget}</p>
              </div>
              <div className="bg-black/40 rounded-xl p-4 border border-yellow-500/40 min-w-[140px]">
                <p className="text-yellow-400 text-xs mb-1">Total Spent</p>
                <p className="text-2xl font-bold text-yellow-300">🪙 {totalSpent}</p>
              </div>
              <div className="bg-black/40 rounded-xl p-4 border border-blue-500/40 min-w-[140px]">
                <p className="text-blue-400 text-xs mb-1">Total Budget</p>
                <p className="text-2xl font-bold text-blue-300">🪙 {totalBudget}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Team Roster */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 backdrop-blur-xl border border-blue-500/40 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Team Roster</h2>
            <span className="text-blue-300 text-sm">({teamPlayers.length + 1}/5 players)</span>
          </div>

          {teamPlayers.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No players acquired yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Captain Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-2 border-purple-500/60 rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar
                    src={captainPlayer?.avatarUrl}
                    alt={captain.playerNickname}
                    name={captain.playerNickname}
                    size="md"
                    className="border-2 border-purple-400"
                  />
                  <div className="flex-1">
                    <p className="text-white font-bold">{captain.playerNickname}</p>
                    <p className="text-purple-300 text-sm">Captain</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">MMR:</span>
                  <span className="text-white font-semibold">{captainPlayer?.currentMMR || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-400">Cost:</span>
                  <span className="text-purple-400 font-bold">Captain</span>
                </div>
              </motion.div>

              {/* Team Players */}
              {teamPlayers.map((player, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * (idx + 1) }}
                  className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/40 rounded-xl p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar
                      src={player.avatarUrl}
                      alt={player.nickname}
                      name={player.nickname}
                      size="md"
                      className="border-2 border-blue-400"
                    />
                    <div className="flex-1">
                      <p className="text-white font-bold">{player.nickname}</p>
                      <p className="text-blue-300 text-sm">Player</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">MMR:</span>
                    <span className="text-white font-semibold">{player.currentMMR || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-400">Cost:</span>
                    <span className="text-green-400 font-bold">🪙 {player.soldFor}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
