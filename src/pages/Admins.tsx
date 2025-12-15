// src/pages/Admins.tsx
import { motion } from "framer-motion";

type CoreMember = {
  name: string;
  role: string;
  discord: string;
  bio: string;
  tag?: string;
  color: string;
};

const founder: CoreMember = {
  name: "Nikhil",
  role: "Founder",
  discord: "NIKHIL#0001",
  bio: "Founder of TRR. Oversees tournaments, systems and structure.",
  tag: "Vision & Direction",
  color: "#fbbf24", // amber
};

const admins: CoreMember[] = [
  {
    name: "Roshan",
    role: "Admin",
    discord: "ROSHAR#0001",
    bio: "Handles competitive integrity, rules, and match operations.",
    tag: "Operations Lead",
    color: "#22c55e",
  },
  {
    name: "Nemesis",
    role: "Admin",
    discord: "NEMESIS#0001",
    bio: "Tournament logistics, team coordination & enforcement.",
    tag: "Logistics & Coordination",
    color: "#3b82f6",
  },
];

const miniAdmins: CoreMember[] = [
  {
    name: "Helm",
    role: "Mini Admin",
    discord: "HELM#0001",
    bio: "In-game lobbies, remake calls & tech checks.",
    color: "#a855f7",
  },
  {
    name: "Banner",
    role: "Mini Admin",
    discord: "BANNER#0001",
    bio: "Player queries, substitute handling, communication relay.",
    color: "#ec4899",
  },
  {
    name: "R3ciprocal",
    role: "Mini Admin",
    discord: "R3CIPROCAL#0001",
    bio: "Scheduling support & series result verification.",
    color: "#38bdf8",
  },
];

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const cardVariants = {
  initial: { opacity: 0, y: 12, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
};

const AdminsPage = () => {
  return (
    <main className="pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* PAGE HEADER */}
        <motion.header
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center mb-10"
        >
          <p className="text-[11px] md:text-xs tracking-[0.35em] uppercase text-slate-400 mb-2">
            TRR Core Management Team
          </p>
          <h1 className="relative inline-block">
            <span className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-[0.22em] text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-slate-100 to-white">
              ADMINISTRATION
            </span>
            <span className="pointer-events-none absolute inset-0 text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-[0.22em] text-zinc-500/50 blur-xl opacity-40">
              ADMINISTRATION
            </span>
          </h1>
          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <span className="inline-flex h-px w-8 bg-slate-500/50" />
            <span className="tracking-[0.28em] uppercase">
              Behind the scenes of every season
            </span>
            <span className="inline-flex h-px w-8 bg-slate-500/50" />
          </div>
        </motion.header>

        {/* FOUNDER (CENTERED FEATURE CARD) */}
        <section className="mb-14">
          <div className="text-center mb-6">
            <p className="text-xs tracking-[0.3em] uppercase text-slate-400">
              Vision & Direction
            </p>
            <h2 className="mt-1 text-lg md:text-xl font-bold tracking-[0.24em] text-slate-50">
              Founder
            </h2>
          </div>

          <div className="flex justify-center">
            <motion.article
              variants={cardVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.5, ease: "easeOut" }}
              whileHover={{
                scale: 1.02,
                y: -4,
              }}
              className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-900/95 shadow-[0_28px_90px_rgba(0,0,0,0.9)] overflow-hidden px-6 py-5 md:px-8 md:py-6"
            >
              {/* glow ring */}
              <div className="pointer-events-none absolute -inset-px rounded-3xl opacity-40 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.22),transparent_55%),radial-gradient(circle_at_bottom,rgba(56,189,248,0.3),transparent_60%)]" />
              <div className="relative flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                {/* avatar */}
                <div className="relative shrink-0">
                  <div
                    className="h-16 w-16 md:h-20 md:w-20 rounded-full border border-white/20 bg-slate-900 flex items-center justify-center text-lg font-bold text-white shadow-[0_0_30px_rgba(250,204,21,0.6)]"
                    style={{
                      background: `radial-gradient(circle at 30% 0%, ${founder.color} 0%, transparent 55%), radial-gradient(circle at 80% 120%, #0f172a 0%, #020617 60%)`,
                    }}
                  >
                    {getInitials(founder.name)}
                  </div>
                  <span className="absolute -bottom-1 -right-1 px-2 py-[2px] rounded-full text-[10px] font-semibold tracking-[0.16em] uppercase bg-white/10 border border-white/20 text-slate-100">
                    Founder
                  </span>
                </div>

                {/* text */}
                <div className="space-y-1 md:space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg md:text-xl font-semibold text-slate-50">
                      {founder.name}
                    </h3>
                    {founder.tag && (
                      <span className="px-2.5 py-[2px] rounded-full text-[10px] uppercase tracking-[0.18em] bg-slate-200/10 text-slate-200 border border-white/15">
                        {founder.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-300 max-w-xl">
                    {founder.bio}
                  </p>
                  <p className="text-[11px] tracking-[0.22em] uppercase text-slate-400 pt-1">
                    Discord •{" "}
                    <span className="text-slate-200">{founder.discord}</span>
                  </p>
                </div>
              </div>
            </motion.article>
          </div>
        </section>

        {/* ADMINS */}
        <section className="mb-12">
          <div className="text-center mb-4">
            <p className="text-xs tracking-[0.3em] uppercase text-slate-400">
              Operations & Oversight
            </p>
            <h2 className="mt-1 text-lg md:text-xl font-bold tracking-[0.24em] text-slate-50">
              Admins
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
            {admins.map((admin, idx) => (
              <motion.article
                key={admin.name}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.45, delay: 0.05 * idx }}
                whileHover={{
                  scale: 1.015,
                  y: -3,
                }}
                className="relative rounded-3xl border border-white/8 bg-gradient-to-br from-slate-950/85 via-slate-900/80 to-slate-900/95 shadow-[0_24px_70px_rgba(0,0,0,0.85)] px-5 py-5"
              >
                <div className="pointer-events-none absolute -inset-px rounded-3xl opacity-40"
                  style={{
                    background: `radial-gradient(circle at 0% 0%, ${admin.color}33 0, transparent 55%)`,
                  }}
                />
                <div className="relative flex gap-4">
                  {/* avatar */}
                  <div className="mt-1 shrink-0">
                    <div
                      className="h-12 w-12 rounded-full border border-white/20 flex items-center justify-center text-sm font-semibold text-white shadow-[0_0_18px_rgba(15,23,42,0.9)]"
                      style={{
                        background: `radial-gradient(circle at 30% 0%, ${admin.color} 0%, transparent 55%), radial-gradient(circle at 80% 120%, #020617 0%, #020617 60%)`,
                      }}
                    >
                      {getInitials(admin.name)}
                    </div>
                  </div>

                  {/* content */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm md:text-base font-semibold text-slate-50">
                        {admin.name}
                      </h3>
                      <span className="px-2 py-[2px] rounded-full text-[10px] uppercase tracking-[0.18em] bg-slate-100/10 text-slate-100 border border-white/15">
                        {admin.role}
                      </span>
                    </div>
                    {admin.tag && (
                      <p className="text-[11px] tracking-[0.18em] uppercase text-slate-400">
                        {admin.tag}
                      </p>
                    )}
                    <p className="text-xs md:text-sm text-slate-300">
                      {admin.bio}
                    </p>
                    <p className="text-[11px] tracking-[0.22em] uppercase text-slate-500 pt-1">
                      Discord •{" "}
                      <span className="text-slate-200">{admin.discord}</span>
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* MINI ADMINS */}
        <section>
          <div className="text-center mb-4">
            <p className="text-xs tracking-[0.3em] uppercase text-slate-400">
              Support & On-Ground
            </p>
            <h2 className="mt-1 text-lg md:text-xl font-bold tracking-[0.24em] text-slate-50">
              Mini Admins
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {miniAdmins.map((member, idx) => (
              <motion.article
                key={member.name}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                transition={{ duration: 0.4, delay: 0.04 * idx }}
                whileHover={{
                  scale: 1.02,
                  y: -3,
                }}
                className="relative rounded-2xl border border-white/8 bg-gradient-to-br from-slate-950/80 to-slate-900/90 px-4 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.8)]"
              >
                <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-35"
                  style={{
                    background: `radial-gradient(circle at 0% 0%, ${member.color}33 0, transparent 60%)`,
                  }}
                />
                <div className="relative flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    <div
                      className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center text-xs font-semibold text-white"
                      style={{
                        background: `radial-gradient(circle at 30% 0%, ${member.color} 0%, transparent 55%), radial-gradient(circle at 80% 120%, #020617 0%, #020617 60%)`,
                      }}
                    >
                      {getInitials(member.name)}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-50">
                        {member.name}
                      </h3>
                      <span className="px-2 py-[2px] rounded-full text-[9px] uppercase tracking-[0.18em] bg-slate-100/5 text-slate-200 border border-white/10">
                        {member.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">{member.bio}</p>
                    <p className="text-[10px] tracking-[0.22em] uppercase text-slate-500 pt-0.5">
                      Discord •{" "}
                      <span className="text-slate-200">{member.discord}</span>
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminsPage;
