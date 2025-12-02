import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import TrophyCanvas from "../components/3d/TrophyCanvas";
import { primaryTournament } from "./data/mockTournaments";

export default function Home() {
  const t = primaryTournament;

  const stats = [
    {
      label: "Highest Prize Pool",
      value: `₹${t.prizePool.toLocaleString()}`,
    },
    {
      label: "Country",
      value: t.location,
    },
    {
      label: "Admins",
      value: "View Admins",
      link: "/admins",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: "90vh",
        padding: "4rem 3rem",
        gap: "2rem",
      }}
    >
      {/* LEFT: HERO TEXT */}
      <motion.div
        style={{ maxWidth: "550px" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Main heading */}
        <h1 style={{ marginTop: "0.4rem", fontWeight: 800, fontSize: "3rem" }}>
          <span
            style={{
              display: "block",
              backgroundImage:
                "linear-gradient(90deg, #fafafa, #d7d7d7, #bfbfbf)",
              WebkitBackgroundClip: "text",
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
            Where the battle defines you.
          </span>
        </h1>

        {/* Description */}
        <p
          style={{
            marginTop: "0.9rem",
            lineHeight: 1.55,
            color: "#d3d3d3",
            maxWidth: "32rem",
          }}
        >
          {t.description}
        </p>

        {/* CTA row – only Tournament Rules, centered */}
        <div
          style={{
            marginTop: "1.6rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Link
            to="/rules"
            style={{
              padding: "0.85rem 1.9rem",
              borderRadius: "999px",
              fontSize: "0.8rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              border: "1px solid #b7b7b7",
              background: "rgba(255, 255, 255, 0.08)",
              color: "#ededed",
            }}
          >
            Tournament Rules
          </Link>
        </div>

        {/* Stats row – Highest Prize Pool, Country, Admins */}
<<<<<<< HEAD
<div
  style={{
    marginTop: "2rem",
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
  }}
>
  {stats.map((stat) => {
    const card = (
      <div
        style={{
          flex: "1",
          minWidth: "180px",
          padding: "1rem 0.6rem",
          height: "90px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderRadius: "16px",
          border: "1px solid rgba(255, 255, 255, 0.22)",
          background: "rgba(255, 255, 255, 0.05)",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "0.75rem", color: "#c9c9c9" }}>{stat.label}</p>
        <p
          style={{
            fontWeight: 700,
            marginTop: "0.3rem",
            color: "#e7e7e7",
            fontSize: "1rem",
          }}
        >
          {stat.value}
        </p>
      </div>
    );

    return stat.link ? (
      <Link
        key={stat.label}
        to={stat.link}
        style={{ textDecoration: "none" }}
      >
        {card}
      </Link>
    ) : (
      <div key={stat.label}>{card}</div>
    );
  })}
</div>

=======
        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          {stats.map((stat) => {
            const card = (
              <div
                style={{
                  flex: "1",
                  minWidth: "180px",
                  padding: "1rem 0.6rem",
                  height: "90px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.22)",
                  background: "rgba(255, 255, 255, 0.05)",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: "0.75rem", color: "#c9c9c9" }}>
                  {stat.label}
                </p>
                <p
                  style={{
                    fontWeight: 700,
                    marginTop: "0.3rem",
                    color: "#e7e7e7",
                    fontSize: "1rem",
                  }}
                >
                  {stat.value}
                </p>
              </div>
            );

            return stat.link ? (
              <Link
                key={stat.label}
                to={stat.link}
                style={{ textDecoration: "none" }}
              >
                {card}
              </Link>
            ) : (
              <div key={stat.label}>{card}</div>
            );
          })}
        </div>
>>>>>>> origin/shr
      </motion.div>

      {/* RIGHT: TROPHY 3D + AEGIS LINE */}
      <motion.div
        style={{
          flex: 1,
          minHeight: "500px",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        initial={{ opacity: 0, x: 35 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div
          style={{
            transform: "scale(0.85)",
            transformOrigin: "center",
          }}
        >
          <TrophyCanvas />
        </div>

        <p
          style={{
            marginTop: "1rem",
            fontSize: "0.9rem",
            letterSpacing: "0.04em",
            color: "#cfcfcf",
            textAlign: "center",
            opacity: 0.85,
          }}
        >
          Every legend was unknown once — long before their name was engraved on
          the Aegis.
        </p>
      </motion.div>
    </div>
  );
}
