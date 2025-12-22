// src/components/layout/Navbar.tsx
import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect, type ReactNode } from "react";
import { Menu, LayoutGrid, Medal, UsersRound, ScrollText } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

export default function Navbar() {
  const { pathname } = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const closeTimeout = useRef<number | null>(null);

const roshanBaseRef = useRef<HTMLAudioElement>(null)
const roshanLayerRef = useRef<HTMLAudioElement>(null)
const roshanCooldownRef = useRef(false)




  const handleLeave = () => {
    if (closeTimeout.current !== null) {
      window.clearTimeout(closeTimeout.current);
    }
    closeTimeout.current = window.setTimeout(() => {
      setMobileNavOpen(false);
      closeTimeout.current = null;
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (closeTimeout.current !== null) {
        window.clearTimeout(closeTimeout.current);
      }
    };
  }, []);

  return (
    <nav  
      className="fixed inset-x-0 top-0 z-50 w-full max-h-[10vh] backdrop-blur-[18px] border-b border-[rgba(192,192,192,0.25)] shadow-[0_18px_45px_rgba(0,0,0,0.7)]"
      style={{
        background:
          "radial-gradient(circle at 0% 0%, rgba(192,192,192,0.12), transparent 60%), radial-gradient(circle at 100% 100%, rgba(136,144,150,0.10), transparent 60%), rgba(5,7,10,0.92)",
      }}
    >
      {/* a bit closer to left edge */}
      <div className="w-full mx-0 pl-3 pr-3 sm:pl-6 sm:pr-4 md:pl-10 md:pr-6">
        <div className="h-[60px] md:h-[72px] grid grid-cols-[auto_1fr] items-center w-full">
          {/* Brand / Left side */}
         <Link
  to="/"
  className="flex items-center gap-2 sm:gap-3 no-underline group relative"
>

            {/* Logo + glow wrapper */}
<span
  className="relative w-12 h-12 md:w-15 md:h-15 flex items-center justify-center cursor-pointer"
  onClick={(e) => {
    e.preventDefault()
    e.stopPropagation()

    // ⏳ cooldown (2.5s)
    if (roshanCooldownRef.current) return
    roshanCooldownRef.current = true
    setTimeout(() => {
      roshanCooldownRef.current = false
    }, 2500)

    // 🎲 random roar
    const sounds = [roshanBaseRef.current, roshanLayerRef.current]
    const sound = sounds[Math.floor(Math.random() * sounds.length)]
    if (!sound) return

    sound.currentTime = 0
    sound.volume = 0.85
    sound.play()
  }}
>
  {/* 🔊 Local Roshan sounds */}
  <audio ref={roshanBaseRef} src="/audio/roshan_roar_1.mp3" preload="auto" />
  <audio ref={roshanLayerRef} src="/audio/roshan_roar_2.mp3" preload="auto" />

  {/* 🐲 Roshan Icon */}
  <img
    src="https://imagizer.imageshack.com/img924/886/ujUP42.png"
    alt="Roshan Icon"
    className="
      w-10 h-10 md:w-12 md:h-12
      object-contain
      scale-[1.35]

      brightness-[1.05]
      contrast-[1.25]
      saturate-[0.9]

      drop-shadow-[0_0_4px_rgba(0,0,0,0.7)]

      /* ✨ glow ONLY on icon hover */
      transition-transform
      duration-150 ease-out
      hover:scale-[1.45]
      hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]
    "
  />
</span>




            



            {/* === Text with SEASONS glow + moving light effect === */}
            <div className="flex flex-col">
  <h1 className="relative inline-block leading-none">
    <span
      className="
        text-[1.1rem] md:text-[1.35rem] font-extrabold tracking-tight text-transparent bg-clip-text
        bg-linear-to-r from-zinc-200 via-slate-100 to-white
        transition-all duration-400
        group-hover:bg-linear-to-r group-hover:from-[#D16500] group-hover:via-[#E4472F] group-hover:to-[#AF1D5D]
      "
    >
      The Roshan Rumble
    </span>


                {/* soft duplicate glow under text */}
                <span
  className="pointer-events-none absolute inset-0 text-[1.1rem] md:text-[1.35rem] font-extrabold tracking-tight blur-lg opacity-30
             transition-all duration-400
             text-zinc-300 group-hover:text-[#E4472F]"
  style={{ transform: "translate(-1px, -1px)" }}
>
  The Roshan Rumble
</span>


                {/* moving light sweep */}
                <motion.div
                  animate={{ x: [-40, 260], opacity: [0, 0.45, 0] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="pointer-events-none absolute -top-3 -left-12 w-28 h-20 bg-linear-to-r from-transparent via-zinc-300 to-transparent blur-2xl"
                />
              </h1>
            </div>
          </Link>

          {/* Hamburger for mobile */}
          <div className="flex md:hidden justify-end w-full">
            <button
              className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#D16500]"
              onClick={() => setMobileNavOpen((v) => !v)}
              aria-label="Open navigation menu"
            >
              <Menu className="w-7 h-7 text-gray-200" />
            </button>
          </div>

          {/* Middle + Right Sections */}
          <LayoutGroup id="navbar">
            <div className="hidden md:flex items-center justify-end gap-[2.4rem] w-full ">
              <NavItem
                to="/"
                icon={<LayoutGrid className="w-[18px] h-[18px]" />}
                label="Home"
                active={pathname === "/"}
              />
              <NavItem
                to="/rules"
                icon={<ScrollText className="w-[18px] h-[18px]" />}
                label="Rules"
                active={pathname.startsWith("/rules")}
              />
              <NavItem
                to="/seasons"
                icon={<Medal className="w-[18px] h-[18px]" />}
                label="Standings"
                active={pathname.startsWith("/seasons")}
              />
              <NavItem
                to="/players"
                icon={<UsersRound className="w-[18px] h-[18px]" />}
                label="Players"
                active={pathname.startsWith("/players")}
              />
            </div>

            {/* Mobile nav menu */}
            <AnimatePresence>
              {mobileNavOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute top-[60px] right-4 w-max bg-[rgba(5,7,10,0.98)] border border-[rgba(192,192,192,0.18)] shadow-lg z-999 flex flex-col md:hidden rounded-xl px-2 py-2"
                  onMouseLeave={handleLeave}
                >
                  <NavItem
                    to="/"
                    icon={<LayoutGrid className="w-[18px] h-[18px]" />}
                    label="Home"
                    active={pathname === "/"}
                  />
                  <NavItem
                    to="/rules"
                    icon={<ScrollText className="w-[18px] h-[18px]" />}
                    label="Rules"
                    active={pathname.startsWith("/rules")}
                  />
                  <NavItem
                    to="/seasons"
                    icon={<Medal className="w-[18px] h-[18px]" />}
                    label="Standings"
                    active={pathname.startsWith("/seasons")}
                  />
                  <NavItem
                    to="/players"
                    icon={<UsersRound className="w-[18px] h-[18px]" />}
                    label="Players"
                    active={pathname.startsWith("/players")}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </LayoutGroup>
        </div>
      </div>
    </nav>
  );
}

/* ================= Subcomponents ================= */

type NavItemProps = {
  to: string;
  icon: ReactNode;
  label: string;
  active: boolean;
};

function NavItem({ to, icon, label, active }: NavItemProps) {
  return (
    <Link
      to={to}
      className="relative inline-flex items-center gap-[0.35rem] px-3 py-1.5 text-[0.8rem] uppercase tracking-[0.18em] text-gray-200 opacity-90 hover:opacity-100 transition-colors duration-150 group"
    >
      {active && <ActiveHighlight />}

      {icon}

      <span className="relative">
        <span
          className="absolute inset-0 -z-10 scale-95 opacity-0 rounded-lg
                     bg-linear-to-r from-[#f5f5f5]/18 via-[#d4d4d4]/14 to-[#9ca3af]/18
                     blur-md transition-all duration-300
                     group-hover:opacity-100 group-hover:scale-100 group-hover:blur-xl"
        />
        {label}
        <span className="pointer-events-none absolute left-0 right-0 -bottom-1.5 block h-0.5 rounded-full bg-linear-to-r from-[#f5f5f5] to-[#a3a3a3] origin-left scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100" />
      </span>
    </Link>
  );
}

function ActiveHighlight() {
  return (
    <motion.div
      layoutId="activeNav"
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      className="absolute inset-0 -z-10 rounded-lg
                 border border-[rgba(192,192,192,0.45)]
                 bg-[linear-gradient(120deg,rgba(245,245,245,0.12),rgba(192,192,192,0.18),rgba(75,85,99,0.24))]
                 shadow-[0_0_18px_rgba(148,163,184,0.55)]"
    />
  );
}
