// src/pages/Tournament.tsx
import Bracket from '../components/tournament/Bracket';
import { primaryTournament } from '../data/mockTournaments';

export default function Tournament() {
  return (
    <div className="pt-6">
      <header className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-2">
          <span className="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
            {primaryTournament.name} Bracket
          </span>
        </h1>
        <p className="text-gray-300 max-w-2xl">
          Follow the journey from the opening skirmishes to the Grand Final. Upper
          brackets, lower brackets, clutch buybacks – every game matters.
        </p>
      </header>

      <Bracket />
    </div>
  );
}
