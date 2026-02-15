import { useState } from 'react';
import { fixCaptainIds } from '../utils/fixCaptainIds';

export default function FixCaptainIds() {
  const [isFixing, setIsFixing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFix = async () => {
    if (!confirm('This will update captain player IDs to use database UUIDs. Continue?')) {
      return;
    }

    setIsFixing(true);
    setResult(null);

    try {
      const fixResult = await fixCaptainIds();
      setResult(fixResult);
    } catch (error) {
      console.error('Fix failed:', error);
      alert('Fix failed. Check console for details.');
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Fix Captain IDs</h1>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-4">Update Captain Player IDs</h2>
          <p className="text-slate-300 mb-4">
            This will update all captain records to use the correct player UUIDs from the database.
            This is needed when captains were assigned before the UUID migration.
          </p>
          <p className="text-slate-300 mb-6">
            After running this fix, captains will be able to place bids in auctions.
          </p>

          <button
            onClick={handleFix}
            disabled={isFixing}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
          >
            {isFixing ? 'Fixing...' : 'Fix Captain IDs'}
          </button>

          {result && (
            <div className="mt-6">
              {result.success ? (
                <>
                  <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 mb-4">
                    <p className="text-green-400 font-semibold mb-2">
                      ✅ Fix completed successfully!
                    </p>
                    <div className="text-green-300 text-sm space-y-1">
                      <p>✅ Fixed: {result.fixed} captains</p>
                      <p>⏭️ Skipped (already UUID): {result.skipped} captains</p>
                      <p>❌ Errors: {result.errors} captains</p>
                    </div>
                  </div>
                  
                  {result.fixed > 0 && (
                    <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
                      <p className="text-blue-300 text-sm">
                        🎉 Captains can now place bids in auctions!
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
                  <p className="text-red-400 font-semibold">
                    ❌ Fix failed: {result.error}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-amber-900/30 border border-amber-700 rounded-lg p-6">
          <h3 className="text-xl font-bold text-amber-400 mb-3">ℹ️ What this does:</h3>
          <ul className="text-amber-200 text-sm space-y-2 list-disc list-inside">
            <li>Checks all captain records in the database</li>
            <li>For each captain with a non-UUID player_id (like "nikhil"), finds the player in the database by nickname</li>
            <li>Updates the captain record with the correct UUID from the players table</li>
            <li>Skips captains that already have UUIDs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
