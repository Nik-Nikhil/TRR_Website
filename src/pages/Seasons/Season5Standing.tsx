// src/pages/seasons/Season5Standings.tsx
import { Link } from "react-router-dom";
import { season5Teams } from "../data/teams";

type Team = (typeof season5Teams)[number];

export default function Season5Standings() {
  const orderedByRecord = [...season5Teams].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return a.losses - b.losses;
  });

  // FINAL SEASON 5 RESULTS
  const championId = "bull-s5";          // 🏆 1st
  const runnerUpId = "shadow-s5";        // 🥈 2nd
  const thirdId = "sai-s5";              // 🥉 3rd

  // TWO DISQUALIFIED TEAMS
  const dqId1 = "sasuke-s5";
  const dqId2 = "smurfpandas-s5";

  const champion = orderedByRecord.find(t => t.id === championId);
  const runnerUp = orderedByRecord.find(t => t.id === runnerUpId);
  const third = orderedByRecord.find(t => t.id === thirdId);
  const dqTeam1 = orderedByRecord.find(t => t.id === dqId1);
  const dqTeam2 = orderedByRecord.find(t => t.id === dqId2);

  const remaining = orderedByRecord.filter(
    t => ![championId, runnerUpId, thirdId, dqId1, dqId2].includes(t.id)
  );

  const placementOrderAfterTop3: Team["id"][] = [
    "helm-s5",
    "gokushery-s5",
    "sexy-s5",
    "ezlng-s5",
    "razer-s5",
    "drnemesis-s5",
    "s1mple0-s5",
    "flux-s5",
    "midas-s5",
    "shirley-s5",
    "roronoa-s5",
    "banner-s5",
    "n1khil-s5",
    "exe-s5",
    "rav-s5",
    "hina-s5",
    "bakabot-s5",
    "shikamaru-s5",
    "killua-s5",
    "future-s5",
    "billy-s5",
    "zromep-s5",
    "fyt-s5",
  ];

  const orderedOthers: Team[] = [
    ...placementOrderAfterTop3.map(id => remaining.find(t => t.id === id)).filter(Boolean) as Team[],
    ...remaining.filter(t => !placementOrderAfterTop3.includes(t.id))
  ];

  function teamGold(team: Team): number {
    return team.players.reduce((sum, p) => sum + (p.gold || 0), 0);
  }

  const ordered: Team[] = [
    champion,
    runnerUp,
    third,
    ...orderedOthers,
    dqTeam1,
    dqTeam2,
  ].filter(Boolean) as Team[];

  return (
    <main className="w-full flex justify-center pt-24 pb-4 bg-[#050608]">
      <div className="w-full max-w-[880px] px-6">
        {/* HEADER */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h1
              className="text-[clamp(2rem,3vw,2.4rem)] leading-tight font-semibold tracking-[0.18em]
              bg-linear-to-b from-white to-[#c2c2c2] text-transparent bg-clip-text
              drop-shadow-[0_3px_6px_rgba(255,255,255,0.35)]"
            >
              Season Ⅴ
            </h1>

            <Link
              to="/tournament"
              className="px-6 py-2 rounded-full text-[0.8rem] font-semibold uppercase tracking-[0.18em]
              bg-linear-to-tr from-[#f5f5f5] via-[#c0c0c0] to-[#9ca3af] text-[#050608]
              shadow-[0_0_25px_rgba(148,163,184,0.85)] hover:brightness-110 transition whitespace-nowrap"
            >
              VIEW BRACKET
            </Link>
          </div>

          {/* SEASON NAV */}
          <div className="flex flex-wrap items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em]">
            <Link to="/seasons/1" className="pill">Season Ⅰ →</Link>
            <Link to="/seasons/2" className="pill">Season Ⅱ →</Link>
            <Link to="/seasons/3" className="pill">Season Ⅲ →</Link>
            <Link to="/seasons/4" className="pill">Season Ⅳ →</Link>

            <Link
              to="/seasons/5"
              className="inline-flex items-center px-4 py-1 rounded-full
              bg-linear-to-r from-[#f5f5f5] via-[#d4d4d8] to-[#9ca3af]
              text-[#050608] shadow-[0_0_16px_rgba(148,163,184,0.85)]"
            >
              Season Ⅴ
            </Link>

            <Link to="/seasons/6" className="pill">Season Ⅵ →</Link>
          </div>
        </header>

        {/* TABLE */}
        <div className="w-full overflow-x-auto rounded-3xl border border-white/10 bg-[#050608] shadow-[0_18px_50px_rgba(0,0,0,0.8)]">
          <table className="w-full border-spacing-0 text-sm">
            <thead className="text-left text-[0.7rem] uppercase tracking-[0.22em] text-gray-300">
              <tr className="border-none bg-white/0.05 backdrop-blur-sm">
                <th className="py-3 pl-5 text-[0.68rem]">Captain</th>
                <th className="py-3 text-[0.68rem]">Team Name</th>
                <th className="py-3 text-center w-[72px]"></th>
                <th className="py-3 text-right text-[0.68rem]">Avg MMR</th>
                <th className="py-3 pr-5 text-right text-[0.68rem]">Gold Allocated</th>
              </tr>
            </thead>

            <tbody>
              {ordered.map((team) => {
                const captain = team.players[0]?.nickname ?? "Captain";
                const gold = teamGold(team);

                const isChampion = team.id === championId;
                const isRunnerUp = team.id === runnerUpId;
                const isThird = team.id === thirdId;
                const isDQ = team.id === dqId1 || team.id === dqId2;

                let rowClass =
                  "relative h-10 border-none overflow-hidden hover:bg-white/[0.04] transition-colors duration-300 text-[0.78rem]";

                if (isChampion) rowClass += " bg-[rgba(255,215,0,0.22)] shadow-[0_0_22px_rgba(255,215,0,0.35)]";
                else if (isRunnerUp) rowClass += " bg-[rgba(192,192,192,0.22)] shadow-[0_0_20px_rgba(148,163,184,0.35)]";
                else if (isThird) rowClass += " bg-[rgba(205,127,50,0.22)] shadow-[0_0_20px_rgba(248,153,102,0.35)]";
                else if (isDQ) rowClass += " bg-[#7f1d1d]";
                else rowClass += " bg-[#020617]";

                return (
                  <tr
                    key={team.id}
                    className={rowClass}
                    style={
                      !isChampion && !isRunnerUp && !isThird && !isDQ
                        ? { boxShadow: `0 0 14px ${team.logoColor}40` }
                        : undefined
                    }
                  >
                    {/* CAPTAIN */}
                    <td className="pl-5">
                      <div className="flex items-center gap-3 font-semibold">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: team.logoColor }} />
                        <span className="px-3 py-1 rounded-full bg-white/10 text-xs uppercase tracking-[0.16em] text-gray-200 shadow">
                          {captain}
                        </span>
                      </div>
                    </td>

                    {/* TEAM NAME */}
                    <td>
                      <Link to={`/teams/${team.id}`} className="hover:text-gray-200 transition text-sm max-w-[260px]">
                        <span className={`block whitespace-nowrap overflow-hidden text-ellipsis ${isDQ ? "line-through opacity-80" : ""}`}>
                          {team.name}
                        </span>
                      </Link>
                    </td>

                    {/* TROPHY / MEDALS / DQ */}
                    <td className="text-center">
                      {isChampion && (
                        <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#facc15] shadow-[0_0_18px_rgba(250,204,21,0.9)]">
                          <span className="text-lg">🏆</span>
                        </div>
                      )}
                      {isRunnerUp && (
                        <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#9ca3af] shadow-[0_0_18px_rgba(148,163,184,0.9)]">
                          <span className="text-lg">🥈</span>
                        </div>
                      )}
                      {isThird && (
                        <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#d97706] shadow-[0_0_18px_rgba(234,179,8,0.95)]">
                          <span className="text-lg">🥉</span>
                        </div>
                      )}
                      {isDQ && !isChampion && !isRunnerUp && !isThird && (
                        <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#b91c1c]">
                          <span className="text-[0.65rem] font-extrabold tracking-[0.18em] uppercase">
                            DQ
                          </span>
                        </div>
                      )}
                    </td>

                    {/* MMR */}
                    <td className="text-right text-gray-100">
                      {team.averageMMR}
                    </td>

                    {/* GOLD */}
                    <td className="pr-5 text-right font-semibold text-gray-200">
                      {gold}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
