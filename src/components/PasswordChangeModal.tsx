import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, X, AlertCircle, CheckCircle } from 'lucide-react';
import passwordService from '../services/passwordService';
import type { UserType } from '../services/passwordService';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userType: UserType;
  userName: string;
  requireOldPassword?: boolean;
}

export default function PasswordChangeModal({
  isOpen,
  onClose,
  userId,
  userType,
  userName,
  requireOldPassword = true
}: PasswordChangeModalProps) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validation
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (requireOldPassword && !oldPassword) {
      setError('Please enter your current password');
      return;
    }

    setLoading(true);

    try {
      let result;
      
      if (requireOldPassword) {
        result = await passwordService.changePassword(userId, userType, oldPassword, newPassword);
      } else {
        result = await passwordService.setPassword(userId, userType, newPassword);
      }

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          handleClose();
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

  const handleClose = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess(false);
    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-gradient-to-br from-gray-900 to-black border border-orange-500/40 rounded-2xl p-8 max-w-md w-full relative"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <Lock className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Change Password</h3>
              <p className="text-sm text-gray-400">{userName}</p>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-green-900/20 border border-green-500/50 rounded-lg flex items-center space-x-3"
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
              className="mb-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center space-x-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-300">{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            {requireOldPassword && (
              <div>
                <label className="block text-orange-300 text-sm mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-black/60 border border-orange-500/40 rounded-lg text-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12"
                    placeholder="Enter current password"
                    disabled={loading || success}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* New Password */}
            <div>
              <label className="block text-orange-300 text-sm mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-black/60 border border-orange-500/40 rounded-lg text-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12"
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
              <label className="block text-orange-300 text-sm mb-2">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-black/60 border border-orange-500/40 rounded-lg text-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12"
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
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
              <p className="text-xs text-blue-300 mb-2 font-semibold">Password Requirements:</p>
              <ul className="text-xs text-blue-400 space-y-1">
                <li className={newPassword.length >= 6 ? 'text-green-400' : ''}>
                  • At least 6 characters
                </li>
                <li className={newPassword === confirmPassword && newPassword ? 'text-green-400' : ''}>
                  • Passwords match
                </li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || success}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Changing...</span>
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Success!</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Change Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
