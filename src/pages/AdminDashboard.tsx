import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, Users, Settings, LogOut, Clock, CheckCircle, 
  AlertTriangle, Shield, BarChart3, UserPlus,
  Activity, Eye, EyeOff, Info, XCircle, TrendingUp, Zap, MessageSquare
} from 'lucide-react';
import { getPendingApprovals } from '../data/pendingApprovals';
import { getAdminByUsername } from '../data/admins';
import { players } from '../data/players';
import { admins } from '../data/admins';
import AuthService from '../services/auth';
import RegistrationControl from '../components/admin/RegistrationControl';
import messagingService from '../services/messagingService';

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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [showActivityDetails, setShowActivityDetails] = useState(false);
  const [quickStats, setQuickStats] = useState<QuickStat[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Calculate real database size
  const calculateDatabaseSize = () => {
    const playersSize = JSON.stringify(players).length;
    const adminsSize = JSON.stringify(admins).length;
    const logsSize = JSON.stringify(activityLogs).length;
    const totalBytes = playersSize + adminsSize + logsSize;
    const totalMB = (totalBytes / (1024 * 1024));
    
    if (totalMB < 0.1) {
      return `${(totalBytes / 1024).toFixed(1)} KB`;
    }
    return `${totalMB.toFixed(1)} MB`;
  };

  useEffect(() => {
    // Check if admin is logged in
    const session = AuthService.getCurrentAdminSession();
    if (!session) {
      navigate('/admin-login');
      return;
    }

    // Get current admin info
    const admin = getAdminByUsername(session.username);
    setCurrentAdmin(admin);

    // Load pending approvals
    const pending = getPendingApprovals();
    setPendingCount(pending.length);

    // Load activity logs from localStorage or create initial ones
    const savedLogs = localStorage.getItem('adminActivityLogs');
    const initialLogs: ActivityLog[] = savedLogs ? JSON.parse(savedLogs).map((log: any) => ({
      ...log,
      timestamp: new Date(log.timestamp) // Convert string back to Date object
    })) : [
      {
        id: '1',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        action: 'Player Registration',
        details: 'New player "TestUser" registered',
        user: session.username,
        type: 'success'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        action: 'Avatar Approval',
        details: 'Approved avatar for player "Irene"',
        user: session.username,
        type: 'info'
      }
    ];
    setActivityLogs(initialLogs);

    // Initialize quick stats
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
        label: 'Pending Approvals',
        value: pendingCount,
        icon: Clock,
        color: pendingCount > 0 ? 'orange' : 'gray',
        trend: pendingCount > 0 ? 'up' : 'stable',
        change: pendingCount > 0 ? `${pendingCount} pending` : 'All clear'
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

    // Load messages for current admin
    if (admin) {
      const adminMessages = messagingService.getMessagesForAdmin(admin.username);
      setMessages(adminMessages);
      setUnreadCount(messagingService.getUnreadCount(admin.username));
    }

    // Listen for new messages
    const handleNewMessage = (event: any) => {
      if (admin && event.detail.message.toAdmin === admin.username) {
        const updatedMessages = messagingService.getMessagesForAdmin(admin.username);
        setMessages(updatedMessages);
        setUnreadCount(messagingService.getUnreadCount(admin.username));
      }
    };

    window.addEventListener('newAdminMessage', handleNewMessage);
    
    return () => {
      window.removeEventListener('newAdminMessage', handleNewMessage);
    };
  }, [navigate]);

  // Add activity log function
  const addActivityLog = (action: string, details: string, type: ActivityLog['type'] = 'info') => {
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      action,
      details,
      user: currentAdmin?.username || 'admin',
      type
    };
    const updatedLogs = [newLog, ...activityLogs].slice(0, 100);
    setActivityLogs(updatedLogs);
    localStorage.setItem('adminActivityLogs', JSON.stringify(updatedLogs));
  };

  // Clear activity logs
  const clearActivityLogs = () => {
    setActivityLogs([]);
    localStorage.removeItem('adminActivityLogs');
    const clearLog: ActivityLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      action: 'System',
      details: 'Activity logs cleared',
      user: currentAdmin?.username || 'admin',
      type: 'info'
    };
    setActivityLogs([clearLog]);
    localStorage.setItem('adminActivityLogs', JSON.stringify([clearLog]));
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/');
  };

  // Sidebar navigation items
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, description: 'Overview & Analytics' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, description: 'Player Messages', badge: unreadCount > 0 ? unreadCount : undefined },
    { id: 'players', label: 'Player Management', icon: Users, description: 'Manage Players' },
    { id: 'registration', label: 'Registration', icon: UserPlus, description: 'Control Settings' },
    { id: 'database', label: 'Database', icon: Database, description: 'Backup & Restore' },
    { id: 'activity', label: 'Activity Logs', icon: Activity, description: 'System Events' },
    { id: 'settings', label: 'Settings', icon: Settings, description: 'System Config' }
  ];

  // Quick action cards
  const quickActions = [
    {
      title: 'Manage Players',
      description: 'View and manage registered players',
      icon: Users,
      color: 'blue',
      action: () => setActiveSection('players')
    },
    {
      title: 'Registration Control',
      description: 'Enable/disable player registration',
      icon: UserPlus,
      color: 'green',
      action: () => setActiveSection('registration')
    },
    {
      title: 'Database Backup',
      description: 'Create system backup',
      icon: Database,
      color: 'purple',
      action: () => {
        addActivityLog('Database', 'Initiated database backup', 'info');
        setActiveSection('database');
      }
    },
    {
      title: 'View Activity',
      description: 'Check recent admin activity',
      icon: Activity,
      color: 'orange',
      action: () => setActiveSection('activity')
    }
  ];

  // Render sidebar
  const renderSidebar = () => (
    <div className="w-64 bg-black/80 backdrop-blur-xl border-r border-blue-500/20 flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-blue-500/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Admin Panel</h1>
            <p className="text-xs text-blue-300/70">System Control</p>
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
                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/40 text-blue-300'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon className={`w-5 h-5 ${
              activeSection === item.id ? 'text-blue-400' : 'text-gray-500 group-hover:text-blue-400'
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
    <div className="bg-black/60 backdrop-blur-sm border-b border-blue-500/20 px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white capitalize">
            {activeSection === 'dashboard' ? 'Dashboard Overview' : 
             activeSection === 'players' ? 'Player Management' :
             activeSection === 'registration' ? 'Registration Control' :
             activeSection === 'database' ? 'Database Management' :
             activeSection === 'activity' ? 'Activity Logs' :
             activeSection === 'settings' ? 'System Settings' : activeSection}
          </h2>
          <p className="text-blue-300/70 mt-1">
            {activeSection === 'dashboard' ? 'System overview and quick actions' :
             activeSection === 'players' ? 'Manage registered players' :
             activeSection === 'registration' ? 'Control player registration settings' :
             activeSection === 'database' ? 'Database operations and maintenance' :
             activeSection === 'activity' ? 'System activity and audit trail' :
             activeSection === 'settings' ? 'System configuration and preferences' : 'Manage your system'}
          </p>
        </div>
        
        {/* Admin Profile Section - Inline with Header */}
        {currentAdmin && (
          <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4 border border-blue-500/40 min-w-[280px]">
            <div className="flex items-center space-x-4 mb-3">
              <img 
                src={currentAdmin.avatarUrl} 
                alt={currentAdmin.displayName}
                className="w-14 h-14 rounded-full object-cover border-3 border-blue-500"
                onError={(e) => {
                  e.currentTarget.src = "/avatars/default.jpg";
                }}
              />
              <div className="flex-1">
                <h3 className="text-white font-bold text-xl">{currentAdmin.displayName}</h3>
                <p className="text-blue-400 text-base font-medium">{currentAdmin.role}</p>
                <p className="text-blue-300/60 text-sm">@{currentAdmin.username}</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 hover:text-red-200 rounded-lg text-base font-medium transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Render messages section
  const renderMessages = () => (
    <div className="p-8">
      <div className="bg-black/60 backdrop-blur-sm rounded-xl border border-blue-500/40">
        <div className="p-6 border-b border-blue-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-6 h-6 text-blue-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Player Messages</h3>
                <p className="text-sm text-gray-400">Messages from players to you</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-blue-400">{messages.length} total messages</span>
              {unreadCount > 0 && (
                <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="max-h-96 overflow-y-auto space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No messages yet</p>
                <p className="text-sm">Player messages will appear here</p>
              </div>
            ) : (
              messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    !message.isRead 
                      ? 'bg-blue-900/20 border-blue-500/30 shadow-lg' 
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
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
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
                          onClick={() => {
                            messagingService.markAsRead(message.id);
                            const updatedMessages = messagingService.getMessagesForAdmin(currentAdmin.username);
                            setMessages(updatedMessages);
                            setUnreadCount(messagingService.getUnreadCount(currentAdmin.username));
                            addActivityLog('Message', `Marked message from ${message.fromPlayerNickname} as read`, 'info');
                          }}
                          className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 text-blue-300 rounded text-xs transition-colors"
                        >
                          Mark as Read
                        </button>
                      )}
                      <button
                        onClick={() => {
                          messagingService.deleteMessage(message.id);
                          const updatedMessages = messagingService.getMessagesForAdmin(currentAdmin.username);
                          setMessages(updatedMessages);
                          setUnreadCount(messagingService.getUnreadCount(currentAdmin.username));
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
              stat.color === 'orange' ? 'border-orange-500/40' :
              stat.color === 'gray' ? 'border-gray-500/40' :
              'border-green-500/40'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${
                stat.color === 'blue' ? 'bg-blue-500/20' :
                stat.color === 'purple' ? 'bg-purple-500/20' :
                stat.color === 'orange' ? 'bg-orange-500/20' :
                stat.color === 'gray' ? 'bg-gray-500/20' :
                'bg-green-500/20'
              }`}>
                <stat.icon className={`w-6 h-6 ${
                  stat.color === 'blue' ? 'text-blue-400' :
                  stat.color === 'purple' ? 'text-purple-400' :
                  stat.color === 'orange' ? 'text-orange-400' :
                  stat.color === 'gray' ? 'text-gray-400' :
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
      <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-blue-500/40">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-blue-400" />
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
                action.color === 'blue' ? 'bg-blue-900/20 border-blue-500/40 hover:border-blue-400' :
                action.color === 'green' ? 'bg-green-900/20 border-green-500/40 hover:border-green-400' :
                action.color === 'purple' ? 'bg-purple-900/20 border-purple-500/40 hover:border-purple-400' :
                'bg-orange-900/20 border-orange-500/40 hover:border-orange-400'
              }`}
            >
              <action.icon className={`w-8 h-8 mb-3 ${
                action.color === 'blue' ? 'text-blue-400' :
                action.color === 'green' ? 'text-green-400' :
                action.color === 'purple' ? 'text-purple-400' :
                'text-orange-400'
              }`} />
              <div className="text-white font-medium mb-1">{action.title}</div>
              <div className="text-xs text-gray-400">{action.description}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Activity Preview */}
      <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-blue-500/40">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-400" />
            Recent Activity
          </h3>
          <button
            onClick={() => setActiveSection('activity')}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
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

  // Render registration control
  const renderRegistrationControl = () => (
    <div className="p-8">
      <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-blue-500/40">
        <div className="flex items-center mb-6">
          <UserPlus className="w-6 h-6 mr-3 text-blue-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Registration Control</h3>
            <p className="text-sm text-gray-400">Manage player registration settings</p>
          </div>
        </div>
        
        <RegistrationControl 
          userRole="admin" 
          username={currentAdmin?.username || 'admin'} 
        />
      </div>
    </div>
  );

  // Render activity logs
  const renderActivityLogs = () => (
    <div className="p-8">
      <div className="bg-black/60 backdrop-blur-sm rounded-xl border border-blue-500/40">
        <div className="p-6 border-b border-blue-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className="w-6 h-6 text-blue-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">Activity Logs</h3>
                <p className="text-sm text-gray-400">Admin activity monitoring</p>
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
                <XCircle className="w-4 h-4" />
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-900/10 to-purple-900/20 flex" style={{ paddingTop: '80px' }}>
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
              {activeSection === 'messages' && renderMessages()}
              {activeSection === 'players' && <div className="p-8"><div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-blue-500/40 text-center"><p className="text-white">Player Management - Coming Soon</p></div></div>}
              {activeSection === 'registration' && renderRegistrationControl()}
              {activeSection === 'database' && <div className="p-8"><div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-blue-500/40 text-center"><p className="text-white">Database Management - Coming Soon</p></div></div>}
              {activeSection === 'activity' && renderActivityLogs()}
              {activeSection === 'settings' && <div className="p-8"><div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 border border-blue-500/40 text-center"><p className="text-white">Settings - Coming Soon</p></div></div>}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}