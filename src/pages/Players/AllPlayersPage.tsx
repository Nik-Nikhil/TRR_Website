// src/pages/Players/AllPlayersPage.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { type Player } from "../../data/players";
import { PlayerService } from "../../services/supabaseService";
import { mapDatabasePlayerToFrontend } from "../../utils/playerMapper";

const CARDS   = 8;
const SHOW_MS = 7000;  // Show front for 7 seconds
const BACK_MS = 3000;  // Show back for 3 seconds

// Warm accent color — gold/amber feels more Dota than teal
const C = {
  gold:    "#d4a847",
  goldDim: "rgba(212,168,71,0.5)",
  goldFaint:"rgba(212,168,71,0.12)",
  goldBorder:"rgba(212,168,71,0.22)",
  bg:      "rgba(12,8,4,0.96)",
  bgHover: "rgba(20,14,6,0.98)",
  text:    "#e8dfc0",
  textDim: "#7a6a50",
};

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getInitials(name: string): string {
  if (!name) return "??";
  const words = name.trim().split(" ");
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function getColorFromName(name: string): string {
  // Dota-themed palette: golds, ambers, bronzes, warm reds — no jarring teals or purples
  const colors = [
    "#d4a847", // gold
    "#c8892a", // amber
    "#e8c96a", // pale gold
    "#b87333", // copper
    "#d4622a", // burnt orange
    "#e8a030", // bright amber
    "#c4702e", // bronze
    "#f0c040", // bright gold
    "#a06828", // dark amber
    "#d89040", // warm gold
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

// ── Flip card ────────────────────────────────────────────────────────
function FlipCard({ player, showingBack, delay, slot }: {
  player: Player; showingBack: boolean; delay: number; slot: number;
}) {
  const [imgErr, setImgErr] = useState(false);
  const showFallback = !player.avatarUrl || imgErr;
  const accent = getColorFromName(player.nickname);
  const hueShift = (slot * 37) % 60 - 30;

  const shellStyle: React.CSSProperties = {
    position: "absolute", inset: 0,
    borderRadius: 14,
    border: `1.5px solid ${accent}50`,
    background: "#09070a",
    overflow: "hidden",
    boxShadow: `0 4px 24px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.03)`,
  };

  return (
    <div style={{ perspective: "1000px" }} className="w-full h-full">
      <motion.div
        animate={{ rotateY: showingBack ? 180 : 0 }}
        transition={{ duration: 0.55, delay, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformStyle: "preserve-3d", position: "relative", width: "100%", height: "100%" }}
      >
        {/* ══════════ FRONT ══════════ */}
        <Link
          to={`/players/${player.id}`}
          style={{ ...shellStyle, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
            display: "flex", flexDirection: "column",
            transition: "border-color 0.25s, box-shadow 0.25s, transform 0.25s",
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = `${accent}99`;
            el.style.boxShadow = `0 0 32px ${accent}33, 0 8px 32px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.05)`;
            el.style.transform = "translateY(-3px) scale(1.01)";
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = `${accent}50`;
            el.style.boxShadow = `0 4px 24px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.03)`;
            el.style.transform = "translateY(0) scale(1)";
          }}
        >
          {/* ── top accent bar ── */}
          <div style={{
            height: 2, flexShrink: 0,
            background: `linear-gradient(90deg, transparent 0%, ${accent}cc 30%, ${accent} 50%, ${accent}cc 70%, transparent 100%)`,
            filter: `hue-rotate(${hueShift}deg)`,
          }} />

          {/* ── image zone ── */}
          <div style={{ flex: "0 0 65%", position: "relative", overflow: "hidden",
            background: `linear-gradient(180deg, #0d0a0f 0%, #09070a 100%)` }}>
            {showFallback ? (
              <div style={{
                width: "100%", height: "100%",
                background: `radial-gradient(ellipse at 50% 30%, ${accent}28 0%, #09070a 70%)`,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: `radial-gradient(circle, ${accent}28 0%, transparent 70%)`,
                  border: `1.5px solid ${accent}44`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{
                    fontSize: 22, fontWeight: 900,
                    color: accent, letterSpacing: "0.05em",
                    textShadow: `0 0 20px ${accent}`,
                    userSelect: "none",
                  }}>
                    {getInitials(player.nickname)}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <img
                  src={player.avatarUrl}
                  alt={player.nickname}
                  style={{
                    width: "100%", height: "100%",
                    objectFit: "cover",
                    objectPosition: "center top",
                    display: "block",
                  }}
                  onError={() => setImgErr(true)}
                />
                {/* vignette edges */}
                <div style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  background: `linear-gradient(to bottom, transparent 50%, rgba(9,7,10,0.95) 100%),
                               linear-gradient(to right, rgba(9,7,10,0.3) 0%, transparent 20%, transparent 80%, rgba(9,7,10,0.3) 100%)`,
                }} />
              </>
            )}
          </div>

          {/* ── info bar ── */}
          <div style={{
            flex: "0 0 35%", flexShrink: 0,
            background: `linear-gradient(180deg, rgba(14,11,16,0.98) 0%, rgba(10,8,12,1) 100%)`,
            borderTop: `1px solid ${accent}22`,
            padding: "7px 10px 9px",
            display: "flex", alignItems: "stretch", gap: 6,
            position: "relative",
          }}>
            {/* glow line at top */}
            <div style={{
              position: "absolute", top: 0, left: "10%", right: "10%", height: 1,
              background: `linear-gradient(90deg, transparent, ${accent}66, transparent)`,
            }} />

            {/* LEFT — role icons */}
            <div style={{
              flexShrink: 0, display: "flex", flexDirection: "column",
              justifyContent: "center", gap: 4, paddingRight: 6,
              borderRight: `1px solid ${accent}18`,
            }}>
              {(player.roles || []).filter(r => r?.label && r?.iconSrc).slice(0, 3).length > 0
                ? (player.roles || []).filter(r => r?.label && r?.iconSrc).slice(0, 3).map((role, ri) => (
                  <div key={ri} className="relative group/tip flex items-center justify-center"
                    style={{ width: 20, height: 20, borderRadius: 4,
                      background: `${accent}14`, border: `1px solid ${accent}25` }}>
                    <img src={role.iconSrc} alt={role.label}
                      style={{ width: 13, height: 13, objectFit: "contain", opacity: 0.9 }} />
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-0.5 rounded text-[9px] font-semibold whitespace-nowrap pointer-events-none opacity-0 group-hover/tip:opacity-100 transition-opacity z-50"
                      style={{ background: "rgba(8,4,0,0.95)", border: `1px solid ${C.goldBorder}`, color: C.gold }}>
                      {role.label}
                    </div>
                  </div>
                ))
                : <div style={{ width: 20 }} />
              }
            </div>

            {/* CENTER — name + W/L */}
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column",
              justifyContent: "center", alignItems: "center", gap: 4 }}>
              <p style={{
                color: "#f0e8d8", fontSize: 13, fontWeight: 800,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                maxWidth: "100%",
                letterSpacing: "0.01em", lineHeight: 1,
                textShadow: `0 0 12px ${accent}55`,
              }}>
                {player.nickname}
              </p>
              {player.recentGames && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 4,
                  padding: "2px 7px", borderRadius: 20,
                  background: "rgba(0,0,0,0.35)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}>
                  <span style={{ color: "#4ade80", fontSize: 9, fontWeight: 700 }}>
                    {player.recentGames.wins}W
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 8 }}>|</span>
                  <span style={{ color: "#f87171", fontSize: 9, fontWeight: 700 }}>
                    {player.recentGames.losses}L
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 8 }}>|</span>
                  <span style={{ color: accent, fontSize: 9, fontWeight: 700 }}>
                    {Math.round((player.recentGames.wins / player.recentGames.total) * 100)}%
                  </span>
                </div>
              )}
            </div>

            {/* RIGHT — medal + MMR */}
            <div style={{
              flexShrink: 0, display: "flex", flexDirection: "column",
              justifyContent: "center", alignItems: "center", gap: 3,
              paddingLeft: 6, borderLeft: `1px solid ${accent}18`,
            }}>
              {player.currentMedalId && (
                <img src={`/medals/${player.currentMedalId}.png`} alt={player.currentMedalLabel}
                  style={{ width: 30, height: 30, objectFit: "contain",
                    filter: `drop-shadow(0 0 6px ${accent}66)` }}
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              )}
              {player.currentMMR && (
                <span style={{
                  color: accent, fontSize: 8, fontWeight: 700, lineHeight: 1,
                  letterSpacing: "0.02em", whiteSpace: "nowrap",
                }}>
                  {player.currentMMR >= 1000 ? `${(player.currentMMR / 1000).toFixed(1)}k` : player.currentMMR}
                </span>
              )}
            </div>
          </div>
        </Link>

        {/* ══════════ BACK ══════════ */}
        <div style={{
          ...shellStyle,
          backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          border: `1.5px solid ${C.goldBorder}`,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 10,
        }}>
          {/* diagonal stripe texture */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: `repeating-linear-gradient(-45deg,
              transparent 0px, transparent 8px,
              ${C.goldBorder} 8px, ${C.goldBorder} 9px)`,
            opacity: 0.08,
          }} />
          {/* radial vignette */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 20%, rgba(0,0,0,0.65) 100%)",
          }} />
          {/* top gold bar */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 3,
            background: `linear-gradient(90deg, transparent, ${C.gold} 40%, ${C.gold} 60%, transparent)`,
            opacity: 0.85,
          }} />

          {/* TRR seal */}
          <div style={{
            width: 68, height: 68, borderRadius: "50%",
            border: `2px solid ${C.goldBorder}`,
            background: `radial-gradient(circle, ${C.goldFaint} 0%, rgba(0,0,0,0) 80%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 24px ${C.goldFaint}, inset 0 0 16px ${C.goldFaint}`,
            zIndex: 1,
          }}>
            <span style={{ color: C.gold, fontSize: 16, fontWeight: 900, letterSpacing: 3 }}>TRR</span>
          </div>
          <span style={{ color: C.textDim, fontSize: 8, letterSpacing: "0.32em", textTransform: "uppercase", zIndex: 1 }}>
            The Roshan Rumble
          </span>
        </div>
      </motion.div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────
