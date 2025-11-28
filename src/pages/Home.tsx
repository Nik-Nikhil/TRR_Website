// src/pages/Home.tsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import TrophyCanvas from "../components/3d/TrophyCanvas";
import { primaryTournament } from "../data/mockTournaments";

export default function Home() {
  const t = primaryTournament;

  return (
    // This is the first <div> inside <main>, your CSS targets: main > div:first-of-type
    <div>
      {/* Left: Hero text */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Kicker line */}
        <p>
          The Roshan Rumble • {t.year}
        </p>

        {/* Main heading */}
        <h1>
          <span
            style={{
              display: "block",
              backgroundImage:
                "linear-gradient(90deg, #a855f7, #22c55e, #38bdf8)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Dive into the pit.
          </span>
          <span
            style={{
              display: "block",
              marginTop: "0.5rem",
              color: "#e5e7eb",
            }}
          >
            Only one squad lifts the Aegis.
          </span>
        </h1>

        {/* Description */}
        <p style={{ maxWidth: "32rem", marginTop: "0.5rem" }}>
          {t.description}
        </p>

        {/* CTA buttons row */}
        <div style={{ marginTop: "1.25rem", display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          <Link
            to="/tournament"
            style={{
              padding: "0.75rem 1.6rem",
              borderRadius: "999px",
              fontSize: "0.8rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              backgroundImage: "linear-gradient(120deg, #a855f7, #22c55e)",
              color: "#0b1020",
              boxShadow: "0 0 25px rgba(37, 99, 235, 0.7)",
            }}
          >
            View Bracket
          </Link>

          <Link
            to="/schedule"
            style={{
              padding: "0.75rem 1.6rem",
              borderRadius: "999px",
              fontSize: "0.8rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              border: "1px solid rgba(148, 163, 184, 0.6)",
              color: "#e5e7eb",
              background: "rgba(15, 23, 42, 0.65)",
            }}
          >
            Match Schedule
          </Link>
        </div>

        {/* Stats row */}
        <div style={{ marginTop: "1.75rem", maxWidth: "24rem", display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          <div className="glass-panel" style={{ flex: "1 1 30%", textAlign: "center" }}>
            <p>Prize Pool</p>
            <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "#6ee7b7" }}>
              ₹{t.prizePool.toLocaleString()}
            </p>
          </div>

          <div className="glass-panel" style={{ flex: "1 1 30%", textAlign: "center" }}>
            <p>Location</p>
            <p style={{ fontWeight: 600 }}>{t.location}</p>
          </div>

          <div className="glass-panel" style={{ flex: "1 1 30%", textAlign: "center" }}>
            <p>Dates</p>
            <p style={{ fontWeight: 600 }}>
              {t.startDate} → {t.endDate}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Right: 3D Trophy – your CSS styles main > div:first-of-type > div:last-child */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <TrophyCanvas />
      </motion.div>
    </div>
  );
}
