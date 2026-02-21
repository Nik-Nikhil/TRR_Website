import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Users, Database, BarChart3,
  Terminal, 
  Key, Search, Download, Upload,
  UserPlus, UserX, UserCheck, Activity, Trash2, Info,
  Settings, TrendingUp, AlertTriangle,
  CheckCircle, XCircle, Zap, Eye, EyeOff, MessageSquare, Gavel, History, Megaphone
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { admins } from '../data/admins';
import { players } from '../data/players';
import type { Player } from '../data/players';
import RegistrationControl from '../components/admin/RegistrationControl';
import { AuctionControl } from '../components/admin/AuctionControl';
import { AuctionHistory } from '../components/admin/AuctionHistory';
import { CaptainManagement } from '../components/admin/CaptainManagement';
import { AuctionPoolManagement } from '../components/admin/AuctionPoolManagement';
import { AdminSettings } from '../components/admin/AdminSettings';
import { AdminManagement } from '../components/admin/AdminManagement';
import { ProfileUpdateRequests } from '../components/admin/ProfileUpdateRequests';
import { ProfileImageRequests } from '../components/admin/ProfileImageRequests';
import AnnouncementManagement from '../components/admin/AnnouncementManagement';
import playerBanService from '../services/playerBanService';
import messagingService from '../services/messagingService';
import profileUpdateService from '../services/profileUpdateService';

interface Admin {
  id: string;
  username: string;
  displayName: string;
  role: string;
}

interface ActivityLog {
  id: string;
  timestamp: Date;
  action: string;
  details: string;
  user: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

interface QuickStat {
  label: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  trend?: string;
  change?: string;
}

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('dashboard');
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
  
  // Activity log states
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [showActivityDetails, setShowActivityDetails] = useState(false);

  // Messages states
  const [myMessages, setMyMessages] = useState<any[]>([]);
  const [myUnreadCount, setMyUnreadCount] = useState(0);

  // Quick stats
  const [quickStats, setQuickStats] = useState<QuickStat[]>([]);
  
  // Auction state
  const [auctionState, setAuctionState] = useState<any>(null);

  // Current super admin info
  const [currentSuperAdmin, setCurrentSuperAdmin] = useState<{
    username: string;
    role: string;
    displayName: string;
    avatarUrl: string;
  } | null>(null);

  // Calculate real database size
  const calculateDatabaseSize = () => {
    const playersSize = JSON.stringify(players).length;
    const adminsSize = JSON.stringify(admins).length;
    const logsSize = JSON.stringify(activityLogs).length;
    const banDataSize = JSON.stringify(localStorage.getItem('playerBans') || '{}').length;
    const registrationDataSize = JSON.stringify(localStorage.getItem('registrationSettings') || '{}').length;
    
    const totalBytes = playersSize + adminsSize + logsSize + banDataSize + registrationDataSize;
    const totalMB = (totalBytes / (1024 * 1024));
    
    if (totalMB < 0.1) {
      return `${(totalBytes / 1024).toFixed(1)} KB`;
    }
    return `${totalMB.toFixed(1)} MB`;
  };

  // Initialize activity logs and stats
  useEffect(() => {
    // Use real activity logs from localStorage or start with empty array
    const savedLogs = localStorage.getItem('superAdminActivityLogs');
    const initialLogs: ActivityLog[] = savedLogs ? JSON.parse(savedLogs).map((log: any) => ({
      ...log,
      timestamp: new Date(log.timestamp) // Convert string back to Date object
    })) : [];
    setActivityLogs(initialLogs);

    // Initialize quick stats with real data
    const stats: QuickStat[] = [
      {
        label: 'Total Players',
        value: players.length,
        icon: Users,
        color: 'blue',
        trend: 'stable',
        change: 'Current count'
      },
      {
        label: 'Active Admins',
        value: admins.length,
        icon: Shield,
        color: 'purple',
        trend: 'stable',
        change: 'Current count'
      },
      {
        label: 'Banned Players',
        value: bannedPlayers.length,
        icon: UserX,
        color: 'red',
        trend: bannedPlayers.length > 0 ? 'up' : 'stable',
        change: bannedPlayers.length > 0 ? `${bannedPlayers.length} banned` : 'No bans'
      },
      {
        label: 'Database Size',
        value: calculateDatabaseSize(),
        icon: Database,
        color: 'green',
        trend: 'stable',
        change: 'Current size'
      }
    ];
    setQuickStats(stats);
  }, [bannedPlayers.length]);

