import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { 
  Database, Users, Settings, LogOut, Clock, CheckCircle, 
  AlertTriangle, Shield, Calendar, BarChart3, UserPlus
} from 'lucide-react';
import { getPendingApprovals } from '../data/pendingApprovals';
import { getAdminByUsername } from '../data/admins';
import { players } from '../data/players';
import AuthService from '../services/auth';
import RegistrationControl from '../components/admin/RegistrationControl';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [showRegistrationControl, setShowRegistrationControl] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalPlayers: players.length,
    activeTournaments: 2,
    pendingApprovals: 0,
    resolvedToday: 8
  });

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
    setDashboardStats(prev => ({ ...prev, pendingApprovals: pending.length }));
  }, [navigate]);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/');
  };

  const quickActions = [
    {
      title: 'Registration Control',
      description: 'Enable/disable player registration',
      icon: UserPlus,
      link: '#registration-control',
      color: 'from-green-600 to-emerald-600',
      isRegistrationControl: true
    },
    {
      title: 'Pending Approvals',
      description: `${pendingCount} items waiting for review`,
      icon: Clock,
      link: currentAdmin ? `/admin/${currentAdmin.id}` : '/admin-dashboard',
      color: 'from-orange-600 to-red-600',
      urgent: pendingCount > 0
    },
    {
      title: 'Database Management',
      description: 'Manage player data, teams, and run migrations',
      icon: Database,
      link: '/database-management',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      title: 'Player Management',
      description: 'View and manage registered players',
      icon: Users,
      link: '/players',
      color: 'from-green-600 to-emerald-600'
    },
    {
      title: 'My Profile',
      description: 'View your admin profile and activity',
      icon: Shield,
      link: currentAdmin ? `/admin/${currentAdmin.id}` : '/admin-dashboard',
      color: 'from-purple-600 to-violet-600'
    },
    {
      title: 'Tournament Settings',
      description: 'Configure tournament rules and settings',
      icon: Settings,
      link: '/rules',
      color: 'from-indigo-600 to-blue-600'
    },
    {
      title: 'Analytics',
      description: 'View tournament and player statistics',
      icon: BarChart3,
      link: '/analytics',
      color: 'from-pink-600 to-rose-600'
    }
  ];

  const recentActivity = [
    { action: 'Player "NewPlayer123" registered', time: '5 minutes ago', type: 'registration' },
    { action: 'Avatar approved for "Irene"', time: '1 hour ago', type: 'approval' },
    { action: 'Tournament schedule updated', time: '2 hours ago', type: 'tournament' },
    { action: 'Dispute resolved for Team Alpha', time: '3 hours ago', type: 'dispute' }
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-gray-900 to-black" />
        <div className="absolute inset-0 bg-[url('/bg5.webp')] bg-cover bg-center opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">
              Welcome back, {currentAdmin?.displayName || 'Admin'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Players</p>
                <p className="text-2xl font-bold text-white">{dashboardStats.totalPlayers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Tournaments</p>
                <p className="text-2xl font-bold text-white">{dashboardStats.activeTournaments}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending Approvals</p>
                <p className="text-2xl font-bold text-white">{dashboardStats.pendingApprovals}</p>
              </div>
              <Clock className={`w-8 h-8 ${pendingCount > 0 ? 'text-orange-400' : 'text-gray-400'}`} />
            </div>
            {pendingCount > 0 && (
              <div className="mt-2">
                <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                  Needs Attention
                </span>
              </div>
            )}
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Resolved Today</p>
                <p className="text-2xl font-bold text-white">{dashboardStats.resolvedToday}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickActions.map((action, index) => (
                action.isRegistrationControl ? (
                  <button
                    key={index}
                    onClick={() => setShowRegistrationControl(true)}
                    className="group relative bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105 text-left"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 rounded-lg transition-opacity`} />
                    
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <action.icon className={`w-8 h-8 bg-gradient-to-r ${action.color} bg-clip-text text-transparent`} />
                      </div>
                      
                      <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                      <p className="text-gray-400 text-sm">{action.description}</p>
                    </div>
                  </button>
                ) : (
                  <Link
                    key={index}
                    to={action.link}
                    className="group relative bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 rounded-lg transition-opacity`} />
                    
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <action.icon className={`w-8 h-8 bg-gradient-to-r ${action.color} bg-clip-text text-transparent`} />
                        {action.urgent && (
                          <AlertTriangle className="w-5 h-5 text-orange-400 animate-pulse" />
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                      <p className="text-gray-400 text-sm">{action.description}</p>
                    </div>
                  </Link>
                )
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-white text-sm">{activity.action}</p>
                      <p className="text-gray-400 text-xs">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link
                to={currentAdmin ? `/admin/${currentAdmin.id}` : '/admin-dashboard'}
                className="block mt-4 text-center text-blue-400 hover:text-blue-300 text-sm"
              >
                View All Activity →
              </Link>
            </div>

            {/* Admin Info */}
            {currentAdmin && (
              <div className="mt-6 bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Your Profile</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={currentAdmin.avatarUrl}
                    alt={currentAdmin.displayName}
                    className="w-12 h-12 rounded-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/avatars/default.jpg';
                    }}
                  />
                  <div>
                    <p className="text-white font-medium">{currentAdmin.displayName}</p>
                    <p className="text-gray-400 text-sm">{currentAdmin.role}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Players Managed:</span>
                    <span className="text-white">{currentAdmin.stats?.playersManaged || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Issues Resolved:</span>
                    <span className="text-white">{currentAdmin.stats?.issuesResolved || 0}</span>
                  </div>
                </div>

                <Link
                  to={`/admin/${currentAdmin.id}`}
                  className="block mt-4 text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                >
                  View Full Profile
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Registration Control Modal */}
      {showRegistrationControl && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Registration Control</h2>
              <button
                onClick={() => setShowRegistrationControl(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <RegistrationControl 
              userRole="admin" 
              username={currentAdmin?.username || 'admin'} 
            />
          </div>
        </div>
      )}
    </div>
  );
}