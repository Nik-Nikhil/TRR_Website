import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import TrophyCanvas from "../components/3d/TrophyCanvas";
import registrationService from "../services/registrationService";
import { supabase } from "../lib/supabase";
import SteamAuthService from "../services/steamAuth";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { checkAuthStatus } from "../store/authSlice";
import React from "react";

const BG = '/bg3.jpg';

// ── Season launch date ──
// Edit this to the real Season 7 launch date/time. Once tournamentSlice has
// a real field for this (e.g. `current.registrationOpensAt`), swap this
// constant for `useAppSelector((s) => s.tournament.current.registrationOpensAt)`.
const SEASON_LAUNCH_DATE = new Date("2026-09-01T00:00:00");

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState(() => targetDate.getTime() - Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(targetDate.getTime() - Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const clamped = Math.max(timeLeft, 0);
  return {
    days: Math.floor(clamped / (1000 * 60 * 60 * 24)),
    hours: Math.floor((clamped / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((clamped / (1000 * 60)) % 60),
    seconds: Math.floor((clamped / 1000) % 60),
    isDone: timeLeft <= 0,
  };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span
        className="text-white text-sm sm:text-base font-bold tabular-nums"
        style={{ fontFamily: "'Orbitron', sans-serif" }}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-white/40 text-[8px] uppercase tracking-[0.18em]" style={{ fontFamily: "'Inter', sans-serif" }}>
        {label}
      </span>
    </div>
  );
}

function SteamIcon() {
  return (
    <svg className="w-[17px] h-[17px] shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.606 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.455 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.252 0-2.265-1.014-2.265-2.265z" />
    </svg>
  );
}

export default function Home() {
  const [regEnabled, setRegEnabled] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const countdown = useCountdown(SEASON_LAUNCH_DATE);

  // Steam session comes from the auth slice instead of a local
  // `useState(SteamAuthService.getSession())` copy. `currentUser` when
  // `type === "player"` has the same nickname/avatarUrl/playerId/steamId
  // fields the old `steamSession` object had, so the JSX below is unchanged.
  const dispatch = useAppDispatch();
  const { currentUser, isLoggedIn } = useAppSelector((s) => s.auth);
  const steamSession = isLoggedIn && currentUser?.type === "player" ? currentUser : null;

  // Parallax state (mouse-driven)
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const targetRef = React.useRef({ x: 0, y: 0 });
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  // Re-check auth when page gains focus (e.g. after Steam callback).
  useEffect(() => {
    const onFocus = () => dispatch(checkAuthStatus());
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [dispatch]);

  useEffect(() => {
    const load = async () => {
      const [en] = await Promise.all([
        registrationService.isRegistrationEnabled(),
        registrationService.getRegistrationMessage(),
      ]);
      setRegEnabled(en);
    };
    load();
    const ch = registrationService.subscribeToChanges(s => {
      setRegEnabled(s.isEnabled);
    });
    window.addEventListener('registrationSettingsChanged', load);
    return () => { window.removeEventListener('registrationSettingsChanged', load); supabase.removeChannel(ch); };
  }, []);

  // Mouse-driven parallax (skip if user prefers reduced motion)
  useEffect(() => {
    if (prefersReducedMotion) return;

    const curr = { x: 0, y: 0 };

    const loop = () => {
      const tx = targetRef.current.x;
      const ty = targetRef.current.y;
      curr.x += (tx - curr.x) * 0.08;
      curr.y += (ty - curr.y) * 0.08;
      setParallax({ x: curr.x, y: curr.y });
      rafRef.current = requestAnimationFrame(loop);
    };

    const handleMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      // normalized -1..1
      const nx = (e.clientX - cx) / rect.width * 2;
      const ny = (e.clientY - cy) / rect.height * 2;
      // scale target movement
      targetRef.current.x = nx * 18; // px
      targetRef.current.y = ny * 12; // px
    };

    window.addEventListener('mousemove', handleMove);
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [prefersReducedMotion]);

  const anim = (delay = 0, y = 16) => prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay } }
    : { initial: { opacity: 0, y }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay } };

  return (
    <div className="relative w-full min-h-screen mt-16 lg:mt-0 lg:fixed lg:inset-0 lg:top-16 overflow-hidden bg-[#04060a]">

      {/* ── BG IMAGE ── */}
      <div
        ref={containerRef}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${BG}')`,
          transform: `translate3d(${parallax.x * 0.15}px, ${parallax.y * 0.12}px, 0) scale(1.02)`,
          transition: prefersReducedMotion ? undefined : 'transform 0.08s linear',
        }}
      />

      {/* ── OVERLAYS ── */}
      {/* top fade so header blends */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to bottom, rgba(4,6,10,0.82) 0%, rgba(4,6,10,0.0) 22%, rgba(4,6,10,0.0) 48%, rgba(4,6,10,0.72) 70%, rgba(4,6,10,0.88) 100%)',
      }} />

      {/* ── TRR ESPORTS — top-center, tight to the nav ── */}
      <motion.div
        {...anim(0, -10)}
        className="absolute top-[3%] left-1/2 -translate-x-1/2 flex flex-col items-center text-center pointer-events-none"
        style={{ zIndex: 20 }}
      >
        {/* Logo image — replaces eyebrow + wordmark */}
        <img
          src="/trresport.png"
          alt="TRR Esports"
          className="w-60 lg:w-80 select-none"
          style={{ filter: 'drop-shadow(0 4px 40px rgba(0,0,0,0.75))' }}
        />
      </motion.div>

      {/* ── AEGIS — between mountain peaks ── */}
      <motion.div
        {...anim(0.15, 0)}
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ top: '32%', zIndex: 10, transform: `translate3d(${parallax.x * 0.28}px, ${parallax.y * 0.18}px, 0)` }}
      >
        <div className="w-40 h-40 lg:w-56 lg:h-56">
          <TrophyCanvas />
        </div>
      </motion.div>

      {/* ── CTA — single smart button ── */}
      <motion.div
        {...anim(0.3, 12)}
        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5"
        style={{ top: '60%', zIndex: 20, width: 260, transform: `translate3d(${parallax.x * 0.22}px, ${parallax.y * 0.14}px, 0)` }}
      >
        {steamSession ? (
          /* ── LOGGED IN STATE ── */
          <>
            {/* Avatar + name row */}
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl w-full"
              style={{ background: 'rgba(8,16,28,0.90)', border: '1px solid rgba(102,192,244,0.25)' }}>
                <img
                src={steamSession.avatarUrl}
                alt={steamSession.nickname}
                className="w-8 h-8 rounded-full object-cover shrink-0 border border-sky-400/30"
              />
              <div className="min-w-0 flex-1">
                <p className="text-white text-xs font-semibold truncate" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {steamSession.nickname}
                </p>
                <p className="text-sky-400/70 text-[10px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Signed in via Steam
                </p>
              </div>
              <Link to={`/players/${steamSession.playerId}`}
                className="text-sky-400 text-[10px] font-semibold hover:text-sky-300 transition-colors shrink-0"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                Profile →
              </Link>
            </div>

            {/* Register button if enabled */}
            {regEnabled && (
              <Link
                to="/register"
                className="w-full flex items-center justify-center gap-2 rounded-xl hover:brightness-110 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60"
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.68rem',
                  letterSpacing: '0.08em',
                  color: '#fff',
                  padding: '11px 20px',
                  background: 'linear-gradient(135deg, #f5960a 0%, #e8820c 50%, #d4700a 100%)',
                  boxShadow: '0 0 28px rgba(232,130,12,0.5), inset 0 1px 0 rgba(255,220,120,0.3)',
                  whiteSpace: 'nowrap',
                }}>
                ✦ Register — Season <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900 }}>7</span>
              </Link>
            )}
          </>
        ) : (
          /* ── NOT LOGGED IN — single Steam CTA ── */
          <>
            <motion.div
              animate={prefersReducedMotion ? undefined : { y: [0, -6, 0] }}
              transition={prefersReducedMotion ? undefined : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-full"
            >
              <button
              onClick={() => SteamAuthService.initiateLogin()}
              className="w-full flex items-center justify-center gap-3 rounded-2xl font-bold text-[14px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#66c0f4]/60"
              style={{
                fontFamily: "'Inter', sans-serif",
                padding: '14px 24px',
                background: 'linear-gradient(180deg, #2a475e 0%, #1b2838 60%, #171a21 100%)',
                border: '1.5px solid #66c0f4',
                color: '#c6d4df',
                boxShadow: '0 0 36px rgba(102,192,244,0.35), 0 4px 24px rgba(0,0,0,0.75), inset 0 1px 0 rgba(102,192,244,0.12)',
                whiteSpace: 'nowrap',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'linear-gradient(180deg, #3d6680 0%, #243f55 60%, #1b2838 100%)';
                e.currentTarget.style.borderColor = '#a4cce0';
                e.currentTarget.style.color = '#e8f4ff';
                e.currentTarget.style.boxShadow = '0 0 50px rgba(102,192,244,0.55), 0 4px 24px rgba(0,0,0,0.75), inset 0 1px 0 rgba(102,192,244,0.2)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'linear-gradient(180deg, #2a475e 0%, #1b2838 60%, #171a21 100%)';
                e.currentTarget.style.borderColor = '#66c0f4';
                e.currentTarget.style.color = '#c6d4df';
                e.currentTarget.style.boxShadow = '0 0 36px rgba(102,192,244,0.35), 0 4px 24px rgba(0,0,0,0.75), inset 0 1px 0 rgba(102,192,244,0.12)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <SteamIcon />
              Sign in with Steam
              </button>
            </motion.div>
            {/* Readable hint — dark pill so it's always legible over any bg */}
            <div
              className="px-4 py-1.5 rounded-full text-center"
              style={{
                background: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <p className="text-white/80 text-[11px] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                Sign in to register or view your profile
              </p>
            </div>
          </>
        )}
      </motion.div>

      {/* ── SEASON COUNTDOWN — very bottom, replaces the old static text ── */}
      <motion.div
        {...anim(0.5, 0)}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none"
        style={{ zIndex: 20 }}
      >
        <p className="text-white/25 text-[9px] tracking-[0.45em] uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
          Season 7
        </p>
        {countdown.isDone ? (
          <p className="text-white/70 text-[10px] tracking-[0.3em] uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>
            Live Now
          </p>
        ) : (
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <CountdownUnit value={countdown.days} label="Days" />
            <span className="text-white/20 text-xs">:</span>
            <CountdownUnit value={countdown.hours} label="Hrs" />
            <span className="text-white/20 text-xs">:</span>
            <CountdownUnit value={countdown.minutes} label="Min" />
            <span className="text-white/20 text-xs">:</span>
            <CountdownUnit value={countdown.seconds} label="Sec" />
          </div>
        )}
      </motion.div>

    </div>
  );
}