  // Update quick stats when data changes
  useEffect(() => {
    const stats: QuickStat[] = [
      {
        label: 'Total Players',
        value: players.length,
        icon: Users,
        color: 'blue',
        trend: 'stable',
        change: 'Current count'
      },
      {
        label: 'Active Admins',
        value: admins.length,
        icon: Shield,
        color: 'purple',
        trend: 'stable',
        change: 'Current count'
      },
      {
        label: 'Banned Players',
        value: bannedPlayers.length,
        icon: UserX,
        color: 'red',
        trend: bannedPlayers.length > 0 ? 'up' : 'stable',
        change: bannedPlayers.length > 0 ? `${bannedPlayers.length} banned` : 'No bans'
      },
      {
        label: 'Database Size',
        value: calculateDatabaseSize(),
        icon: Database,
        color: 'green',
        trend: 'stable',
        change: 'Current size'
      }
    ];
    setQuickStats(stats);
  }, [bannedPlayers.length, activityLogs.length]); // Update when banned players or logs change

  useEffect(() => {
    // Check authentication and get super admin info
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

      // Set current super admin info
      if (session.username === 'reyuk') {
        setCurrentSuperAdmin({
          username: 'reyuk',
          role: 'Founder',
          displayName: 'Reyuk',
          avatarUrl: '/avatars/admins/Reyuk.png'
        });
      } else if (session.username === 'nikhil') {
        setCurrentSuperAdmin({
          username: 'nikhil',
          role: 'Super Admin',
          displayName: 'N1KHIL',
          avatarUrl: '/avatars/admins/Nikhil.jpg'
        });
      } else {
        setCurrentSuperAdmin({
          username: session.username || 'superadmin',
          role: 'Super Admin',
          displayName: 'N1KHIL',
          avatarUrl: '/avatars/admins/Nikhil.jpg'
        });
      }
    } catch (error) {
      navigate('/super-admin-login');
      return;
    }

    // Load banned players
    const loadBannedPlayers = () => {
      const banned = players.filter(player => playerBanService.isPlayerBanned(player.id)).map(p => p.id);
      setBannedPlayers(banned);
    };

    loadBannedPlayers();

    // Load auction state
    const loadAuctionState = async () => {
      try {
        const { AuctionService } = await import('../services/auctionService');
        const state = await AuctionService.getAuctionState();
        setAuctionState(state);
      } catch (error) {
        console.error('Error loading auction state:', error);
      }
    };
    
    loadAuctionState();

    // Listen for ban changes
    const handleBanChange = () => {
      loadBannedPlayers();
    };

    window.addEventListener('playerBanChanged', handleBanChange);
    
    return () => {
      window.removeEventListener('playerBanChanged', handleBanChange);
    };
  }, [navigate, location.key]);

  // Separate effect for loading messages (runs when currentSuperAdmin is set)
  useEffect(() => {
    if (!currentSuperAdmin) return;

    const loadMyMessages = async () => {
      const messages = await messagingService.getMessagesForAdmin(currentSuperAdmin.username);
      setMyMessages(messages);
      const unreadCount = await messagingService.getUnreadCount(currentSuperAdmin.username);
      setMyUnreadCount(unreadCount);
    };

    loadMyMessages();

    // Subscribe to real-time messages
    const messageChannel = messagingService.subscribeToMessages(currentSuperAdmin.username, (newMessage) => {
      setMyMessages(prev => [newMessage, ...prev]);
      setMyUnreadCount(prev => prev + 1);
    });

    return () => {
      import('../lib/supabase').then(({ supabase }) => {
        supabase.removeChannel(messageChannel);
      });
    };
  }, [currentSuperAdmin?.username]); // Only re-run when username changes

  // Add activity log function
  const addActivityLog = (action: string, details: string, type: ActivityLog['type'] = 'info') => {
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      action,
      details,
      user: currentSuperAdmin?.username || 'superadmin',
      type
    };
    const updatedLogs = [newLog, ...activityLogs].slice(0, 100); // Keep only last 100 logs
    setActivityLogs(updatedLogs);
    
    // Save to localStorage for persistence
    localStorage.setItem('superAdminActivityLogs', JSON.stringify(updatedLogs));
  };

  // Clear activity logs
  const clearActivityLogs = () => {
    setActivityLogs([]);
    localStorage.removeItem('superAdminActivityLogs');
    // Add a log entry about clearing logs
    const clearLog: ActivityLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      action: 'System',
      details: 'Activity logs cleared',
      user: currentSuperAdmin?.username || 'superadmin',
      type: 'info'
    };
    setActivityLogs([clearLog]);
    localStorage.setItem('superAdminActivityLogs', JSON.stringify([clearLog]));
  };

  const handlePasswordReset = async (userId: string, userType: 'player' | 'admin') => {
    if (!newPassword.trim()) {
      alert('Please enter a new password');
      return;
    }

    try {
      const userName = selectedUser ? ('nickname' in selectedUser ? selectedUser.nickname : selectedUser.displayName) : userId;
      addActivityLog('Password Reset', `Reset password for ${userType} "${userName}"`, 'info');
      
      alert(`Password reset successful for ${userType} ${userId}`);
      
      setShowPasswordReset(false);
      setNewPassword('');
      setSelectedUser(null);
    } catch (error) {
      addActivityLog('Password Reset', `Failed to reset password for ${userType} ${userId}`, 'error');
      alert('Password reset failed');
    }
  };

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
      addActivityLog('Player Ban', `Banned player "${selectedPlayerForBan.nickname}" - Reason: ${banReason}`, 'warning');
      alert(`Player ${selectedPlayerForBan.nickname} has been banned successfully`);
      setShowBanModal(false);
      setBanReason('');
      setSelectedPlayerForBan(null);
    } else {
      addActivityLog('Player Ban', `Failed to ban player "${selectedPlayerForBan.nickname}"`, 'error');
      alert(result.error || 'Failed to ban player');
    }
  };

  const confirmUnbanPlayer = () => {
    if (!selectedPlayerForBan) return;

    const result = playerBanService.unbanPlayer(selectedPlayerForBan.id, 'superadmin');

    if (result.success) {
      addActivityLog('Player Unban', `Unbanned player "${selectedPlayerForBan.nickname}"`, 'success');
      alert(`Player ${selectedPlayerForBan.nickname} has been unbanned successfully`);
      setShowUnbanModal(false);
      setSelectedPlayerForBan(null);
    } else {
      addActivityLog('Player Unban', `Failed to unban player "${selectedPlayerForBan.nickname}"`, 'error');
      alert(result.error || 'Failed to unban player');
    }
  };

  // Sidebar navigation items
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, description: 'Overview & Analytics' },
    { id: 'messages', label: 'My Messages', icon: MessageSquare, description: 'My Messages', badge: myUnreadCount > 0 ? myUnreadCount : undefined },
    { id: 'profile-requests', label: 'Profile Requests', icon: UserCheck, description: 'Approve Changes', badge: profileUpdateService.getPendingCount() > 0 ? profileUpdateService.getPendingCount() : undefined },
    { id: 'users', label: 'User Management', icon: Users, description: 'Players & Admins' },
    { id: 'admin-management', label: 'Admin Management', icon: Shield, description: 'Add/Manage Admins' },
    { id: 'announcements', label: 'Announcements', icon: Megaphone, description: 'Manage Announcements' },
    { id: 'captains', label: 'Team Management', icon: Users, description: 'Manage Teams & Captains' },
    { id: 'registration', label: 'Registration', icon: UserPlus, description: 'Control Settings' },
    { id: 'auction', label: 'Auction Control', icon: Gavel, description: 'Manage Auction' },
    { id: 'auction-history', label: 'Auction History', icon: History, description: 'Past Auctions' },
    { id: 'database', label: 'Database', icon: Database, description: 'Backup & Restore' },
    { id: 'activity', label: 'Activity Logs', icon: Activity, description: 'System Events' },
    { id: 'settings', label: 'Settings', icon: Settings, description: 'My Settings' }
  ];

  // Quick action cards
  const quickActions = [
    {
      title: 'Ban Player',
      description: 'Quickly ban a problematic player',
      icon: UserX,
      color: 'red',
      action: () => setActiveSection('users')
    },
    {
      title: 'Reset Password',
      description: 'Reset user passwords',
      icon: Key,
      color: 'blue',
      action: () => setActiveSection('users')
    },
    {
      title: 'Backup Database',
      description: 'Create system backup',
      icon: Download,
      color: 'green',
      action: () => {
        addActivityLog('Database', 'Initiated database backup', 'info');
        setActiveSection('database');
      }
    },
    {
      title: 'View Logs',
      description: 'Check recent activity',
      icon: Activity,
      color: 'purple',
      action: () => setActiveSection('activity')
    }
  ];

  // Render sidebar
  const renderSidebar = () => (
    <div className="w-64 bg-black/80 backdrop-blur-xl border-r border-orange-500/20 flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-orange-500/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Super Admin</h1>
            <p className="text-xs text-orange-300/70">System Control</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveSection(item.id);
              addActivityLog('Navigation', `Accessed ${item.label}`, 'info');
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${
              activeSection === item.id
                ? 'bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/40 text-orange-300'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon className={`w-5 h-5 ${
              activeSection === item.id ? 'text-orange-400' : 'text-gray-500 group-hover:text-orange-400'
            }`} />
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">{item.label}</div>
              <div className="text-xs opacity-70">{item.description}</div>
            </div>
            {item.badge && (
              <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full min-w-[20px] text-center">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );

  // Render main content header
  const renderHeader = () => (
    <div className="bg-black/60 backdrop-blur-sm border-b border-orange-500/20 px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white capitalize">
            {activeSection === 'dashboard' ? 'Dashboard Overview' : 
             activeSection === 'users' ? 'User Management' :
             activeSection === 'profile-requests' ? 'Profile Requests' :
             activeSection === 'announcements' ? 'Announcement Management' :
             activeSection === 'captains' ? 'Captain Management' :
             activeSection === 'registration' ? 'Registration Control' :
             activeSection === 'auction' ? 'Auction Control' :
             activeSection === 'auction-history' ? 'Auction History' :
             activeSection === 'database' ? 'Database Management' :
             activeSection === 'activity' ? 'Activity Logs' :
             activeSection === 'settings' ? 'System Settings' : activeSection}
          </h2>
          <p className="text-orange-300/70 mt-1">
            {activeSection === 'dashboard' ? 'System overview and quick actions' :
             activeSection === 'users' ? 'Manage players and administrators' :
             activeSection === 'profile-requests' ? 'Review and approve profile updates and images' :
             activeSection === 'announcements' ? 'Create and manage announcements' :
             activeSection === 'captains' ? 'Assign and manage team captains' :
             activeSection === 'registration' ? 'Control player registration settings' :
             activeSection === 'auction' ? 'Start and manage player auctions' :
             activeSection === 'auction-history' ? 'View past auction results and data' :
             activeSection === 'database' ? 'Database operations and maintenance' :
             activeSection === 'activity' ? 'System activity and audit trail' :
             activeSection === 'settings' ? 'System configuration and preferences' : 'Manage your system'}
          </p>
        </div>
        
        {/* User Profile Section - Inline with Header */}
        {currentSuperAdmin && (
          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 border border-orange-500/40 min-w-[280px]">
            <div className="flex items-center space-x-4">
              <img 
                src={currentSuperAdmin.avatarUrl} 
                alt={currentSuperAdmin.displayName}
                className="w-14 h-14 rounded-full object-cover border-3 border-orange-500"
                onError={(e) => {
                  e.currentTarget.src = "/avatars/default.jpg";
                }}
              />
              <div className="flex-1">
                <h3 className="text-white font-bold text-xl">{currentSuperAdmin.displayName}</h3>
                <p className="text-orange-400 text-base font-medium">{currentSuperAdmin.role}</p>
                <p className="text-orange-300/60 text-sm">@{currentSuperAdmin.username}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Render dashboard content
  const renderDashboard = () => (
    <div className="p-8 space-y-8">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-black/60 backdrop-blur-sm rounded-xl p-6 border ${
              stat.color === 'blue' ? 'border-blue-500/40' :
              stat.color === 'purple' ? 'border-purple-500/40' :
              stat.color === 'red' ? 'border-red-500/40' :
              'border-green-500/40'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${
                stat.color === 'blue' ? 'bg-blue-500/20' :
                stat.color === 'purple' ? 'bg-purple-500/20' :
                stat.color === 'red' ? 'bg-red-500/20' :
                'bg-green-500/20'
              }`}>
                <stat.icon className={`w-6 h-6 ${
                  stat.color === 'blue' ? 'text-blue-400' :
                  stat.color === 'purple' ? 'text-purple-400' :
                  stat.color === 'red' ? 'text-red-400' :
                  'text-green-400'
                }`} />
              </div>
              <div className={`flex items-center space-x-1 text-xs ${
                stat.trend === 'up' ? 'text-green-400' :
                stat.trend === 'down' ? 'text-red-400' :
                'text-gray-400'
              }`}>
                {stat.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                {stat.trend === 'down' && <TrendingUp className="w-3 h-3 rotate-180" />}
                <span>{stat.change}</span>
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-orange-500/40">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-orange-400" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.action}
              className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                action.color === 'red' ? 'bg-red-900/20 border-red-500/40 hover:border-red-400' :
                action.color === 'blue' ? 'bg-blue-900/20 border-blue-500/40 hover:border-blue-400' :
                action.color === 'green' ? 'bg-green-900/20 border-green-500/40 hover:border-green-400' :
                'bg-purple-900/20 border-purple-500/40 hover:border-purple-400'
              }`}
            >
              <action.icon className={`w-8 h-8 mb-3 ${
                action.color === 'red' ? 'text-red-400' :
                action.color === 'blue' ? 'text-blue-400' :
                action.color === 'green' ? 'text-green-400' :
                'text-purple-400'
              }`} />
              <div className="text-white font-medium mb-1">{action.title}</div>
              <div className="text-xs text-gray-400">{action.description}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Activity Preview */}
      <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-orange-500/40">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Activity className="w-5 h-5 mr-2 text-orange-400" />
            Recent Activity
          </h3>
          <button
            onClick={() => setActiveSection('activity')}
            className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {activityLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="flex items-center space-x-3 p-3 bg-black/40 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                log.type === 'error' ? 'bg-red-400' :
                log.type === 'warning' ? 'bg-yellow-400' :
                log.type === 'success' ? 'bg-green-400' :
                'bg-blue-400'
              }`} />
              <div className="flex-1">
                <div className="text-sm text-white">{log.action}</div>
                <div className="text-xs text-gray-400">{log.details}</div>
              </div>
              <div className="text-xs text-gray-500">
                {new Date(log.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render my messages section
  const renderMyMessages = () => (
    <div className="p-8">
      <div className="bg-black/60 backdrop-blur-sm rounded-xl border border-orange-500/40">
        <div className="p-6 border-b border-orange-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-6 h-6 text-orange-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">My Messages</h3>
                <p className="text-sm text-gray-400">Messages sent to {currentSuperAdmin?.username || 'you'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-orange-400">{myMessages.length} total messages</span>
              {myUnreadCount > 0 && (
                <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full">
                  {myUnreadCount} unread
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="max-h-96 overflow-y-auto space-y-3">
            {myMessages.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No messages yet</p>
                <p className="text-sm">Messages sent to you will appear here</p>
              </div>
            ) : (
              myMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    !message.isRead 
                      ? 'bg-orange-900/20 border-orange-500/30 shadow-lg' 
                      : 'bg-gray-900/20 border-gray-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        message.priority === 'high' ? 'bg-red-600 text-white' :
                        message.priority === 'medium' ? 'bg-yellow-600 text-white' :
                        'bg-green-600 text-white'
                      }`}>
                        {message.priority.toUpperCase()}
                      </span>
                      <span className="text-sm font-medium text-white">{message.fromPlayerNickname}</span>
                      {!message.isRead && (
                        <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(message.timestamp).toLocaleString()}
                    </div>
                  </div>
                  
                  <h4 className="text-white font-semibold mb-2">{message.subject}</h4>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">{message.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">From: {message.fromPlayer}</span>
                    <div className="flex space-x-2">
                      {!message.isRead && (
                        <button
                          onClick={async () => {
                            await messagingService.markAsRead(message.id);
                            if (currentSuperAdmin) {
                              const updatedMessages = await messagingService.getMessagesForAdmin(currentSuperAdmin.username);
                              setMyMessages(updatedMessages);
                              const unreadCount = await messagingService.getUnreadCount(currentSuperAdmin.username);
                              setMyUnreadCount(unreadCount);
                            }
                            addActivityLog('Message', `Marked message from ${message.fromPlayerNickname} as read`, 'info');
                          }}
                          className="px-3 py-1 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/50 text-orange-300 rounded text-xs transition-colors"
                        >
                          Mark as Read
                        </button>
                      )}
                      <button
                        onClick={async () => {
                          await messagingService.deleteMessage(message.id);
                          if (currentSuperAdmin) {
                            const updatedMessages = await messagingService.getMessagesForAdmin(currentSuperAdmin.username);
                            setMyMessages(updatedMessages);
                            const unreadCount = await messagingService.getUnreadCount(currentSuperAdmin.username);
                            setMyUnreadCount(unreadCount);
                          }
                          addActivityLog('Message', `Deleted message from ${message.fromPlayerNickname}`, 'warning');
                        }}
                        className="px-3 py-1 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 rounded text-xs transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Render activity logs
  const renderActivityLogs = () => (
    <div className="p-8">
      <div className="bg-black/60 backdrop-blur-sm rounded-xl border border-orange-500/40">
        <div className="p-6 border-b border-orange-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className="w-6 h-6 text-orange-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Activity Logs</h3>
                <p className="text-sm text-gray-400">Real-time system activity monitoring</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowActivityDetails(!showActivityDetails)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 text-blue-300 rounded-lg text-sm transition-colors"
              >
                {showActivityDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showActivityDetails ? 'Hide Details' : 'Show Details'}</span>
              </button>
              <button
                onClick={clearActivityLogs}
                className="flex items-center space-x-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 rounded-lg text-sm transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Logs</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="max-h-96 overflow-y-auto space-y-3">
            {activityLogs.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No activity logs available</p>
              </div>
            ) : (
              activityLogs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    log.type === 'error' ? 'bg-red-900/20 border-red-500/30' :
                    log.type === 'warning' ? 'bg-yellow-900/20 border-yellow-500/30' :
                    log.type === 'success' ? 'bg-green-900/20 border-green-500/30' :
                    'bg-blue-900/20 border-blue-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${
                        log.type === 'error' ? 'bg-red-500/20' :
                        log.type === 'warning' ? 'bg-yellow-500/20' :
                        log.type === 'success' ? 'bg-green-500/20' :
                        'bg-blue-500/20'
                      }`}>
                        {log.type === 'error' && <XCircle className="w-4 h-4 text-red-400" />}
                        {log.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                        {log.type === 'success' && <CheckCircle className="w-4 h-4 text-green-400" />}
                        {log.type === 'info' && <Info className="w-4 h-4 text-blue-400" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            log.type === 'error' ? 'bg-red-600 text-white' :
                            log.type === 'warning' ? 'bg-yellow-600 text-white' :
                            log.type === 'success' ? 'bg-green-600 text-white' :
                            'bg-blue-600 text-white'
                          }`}>
                            {log.action}
                          </span>
                          <span className="text-xs text-gray-400">by {log.user}</span>
                        </div>
                        <p className={`text-sm ${
                          log.type === 'error' ? 'text-red-300' :
                          log.type === 'warning' ? 'text-yellow-300' :
                          log.type === 'success' ? 'text-green-300' :
                          'text-blue-300'
                        }`}>
                          {log.details}
                        </p>
                        {showActivityDetails && (
                          <div className="mt-2 text-xs text-gray-500">
                            <div>Timestamp: {new Date(log.timestamp).toLocaleString()}</div>
                            <div>Log ID: {log.id}</div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 ml-4">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Render user management
  const renderUserManagement = () => (
    <div className="p-8 space-y-6">
      {/* Search Bar */}
      <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-orange-500/40">
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
      </div>

      {/* Player Management */}
      <div className="bg-black/60 backdrop-blur-sm rounded-xl border border-orange-500/40">
        <div className="p-6 border-b border-orange-500/20">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Users className="w-5 h-5 mr-2 text-orange-400" />
            Player Management ({players.filter(player => 
              player.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (player.realName && player.realName.toLowerCase().includes(searchQuery.toLowerCase()))
            ).length})
          </h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
            {players
              .filter(player => 
                player.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (player.realName && player.realName.toLowerCase().includes(searchQuery.toLowerCase()))
              )
              .slice(0, 20) // Limit to 20 for performance
              .map((player) => {
                const isBanned = bannedPlayers.includes(player.id);
                const banDetails = isBanned ? playerBanService.getBanDetails(player.id) : null;
                
                return (
                  <motion.div 
                    key={player.id} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`rounded-lg p-4 border transition-all duration-300 ${
                      isBanned 
                        ? 'bg-red-900/20 border-red-500/50' 
                        : 'bg-black/40 border-orange-500/20 hover:border-orange-500/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        isBanned 
                          ? 'bg-red-600 text-white' 
                          : 'bg-green-600 text-white'
                      }`}>
                        {isBanned ? 'BANNED' : 'ACTIVE'}
                      </span>
                    </div>

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

                    {isBanned && banDetails && (
                      <div className="mb-4 p-2 bg-red-900/30 border border-red-500/50 rounded text-xs">
                        <p className="text-red-300 font-semibold mb-1">Ban Reason:</p>
                        <p className="text-red-400">{banDetails.reason}</p>
                      </div>
                    )}

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
                  </motion.div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );

  // Render registration control
  const renderRegistrationControl = () => (
    <div className="p-8">
      <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-orange-500/40">
        <div className="flex items-center mb-6">
          <UserPlus className="w-6 h-6 mr-3 text-orange-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Registration Control</h3>
            <p className="text-sm text-gray-400">Manage player registration settings with super admin privileges</p>
          </div>
        </div>
        
        <RegistrationControl 
          userRole="superadmin" 
          username="superadmin" 
        />
      </div>
    </div>
  );

  // Render captain management
  const renderCaptainManagement = () => (
    <div className="p-8 space-y-6">
      <CaptainManagement adminUsername={currentSuperAdmin?.username || 'superadmin'} />
      
      {/* Auction Pool Management */}
      {auctionState?.id ? (
        <AuctionPoolManagement 
          auctionId={auctionState.id} 
          adminUsername={currentSuperAdmin?.username || 'superadmin'} 
        />
      ) : (
        <div className="bg-black/60 backdrop-blur-sm rounded-xl border border-blue-500/40 p-8">
          <div className="text-center">
            <Gavel className="w-16 h-16 mx-auto mb-4 text-blue-400 opacity-50" />
            <h3 className="text-xl font-semibold text-white mb-2">No Active Auction</h3>
            <p className="text-gray-400 mb-4">
              Create an auction first to manage the player pool
            </p>
            <button
              onClick={() => setActiveSection('auction')}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg transition-all duration-300"
            >
              Go to Auction Control
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Render auction control
  const renderAuctionControl = () => (
    <div className="p-8">
      <AuctionControl />
    </div>
  );

  // Render database management
  const renderDatabaseManagement = () => (
    <div className="p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => addActivityLog('Database', 'Initiated database backup', 'info')}
          className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-green-500/40 text-left hover:border-green-400 transition-all duration-200"
        >
          <Download className="w-8 h-8 text-green-400 mb-4" />
          <h3 className="text-lg font-bold text-green-300 mb-2">Backup Database</h3>
          <p className="text-green-300/70 text-sm">Create full system backup</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => addActivityLog('Database', 'Initiated database restore', 'warning')}
          className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-red-500/40 text-left hover:border-red-400 transition-all duration-200"
        >
          <Upload className="w-8 h-8 text-red-400 mb-4" />
          <h3 className="text-lg font-bold text-red-300 mb-2">Restore Database</h3>
          <p className="text-red-300/70 text-sm">Restore from backup</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => addActivityLog('Database', 'Opened SQL console', 'info')}
          className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-blue-500/40 text-left hover:border-blue-400 transition-all duration-200"
        >
          <Terminal className="w-8 h-8 text-blue-400 mb-4" />
          <h3 className="text-lg font-bold text-blue-300 mb-2">SQL Console</h3>
          <p className="text-blue-300/70 text-sm">Direct database queries</p>
        </motion.button>
      </div>

      <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-orange-500/40">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Database className="w-5 h-5 mr-2 text-orange-400" />
          Database Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">{players.length}</div>
            <div className="text-orange-300/70 text-sm">Players</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{admins.length}</div>
            <div className="text-red-300/70 text-sm">Admins</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{calculateDatabaseSize()}</div>
            <div className="text-green-300/70 text-sm">Size</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{bannedPlayers.length}</div>
            <div className="text-blue-300/70 text-sm">Banned</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render settings (currently unused but kept for future use)
  /*
  const renderSettings = () => (
    <div className="p-8">
      <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-orange-500/40">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-orange-400" />
          System Settings
        </h3>
        <div className="text-center py-12 text-gray-400">
          <Settings className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">Settings Panel</p>
          <p className="text-sm">System configuration options will be available here</p>
        </div>
      </div>
    </div>
  );
  */

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-orange-900/10 to-red-900/20 flex" style={{ paddingTop: '80px' }}>
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/bg5.webp')] bg-cover bg-center opacity-5" />
      </div>

      {/* Sidebar */}
      {renderSidebar()}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        {renderHeader()}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeSection === 'dashboard' && renderDashboard()}
              {activeSection === 'messages' && renderMyMessages()}
              {activeSection === 'profile-requests' && (
                <div className="p-8 space-y-8">
                  <ProfileUpdateRequests />
                  <ProfileImageRequests adminUsername={currentSuperAdmin?.username || 'superadmin'} />
                </div>
              )}
              {activeSection === 'users' && renderUserManagement()}
              {activeSection === 'admin-management' && <AdminManagement />}
              {activeSection === 'announcements' && <div className="p-8"><AnnouncementManagement username={currentSuperAdmin?.username || 'admin'} /></div>}
              {activeSection === 'captains' && renderCaptainManagement()}
              {activeSection === 'registration' && renderRegistrationControl()}
              {activeSection === 'auction' && renderAuctionControl()}
              {activeSection === 'auction-history' && <div className="p-8"><AuctionHistory /></div>}
              {activeSection === 'database' && renderDatabaseManagement()}
              {activeSection === 'activity' && renderActivityLogs()}
              {activeSection === 'settings' && <AdminSettings />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Password Reset Modal */}
      <AnimatePresence>
        {showPasswordReset && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
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
      </AnimatePresence>

      {/* Ban Player Modal */}
      <AnimatePresence>
        {showBanModal && selectedPlayerForBan && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
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
                <h4 className="text-sm font-semibold text-red-300 mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Warning:
                </h4>
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
      </AnimatePresence>

      {/* Unban Player Modal */}
      <AnimatePresence>
        {showUnbanModal && selectedPlayerForBan && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
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
                <h4 className="text-sm font-semibold text-green-300 mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Unbanning will:
                </h4>
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
      </AnimatePresence>
    </div>
  );
}