import { useRef, useEffect, useState } from "react";
import { useToast } from "../hooks/useToast";
import ToastContainer from "../components/ui/ToastContainer";
import MessageModal from "../components/ui/MessageModal";
import adminService from "../services/adminService";
import { Github, Twitch, MessageSquare } from "lucide-react";

/* ─── palette ─────────────────────────────────────────── */
const G = {
  gold:        "#d4a847",
  goldDim:     "rgba(212,168,71,0.55)",
  goldFaint:   "rgba(212,168,71,0.10)",
  goldBorder:  "rgba(212,168,71,0.20)",
  blue:        "#4f8ef7",
  blueDim:     "rgba(79,142,247,0.55)",
  blueFaint:   "rgba(79,142,247,0.08)",
  blueBorder:  "rgba(79,142,247,0.20)",
  violet:      "#a78bfa",
  violetDim:   "rgba(167,139,250,0.55)",
  violetFaint: "rgba(167,139,250,0.08)",
  violetBorder:"rgba(167,139,250,0.18)",
  bg:          "#08060c",
  card:        "rgba(14,10,20,0.92)",
  text:        "#e8dfc0",
  textDim:     "#6a5e48",
};

/* ─── eye phases ──────────────────────────────────────── */
const EYE_PHASES = [
  { id: 0, src: "/avatars/eye1.png", sound: "/avatars/eye1.mp3", glowColor: "#FF0000" },
  { id: 1, src: "/avatars/eye2.png", sound: "/avatars/eye2.mp3", glowColor: "#FF2222" },
  { id: 2, src: "/avatars/eye3.png", sound: "/avatars/eye3.mp3", glowColor: "#FF4444" },
  { id: 3, src: "/avatars/eye4.png", sound: "/avatars/eye4.mp3", glowColor: "#FF6666" },
  { id: 4, src: "/avatars/eye5.png", sound: "/avatars/eye5.mp3", glowColor: "#FFBCD6" },
] as const;

/* ─── types ───────────────────────────────────────────── */
type Member = {
  name: string; realName?: string; role: string; bio: string;
  image: string; tag?: string; isSpecial?: boolean; nameColor?: string;
  githubUrl?: string; twitch?: string;
};

/* ─── founder (static) ────────────────────────────────── */
const founder: Member = {
  name: "Reyuk", realName: "Keyur Sankhe", role: "Founder",
  tag: "Vision & Direction",
  bio: "Founder of TRR. Oversees tournaments, systems, and structure.",
  image: "/avatars/admins/Reyuk.png", nameColor: "#FF6B35",
};

/* ─── eye badge ───────────────────────────────────────── */
function SpecialEyeBadge({ onClick, onMouseEnter, onMouseLeave, currentPhase = 0 }:
  { onClick?: () => void; onMouseEnter?: () => void; onMouseLeave?: () => void; currentPhase?: number }) {
  const eye = EYE_PHASES[currentPhase];
  return (
    <div className="absolute top-3 left-3 z-10"
      onClick={e => { e.stopPropagation(); onClick?.(); }}
      onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}
      style={{ cursor: "pointer", width: 44, height: 44,
        filter: `drop-shadow(0 0 12px ${eye.glowColor})`,
        animation: "eyeSpin 8s linear infinite, eyePulse 2s ease-in-out infinite" }}>
      <img src={eye.src} alt="eye" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </div>
  );
}

