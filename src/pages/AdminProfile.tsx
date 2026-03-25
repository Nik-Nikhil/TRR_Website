import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  User, Calendar, MessageCircle, ExternalLink, Mail,
  Edit2, Save, X, LogOut, Camera
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import AuthService from '../services/auth';
import { ImageOptimizationService } from '../services/imageOptimizationService';
import ImageCropModal from '../components/ImageCropModal';

interface AdminData {
  id: string;
  username: string;
  displayName: string;
  realName?: string;
  role: 'Founder' | 'Admin' | 'Mini Admin';
  avatarUrl?: string;
  description?: string;
  discordUsername?: string;
  steamUrl?: string;
  email?: string;
  githubUrl?: string;
  twitchUrl?: string;
  isActive: boolean;
  createdAt?: string;
}

const getRoleColor = (role: string) => {
  switch (role) {
    case 'Founder': return 'from-yellow-400 to-orange-500';
    case 'Admin': return 'from-blue-400 to-purple-500';
    case 'Mini Admin': return 'from-green-400 to-teal-500';
    default: return 'from-gray-400 to-gray-500';
  }
};

const mapRow = (row: any): AdminData => ({
  id: row.id,
  username: row.username,
  displayName: row.display_name,
  realName: row.real_name,
  role: row.role,
  avatarUrl: row.avatar_url,
  description: row.description,
  discordUsername: row.discord_username,
  steamUrl: row.steam_url,
  email: row.email,
  githubUrl: row.github_url,
  twitchUrl: row.twitch_url,
  isActive: row.is_active,
  createdAt: row.created_at,
});

