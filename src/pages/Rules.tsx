import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Users, Clock, Server, Trophy, AlertTriangle,
  Eye, MessageSquare, Ban, Video, Flag, UserCheck, X,
} from "lucide-react";

const sections = [
  {
    title: "Participation", icon: Users,
    items: [
      "Players must register using their highest MMR account and play all matches on it throughout the tournament.",
      "Captains are selected by TRR admins and participate in a live auction to build their teams.",
      "Each team gets a dedicated voice channel on TRR Discord — only the 5 active players are allowed in it.",
      "Voice channels are monitored by admins to ensure fair play.",
      "Players must communicate match availability in advance to their captain.",
      "75% attendance is required to be eligible for tournament prizes.",
      "Each match in any Bo3 Series counts as an individual game towards player attendance.",
    ],
    extras: ["Handicap matches will be permitted (e.g., 2v5, 3v5, 4v5)."],
  },
  {
    title: "Teams & Captains", icon: Shield,
    items: [
      "Each captain must appoint a vice-captain to manage the team in their absence.",
      "Captains are responsible for managing their roster and informing admins if a stand-in is needed.",
      "Captains should try to resolve minor issues internally before escalating.",
      "Concerns should be raised via !ticket <TeamName> <concern> in text channels.",
      "All match lobbies will be created by TRR admins.",
      "If you suspect a teammate is smurfing, report immediately to avoid full-team disqualification.",
    ],
  },
  {
    title: "Stand-ins", icon: UserCheck,
    items: [
      "Only 1 stand-in is allowed per match. More than 1 requires admin approval.",
      "All stand-ins will be provided by TRR admins.",
      "Teams must notify admins at least 2 days in advance if a stand-in is needed.",
      "Stand-ins must be within 300 MMR of the replaced player's registered auction MMR.",
      "Higher MMR stand-ins (beyond 300) require opposing captain approval with an admin present.",
      "Unauthorized stand-ins result in an automatic forfeit.",
    ],
    extras: [
      "Eliminated players may act as stand-ins.",
      "Active tournament players cannot be used as stand-ins.",
      "Repeated absence may result in a permanent stand-in replacement.",
    ],
  },
  {
    title: "Server Settings", icon: Server,
    items: [
      "The default server is SEA (Singapore).",
      "Switching servers (EU, India, Dubai, etc.) requires mutual agreement between both teams.",
      "Each player is responsible for confirming the selected server before the game starts.",
      "No server-related disputes will be entertained after the game starts.",
    ],
  },
  {
    title: "Match Rules & Format", icon: Trophy,
    items: [
      "All games are played in Captains Mode.",
      "Matches typically take place between 12 PM and 9 PM IST on weekends.",
      "Rescheduling requires explicit admin approval.",
      "The tournament follows a Double Elimination format — all teams start in the Upper Bracket.",
      "Group stage matches are Bo1 or Bo2; Playoffs and Grand Finals are Bo3.",
      "Top teams by points qualify for Playoffs.",
    ],
  },
  {
    title: "Punctuality & Penalties", icon: Clock,
    items: [
      "10 min late → Level 1: 30-second draft penalty.",
      "15 min late → Level 2: 70-second draft penalty.",
      "20 min late → Level 3: 110-second draft penalty.",
      "30 min late → Forfeit. Opposing team is awarded the win.",
      '"GG" should only be typed when your team intends to forfeit or end. Misuse may lead to penalties.',
    ],
    extras: [
      "15-minute rest between matches unless informed otherwise.",
      "Lobbies must include the official TRR tournament ticket.",
    ],
  },
  {
    title: "Conduct & Discipline", icon: AlertTriangle,
    items: [
      "Players must use non-offensive Steam names, bios, team names, and images.",
      "Post-match complaints regarding stand-ins or server issues will not be accepted.",
      "Toxic behaviour, scripting, cheating, griefing, or smurfing → immediate permanent disqualification.",
      "Admin decisions are final and non-negotiable.",
      "Abusive behaviour toward teammates or admins will result in warnings, penalties, or bans.",
    ],
  },
  {
    title: "Discord & Verification", icon: MessageSquare,
    items: [
      "All players must remain connected to their TRR team voice channel during matches.",
      "Microphones must be unmuted at all times while playing, unless permitted by admins.",
      "TRR admins may conduct random mic checks; failure to respond may result in penalties.",
      "Any player may be asked to screen-share during the match and must comply instantly.",
      "Players must use their official registered Discord ID during the match.",
    ],
  },
  {
    title: "Cheating & Investigations", icon: Eye,
    items: [
      "All smurf/cheat investigations are conducted only by TRR admins.",
      "Players must not pause the game for smurf or cheat suspicions.",
      "The game must continue unless an admin instructs a pause.",
      "False accusations or misuse of investigation claims will be penalised.",
      "Players found guilty of smurfing are banned from all current and future TRR events.",
    ],
  },
  {
    title: "Streaming Rules", icon: Video,
    items: [
      "Streams of TRR matches must have a 5-minute delay.",
      "Admins must be informed before the season starts if you plan to stream.",
      "Streams must clearly display the TRR logo.",
      "TRR reserves the right to feature or restream gameplay on official channels.",
    ],
  },
  {
    title: "Forfeit Rules", icon: Flag,
    items: [
      "If a team stops playing, their past results (wins/draws) remain.",
      "All upcoming matches for that team will be considered forfeited.",
      "Teams must inform admins before withdrawing.",
      "Forfeiting to give advantage to another team may lead to bans from future TRR seasons.",
    ],
  },
  {
    title: "Profile Standards", icon: Ban,
    items: [
      "NSFW, obscene, or inappropriate usernames are strictly not allowed.",
      "Profile pictures must not contain nudity, offensive symbols, or explicit imagery.",
      "Profiles violating this rule may be asked to change immediately.",
      "Failure to update an inappropriate profile can result in match disqualification or removal.",
      "Repeated violations may lead to bans from current and future TRR seasons.",
    ],
  },
];

