import { useState } from 'react';
import { setDefaultPasswordsForAllPlayers } from '../utils/setDefaultPasswords';
import { DEFAULT_PASSWORDS } from '../config/defaultPasswords';

export default function SetDefaultPasswords() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSetPasswords = async () => {
    if (!confirm(`Are you sure you want to set the default password "${DEFAULT_PASSWORDS.PLAYER_DEFAULT}" for ALL players?`)) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await setDefaultPasswordsForAllPlayers();
      setResult(res);
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Set Default Passwords</h1>

        <div className="bg-slate-800/90 rounded-xl p-8 border border-slate-700/50 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Current Default Password</h2>
          <div className="bg-slate-900/80 rounded-lg p-6 border border-slate-600/30">
            <p className="text-slate-300 mb-2">Default password for all players:</p>
            <code className="text-2xl font-mono text-cyan-400 bg-slate-950 px-4 py-2 rounded inline-block">
              {DEFAULT_PASSWORDS.PLAYER_DEFAULT}
            </code>
          </div>

          <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
            <p className="text-yellow-200 text-sm">
              ⚠️ <strong>Warning:</strong> This will set the same password for ALL players in the database.
              Make sure players change their passwords after first login.
            </p>
          </div>
        </div>

        <button
          onClick={handleSetPasswords}
          disabled={loading}
          className="w-full px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Setting Passwords...</span>
            </div>
          ) : (
            'Set Default Password for All Players'
          )}
        </button>

        {result && (
          <div className={`mt-8 p-6 rounded-xl border-2 ${
            result.success 
              ? 'bg-green-900/20 border-green-500/60' 
              : 'bg-red-900/20 border-red-500/60'
          }`}>
            <h3 className="text-xl font-bold text-white mb-4">
              {result.success ? '✅ Success' : '❌ Error'}
            </h3>
            
            {result.success ? (
              <div className="space-y-3">
                <p className="text-green-200">
                  ✅ Successfully updated: <strong>{result.successCount}</strong> players
                </p>
                {result.errorCount > 0 && (
                  <p className="text-yellow-200">
                    ⚠️ Errors: <strong>{result.errorCount}</strong> players
                  </p>
                )}
                <p className="text-green-200">
                  🔑 Default Password: <code className="bg-slate-950 px-2 py-1 rounded">{result.defaultPassword}</code>
                </p>
                
                {result.errors && result.errors.length > 0 && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-yellow-200 font-semibold">
                      View Errors ({result.errors.length})
                    </summary>
                    <div className="mt-3 bg-slate-950/50 p-4 rounded-lg max-h-60 overflow-auto">
                      {result.errors.map((err: any, i: number) => (
                        <div key={i} className="text-sm text-red-300 mb-2">
                          • {err.player}: {JSON.stringify(err.error)}
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            ) : (
              <p className="text-red-200">
                {result.error || 'Unknown error occurred'}
              </p>
            )}
          </div>
        )}

        <div className="mt-8 bg-slate-800/50 rounded-xl p-6 border border-slate-700/30">
          <h3 className="text-lg font-bold text-white mb-3">📝 Instructions</h3>
          <ol className="list-decimal list-inside space-y-2 text-slate-300">
            <li>Click the button above to set the default password for all players</li>
            <li>All players can now login with their nickname and the default password</li>
            <li>Inform players to change their password after first login</li>
            <li>You can change the default password in <code className="bg-slate-900 px-2 py-1 rounded text-cyan-400">src/config/defaultPasswords.ts</code></li>
          </ol>
        </div>
      </div>
    </div>
  );
}
