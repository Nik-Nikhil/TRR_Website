
export default function BracketPreview({ teams }: { teams: { id?: string; name: string; color?: string }[] }) {
  // teams: expected order [semiA1, semiA2, semiB1, semiB2] where winners lead to final
  const a1 = teams[0]
  const a2 = teams[1]
  const b1 = teams[2]
  const b2 = teams[3]

  return (
    <div className="w-full flex justify-center items-center py-3 px-2">
      <div className="flex items-center gap-6 sm:gap-10">
        {/* Left semifinals */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 rounded-full" style={{ background: a1?.color ?? '#64748b' }} />
            <div className="px-3 py-2 rounded-md bg-[#0b1220] border border-white/6 text-sm font-semibold truncate" style={{ minWidth: 160 }}>{a1?.name ?? 'TBD'}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 rounded-full" style={{ background: a2?.color ?? '#64748b' }} />
            <div className="px-3 py-2 rounded-md bg-[#0b1220] border border-white/6 text-sm font-semibold truncate" style={{ minWidth: 160 }}>{a2?.name ?? 'TBD'}</div>
          </div>
        </div>

        {/* Connectors + final column */}
        <div className="relative flex items-center">
          <svg width="120" height="120" className="-translate-y-2">
            <line x1="0" y1="18" x2="40" y2="18" stroke="#334155" strokeWidth="3" />
            <line x1="0" y1="54" x2="40" y2="54" stroke="#334155" strokeWidth="3" />
            <line x1="40" y1="18" x2="80" y2="36" stroke="#334155" strokeWidth="3" />
            <line x1="40" y1="54" x2="80" y2="36" stroke="#334155" strokeWidth="3" />
            <line x1="80" y1="36" x2="120" y2="36" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
          </svg>

          <div className="ml-4">
            <div className="px-3 py-2 rounded-md bg-linear-to-br from-slate-700 to-slate-800 border border-white/6 text-sm font-extrabold text-white shadow-md">Final</div>
            <div className="mt-2 text-xs text-slate-300">Winner shown on Playoffs page</div>
          </div>
        </div>

        {/* Right semifinals */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 justify-end">
            <div className="px-3 py-2 rounded-md bg-[#0b1220] border border-white/6 text-sm font-semibold truncate text-right" style={{ minWidth: 160 }}>{b1?.name ?? 'TBD'}</div>
            <div className="w-2 h-8 rounded-full" style={{ background: b1?.color ?? '#64748b' }} />
          </div>
          <div className="flex items-center gap-3 justify-end">
            <div className="px-3 py-2 rounded-md bg-[#0b1220] border border-white/6 text-sm font-semibold truncate text-right" style={{ minWidth: 160 }}>{b2?.name ?? 'TBD'}</div>
            <div className="w-2 h-8 rounded-full" style={{ background: b2?.color ?? '#64748b' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