const left = sections.slice(0, 6);
const right = sections.slice(6, 12);

interface RuleRowProps {
  section: typeof sections[0];
  index: number;
  activeIndex: number | null;
  onRowMouseEnter: (i: number) => void;
  onRowMouseLeave: () => void;
  onRowClick: (i: number) => void;
}

function RuleRow({ section, index, activeIndex, onRowMouseEnter, onRowMouseLeave, onRowClick }: RuleRowProps) {
  const Icon = section.icon;
  const isActive = activeIndex === index;
  const isDimmed = activeIndex !== null && !isActive;

  return (
    <motion.div
      animate={{ opacity: isDimmed ? 0.4 : 1 }}
      transition={{ duration: 0.18 }}
      onMouseEnter={() => onRowMouseEnter(index)}
      onMouseLeave={onRowMouseLeave}
      onClick={() => onRowClick(index)}
      className="flex items-center gap-3 py-2.5 px-4 rounded-xl cursor-pointer select-none"
      style={{
        background: isActive ? "rgba(30,22,5,0.95)" : "rgba(12,10,6,0.82)",
        border: isActive ? "1px solid rgba(251,191,36,0.65)" : "1px solid rgba(251,191,36,0.18)",
        backdropFilter: "blur(14px)",
        boxShadow: isActive
          ? "0 0 24px rgba(251,191,36,0.18), 0 2px 12px rgba(0,0,0,0.5)"
          : "0 1px 6px rgba(0,0,0,0.35)",
        transition: "background 0.18s, border-color 0.18s, box-shadow 0.18s",
      }}
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{
          background: isActive ? "rgba(251,191,36,0.22)" : "rgba(251,191,36,0.07)",
          border: isActive ? "1px solid rgba(251,191,36,0.5)" : "1px solid rgba(251,191,36,0.18)",
          transition: "background 0.18s, border-color 0.18s",
        }}
      >
        <Icon
          className="w-3.5 h-3.5"
          style={{
            color: isActive ? "#fde68a" : "rgba(251,191,36,0.55)",
            filter: isActive ? "drop-shadow(0 0 4px rgba(251,191,36,0.7))" : "none",
            transition: "color 0.18s, filter 0.18s",
          }}
        />
      </div>
      <span
        className="flex-1 text-[11px] font-bold uppercase tracking-wider"
        style={{ color: isActive ? "#fde68a" : "rgba(255,255,255,0.55)", transition: "color 0.18s" }}
      >
        {section.title}
      </span>
      <span
        className="text-sm flex-shrink-0"
        style={{
          color: isActive ? "rgba(251,191,36,0.8)" : "rgba(251,191,36,0.25)",
          transform: isActive ? "rotate(90deg)" : "rotate(0deg)",
          transition: "color 0.18s, transform 0.18s",
        }}
      >
        ›
      </span>
    </motion.div>
  );
}

