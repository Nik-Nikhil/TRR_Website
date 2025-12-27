/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Link } from "react-router-dom";
import TrophyCanvas from "../components/3d/TrophyCanvas";
import { primaryTournament } from "../data/mockTournaments";

export default function Home() {
  const t = primaryTournament;
  
  // State to control registration status
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  return (
    <main className="relative grow flex w-full justify-center px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 pt-8 sm:pt-10 md:pt-12 lg:pt-16 xl:pt-[10vh] pb-8 sm:pb-10 md:pb-12 lg:pb-16 xl:pb-[10vh]">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[320px] sm:w-[420px] md:w-[520px] h-80 sm:h-[420px] md:h-[520px] rounded-full blur-3xl opacity-60 bg-[radial-gradient(circle_at_center,rgba(229,231,235,0.16),transparent_60%)]" />
        <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-[520px] sm:w-[620px] md:w-[720px] h-80 sm:h-[370px] md:h-[420px] rounded-full blur-3xl opacity-45 bg-[radial-gradient(circle_at_center,rgba(148,163,184,0.32),transparent_65%)]" />
      </div>

      <div className="relative z-10 w-full max-w-7xl">
        {/* Top title */}
        <header className="mb-8 sm:mb-10 md:mb-12 text-center lg:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-transparent bg-clip-text bg-linear-to-b from-white via-zinc-200 to-zinc-500 px-2 py-2">
            {t.descriptionContent}
          </h1>
        </header>

        {/* Main layout: left info / right Aegis scene */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_minmax(0,1fr)] gap-4 sm:gap-5 md:gap-6 lg:gap-10 xl:gap-12 items-stretch">
          {/* LEFT: stacked subsections */}
          <section className="flex flex-col gap-4 sm:gap-5">
            {/* Registration */}
            <div className="group rounded-xl sm:rounded-2xl border border-white/15 bg-white/3 px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 shadow-[0_18px_45px_rgba(0,0,0,0.7)] backdrop-blur-sm hover:shadow-[0_24px_60px_rgba(0,0,0,0.9)] hover:border-white/30 hover:bg-white/6 transition-all duration-500 hover:scale-[1.02] cursor-pointer">
              <h2 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold tracking-[0.22em] sm:tracking-[0.28em] uppercase text-zinc-400 mb-2 sm:mb-3">
                Registration
              </h2>
              <p className="text-xs sm:text-[0.8rem] md:text-[0.85rem] text-zinc-200/90 mb-5 sm:mb-6 leading-relaxed">
                Register then go through auction or become captain and gather your squad, lock in your roles, and enter the next
                season of TRR.
              </p>
              <div className="relative inline-block group/btn">
                {isRegistrationOpen ? (
                  <Link
                    to="/register"
                    className="relative inline-flex items-center justify-center rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] bg-linear-to-r from-zinc-50 via-zinc-300 to-zinc-100 text-[#050608] shadow-[0_0_22px_rgba(148,163,184,0.85)] hover:brightness-110 hover:shadow-[0_0_30px_rgba(148,163,184,1)] transition-all duration-300"
                  >
                    <span className="relative z-10">Register</span>
                  </Link>
                ) : (
                  <>
                    <button 
                      disabled
                      className="relative inline-flex items-center justify-center rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] bg-linear-to-r from-zinc-400 via-zinc-500 to-zinc-400 text-zinc-800 shadow-[0_0_15px_rgba(113,113,122,0.4)] cursor-not-allowed opacity-60 transition-all duration-300"
                    >
                      <span className="relative z-10">Register</span>
                      <div className="absolute inset-0 rounded-full bg-linear-to-r from-zinc-300 via-zinc-400 to-zinc-300 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                    </button>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 text-xs font-semibold tracking-wide text-zinc-200 bg-zinc-900/95 backdrop-blur-md border border-white/20 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/btn:translate-y-0 pointer-events-none whitespace-nowrap shadow-[0_4px_20px_rgba(0,0,0,0.7)] z-50">
                      Registration will start soon
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-2 border-[5px] border-transparent border-t-zinc-900/95" />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Schedule / Dates */}
            <div className="group rounded-lg sm:rounded-xl md:rounded-2xl border border-white/10 bg-white/2 px-3 py-3 sm:px-4 sm:py-4 md:px-5 md:py-5 lg:px-6 lg:py-6 shadow-[0_16px_40px_rgba(0,0,0,0.65)] hover:shadow-[0_22px_55px_rgba(0,0,0,0.8)] hover:border-white/25 hover:bg-white/5 transition-all duration-500 hover:scale-[1.02] cursor-pointer">
              <div className="flex flex-col gap-2 text-sm md:text-base text-zinc-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 md:gap-3">
                  <span className="text-zinc-400 uppercase tracking-[0.15em] sm:tracking-[0.18em] md:tracking-[0.22em] text-[0.65rem] sm:text-xs md:text-sm lg:text-base xl:text-lg font-bold">
                    Event Dates
                  </span>
                  <span className="text-xs sm:text-sm md:text-base font-medium text-zinc-300">
                    To Be Announced Soon
                  </span>
                </div>
                <p className="text-[0.7rem] sm:text-xs md:text-[0.8rem] lg:text-[0.85rem] text-zinc-200/90 leading-relaxed">
                  Match schedules, lobbies, and auction details will be posted and updated on the TRR
                  Discord.
                </p>
              </div>
            </div>

            {/* Prize Pool */}
            <div className="group rounded-xl sm:rounded-2xl border border-yellow-400/20 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.18),transparent_55%),rgba(15,23,42,0.85)] px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 shadow-[0_20px_55px_rgba(0,0,0,0.85)] hover:shadow-[0_28px_70px_rgba(250,204,21,0.3)] hover:border-yellow-400/40 hover:bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.25),transparent_55%),rgba(15,23,42,0.9)] transition-all duration-500 hover:scale-[1.02] cursor-pointer">
              <h2 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold tracking-[0.22em] sm:tracking-[0.28em] uppercase text-yellow-200/80 mb-2 sm:mb-3">
                Prize Pool
              </h2>
              <p className="text-xs sm:text-[0.8rem] md:text-[0.85rem] text-zinc-200/90 mb-3 sm:mb-4 leading-relaxed">
                Champions take the glory, and the lion's share of the pot.
              </p>
              <div className="flex items-end gap-3">
                <span className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-yellow-200 via-amber-300 to-orange-400">
                  To Be Announced Soon
                </span>
              </div>
            </div>

            {/* Admins (last section) */}
            <div className="group mt-1 rounded-xl sm:rounded-2xl border border-white/10 bg-white/2 px-4 py-4 sm:px-5 sm:py-5 md:px-6 md:py-6 shadow-[0_14px_38px_rgba(0,0,0,0.7)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.85)] hover:border-white/25 hover:bg-white/5 transition-all duration-500 hover:scale-[1.02] cursor-pointer">
              <h2 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold tracking-[0.22em] sm:tracking-[0.28em] uppercase text-zinc-400 mb-2 sm:mb-3">
                Admins
              </h2>
              <p className="text-xs sm:text-[0.8rem] md:text-[0.85rem] text-zinc-200/90 mb-5 sm:mb-6 leading-relaxed">
                Need help with rules, rosters, or disputes? Reach out to the TRR
                admin team from the panel.
              </p>
              <Link
                to="/admins"
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] bg-linear-to-r from-zinc-50 via-zinc-300 to-zinc-100 text-[#050608] rounded-full shadow-[0_0_22px_rgba(148,163,184,0.85)] hover:brightness-110 hover:shadow-[0_0_30px_rgba(148,163,184,1)] transition-all duration-300"
              >
                Admin Panel
                <span className="text-xs">↗</span>
              </Link>
            </div>
          </section>

          {/* RIGHT: Aegis Trophy Scene - Hidden on mobile, visible on lg+ */}
          <aside className="relative hidden lg:flex items-stretch justify-center">
            <div className="group/trophy relative w-full h-full min-h-[600px] mx-auto rounded-3xl lg:rounded-4xl border border-yellow-100/25 bg-[radial-gradient(circle_at_top,rgba(250,250,250,0.06),transparent_55%),radial-gradient(circle_at_bottom,rgba(30,64,175,0.65),rgba(3,7,18,0.98))] shadow-[0_32px_90px_rgba(0,0,0,0.9)] overflow-hidden transition-all duration-700 hover:shadow-[0_40px_110px_rgba(250,204,21,0.3)] hover:border-yellow-200/40 cursor-pointer">
              {/* Inspirational Quote Overlay */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 w-[85%] text-center opacity-90 group-hover/trophy:opacity-100 transition-opacity duration-500">
                <p className="text-sm md:text-base lg:text-lg font-medium text-zinc-100 tracking-wide leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  "Every Dota-2 player dreams to lift this"
                </p>
                <div className="mt-2 w-24 h-0.5 mx-auto bg-linear-to-r from-transparent via-yellow-400/60 to-transparent" />
              </div>

              {/* rotating halo ring */}
              <div className="absolute inset-0 flex items-center justify-center -z-10">
                <div className="w-[380px] lg:w-[420px] h-[380px] lg:h-[420px] rounded-full border-4 lg:border-[5px] border-yellow-300/25 animate-[spin_16s_linear_infinite] blur-md" />
              </div>

              {/* spotlight from top */}
              <div className="absolute top-0 inset-x-0 h-36 md:h-40 lg:h-48 bg-linear-to-b from-yellow-100/30 via-transparent to-transparent blur-2xl opacity-80 pointer-events-none" />

              {/* hover pulse halo */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover/trophy:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_center,rgba(250,250,200,0.12),transparent_65%)]" />

              {/* floor rune / reflection */}
              <div className="absolute bottom-6 lg:bottom-8 inset-x-0 mx-auto w-[65%] lg:w-[70%] h-16 lg:h-[72px] rounded-full opacity-60 blur-xl bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.4),transparent_70%)] group-hover/trophy:opacity-80 group-hover/trophy:blur-2xl transition-all duration-700" />

              {/* inner border + glass */}
              <div className="pointer-events-none absolute inset-3 lg:inset-4 rounded-[22px] lg:rounded-[26px] border border-white/10 bg-linear-to-b from-white/5 via-transparent to-white/5 opacity-70" />

              {/* Trophy */}
              <div className="relative z-10 h-full flex items-center justify-center py-20">
                <TrophyCanvas />
              </div>

              {/* Caption */}
              <div className="pointer-events-none absolute inset-0 flex items-end justify-center mb-5 lg:mb-6">
                <p className="px-3 lg:px-4 py-1 lg:py-1.5 rounded-full text-[0.65rem] lg:text-[0.7rem] font-semibold tracking-[0.24em] lg:tracking-[0.28em] uppercase bg-black/50 text-zinc-200 border border-white/15 backdrop-blur-md group-hover/trophy:bg-black/60 group-hover/trophy:border-yellow-400/30 transition-all duration-500">
                  Aegis of Champions
                </p>
              </div>
            </div>
          </aside>

          {/* Mobile Trophy Section - Visible only on mobile/tablet */}
          <section className="lg:hidden mt-4">
            <div className="group/trophy relative w-full h-[450px] sm:h-[550px] mx-auto rounded-2xl sm:rounded-3xl border border-yellow-100/25 bg-[radial-gradient(circle_at_top,rgba(250,250,250,0.06),transparent_55%),radial-gradient(circle_at_bottom,rgba(30,64,175,0.65),rgba(3,7,18,0.98))] shadow-[0_24px_70px_rgba(0,0,0,0.9)] overflow-hidden">
              {/* Inspirational Quote */}
              <div className="absolute top-6 sm:top-8 left-1/2 -translate-x-1/2 z-20 w-[90%] text-center opacity-90">
                <p className="text-sm sm:text-base font-medium text-zinc-100 tracking-wide leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  "Every player dreams to lift this"
                </p>
                <div className="mt-2 w-20 h-0.5 mx-auto bgbg-linear-to-rrom-transparent via-yellow-400/60 to-transparent" />
              </div>

              {/* rotating halo ring */}
              <div className="absolute inset-0 flex items-center justify-center -z-10">
                <div className="w-[280px] sm:w-[350px] h-[280px] sm:h-[350px] rounded-full border-[3px] sm:border-4 border-yellow-300/25 animate-[spin_16s_linear_infinite] blur-md" />
              </div>

              {/* spotlight from top */}
              <div className="absolute top-0 inset-x-0 h-32 sm:h-40 bg-linear-to-b from-yellow-100/30 via-transparent to-transparent blur-2xl opacity-80 pointer-events-none" />

              {/* floor rune / reflection */}
              <div className="absolute bottom-6 inset-x-0 mx-auto w-[60%] h-14 sm:h-16 rounded-full opacity-60 blur-xl bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.4),transparent_70%)]" />

              {/* inner border + glass */}
              <div className="pointer-events-none absolute inset-3 rounded-[18px] sm:rounded-[22px] border border-white/10 bg-linear-to-b from-white/5 via-transparent to-white/5 opacity-70" />

              {/* Trophy */}
              <div className="relative z-10 h-full flex items-center justify-center py-16 sm:py-20">
                <TrophyCanvas />
              </div>

              {/* Caption */}
              <div className="pointer-events-none absolute inset-0 flex items-end justify-center mb-4 sm:mb-5">
                <p className="px-3 py-1 rounded-full text-[0.6rem] sm:text-[0.65rem] font-semibold tracking-[0.22em] sm:tracking-[0.24em] uppercase bg-black/50 text-zinc-200 border border-white/15 backdrop-blur-md">
                  Aegis of Champions
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}