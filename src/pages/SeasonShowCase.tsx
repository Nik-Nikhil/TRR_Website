import { useRef, useState, useEffect, type UIEvent } from "react";
import React from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  teams,
  season2Teams,
  season3Teams,
  season4Teams,
  season5Teams,
} from "../data/teams";
import Season6Standings from "./Seasons/Season6Standing";

/* --------- Stronger types --------- */
type Player = { nickname?: string; gold?: number };
type SeasonItem = {
  id: string;
  players: Player[];
  wins?: number;
  losses?: number;
  averageMMR?: number;
  logoColor?: string;
  name?: string;
};

/* ----------------------------- Stage buttons ------------------ */
function StageLinkButton({
  season,
  stage,
}: {
  season: number;
  stage: "group" | "playoff";
}) {
  const navigate = useNavigate();
  const label = stage === "group" ? "Group Stage" : "Playoffs";
  const btnClasses =
    "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[0.65rem] sm:text-[0.72rem] font-semibold uppercase tracking-[0.12em] " +
    "bg-gradient-to-tr from-white/90 via-zinc-200 to-zinc-300 text-[#050608] " +
    "shadow-[0_8px_26px_rgba(2,6,23,0.55)] hover:brightness-105 transition-all duration-200 " +
    "backdrop-blur-sm border border-white/10 pointer-events-auto cursor-pointer";

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(
          stage === "group" ? `/group-stage/${season}` : `/playoff/${season}`
        );
      }}
      className={btnClasses}
      aria-label={`${label} for season ${season}`}
      data-no-drag
      type="button"
    >
      {label}
    </button>
  );
}

function CenteredStageButtonsInline({
  season,
  showGroup = true,
  showPlayoff = true,
}: {
  season: number;
  showGroup?: boolean;
  showPlayoff?: boolean;
}) {
  if (!showGroup && !showPlayoff) return null;
  return (
    <div className="w-full flex justify-center mt-2 pointer-events-none">
      <div className="flex gap-2 sm:gap-3 pointer-events-auto">
        {showGroup && <StageLinkButton season={season} stage="group" />}
        {showPlayoff && <StageLinkButton season={season} stage="playoff" />}
      </div>
    </div>
  );
}

/* ----------------------------- Utilities --------------------- */
const rowVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03, ease: [0.22, 0.61, 0.36, 1] },
  }),
  hover: { scale: 1.003, translateY: -2 },
};

function buildOrdered<T extends SeasonItem>(
  list: T[],
  topIds: (string | undefined)[],
  placementOrderAfterTop3: string[] = [],
  dqIds: string[] = []
) {
  const orderedByRecord = [...list].sort((a, b) => {
    const aw = a.wins ?? null;
    const bw = b.wins ?? null;
    if (aw !== null && bw !== null && aw !== bw) return bw - aw;

    const al = a.losses ?? null;
    const bl = b.losses ?? null;
    if (al !== null && bl !== null && al !== bl) return al - bl;

    return 0;
  });

  const champion = orderedByRecord.find((t) => t.id === topIds[0]);
  const runnerUp = orderedByRecord.find((t) => t.id === topIds[1]);
  const third = orderedByRecord.find((t) => t.id === topIds[2]);
  const dqTeams = dqIds
    .map((d) => orderedByRecord.find((t) => t.id === d))
    .filter(Boolean) as T[];

  const remaining = orderedByRecord.filter(
    (t) => ![...topIds, ...dqIds].includes(t.id)
  );

  const orderedOthers: T[] = [
    ...placementOrderAfterTop3
      .map((id) => remaining.find((t) => t.id === id))
      .filter(Boolean) as T[],
    ...remaining.filter((t) => !placementOrderAfterTop3.includes(t.id)),
  ];

  const result = [champion, runnerUp, third, ...orderedOthers, ...dqTeams].filter(
    Boolean
  ) as T[];

  return { result, champion, runnerUp, third, dqTeams };
}

function makeTeamGold(players: Player[]) {
  return players.reduce((s, p) => s + (p.gold ?? 0), 0);
}

