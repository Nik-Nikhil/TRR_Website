import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, EyeOff, Crown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

// Super Admin credentials - in production, this should be more secure
const SUPER_ADMIN_CREDENTIALS = {
  'SuperAdmin2024!': { role: 'SuperAdmin', username: 'superadmin' },
  '12345': { role: 'Founder', username: 'reyuk' },
  'banner123': { role: 'Admin', username: 'banner' } // Banner's password
};

export default function SuperAdminLogin() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if coming from Nikhil's eye click via state or URL params
  const urlParams = new URLSearchParams(window.location.search);
  const isNikhilLogin = urlParams.get('user') === 'nikhil' || location.state?.preselectedUser === 'nikhil';

  // Auto-fill username field if coming from eye click
  useEffect(() => {
    if (isNikhilLogin) {
      // Could set a default username here if needed
    }
  }, [isNikhilLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate super admin password
      const credentials = SUPER_ADMIN_CREDENTIALS[password];
      if (!credentials) {
        setError(isNikhilLogin ? 'Invalid password for N1KHIL' : 'Invalid super admin password');
        setIsLoading(false);
        return;
      }

      // Set super admin session
      localStorage.setItem('superAdminSession', JSON.stringify({
        authenticated: true,
        loginTime: new Date().toISOString(),
        type: 'superadmin',
        role: credentials.role,
        username: credentials.username
      }));

      // Navigate to super admin dashboard
      navigate('/super-admin-dashboard');
    } catch (error) {
      console.error('Super admin login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Fixed Background with Obito Theme */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/bg5.webp')] bg-cover bg-center" />
        {/* Obito-themed gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 0% 0%, rgba(255,69,0,0.15), transparent 60%), radial-gradient(circle at 100% 100%, rgba(139,0,0,0.12), transparent 60%), rgba(0,0,0,0.96)"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 via-black/60 to-red-900/40" />
        {/* Animated Obito-themed orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-600/15 to-red-600/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-red-700/15 to-orange-700/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        {/* Sharingan-like spinning element */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-5">
          <div className="w-full h-full border border-red-500/20 rounded-full animate-spin" style={{ animationDuration: '20s' }}>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 border border-orange-500/20 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 border border-red-600/20 rounded-full animate-spin" style={{ animationDuration: '10s' }}></div>
            </div>
          </div>
        </div>
      </div>

      <main className="super-admin-login-page relative py-1 pt-24">
        <div className="relative z-10 min-h-0">
          <div className="max-w-md mx-auto px-4">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8 relative pt-4"
            >
              {isNikhilLogin ? (
                // Nikhil's profile when coming from eye click
                <div className="flex flex-col items-center mb-6">
                  <div className="relative mb-4">
                    <img 
                      src="/avatars/admins/Nikhil.jpg" 
                      alt="N1KHIL"
                      className="w-20 h-20 rounded-full object-cover border-4 border-purple-500 shadow-lg shadow-purple-500/30"
                      onError={(e) => {
                        e.currentTarget.src = "/avatars/default.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-xl animate-pulse" />
                  </div>
                  <h2 className="text-2xl font-bold text-purple-300 mb-1">N1KHIL</h2>
                  <p className="text-purple-400/80 text-sm mb-2">Super Admin</p>
                  <p className="text-purple-300/60 text-xs">@superadmin</p>
                </div>
              ) : (
                // Default super admin header
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <Shield className="w-16 h-16 text-orange-400 relative z-10" />
                    <div className="absolute inset-0 bg-orange-500/30 rounded-full blur-xl animate-pulse" />
                    <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
                  </div>
                </div>
              )}
              <h1 className={`text-3xl font-bold bg-clip-text text-transparent mb-2 ${
                isNikhilLogin 
                  ? 'bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500' 
                  : 'bg-gradient-to-r from-orange-400 via-red-400 to-orange-500'
              }`}>
                {isNikhilLogin ? 'Enter Password to Continue' : 'Super Admin Access'}
              </h1>
            </motion.div>

            {/* Login Form */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full"
            >
              <form onSubmit={handleSubmit} className={`backdrop-blur-xl rounded-2xl p-8 space-y-6 shadow-2xl ${
                isNikhilLogin 
                  ? 'bg-black/60 border border-purple-500/40 shadow-purple-900/30' 
                  : 'bg-black/60 border border-orange-500/40 shadow-orange-900/30'
              }`}>

                {/* Password Field */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isNikhilLogin ? 'text-purple-200' : 'text-orange-200'
                  }`}>
                    {isNikhilLogin ? 'N1KHIL\'s Password' : 'Super Admin Password'}
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      isNikhilLogin ? 'text-purple-400' : 'text-orange-400'
                    }`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError('');
                      }}
                      className={`w-full pl-10 pr-12 py-3 bg-black/50 rounded-lg text-orange-100 focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-sm ${
                        isNikhilLogin 
                          ? 'border border-purple-500/50 placeholder-purple-300/60 focus:ring-purple-500 focus:border-purple-400' 
                          : 'border border-orange-500/50 placeholder-orange-300/60 focus:ring-orange-500 focus:border-orange-400'
                      }`}
                      placeholder={isNikhilLogin ? 'Enter your password' : 'Enter super admin password'}
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                        isNikhilLogin 
                          ? 'text-purple-400/80 hover:text-purple-300' 
                          : 'text-orange-400/80 hover:text-red-400'
                      }`}
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
                    className="p-4 bg-red-900/60 border border-red-500/70 rounded-lg backdrop-blur-sm"
                  >
                    <p className="text-red-200 text-sm flex items-center gap-2">
                      <Eye className="w-4 h-4 text-red-400" />
                      {error}
                    </p>
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black ${
                    isLoading
                      ? 'bg-gray-600 cursor-not-allowed'
                      : isNikhilLogin
                        ? 'bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 hover:from-purple-600 hover:via-purple-500 hover:to-purple-700 text-white hover:scale-[1.02] shadow-lg shadow-purple-500/30 focus:ring-purple-500'
                        : 'bg-gradient-to-r from-orange-700 via-red-700 to-orange-800 hover:from-orange-600 hover:via-red-600 hover:to-orange-700 text-white hover:scale-[1.02] shadow-lg shadow-orange-500/30 focus:ring-orange-500'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Eye className="w-5 h-5" />
                      <span>{isNikhilLogin ? 'Login as N1KHIL' : 'Access Super Admin Console'}</span>
                    </div>
                  )}
                </button>
              </form>

              {/* Back to Admin Login */}
              <div className="text-center mt-6">
                <button
                  onClick={() => navigate('/admin-login')}
                  className="text-orange-400/70 hover:text-orange-300 text-sm transition-colors duration-300 hover:underline"
                >
                  ← Back to Regular Admin Login
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}