// src/pages/Tournament.tsx
import { useState } from "react";

type TeamSide = {
  name: string;
  short: string;
  score: number;
};

type Match = {
  id: string;
  bo: string; // "Bo3", "Bo5" etc
  roundLabel: string; // "UB Quarterfinal", "LB Round 1"
  bracket: "UB" | "LB" | "GF";
  team1: TeamSide;
  team2: TeamSide;
  date: string;
};

type RoundColumn = {
  id: string;
  title: string; // "UB Quarterfinal", "UB Semifinal" etc.
  bracket: "UB" | "LB" | "GF";
  matches: Match[];
};

type SeasonBracket = {
  season: number;
  title: string;
  description: string;
  rounds: RoundColumn[];
};

const bracketsBySeason: SeasonBracket[] = [
  {
    season: 1,
    title: "Season 1 Playoff Bracket",
    description:
      "The first Roshan Rumble. Early rivalries, bold drafts, and the first squad to lift our Aegis.",
    rounds: [
      {
        id: "s1-ub-qf",
        title: "UB Quarterfinal",
        bracket: "UB",
        matches: [
          {
            id: "s1-ub-qf-1",
            bo: "Bo3",
            roundLabel: "UB Quarterfinal",
            bracket: "UB",
            team1: { name: "Ancient Guardians", short: "AG", score: 2 },
            team2: { name: "Divine Echoes", short: "DE", score: 0 },
            date: "Jun 12 • 14:00",
          },
          {
            id: "s1-ub-qf-2",
            bo: "Bo3",
            roundLabel: "UB Quarterfinal",
            bracket: "UB",
            team1: { name: "Shadow Roshan", short: "SR", score: 2 },
            team2: { name: "Cave Raiders", short: "CR", score: 1 },
            date: "Jun 12 • 17:00",
          },
        ],
      },
      {
        id: "s1-ub-sf",
        title: "UB Semifinal",
        bracket: "UB",
        matches: [
          {
            id: "s1-ub-sf-1",
            bo: "Bo3",
            roundLabel: "UB Semifinal",
            bracket: "UB",
            team1: { name: "Ancient Guardians", short: "AG", score: 1 },
            team2: { name: "Shadow Roshan", short: "SR", score: 2 },
            date: "Jun 13 • 18:30",
          },
        ],
      },
      {
        id: "s1-lb-r1",
        title: "LB Round 1",
        bracket: "LB",
        matches: [
          {
            id: "s1-lb-r1-1",
            bo: "Bo3",
            roundLabel: "LB Round 1",
            bracket: "LB",
            team1: { name: "Divine Echoes", short: "DE", score: 2 },
            team2: { name: "Cave Raiders", short: "CR", score: 1 },
            date: "Jun 14 • 14:00",
          },
        ],
      },
      {
        id: "s1-lb-final",
        title: "LB Final",
        bracket: "LB",
        matches: [
          {
            id: "s1-lb-final-1",
            bo: "Bo3",
            roundLabel: "LB Final",
            bracket: "LB",
            team1: { name: "Ancient Guardians", short: "AG", score: 1 },
            team2: { name: "Divine Echoes", short: "DE", score: 2 },
            date: "Jun 15 • 15:00",
          },
        ],
      },
      {
        id: "s1-gf",
        title: "Grand Final",
        bracket: "GF",
        matches: [
          {
            id: "s1-gf-1",
            bo: "Bo5",
            roundLabel: "Grand Final",
            bracket: "GF",
            team1: { name: "Shadow Roshan", short: "SR", score: 3 },
            team2: { name: "Divine Echoes", short: "DE", score: 1 },
            date: "Jun 16 • 19:30",
          },
        ],
      },
    ],
  },
  {
    season: 2,
    title: "Season 2 Playoff Bracket",
    description:
      "New challengers, old kings. Season 2 raises the stakes with rematches and revenge arcs.",
    rounds: [],
  },
  {
    season: 3,
    title: "Season 3 Playoff Bracket",
    description: "Season 3 introduced international invites and meta shifts.",
    rounds: [],
  },
  {
    season: 4,
    title: "Season 4 Playoff Bracket",
    description: "Peak chaos. Comeback stories and base races everywhere.",
    rounds: [],
  },
  {
    season: 5,
    title: "Season 5 Playoff Bracket",
    description: "The current season. Who walks away with the Aegis?",
    rounds: [],
  },
];

const seasons = [1, 2, 3, 4, 5];
type BracketFilter = "ALL" | "UB" | "LB" | "GF";

function getSeasonBracket(season: number): SeasonBracket {
  const found = bracketsBySeason.find((b) => b.season === season);
  return found || bracketsBySeason[0];
}