const AdminProfile: React.FC = () => {
  const { adminId } = useParams<{ adminId: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  const [editForm, setEditForm] = useState({
    displayName: '',
    realName: '',
    description: '',
    discordUsername: '',
    steamUrl: '',
    email: '',
  });

  const adminSession = AuthService.getCurrentAdminSession();
  const isOwnProfile = adminSession?.username === adminId;

  useEffect(() => {
    if (adminId) fetchAdmin();
  }, [adminId]);

  const fetchAdmin = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', adminId)
      .maybeSingle();

    if (error || !data) {
      setError('Admin not found');
      setLoading(false);
      return;
    }

    const mapped = mapRow(data);
    setAdmin(mapped);
    setEditForm({
      displayName: mapped.displayName || '',
      realName: mapped.realName || '',
      description: mapped.description || '',
      discordUsername: mapped.discordUsername || '',
      steamUrl: mapped.steamUrl || '',
      email: mapped.email || '',
    });
    setLoading(false);
  };

  const handleSave = async () => {
    if (!admin) return;
    setSaving(true);
    setError('');

    const { error } = await supabase
      .from('admins')
      .update({
        display_name: editForm.displayName,
        real_name: editForm.realName || null,
        description: editForm.description || null,
        discord_username: editForm.discordUsername || null,
        steam_url: editForm.steamUrl || null,
        email: editForm.email || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', admin.id);

    if (error) {
      // If columns don't exist yet, try without them
      const { error: error2 } = await supabase
        .from('admins')
        .update({
          display_name: editForm.displayName,
          real_name: editForm.realName || null,
          description: editForm.description || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', admin.id);

      if (error2) {
        setError('Failed to save: ' + error2.message);
        setSaving(false);
        return;
      }
    }

    setAdmin(prev => prev ? {
      ...prev,
      displayName: editForm.displayName,
      realName: editForm.realName,
      description: editForm.description,
      discordUsername: editForm.discordUsername,
      steamUrl: editForm.steamUrl,
      email: editForm.email,
    } : prev);

    setEditing(false);
    setSaving(false);
    setSuccessMsg('Profile updated');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !admin) return;
    // Show crop modal instead of uploading directly
    const url = URL.createObjectURL(file);
    setCropSrc(url);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const handleCropConfirm = async (croppedBlob: Blob) => {
    if (!admin) return;
    setCropSrc(null);
    setUploadingAvatar(true);
    setError('');
    try {
      const file = new File([croppedBlob], 'avatar.jpg', { type: 'image/jpeg' });
      const result = await ImageOptimizationService.uploadCompressedImage(
        file, 'avatars', `admins/${admin.username}_${Date.now()}.jpg`,
        { maxWidth: 400, quality: 0.85 }
      );
      const { error: dbError } = await supabase
        .from('admins')
        .update({ avatar_url: result.url, updated_at: new Date().toISOString() })
        .eq('id', admin.id);
      if (dbError) throw dbError;
      setAdmin(prev => prev ? { ...prev, avatarUrl: result.url } : prev);
      setSuccessMsg('Avatar updated');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError('Avatar upload failed: ' + (err.message || 'Unknown error'));
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleLogout = () => {
    AuthService.clearAdminSession();
    navigate('/admin-login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'rgba(5,7,10)' }}>
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'rgba(5,7,10)' }}>
        <div className="text-white/60">Admin not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white" style={{ background: 'rgba(5,7,10)', fontFamily: 'Poppins, sans-serif' }}>
      {cropSrc && (
        <ImageCropModal
          imageSrc={cropSrc}
          onConfirm={handleCropConfirm}
          onCancel={() => { setCropSrc(null); URL.revokeObjectURL(cropSrc); }}
        />
      )}
      {/* Role gradient header bar */}
      <div className={`h-2 w-full bg-gradient-to-r ${getRoleColor(admin.role)}`} />
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Messages */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
            {successMsg}
          </div>
        )}

        {/* Profile card */}
        <div className="rounded-xl border border-white/8 backdrop-blur-sm overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
          {/* Header section */}
          <div className="p-6 flex items-start gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10">
                <img
                  src={admin.avatarUrl || '/avatars/default.jpg'}
                  alt={admin.displayName}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/avatars/Machine.png'; }}
                />
              </div>
              {isOwnProfile && (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5 text-white" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </>
              )}
              {uploadingAvatar && (
                <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Name + role */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold truncate">{admin.displayName}</h1>
              <p className={`text-sm font-semibold bg-gradient-to-r ${getRoleColor(admin.role)} bg-clip-text text-transparent`}>
                {admin.role}
              </p>
              <p className="text-white/40 text-sm">@{admin.username}</p>
              {admin.createdAt && (
                <div className="flex items-center gap-1.5 mt-1 text-white/30 text-xs">
                  <Calendar className="w-3 h-3" />
                  <span>Admin since {new Date(admin.createdAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            {isOwnProfile && (
              <div className="flex items-center gap-2 flex-shrink-0">
                {!editing ? (
                  <>
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 text-sm transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm transition-colors disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 text-sm transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-white/8" />

          {/* Body */}
          <div className="p-6 space-y-5">
            {/* Display name (edit) */}
            {editing && (
              <div>
                <label className="block text-xs text-white/40 mb-1">Display Name</label>
                <input
                  value={editForm.displayName}
                  onChange={e => setEditForm(f => ({ ...f, displayName: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50"
                />
              </div>
            )}

            {/* Real name */}
            <div>
              <label className="block text-xs text-white/40 mb-1">
                <User className="w-3 h-3 inline mr-1" />Real Name
              </label>
              {editing ? (
                <input
                  value={editForm.realName}
                  onChange={e => setEditForm(f => ({ ...f, realName: e.target.value }))}
                  placeholder="Your real name (optional)"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50"
                />
              ) : (
                <p className="text-white/70 text-sm">{admin.realName || <span className="text-white/25 italic">Not set</span>}</p>
              )}
            </div>

            {/* Bio / description */}
            <div>
              <label className="block text-xs text-white/40 mb-1">Bio</label>
              {editing ? (
                <textarea
                  value={editForm.description}
                  onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Tell the community about yourself..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50 resize-none"
                />
              ) : (
                <p className="text-white/70 text-sm leading-relaxed">
                  {admin.description || <span className="text-white/25 italic">No bio yet</span>}
                </p>
              )}
            </div>

            <div className="border-t border-white/8" />

            {/* Contact info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Discord */}
              <div>
                <label className="block text-xs text-white/40 mb-1">
                  <MessageCircle className="w-3 h-3 inline mr-1" />Discord
                </label>
                {editing ? (
                  <input
                    value={editForm.discordUsername}
                    onChange={e => setEditForm(f => ({ ...f, discordUsername: e.target.value }))}
                    placeholder="username#0000"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50"
                  />
                ) : (
                  <p className="text-white/70 text-sm">
                    {admin.discordUsername || <span className="text-white/25 italic">Not set</span>}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs text-white/40 mb-1">
                  <Mail className="w-3 h-3 inline mr-1" />Email
                </label>
                {editing ? (
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="admin@example.com"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50"
                  />
                ) : (
                  <p className="text-white/70 text-sm">
                    {admin.email || <span className="text-white/25 italic">Not set</span>}
                  </p>
                )}
              </div>

              {/* Steam */}
              <div>
                <label className="block text-xs text-white/40 mb-1">
                  <ExternalLink className="w-3 h-3 inline mr-1" />Steam URL
                </label>
                {editing ? (
                  <input
                    value={editForm.steamUrl}
                    onChange={e => setEditForm(f => ({ ...f, steamUrl: e.target.value }))}
                    placeholder="https://steamcommunity.com/id/..."
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500/50"
                  />
                ) : admin.steamUrl ? (
                  <a
                    href={admin.steamUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                  >
                    Steam Profile <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <p className="text-white/25 text-sm italic">Not set</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
