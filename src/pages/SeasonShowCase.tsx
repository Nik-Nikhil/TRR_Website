import { useRef, useState, useEffect, type UIEvent, type PointerEvent, type JSX } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  teams,
  season2Teams,
  season3Teams,
  season4Teams,
  season5Teams,
} from "../data/teams";
import Season6Standings from "./Seasons/Season6Standing";
import SeasonsBackgroundEffect from "./Seasons/Effect";

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

  const bottomPaddingPx = 8;
  const bottomCoverHeight = 8;

  const tableInnerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="w-full flex justify-center pb-4">
      <div className="w-full max-w-[1100px] px-3 sm:px-4 md:px-6 relative pt-2">
        <div className="rounded-2xl sm:rounded-3xl border border-white/6 bg-[#050608] shadow-[0_24px_60px_rgba(0,0,0,0.85)] overflow-hidden relative group">
          <div className="px-4 sm:px-6 py-3 sm:py-5 flex flex-col items-center justify-center border-b border-white/6 bg-[linear-gradient(90deg,rgba(8,13,25,0.85),rgba(8,12,18,0.65))]">
            <h3 className="text-sm sm:text-base md:text-lg text-center uppercase tracking-[0.15em] sm:tracking-[0.18em] text-slate-200 font-semibold">{title || `Season ${seasonNumber}`}</h3>
            <CenteredStageButtonsInline
              season={seasonNumber}
              showGroup={seasonNumber !== 1 && seasonNumber !== 3}
              showPlayoff={true}
            />
          </div>

          <div
            ref={tableInnerRef}
            className="table-scroll-wrapper custom-standings-scroll overflow-auto"
            style={{
              maxHeight: 'var(--seasons-table-max-h, calc(100vh - 260px))',
              paddingBottom: `${bottomPaddingPx}px`,
              background: 'transparent',
            }}
            data-vertical-scroll="true"
          >
            <div className="relative season-card-inner min-w-[600px]">
              <table className="w-full border-collapse text-xs sm:text-sm bg-transparent" style={{ width: '100%', tableLayout: 'fixed' }}>
                <thead className="sticky top-0 z-40 bg-[#050608]/90 backdrop-blur-sm">
                  <tr>
                    <th className="text-left py-2 sm:py-3 pl-4 sm:pl-6 text-[0.6rem] sm:text-[0.68rem] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-300">Captain</th>
                    <th className="text-left py-2 sm:py-3 text-[0.6rem] sm:text-[0.68rem] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-300">Team</th>
                    <th className="py-2 sm:py-3 text-center w-[60px] sm:w-[72px]" />
                    <th className="py-2 sm:py-3 text-right text-[0.6rem] sm:text-[0.68rem] uppercase tracking-widest sm:tracking-[0.12em] text-slate-300">Avg MMR</th>
                    <th className="py-2 sm:py-3 pr-4 sm:pr-6 text-right text-[0.6rem] sm:text-[0.68rem] uppercase tracking-widest sm:tracking-[0.12em] text-slate-300">Gold</th>
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
                            group relative h-10 sm:h-12 border-b border-white/3
                            transition-all duration-200 text-[0.8rem] sm:text-[0.86rem]
                            ${rowBg} ${rowTextClass}
                            ${isChampion ? 'hover:shadow-[0_0_45px_rgba(250,204,21,0.75)]' : ''}
                            ${isRunnerUp ? 'hover:shadow-[0_0_40px_rgba(226,232,240,0.65)]' : ''}
                            ${isThird ? 'hover:shadow-[0_0_40px_rgba(234,179,8,0.6)]' : ''}
                          `}
                          style={(!isChampion && !isRunnerUp && !isThird && !isDQ && team.logoColor) ? { boxShadow: `0 0 16px ${team.logoColor}40` } : undefined}
                        >
                          <td className="pl-4 sm:pl-6">
                            <div className="flex items-center gap-2 sm:gap-3 font-semibold min-w-0">
                              <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full shrink-0" style={{ backgroundColor: team.logoColor || '#334' }} />
                              <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/6 text-[0.65rem] sm:text-[0.72rem] uppercase tracking-widest sm:tracking-[0.12em] truncate" style={{ maxWidth: '140px' }}>
                                {captain}
                              </span>
                            </div>
                          </td>

                          <td className="pr-2 sm:pr-3">
                            <Link to={`/teams/${team.id}`} className="text-xs sm:text-sm hover:text-white transition block truncate" style={{ maxWidth: '300px' }}>
                              {team.name ?? team.id}
                            </Link>
                          </td>

                          <td className="text-center">
                            <motion.div
                              whileHover={{ scale: 1.15 }}
                              transition={{ type: "spring", stiffness: 260, damping: 14 }}
                              className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full"
                            >
                              {isChampion && (
                                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center bg-[#facc15] shadow-[0_0_28px_rgba(250,204,21,1),0_0_60px_rgba(250,204,21,0.85)] hover:shadow-[0_0_36px_rgba(250,204,21,1),0_0_90px_rgba(250,204,21,0.9)] transition-shadow duration-200">
                                  🏆
                                </div>
                              )}
                              {isRunnerUp && (
                                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center bg-[#9ca3af] shadow-[0_0_20px_rgba(226,232,240,0.8),0_0_48px_rgba(148,163,184,0.6)] hover:shadow-[0_0_28px_rgba(226,232,240,0.95),0_0_72px_rgba(148,163,184,0.8)] transition-shadow duration-200">
                                  🥈
                                </div>
                              )}
                              {isThird && (
                                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center bg-[#d97706] shadow-[0_0_20px_rgba(234,179,8,0.7),0_0_46px_rgba(180,83,9,0.6)] hover:shadow-[0_0_30px_rgba(234,179,8,0.9),0_0_80px_rgba(180,83,9,0.8)] transition-shadow duration-200">
                                  🥉
                                </div>
                              )}
                              {isDQ && (
                                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center bg-[#7f1d1d] text-white font-bold text-[0.65rem] sm:text-xs shadow-[0_0_20px_rgba(127,29,29,0.9)] hover:shadow-[0_0_30px_rgba(127,29,29,1)] transition-shadow duration-200" title="Disqualified due to smurfing">
                                  DQ
                                </div>
                              )}
                            </motion.div>
                          </td>

                          <td className="text-right pr-3 sm:pr-4"><span className="tabular-nums text-xs sm:text-sm">{team.averageMMR ?? '-'}</span></td>
                          <td className="pr-4 sm:pr-6 text-right"><span className="tabular-nums font-semibold text-xs sm:text-sm">{gold}</span></td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>

                <tfoot>
                  <tr style={{ height: `${bottomPaddingPx}px` }}>
                    <td colSpan={5} />
                  </tr>
                </tfoot>
              </table>

              <div
                aria-hidden
                className="absolute bottom-0 left-0 right-0 pointer-events-none"
                style={{
                  height: 8,
                  background: 'linear-gradient(to top, rgba(5,6,8,0.95) 0%, rgba(5,6,8,0.45) 60%, transparent 100%)',
                  zIndex: 30,
                }}
              />
            </div>
          </div>

          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: 8,
              right: 8,
              bottom: 8,
              height: bottomCoverHeight,
              pointerEvents: 'none',
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              background: 'linear-gradient(90deg,rgba(8,13,25,0.85),rgba(8,12,18,0.65))',
              boxShadow: '0 6px 24px rgba(0,0,0,0.55) inset',
              zIndex: 40,
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Season wrappers using SeasonCard ------------------ */
function Season1Standings() {
  return SeasonCard<SeasonItem>({
    list: teams as unknown as SeasonItem[],
    topIds: ['godspeed', 'reciprocal', 'banner'],
    placementOrderAfterTop3: ['helm', 'bazinga', 'billy', 'nabeel'],
    dqIds: ['kolly'],
    seasonNumber: 1,
    title: 'Season I',
  });
}
function Season2Standings() {
  return SeasonCard<SeasonItem>({
    list: season2Teams as unknown as SeasonItem[],
    topIds: ['mslayer-s2', 'bazinga-s2', 'ngx-savage-s2'],
    placementOrderAfterTop3: ['madlad-s2', 'tom1c-s2', 'machine-s2', 'madara-s2'],
    dqIds: ['grimm-s2'],
    seasonNumber: 2,
    title: 'Season II',
  });
}
function Season3Standings() {
  return SeasonCard<SeasonItem>({
    list: season3Teams as unknown as SeasonItem[],
    topIds: ['dynamodon-s3', 'nemesisx001-s3', 'shaidota-s3'],
    placementOrderAfterTop3: ['pero-s3', 'shikamaru-s3', 'jinx-s3'],
    dqIds: ['none-s3'],
    seasonNumber: 3,
    title: 'Season III',
  });
}
function Season4Standings() {
  return SeasonCard<SeasonItem>({
    list: season4Teams as unknown as SeasonItem[],
    topIds: ['future-s4', 's1mpleo-s4', 'helm-s4'],
    placementOrderAfterTop3: ['pyro-s4', 'lightninggoku-s4'],
    dqIds: ['none-s4'],
    seasonNumber: 4,
    title: 'Season IV',
  });
}
function Season5Standings() {
  return SeasonCard<SeasonItem>({
    list: season5Teams as unknown as SeasonItem[],
    topIds: ['bull-s5', 'shadow-s5', 'sai-s5'],
    placementOrderAfterTop3: ['helm-s5', 'gokushery-s5'],
    dqIds: ['sasuke-s5', 'smurfpandas-s5'],
    seasonNumber: 5,
    title: 'Season V',
  });
}

/* ----------------------------- Main carousel ----------------------------- */
const seasonsConfig: { id: number; render: () => JSX.Element }[] = [
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

  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);

  useEffect(() => window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }), []);

  useEffect(() => {
    const setMax = () => {
      const headerEl = document.querySelector('.max-w-7xl');
      const headerRect = headerEl ? headerEl.getBoundingClientRect() : { height: 160 };
      const topReserved = Math.max(headerRect.height + 120, 160);
      const available = Math.max(window.innerHeight - topReserved, 360);
      document.documentElement.style.setProperty('--seasons-table-max-h', `${available}px`);
    };
    setMax();
    window.addEventListener('resize', setMax);
    return () => window.removeEventListener('resize', setMax);
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

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const target = e.target as HTMLElement | null;
    if (target && target.closest("[data-vertical-scroll='true']")) return;
    if (target && target.closest("a, button, input, textarea, select, label, [role='button'], [role='link'], [data-no-drag]")) return;
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartScrollRef.current = el.scrollLeft;
    try {
      el.setPointerCapture(e.pointerId);
    } catch (err) {
      void err;
    }
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const el = containerRef.current;
    if (!el) return;
    const dx = e.clientX - dragStartXRef.current;
    el.scrollLeft = dragStartScrollRef.current - dx;
  };

  const endDrag = (e?: PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    if (e && containerRef.current)
      try {
        containerRef.current.releasePointerCapture(e.pointerId);
      } catch (err) {
        void err;
      }
  };

  return (
    <main className="seasons-page relative pt-4 pb-8">
      <SeasonsBackgroundEffect />

      <div className="relative z-10 pt-0 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-1 relative">
            <h1 className="relative inline-block font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-zinc-200 via-slate-100 to-white text-xl sm:text-2xl md:text-3xl">SEASONS</h1>
            <span className="pointer-events-none absolute inset-0 text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-300 blur-lg opacity-20" style={{ transform: "translate(-1px, -1px)" }}>SEASONS</span>
            <motion.div
              animate={{ x: [-40, 160], opacity: [0, 0.6, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="pointer-events-none absolute -top-4 -left-20 w-40 h-32 bg-linear-to-r from-transparent via-zinc-200/70 to-transparent blur-2xl"
            />
            <p className="mt-1 text-[0.6rem] sm:text-[10px] text-slate-300/80 font-light tracking-[0.3em] sm:tracking-[0.35em] uppercase">Drag / Click to journey through time</p>
          </motion.div>

          <div className="flex justify-center">
            <div className="relative w-full max-w-xl px-2 mt-3" style={{ height: 64 }}>
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

              <div className="absolute left-1/2 z-10 pointer-events-none hidden sm:block" style={{ top: '100%', transform: 'translate(-50%, 10px)' }}>
                <div className="timeline-label px-3">Drag / Click to journey through time</div>
              </div>
            </div>
          </div>

          <div
            ref={containerRef}
            onScroll={handleScroll}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            className="seasons-carousel flex overflow-x-auto snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing select-none mt-4 sm:mt-6 items-start"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            aria-label="Seasons carousel"
          >
            {seasonsConfig.map(({ id, render }, index) => (
              <section key={id} className="snap-start snap-always shrink-0 w-full flex justify-center items-start px-1 sm:px-2 pt-1" role="group" aria-roledescription="season">
                <motion.div initial={{ opacity: 0.98, scale: 0.998 }} animate={{ opacity: activeIndex === index ? 1 : 0.92, scale: activeIndex === index ? 1 : 0.997 }} transition={{ duration: 0.28 }} className="w-full max-w-[1300px] origin-top pt-1 pb-4 sm:pb-6">
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