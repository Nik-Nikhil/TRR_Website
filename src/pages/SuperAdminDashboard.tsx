import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Users, Database, BarChart3,
  Zap, Terminal, LogOut, 
  Key, Search, Download, Upload, Globe,
  HardDrive, Cpu, MemoryStick, UserPlus, UserX, UserCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { admins } from '../data/admins';
import { getPendingApprovals } from '../data/pendingApprovals';
import { players } from '../data/players';
import type { Player } from '../data/players';
import RegistrationControl from '../components/admin/RegistrationControl';
import playerBanService from '../services/playerBanService';

interface Admin {
  id: string;
  username: string;
  displayName: string;
  role: string;
}

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<Player | Admin | null>(null);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  
  // Player ban management states
  const [showBanModal, setShowBanModal] = useState(false);
  const [showUnbanModal, setShowUnbanModal] = useState(false);
  const [selectedPlayerForBan, setSelectedPlayerForBan] = useState<Player | null>(null);
  const [banReason, setBanReason] = useState('');
  const [bannedPlayers, setBannedPlayers] = useState<string[]>([]);
  
  const [systemStats, setSystemStats] = useState({
    totalAdmins: 0,
    totalPlayers: players.length,
    pendingApprovals: 0,
    systemHealth: 98,
    activeUsers: 156,
    tournamentsRunning: 2,
    serverUptime: '99.9%',
    databaseSize: '2.4 GB',
    cpuUsage: 23,
    memoryUsage: 67,
    diskUsage: 45
  });

  // Website update states
  const [websiteUpdates, setWebsiteUpdates] = useState({
    lastUpdate: new Date().toISOString(),
    version: '2.1.4',
    pendingUpdates: 3
  });

  useEffect(() => {
    // Check authentication
    const superAdminSession = localStorage.getItem('superAdminSession');
    if (!superAdminSession) {
      navigate('/super-admin-login');
      return;
    }

    try {
      const session = JSON.parse(superAdminSession);
      if (!session.authenticated) {
        navigate('/super-admin-login');
        return;
      }

      // Check session expiry (4 hours)
      const loginTime = new Date(session.loginTime);
      const now = new Date();
      const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff > 4) {
        localStorage.removeItem('superAdminSession');
        navigate('/super-admin-login');
        return;
      }
    } catch (error) {
      navigate('/super-admin-login');
      return;
    }

    // Load system data
    const pending = getPendingApprovals();
    setSystemStats(prev => ({
      ...prev,
      totalAdmins: admins.length,
      totalPlayers: players.length,
      pendingApprovals: pending.length
    }));

    // Load banned players
    const loadBannedPlayers = () => {
      const banned = players.filter(player => playerBanService.isPlayerBanned(player.id)).map(p => p.id);
      setBannedPlayers(banned);
    };

    loadBannedPlayers();

    // Listen for ban changes
    const handleBanChange = () => {
      loadBannedPlayers();
    };

    window.addEventListener('playerBanChanged', handleBanChange);
    
    return () => {
      window.removeEventListener('playerBanChanged', handleBanChange);
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('superAdminSession');
    navigate('/');
  };

  const handlePasswordReset = async (userId: string, userType: 'player' | 'admin') => {
    if (!newPassword.trim()) {
      alert('Please enter a new password');
      return;
    }

    try {
      // Simulate password reset
      console.log(`Resetting password for ${userType} ${userId} to: ${newPassword}`);
      
      // In a real implementation, this would call an API
      alert(`Password reset successful for ${userType} ${userId}`);
      
      setShowPasswordReset(false);
      setNewPassword('');
      setSelectedUser(null);
    } catch (error) {
      alert('Password reset failed');
    }
  };

  // Player ban management functions
  const handleBanPlayer = (player: Player) => {
    setSelectedPlayerForBan(player);
    setShowBanModal(true);
  };

  const handleUnbanPlayer = (player: Player) => {
    setSelectedPlayerForBan(player);
    setShowUnbanModal(true);
  };

  const confirmBanPlayer = () => {
    if (!selectedPlayerForBan || !banReason.trim()) return;

    const result = playerBanService.banPlayer(
      selectedPlayerForBan.id,
      selectedPlayerForBan.nickname,
      'superadmin',
      banReason
    );

    if (result.success) {
      alert(`Player ${selectedPlayerForBan.nickname} has been banned successfully`);
      setShowBanModal(false);
      setBanReason('');
      setSelectedPlayerForBan(null);
    } else {
      alert(result.error || 'Failed to ban player');
    }
  };

  const confirmUnbanPlayer = () => {
    if (!selectedPlayerForBan) return;

    const result = playerBanService.unbanPlayer(selectedPlayerForBan.id, 'superadmin');

    if (result.success) {
      alert(`Player ${selectedPlayerForBan.nickname} has been unbanned successfully`);
      setShowUnbanModal(false);
      setSelectedPlayerForBan(null);
    } else {
      alert(result.error || 'Failed to unban player');
    }
  };

  const handleWebsiteUpdate = () => {
    // Simulate website update
    setWebsiteUpdates(prev => ({
      ...prev,
      lastUpdate: new Date().toISOString(),
      version: `2.1.${parseInt(prev.version.split('.')[2]) + 1}`,
      pendingUpdates: Math.max(0, prev.pendingUpdates - 1)
    }));
    alert('Website updated successfully!');
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* System Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 border border-orange-500/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-300/80 text-sm">System Health</p>
              <p className="text-3xl font-bold text-orange-400">{systemStats.systemHealth}%</p>
            </div>
            <Zap className="w-8 h-8 text-orange-400" />
          </div>
          <div className="mt-2 bg-black/40 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
              style={{ width: `${systemStats.systemHealth}%` }}
            />
          </div>
        </div>

        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 border border-red-500/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-300/80 text-sm">CPU Usage</p>
              <p className="text-3xl font-bold text-red-400">{systemStats.cpuUsage}%</p>
            </div>
            <Cpu className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 border border-orange-500/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-300/80 text-sm">Memory Usage</p>
              <p className="text-3xl font-bold text-orange-400">{systemStats.memoryUsage}%</p>
            </div>
            <MemoryStick className="w-8 h-8 text-orange-400" />
          </div>
        </div>

        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 border border-red-500/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-300/80 text-sm">Disk Usage</p>
              <p className="text-3xl font-bold text-red-400">{systemStats.diskUsage}%</p>
            </div>
            <HardDrive className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleWebsiteUpdate}
          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 rounded-lg p-6 text-left transition-all duration-300"
        >
          <Globe className="w-8 h-8 text-white mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Update Website</h3>
          <p className="text-orange-100/80">Deploy latest changes</p>
          <div className="mt-4 text-sm text-orange-200">
            Version: {websiteUpdates.version} • {websiteUpdates.pendingUpdates} pending
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('users')}
          className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 rounded-lg p-6 text-left transition-all duration-300"
        >
          <Users className="w-8 h-8 text-white mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Manage Users</h3>
          <p className="text-red-100/80">Reset passwords & permissions</p>
          <div className="mt-4 text-sm text-red-200">
            {systemStats.totalPlayers} players • {systemStats.totalAdmins} admins
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('database')}
          className="bg-gradient-to-r from-orange-700 to-red-700 hover:from-orange-600 hover:to-red-600 rounded-lg p-6 text-left transition-all duration-300"
        >
          <Database className="w-8 h-8 text-white mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Database Control</h3>
          <p className="text-orange-100/80">Direct database access</p>
          <div className="mt-4 text-sm text-orange-200">
            Size: {systemStats.databaseSize} • Uptime: {systemStats.serverUptime}
          </div>
        </motion.button>
      </div>
    </div>
  );

  const renderRegistrationControl = () => (
    <div className="space-y-6">
      <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 border border-orange-500/40">
        <h3 className="text-xl font-bold text-orange-300 mb-4 flex items-center">
          <UserPlus className="w-6 h-6 mr-2" />
          Super Admin Registration Control
        </h3>
        <p className="text-orange-300/80 mb-6">
          As Super Admin, you have ultimate control over registration settings. You can override admin settings and lock them from making changes.
        </p>
        
        <RegistrationControl 
          userRole="superadmin" 
          username="superadmin" 
        />
      </div>
    </div>
  );

  const renderPlayerManagement = () => (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search players by nickname or real name..."
          className="w-full pl-10 pr-4 py-3 bg-black/60 border border-orange-500/40 rounded-lg text-orange-200 placeholder-orange-400/60 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Ban Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-orange-500/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-300/80 text-sm">Total Players</p>
              <p className="text-2xl font-bold text-orange-400">{players.length}</p>
            </div>
            <Users className="w-8 h-8 text-orange-400" />
          </div>
        </div>

        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-red-500/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-300/80 text-sm">Banned Players</p>
              <p className="text-2xl font-bold text-red-400">{bannedPlayers.length}</p>
            </div>
            <UserX className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-green-500/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-300/80 text-sm">Active Players</p>
              <p className="text-2xl font-bold text-green-400">{players.length - bannedPlayers.length}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>

      {/* Players Grid */}
      <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 border border-orange-500/40">
        <h3 className="text-xl font-bold text-orange-300 mb-4 flex items-center">
          <Users className="w-6 h-6 mr-2" />
          Player Management ({players.filter(player => 
            player.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (player.realName && player.realName.toLowerCase().includes(searchQuery.toLowerCase()))
          ).length})
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
          {players
            .filter(player => 
              player.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (player.realName && player.realName.toLowerCase().includes(searchQuery.toLowerCase()))
            )
            .map((player) => {
              const isBanned = bannedPlayers.includes(player.id);
              const banDetails = isBanned ? playerBanService.getBanDetails(player.id) : null;
              
              return (
                <div key={player.id} className={`rounded-lg p-4 border transition-all duration-300 ${
                  isBanned 
                    ? 'bg-red-900/20 border-red-500/50' 
                    : 'bg-black/40 border-orange-500/20 hover:border-orange-500/50'
                }`}>
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      isBanned 
                        ? 'bg-red-600 text-white' 
                        : 'bg-green-600 text-white'
                    }`}>
                      {isBanned ? 'BANNED' : 'ACTIVE'}
                    </span>
                  </div>

                  {/* Player Info */}
                  <div className="text-center mb-4">
                    <img 
                      src={player.avatarUrl} 
                      alt={player.nickname}
                      className="w-12 h-12 rounded-full object-cover border-2 border-orange-500 mx-auto mb-2"
                      onError={(e) => {
                        e.currentTarget.src = "/avatars/default.jpg";
                      }}
                    />
                    <h4 className="text-white font-bold text-sm truncate">{player.nickname}</h4>
                    {player.realName && (
                      <p className="text-orange-300/70 text-xs truncate">{player.realName}</p>
                    )}
                    <p className="text-orange-400/60 text-xs">{player.currentMedalLabel}</p>
                  </div>

                  {/* Ban Details */}
                  {isBanned && banDetails && (
                    <div className="mb-4 p-2 bg-red-900/30 border border-red-500/50 rounded text-xs">
                      <p className="text-red-300 font-semibold mb-1">Ban Reason:</p>
                      <p className="text-red-400">{banDetails.reason}</p>
                      <p className="text-red-400/70 mt-1">
                        Banned by: {banDetails.bannedBy} • {new Date(banDetails.bannedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {!isBanned ? (
                      <button
                        onClick={() => handleBanPlayer(player)}
                        className="flex-1 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 rounded text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        <UserX className="w-3 h-3" />
                        Ban
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnbanPlayer(player)}
                        className="flex-1 px-3 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 text-green-300 rounded text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                      >
                        <UserCheck className="w-3 h-3" />
                        Unban
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedUser(player);
                        setShowPasswordReset(true);
                      }}
                      className="px-3 py-2 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/50 text-orange-300 rounded text-xs transition-colors cursor-pointer"
                    >
                      <Key className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );

  const renderDatabaseControl = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          className="bg-black/60 backdrop-blur-sm rounded-lg p-6 border border-orange-500/40 text-left"
        >
          <Download className="w-8 h-8 text-orange-400 mb-4" />
          <h3 className="text-lg font-bold text-orange-300 mb-2">Backup Database</h3>
          <p className="text-orange-300/70 text-sm">Create full system backup</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          className="bg-black/60 backdrop-blur-sm rounded-lg p-6 border border-red-500/40 text-left"
        >
          <Upload className="w-8 h-8 text-red-400 mb-4" />
          <h3 className="text-lg font-bold text-red-300 mb-2">Restore Database</h3>
          <p className="text-red-300/70 text-sm">Restore from backup</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          className="bg-black/60 backdrop-blur-sm rounded-lg p-6 border border-orange-500/40 text-left"
        >
          <Terminal className="w-8 h-8 text-orange-400 mb-4" />
          <h3 className="text-lg font-bold text-orange-300 mb-2">SQL Console</h3>
          <p className="text-orange-300/70 text-sm">Direct database queries</p>
        </motion.button>
      </div>

      {/* Database Stats */}
      <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 border border-orange-500/40">
        <h3 className="text-xl font-bold text-orange-300 mb-4">Database Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">{systemStats.totalPlayers}</div>
            <div className="text-orange-300/70 text-sm">Players</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{systemStats.totalAdmins}</div>
            <div className="text-red-300/70 text-sm">Admins</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">{systemStats.databaseSize}</div>
            <div className="text-orange-300/70 text-sm">Size</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{systemStats.serverUptime}</div>
            <div className="text-red-300/70 text-sm">Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search players or admins..."
          className="w-full pl-10 pr-4 py-3 bg-black/60 border border-orange-500/40 rounded-lg text-orange-200 placeholder-orange-400/60 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Admins Section */}
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 border border-red-500/40">
          <h3 className="text-xl font-bold text-red-300 mb-4 flex items-center">
            <Shield className="w-6 h-6 mr-2" />
            Admins ({admins.length})
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {admins.map((admin) => (
              <div key={admin.id} className="bg-black/40 rounded-lg p-4 border border-red-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-red-200 font-medium">{admin.displayName}</h4>
                    <p className="text-red-300/70 text-sm">@{admin.username}</p>
                    <p className="text-red-400/60 text-xs">Role: {admin.role}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedUser(admin);
                      setShowPasswordReset(true);
                    }}
                    className="px-3 py-1 bg-orange-600/20 hover:bg-orange-600/40 border border-orange-500/50 text-orange-300 rounded text-sm transition-colors"
                  >
                    <Key className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-orange-900/20 to-red-900/30" />
        <div className="absolute inset-0 bg-[url('/bg5.webp')] bg-cover bg-center opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center">
            <Shield className="w-12 h-12 text-orange-400 mr-4" />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 bg-clip-text text-transparent">
                Super Admin Console
              </h1>
              <p className="text-orange-300/80">Ultimate system control & management</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-700 to-red-700 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition-all duration-300"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-black/40 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'registration', label: 'Registration Control', icon: UserPlus },
            { id: 'players', label: 'Player Management', icon: Users },
            { id: 'users', label: 'User Management', icon: Key },
            { id: 'database', label: 'Database Control', icon: Database },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                  : 'text-orange-300 hover:text-orange-200 hover:bg-black/20'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'registration' && renderRegistrationControl()}
          {activeTab === 'players' && renderPlayerManagement()}
          {activeTab === 'users' && renderUserManagement()}
          {activeTab === 'database' && renderDatabaseControl()}
        </motion.div>

        {/* Password Reset Modal */}
        {showPasswordReset && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black/90 border border-orange-500/40 rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-orange-300 mb-4 flex items-center">
                <Key className="w-6 h-6 mr-2" />
                Reset Password
              </h3>
              
              <div className="mb-6">
                <p className="text-orange-200 mb-2">
                  {'nickname' in selectedUser ? 'Player' : 'Admin'}: {'nickname' in selectedUser ? selectedUser.nickname : selectedUser.displayName}
                </p>
                <p className="text-orange-300/70 text-sm">
                  {'nickname' in selectedUser ? `ID: ${selectedUser.id}` : `Username: ${selectedUser.username}`}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-orange-300 text-sm mb-2">New Password</label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-black/60 border border-orange-500/40 rounded-lg text-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter new password"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => handlePasswordReset(
                    selectedUser.id, 
                    'nickname' in selectedUser ? 'player' : 'admin'
                  )}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-lg transition-all duration-300"
                >
                  Reset Password
                </button>
                <button
                  onClick={() => {
                    setShowPasswordReset(false);
                    setSelectedUser(null);
                    setNewPassword('');
                  }}
                  className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Ban Player Modal */}
        {showBanModal && selectedPlayerForBan && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black/90 border border-red-500/40 rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-red-300 mb-4 flex items-center">
                <UserX className="w-6 h-6 mr-2" />
                Ban Player
              </h3>
              
              <div className="text-center mb-6">
                <img 
                  src={selectedPlayerForBan.avatarUrl} 
                  alt={selectedPlayerForBan.nickname}
                  className="w-16 h-16 rounded-full object-cover border-4 border-red-500 mx-auto mb-2"
                  onError={(e) => {
                    e.currentTarget.src = "/avatars/default.jpg";
                  }}
                />
                <h4 className="text-white font-bold">{selectedPlayerForBan.nickname}</h4>
                <p className="text-red-400 text-sm">{selectedPlayerForBan.currentMedalLabel}</p>
              </div>

              <div className="mb-6">
                <label className="block text-red-300 text-sm mb-2">Ban Reason *</label>
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="Enter reason for banning this player..."
                  className="w-full px-4 py-3 bg-black/60 border border-red-500/40 rounded-lg text-red-200 placeholder-red-400/60 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  rows={3}
                  maxLength={200}
                />
                <p className="text-xs text-red-400 mt-1">{banReason.length}/200 characters</p>
              </div>

              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-semibold text-red-300 mb-2">⚠️ Warning:</h4>
                <ul className="text-xs text-red-400 space-y-1">
                  <li>• Player will be banned from registration</li>
                  <li>• Profile will show "Disabled by Admins"</li>
                  <li>• Cannot participate until unbanned</li>
                  <li>• Ban reason will be logged</li>
                </ul>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowBanModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBanPlayer}
                  disabled={!banReason.trim()}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300"
                >
                  Ban Player
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Unban Player Modal */}
        {showUnbanModal && selectedPlayerForBan && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black/90 border border-green-500/40 rounded-2xl p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-green-300 mb-4 flex items-center">
                <UserCheck className="w-6 h-6 mr-2" />
                Unban Player
              </h3>
              
              <div className="text-center mb-6">
                <img 
                  src={selectedPlayerForBan.avatarUrl} 
                  alt={selectedPlayerForBan.nickname}
                  className="w-16 h-16 rounded-full object-cover border-4 border-green-500 mx-auto mb-2"
                  onError={(e) => {
                    e.currentTarget.src = "/avatars/default.jpg";
                  }}
                />
                <h4 className="text-white font-bold">{selectedPlayerForBan.nickname}</h4>
                <p className="text-green-400 text-sm">{selectedPlayerForBan.currentMedalLabel}</p>
              </div>

              {playerBanService.getBanDetails(selectedPlayerForBan.id) && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-semibold text-red-300 mb-2">Current Ban Reason:</h4>
                  <p className="text-red-400 text-sm">{playerBanService.getBanDetails(selectedPlayerForBan.id)?.reason}</p>
                </div>
              )}

              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-semibold text-green-300 mb-2">✅ Unbanning will:</h4>
                <ul className="text-xs text-green-400 space-y-1">
                  <li>• Restore player registration access</li>
                  <li>• Remove "Disabled by Admins" from profile</li>
                  <li>• Allow participation in tournaments</li>
                  <li>• Clear ban record</li>
                </ul>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowUnbanModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmUnbanPlayer}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all duration-300"
                >
                  Unban Player
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}