/* ----------------------------- Season card template ------------------ */
function SeasonCard<T extends SeasonItem>({
  list,
  topIds,
  placementOrderAfterTop3 = [],
  dqIds = [],
  seasonNumber = 0,
  title = "",
}: {
  list: T[];
  topIds: (string | undefined)[];
  placementOrderAfterTop3?: string[];
  dqIds?: string[];
  seasonNumber?: number;
  title?: string;
}) {
  const { result: ordered, champion, runnerUp, third, dqTeams } = buildOrdered<T>(
    list,
    topIds,
    placementOrderAfterTop3,
    dqIds
  );
  const championId = champion?.id,
    runnerUpId = runnerUp?.id,
    thirdId = third?.id;
  const dqMap = new Set(dqTeams.map((d) => d.id));

  const tableInnerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="w-full flex justify-center h-full py-2 px-3 sm:px-4 md:px-6">
      <div className="w-full max-w-[900px] flex flex-col min-h-0 flex-1">
        {/* Card shell — no overflow-hidden so border-radius stays visible while scrolling */}
        <div
          className="flex flex-col flex-1 min-h-0"
          style={{
            background: "rgba(5,6,8,0.82)",
            backdropFilter: "blur(12px)",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 18px 44px rgba(0,0,0,0.85)",
          }}
        >
          {/* Header — shrink-0 so it never compresses */}
          <div
            className="px-3 sm:px-4 py-2 sm:py-3 flex flex-col items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(90deg,rgba(245,197,66,0.18),rgba(245,197,66,0.06))",
              borderBottom: "1px solid rgba(255,255,255,0.10)",
              borderRadius: "16px 16px 0 0",
            }}
          >
            <h3
              className="text-sm sm:text-base md:text-lg text-center uppercase tracking-[0.16em] font-black"
              style={{ color: "#f5c542", textShadow: "0 0 20px rgba(245,197,66,0.5)" }}
            >
              {title || `Season ${seasonNumber}`}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-[0.1em]" style={{ color: "rgba(245,197,66,0.6)" }}>
                {ordered.length} Teams
              </span>
            </div>
            <CenteredStageButtonsInline
              season={seasonNumber}
              showGroup={seasonNumber !== 1 && seasonNumber !== 3 && seasonNumber !== 4}
              showPlayoff={true}
            />
          </div>

          {/* Scrollable table body */}
          <div
            ref={tableInnerRef}
            className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden themed-scrollbar"
            style={{ borderRadius: "0 0 16px 16px" }}
            data-vertical-scroll="true"
          >
            <table className="w-full border-collapse text-[0.72rem] sm:text-xs bg-transparent" style={{ tableLayout: 'fixed' }}>
              <thead
                className="sticky top-0 z-40"
                style={{
                  background: "rgba(10,10,12,0.97)",
                  backdropFilter: "blur(8px)",
                  borderBottom: "1px solid rgba(245,197,66,0.25)",
                }}
              >
                <tr>
                  <th className="text-left py-2 pl-3 sm:pl-4 text-[0.58rem] sm:text-[0.62rem] uppercase tracking-[0.16em] font-bold" style={{ color: "#f5c542" }}>Captain</th>
                  <th className="text-left py-2 text-[0.58rem] sm:text-[0.62rem] uppercase tracking-[0.16em] font-bold" style={{ color: "#f5c542" }}>Team</th>
                  <th className="py-2 text-center w-[42px] sm:w-[52px]" />
                  <th className="py-2 text-right text-[0.58rem] sm:text-[0.62rem] uppercase tracking-[0.1em] font-bold" style={{ color: "#f5c542" }}>Avg MMR</th>
                  <th className="py-2 pr-3 sm:pr-4 text-right text-[0.58rem] sm:text-[0.62rem] uppercase tracking-[0.1em] font-bold" style={{ color: "#f5c542" }}>Gold</th>
                </tr>
              </thead>

              <tbody>
                <AnimatePresence initial={false}>
                  {ordered.map((team, idx) => {
                    const captain = team.players?.[0]?.nickname ?? 'Captain';
                    const gold = makeTeamGold(team.players ?? []);
                    const isChampion = team.id === championId;
                    const isRunnerUp = team.id === runnerUpId;
                    const isThird = team.id === thirdId;
                    const isDQ = dqMap.has(team.id);

                    const rowBg = isChampion
                      ? 'bg-[linear-gradient(90deg,rgba(250,204,21,0.22),rgba(250,204,21,0.06))]'
                      : isRunnerUp
                      ? 'bg-[linear-gradient(90deg,rgba(226,232,240,0.18),rgba(148,163,184,0.05))]'
                      : isThird
                      ? 'bg-[linear-gradient(90deg,rgba(205,127,50,0.22),rgba(138,75,31,0.06))]'
                      : isDQ
                      ? 'bg-[#5a1717]'
                      : 'bg-[#020617]';

                    const rowTextClass = isDQ ? 'text-white' : 'text-gray-200';

                    return (
                      <motion.tr
                        key={team.id}
                        custom={idx}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, y: 6 }}
                        variants={rowVariants}
                        whileHover="hover"
                        className={`
                          group relative h-8 sm:h-9 border-b border-white/3
                          transition-all duration-200 text-[0.72rem] sm:text-[0.78rem]
                          ${rowBg} ${rowTextClass}
                          ${isChampion ? 'hover:shadow-[0_0_30px_rgba(250,204,21,0.65)]' : ''}
                          ${isRunnerUp ? 'hover:shadow-[0_0_28px_rgba(226,232,240,0.55)]' : ''}
                          ${isThird ? 'hover:shadow-[0_0_28px_rgba(234,179,8,0.5)]' : ''}
                        `}
                        style={(!isChampion && !isRunnerUp && !isThird && !isDQ && team.logoColor) ? { boxShadow: `0 0 12px ${team.logoColor}40` } : undefined}
                      >
                        <td className="pl-3 sm:pl-4">
                          <div className="flex items-center gap-1.5 sm:gap-2 font-semibold min-w-0">
                            <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full shrink-0" style={{ backgroundColor: team.logoColor || '#334' }} />
                            <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-white/6 text-[0.6rem] sm:text-[0.66rem] uppercase tracking-widest sm:tracking-[0.1em] truncate" style={{ maxWidth: '110px' }}>
                              {captain}
                            </span>
                          </div>
                        </td>

                        <td className="pr-2 sm:pr-3">
                          <Link to={`/teams/${team.id}`} className="text-[0.7rem] sm:text-xs hover:text-white transition block truncate" style={{ maxWidth: '220px' }}>
                            {team.name ?? team.id}
                          </Link>
                        </td>

                        <td className="text-center">
                          <motion.div
                            whileHover={{ scale: 1.15 }}
                            transition={{ type: "spring", stiffness: 260, damping: 14 }}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-full"
                          >
                            {isChampion && (
                              <div className="h-6 w-6 rounded-full flex items-center justify-center bg-[#facc15] text-[0.62rem] shadow-[0_0_20px_rgba(250,204,21,1),0_0_40px_rgba(250,204,21,0.85)]">🏆</div>
                            )}
                            {isRunnerUp && (
                              <div className="h-6 w-6 rounded-full flex items-center justify-center bg-[#9ca3af] text-[0.62rem] shadow-[0_0_14px_rgba(226,232,240,0.8),0_0_32px_rgba(148,163,184,0.6)]">🥈</div>
                            )}
                            {isThird && (
                              <div className="h-6 w-6 rounded-full flex items-center justify-center bg-[#d97706] text-[0.62rem] shadow-[0_0_14px_rgba(234,179,8,0.7),0_0_30px_rgba(180,83,9,0.6)]">🥉</div>
                            )}
                            {isDQ && (
                              <div className="h-6 w-6 rounded-full flex items-center justify-center bg-[#7f1d1d] text-white font-bold text-[0.55rem] shadow-[0_0_14px_rgba(127,29,29,0.9)]" title="Disqualified due to smurfing">DQ</div>
                            )}
                          </motion.div>
                        </td>

                        <td className="text-right pr-2 sm:pr-3"><span className="tabular-nums text-[0.7rem] sm:text-xs">{team.averageMMR ?? '-'}</span></td>
                        <td className="pr-3 sm:pr-4 text-right"><span className="tabular-nums font-semibold text-[0.7rem] sm:text-xs">{gold}</span></td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>

              <tfoot>
                <tr style={{ height: '12px' }}><td colSpan={5} /></tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Season wrappers using SeasonCard ------------------ */
function Season1Standings() {
  return (
    <SeasonCard
      list={teams as unknown as SeasonItem[]}
      topIds={['godspeed', 'reciprocal', 'banner']}
      placementOrderAfterTop3={['helm', 'bazinga', 'billy', 'nabeel']}
      dqIds={['kolly']}
      seasonNumber={1}
      title="Season I"
    />
  );
}
function Season2Standings() {
  return (
    <SeasonCard
      list={season2Teams as unknown as SeasonItem[]}
      topIds={['mslayer-s2', 'bazinga-s2', 'ngx-Irox-s2']}
      placementOrderAfterTop3={['madlad-s2', 'tom1c-s2', 'machine-s2', 'madara-s2', 'r3ciprocal-s2', 'banner-s2', 'gxnova-s2', 'xj-s2']}
      dqIds={['grimm-s2']}
      seasonNumber={2}
      title="Season II"
    />
  );
}
function Season3Standings() {
  return (
    <SeasonCard
      list={season3Teams as unknown as SeasonItem[]}
      topIds={['dynamodon-s3', 'nemesisx001-s3', 'shaidota-s3']}
      placementOrderAfterTop3={['pero-s3', 'shikamaru-s3', 'jinx-s3']}
      dqIds={[]}
      seasonNumber={3}
      title="Season III"
    />
  );
}
function Season4Standings() {
  return (
    <SeasonCard
      list={season4Teams as unknown as SeasonItem[]}
      topIds={['future-s4', 's1mpleo-s4', 'helm-s4']}
      placementOrderAfterTop3={[
        'plutoski-s4',
        'nj-s4', 'zromep-s4',
        'ericdane-s4', 'vanara-s4',
        'primeone-s4', 'draco-s4', 'phola', 'lightninggoku-s4',
        'rinne-s4', 'drnemesis-s4', 'tambamgod-s4', 'pyro-s4',
        'rav-s4', 'shikamaru-s4', 'sherry', 'muri-s4', 'shaidota-s4', 'penda-s4', 'sexy', 'kakarot',
      ]}
      dqIds={[]}
      seasonNumber={4}
      title="Season IV"
    />
  );
}
function Season5Standings() {
  return (
    <SeasonCard
      list={season5Teams as unknown as SeasonItem[]}
      topIds={['bull-s5', 'shadow-s5', 'sai-s5']}
      placementOrderAfterTop3={['helm-s5', 'gokushery-s5']}
      dqIds={['sasuke-s5', 'smurfpandas-s5']}
      seasonNumber={5}
      title="Season V"
    />
  );
}

/* ----------------------------- Main carousel ----------------------------- */
const seasonsConfig: { id: number; render: () => React.ReactElement }[] = [
  { id: 1, render: () => <Season1Standings /> },
  { id: 2, render: () => <Season2Standings /> },
  { id: 3, render: () => <Season3Standings /> },
  { id: 4, render: () => <Season4Standings /> },
  { id: 5, render: () => <Season5Standings /> },
  { id: 6, render: () => <Season6Standings /> },
];

export default function SeasonShowCase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const seasonParam = params.get('season');
    if (seasonParam) {
      const seasonIndex = parseInt(seasonParam) - 1;
      if (seasonIndex >= 0 && seasonIndex < seasonsConfig.length) {
        scrollToIndex(seasonIndex);
      }
    }
  }, []);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const width = el.clientWidth || 1;
    const idx = Math.round(el.scrollLeft / width);
    if (idx !== activeIndex) setActiveIndex(idx);
  };

  const scrollToIndex = (index: number) => {
    const el = containerRef.current;
    if (!el) return;
    const width = el.clientWidth;
    el.scrollTo({ left: width * index, behavior: 'smooth' });
  };

  return (
    <main
      className="seasons-page overflow-hidden relative"
      style={{
        fontFamily: "'Inter', sans-serif",
        flex: "1 1 0",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/bg_19.jpg')" }} />

      <div className="relative z-10 flex flex-col flex-1 min-h-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col flex-1 min-h-0">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex justify-center mt-2 mb-1 relative shrink-0"
          >
            <div
              className="inline-flex items-center px-3 py-1 rounded-full border border-white/10"
              style={{
                background: "rgba(5,6,8,0.65)",
                backdropFilter: "blur(8px)",
              }}
            >
              <p
                className="text-[0.6rem] font-semibold tracking-[0.2em] uppercase"
                style={{ color: "#f5c542", textShadow: "0 0 12px rgba(245,197,66,0.5)" }}
              >
                Click to view standings from past seasons
              </p>
            </div>
          </motion.div>

          <div className="flex justify-center shrink-0">
            <div className="relative w-full max-w-xl px-2" style={{ height: 52 }}>
              <div className="absolute left-4 sm:left-6 right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                <div className="timeline-line" />
              </div>

              <div className="relative z-30 flex justify-between items-center h-8 px-2" style={{ top: '50%', transform: 'translateY(-50%)' }}>
                {seasonsConfig.map((season, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <button key={season.id} onClick={() => scrollToIndex(index)} className={`timeline-bullet ${isActive ? 'active' : ''}`} type="button" aria-label={`Go to season ${season.id}`}>
                      <span className="timeline-dot">{season.id}</span>
                      <span className="timeline-ring" aria-hidden />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div
            ref={containerRef}
            onScroll={handleScroll}
            className="seasons-carousel flex overflow-x-hidden snap-x snap-mandatory scroll-smooth select-none items-stretch flex-1 min-h-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            aria-label="Seasons carousel"
          >
            {seasonsConfig.map(({ id, render }, index) => (
              <section key={id} className="snap-start snap-always shrink-0 min-w-full flex justify-center items-stretch pb-3" role="group" aria-roledescription="season">
                <motion.div initial={{ opacity: 0.98, scale: 0.998 }} animate={{ opacity: activeIndex === index ? 1 : 0.92, scale: activeIndex === index ? 1 : 0.997 }} transition={{ duration: 0.28 }} className="w-full max-w-[1300px] origin-top px-1 sm:px-2 flex flex-col min-h-0">
                  {render()}
                </motion.div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}