export default function RulesPage() {
  const [panelIndex, setPanelIndex] = useState<number | null>(null);
  const [pinned, setPinned] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isOverRowRef = useRef(false);
  const isOverPanelRef = useRef(false);

  const cancelHide = useCallback(() => {
    if (hideTimerRef.current) { clearTimeout(hideTimerRef.current); hideTimerRef.current = null; }
  }, []);

  const scheduleHide = useCallback(() => {
    cancelHide();
    hideTimerRef.current = setTimeout(() => {
      if (!isOverRowRef.current && !isOverPanelRef.current) {
        setPinned(p => { if (!p) setPanelIndex(null); return p; });
      }
    }, 120);
  }, [cancelHide]);

  const handleRowMouseEnter = useCallback((i: number) => {
    cancelHide();
    isOverRowRef.current = true;
    if (!pinned) setPanelIndex(i);
  }, [cancelHide, pinned]);

  const handleRowMouseLeave = useCallback(() => {
    isOverRowRef.current = false;
    scheduleHide();
  }, [scheduleHide]);

  const handleRowClick = useCallback((i: number) => {
    cancelHide();
    setPanelIndex(i);
    setPinned(true);
  }, [cancelHide]);

  const handlePanelMouseEnter = useCallback(() => {
    cancelHide();
    isOverPanelRef.current = true;
  }, [cancelHide]);

  const handlePanelMouseLeave = useCallback(() => {
    isOverPanelRef.current = false;
    scheduleHide();
  }, [scheduleHide]);

  const closePanel = useCallback(() => {
    cancelHide();
    isOverPanelRef.current = false;
    isOverRowRef.current = false;
    setPanelIndex(null);
    setPinned(false);
  }, [cancelHide]);

  const panelSection = panelIndex !== null ? sections[panelIndex] : null;
  const PanelIcon = panelSection?.icon ?? null;

  return (
    <div className="fixed inset-0 top-16 overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/8.jpg')" }} />

      {/* Centered content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4" style={{ zIndex: 10 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
          className="text-center mb-5"
        >

          {/* Title */}
          <div className="relative inline-block">
            <h1 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase tracking-widest bg-gradient-to-r from-zinc-200 via-yellow-200 to-zinc-300 bg-clip-text text-transparent px-6 py-1">
              Tournament Rules
            </h1>
          </div>
          <div className="mt-2 w-20 h-px mx-auto" style={{
            background: "linear-gradient(90deg, transparent, rgba(251,191,36,0.55), transparent)",
          }} />
          {/* Hint text with dark pill */}
          <div className="inline-block mt-2 px-4 py-1.5 rounded-full"
            style={{
              background: 'rgba(0,0,0,0.72)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(251,191,36,0.45)',
              boxShadow: '0 0 10px rgba(251,191,36,0.12)',
            }}>
            <p className="text-[10px] font-semibold tracking-widest uppercase"
              style={{ color: '#fbbf24', textShadow: '0 0 8px rgba(251,191,36,0.5)' }}>
              ✦ Hover or click a rule to read details ✦
            </p>
          </div>
        </motion.div>

        {/* Two-column static list */}
        <div className="w-full max-w-3xl grid grid-cols-2 gap-x-4 gap-y-1.5">
          <div className="flex flex-col gap-1.5">
            {left.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.055, duration: 0.35 }}>
                <RuleRow section={s} index={i} activeIndex={panelIndex} onRowMouseEnter={handleRowMouseEnter} onRowMouseLeave={handleRowMouseLeave} onRowClick={handleRowClick} />
              </motion.div>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            {right.map((s, i) => {
              const idx = i + 6;
              return (
                <motion.div key={idx} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.055, duration: 0.35 }}>
                  <RuleRow section={s} index={idx} activeIndex={panelIndex} onRowMouseEnter={handleRowMouseEnter} onRowMouseLeave={handleRowMouseLeave} onRowClick={handleRowClick} />
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
          className="mt-4 text-center">
          <div className="inline-block px-5 py-2 rounded-full"
            style={{
              background: 'rgba(0,0,0,0.72)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(251,191,36,0.4)',
              boxShadow: '0 0 14px rgba(251,191,36,0.1)',
            }}>
            <p className="text-[10px] font-semibold tracking-[0.25em] uppercase"
              style={{ color: '#fcd34d', textShadow: '0 0 8px rgba(251,191,36,0.45)' }}>
              ⚔ Playing in the event means you agree to all rules listed above. ⚔
            </p>
          </div>
        </motion.div>
      </div>

      {/* Floating center panel */}
      <AnimatePresence>
        {panelSection && PanelIcon && panelIndex !== null && (
          <motion.div
            key={panelIndex}
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            onMouseEnter={handlePanelMouseEnter}
            onMouseLeave={handlePanelMouseLeave}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col"
            style={{ zIndex: 30, width: 420, maxHeight: "70vh" }}
          >
            <div className="rounded-2xl overflow-hidden flex flex-col w-full" style={{
              background: "rgba(10,12,18,0.97)",
              border: "1px solid rgba(251,191,36,0.38)",
              backdropFilter: "blur(28px)",
              boxShadow: "0 0 60px rgba(0,0,0,0.85), 0 0 28px rgba(251,191,36,0.1)",
              maxHeight: "70vh",
            }}>
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-3.5 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(251,191,36,0.14)", border: "1px solid rgba(251,191,36,0.38)" }}>
                  <PanelIcon className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-white font-black text-sm uppercase tracking-wide truncate">{panelSection.title}</h2>
                </div>
                <button onClick={closePanel}
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/40"
                  style={{ border: "1px solid rgba(255,255,255,0.1)" }} aria-label="Close">
                  <X className="w-3.5 h-3.5 text-white/45" />
                </button>
              </div>

              <div className="h-px flex-shrink-0" style={{ background: "linear-gradient(90deg, rgba(251,191,36,0.55), rgba(251,191,36,0.08) 60%, transparent)" }} />

              {/* Body */}
              <div className="overflow-y-auto px-5 py-4 flex-1" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(251,191,36,0.2) transparent" }}>
                <ul className="space-y-2">
                  {panelSection.items.map((item, i) => (
                    <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.035 }} className="flex items-start gap-2.5">
                      <span className="mt-[7px] w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#fbbf24" }} />
                      <span className="text-white/78 text-[13px] leading-relaxed">{item}</span>
                    </motion.li>
                  ))}
                </ul>
                {panelSection.extras && panelSection.extras.length > 0 && (
                  <div className="mt-4 pl-3 space-y-1.5" style={{ borderLeft: "2px solid rgba(251,191,36,0.22)" }}>
                    <p className="text-yellow-400/38 text-[9px] uppercase tracking-widest mb-2">Additional Notes</p>
                    {panelSection.extras.map((extra, i) => (
                      <p key={i} className="text-white/38 text-[12px] leading-relaxed italic">{extra}</p>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
