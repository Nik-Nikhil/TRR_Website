import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Shield, Trash2, X, Eye, EyeOff, Loader2, Ban, CheckCircle } from 'lucide-react';
import { useModal } from '../../hooks/useModal';
import adminService from '../../services/adminService';

// Map database role to display role
function mapRole(dbRole: string): 'superadmin' | 'admin' | 'mini-admin' {
  if (dbRole === 'Founder') return 'superadmin';
  if (dbRole === 'Admin') return 'admin';
  return 'mini-admin';
}

// Map display role to database role
function mapToDbRole(role: 'superadmin' | 'admin' | 'mini-admin'): 'Founder' | 'Admin' | 'Mini Admin' {
  if (role === 'superadmin') return 'Founder';
  if (role === 'admin') return 'Admin';
  return 'Mini Admin';
}

// Local interface for UI state (extends service Admin)
interface AdminUI {
  id?: string;
  username: string;
  displayName: string;
  email?: string;
  role: 'superadmin' | 'admin' | 'mini-admin';
  bio?: string;
  avatarUrl?: string;
  createdAt?: Date | string;
  createdBy?: string;
  isDisabled?: boolean;
  disableReason?: string;
  disabledAt?: Date | string;
  disabledBy?: string;
}

export const AdminManagement = () => {
  const { confirm, alert, ModalComponent } = useModal();
  const [admins, setAdmins] = useState<AdminUI[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'mini-admin'>('admin');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadAdmins();
    
    // Subscribe to admin changes
    const subscription = adminService.subscribeToAdmins(() => {
      loadAdmins();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadAdmins = async () => {
    const dbAdmins = await adminService.getAdmins();
    
    // Map and sort by role hierarchy: superadmin > admin > mini-admin
    const mappedAdmins = dbAdmins.map(a => ({
      id: a.id,
      username: a.username,
      displayName: a.displayName,
      email: a.realName || '',
      role: mapRole(a.role),
      bio: a.description,
      avatarUrl: a.avatarUrl,
      createdAt: a.createdAt,
      isDisabled: !a.isActive
    }));

    // Sort by role hierarchy, then by creation date (oldest first)
    const roleOrder = { 'superadmin': 0, 'admin': 1, 'mini-admin': 2 };
    mappedAdmins.sort((a, b) => {
      const orderA = roleOrder[a.role] ?? 999;
      const orderB = roleOrder[b.role] ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      // If same role, sort by creation date (oldest first - created earlier appears above)
      return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
    });

    setAdmins(mappedAdmins);
  };

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setDisplayName('');
    setEmail('');
    setRole('admin');
    setBio('');
    setAvatarUrl('');
    setShowPassword(false);
  };

  const handleAddAdmin = async () => {
    // Validation
    if (!username || !password || !displayName) {
      await alert('Please fill in username, password, and display name', 'Missing Fields', 'warning');
      return;
    }

    if (username.length < 3) {
      await alert('Username must be at least 3 characters', 'Invalid Username', 'warning');
      return;
    }

    // Check for spaces in username
    if (username.includes(' ')) {
      await alert('Username cannot contain spaces. Use lowercase letters, numbers, and underscores only.\n\nExample: "shaileshzambare" not "Shailesh Zambare"', 'Invalid Username', 'warning');
      return;
    }

    // Check for uppercase letters
    if (username !== username.toLowerCase()) {
      await alert('Username must be lowercase only.\n\nExample: "rajdodia" not "RajDodia"', 'Invalid Username', 'warning');
      return;
    }

    // Check for special characters (allow only letters, numbers, underscore)
    if (!/^[a-z0-9_]+$/.test(username)) {
      await alert('Username can only contain lowercase letters, numbers, and underscores.\n\nExample: "admin_user" or "admin123"', 'Invalid Username', 'warning');
      return;
    }

    if (password.length < 6) {
      await alert('Password must be at least 6 characters', 'Invalid Password', 'warning');
      return;
    }

    const confirmed = await confirm(
      `Add new ${role} "${username}"?\n\nRole: ${role.toUpperCase()}\nDisplay Name: ${displayName}`,
      'Add Admin'
    );

    if (!confirmed) return;

    setLoading(true);

    const result = await adminService.addAdmin({
      username,
      password,
      displayName,
      realName: email,
      role: mapToDbRole(role),
      description: bio,
      avatarUrl,
      isActive: true
    });

    if (result.success) {
      await alert(`Admin "${username}" added successfully!`, 'Success', 'success');
      await loadAdmins();
      resetForm();
      setShowAddForm(false);
    } else {
      await alert(result.error || 'Failed to add admin', 'Error', 'warning');
    }
    
    setLoading(false);
  };

  const handleDeleteAdmin = async (admin: AdminUI) => {
    if (admin.role === 'superadmin') {
      await alert('Cannot delete Super Admin account', 'Protected Account', 'warning');
      return;
    }

    if (!admin.id) {
      await alert('Invalid admin ID', 'Error', 'warning');
      return;
    }

    const confirmed = await confirm(
      `Delete admin "${admin.username}"?\n\nThis action cannot be undone.`,
      'Delete Admin'
    );

    if (!confirmed) return;

    setLoading(true);

    const result = await adminService.deleteAdmin(admin.id);

    if (result.success) {
      await alert(`Admin "${admin.username}" deleted`, 'Deleted', 'success');
      await loadAdmins();
    } else {
      await alert(result.error || 'Failed to delete admin', 'Error', 'warning');
    }
    
    setLoading(false);
  };

  const handleDisableAdmin = async (admin: AdminUI) => {
    if (admin.role === 'superadmin') {
      await alert('Cannot disable Super Admin account', 'Protected Account', 'warning');
      return;
    }

    if (!admin.id) {
      await alert('Invalid admin ID', 'Error', 'warning');
      return;
    }

    const confirmed = await confirm(
      `Disable admin "${admin.username}"?\n\nThis will:\n• Lock their account\n• Prevent login access\n• Remove from admin page\n• Keep their data for records`,
      'Disable Admin'
    );

    if (!confirmed) return;

    setLoading(true);

    const result = await adminService.updateAdmin(admin.id, {
      isActive: false
    });

    if (result.success) {
      await alert(`Admin "${admin.username}" has been disabled and locked out`, 'Disabled', 'success');
      await loadAdmins();
    } else {
      await alert(result.error || 'Failed to disable admin', 'Error', 'warning');
    }
    
    setLoading(false);
  };

  const handleEnableAdmin = async (admin: AdminUI) => {
    if (!admin.id) {
      await alert('Invalid admin ID', 'Error', 'warning');
      return;
    }

    const confirmed = await confirm(
      `Enable admin "${admin.username}"?\n\nThis will restore their access.`,
      'Enable Admin'
    );

    if (!confirmed) return;

    setLoading(true);

    const result = await adminService.updateAdmin(admin.id, {
      isActive: true
    });

    if (result.success) {
      await alert(`Admin "${admin.username}" has been enabled`, 'Enabled', 'success');
      await loadAdmins();
    } else {
      await alert(result.error || 'Failed to enable admin', 'Error', 'warning');
    }
    
    setLoading(false);
  };

  const handleUpdateRole = async (admin: AdminUI, newRole: 'admin' | 'mini-admin') => {
    if (admin.role === 'superadmin') {
      await alert('Cannot change Super Admin role', 'Protected Account', 'warning');
      return;
    }

    if (!admin.id) {
      await alert('Invalid admin ID', 'Error', 'warning');
      return;
    }

    const confirmed = await confirm(
      `Change role for "${admin.username}"?\n\nFrom: ${admin.role.toUpperCase()}\nTo: ${newRole.toUpperCase()}`,
      'Change Role'
    );

    if (!confirmed) return;

    setLoading(true);

    const result = await adminService.updateAdmin(admin.id, {
      role: mapToDbRole(newRole)
    });

    if (result.success) {
      await alert(`Role updated for "${admin.username}"`, 'Success', 'success');
      await loadAdmins();
    } else {
      await alert(result.error || 'Failed to update role', 'Error', 'warning');
    }
    
    setLoading(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin': return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'admin': return 'text-purple-400 bg-purple-500/20 border-purple-500/50';
      case 'mini-admin': return 'text-blue-400 bg-blue-500/20 border-blue-500/50';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
    }
  };

  const getRoleIcon = () => {
    return <Shield className="w-4 h-4" />;
  };

  return (
    <div className="p-8 space-y-6">
      <ModalComponent />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Admin Management</h2>
          <p className="text-gray-400 text-sm">Add and manage admin accounts</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold rounded-lg transition-all"
        >
          {showAddForm ? <X className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
          {showAddForm ? 'Cancel' : 'Add Admin'}
        </button>
      </div>

      {/* Add Admin Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-xl border border-green-500/30 rounded-2xl p-6 shadow-2xl"
        >
          <h3 className="text-xl font-bold text-white mb-4">Add New Admin</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Username <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="lowercase_only (e.g., johndoe)"
                className="w-full px-4 py-3 bg-black/60 border border-green-500/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Lowercase letters, numbers, and underscores only. No spaces!
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-4 py-3 pr-12 bg-black/60 border border-green-500/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Display Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-black/60 border border-green-500/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-4 py-3 bg-black/60 border border-green-500/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Role <span className="text-red-400">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'admin' | 'mini-admin')}
                className="w-full px-4 py-3 bg-black/60 border border-green-500/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="admin">Admin</option>
                <option value="mini-admin">Mini Admin</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Admin: Full access | Mini Admin: Limited access
              </p>
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
                className="w-full px-4 py-3 bg-black/60 border border-green-500/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="About this admin..."
                rows={2}
                className="w-full px-4 py-3 bg-black/60 border border-green-500/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
            </div>
          </div>

          <button
            onClick={handleAddAdmin}
            disabled={loading}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
            Add Admin
          </button>
        </motion.div>
      )}

      {/* Admins List */}
      <div className="grid grid-cols-1 gap-4">
        {admins.filter(a => !a.isDisabled).map((admin) => (
          <motion.div
            key={admin.username}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-start justify-between">
              {/* Admin Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-white font-bold text-lg">{admin.displayName}</h3>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${getRoleColor(admin.role)}`}>
                    {getRoleIcon()}
                    <span className="text-sm font-semibold">{admin.role.toUpperCase()}</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">@{admin.username}</p>
                {admin.email && <p className="text-gray-500 text-sm">{admin.email}</p>}
                {admin.bio && <p className="text-gray-300 text-sm mt-2">{admin.bio}</p>}
                <p className="text-gray-500 text-xs mt-2">
                  Created: {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'Unknown'}
                  {admin.createdBy && ` by ${admin.createdBy}`}
                </p>
              </div>

              {/* Actions */}
              {admin.role !== 'superadmin' && (
                <div className="flex gap-2">
                  {/* Change Role */}
                  <select
                    value={admin.role}
                    onChange={(e) => handleUpdateRole(admin, e.target.value as 'admin' | 'mini-admin')}
                    disabled={loading}
                    className="px-3 py-2 bg-black/60 border border-purple-500/40 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                  >
                    <option value="admin">Admin</option>
                    <option value="mini-admin">Mini Admin</option>
                  </select>

                  {/* Disable */}
                  <button
                    onClick={() => handleDisableAdmin(admin)}
                    disabled={loading}
                    className="px-3 py-2 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/50 text-orange-300 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
                    title="Disable admin account"
                  >
                    <Ban className="w-4 h-4" />
                    <span className="text-xs">Disable</span>
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDeleteAdmin(admin)}
                    disabled={loading}
                    className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 rounded-lg transition-colors disabled:opacity-50"
                    title="Permanently delete admin"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Disabled Admins Section */}
      {admins.filter(a => a.isDisabled).length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-red-400 mb-4">Disabled Admins</h3>
          <div className="grid grid-cols-1 gap-4">
            {admins.filter(a => a.isDisabled).map((admin) => (
              <motion.div
                key={admin.username}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-red-900/40 to-gray-900/40 backdrop-blur-xl border border-red-500/30 rounded-xl p-6 shadow-lg opacity-75"
              >
                <div className="flex items-start justify-between">
                  {/* Admin Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-bold text-lg line-through">{admin.displayName}</h3>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-lg border bg-red-500/20 border-red-500/50 text-red-400">
                        <Ban className="w-4 h-4" />
                        <span className="text-sm font-semibold">DISABLED</span>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${getRoleColor(admin.role)}`}>
                        {getRoleIcon()}
                        <span className="text-sm font-semibold">{admin.role.toUpperCase()}</span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">@{admin.username}</p>
                    {admin.email && <p className="text-gray-500 text-sm">{admin.email}</p>}
                    {admin.disableReason && (
                      <p className="text-red-400 text-sm mt-2">
                        <strong>Reason:</strong> {admin.disableReason}
                      </p>
                    )}
                    <p className="text-gray-500 text-xs mt-2">
                      Disabled: {admin.disabledAt ? new Date(admin.disabledAt).toLocaleDateString() : 'Unknown'}
                      {admin.disabledBy && ` by ${admin.disabledBy}`}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {/* Enable */}
                    <button
                      onClick={() => handleEnableAdmin(admin)}
                      disabled={loading}
                      className="px-3 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 text-green-300 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
                      title="Re-enable admin account"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs">Enable</span>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteAdmin(admin)}
                      disabled={loading}
                      className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 rounded-lg transition-colors disabled:opacity-50"
                      title="Permanently delete admin"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {admins.filter(a => !a.isDisabled).length === 0 && (
        <div className="bg-black/60 backdrop-blur-sm rounded-xl p-12 border border-gray-500/40 text-center">
          <Shield className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No active admins found</p>
        </div>
      )}
    </div>
  );
};
