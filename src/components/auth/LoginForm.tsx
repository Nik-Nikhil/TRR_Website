import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onSubmit: (password: string) => Promise<void>;
  isLoading: boolean;
  error: string;
  userInfo: {
    name: string;
    avatarUrl?: string;
    role?: string;
  };
  onBack: () => void;
}

export default function LoginForm({ onSubmit, isLoading, error, userInfo, onBack }: LoginFormProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(password);
  };

  return (
    <div className="w-full flex justify-center pb-4">
      <div className="w-full max-w-md px-3 sm:px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full"
        >
          {/* Selected User Display */}
          <div className="text-center mb-8">
            <div className="relative w-24 h-24 mx-auto mb-4">
              {userInfo.avatarUrl ? (
                <img
                  src={userInfo.avatarUrl}
                  alt={userInfo.name}
                  className="w-full h-full object-cover rounded-full border-3 border-blue-400/50 relative z-10"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.name)}&background=3b82f6&color=fff`;
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {userInfo.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full blur-xl opacity-40 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent mb-2">
              {userInfo.name}
            </h2>
            {userInfo.role && (
              <p className="text-sm text-gray-300 mb-4">{userInfo.role}</p>
            )}
            <button
              onClick={onBack}
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-300 hover:underline cursor-pointer"
            >
              ← Choose different account
            </button>
          </div>

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="bg-gray-900/30 backdrop-blur-xl border border-blue-600/30 rounded-2xl p-8 space-y-6 shadow-2xl shadow-blue-900/20">
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Enter Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-black/20 border border-blue-600/40 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Enter your password"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-300 transition-colors duration-300 cursor-pointer"
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
              className={`w-full font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 cursor-pointer ${
                isLoading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 hover:from-blue-700 hover:via-cyan-700 hover:to-blue-800 text-white hover:scale-[1.02] shadow-lg shadow-blue-500/20'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                'Login'
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}