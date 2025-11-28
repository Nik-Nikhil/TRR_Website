// src/components/tournament/Schedule.tsx
import { primaryTournament } from '../../pages/data/mockTournaments'
import MatchCard from './MatchCard';

export default function TournamentSchedule() {
  const sorted = [...primaryTournament.matches].sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  );

  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
        <span className="bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">
          Full Schedule
        </span>
      </h2>

      <div className="space-y-4">
        {sorted.map(match => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </section>
  );
}