export default function AllPlayersPage() {
  const [allPlayers, setAllPlayers]     = useState<Player[]>([]);
  const [loading, setLoading]           = useState(true);
  const [query, setQuery]               = useState("");
  const queueRef    = useRef<number[]>([]);
  const queuePosRef = useRef(0);
  const allPlayersRef = useRef<Player[]>([]); // stable ref so timer never restarts
  const [showingBack, setShowingBack]   = useState(false);
  const [visiblePlayers, setVisiblePlayers] = useState<Player[]>([]);
  const [searchResults, setSearchResults]   = useState<Player[]>([]);
  const [showSearch, setShowSearch]         = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Role definitions for the guide
  const roleGuide = [
    { label: "Carry", icon: "/icons/pos_1.png", description: "Position 1" },
    { label: "Mid", icon: "/icons/pos_2.png", description: "Position 2" },
    { label: "Offlane", icon: "/icons/pos_3.png", description: "Position 3" },
    { label: "Soft Support", icon: "/icons/pos_4.png", description: "Position 4" },
    { label: "Hard Support", icon: "/icons/pos_5.png", description: "Position 5" },
  ];

  // Medal definitions for the guide
  const medalGuide = [
    { label: "Herald", medal: "Herald_5" },
    { label: "Guardian", medal: "Guardian_5" },
    { label: "Crusader", medal: "Crusader_5" },
    { label: "Archon", medal: "Archon_5" },
    { label: "Legend", medal: "Legend_5" },
    { label: "Ancient", medal: "Ancient_5" },
    { label: "Divine", medal: "Divine_5" },
    { label: "Immortal", medal: "Immortal" },
  ];

  useEffect(() => {
    PlayerService.getAllPlayers()
      .then(data => {
        const mapped = data.map(mapDatabasePlayerToFrontend);
        setAllPlayers(mapped);
        allPlayersRef.current = mapped;
        queueRef.current = shuffleArray(mapped.map((_, i) => i));
        queuePosRef.current = 0;
        const first8 = queueRef.current.slice(0, CARDS).map(i => mapped[i]);
        queuePosRef.current = CARDS;
        setVisiblePlayers(first8);
      })
      .catch(() => setAllPlayers([]))
      .finally(() => setLoading(false));
  }, []);

  // getNext8 reads from the stable ref — never changes identity
  const getNext8 = useCallback(() => {
    const players = allPlayersRef.current;
    if (!players.length) return [];
    const result: Player[] = [];
    for (let i = 0; i < CARDS; i++) {
      if (queuePosRef.current >= queueRef.current.length) {
        queueRef.current = shuffleArray(players.map((_, idx) => idx));
        queuePosRef.current = 0;
      }
      result.push(players[queueRef.current[queuePosRef.current++]]);
    }
    return result;
  }, []);

  // scheduleNext is stable: show front SHOW_MS → flip back → swap cards → flip front → repeat
  const scheduleNext = useCallback(() => {
    timerRef.current = setTimeout(() => {
      setShowingBack(true);
      setTimeout(() => setVisiblePlayers(getNext8()), 650); // swap mid-flip
      setTimeout(() => {
        setShowingBack(false);
        scheduleNext(); // chain next cycle
      }, BACK_MS);
    }, SHOW_MS);
  }, [getNext8]);

  useEffect(() => {
    if (loading || !allPlayers.length || showSearch) return;
    scheduleNext();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  // only restart when these truly change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, allPlayers.length, showSearch]);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setShowSearch(false); setSearchResults([]); return; }
    setShowSearch(true);
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    setSearchResults(allPlayers.filter(p => p.nickname.toLowerCase().includes(q)));
  }, [query, allPlayers]);

  const displayed = showSearch ? searchResults.slice(0, CARDS) : visiblePlayers;

  return (
    <>
      {/* BG */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/22.png)" }} />
        <div className="absolute inset-0" style={{ background: "rgba(4,8,16,0.78)" }} />
      </div>

      {/* ── Layout: fixed region between navbar and footer ── */}
      <div style={{
        position: "fixed",
        top: "80px",
        left: 0, right: 0,
        bottom: "100px",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "14px 12px 10px",
        overflowY: "auto",
        overflowX: "hidden",
      }}>
        <div style={{
          width: "100%",
          maxWidth: 1400,
          minHeight: "100%",
          display: "flex",
          flexDirection: "row",
          gap: 10,
          alignItems: "flex-start",
        }}>
          {/* Left Side - Roles guide */}
          <div style={{ 
            flexShrink: 0, 
            width: 150,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}>
            {/* Spacer to align with cards below search */}
            <div style={{ height: 48 }} />
            
            <div style={{ 
              background: "rgba(12,8,4,0.85)",
              border: `1px solid ${C.goldBorder}`,
              borderRadius: 12,
              padding: "12px",
              backdropFilter: "blur(14px)",
              boxShadow: "0 2px 14px rgba(20, 7, 7, 0.4)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}>
              {/* Roles Section */}
              <div className="flex flex-col gap-3">
                <span style={{ 
                  color: C.gold, 
                  fontSize: 12, 
                  fontWeight: 700, 
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  textAlign: "center",
                  paddingBottom: 8,
                  borderBottom: `1px solid ${C.goldBorder}`,
                }}>
                  Roles
                </span>
                
                {roleGuide.map((role, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-1.5 rounded-lg transition-all"
                    style={{
                      background: "transparent",
                      border: `1px solid ${C.goldBorder}`,
                      cursor: "default",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = C.goldFaint;
                      e.currentTarget.style.borderColor = C.goldDim;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = C.goldBorder;
                    }}>
                    <div className="flex items-center justify-center w-7 h-7 rounded flex-shrink-0"
                      style={{ 
                        background: C.goldFaint,
                        border: `1px solid ${C.goldBorder}`,
                      }}>
                      <img 
                        src={role.icon} 
                        alt={role.label}
                        className="object-contain"
                        style={{ opacity: 0.9, width: 18, height: 18 }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                    <span style={{ 
                      color: C.text, 
                      fontSize: 10, 
                      fontWeight: 700,
                      lineHeight: 1.2,
                    }}>
                      {role.label}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Center - Main Content Area */}
          <div style={{
            flex: 1,
            minWidth: 0,
            minHeight: "calc(100vh - 220px)",
            display: "flex", 
            flexDirection: "column", 
            gap: 10,
          }}>
          <div style={{ position: "relative", zIndex: 20, flexShrink: 0 }}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: C.gold }} />
              <input
                value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search players…"
                className="w-full pl-11 pr-10 py-2.5 rounded-xl text-sm focus:outline-none"
                style={{
                  background: "linear-gradient(135deg, rgba(20,14,8,0.95) 0%, rgba(28,20,10,0.95) 100%)",
                  border: `2px solid ${C.goldBorder}`,
                  color: C.text, 
                  caretColor: C.gold,
                  backdropFilter: "blur(16px)",
                  boxShadow: `0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(212,168,71,0.1)`,
                  transition: "all 0.3s ease",
                }}
                onFocus={e => {
                  e.target.style.borderColor = C.gold;
                  e.target.style.boxShadow = `0 0 0 3px ${C.goldFaint}, 0 6px 24px rgba(212,168,71,0.2), inset 0 1px 0 rgba(212,168,71,0.2)`;
                  e.target.style.background = "linear-gradient(135deg, rgba(28,20,10,0.98) 0%, rgba(36,26,12,0.98) 100%)";
                }}
                onBlur={e => {
                  e.target.style.borderColor = C.goldBorder;
                  e.target.style.boxShadow = `0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(212,168,71,0.1)`;
                  e.target.style.background = "linear-gradient(135deg, rgba(20,14,8,0.95) 0%, rgba(28,20,10,0.95) 100%)";
                }}
              />
              <AnimatePresence>
                {query && (
                  <motion.button initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    onClick={() => setQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full"
                    style={{ color: C.goldDim }}>
                    <X className="w-3.5 h-3.5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            <AnimatePresence>
              {showSearch && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex justify-center mt-1.5">
                  <span className="text-[10px] font-semibold px-3 py-0.5 rounded-full"
                    style={{ background: C.goldFaint, border: `1px solid ${C.goldBorder}`, color: C.gold }}>
                    {searchResults.length} found{searchResults.length > CARDS ? ` · first ${CARDS} shown` : ""}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Card grid */}
          <div style={{ flex: 1, minHeight: "min(60vw, 460px)", overflow: "hidden" }}>
            <style>{`
              .card-grid {
                display: grid;
                gap: 8px;
                height: 100%;
                min-height: min(60vw, 460px);
                grid-template-columns: repeat(2, 1fr);
                grid-template-rows: repeat(4, 1fr);
              }
              @media (min-width: 600px) {
                .card-grid {
                  grid-template-columns: repeat(4, 1fr);
                  grid-template-rows: repeat(2, 1fr);
                }
              }
            `}</style>
            {loading ? (
              <>
                <div className="card-grid">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="rounded-xl animate-pulse"
                      style={{ background: C.goldFaint, border: `1px solid ${C.goldBorder}` }} />
                  ))}
                </div>
              </>
            ) : showSearch && !searchResults.length ? (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <p style={{ color: C.textDim }} className="text-sm">No players found</p>
                <button onClick={() => setQuery("")} className="text-xs px-3 py-1.5 rounded-lg"
                  style={{ background: C.goldFaint, border: `1px solid ${C.goldBorder}`, color: C.gold }}>
                  Clear search
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="card-grid"
              >
                {displayed.map((player, i) => (
                  <FlipCard key={`${player.id}-${i}`} player={player}
                    showingBack={showSearch ? false : showingBack} delay={i * 0.04} slot={i} />
                ))}
                {Array.from({ length: CARDS - displayed.length }).map((_, i) => (
                  <div key={`e-${i}`} className="rounded-xl"
                    style={{ background: "rgba(12,8,4,0.3)", border: `1px solid rgba(212,168,71,0.06)` }} />
                ))}
              </motion.div>
            )}
          </div>

          </div>

          {/* Right Side - Medals guide */}
          <div style={{ 
            flexShrink: 0, 
            width: 150,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}>
            {/* Spacer to align with cards below search */}
            <div style={{ height: 48 }} />
            
            <div style={{ 
              background: "rgba(12,8,4,0.85)",
              border: `1px solid ${C.goldBorder}`,
              borderRadius: 12,
              padding: "12px",
              backdropFilter: "blur(14px)",
              boxShadow: "0 2px 14px rgba(0,0,0,0.4)",
            }}>
              <div className="flex flex-col gap-3">
                <span style={{ 
                  color: C.gold, 
                  fontSize: 12, 
                  fontWeight: 700, 
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  textAlign: "center",
                  paddingBottom: 8,
                  borderBottom: `1px solid ${C.goldBorder}`,
                }}>
                  Medals
                </span>
                
                {medalGuide.map((medal, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-1.5 rounded-lg transition-all"
                    style={{
                      background: "transparent",
                      border: `1px solid ${C.goldBorder}`,
                      cursor: "default",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = C.goldFaint;
                      e.currentTarget.style.borderColor = C.goldDim;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = C.goldBorder;
                    }}>
                    <div className="flex items-center justify-center w-7 h-7 flex-shrink-0">
                      <img 
                        src={`/medals/${medal.medal}.png`}
                        alt={medal.label}
                        className="w-7 h-7 object-contain"
                        style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.6))" }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                    <span style={{ 
                      color: C.text, 
                      fontSize: 10, 
                      fontWeight: 700,
                      lineHeight: 1.2,
                    }}>
                      {medal.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