/* ─── card ────────────────────────────────────────────── */
function AdminCard({ m, accent, accentFaint: _accentFaint, accentBorder, index = 0,
  onEyeClick, onEyeHover, onEyeLeave, currentPhase = 0, onMessageClick, large = false }:
  { m: Member; accent: string; accentFaint: string; accentBorder: string;
    index?: number; large?: boolean; currentPhase?: number;
    onEyeClick?: () => void; onEyeHover?: () => void;
    onEyeLeave?: () => void; onMessageClick?: () => void; }) {
  const [hovered, setHovered] = useState(false);
  const col = m.nameColor || accent;

  const W  = large ? 170 : 138;
  const imgRatio = large ? "88%" : "92%";
  const nameSz   = large ? 14 : 12;
  const bioSz    = 9;
  const padX     = large ? 10 : 9;
  const padY     = large ? 10 : 8;

  return (
    <article
      style={{
        position: "relative", borderRadius: 12, overflow: "hidden",
        background: G.card,
        border: `1.5px solid ${hovered ? col + "88" : accentBorder}`,
        boxShadow: hovered
          ? `0 0 28px ${col}28, 0 6px 20px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.04)`
          : `0 3px 14px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.02)`,
        transform: hovered ? "translateY(-4px) scale(1.02)" : "translateY(0) scale(1)",
        transition: "all 0.25s ease",
        width: W, flexShrink: 0,
        animation: `adminFadeIn 0.5s ease-out backwards ${index * 0.06}s`,
        backdropFilter: "blur(10px)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* top accent bar */}
      <div style={{ height: 2,
        background: `linear-gradient(90deg, transparent, ${col} 40%, ${col} 60%, transparent)`,
        opacity: hovered ? 1 : 0.55, transition: "opacity 0.25s" }} />

      {/* image */}
      <div style={{ position: "relative", paddingTop: imgRatio,
        background: `radial-gradient(ellipse at 50% 0%, ${col}14 0%, ${G.bg} 70%)` }}>
        <img src={m.image} alt={m.name}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "top center",
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.4s ease",
            filter: hovered ? "brightness(1.08)" : "brightness(0.92)" }}
          onError={e => {
            (e.currentTarget as HTMLImageElement).src =
              `https://ui-avatars.com/api/?name=${encodeURIComponent(m.realName || m.name)}&background=1a1020&color=d4a847&size=300&bold=true`;
          }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
          background: "linear-gradient(to top, rgba(14,10,20,0.97) 0%, transparent 100%)",
          pointerEvents: "none" }} />
        {m.isSpecial && (
          <SpecialEyeBadge onClick={onEyeClick} onMouseEnter={onEyeHover}
            onMouseLeave={onEyeLeave} currentPhase={currentPhase} />
        )}
      </div>

      {/* content */}
      <div style={{ padding: `${padY}px ${padX}px ${padY + 2}px`,
        display: "flex", flexDirection: "column", gap: 4 }}>

        {/* role tag */}
        <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em",
          textTransform: "uppercase", color: col, opacity: 0.75 }}>
          {m.tag ?? m.role}
        </div>

        {/* name + links */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
          <h3 style={{ fontSize: nameSz, fontWeight: 800, color: col,
            textShadow: hovered ? `0 0 12px ${col}77` : "none",
            transition: "text-shadow 0.25s", lineHeight: 1, margin: 0 }}>
            {m.name}
          </h3>
          {m.githubUrl && (
            <a href={m.githubUrl} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ display: "flex", alignItems: "center", justifyContent: "center",
                width: 18, height: 18, borderRadius: "50%",
                background: "rgba(255,255,255,0.07)", border: `1px solid ${col}2a`, flexShrink: 0 }}>
              <Github style={{ width: 9, height: 9, color: col }} />
            </a>
          )}
          {m.twitch && (
            <a href={m.twitch} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ display: "flex", alignItems: "center", justifyContent: "center",
                width: 18, height: 18, borderRadius: "50%",
                background: "rgba(255,255,255,0.07)", border: `1px solid ${col}2a`, flexShrink: 0 }}>
              <Twitch style={{ width: 9, height: 9, color: col }} />
            </a>
          )}
        </div>

        {m.realName && (
          <p style={{ fontSize: 8.5, color: G.textDim, fontStyle: "italic", margin: 0, lineHeight: 1 }}>
            {m.realName}
          </p>
        )}

        <p style={{ fontSize: bioSz, color: "rgba(232,223,192,0.65)", lineHeight: 1.45,
          margin: 0, display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {m.bio}
        </p>

        {/* divider */}
        <div style={{ height: 1,
          background: `linear-gradient(90deg, transparent, ${col}2a, transparent)` }} />

        {/* message button */}
        <button onClick={e => { e.stopPropagation(); onMessageClick?.(); }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            padding: "5px 0", borderRadius: 6, cursor: "pointer",
            background: hovered ? `${col}14` : "rgba(255,255,255,0.03)",
            border: `1px solid ${col}33`,
            color: col, fontSize: 8.5, fontWeight: 700,
            letterSpacing: "0.07em", textTransform: "uppercase",
            transition: "all 0.2s" }}>
          <MessageSquare style={{ width: 9, height: 9 }} />
          Message
        </button>
      </div>
    </article>
  );
}

