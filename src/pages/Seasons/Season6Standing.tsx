// src/pages/seasons/Season6Standings.tsx

export default function Season6Standings() {
  return (
    <main className="w-full flex justify-center pt-10 pb-4 bg-[#050608]">
      <div className="w-full max-w-[880px] px-6">
        {/* === CENTERED BRACKET BUTTON === */}
        <div className="flex justify-center mb-6">
          
        </div>

        {/* === TBA CARD (same shell as table) === */}
        <div className="w-full overflow-hidden rounded-3xl border border-white/10 bg-[#050608] shadow-[0_18px_50px_rgba(0,0,0,0.8)]">
          <div className="flex items-center justify-center h-40">
            <span className="text-xl font-semibold tracking-[0.2em] text-gray-300 uppercase opacity-80">
              TBA
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
