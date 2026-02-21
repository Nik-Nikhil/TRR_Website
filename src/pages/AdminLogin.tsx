import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, EyeOff, Crown, UserCheck } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/auth';
import adminService from '../services/adminService';

// Admin data type
interface AdminData {
  id: string;
  name: string;
  realName: string;
  role: string;
  color: string;
  icon: any;
  image: string;
  description: string;
  isSuperAdmin?: boolean;
}

export default function AdminLogin() {
  const [selectedAdmin, setSelectedAdmin] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [adminData, setAdminData] = useState<AdminData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load admins from database
  useEffect(() => {
    const loadAdmins = async () => {
      try {
        const dbAdmins = await adminService.getAdmins();
        
        // Filter only active admins and map to AdminData format
        const activeAdmins = dbAdmins
          .filter(a => a.isActive)
          .map(admin => {
            const isSuperAdmin = admin.role === 'Founder';
            const isAdmin = admin.role === 'Admin';
            
            return {
              id: admin.username.toLowerCase(),
              name: admin.displayName,
              realName: admin.realName || '', // Don't fallback to displayName
              role: admin.role,
              color: isSuperAdmin ? 'from-purple-600 to-purple-800' : 
                     isAdmin ? 'from-red-600 to-red-800' : 
                     'from-blue-600 to-blue-800',
              icon: isSuperAdmin ? Crown : isAdmin ? Shield : UserCheck,
              image: admin.avatarUrl || (admin.username.toLowerCase() === 'reyuk' ? '/avatars/admins/Reyuk.png' : `/avatars/admins/${admin.username}.jpg`),
              description: admin.description || admin.role,
              isSuperAdmin
            };
          });

        // Fixed order mapping - permanent positions
        const fixedOrder: Record<string, number> = {
          'reyuk': 1,
          'nikhil': 2,
          'n1khil': 2,
          'r3ciprocal': 3,
          'godspeed': 4,
          'machine': 5,
          'frost': 6,
          'banner': 7,
          'insanekid': 8,
          'fatty': 9,
          'scripter': 10,
          'havok4evr': 11,
          'havok': 11,
          'raj dadia': 12,
          'rajdadia': 12,
          'shailesh zambare': 13,
          'shaileshzambare': 13
        };

        // Sort admins by fixed order
        activeAdmins.sort((a, b) => {
          const orderA = fixedOrder[a.id] ?? 9999; // New admins go to end
          const orderB = fixedOrder[b.id] ?? 9999;
          
          if (orderA !== orderB) return orderA - orderB;
          
          // If both are new admins (not in fixed order), sort by creation date
          const dateA = dbAdmins.find(d => d.username.toLowerCase() === a.id)?.createdAt || '';
          const dateB = dbAdmins.find(d => d.username.toLowerCase() === b.id)?.createdAt || '';
          return new Date(dateA).getTime() - new Date(dateB).getTime();
        });

        setAdminData(activeAdmins);
      } catch (err) {
        console.error('Failed to load admins:', err);
        setError('Failed to load admin accounts');
      } finally {
        setLoading(false);
      }
    };

    loadAdmins();
  }, []);

  const handleAdminSelect = (adminId: string) => {
    setSelectedAdmin(adminId);
    setPassword('');
    setError('');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmin) return;

    setIsLoading(true);
    setError('');

    try {
      const admin = adminData.find(a => a.id === selectedAdmin);
      if (!admin) {
        setError('Admin not found');
        setIsLoading(false);
        return;
      }

      // Authenticate with database service
      const result = await AuthService.loginAdmin(selectedAdmin, password);
      
      if (!result.success) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      // Special handling for super admins (Founder role) - redirect to SuperAdmin Dashboard
      if (admin.isSuperAdmin) {
        // Set super admin session
        localStorage.setItem('superAdminSession', JSON.stringify({
          authenticated: true,
          loginTime: new Date().toISOString(),
          type: 'superadmin',
          role: admin.role,
          username: selectedAdmin
        }));
        
        // Navigate to super admin dashboard
        navigate('/super-admin-dashboard');
      } else {
        // Navigate to regular admin dashboard for other admins
        navigate('/admin-dashboard');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedAdminData = adminData.find(a => a.id === selectedAdmin);

  return (
    <>
      {/* Fixed Background with Dota 2 Wallpaper */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/blog/play/dota_heroes.jpg')] bg-cover bg-center" />
        {/* Navbar-inspired gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 0% 0%, rgba(192,192,192,0.15), transparent 60%), radial-gradient(circle at 100% 100%, rgba(136,144,150,0.12), transparent 60%), rgba(5,7,10,0.94)"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 via-slate-900/40 to-gray-900/50" />
        {/* Subtle animated orbs matching navbar theme */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-gray-400/10 to-slate-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-slate-500/10 to-gray-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <main className="admin-login-page relative py-1 pt-24">
        <div className="relative z-10 min-h-0">
          <div className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-6 relative pt-4"
            >
              <p className="text-sm text-gray-400">Select your account to continue</p>
            </motion.div>

            {loading ? (
              /* Loading State */
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading admin accounts...</p>
                </div>
              </div>
            ) : !selectedAdmin ? (
              /* Admin Selection Grid */
              <div className="w-full flex justify-center pb-4">
                <div className="w-full max-w-[1600px] px-4 sm:px-6 md:px-8 relative">
                  <div className="flex flex-wrap justify-center gap-4 md:gap-5 lg:gap-6">
                    {adminData.map((admin, index) => {
                      const IconComponent = admin.icon;
                      return (
                        <motion.button
                          key={admin.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleAdminSelect(admin.id)}
                          className="bg-gray-800/20 backdrop-blur-xl border border-gray-600/30 rounded-xl p-4 sm:p-5 hover:border-gray-400/50 hover:bg-gray-700/20 transition-all duration-300 group text-center relative cursor-pointer w-[120px] sm:w-[130px] md:w-[140px] flex flex-col items-center justify-start"
                          style={{ minHeight: '170px' }}
                        >
                          {/* Subtle glow effect on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-400/5 to-slate-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                          
                          <div className="relative z-10 flex flex-col items-center w-full pt-2">
                            {/* Admin Image */}
                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-3 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                              <div className={`absolute inset-0 bg-gradient-to-br ${admin.color} rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-300`} />
                              <div className="absolute inset-0 bg-gradient-to-br from-gray-400/20 to-slate-400/20 rounded-full blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                              <img
                                src={admin.image}
                                alt={admin.name}
                                className="w-full h-full object-cover rounded-full border-2 border-gray-500/40 group-hover:border-gray-400/70 transition-all duration-300 relative z-10 cursor-pointer"
                                onError={(e) => {
                                  // Fallback to icon if image fails to load
                                  const target = e.currentTarget;
                                  target.style.display = 'none';
                                  const iconContainer = target.nextElementSibling as HTMLElement;
                                  if (iconContainer) iconContainer.style.display = 'flex';
                                }}
                              />
                              {/* Fallback icon (hidden by default) */}
                              <div className={`absolute inset-0 bg-gradient-to-br ${admin.color} rounded-full hidden items-center justify-center z-10`}>
                                <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                              </div>
                            </div>
                            
                            {/* Only show display name (gamer tag) - single line */}
                            <div className="w-full px-1">
                              <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-gray-200 transition-colors duration-300 leading-tight truncate">{admin.name}</h3>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* Password Entry Form */
              <div className="w-full flex justify-center pb-4">
                <div className="w-full max-w-md px-3 sm:px-4 md:px-6 relative">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full"
                  >
                    {/* Selected Admin Display */}
                    <div className="text-center mb-8">
                      <div className="relative w-24 h-24 mx-auto mb-4">
                        <div className={`absolute inset-0 bg-gradient-to-br ${selectedAdminData?.color} rounded-full opacity-30`} />
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-400/30 to-slate-400/30 rounded-full blur-xl opacity-40 animate-pulse" />
                        <img
                          src={selectedAdminData?.image}
                          alt={selectedAdminData?.name}
                          className="w-full h-full object-cover rounded-full border-3 border-gray-400/50 relative z-10"
                          onError={(e) => {
                            // Fallback to icon if image fails to load
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const iconContainer = target.nextElementSibling as HTMLElement;
                            if (iconContainer) iconContainer.style.display = 'flex';
                          }}
                        />
                        {/* Fallback icon (hidden by default) */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${selectedAdminData?.color} rounded-full hidden items-center justify-center z-10`}>
                          {selectedAdminData && (
                            <selectedAdminData.icon className="w-12 h-12 text-white" />
                          )}
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent mb-2">{selectedAdminData?.name}</h2>
                      {selectedAdminData?.realName && (
                        <p className="text-sm text-gray-300 mb-4">{selectedAdminData.realName}</p>
                      )}
                      <button
                        onClick={() => setSelectedAdmin(null)}
                        className="text-gray-400 hover:text-gray-300 text-sm transition-colors duration-300 hover:underline cursor-pointer"
                      >
                        ← Choose different admin
                      </button>
                    </div>

                    {/* Password Form */}
                    <form onSubmit={handlePasswordSubmit} className="bg-gray-900/30 backdrop-blur-xl border border-gray-600/30 rounded-2xl p-8 space-y-6 shadow-2xl shadow-gray-900/20">
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Enter Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              setError('');
                            }}
                            className="w-full pl-10 pr-12 py-3 bg-black/20 border border-gray-600/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-300 backdrop-blur-sm"
                            placeholder="Enter your password"
                            required
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-300 cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      {/* Error Message */}
                      {error && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-red-900/40 border border-red-500/60 rounded-lg backdrop-blur-sm"
                        >
                          <p className="text-red-200 text-sm">{error}</p>
                        </motion.div>
                      )}

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 cursor-pointer ${
                          isLoading
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-gradient-to-r from-gray-700 via-slate-700 to-gray-800 hover:from-gray-600 hover:via-slate-600 hover:to-gray-700 text-white hover:scale-[1.02] shadow-lg shadow-gray-500/20'
                        }`}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Logging in...</span>
                          </div>
                        ) : (
                          'Login to Admin Panel'
                        )}
                      </button>
                    </form>

                    {/* Super Admin Access Link */}
                    <div className="text-center mt-6">
                      <Link
                        to="/super-admin-login"
                        className="text-xs text-gray-500 hover:text-red-400 transition-colors duration-300"
                      >
                        Super Admin Access
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}