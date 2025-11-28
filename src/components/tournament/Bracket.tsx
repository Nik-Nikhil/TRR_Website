// src/components/tournament/Bracket.tsx
import { primaryTournament } from '../../data/mockTournaments';
import MatchCard from './MatchCard';

export default function Bracket() {
  const playoffs = primaryTournament.matches.filter(
    m => m.stage === 'playoffs' || m.stage === 'finals'
  );

  const byRound = playoffs.reduce<Record<string, typeof playoffs>>((acc, match) => {
    acc[match.round] = acc[match.round] || [];
    acc[match.round].push(match);
    return acc;
  }, {});

  const rounds = Object.entries(byRound);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
        <span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
          Playoff Bracket
        </span>
      </h2>

      <div className="w-full overflow-x-auto">
        <div className="flex gap-6 min-w-max">
          {rounds.map(([roundName, matches]) => (
            <div key={roundName} className="flex-1 min-w-[260px]">
              <h3 className="mb-3 text-sm uppercase tracking-wide text-gray-400">
                {roundName}
              </h3>
              <div className="flex flex-col gap-4">
                {matches.map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
