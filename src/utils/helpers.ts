// Utility helper functions

/**
 * Format date to readable string
 */
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format date and time
 */
export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Generate avatar URL fallback
 */
export const getAvatarUrl = (name: string, avatarUrl?: string): string => {
  if (avatarUrl && avatarUrl !== '/avatars/default.jpg') {
    return avatarUrl;
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`;
};

/**
 * Validate Steam URL
 */
export const isValidSteamUrl = (url: string): boolean => {
  const steamUrlPattern = /^https:\/\/steamcommunity\.com\/(profiles|id)\/[a-zA-Z0-9_-]+\/?$/;
  return steamUrlPattern.test(url);
};

/**
 * Extract Steam ID from URL
 */
export const extractSteamId = (url: string): string | null => {
  const match = url.match(/\/profiles\/(\d+)/);
  return match ? match[1] : null;
};

/**
 * Validate Discord username
 */
export const isValidDiscordUsername = (username: string): boolean => {
  // Discord usernames can be in format: username#1234 or just username
  const discordPattern = /^[a-zA-Z0-9._-]{2,32}(#\d{4})?$/;
  return discordPattern.test(username);
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Capitalize first letter
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Generate random ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

/**
 * Check if session is expired
 */
export const isSessionExpired = (loginTime: string, durationMs: number): boolean => {
  const login = new Date(loginTime);
  const now = new Date();
  return (now.getTime() - login.getTime()) > durationMs;
};

/**
 * Format MMR with proper styling
 */
export const formatMMR = (mmr: number): string => {
  if (mmr >= 1000) {
    return `${(mmr / 1000).toFixed(1)}k`;
  }
  return mmr.toString();
};

/**
 * Get medal color based on MMR
 */
export const getMedalColor = (mmr: number): string => {
  if (mmr >= 5500) return '#FFD700'; // Immortal - Gold
  if (mmr >= 4620) return '#9932CC'; // Divine - Purple
  if (mmr >= 3696) return '#1E90FF'; // Ancient - Blue
  if (mmr >= 2772) return '#32CD32'; // Legend - Green
  if (mmr >= 1848) return '#FFA500'; // Archon - Orange
  if (mmr >= 924) return '#C0C0C0';  // Crusader - Silver
  return '#CD7F32'; // Herald/Guardian - Bronze
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

/**
 * Clean and format nickname
 */
export const cleanNickname = (nickname: string): string => {
  return nickname.trim().replace(/[^a-zA-Z0-9._-]/g, '');
};

/**
 * Get role icon path
 */
export const getRoleIcon = (roleId: string): string => {
  const roleMap: Record<string, string> = {
    'carry': '/icons/pos_1.png',
    'mid': '/icons/pos_2.png',
    'offlane': '/icons/pos_3.png',
    'support': '/icons/pos_4.png',
    'hard-support': '/icons/pos_5.png'
  };
  return roleMap[roleId] || '/icons/pos_1.png';
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Sleep/delay function
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Format player name for display
 */
export const formatPlayerName = (nickname: string, realName?: string): string => {
  if (realName && realName.trim()) {
    return `${nickname} (${realName})`;
  }
  return nickname;
};

/**
 * Get initials from name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};

/**
 * Validate Steam ID format
 */
export const isValidSteamId = (steamId: string): boolean => {
  // Steam ID64 format: 17 digits starting with 7656119
  const steamIdPattern = /^7656119\d{10}$/;
  return steamIdPattern.test(steamId);
};

/**
 * Format tournament season name
 */
export const formatSeasonName = (season: string | number): string => {
  if (typeof season === 'number') {
    return `Season ${season}`;
  }
  return season.toString();
};

/**
 * Get relative time string
 */
export const getRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const target = new Date(date);
  const diffMs = now.getTime() - target.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatDate(date);
};

/**
 * Parse MMR from string or number
 */
export const parseMMR = (mmr: string | number | undefined): number => {
  if (typeof mmr === 'number') return mmr;
  if (typeof mmr === 'string') {
    const parsed = parseInt(mmr.replace(/[^\d]/g, ''), 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

/**
 * Generate team color based on name
 */
export const generateTeamColor = (teamName: string): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  
  let hash = 0;
  for (let i = 0; i < teamName.length; i++) {
    hash = teamName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Check if URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};