/* ─── section header ─────────────────────────────────── */
function SectionHeader({ label, accent }: { label: string; accent: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
      <div style={{ flex: 1, height: 1,
        background: `linear-gradient(90deg, transparent, ${accent}44)` }} />
      <h2 style={{ fontSize: 11, fontWeight: 800,
        letterSpacing: "0.22em", textTransform: "uppercase", color: accent,
        textShadow: `0 0 14px ${accent}55`, margin: 0, whiteSpace: "nowrap" }}>
        {label}
      </h2>
      <div style={{ flex: 1, height: 1,
        background: `linear-gradient(90deg, ${accent}44, transparent)` }} />
    </div>
  );
}

/* ─── page ────────────────────────────────────────────── */
export default function AdminsPage() {
  const [currentEyePhase, setCurrentEyePhase]   = useState(0);
  const [isEyeHovered, setIsEyeHovered]           = useState(false);
  const [admins,      setAdmins]                  = useState<Member[]>([]);
  const [miniAdmins,  setMiniAdmins]              = useState<Member[]>([]);
  const [messageModal, setMessageModal] = useState<{ isOpen: boolean; adminName: string; adminDisplayName: string }>
    ({ isOpen: false, adminName: "", adminDisplayName: "" });
  const { toasts, error, removeToast } = useToast();
  const timeoutRef = useRef<number | null>(null);
  const audioRef   = useRef<HTMLAudioElement | null>(null);
  const currentEye = EYE_PHASES[currentEyePhase];

  useEffect(() => {
    const load = async () => {
      try {
        const dbAdmins = await adminService.getAdmins();
        const active   = dbAdmins.filter(a => a.isActive);
        const aList: Member[] = [], mList: Member[] = [];

        active.forEach(admin => {
          if (admin.username === "reyuk") return;
          const m: Member = {
            name: admin.displayName, realName: admin.realName || undefined,
            role: admin.role === "Founder" ? "Admin" : admin.role === "Admin" ? "Admin" : "Mini Admin",
            bio: admin.description || "TRR Team Member",
            image: admin.avatarUrl || `/avatars/admins/${admin.username}.jpg`,
            tag: admin.role === "Founder" ? "Admin" : admin.role,
            nameColor: (admin.role === "Admin" || admin.role === "Founder") ? G.blue : G.violet,
            isSpecial: admin.username === "nikhil" || admin.username === "n1khil",
            githubUrl: admin.githubUrl, twitch: admin.twitchUrl,
          };
          (admin.role === "Admin" || admin.role === "Founder") ? aList.push(m) : mList.push(m);
        });

        const fixedOrder: Record<string, number> = {
          r3ciprocal: 1, godspeed: 2, nikhil: 3, n1khil: 3, machine: 4,
          frost: 5, banner: 6, insanekid: 7, fatty: 8, scripter: 9,
          havok4evr: 10, havok: 10,
        };
        const sort = (a: Member, b: Member) => {
          const ua = dbAdmins.find(d => d.displayName === a.name)?.username.toLowerCase() || "";
          const ub = dbAdmins.find(d => d.displayName === b.name)?.username.toLowerCase() || "";
          const oa = fixedOrder[ua] ?? 9999, ob = fixedOrder[ub] ?? 9999;
          if (oa !== ob) return oa - ob;
          const da = dbAdmins.find(d => d.displayName === a.name)?.createdAt || "";
          const db2 = dbAdmins.find(d => d.displayName === b.name)?.createdAt || "";
          return new Date(da).getTime() - new Date(db2).getTime();
        };
        aList.sort(sort); mList.sort(sort);
        setAdmins(aList); setMiniAdmins(mList);
      } catch { error("Failed to load admin data"); }
    };
    load();
    const sub = adminService.subscribeToAdmins(load);
    return () => {
      sub.unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const playSound = (path: string) => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    const a = new Audio(path);
    a.volume = currentEyePhase >= 3 ? 0.5 : 0.8;
    audioRef.current = a;
    a.play().catch(() => {});
  };

  const handleEyeClick = () => {
    playSound(currentEye.sound);
    setCurrentEyePhase(p => (p + 1) >= EYE_PHASES.length ? 0 : p + 1);
  };

  useEffect(() => {
    if (currentEyePhase === EYE_PHASES.length - 1) {
      timeoutRef.current = window.setTimeout(() => setCurrentEyePhase(0), 30000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentEyePhase]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const openMsg  = (name: string) => setMessageModal({ isOpen: true, adminName: name.toLowerCase(), adminDisplayName: name });
  const closeMsg = () => setMessageModal({ isOpen: false, adminName: "", adminDisplayName: "" });

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <MessageModal isOpen={messageModal.isOpen} onClose={closeMsg}
        adminName={messageModal.adminName} adminDisplayName={messageModal.adminDisplayName} />

      {/* background */}
      <div className="fixed inset-0 z-0" style={{
        background: `
          radial-gradient(ellipse at 20% 10%, rgba(212,168,71,0.04) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 80%, rgba(79,142,247,0.04) 0%, transparent 50%),
          linear-gradient(180deg, #08060c 0%, #0d0a18 100%)
        `}} />
      {/* subtle grid */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(212,168,71,0.02) 59px, rgba(212,168,71,0.02) 60px),
                          repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(212,168,71,0.02) 59px, rgba(212,168,71,0.02) 60px)`,
      }} />

      {/* eye hover bloom */}
      {isEyeHovered && (
        <div className="fixed inset-0 z-40 pointer-events-none" style={{
          background: `radial-gradient(circle at 20% 10%, ${currentEye.glowColor}88 0%, transparent 40%)`,
          filter: "blur(80px)", opacity: 0.25, mixBlendMode: "screen" }} />
      )}

      <main className="relative z-10 pt-20 pb-10">
        <div className="max-w-[1300px] mx-auto px-6">

          {/* ── page title ── */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <p style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase",
              color: G.goldDim, fontWeight: 700, marginBottom: 6 }}>
              The Roshan Rumble
            </p>
            <h1 style={{ fontSize: "clamp(20px, 3.5vw, 30px)", fontWeight: 900, color: G.gold,
              letterSpacing: "0.1em", textShadow: `0 0 28px ${G.gold}33`, margin: 0, lineHeight: 1 }}>
              TEAM
            </h1>
            <div style={{ height: 2, width: 50, margin: "10px auto 0",
              background: `linear-gradient(90deg, transparent, ${G.gold}, transparent)` }} />
          </div>

          {/* ── FOUNDER ── */}
          <section style={{ marginBottom: 28 }}>
            <SectionHeader label="Founder" accent={G.gold} />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <AdminCard m={founder} accent={G.gold} accentFaint={G.goldFaint}
                accentBorder={G.goldBorder} index={0} large
                onMessageClick={() => openMsg(founder.name)} />
            </div>
          </section>

          {/* ── ADMINS ── */}
          {admins.length > 0 && (
            <section style={{ marginBottom: 28 }}>
              <SectionHeader label="Admins" accent={G.blue} />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12,
                justifyContent: "center" }}>
                {admins.map((a, i) => (
                  <AdminCard key={a.name} m={a} accent={G.blue}
                    accentFaint={G.blueFaint} accentBorder={G.blueBorder}
                    index={1 + i}
                    onEyeClick={handleEyeClick}
                    onEyeHover={() => setIsEyeHovered(true)}
                    onEyeLeave={() => setIsEyeHovered(false)}
                    currentPhase={currentEyePhase}
                    onMessageClick={() => openMsg(a.name)} />
                ))}
              </div>
            </section>
          )}

          {/* ── MINI ADMINS ── */}
          {miniAdmins.length > 0 && (
            <section style={{ marginBottom: 16 }}>
              <SectionHeader label="Mini Admins" accent={G.violet} />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12,
                justifyContent: "center" }}>
                {miniAdmins.map((a, i) => (
                  <AdminCard key={a.name} m={a} accent={G.violet}
                    accentFaint={G.violetFaint} accentBorder={G.violetBorder}
                    index={admins.length + 1 + i}
                    onEyeClick={handleEyeClick}
                    onEyeHover={() => setIsEyeHovered(true)}
                    onEyeLeave={() => setIsEyeHovered(false)}
                    currentPhase={currentEyePhase}
                    onMessageClick={() => openMsg(a.name)} />
                ))}
              </div>
            </section>
          )}

        </div>
      </main>

      <style>{`
        @keyframes adminFadeIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        @keyframes eyeSpin  { to { transform: rotate(360deg); } }
        @keyframes eyePulse {
          0%,100% { filter: drop-shadow(0 0 12px currentColor); }
          50%     { filter: drop-shadow(0 0 24px currentColor) brightness(1.4); }
        }
      `}</style>
    </>
  );
}
