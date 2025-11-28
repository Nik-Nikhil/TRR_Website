// src/components/tournament/MatchCard.tsx
import { CalendarClock, MonitorPlay } from 'lucide-react';
import { format } from 'date-fns';
import type { Match } from '../../types';

type Props = {
  match: Match;
};

export default function MatchCard({ match }: Props) {
  const date = new Date(match.scheduledAt);

  return (
    <div className="glass-panel p-4 md:p-5 flex flex-col gap-3 border border-purple-500/40 bg-[#050716]/80">
      <div className="flex items-center justify-between text-xs uppercase tracking-wide text-purple-300">
        <span>{match.round}</span>
        <span className="text-emerald-300">Bo{match.bestOf}</span>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 flex items-center justify-between gap-2">
            <span className="text-sm text-gray-300">{match.teamA.name}</span>
            <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-200">
              {match.teamA.shortName}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center text-xs text-gray-500 uppercase tracking-[0.25em]">
          vs
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 flex items-center justify-between gap-2">
            <span className="text-sm text-gray-300">{match.teamB.name}</span>
            <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-200">
              {match.teamB.shortName}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-purple-500/30">
        <div className="flex items-center gap-2">
          <CalendarClock className="w-4 h-4 text-emerald-400" />
          <span>{format(date, 'MMM d • HH:mm')}</span>
        </div>
        {match.streamUrl && (
          <a
            href={match.streamUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-200"
          >
            <MonitorPlay className="w-4 h-4" />
            <span>Watch</span>
          </a>
        )}
      </div>
    </div>
  );
}
