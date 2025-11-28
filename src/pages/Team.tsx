// src/pages/Teams.tsx
import { Link } from "react-router-dom";
import { teams } from "./data/teams";

export default function Teams() {
  // sort by wins desc, then losses asc
  const ordered = [...teams].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return a.losses - b.losses;
  });

  return (
    <div className="teams-page">
      <header className="teams-header">
        <div>
          <p className="bracket-kicker">Roshan Rumble • Teams</p>
          <h1>Playoff Standings</h1>
          <p className="bracket-subtitle">
            Final line-ups and current records. Click a team to open their
            roster, Dotabuff links, and playoff path.
          </p>
        </div>
      </header>

      <section className="teams-section">
        <div className="teams-table-wrapper">
          <table className="teams-table">
            <thead>
              <tr>
                <th className="col-rank">#</th>
                <th className="col-team">Team</th>
                <th className="col-record">Wins</th>
                <th className="col-record">Losses</th>
                <th className="col-mmr">Avg MMR</th>
              </tr>
            </thead>
            <tbody>
              {ordered.map((team, idx) => (
                <tr key={team.id}>
                  <td className="cell-rank">{idx + 1}</td>
                  <td className="cell-team">
                    <Link to={`/teams/${team.id}`} className="team-link">
                      <span
                        className="team-logo-pill"
                        style={{ borderColor: team.logoColor }}
                      >
                        <span
                          className="team-logo-dot"
                          style={{ backgroundColor: team.logoColor }}
                        />
                        {team.shortName}
                      </span>
                      <span className="team-name-text">{team.name}</span>
                    </Link>
                  </td>
                  <td className="cell-record">{team.wins}</td>
                  <td className="cell-record">{team.losses}</td>
                  <td className="cell-mmr">{team.averageMMR}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
