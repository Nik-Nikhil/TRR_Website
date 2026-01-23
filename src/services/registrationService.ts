// Registration control service
interface RegistrationSettings {
  isEnabled: boolean;
  superAdminOverride: boolean;
  lastModifiedBy: string;
  lastModifiedAt: string;
  message?: string;
}

class RegistrationService {
  private storageKey = 'registrationSettings';
  
  // Default settings
  private defaultSettings: RegistrationSettings = {
    isEnabled: false,
    superAdminOverride: false,
    lastModifiedBy: 'system',
    lastModifiedAt: new Date().toISOString(),
    message: 'Registration starting soon. Stay tuned for updates.'
  };

  // Get current registration settings
  getSettings(): RegistrationSettings {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading registration settings:', error);
    }
    return this.defaultSettings;
  }

  // Update registration settings (admin level)
  updateSettings(
    isEnabled: boolean, 
    modifiedBy: string, 
    userRole: 'admin' | 'superadmin',
    message?: string
  ): { success: boolean; error?: string } {
    try {
      const currentSettings = this.getSettings();
      
      // Check if super admin has disabled and current user is not super admin
      if (currentSettings.superAdminOverride && userRole !== 'superadmin') {
        return {
          success: false,
          error: 'Registration is locked by Super Admin. Only Super Admin can modify this setting.'
        };
      }

      const newSettings: RegistrationSettings = {
        isEnabled,
        superAdminOverride: userRole === 'superadmin' ? !isEnabled : currentSettings.superAdminOverride,
        lastModifiedBy: modifiedBy,
        lastModifiedAt: new Date().toISOString(),
        message: message || currentSettings.message
      };

      localStorage.setItem(this.storageKey, JSON.stringify(newSettings));
      
      // Dispatch custom event to notify components
      window.dispatchEvent(new CustomEvent('registrationSettingsChanged', {
        detail: newSettings
      }));

      return { success: true };
    } catch (error) {
      console.error('Error updating registration settings:', error);
      return {
        success: false,
        error: 'Failed to update registration settings'
      };
    }
  }

  // Super admin override (can force disable and prevent admins from enabling)
  setSuperAdminOverride(
    isEnabled: boolean,
    modifiedBy: string
  ): { success: boolean; error?: string } {
    try {
      const newSettings: RegistrationSettings = {
        isEnabled,
        superAdminOverride: !isEnabled, // If disabled, set override to true
        lastModifiedBy: modifiedBy,
        lastModifiedAt: new Date().toISOString(),
        message: isEnabled 
          ? 'Registration is now open! Join the tournament and build your legendary team.'
          : 'Registration is currently disabled by Super Admin.'
      };

      localStorage.setItem(this.storageKey, JSON.stringify(newSettings));
      
      // Dispatch custom event to notify components
      window.dispatchEvent(new CustomEvent('registrationSettingsChanged', {
        detail: newSettings
      }));

      return { success: true };
    } catch (error) {
      console.error('Error setting super admin override:', error);
      return {
        success: false,
        error: 'Failed to set super admin override'
      };
    }
  }

  // Check if registration is currently enabled
  isRegistrationEnabled(): boolean {
    const settings = this.getSettings();
    return settings.isEnabled;
  }

  // Check if super admin has overridden settings
  isSuperAdminOverride(): boolean {
    const settings = this.getSettings();
    return settings.superAdminOverride;
  }

  // Get registration message
  getRegistrationMessage(): string {
    const settings = this.getSettings();
    return settings.message || this.defaultSettings.message!;
  }
}

export default new RegistrationService();