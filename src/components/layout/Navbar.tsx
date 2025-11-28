// src/components/layout/Navbar.tsx
import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect, type ReactNode } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { LayoutGrid, Medal, UsersRound, ScrollText } from "lucide-react";

const seasons = [1, 2, 3, 4, 5, 6];

export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState<string | null>(null);
  const closeTimeout = useRef<number | null>(null);

  const handleEnter = (id: string) => {
    if (closeTimeout.current !== null) {
      window.clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setOpen(id);
  };

  const handleLeave = () => {
    if (closeTimeout.current !== null) {
      window.clearTimeout(closeTimeout.current);
    }
    closeTimeout.current = window.setTimeout(() => {
      setOpen(null);
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
      className="fixed inset-x-0 top-0 z-50 w-full backdrop-blur-[18px] border-b border-[rgba(192,192,192,0.25)] shadow-[0_18px_45px_rgba(0,0,0,0.7)]"
      style={{
        background:
          "radial-gradient(circle at 0% 0%, rgba(192,192,192,0.12), transparent 60%), radial-gradient(circle at 100% 100%, rgba(136,144,150,0.10), transparent 60%), rgba(5,7,10,0.92)",
      }}
    >
      {/* slightly less side padding so logo sits closer to far left */}
      <div className="w-full max-w-none mx-0 pl-20 pr-6">
        <div className="h-[72px] grid grid-cols-[auto_1fr] items-center w-full">
          {/* Brand / Left side */}
          <Link to="/" className="flex items-center gap-3 no-underline group">
            <img
              src="/icons/Roshan.png" // ✅ root-relative path so it works on every route
              alt="Roshan Icon"
              className="w-10 h-10 object-contain
                invert brightness-[8] contrast-[1.4] saturate-[0]
                bg-linear-to-r from-[#f5f5f5] via-[#c0c0c0] to-[#8b8f98]
                bg-clip-text text-transparent
                drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]
                transition-all duration-300
                group-hover:drop-shadow-[0_0_18px_rgba(255,255,255,0.95)]
                mix-blend-screen"
              draggable="false"
            />
            <div className="flex flex-col">
              <span className="text-[0.65rem] uppercase tracking-[0.18em] text-gray-400">
                The Roshan Rumble
              </span>
              <span className="text-[1.35rem] font-extrabold leading-none bg-linear-to-r from-[#f5f5f5] via-[#c0c0c0] to-[#8b8f98] bg-clip-text text-transparent">
                TRR
              </span>
            </div>
          </Link>

          {/* Middle + Right Sections */}
          <LayoutGroup id="navbar">
            {/* ml-10 nudges the Home/Rules group slightly to the right */}
            <div className="flex items-center justify-center gap-[2.4rem] w-full ml-10">
              {/* Home */}
              <NavItem
                to="/"
                icon={<LayoutGrid className="w-[18px] h-[18px]" />}
                label="Home"
                active={pathname === "/"}
              />

              {/* Rules */}
              <NavItem
                to="/rules"
                icon={<ScrollText className="w-[18px] h-[18px]" />}
                label="Rules"
                active={pathname.startsWith("/rules")}
              />

              {/* Standings dropdown */}
              <Dropdown
                label="Standings"
                icon={<Medal className="w-[18px] h-[18px]" />}
                open={open === "standings"}
                onEnter={() => handleEnter("standings")}
                onLeave={handleLeave}
                items={seasons.map((s) => ({
                  label: `Season ${s}`,
                  to: `/seasons/${s}`,
                }))}
              />

              {/* Players dropdown */}
              <NavItem
  to="/players"
  icon={<UsersRound className="w-[18px] h-[18px]" />}
  label="Players"
  active={pathname.startsWith("/players")}
/>

            </div>
          </LayoutGroup>
        </div>
      </div>
    </nav>
  );
}

/* ==========================================================
   Subcomponents
========================================================== */

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
        {/* Silver / grey glow hover background (behind the label text area) */}
        <span
          className="absolute inset-0 -z-10 scale-95 opacity-0 rounded-lg
                     bg-linear-to-r from-[#f5f5f5]/18 via-[#d4d4d4]/14 to-[#9ca3af]/18
                     blur-md transition-all duration-300
                     group-hover:opacity-100 group-hover:scale-100 group-hover:blur-xl"
        />

        {label}

        {/* Underline on hover */}
        <span className="pointer-events-none absolute left-0 right-0 -bottom-1.5 block h-0.5 rounded-full bg-linear-to-r from-[#f5f5f5] to-[#a3a3a3] origin-left scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100" />
      </span>
    </Link>
  );
}

type DropdownProps = {
  label: string;
  icon: ReactNode;
  open: boolean;
  onEnter: () => void;
  onLeave: () => void;
  items: { label: string; to: string }[];
};

function Dropdown({ label, icon, open, onEnter, onLeave, items }: DropdownProps) {
  return (
    <div
      className="relative flex items-center"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <button
        type="button"
        className="relative inline-flex items-center gap-[0.35rem] px-3 py-1.5 bg-transparent border-none text-[0.8rem] uppercase tracking-[0.18em] text-gray-200 opacity-90 hover:opacity-100 transition-colors duration-150 cursor-pointer group"
      >
        {icon}
        <span className="relative">
          {/* Silver / grey glow hover background */}
          <span
            className="absolute inset-0 -z-10 scale-95 opacity-0 rounded-lg
                       bg-linear-to-r from-[#f5f5f5]/18 via-[#d4d4d4]/14 to-[#9ca3af]/18
                       blur-md transition-all duration-300
                       group-hover:opacity-100 group-hover:scale-100 group-hover:blur-xl"
          />
          {label}
          <span
            className="pointer-events-none absolute left-0 right-0 -bottom-1.5 block h-0.5 rounded-full bg-linear-to-r from-[#f5f5f5] to-[#a3a3a3] origin-left scale-x-0 transition-transform duration-200 ease-out group-hover:scale-x-100"
          />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[200px] py-[0.45rem] grid gap-1 bg-[rgba(9,11,16,0.98)] border border-[rgba(148,163,184,0.6)] backdrop-blur-[18px] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-200"
          >
            {items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="px-4 py-[0.55rem] text-[0.75rem] uppercase tracking-[0.15em] text-slate-300 text-center whitespace-nowrap hover:bg-[rgba(75,85,99,0.5)] hover:text-slate-50 transition-colors duration-150"
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
