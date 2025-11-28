import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import TrophyCanvas from "../components/3d/TrophyCanvas";
import { primaryTournament } from "./data/mockTournaments";

export default function Home() {
  const t = primaryTournament;

  return (
    <div>
      {/* Left: Hero text */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Kicker line */}
        <p>The Roshan Rumble • {t.year}</p>

        {/* Main heading */}
        <h1>
          <span
            style={{
              display: "block",
              backgroundImage:
                "linear-gradient(90deg, #f5f5f5, #c0c0c0, #8b8f98)",
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

        {/* CTA buttons */}
        <div
          style={{
            marginTop: "1.25rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <Link
            to="/tournament"
            style={{
              padding: "0.75rem 1.6rem",
              borderRadius: "999px",
              fontSize: "0.8rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              backgroundImage:
                "linear-gradient(120deg, #f5f5f5, #c0c0c0, #9ca3af)",
              color: "#050608",
              boxShadow: "0 0 25px rgba(148, 163, 184, 0.8)",
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
              border: "1px solid rgba(148, 163, 184, 0.55)",
              color: "#e5e7eb",
              background: "rgba(15, 15, 17, 0.6)",
            }}
          >
            Match Schedule
          </Link>
        </div>

        {/* Stats row */}
        <div
          style={{
            marginTop: "1.75rem",
            maxWidth: "24rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <div
            className="glass-panel"
            style={{ flex: "1 1 30%", textAlign: "center" }}
          >
            <p>Prize Pool</p>
            <p
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#d4d4d4",
              }}
            >
              ₹{t.prizePool.toLocaleString()}
            </p>
          </div>

          <div
            className="glass-panel"
            style={{ flex: "1 1 30%", textAlign: "center" }}
          >
            <p>Location</p>
            <p style={{ fontWeight: 600 }}>{t.location}</p>
          </div>

          <div
            className="glass-panel"
            style={{ flex: "1 1 30%", textAlign: "center" }}
          >
            <p>Dates</p>
            <p style={{ fontWeight: 600 }}>
              {t.startDate} → {t.endDate}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Right: Trophy 3D */}
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
