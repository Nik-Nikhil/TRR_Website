import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Props {
  auctionId: string | null;
  currentPlayerId: string | null;
  hammerStage: number;
}

export function TopBidsStandalone({ auctionId, currentPlayerId, hammerStage }: Props) {
  const [bids, setBids] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevHammerRef = useRef(hammerStage);

  // Subscribe to bids directly - bypassing parent state
  useEffect(() => {
    if (!auctionId || !currentPlayerId) {
      setBids([]);
      return;
    }

    // Load initial bids
    const loadBids = async () => {
      const { data } = await supabase
        .from('auction_bids')
        .select('*')
        .eq('auction_id', auctionId)
        .eq('player_id', currentPlayerId)
        .order('created_at', { ascending: true });
      
      if (data) {
        setBids(data);
      }
    };

    loadBids();

    // Subscribe to new bids
    const channel = supabase
      .channel(`top-bids-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'auction_bids',
          filter: `auction_id=eq.${auctionId}`
        },
        (payload) => {
          const newBid = payload.new as any;
          if (newBid.player_id === currentPlayerId) {
            setBids(prev => {
              if (prev.some(b => b.id === newBid.id)) return prev;
              return [...prev, newBid];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [auctionId, currentPlayerId]);

  // Update DOM only when bids or hammer changes
  useEffect(() => {
    if (!containerRef.current) return;

    const topBids = [...bids]
      .sort((a, b) => {
        if (b.amount !== a.amount) return b.amount - a.amount;
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      })
      .slice(0, 5);

    let html = '';

    // Hammer status
    if (hammerStage === 1) {
      html += `
        <div class="mb-3 p-3 rounded-lg text-center font-bold border-2 bg-yellow-600/30 border-yellow-500">
          <span class="text-lg font-extrabold text-yellow-300">🔨 GOING ONCE!</span>
        </div>
      `;
    } else if (hammerStage === 2) {
      html += `
        <div class="mb-3 p-3 rounded-lg text-center font-bold border-2 bg-orange-600/30 border-orange-500">
          <span class="text-lg font-extrabold text-orange-300">🔨 GOING TWICE!</span>
        </div>
      `;
    } else if (hammerStage === 3) {
      html += `
        <div class="mb-3 p-3 rounded-lg text-center font-bold border-2 bg-green-600/30 border-green-500">
          <span class="text-lg font-extrabold text-green-300">🔨 SOLD!</span>
        </div>
      `;
    }

    // Bids list
    html += '<div class="flex-1 overflow-y-auto custom-standings-scroll pr-1 space-y-2" style="min-height: 0">';

    if (topBids.length === 0) {
      html += '<div class="text-gray-400 text-xs text-center py-8">No bids yet</div>';
    } else {
      topBids.forEach((bid, index) => {
        const isTop = index === 0;
        const time = new Date(bid.created_at).toLocaleTimeString();

        html += `
          <div class="relative rounded-lg p-2 border ${
            isTop
              ? 'bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border-yellow-500/70'
              : 'bg-gradient-to-br from-gray-900/50 to-gray-800/50 border-gray-600/50'
          }">
            <div class="relative z-10">
              <div class="flex items-center justify-center mb-1">
                ${isTop ? '<span class="text-sm mr-1">👑</span>' : ''}
                <span class="text-lg font-bold ${isTop ? 'text-yellow-300' : 'text-gray-300'}">
                  🪙 ${bid.amount}
                </span>
              </div>
              <div class="text-center">
                <p class="text-xs font-bold truncate ${isTop ? 'text-yellow-400' : 'text-gray-400'}">
                  ${bid.captain_name}
                </p>
                <p class="text-xs truncate ${isTop ? 'text-orange-400' : 'text-gray-500'}">
                  ${bid.team_name}
                </p>
                <p class="text-gray-500 text-[0.65rem] mt-1">
                  ${time}
                </p>
              </div>
            </div>
          </div>
        `;
      });
    }

    html += '</div>';

    containerRef.current.innerHTML = html;
    prevHammerRef.current = hammerStage;
  }, [bids, hammerStage]);

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl p-3 border-2 border-yellow-500/60 flex flex-col overflow-hidden shadow-[0_0_20px_rgba(234,179,8,0.3)]">
      <h3 className="text-white font-bold mb-2 text-sm text-center">Top Bids</h3>
      <div
        ref={containerRef}
        className="flex-1 flex flex-col overflow-hidden"
        style={{ minHeight: 0 }}
      />
    </div>
  );
}
