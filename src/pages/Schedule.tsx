// src/pages/Schedule.tsx
import TournamentSchedule from '../components/tournament/Schedule';
import { primaryTournament } from './data/mockTournaments';

export default function SchedulePage() {
  return (
    <div className="pt-6">
      <header className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-2">
          <span className="bg-linear-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">
            Match Schedule
          </span>
        </h1>
        <p className="text-gray-300 max-w-xl">
          All series for {primaryTournament.name}. Times shown in your local timezone.
        </p>
      </header>

      <TournamentSchedule />
    </div>
  );
}
