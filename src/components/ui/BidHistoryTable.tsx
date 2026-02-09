import { motion, AnimatePresence } from "framer-motion";
import { Avatar } from "./Avatar";

interface BidHistoryTableProps {
  bids: Array<{
    id: string;
    captain_name: string;
    team_name: string;
    amount: number;
    created_at: string;
  }>;
  currentHighestBidderId?: string | null;
}

export function BidHistoryTable({ bids, currentHighestBidderId }: BidHistoryTableProps) {
  if (bids.length === 0) {
    return (
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/40">
        <h3 className="text-white font-bold mb-4 text-sm flex items-center gap-2">
          <span className="text-xl">📊</span>
          Bid History
        </h3>
        <div className="text-gray-400 text-xs text-center py-8">
          No bids yet. Be the first to bid!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/40">
      <h3 className="text-white font-bold mb-4 text-sm flex items-center gap-2">
        <span className="text-xl">📊</span>
        Bid History
      </h3>
      
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        <AnimatePresence>
          {bids.map((bid, index) => {
            const isHighest = index === 0;
            
            return (
              <motion.div
                key={bid.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className={`border rounded-lg p-3 transition-all ${
                  isHighest
                    ? 'bg-green-500/20 border-green-500/50 shadow-lg shadow-green-500/20'
                    : 'bg-gray-500/10 border-gray-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar
                      src=""
                      alt={bid.captain_name}
                      name={bid.captain_name}
                      size="sm"
                      className={`border-2 ${isHighest ? 'border-green-400' : 'border-gray-400'}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-xs font-semibold truncate ${
                          isHighest ? 'text-green-300' : 'text-white'
                        }`}>
                          {bid.captain_name}
                        </p>
                        {isHighest && (
                          <span className="text-xs">👑</span>
                        )}
                      </div>
                      <p className={`text-xs truncate ${
                        isHighest ? 'text-green-400' : 'text-gray-400'
                      }`}>
                        {bid.team_name}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      isHighest ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      🪙 {bid.amount}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(bid.created_at).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
