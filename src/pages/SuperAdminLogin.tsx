import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, EyeOff, Crown, Zap, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

// Super Admin credentials - in production, this should be more secure
const SUPER_ADMIN_CREDENTIALS: Record<string, { role: string; username: string }> = {
  'SuperAdmin2024!': { role: 'SuperAdmin', username: 'nikhil' }, // Nikhil's password
  '12345': { role: 'Founder', username: 'reyuk' }, // Reyuk's password
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
        setError('Wrong password');
        setIsLoading(false);
        return;
      }

      // If on Nikhil's login page, only accept Nikhil's password
      if (isNikhilLogin && credentials.username !== 'nikhil') {
        setError('Wrong password');
        setIsLoading(false);
        return;
      }

      // Clear any existing session first
      localStorage.removeItem('superAdminSession');
      
      // Set super admin session
      const sessionData = {
        authenticated: true,
        loginTime: new Date().toISOString(),
        type: 'superadmin',
        role: credentials.role,
        username: credentials.username
      };
      
      localStorage.setItem('superAdminSession', JSON.stringify(sessionData));
      
      // Navigate to super admin dashboard with state to force refresh
      navigate('/super-admin-dashboard', { replace: true, state: { forceRefresh: true } });
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
                      className="w-24 h-24 rounded-full object-cover border-4 border-orange-400 shadow-lg shadow-orange-500/30"
                      onError={(e) => {
                        e.currentTarget.src = "/avatars/default.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-orange-500/30 rounded-full blur-xl animate-pulse" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-300 via-gray-200 to-orange-300 bg-clip-text text-transparent mb-2">NIKHIL</h2>
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
              <h1 className={`text-2xl font-bold bg-clip-text text-transparent mb-2 whitespace-nowrap ${
                isNikhilLogin 
                  ? 'bg-gradient-to-r from-orange-400 via-gray-300 to-orange-400' 
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
                  ? 'bg-black/60 border border-orange-400/40 shadow-orange-900/30' 
                  : 'bg-black/60 border border-orange-500/40 shadow-orange-900/30'
              }`}>

                {/* Password Field */}
                <div>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      isNikhilLogin ? 'text-gray-400' : 'text-orange-400'
                    }`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError('');
                      }}
                      className={`w-full pl-10 pr-12 py-3 bg-black/50 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-sm ${
                        isNikhilLogin 
                          ? 'border border-gray-400/50 placeholder-gray-400/60 focus:ring-orange-400 focus:border-orange-400 text-gray-100' 
                          : 'border border-orange-500/50 placeholder-orange-300/60 focus:ring-orange-500 focus:border-orange-400 text-orange-100'
                      }`}
                      placeholder={isNikhilLogin ? 'Enter your password' : 'Enter super admin password'}
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 cursor-pointer ${
                        isNikhilLogin 
                          ? 'text-gray-400/80 hover:text-orange-400' 
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
                    className="p-3 bg-red-900/60 border border-red-500/70 rounded-lg backdrop-blur-sm"
                  >
                    <p className="text-red-200 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400" />
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
                        ? 'bg-gradient-to-r from-orange-600 via-gray-500 to-orange-600 hover:from-orange-500 hover:via-gray-400 hover:to-orange-500 text-white hover:scale-[1.02] shadow-lg shadow-orange-500/30 focus:ring-orange-400 cursor-pointer'
                        : 'bg-gradient-to-r from-orange-700 via-red-700 to-orange-800 hover:from-orange-600 hover:via-red-600 hover:to-orange-700 text-white hover:scale-[1.02] shadow-lg shadow-orange-500/30 focus:ring-orange-500 cursor-pointer'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="w-5 h-5" />
                      <span>Login</span>
                    </div>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}