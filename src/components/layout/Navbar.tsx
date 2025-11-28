// src/components/layout/Navbar.tsx
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

import {
  Home,
  Trophy,
  Users,
  Calendar,
  FileBarChart,
  ShieldCheck, // cooler admin icon
} from "lucide-react";

const seasons = [1, 2, 3, 4, 5];

export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState<string | null>(null);

  const handleEnter = (id: string) => setOpen(id);
  const handleLeave = () => setOpen(null);

  return (
    <nav>
      <div>
        <div>
          {/* Brand / Left side */}
          <Link to="/">
            <Trophy />
            <span>The Roshan Rumble</span>
            <span>TRR</span>
          </Link>

          {/* Middle + Right Sections */}
          <div>
            {/* Home */}
            <NavItem
              to="/"
              icon={<Home />}
              label="Home"
              active={pathname === "/"}
            />

            {/* Seasons dropdown (Seasons 1–5; you can show brackets there) */}
            <Dropdown
              label="Seasons"
              icon={<Calendar />}
              open={open === "seasons"}
              onEnter={() => handleEnter("seasons")}
              onLeave={handleLeave}
              items={seasons.map((s) => ({
                label: `Season ${s}`,
                to: `/season/${s}`,
              }))}
            />

            {/* Players dropdown */}
            <Dropdown
              label="Players"
              icon={<Users />}
              open={open === "players"}
              onEnter={() => handleEnter("players")}
              onLeave={handleLeave}
              items={seasons.map((s) => ({
                label: `Season ${s}`,
                to: `/players/season/${s}`,
              }))}
            />

            {/* Results dropdown (you can link to bracket results here too) */}
            <Dropdown
              label="Results"
              icon={<FileBarChart />}
              open={open === "results"}
              onEnter={() => handleEnter("results")}
              onLeave={handleLeave}
              items={seasons.map((s) => ({
                label: `Season ${s}`,
                to: `/results/season/${s}`,
              }))}
            />

            {/* Admin (rightmost, cooler icon) */}
            <NavItem
              to="/admin"
              icon={<ShieldCheck />}
              label="Admin Login"
              active={pathname === "/admin"}
            />
          </div>
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
  icon: React.ReactNode;
  label: string;
  active: boolean;
};

function NavItem({ to, icon, label, active }: NavItemProps) {
  return (
    <Link to={to} style={{ position: "relative" }}>
      {active && <ActiveHighlight />}
      {icon}
      <span>{label}</span>
    </Link>
  );
}

type DropdownProps = {
  label: string;
  icon: React.ReactNode;
  open: boolean;
  onEnter: () => void;
  onLeave: () => void;
  items: { label: string; to: string }[];
};

function Dropdown({ label, icon, open, onEnter, onLeave, items }: DropdownProps) {
  return (
    <div className="dropdown" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button>
        {icon}
        <span>{label}</span>
      </button>

      {open && (
        <div className="dropdown-menu">
          {items.map((item) => (
            <Link key={item.to} to={item.to}>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function ActiveHighlight() {
  return (
    <motion.div
      layoutId="activeNav"
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "12px",
        background:
          "linear-gradient(90deg, rgba(168,85,247,0.20), rgba(34,197,94,0.20))",
        border: "1px solid rgba(168,85,247,0.50)",
        boxShadow: "0 0 22px rgba(168,85,247,0.65)",
        zIndex: -1,
      }}
    />
  );
}
