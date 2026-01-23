import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Upload, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DatabaseService from '../services/database';
import { getMedalFromMMR } from '../utils/mmrToMedal';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ui/ToastContainer';

interface RegistrationData {
  nickname: string;
  realName: string;
  email: string;
  password: string;
  confirmPassword: string;
  currentMMR: string;
  peakMMR: string;
  steamUrl: string;
  dotabuffUrl: string;
  discordUsername: string;
  whatsappNumber: string;
  bio: string;
  avatarFile: File | null;
  selectedRoles: string[];
  pingRange: string;
  agreeToTerms: boolean;
}

const availableRoles = [
  { id: 'carry', label: 'Carry', iconSrc: '/icons/pos_1.png' },
  { id: 'mid', label: 'Mid', iconSrc: '/icons/pos_2.png' },
  { id: 'offlane', label: 'Offlane', iconSrc: '/icons/pos_3.png' },
  { id: 'soft_support', label: 'Soft Support', iconSrc: '/icons/pos_4.png' },
  { id: 'hard_support', label: 'Hard Support', iconSrc: '/icons/pos_5.png' }
];

const pingRanges = [
  { value: '0-50', label: '0-50ms', color: 'text-green-400' },
  { value: '51-100', label: '51-100ms', color: 'text-yellow-400' },
  { value: '101-150', label: '101-150ms', color: 'text-orange-400' },
  { value: '150+', label: '150+ms', color: 'text-red-400' }
];

