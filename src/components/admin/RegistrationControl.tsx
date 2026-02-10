import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Shield, 
  AlertTriangle, CheckCircle, Lock, Unlock,
  Clock, Settings
} from 'lucide-react';
import registrationService from '../../services/registrationService';
import { supabase } from '../../lib/supabase';

interface RegistrationSettings {
  isEnabled: boolean;
  superAdminOverride: boolean;
  lastModifiedBy: string;
  lastModifiedAt: string;
  message?: string;
}

interface RegistrationControlProps {
  userRole: 'admin' | 'superadmin';
  username: string;
}

export default function RegistrationControl({ userRole, username }: RegistrationControlProps) {
  const [settings, setSettings] = useState<RegistrationSettings>({
    isEnabled: false,
    superAdminOverride: false,
    lastModifiedBy: 'system',
    lastModifiedAt: new Date().toISOString(),
    message: 'Registration starting soon. Stay tuned for updates.'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showMessageEditor, setShowMessageEditor] = useState(false);

  useEffect(() => {
    // Load initial settings
    const loadSettings = async () => {
      const currentSettings = await registrationService.getSettings();
      setSettings(currentSettings);
      setMessage(currentSettings.message || '');
    };
    
    loadSettings();

    // Subscribe to real-time changes
    const channel = registrationService.subscribeToChanges((newSettings) => {
      setSettings(newSettings);
      setMessage(newSettings.message || '');
    });

    // Listen for settings changes
    const handleSettingsChange = (event: CustomEvent) => {
      setSettings(event.detail);
      setMessage(event.detail.message || '');
    };

    window.addEventListener('registrationSettingsChanged', handleSettingsChange as EventListener);
    
    return () => {
      window.removeEventListener('registrationSettingsChanged', handleSettingsChange as EventListener);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const handleToggleRegistration = async () => {
    setIsLoading(true);
    
    const newState = !settings.isEnabled;
    const result = await registrationService.updateSettings(
      newState, 
      username, 
      userRole,
      message
    );

    if (result.success) {
      // Settings will be updated via event listener
    } else {
      alert(result.error);
    }
    
    setIsLoading(false);
  };

  const handleSuperAdminOverride = async () => {
    if (userRole !== 'superadmin') return;
    
    setIsLoading(true);
    
    const newState = !settings.isEnabled;
    const result = await registrationService.setSuperAdminOverride(newState, username);

    if (result.success) {
      // Settings will be updated via event listener
    } else {
      alert(result.error);
    }
    
    setIsLoading(false);
  };

  const handleUpdateMessage = async () => {
    const result = await registrationService.updateSettings(
      settings.isEnabled,
      username,
      userRole,
      message
    );

    if (result.success) {
      setShowMessageEditor(false);
    } else {
      alert(result.error);
    }
  };

  const canModify = !settings.superAdminOverride || userRole === 'superadmin';

  return (
    <div className="space-y-6">
      {/* Main Control Panel */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-bold text-white">Registration Control</h3>
            {settings.superAdminOverride && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
                <Lock className="w-3 h-3 text-red-400" />
                <span className="text-xs text-red-300">Super Admin Lock</span>
              </div>
            )}
          </div>
          
          {userRole === 'superadmin' && (
            <div className="flex items-center space-x-1 px-2 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full">
              <Shield className="w-3 h-3 text-orange-400" />
              <span className="text-xs text-orange-300">Super Admin</span>
            </div>
          )}
        </div>

        {/* Status Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className={`p-4 rounded-lg border ${
            settings.isEnabled 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              {settings.isEnabled ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-400" />
              )}
              <span className={`font-medium ${
                settings.isEnabled ? 'text-green-300' : 'text-red-300'
              }`}>
                Registration {settings.isEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <p className={`text-sm ${
              settings.isEnabled ? 'text-green-400/80' : 'text-red-400/80'
            }`}>
              {settings.isEnabled 
                ? 'Players can register for tournaments'
                : 'Registration is currently closed'
              }
            </p>
          </div>

          <div className="p-4 rounded-lg border border-gray-600/30 bg-gray-700/20">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="font-medium text-gray-300">Last Modified</span>
            </div>
            <p className="text-sm text-gray-400">
              By {settings.lastModifiedBy} • {new Date(settings.lastModifiedAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Regular Admin Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
            <div>
              <h4 className="text-white font-medium">Registration Status</h4>
              <p className="text-gray-400 text-sm">
                {canModify 
                  ? 'Toggle registration on/off for players'
                  : 'Locked by Super Admin - cannot be modified'
                }
              </p>
            </div>
            
            <button
              onClick={handleToggleRegistration}
              disabled={isLoading || !canModify}
              className={`relative inline-flex items-center h-8 w-14 rounded-full transition-colors duration-300 ${
                settings.isEnabled 
                  ? 'bg-green-500' 
                  : 'bg-gray-600'
              } ${!canModify ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <motion.div
                animate={{ x: settings.isEnabled ? 24 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-6 h-6 bg-white rounded-full shadow-lg"
              />
            </button>
          </div>

          {/* Super Admin Override */}
          {userRole === 'superadmin' && (
            <div className="flex items-center justify-between p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <div>
                <h4 className="text-orange-300 font-medium flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Super Admin Override</span>
                </h4>
                <p className="text-orange-400/80 text-sm">
                  Force disable and prevent admins from enabling registration
                </p>
              </div>
              
              <button
                onClick={handleSuperAdminOverride}
                disabled={isLoading}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                {settings.isEnabled ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                <span>{settings.isEnabled ? 'Force Disable' : 'Enable'}</span>
              </button>
            </div>
          )}

          {/* Message Editor */}
          <div className="p-4 bg-gray-700/30 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-medium">Registration Message</h4>
              <button
                onClick={() => setShowMessageEditor(!showMessageEditor)}
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1"
              >
                <Settings className="w-4 h-4" />
                <span>Edit</span>
              </button>
            </div>
            
            {showMessageEditor ? (
              <div className="space-y-3">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm resize-none"
                  rows={3}
                  placeholder="Enter registration message..."
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleUpdateMessage}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setShowMessageEditor(false);
                      setMessage(settings.message || '');
                    }}
                    className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-300 text-sm bg-gray-800/50 p-3 rounded">
                {settings.message || 'No message set'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <h4 className="text-blue-300 font-medium mb-2">How it works:</h4>
        <ul className="text-blue-400/80 text-sm space-y-1">
          <li>• Admins can enable/disable registration when not locked by Super Admin</li>
          <li>• Super Admin can override and lock settings to prevent admin changes</li>
          <li>• The homepage registration button updates automatically based on these settings</li>
          <li>• Custom messages are displayed to users on the homepage</li>
        </ul>
      </div>
    </div>
  );
}