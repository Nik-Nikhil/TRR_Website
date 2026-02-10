import { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, CheckCircle, AlertTriangle, Play, RefreshCw } from 'lucide-react';
import { migrateAllPasswords, checkMigrationStatus } from '../../utils/migratePasswords';

export default function PasswordMigration() {
  const [migrating, setMigrating] = useState(false);
  const [migrationComplete, setMigrationComplete] = useState(false);
  const [migrationResult, setMigrationResult] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);
  const [checking, setChecking] = useState(false);

  const handleCheckStatus = async () => {
    setChecking(true);
    try {
      const result = await checkMigrationStatus();
      setStatus(result);
    } catch (error) {
      console.error('Error checking status:', error);
    } finally {
      setChecking(false);
    }
  };

  const handleMigrate = async () => {
    if (!confirm('This will migrate all default passwords to encrypted storage. Continue?')) {
      return;
    }

    setMigrating(true);
    setMigrationComplete(false);
    setMigrationResult(null);

    try {
      const result = await migrateAllPasswords();
      setMigrationResult(result);
      setMigrationComplete(true);
      
      // Refresh status
      await handleCheckStatus();
    } catch (error) {
      console.error('Migration error:', error);
      alert('Migration failed. Check console for details.');
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div className="p-8">
      <div className="bg-black/60 backdrop-blur-sm rounded-xl border border-purple-500/40 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-purple-500/20 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Database className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Password Migration</h3>
              <p className="text-sm text-gray-400">Migrate default passwords to encrypted storage</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Info Box */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-blue-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-300 mb-2">What does this do?</h4>
                <ul className="text-xs text-blue-400 space-y-1">
                  <li>• Migrates all player passwords (default: "12345") to encrypted database</li>
                  <li>• Migrates all admin passwords to encrypted database</li>
                  <li>• Passwords are encrypted using bcrypt (cannot be reversed)</li>
                  <li>• Users can change their password after migration</li>
                  <li>• Safe to run multiple times (skips already migrated passwords)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Status Check */}
          <div className="bg-gray-900/40 border border-gray-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-white">Migration Status</h4>
              <button
                onClick={handleCheckStatus}
                disabled={checking}
                className="flex items-center space-x-2 px-3 py-1.5 bg-gray-600/50 hover:bg-gray-600 border border-gray-500/50 text-gray-300 rounded text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-3 h-3 ${checking ? 'animate-spin' : ''}`} />
                <span>{checking ? 'Checking...' : 'Check Status'}</span>
              </button>
            </div>

            {status && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Players</div>
                  <div className="text-lg font-bold text-white">
                    {status.playersWithPassword} / {status.totalPlayers}
                  </div>
                  <div className="text-xs text-gray-500">migrated</div>
                </div>
                <div className="bg-black/40 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Admins</div>
                  <div className="text-lg font-bold text-white">
                    {status.adminsWithPassword} / {status.totalAdmins}
                  </div>
                  <div className="text-xs text-gray-500">migrated</div>
                </div>
              </div>
            )}
          </div>

          {/* Migration Results */}
          {migrationComplete && migrationResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Players Result */}
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <h4 className="text-sm font-semibold text-green-300">Player Migration</h4>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400">Success:</span>
                    <span className="text-green-400 font-bold ml-2">{migrationResult.players.success}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Failed:</span>
                    <span className="text-red-400 font-bold ml-2">{migrationResult.players.failed}</span>
                  </div>
                </div>
                {migrationResult.players.errors.length > 0 && (
                  <div className="mt-3 p-2 bg-red-900/20 border border-red-500/30 rounded text-xs text-red-400 max-h-32 overflow-y-auto">
                    {migrationResult.players.errors.map((error: string, i: number) => (
                      <div key={i}>• {error}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* Admins Result */}
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <h4 className="text-sm font-semibold text-green-300">Admin Migration</h4>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400">Success:</span>
                    <span className="text-green-400 font-bold ml-2">{migrationResult.admins.success}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Failed:</span>
                    <span className="text-red-400 font-bold ml-2">{migrationResult.admins.failed}</span>
                  </div>
                </div>
                {migrationResult.admins.errors.length > 0 && (
                  <div className="mt-3 p-2 bg-red-900/20 border border-red-500/30 rounded text-xs text-red-400 max-h-32 overflow-y-auto">
                    {migrationResult.admins.errors.map((error: string, i: number) => (
                      <div key={i}>• {error}</div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Migration Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handleMigrate}
              disabled={migrating}
              className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300 shadow-lg"
            >
              {migrating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Migrating Passwords...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Run Migration</span>
                </>
              )}
            </button>
          </div>

          {/* Warning */}
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-yellow-300 mb-2">Important Notes</h4>
                <ul className="text-xs text-yellow-400 space-y-1">
                  <li>• Run this migration ONCE after setting up the password system</li>
                  <li>• All players will have default password "12345" (encrypted)</li>
                  <li>• Players should change their password after first login</li>
                  <li>• This operation cannot be undone</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
