import React, { useMemo } from "react";

/**
 * GroupStage.jsx
 * Updated: side-by-side group cards using your site's dark theme colors by default.
 * - Pass `groups`, `advanceCount`, and optional `siteAccent` / `siteBg` props.
 * - Keeps green and red legend but gives them subtle glow effects.
 * - Responsive two-column layout for desktop, single-column on small screens.
 *
 * Example: <GroupStage groups={...} siteAccent="#0fb4b4" siteBg="#071023" />
 */

const sampleGroups = [
  {
    id: "A",
    name: "Group A",
    teams: [
      { id: "t1", captain: "Nabeel", name: "The Unknowns", w: 3, d: 2, l: 0, pts: 11 },
      { id: "t2", captain: "Bazinga", name: "Shayad Degi Woh", w: 2, d: 3, l: 0 },
      { id: "t3", captain: "Helm", name: "Viewers Games", w: 2, d: 2, l: 1 },
      { id: "t4", captain: "X", name: "New Team", w: 0, d: 0, l: 0 },
      { id: "t5", captain: "Y", name: "Other Boys", w: 0, d: 0, l: 5 },
    ],
  },
  {
    id: "B",
    name: "Group B",
    teams: [
      { id: "b1", captain: "Billy", name: "Billy Team", w: 3, d: 1, l: 1 },
      { id: "b2", captain: "Narai", name: "LORDS", w: 3, d: 0, l: 2 },
      { id: "b3", captain: "Reciprocal", name: "Pandey Randi", w: 2, d: 2, l: 1 },
      { id: "b4", captain: "Zed", name: "Imposters", w: 0, d: 0, l: 5 },
    ],
  },
];

function computePts(team) {
  if (typeof team.pts === "number") return team.pts;
  const w = Number(team.w || 0);
  const d = Number(team.d || 0);
  return w * 3 + d * 1;
}

function useSortedTeams(teams) {
  return useMemo(() => {
    const cloned = teams.map((t) => ({ ...t, pts: computePts(t) }));
    cloned.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if ((b.w || 0) !== (a.w || 0)) return (b.w || 0) - (a.w || 0);
      return a.name.localeCompare(b.name);
    });
    return cloned;
  }, [teams]);
}

export default function GroupStage({ groups = sampleGroups, advanceCount = 2, siteAccent = "#0fb4b4", siteBg = "#071023" }) {
  return (
    <div className="p-6 bg-transparent">
      {/* Grid: 2 columns on md+, single column on small */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} advanceCount={advanceCount} siteAccent={siteAccent} siteBg={siteBg} />
        ))}
      </div>
    </div>
  );
}

function hexToRgba(hex, alpha = 1) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function GroupCard({ group, advanceCount, siteAccent, siteBg }) {
  const teams = useSortedTeams(group.teams);
  const accent = siteAccent || '#0fb4b4';
  const bg = siteBg || '#071023';
  const accentSoft = hexToRgba(accent, 0.12);
  const accentSoft2 = hexToRgba(accent, 0.06);

  return (
    <div
      className="relative rounded-xl overflow-hidden shadow-2xl transform transition hover:-translate-y-2"
      style={{ background: hexToRgba(bg, 0.6), border: `1px solid ${hexToRgba('#ffffff', 0.04)}` }}
    >
      {/* Accent header using site accent color */}
      <div
        className="h-14 flex items-center justify-center text-white font-bold text-lg"
        style={{ background: `linear-gradient(90deg, ${hexToRgba(accent, 1)}, ${hexToRgba(accent, 0.7)})` }}
      >
        {group.name}
      </div>

      <div className="p-4" style={{ background: `linear-gradient(180deg, ${accentSoft}, ${accentSoft2})` }}>
        <div className="grid grid-cols-12 gap-2 items-center font-semibold text-slate-200 text-sm px-2 py-1">
          <div className="col-span-3 text-slate-200/90">Captain</div>
          <div className="col-span-5 text-slate-200/90">Team</div>
          <div className="col-span-2 text-center text-slate-200/80">W-D-L</div>
          <div className="col-span-1 text-center text-slate-200/90">Pts</div>
          <div className="col-span-1 text-center text-slate-200/90">Rank</div>
        </div>

        <div className="divide-y divide-white/6 mt-2">
          {teams.map((team, idx) => {
            const isAdvance = idx < advanceCount;
            return (
              <div
                key={team.id}
                className={`grid grid-cols-12 gap-2 items-center py-3 px-2 transition-all hover:backdrop-brightness-110 ${
                  isAdvance ? 'bg-gradient-to-r from-white/6 to-white/2' : 'bg-transparent'
                }`}
                style={{ borderRadius: 6 }}
              >
                <div className="col-span-3 text-slate-200 text-sm">{team.captain}</div>
                <div className="col-span-5 flex items-center gap-3">
                  {/* Placeholder for team logo */}
                  <div className="w-8 h-8 rounded-md bg-white/6 flex-shrink-0 flex items-center justify-center text-xs font-medium text-slate-300">LOGO</div>
                  <div className="text-sm text-slate-100">{team.name}</div>
                </div>
                <div className="col-span-2 text-center text-slate-300">{`${team.w ?? 0}-${team.d ?? 0}-${team.l ?? 0}`}</div>
                <div className="col-span-1 text-center font-semibold text-slate-100">{computePts(team)}</div>
                <div className="col-span-1 text-center">
                  <RankBadge rank={idx + 1} highlighted={isAdvance} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-4 mt-4 px-1">
          <LegendItem colorClass="from-emerald-400 to-emerald-600" label="Advances to Main Event" glow />
          <LegendItem colorClass="from-rose-400 to-rose-600" label="Eliminated" glow />
        </div>
      </div>
    </div>
  );
}

function RankBadge({ rank, highlighted }) {
  return (
    <div
      className={`inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-semibold transition-transform transform ${
        highlighted
          ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-400/20 shadow-[0_6px_18px_rgba(34,197,94,0.12)] scale-105'
          : 'bg-white/6 text-slate-200 border border-white/6'
      }`}
      title={`Rank ${rank}`}
    >
      {rank}{getOrdinal(rank)}
    </div>
  );
}

function LegendItem({ colorClass, label, glow }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div
        className={`w-4 h-4 rounded-sm bg-gradient-to-br ${colorClass}`}
        style={glow ? { boxShadow: `0 4px 14px ${hexToRgba(colorClass.includes('emerald') ? '#10B981' : '#F43F5E', 0.18)}` } : {}}
      />
      <div className="text-slate-200">{label}</div>
    </div>
  );
}

function getOrdinal(n) {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
