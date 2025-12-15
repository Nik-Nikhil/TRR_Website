// pages/Playoff.jsx
import { useParams } from "react-router-dom";
import BracketDotaStyle from "./BracketDotaStyle";

export default function Playoff() {
  const { season } = useParams();
  const seasonNumber = season !== undefined ? Number(season) : undefined;
  return (
    <main className="p-6">
      <h1 className="text-xl mb-4">Playoff — Season {seasonNumber}</h1>
      <BracketDotaStyle season={seasonNumber} />
    </main>
  );
}