export default function NewPlayerRegistration() {
  const navigate = useNavigate();
  const { toasts, success, error, warning, removeToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const [formData, setFormData] = useState<RegistrationData>({
    nickname: '',
    realName: '',
    email: '',
    password: '',
    confirmPassword: '',
    currentMMR: '',
    peakMMR: '',
    steamUrl: '',
    dotabuffUrl: '',
    discordUsername: '',
    whatsappNumber: '',
    bio: '',
    avatarFile: null,
    selectedRoles: [],
    pingRange: '',
    agreeToTerms: false
  });

  const handleInputChange = (field: keyof RegistrationData, value: string | boolean | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRoleToggle = (roleLabel: string) => {
    setFormData(prev => {
      const currentRoles = prev.selectedRoles;
      if (currentRoles.includes(roleLabel)) {
        return { ...prev, selectedRoles: currentRoles.filter(r => r !== roleLabel) };
      } else if (currentRoles.length < 3) {
        return { ...prev, selectedRoles: [...currentRoles, roleLabel] };
      } else {
        warning("Role Limit", "You can only select up to 3 preferred roles.");
        return prev;
      }
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        error("File Too Large", "Avatar image must be less than 5MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      handleInputChange('avatarFile', file);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.nickname.trim()) {
      error("Validation Error", "Nickname is required.");
      return false;
    }
    
    if (formData.nickname.length < 3) {
      error("Validation Error", "Nickname must be at least 3 characters long.");
      return false;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      error("Validation Error", "Please enter a valid email address.");
      return false;
    }

    if (formData.password.length < 6) {
      error("Validation Error", "Password must be at least 6 characters long.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      error("Validation Error", "Passwords do not match.");
      return false;
    }

    if (formData.selectedRoles.length === 0) {
      error("Validation Error", "Please select at least one preferred role.");
      return false;
    }

    if (!formData.pingRange) {
      error("Validation Error", "Please select your ping range.");
      return false;
    }

    if (!formData.agreeToTerms) {
      error("Validation Error", "You must agree to the terms and conditions.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Calculate medals from MMR
      const currentMedal = formData.currentMMR ? getMedalFromMMR(parseInt(formData.currentMMR)) : null;
      const peakMedal = formData.peakMMR ? getMedalFromMMR(parseInt(formData.peakMMR)) : null;

      // Prepare player data
      const playerData = {
        nickname: formData.nickname.trim(),
        realName: formData.realName.trim() || undefined,
        email: formData.email.trim(),
        password: formData.password, // In production, this should be hashed
        currentMMR: formData.currentMMR ? parseInt(formData.currentMMR) : undefined,
        peakMMR: formData.peakMMR ? parseInt(formData.peakMMR) : undefined,
        currentMedalLabel: currentMedal?.label || 'Uncalibrated',
        currentMedalId: currentMedal?.id || 'Uncalibrated',
        peakMedalLabel: peakMedal?.label || 'Uncalibrated',
        peakMedalId: peakMedal?.id || 'Uncalibrated',
        steamUrl: formData.steamUrl.trim() || undefined,
        dotabuffUrl: formData.dotabuffUrl.trim() || undefined,
        discordUsername: formData.discordUsername.trim() || undefined,
        whatsappNumber: formData.whatsappNumber.trim() || undefined,
        bio: formData.bio.trim() || '',
        avatarUrl: avatarPreview || '/avatars/default.jpg',
        preferredRoles: formData.selectedRoles,
        pingRange: formData.pingRange,
        seasonBadges: [],
        hasWonCup: false,
        roles: formData.selectedRoles.map(roleLabel => {
          const role = availableRoles.find(r => r.label === roleLabel);
          return { iconSrc: role?.iconSrc || '', label: roleLabel };
        }),
        favoriteHeroes: []
      };

      // Create player account
      const result = await DatabaseService.createPlayerAccount(playerData);

      if (result.success) {
        success("Account Created!", "Your player account has been created successfully. You can now log in.");
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate('/player-login');
        }, 2000);
      } else {
        error("Registration Failed", result.error || "Failed to create account. Please try again.");
      }
    } catch (err) {
      console.error('Registration error:', err);
      error("Registration Failed", "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/bg6.webp')] bg-cover bg-center" />
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 0% 0%, rgba(192,192,192,0.15), transparent 60%), radial-gradient(circle at 100% 100%, rgba(136,144,150,0.12), transparent 60%), rgba(5,7,10,0.94)"
          }}
        />
      </div>

      <main className="relative z-10 min-h-screen pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gray-800/40 hover:bg-gray-700/40 border border-gray-600/30 rounded-lg text-gray-300 hover:text-white transition-all duration-300 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            
            <h1 className="text-4xl font-bold text-white mb-4">Create Player Account</h1>
            <p className="text-gray-400 text-lg">Join The Roshan Rumble community</p>
          </motion.div>

          {/* Registration Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-gray-800/40 backdrop-blur-xl border border-gray-600/30 rounded-2xl p-8 space-y-8"
          >
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white border-b border-gray-600/30 pb-3">
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nickname (In-Game Name) *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.nickname}
                      onChange={(e) => handleInputChange('nickname', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-black/30 border border-gray-600/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      placeholder="Your in-game nickname"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Real Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.realName}
                    onChange={(e) => handleInputChange('realName', e.target.value)}
                    className="w-full px-4 py-3 bg-black/30 border border-gray-600/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="Your real name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-black/30 border border-gray-600/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-black/30 border border-gray-600/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      placeholder="Create a password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-black/30 border border-gray-600/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Avatar Upload */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Profile Picture</h3>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700 border-2 border-gray-600">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <User className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg transition-colors">
                    <Upload className="w-4 h-4" />
                    Upload Avatar
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF • Max 5MB</p>
                </div>
              </div>
            </div>

            {/* Game Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white border-b border-gray-600/30 pb-3">
                Game Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current MMR (Optional)
                  </label>
                  <input
                    type="number"
                    value={formData.currentMMR}
                    onChange={(e) => handleInputChange('currentMMR', e.target.value)}
                    className="w-full px-4 py-3 bg-black/30 border border-gray-600/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="e.g., 4500"
                    min="0"
                    max="15000"
                  />
                  {formData.currentMMR && (
                    <p className="text-xs text-blue-400 mt-1">
                      Medal: {getMedalFromMMR(parseInt(formData.currentMMR)).label}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Peak MMR (Optional)
                  </label>
                  <input
                    type="number"
                    value={formData.peakMMR}
                    onChange={(e) => handleInputChange('peakMMR', e.target.value)}
                    className="w-full px-4 py-3 bg-black/30 border border-gray-600/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="e.g., 5200"
                    min="0"
                    max="15000"
                  />
                  {formData.peakMMR && (
                    <p className="text-xs text-blue-400 mt-1">
                      Medal: {getMedalFromMMR(parseInt(formData.peakMMR)).label}
                    </p>
                  )}
                </div>
              </div>

              {/* Preferred Roles */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Preferred Roles * (Select up to 3)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {availableRoles.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => handleRoleToggle(role.label)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        formData.selectedRoles.includes(role.label)
                          ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                          : 'border-gray-600/40 bg-gray-700/30 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <img src={role.iconSrc} alt={role.label} className="w-8 h-8" />
                        <span className="text-xs font-medium">{role.label}</span>
                        {formData.selectedRoles.includes(role.label) && (
                          <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                            #{formData.selectedRoles.indexOf(role.label) + 1}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Selected: {formData.selectedRoles.length}/3 roles
                </p>
              </div>

              {/* Ping Range */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  SEA Server Ping Range *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {pingRanges.map((ping) => (
                    <button
                      key={ping.value}
                      type="button"
                      onClick={() => handleInputChange('pingRange', ping.value)}
                      className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                        formData.pingRange === ping.value
                          ? 'border-blue-500 bg-blue-500/20'
                          : 'border-gray-600/40 bg-gray-700/30 hover:border-gray-500'
                      }`}
                    >
                      <span className={`text-sm font-medium ${
                        formData.pingRange === ping.value ? 'text-blue-300' : ping.color
                      }`}>
                        {ping.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white border-b border-gray-600/30 pb-3">
                Contact & Links
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Discord Username (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.discordUsername}
                    onChange={(e) => handleInputChange('discordUsername', e.target.value)}
                    className="w-full px-4 py-3 bg-black/30 border border-gray-600/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="username#1234"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    WhatsApp Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsappNumber}
                    onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                    className="w-full px-4 py-3 bg-black/30 border border-gray-600/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="+1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Steam Profile URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.steamUrl}
                    onChange={(e) => handleInputChange('steamUrl', e.target.value)}
                    className="w-full px-4 py-3 bg-black/30 border border-gray-600/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="https://steamcommunity.com/profiles/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Dotabuff Profile URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.dotabuffUrl}
                    onChange={(e) => handleInputChange('dotabuffUrl', e.target.value)}
                    className="w-full px-4 py-3 bg-black/30 border border-gray-600/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    placeholder="https://www.dotabuff.com/players/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bio (Optional)
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 border border-gray-600/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none"
                  rows={4}
                  placeholder="Tell us about yourself..."
                  maxLength={500}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {formData.bio.length}/500 characters
                </p>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white border-b border-gray-600/30 pb-3">
                Terms & Conditions
              </h2>
              
              <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/30">
                <div className="space-y-3 text-sm text-gray-300">
                  <p>By creating an account, you agree to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Provide accurate and truthful information</li>
                    <li>Follow tournament rules and community guidelines</li>
                    <li>Maintain respectful behavior towards other players</li>
                    <li>Allow admins to verify your account information</li>
                    <li>Accept that false information may result in account suspension</li>
                  </ul>
                </div>
                
                <label className="flex items-center gap-3 mt-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-300">
                    I agree to the terms and conditions *
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  isLoading
                    ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Create Account
                  </>
                )}
              </button>
            </div>
          </motion.form>
        </div>
      </main>
    </>
  );
}