export default function Tournament() {
  const [activeSeason, setActiveSeason] = useState<number>(1);
  const [bracketFilter, setBracketFilter] = useState<BracketFilter>("ALL");

  const bracket = getSeasonBracket(activeSeason);

  const visibleRounds =
    bracketFilter === "ALL"
      ? bracket.rounds
      : bracket.rounds.filter((r) => r.bracket === bracketFilter);

  return (
    <div className="bracket-page">
      {/* Header: title + filters on the right */}
      <header className="bracket-header-layout">
        <div className="bracket-header-left">
          <p className="bracket-kicker">
            The Roshan Rumble • Season {bracket.season}
          </p>
          <h1 className="bracket-title">Playoff Bracket</h1>
          <p className="bracket-subtitle">{bracket.description}</p>

          {/* Season pills under title for mobile if you want */}
          <div className="bracket-season-toggle bracket-season-toggle-mobile">
            <span className="bracket-season-label">Season:</span>
            {seasons.map((s) => (
              <button
                key={s}
                type="button"
                className={
                  "bracket-season-btn" +
                  (s === activeSeason ? " bracket-season-btn-active" : "")
                }
                onClick={() => setActiveSeason(s)}
              >
                S{s}
              </button>
            ))}
          </div>
        </div>

        <div className="bracket-header-right">
          {/* Bracket filter (top-right) */}
          <div className="bracket-filter-toggle">
            <span className="bracket-filter-label">Show bracket:</span>
            <div className="bracket-filter-group">
              {(["ALL", "UB", "LB", "GF"] as BracketFilter[]).map((b) => (
                <button
                  key={b}
                  type="button"
                  className={
                    "bracket-filter-btn" +
                    (bracketFilter === b ? " bracket-filter-btn-active" : "")
                  }
                  onClick={() => setBracketFilter(b)}
                >
                  {b === "ALL" && "All"}
                  {b === "UB" && "Upper"}
                  {b === "LB" && "Lower"}
                  {b === "GF" && "Grand Final"}
                </button>
              ))}
            </div>
          </div>

          {/* Season toggle (desktop right side) */}
          <div className="bracket-season-toggle bracket-season-toggle-desktop">
            <span className="bracket-season-label">Season:</span>
            {seasons.map((s) => (
              <button
                key={s}
                type="button"
                className={
                  "bracket-season-btn" +
                  (s === activeSeason ? " bracket-season-btn-active" : "")
                }
                onClick={() => setActiveSeason(s)}
              >
                S{s}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Bracket columns */}
      <section className="bracket-section">
        <div className="bracket-section-inner">
          {visibleRounds.length === 0 && (
            <p className="bracket-empty-text">
              Bracket coming soon for Season {activeSeason}.
            </p>
          )}

          <div className="bracket-columns">
            {visibleRounds.map((round) => (
              <div key={round.id} className="bracket-round">
                <div className="bracket-round-header">
                  <h3 className="bracket-round-title">{round.title}</h3>
                  <div className="bracket-round-pill">
                    {round.bracket === "UB" && "Upper Bracket"}
                    {round.bracket === "LB" && "Lower Bracket"}
                    {round.bracket === "GF" && "Grand Final"}
                  </div>
                </div>

                {round.matches.map((match) => (
                  <article
                    key={match.id}
                    className={
                      "glass-panel bracket-match bracket-match-" +
                      round.bracket.toLowerCase()
                    }
                  >
                    {/* top row: round + BoX */}
                    <div className="bracket-match-top">
                      <span className="bracket-match-round">
                        {match.roundLabel}
                      </span>
                      <span className="bracket-match-bo">{match.bo}</span>
                    </div>

                    {/* teams */}
                    <div className="bracket-match-teams">
                      {renderTeamRow(match.team1, match.team2)}
                      <div className="bracket-vs-row">vs</div>
                      {renderTeamRow(match.team2, match.team1)}
                    </div>

                    {/* bottom row: date */}
                    <div className="bracket-match-bottom">
                      <span className="bracket-date">{match.date}</span>
                      {round.bracket === "GF" && (
                        <span className="bracket-champion-tag">
                          Aegis on the line
                        </span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * Helper to render a team row and highlight winner.
 */
function renderTeamRow(team: TeamSide, other: TeamSide) {
  const isWinner = team.score > other.score;

  return (
    <div
      className={
        "bracket-team-row" + (isWinner ? " bracket-team-row-winner" : "")
      }
    >
      <span className="bracket-team-name">
        {team.name}
        <span className="bracket-team-short">{team.short}</span>
      </span>
      <span className="bracket-team-score">{team.score}</span>
    </div>
  );
}
