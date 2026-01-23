import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, EyeOff, Crown, UserCheck } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/auth';

// Admin data with roles, images, and info (matching the admin page)
const ADMIN_DATA = [
  { 
    id: 'reyuk', 
    name: 'Reyuk', 
    realName: 'Keyur Sankhe',
    role: 'Founder', 
    password: '12345',
    color: 'from-purple-600 to-purple-800',
    icon: Crown,
    image: '/avatars/admins/reyuk.png',
    description: 'Tournament Founder'
  },
  { 
    id: 'r3ciprocal', 
    name: 'r3ciprocal', 
    realName: 'Darshil Patel',
    role: 'Admin', 
    password: 'admin2024',
    color: 'from-red-600 to-red-800',
    icon: Shield,
    image: '/avatars/admins/r3ciprocal.jpg',
    description: 'Lead Organizer'
  },
  { 
    id: 'frost', 
    name: 'Frost', 
    realName: 'Clint Mendes',
    role: 'Admin', 
    password: 'admin2024',
    color: 'from-red-600 to-red-800',
    icon: Shield,
    image: '/avatars/admins/Frost.png',
    description: 'Tournament Coordinator'
  },
  { 
    id: 'machine', 
    name: 'Machine', 
    realName: 'Nisarg Parikh',
    role: 'Admin', 
    password: 'admin2024',
    color: 'from-red-600 to-red-800',
    icon: Shield,
    image: '/avatars/admins/Machine.png',
    description: 'Lead Operator'
  },
  { 
    id: 'godspeed', 
    name: 'Godspeed', 
    realName: 'Aby Alexander',
    role: 'Admin', 
    password: 'admin2024',
    color: 'from-red-600 to-red-800',
    icon: Shield,
    image: '/avatars/admins/Godspeed.jpg',
    description: 'Funds Administrator'
  },
  { 
    id: 'banner', 
    name: 'Banner', 
    realName: 'Nav Sharma',
    role: 'Mini Admin', 
    password: 'mini2024',
    color: 'from-blue-600 to-blue-800',
    icon: UserCheck,
    image: '/avatars/admins/banner.png',
    description: 'Lobby Manager & Caster'
  },
  { 
    id: 'insanekid', 
    name: 'InsaneKid', 
    realName: 'Siddhesh Naringrikar',
    role: 'Mini Admin', 
    password: 'mini2024',
    color: 'from-blue-600 to-blue-800',
    icon: UserCheck,
    image: '/avatars/admins/insane.jpg',
    description: 'Match Coordinator & Caster'
  },
  { 
    id: 'fatty', 
    name: 'Fatty', 
    realName: 'Shreejan Mishra',
    role: 'Mini Admin', 
    password: 'mini2024',
    color: 'from-blue-600 to-blue-800',
    icon: UserCheck,
    image: '/avatars/admins/fatty.jpg',
    description: 'UI/UX Developer'
  },
  { 
    id: 'scripter', 
    name: 'Scripter', 
    realName: 'Anubhav Kumar',
    role: 'Mini Admin', 
    password: 'mini2024',
    color: 'from-blue-600 to-blue-800',
    icon: UserCheck,
    image: '/avatars/admins/scripter.jpg',
    description: 'Database-Coordinator'
  },
  { 
    id: 'havok4evr', 
    name: 'HaVoK4EvR', 
    realName: 'Gaurav',
    role: 'Mini Admin', 
    password: 'mini2024',
    color: 'from-blue-600 to-blue-800',
    icon: UserCheck,
    image: '/avatars/admins/havok.jpg',
    description: 'Streamer & Caster'
  },
];

export default function AdminLogin() {
  const [selectedAdmin, setSelectedAdmin] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
      const admin = ADMIN_DATA.find(a => a.id === selectedAdmin);
      if (!admin) {
        setError('Admin not found');
        setIsLoading(false);
        return;
      }

      // Authenticate with database service
      const result = await AuthService.loginAdmin(admin.name.toLowerCase(), password);
      
      if (!result.success) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      // Special handling for reyuk (Founder) - redirect to SuperAdmin
      if (admin.id === 'reyuk' && admin.role === 'Founder') {
        // Set super admin session for reyuk
        localStorage.setItem('superAdminSession', JSON.stringify({
          authenticated: true,
          loginTime: new Date().toISOString(),
          type: 'superadmin',
          role: 'Founder',
          username: 'reyuk'
        }));
        
        // Navigate to super admin dashboard
        navigate('/super-admin');
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

  const selectedAdminData = ADMIN_DATA.find(a => a.id === selectedAdmin);

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

            {!selectedAdmin ? (
              /* Admin Selection Grid */
              <div className="w-full flex justify-center pb-4">
                <div className="w-full max-w-[1100px] px-3 sm:px-4 md:px-6 relative">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                    {ADMIN_DATA.map((admin, index) => {
                      const IconComponent = admin.icon;
                      return (
                        <motion.button
                          key={admin.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleAdminSelect(admin.id)}
                          className="bg-gray-800/20 backdrop-blur-xl border border-gray-600/30 rounded-xl p-3 sm:p-4 md:p-6 hover:border-gray-400/50 hover:bg-gray-700/20 transition-all duration-300 group text-center relative cursor-pointer"
                        >
                          {/* Subtle glow effect on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-400/5 to-slate-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                          
                          <div className="relative z-10">
                            {/* Admin Image */}
                            <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">
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
                                <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                              </div>
                            </div>
                            
                            <h3 className="text-sm sm:text-base md:text-lg font-bold text-white mb-1 group-hover:text-gray-200 transition-colors duration-300 leading-tight">{admin.name}</h3>
                            {admin.realName && (
                              <p className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 truncate leading-tight">{admin.realName}</p>
                            )}
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