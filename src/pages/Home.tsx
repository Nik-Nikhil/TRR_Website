import { Link } from "react-router-dom";
import TrophyCanvas from "../components/3d/TrophyCanvas";
import { primaryTournament } from "./data/mockTournaments";

export default function Home() {
  const t = primaryTournament;

  return (
    <main className="relative grow flex w-full justify-center px-6 md:px-12 pt-[10vh] pb-[10vh]">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full blur-3xl opacity-60 bg-[radial-gradient(circle_at_center,rgba(229,231,235,0.16),transparent_60%)]" />
        <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-[720px] h-[420px] rounded-full blur-3xl opacity-45 bg-[radial-gradient(circle_at_center,rgba(148,163,184,0.32),transparent_65%)]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        {/* Top title */}
        <header className="mb-10 text-center lg:text-left">
          <p className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-zinc-400 mb-2">
            The Roshan Rumble
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-transparent bg-clip-text bg-linear-to-b from-white via-zinc-200 to-zinc-500">
            {t.descriptionContent}
          </h1>
        </header>

        {/* Main layout: left info / right Aegis scene */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_minmax(0,1fr)] gap-8 lg:gap-12 items-stretch">
          {/* LEFT: stacked subsections */}
          <section className="flex flex-col gap-4">
            {/* Registration */}
            <div className="rounded-2xl border border-white/15 bg-white/3 px-5 py-4 md:px-6 md:py-5 shadow-[0_18px_45px_rgba(0,0,0,0.7)] backdrop-blur-sm">
              <h2 className="text-xs md:text-sm font-semibold tracking-[0.28em] uppercase text-zinc-400 mb-2">
                Registration
              </h2>
              <p className="text-sm md:text-base text-zinc-200/90 mb-4">
                Gather your squad, lock in your roles, and enter the next
                chapter of TRR. Registration happens through the admins panel.
              </p>
              <Link
                to="/admins"
                className="inline-flex items-center justify-center rounded-full px-5 py-2 text-[0.78rem] font-semibold uppercase tracking-[0.2em] bg-linear-to-r from-zinc-50 via-zinc-300 to-zinc-100 text-[#050608] shadow-[0_0_22px_rgba(148,163,184,0.85)] hover:brightness-110 transition"
              >
                Register Your Team
              </Link>
            </div>

            {/* Schedule / Dates */}
            <div className="rounded-2xl border border-white/10 bg-white/2 px-5 py-4 md:px-6 md:py-5 shadow-[0_16px_40px_rgba(0,0,0,0.65)]">
              <h2 className="text-xs md:text-sm font-semibold tracking-[0.28em] uppercase text-zinc-400 mb-2">
                Schedule
              </h2>
              <div className="flex flex-col gap-2 text-sm md:text-base text-zinc-100">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-zinc-400 text-xs uppercase tracking-[0.22em]">
                    Event Dates
                  </span>
                  <span className="text-sm md:text-base font-medium">
                    {t.startDate} — {t.endDate}
                  </span>
                </div>
                <p className="text-[0.8rem] md:text-[0.85rem] text-zinc-400">
                  Match schedules, lobbies, and vetoes will be posted on the
                  TRR Discord and updated live.
                </p>
              </div>
            </div>

            {/* Prize Pool */}
            <div className="rounded-2xl border border-yellow-400/20 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.18),transparent_55%),rgba(15,23,42,0.85)] px-5 py-4 md:px-6 md:py-5 shadow-[0_20px_55px_rgba(0,0,0,0.85)]">
              <h2 className="text-xs md:text-sm font-semibold tracking-[0.28em] uppercase text-yellow-200/80 mb-1">
                Prize Pool
              </h2>
              <p className="text-[0.8rem] md:text-[0.85rem] text-zinc-200/90 mb-3">
                Champions take the Aegis, glory, and the lion’s share of the pot.
              </p>
              <div className="flex items-end gap-3">
                <span className="text-3xl md:text-4xl font-semibold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-yellow-200 via-amber-300 to-orange-400">
                  ₹{t.prizePool.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Admins (last section) */}
            <div className="mt-1 rounded-2xl border border-white/10 bg-white/2 px-5 py-4 md:px-6 md:py-5 shadow-[0_14px_38px_rgba(0,0,0,0.7)]">
              <h2 className="text-xs md:text-sm font-semibold tracking-[0.28em] uppercase text-zinc-400 mb-2">
                Admins
              </h2>
              <p className="text-[0.8rem] md:text-[0.85rem] text-zinc-300 mb-3">
                Need help with rules, rosters, or disputes? Reach out to the
                TRR admin team from the panel.
              </p>
              <Link
                to="/admins"
                className="inline-flex items-center gap-2 text-[0.8rem] font-medium text-zinc-200 hover:text-white hover:underline underline-offset-4"
              >
                Open Admin Panel
                <span className="text-zinc-400 text-xs">↗</span>
              </Link>
            </div>
          </section>

          {/* RIGHT: Aegis Trophy Scene */}
          <aside className="relative flex items-center justify-center">
            <div className="group relative w-full max-w-md h-[360px] md:h-[420px] lg:h-[460px] mx-auto rounded-4xl border border-yellow-100/25 bg-[radial-gradient(circle_at_top,rgba(250,250,250,0.06),transparent_55%),radial-gradient(circle_at_bottom,rgba(30,64,175,0.65),rgba(3,7,18,0.98))] shadow-[0_32px_90px_rgba(0,0,0,0.9)] overflow-hidden">
              {/* rotating halo ring */}
              <div className="absolute inset-0 flex items-center justify-center -z-10">
                <div className="w-[420px] h-[420px] rounded-full border-[5px] border-yellow-300/25 animate-[spin_16s_linear_infinite] blur-md" />
              </div>

              {/* spotlight from top */}
              <div className="absolute top-0 inset-x-0 h-40 md:h-48 bg-linear-to-b from-yellow-100/30 via-transparent to-transparent blur-2xl opacity-80 pointer-events-none" />

              {/* hover pulse halo */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-700 bg-[radial-gradient(circle_at_center,rgba(250,250,200,0.08),transparent_65%)]" />

              {/* floor rune / reflection */}
              <div className="absolute bottom-6 inset-x-0 mx-auto w-[70%] h-[72px] rounded-full opacity-60 blur-xl bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.4),transparent_70%)]" />

              {/* inner border + glass */}
              <div className="pointer-events-none absolute inset-4 rounded-[26px] border border-white/10 bg-linear-to-b from-white/5 via-transparent to-white/5 opacity-70" />

              {/* Trophy */}
              <div className="relative z-10 h-full flex items-center justify-center">
                <TrophyCanvas />
              </div>

              {/* Caption */}
              <div className="pointer-events-none absolute bottom-4 inset-x-0 flex justify-center">
                <p className="px-4 py-1 rounded-full text-[0.7rem] font-semibold tracking-[0.28em] uppercase bg-black/45 text-zinc-200 border border-white/10 backdrop-blur-md">
                  Aegis of Champions
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
