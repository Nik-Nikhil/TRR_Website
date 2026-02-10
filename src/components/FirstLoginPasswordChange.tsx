import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import passwordService from '../services/passwordService';
import type { UserType } from '../services/passwordService';

interface FirstLoginPasswordChangeProps {
  userId: string;
  userType: UserType;
  userName: string;
  onPasswordChanged: () => void;
}

export default function FirstLoginPasswordChange({
  userId,
  userType,
  onPasswordChanged
}: FirstLoginPasswordChangeProps) {
  const [show, setShow] = useState(false);
  const [checking, setChecking] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    checkIfDefaultPassword();
  }, [userId]);

  const checkIfDefaultPassword = async () => {
    setChecking(true);
    try {
      // Check if user is using default password
      const result = await passwordService.verifyUserPassword(userId, 'player123');
      if (result.success) {
        // User is still using default password
        setShow(true);
      }
    } catch (error) {
      // Error checking, don't show modal
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (!currentPassword) {
      setError('Please enter your current password');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword === currentPassword) {
      setError('New password must be different from current password');
      return;
    }

    setLoading(true);

    try {
      const result = await passwordService.changePassword(userId, userType, currentPassword, newPassword);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          setShow(false);
          onPasswordChanged();
        }, 2000);
      } else {
        setError(result.error || 'Failed to change password');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (checking || !show) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-gradient-to-br from-orange-900/90 to-red-900/90 border-2 border-orange-500/60 rounded-2xl p-8 max-w-md w-full relative shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-orange-500/30 rounded-lg">
              <Shield className="w-8 h-8 text-orange-300" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Security Alert</h3>
              <p className="text-sm text-orange-200">First time login detected</p>
            </div>
          </div>

          {/* Warning Message */}
          <div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-500/50 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-yellow-300 mb-2">Change Your Password</h4>
                <p className="text-xs text-yellow-200 leading-relaxed">
                  You are using the default password. For security reasons, you must change it before continuing.
                  Your current password is: <span className="font-bold">player123</span>
                </p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-green-900/30 border border-green-500/50 rounded-lg flex items-center space-x-3"
            >
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-300">Password changed successfully!</span>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center space-x-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-300">{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-orange-200 text-sm mb-2 font-medium">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-black/40 border border-orange-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12"
                  placeholder="Enter player123"
                  disabled={loading || success}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-orange-200 text-sm mb-2 font-medium">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-black/40 border border-orange-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12"
                  placeholder="Enter new password (min 6 characters)"
                  disabled={loading || success}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-orange-200 text-sm mb-2 font-medium">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-black/40 border border-orange-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12"
                  placeholder="Confirm new password"
                  disabled={loading || success}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-900/30 border border-blue-500/40 rounded-lg p-3">
              <p className="text-xs text-blue-300 mb-2 font-semibold">Password Requirements:</p>
              <ul className="text-xs text-blue-200 space-y-1">
                <li className={newPassword.length >= 6 ? 'text-green-400' : ''}>
                  • At least 6 characters
                </li>
                <li className={newPassword === confirmPassword && newPassword ? 'text-green-400' : ''}>
                  • Passwords match
                </li>
                <li className={newPassword !== currentPassword && newPassword ? 'text-green-400' : ''}>
                  • Different from current password
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full px-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 font-semibold shadow-lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Changing Password...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Success!</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Change Password Now</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Note */}
          <div className="mt-6 p-3 bg-black/30 border border-gray-500/30 rounded-lg">
            <p className="text-xs text-gray-400 text-center">
              This is a one-time security measure. You won't see this again after changing your password.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
