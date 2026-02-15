import { useState } from 'react';
import { updateAllPlayerData, debugPlayerData } from '../utils/updatePlayerData';

export default function UpdatePlayerData() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [result, setResult] = useState<{ success: string[]; errors: { nickname: string; error: string }[] } | null>(null);
  const [debugNickname, setDebugNickname] = useState('');

  const handleUpdate = async () => {
    if (!confirm('This will update ALL player data in the database. Continue?')) {
      return;
    }

    setIsUpdating(true);
    setResult(null);

    try {
      const updateResult = await updateAllPlayerData();
      setResult(updateResult);
    } catch (error) {
      console.error('Update failed:', error);
      alert('Update failed. Check console for details.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDebug = async () => {
    if (!debugNickname.trim()) {
      alert('Please enter a nickname');
      return;
    }
    await debugPlayerData(debugNickname);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Update Player Data</h1>

        {/* Update All Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-4">Update All Players</h2>
          <p className="text-slate-300 mb-4">
            This will update all player data in Supabase with complete information including:
          </p>
          <ul className="text-slate-300 mb-6 list-disc list-inside space-y-1">
            <li>Medals (current and peak)</li>
            <li>MMR (current and peak)</li>
            <li>Roles</li>
            <li>Favorite Heroes</li>
            <li>Season Badges</li>
            <li>Cup data</li>
            <li>Behavior scores</li>
            <li>Bio and URLs</li>
          </ul>

          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
          >
            {isUpdating ? 'Updating...' : 'Update All Player Data'}
          </button>

          {result && (
            <div className="mt-6">
              <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 mb-4">
                <p className="text-green-400 font-semibold">
                  ✅ Successfully updated {result.success.length} players
                </p>
              </div>

              {result.errors.length > 0 && (
                <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
                  <p className="text-red-400 font-semibold mb-2">
                    ❌ Failed to update {result.errors.length} players:
                  </p>
                  <ul className="text-red-300 text-sm space-y-1">
                    {result.errors.map((err, idx) => (
                      <li key={idx}>
                        {err.nickname}: {err.error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Debug Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-4">Debug Player Data</h2>
          <p className="text-slate-300 mb-4">
            Check a specific player's data in the database (check browser console for output)
          </p>

          <div className="flex gap-4">
            <input
              type="text"
              value={debugNickname}
              onChange={(e) => setDebugNickname(e.target.value)}
              placeholder="Enter player nickname"
              className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={handleDebug}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
            >
              Debug
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
