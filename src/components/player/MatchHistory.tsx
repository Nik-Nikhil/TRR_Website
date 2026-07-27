import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Clock, TrendingUp } from 'lucide-react';

interface Match {
  match_id: number;
  player_slot: number;
  radiant_win: boolean;
  duration: number;
  hero_id: number;
  kills: number;
  deaths: number;
  assists: number;
  start_time: number;
}

interface HeroInfo {
  name: string;
  img: string;
  icon: string;
}

interface Props {
  steamId: string;
  limit?: number;
}

function toAccountId(steamId64: string): number {
  return Number(BigInt(steamId64) - BigInt('76561197960265728'));
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function timeAgo(unixTs: number) {
  const diff = Date.now() / 1000 - unixTs;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function isWin(match: Match) {
  return match.player_slot < 128 ? match.radiant_win : !match.radiant_win;
}

export default function MatchHistory({ steamId, limit = 5 }: Props) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [heroes, setHeroes] = useState<Record<number, HeroInfo>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!steamId) return;
    const accountId = toAccountId(steamId);

    Promise.all([
      fetch(`https://api.opendota.com/api/players/${accountId}/matches?limit=${limit}&significant=0`)
        .then(r => r.json()),
      fetch('https://api.opendota.com/api/heroes')
        .then(r => r.json()),
    ]).then(([matchData, heroData]) => {
      if (!Array.isArray(matchData)) {
        setError('Profile may be private on OpenDota.');
        setLoading(false);
        return;
      }
      const heroMap: Record<number, HeroInfo> = {};
      if (Array.isArray(heroData)) {
        heroData.forEach((h: any) => {
          // Use Stratz CDN — reliable, no CORS issues
          const shortName = h.name.replace('npc_dota_hero_', '');
          heroMap[h.id] = {
            name: h.localized_name,
            img: `https://cdn.stratz.com/images/dota2/heroes/${shortName}_horz.png`,
            icon: `https://cdn.stratz.com/images/dota2/heroes/${shortName}_icon.png`,
          };
        });
      }
      setHeroes(heroMap);
      setMatches(matchData.slice(0, limit));
      setLoading(false);
    }).catch(() => {
      setError('Failed to load match history.');
      setLoading(false);
    });
  }, [steamId, limit]);

  if (!steamId) return null;

  if (loading) {
    return (
      <div className="space-y-2 p-1">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="h-12 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 text-center">
        <p className="text-white/25 text-xs">{error}</p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="text-white/25 text-xs">No recent matches found.</p>
      </div>
    );
  }

  const wins = matches.filter(isWin).length;
  const winPct = Math.round((wins / matches.length) * 100);

  return (
    <div className="space-y-2">
      {/* Win rate bar */}
      <div className="flex items-center gap-3 px-1 pb-1">
        <div className="flex items-center gap-1.5 text-xs flex-shrink-0">
          <TrendingUp className="w-3 h-3 text-white/30" />
          <span className="text-green-400 font-bold">{wins}W</span>
          <span className="text-white/20">/</span>
          <span className="text-red-400 font-bold">{matches.length - wins}L</span>
        </div>
        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div className="h-full rounded-full" style={{ width: `${winPct}%`, background: 'linear-gradient(90deg, #22c55e, #16a34a)' }} />
        </div>
        <span className="text-white/35 text-xs font-semibold flex-shrink-0">{winPct}%</span>
      </div>

      {/* Match rows */}
      {matches.map((match, i) => {
        const won = isWin(match);
        const hero = heroes[match.hero_id];
        const kda = match.deaths === 0 ? '∞' : ((match.kills + match.assists) / match.deaths).toFixed(1);

        return (
          <motion.a
            key={match.match_id}
            href={`https://www.dotabuff.com/matches/${match.match_id}`}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg group transition-all hover:brightness-110"
            style={{
              background: won ? 'rgba(34,197,94,0.07)' : 'rgba(239,68,68,0.07)',
              border: `1px solid ${won ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}`,
            }}
          >
            {/* W/L indicator */}
            <div className="w-0.5 h-7 rounded-full flex-shrink-0"
              style={{ background: won ? '#22c55e' : '#ef4444' }} />

            {/* Hero portrait */}
            <div className="w-9 h-6 rounded overflow-hidden flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              {hero?.img ? (
                <img src={hero.img} alt={hero.name}
                  className="w-full h-full object-cover object-top"
                  onError={e => {
                    const el = e.target as HTMLImageElement;
                    // Fallback chain: Stratz → OpenDota CDN
                    if (el.src.includes('stratz.com')) {
                      const shortName = hero.img.split('/').pop()?.replace('_horz.png', '') || '';
                      el.src = `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${shortName}.png`;
                    } else {
                      el.style.display = 'none';
                    }
                  }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[8px] text-white/20">?</div>
              )}
            </div>

            {/* Hero name + time */}
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-semibold truncate leading-tight">
                {hero?.name || `Hero #${match.hero_id}`}
              </div>
              <div className="text-white/25 text-[10px] leading-tight">{timeAgo(match.start_time)}</div>
            </div>

            {/* KDA */}
            <div className="text-center flex-shrink-0">
              <div className="text-xs font-bold leading-tight">
                <span className="text-green-400">{match.kills}</span>
                <span className="text-white/20 mx-0.5">/</span>
                <span className="text-red-400">{match.deaths}</span>
                <span className="text-white/20 mx-0.5">/</span>
                <span className="text-blue-400">{match.assists}</span>
              </div>
              <div className="text-white/25 text-[10px] leading-tight">{kda} KDA</div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-1 text-white/25 text-[10px] flex-shrink-0 hidden sm:flex">
              <Clock className="w-2.5 h-2.5" />
              {formatDuration(match.duration)}
            </div>

            <ExternalLink className="w-3 h-3 text-white/15 group-hover:text-white/40 transition-colors flex-shrink-0" />
          </motion.a>
        );
      })}

      <p className="text-center text-white/15 text-[10px] pt-1">
        OpenDota · click to view on Dotabuff
      </p>
    </div>
  );
}
