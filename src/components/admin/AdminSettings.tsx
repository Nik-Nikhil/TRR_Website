import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Mail, Shield, Save, Eye, EyeOff, Loader2 } from 'lucide-react';
import { AuthService } from '../../services/auth';
import { useModal } from '../../hooks/useModal';
import passwordService from '../../services/passwordService';

interface AdminProfile {
  username: string;
  displayName: string;
  email: string;
  bio: string;
  role: string;
  avatarUrl?: string;
}

export const AdminSettings = () => {
  const { confirm, alert, ModalComponent } = useModal();
  const [loading, setLoading] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<AdminProfile | null>(null);
  
  // Profile fields
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    loadAdminProfile();
  }, []);

  const loadAdminProfile = () => {
    const session = AuthService.getCurrentAdminSession();
    if (session) {
      setCurrentAdmin({
        username: session.username,
        displayName: session.displayName || session.username,
        email: session.email || '',
        bio: session.bio || '',
        role: session.role || 'admin',
        avatarUrl: session.avatarUrl || ''
      });
      
      setDisplayName(session.displayName || session.username);
      setEmail(session.email || '');
      setBio(session.bio || '');
      setAvatarUrl(session.avatarUrl || '');
    }
  };

  const handleUpdateProfile = async () => {
    const confirmed = await confirm(
      'Update your profile information?\n\nThis will update your display name, email, bio, and avatar.',
      'Update Profile'
    );

    if (!confirmed) return;

    setLoading(true);

    // Update admin profile in localStorage
    const session = AuthService.getCurrentAdminSession();
    if (session) {
      const updatedSession = {
        ...session,
        displayName,
        email,
        bio,
        avatarUrl
      };
      
      localStorage.setItem('adminSession', JSON.stringify(updatedSession));
      
      // Update in admins list
      const admins = JSON.parse(localStorage.getItem('admins') || '[]');
      const updatedAdmins = admins.map((admin: any) => 
        admin.username === session.username 
          ? { ...admin, displayName, email, bio, avatarUrl }
          : admin
      );
      localStorage.setItem('admins', JSON.stringify(updatedAdmins));
      
      await alert('Profile updated successfully!', 'Success', 'success');
      loadAdminProfile();
    }

    setLoading(false);
  };

  const handleChangePassword = async () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      await alert('Please fill in all password fields', 'Missing Fields', 'warning');
      return;
    }

    if (newPassword.length < 6) {
      await alert('New password must be at least 6 characters long', 'Invalid Password', 'warning');
      return;
    }

    if (newPassword !== confirmPassword) {
      await alert('New password and confirmation do not match', 'Password Mismatch', 'warning');
      return;
    }

    const confirmed = await confirm(
      'Change your password?\n\nYou will need to use the new password for future logins.',
      'Change Password'
    );

    if (!confirmed) return;

    setLoading(true);

    const session = AuthService.getCurrentAdminSession();
    if (!session) {
      await alert('Session not found. Please log in again.', 'Error', 'warning');
      setLoading(false);
      return;
    }

    // Use password service to change password with encryption
    const result = await passwordService.changePassword(
      session.username,
      'admin',
      currentPassword,
      newPassword
    );

    if (result.success) {
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      await alert('Password changed successfully!', 'Success', 'success');
    } else {
      await alert(result.error || 'Failed to change password', 'Error', 'warning');
    }

    setLoading(false);
  };

  if (!currentAdmin) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <ModalComponent />

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Admin Settings</h2>
        <p className="text-gray-400 text-sm">Manage your profile and security settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Profile Information</h3>
              <p className="text-sm text-gray-400">Update your personal details</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Username (Read-only) */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={currentAdmin.username}
                disabled
                className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
                className="w-full px-4 py-3 bg-black/60 border border-purple-500/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 bg-black/60 border border-purple-500/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={3}
                className="w-full px-4 py-3 bg-black/60 border border-purple-500/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            {/* Avatar URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Avatar URL
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-4 py-3 bg-black/60 border border-purple-500/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Role (Read-only) */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                <Shield className="w-4 h-4 inline mr-1" />
                Role
              </label>
              <input
                type="text"
                value={currentAdmin.role.toUpperCase()}
                disabled
                className="w-full px-4 py-3 bg-black/60 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Role is managed by Super Admin</p>
            </div>

            {/* Save Button */}
            <button
              onClick={handleUpdateProfile}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Profile
            </button>
          </div>
        </motion.div>

        {/* Password Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-red-900/40 to-rose-900/40 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Change Password</h3>
              <p className="text-sm text-gray-400">Update your security credentials</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 pr-12 bg-black/60 border border-red-500/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
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
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                  className="w-full px-4 py-3 pr-12 bg-black/60 border border-red-500/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
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
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 pr-12 bg-black/60 border border-red-500/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
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
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <p className="text-yellow-300 text-xs font-semibold mb-2">Password Requirements:</p>
              <ul className="text-yellow-200 text-xs space-y-1">
                <li>• Minimum 6 characters</li>
                <li>• Must match confirmation</li>
                <li>• Different from current password</li>
              </ul>
            </div>

            {/* Change Password Button */}
            <button
              onClick={handleChangePassword}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
              Change Password
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
