// src/pages/seasons/Season2Standings.tsx
import { Link } from "react-router-dom";
import { season2Teams } from "../data/teams";

type Team = (typeof season2Teams)[number];

export default function Season2Standings() {
  const orderedByRecord = [...season2Teams].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return a.losses - b.losses;
  });

  const championId: Team["id"] = "mslayer-s2";
  const runnerUpId: Team["id"] = "bazinga-s2";
  const thirdId: Team["id"] = "ngx-savage-s2";
  const dqId: Team["id"] = "grimm-s2";

  const champion = orderedByRecord.find((t) => t.id === championId);
  const runnerUp = orderedByRecord.find((t) => t.id === runnerUpId);
  const third = orderedByRecord.find((t) => t.id === thirdId);
  const dqTeam = orderedByRecord.find((t) => t.id === dqId);

  const remaining: Team[] = orderedByRecord.filter(
    (t) => ![championId, runnerUpId, thirdId, dqId].includes(t.id)
  );

  // after top 3 (and excluding DQ)
  const placementOrderAfterTop3: Team["id"][] = [
    "madlad-s2",
    "tom1c-s2",
    "machine-s2",
    "madara-s2",
    "r3ciprocal-s2",
    "banner-s2",
    "gxnova-s2",
    "xj-s2",
  ];

  const orderedOthers: Team[] = [
    ...placementOrderAfterTop3
      .map((id) => remaining.find((t) => t.id === id))
      .filter((t): t is Team => Boolean(t)),
    ...remaining.filter((t) => !placementOrderAfterTop3.includes(t.id)),
  ];

  function teamGold(team: Team): number {
    return team.players.reduce((sum, p) => sum + (p.gold || 0), 0);
  }

  const ordered: Team[] = [
    champion,
    runnerUp,
    third,
    ...orderedOthers,
    dqTeam,
  ].filter((t): t is Team => Boolean(t));

  return (
    <main className="w-full flex justify-center pt-10 pb-4 bg-[#050608]">
      <div className="w-full max-w-[880px] px-6">
        {/* === CENTERED BRACKET BUTTON === */}
        <div className="flex justify-center mb-6">
          <Link
            to="/tournament"
            className="px-8 py-2 rounded-full text-[0.8rem] font-semibold uppercase tracking-[0.18em]
            bg-linear-to-tr from-[#f5f5f5] via-[#c0c0c0] to-[#9ca3af] text-[#050608]
            shadow-[0_0_25px_rgba(148,163,184,0.85)] hover:brightness-110 transition"
          >
            VIEW BRACKET
          </Link>
        </div>

        {/* === TABLE === */}
        <div className="w-full overflow-x-auto rounded-3xl border border-white/10 bg-[#050608] shadow-[0_18px_50px_rgba(0,0,0,0.8)]">
          <table className="w-full border-spacing-0 text-sm">
            <thead className="text-left text-[0.7rem] uppercase tracking-[0.22em] text-gray-300">
              <tr className="border-none bg-white/0.05 backdrop-blur-sm">
                <th className="py-3 pl-5 text-[0.68rem] text-gray-300">Captain</th>
                <th className="py-3 text-[0.68rem] text-gray-300">Team Name</th>
                <th className="py-3 text-center w-[72px] text-[0.68rem] text-gray-300"></th>
                <th className="py-3 text-right text-[0.68rem] text-gray-300">
                  Avg MMR
                </th>
                <th className="py-3 pr-5 text-right text-[0.68rem] text-gray-300">
                  Gold Allocated
                </th>
              </tr>
            </thead>

            <tbody>
              {ordered.map((team) => {
                const captain = team.players[0]?.nickname ?? "Captain";
                const gold = teamGold(team);

                const isChampion = team.id === championId;
                const isRunnerUp = team.id === runnerUpId;
                const isThird = team.id === thirdId;
                const isDQ = team.id === dqId;

                const baseRow =
                  "relative h-10 border-none overflow-hidden hover:bg-white/[0.04] transition-colors duration-300 text-[0.78rem]";

                let rowClass = baseRow;

                if (isChampion) {
                  rowClass +=
                    " bg-[rgba(255,215,0,0.22)] shadow-[0_0_22px_rgba(255,215,0,0.35)]";
                } else if (isRunnerUp) {
                  rowClass +=
                    " bg-[rgba(192,192,192,0.22)] shadow-[0_0_20px_rgba(148,163,184,0.35)]";
                } else if (isThird) {
                  rowClass +=
                    " bg-[rgba(205,127,50,0.22)] shadow-[0_0_20px_rgba(248,153,102,0.35)]";
                } else if (isDQ) {
                  rowClass += " bg-[#7f1d1d]";
                } else {
                  rowClass += " bg-[#020617]";
                }

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
                    <td className="pl-5">
                      <div className="flex items-center gap-3 font-semibold">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: team.logoColor }}
                        />
                        <span className="px-3 py-1 rounded-full bg-white/10 text-xs uppercase tracking-[0.16em] text-gray-200 shadow-[0_0_12px_rgba(255,255,255,0.2)]">
                          {captain}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="flex items-center gap-2 font-semibold">
                        <Link
                          to={`/teams/${team.id}`}
                          className="hover:text-[#e5e7eb] transition text-sm max-w-[260px]"
                        >
                          <span
                            className={`block whitespace-nowrap overflow-hidden text-ellipsis ${
                              isDQ ? "line-through opacity-80" : ""
                            }`}
                          >
                            {team.name}
                          </span>
                        </Link>
                      </div>
                    </td>

                    <td>
                      <div className="flex items-center justify-center">
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
                      </div>
                    </td>

                    <td className="text-right">
                      <span className="tabular-nums text-sm text-gray-100">
                        {team.averageMMR}
                      </span>
                    </td>

                    <td className="pr-5 text-right">
                      <span className="tabular-nums font-semibold text-gray-200">
                        {gold}
                      </span>
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
