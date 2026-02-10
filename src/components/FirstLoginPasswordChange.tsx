import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle, Shield, X } from 'lucide-react';
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

  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading && !success) {
        handleSkip();
      }
    };

    if (show) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [show, loading, success]);

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

  const handleSkip = () => {
    if (confirm('Are you sure you want to skip changing your password? You can change it later from your profile.')) {
      setShow(false);
      onPasswordChanged();
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

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    // Check for at least one symbol
    const symbolRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (!symbolRegex.test(newPassword)) {
      setError('Password must contain at least one symbol (!@#$%^&* etc.)');
      return;
    }

    // Check for at least one number
    const numberRegex = /[0-9]/;
    if (!numberRegex.test(newPassword)) {
      setError('Password must contain at least one number');
      return;
    }

    // Check for at least one uppercase letter
    const uppercaseRegex = /[A-Z]/;
    if (!uppercaseRegex.test(newPassword)) {
      setError('Password must contain at least one uppercase letter');
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
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-gradient-to-br from-orange-900/90 to-red-900/90 border-2 border-orange-500/60 rounded-2xl p-6 max-w-md w-full relative shadow-2xl my-8"
        >
          {/* Close Button */}
          <button
            onClick={handleSkip}
            disabled={loading || success}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Skip for now (ESC)"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-orange-500/30 rounded-lg">
              <Shield className="w-6 h-6 text-orange-300" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Security Alert</h3>
              <p className="text-xs text-orange-200">First time login detected</p>
            </div>
          </div>

          {/* Warning Message */}
          <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-500/50 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-xs font-semibold text-yellow-300 mb-1">Change Your Password</h4>
                <p className="text-xs text-yellow-200 leading-relaxed">
                  You are using the default password. For security reasons, please change it.
                  Current password: <span className="font-bold">player123</span>
                </p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 p-3 bg-green-900/30 border border-green-500/50 rounded-lg flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-300 text-sm">Password changed successfully!</span>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 p-3 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center space-x-2"
            >
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-red-300 text-sm">{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Current Password */}
            <div>
              <label className="block text-orange-200 text-xs mb-1 font-medium">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-black/40 border border-orange-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10"
                  placeholder="Enter current password"
                  disabled={loading || success}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-orange-200 text-xs mb-1 font-medium">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-black/40 border border-orange-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10"
                  placeholder="Enter new password"
                  disabled={loading || success}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-orange-200 text-xs mb-1 font-medium">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-black/40 border border-orange-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10"
                  placeholder="Confirm new password"
                  disabled={loading || success}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-900/30 border border-blue-500/40 rounded-lg p-2">
              <p className="text-xs text-blue-300 mb-1 font-semibold">Password Requirements:</p>
              <ul className="text-xs text-blue-200 space-y-0.5">
                <li className={newPassword.length >= 8 ? 'text-green-400' : ''}>
                  • At least 8 characters
                </li>
                <li className={/[A-Z]/.test(newPassword) ? 'text-green-400' : ''}>
                  • One uppercase letter (A-Z)
                </li>
                <li className={/[0-9]/.test(newPassword) ? 'text-green-400' : ''}>
                  • One number (0-9)
                </li>
                <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword) ? 'text-green-400' : ''}>
                  • One symbol (!@#$%^&* etc.)
                </li>
                <li className={newPassword === confirmPassword && newPassword ? 'text-green-400' : ''}>
                  • Passwords match
                </li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleSkip}
                disabled={loading || success}
                className="flex-1 px-3 py-2 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300 text-sm font-medium"
              >
                Skip for Now
              </button>
              <button
                type="submit"
                disabled={loading || success}
                className="flex-1 px-3 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 font-medium text-sm shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Changing...</span>
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Success!</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Change Password</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Note */}
          <div className="mt-3 p-2 bg-black/30 border border-gray-500/30 rounded-lg">
            <p className="text-xs text-gray-400 text-center">
              Press ESC or click Skip to change later. Recommended to change now for security.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
