import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Save, X } from 'lucide-react';
import { PlayerService } from '../services/supabaseService';
import { AuthService } from '../services/auth';
import { ImageOptimizationService } from '../services/imageOptimizationService';
import type { Player } from '../services/supabaseService';

export default function Profile() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    nickname: '',
    real_name: '',
    discord_username: '',
    steam_url: '',
    dotabuff_url: '',
    current_mmr: '',
    peak_mmr: '',
    bio: '',
    ping_range: '',
    whatsapp_number: '',
    email: ''
  });

  useEffect(() => {
    loadPlayerProfile();
  }, []);

  const loadPlayerProfile = async () => {
    try {
      const session = AuthService.getCurrentPlayerSession();
      if (!session) {
        setMessage('Please login to view your profile');
        setLoading(false);
        return;
      }

      const playerData = await PlayerService.getPlayerById(session.playerId);
      if (playerData) {
        setPlayer(playerData);
        setFormData({
          nickname: playerData.nickname || '',
          real_name: playerData.real_name || '',
          discord_username: playerData.discord_username || '',
          steam_url: playerData.steam_url || '',
          dotabuff_url: playerData.dotabuff_url || '',
          current_mmr: playerData.current_mmr?.toString() || '',
          peak_mmr: playerData.peak_mmr?.toString() || '',
          bio: playerData.bio || '',
          ping_range: playerData.ping_range || '',
          whatsapp_number: playerData.whatsapp_number || '',
          email: playerData.email || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setMessage('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !player) return;

    setUploading(true);
    setMessage('');

    try {
      // Validate file size (max 5MB before compression)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image too large. Please select an image under 5MB.');
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file.');
      }

      // Upload with automatic compression
      const fileName = `${player.id}-${Date.now()}.jpg`;
      const filePath = `avatars/${fileName}`;

      const { url, size, originalSize } = await ImageOptimizationService.uploadCompressedImage(
        file,
        'avatars',
        filePath,
        { maxWidth: 800, quality: 0.7 }
      );

      // Track the upload for future optimization
      await ImageOptimizationService.trackImageUpload(
        player.id,
        url,
        originalSize,
        size,
        'avatar'
      );

      // Update player profile
      await PlayerService.updatePlayer(player.id, { avatar_url: url });

      setPlayer({ ...player, avatar_url: url });
      
      const savedPercent = Math.round((1 - size/originalSize) * 100);
      setMessage(`Avatar updated successfully! (${savedPercent}% smaller)`);
    } catch (error: any) {
      console.error('Upload error:', error);
      setMessage(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!player) return;

    setSaving(true);
    setMessage('');

    try {
      const updates: Partial<Player> = {
        real_name: formData.real_name,
        discord_username: formData.discord_username,
        steam_url: formData.steam_url,
        dotabuff_url: formData.dotabuff_url,
        current_mmr: formData.current_mmr ? parseInt(formData.current_mmr) : undefined,
        peak_mmr: formData.peak_mmr ? parseInt(formData.peak_mmr) : undefined,
        bio: formData.bio,
        ping_range: formData.ping_range,
        whatsapp_number: formData.whatsapp_number,
        email: formData.email
      };

      await PlayerService.updatePlayer(player.id, updates);
      setMessage('Profile updated successfully!');
      
      // Reload profile
      await loadPlayerProfile();
    } catch (error: any) {
      console.error('Save error:', error);
      setMessage(error.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Please login to view your profile</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/40 p-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes('success') 
                ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                : 'bg-red-500/20 border border-red-500/50 text-red-300'
            }`}>
              {message}
            </div>
          )}

          {/* Avatar Upload */}
          <div className="mb-8 flex flex-col items-center">
            <div className="relative">
              <img
                src={player.avatar_url || `https://ui-avatars.com/api/?name=${player.nickname}&size=200`}
                alt={player.nickname}
                className="w-32 h-32 rounded-full border-4 border-purple-500"
              />
              <label className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-500 p-2 rounded-full cursor-pointer transition-colors">
                <Upload className="w-5 h-5 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
            {uploading && <p className="text-gray-400 text-sm mt-2">Uploading...</p>}
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nickname (readonly) */}
            <div>
              <label className="text-white text-sm font-semibold mb-2 block">Nickname</label>
              <input
                type="text"
                value={formData.nickname}
                disabled
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
              />
            </div>

            {/* Real Name */}
            <div>
              <label className="text-white text-sm font-semibold mb-2 block">Real Name</label>
              <input
                type="text"
                name="real_name"
                value={formData.real_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-black/60 border border-purple-500/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Discord */}
            <div>
              <label className="text-white text-sm font-semibold mb-2 block">Discord Username</label>
              <input
                type="text"
                name="discord_username"
                value={formData.discord_username}
                onChange={handleInputChange}
                placeholder="username#1234"
                className="w-full px-4 py-2 bg-black/60 border border-purple-500/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="text-white text-sm font-semibold mb-2 block">WhatsApp Number</label>
              <input
                type="text"
                name="whatsapp_number"
                value={formData.whatsapp_number}
                onChange={handleInputChange}
                placeholder="+1234567890"
                className="w-full px-4 py-2 bg-black/60 border border-purple-500/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-white text-sm font-semibold mb-2 block">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className="w-full px-4 py-2 bg-black/60 border border-purple-500/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Current MMR */}
            <div>
              <label className="text-white text-sm font-semibold mb-2 block">Current MMR</label>
              <input
                type="number"
                name="current_mmr"
                value={formData.current_mmr}
                onChange={handleInputChange}
                placeholder="5000"
                className="w-full px-4 py-2 bg-black/60 border border-purple-500/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Peak MMR */}
            <div>
              <label className="text-white text-sm font-semibold mb-2 block">Peak MMR</label>
              <input
                type="number"
                name="peak_mmr"
                value={formData.peak_mmr}
                onChange={handleInputChange}
                placeholder="5500"
                className="w-full px-4 py-2 bg-black/60 border border-purple-500/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Steam URL */}
            <div>
              <label className="text-white text-sm font-semibold mb-2 block">Steam Profile URL</label>
              <input
                type="url"
                name="steam_url"
                value={formData.steam_url}
                onChange={handleInputChange}
                placeholder="https://steamcommunity.com/..."
                className="w-full px-4 py-2 bg-black/60 border border-purple-500/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Dotabuff URL */}
            <div>
              <label className="text-white text-sm font-semibold mb-2 block">Dotabuff URL</label>
              <input
                type="url"
                name="dotabuff_url"
                value={formData.dotabuff_url}
                onChange={handleInputChange}
                placeholder="https://www.dotabuff.com/..."
                className="w-full px-4 py-2 bg-black/60 border border-purple-500/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Ping Range */}
            <div>
              <label className="text-white text-sm font-semibold mb-2 block">Ping Range</label>
              <input
                type="text"
                name="ping_range"
                value={formData.ping_range}
                onChange={handleInputChange}
                placeholder="20-50ms"
                className="w-full px-4 py-2 bg-black/60 border border-purple-500/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Bio (full width) */}
            <div className="md:col-span-2">
              <label className="text-white text-sm font-semibold mb-2 block">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                placeholder="Tell us about yourself..."
                className="w-full px-4 py-2 bg-black/60 border border-purple-500/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-lg transition-all duration-300 flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
