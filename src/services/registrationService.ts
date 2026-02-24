import { supabase } from '../lib/supabase';

// Registration control service
interface RegistrationSettings {
  id?: string;
  isEnabled: boolean;
  superAdminOverride: boolean;
  currentSeason: number;
  lastModifiedBy: string;
  lastModifiedAt: string;
  message?: string;
}

class RegistrationService {
  // Default settings
  private defaultSettings: RegistrationSettings = {
    isEnabled: false,
    superAdminOverride: false,
    currentSeason: 1,
    lastModifiedBy: 'system',
    lastModifiedAt: new Date().toISOString(),
    message: 'Registration starting soon. Stay tuned for updates.'
  };

  // Get current registration settings from Supabase
  async getSettings(): Promise<RegistrationSettings> {
    try {
      const { data, error } = await supabase
        .from('registration_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error loading registration settings:', error);
        return this.defaultSettings;
      }

      if (data) {
        return {
          id: data.id,
          isEnabled: data.is_enabled,
          superAdminOverride: data.super_admin_override,
          currentSeason: data.current_season || 1,
          lastModifiedBy: data.last_modified_by,
          lastModifiedAt: data.last_modified_at,
          message: data.message
        };
      }
    } catch (error) {
      console.error('Error loading registration settings:', error);
    }
    return this.defaultSettings;
  }

  // Update registration settings (admin level)
  async updateSettings(
    isEnabled: boolean, 
    modifiedBy: string, 
    userRole: 'admin' | 'superadmin',
    message?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const currentSettings = await this.getSettings();
      
      // Check if super admin has disabled and current user is not super admin
      if (currentSettings.superAdminOverride && userRole !== 'superadmin') {
        return {
          success: false,
          error: 'Registration is locked by Super Admin. Only Super Admin can modify this setting.'
        };
      }

      const updateData = {
        is_enabled: isEnabled,
        super_admin_override: userRole === 'superadmin' ? !isEnabled : currentSettings.superAdminOverride,
        last_modified_by: modifiedBy,
        last_modified_at: new Date().toISOString(),
        message: message || currentSettings.message
      };

      const { error } = await supabase
        .from('registration_settings')
        .update(updateData)
        .eq('id', currentSettings.id || '');

      if (error) {
        console.error('Error updating registration settings:', error);
        return {
          success: false,
          error: 'Failed to update registration settings'
        };
      }

      // Dispatch custom event to notify components
      window.dispatchEvent(new CustomEvent('registrationSettingsChanged', {
        detail: { ...currentSettings, ...updateData }
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
  async setSuperAdminOverride(
    isEnabled: boolean,
    modifiedBy: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const currentSettings = await this.getSettings();

      const updateData = {
        is_enabled: isEnabled,
        super_admin_override: !isEnabled, // If disabled, set override to true
        last_modified_by: modifiedBy,
        last_modified_at: new Date().toISOString(),
        message: isEnabled 
          ? 'Registration is now open! Join the tournament and build your legendary team.'
          : 'Registration is currently disabled by Super Admin.'
      };

      const { error } = await supabase
        .from('registration_settings')
        .update(updateData)
        .eq('id', currentSettings.id || '');

      if (error) {
        console.error('Error setting super admin override:', error);
        return {
          success: false,
          error: 'Failed to set super admin override'
        };
      }

      // Dispatch custom event to notify components
      window.dispatchEvent(new CustomEvent('registrationSettingsChanged', {
        detail: { ...currentSettings, ...updateData }
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
  async isRegistrationEnabled(): Promise<boolean> {
    const settings = await this.getSettings();
    return settings.isEnabled;
  }

  // Check if super admin has overridden settings
  async isSuperAdminOverride(): Promise<boolean> {
    const settings = await this.getSettings();
    return settings.superAdminOverride;
  }

  // Get registration message
  async getRegistrationMessage(): Promise<string> {
    const settings = await this.getSettings();
    return settings.message || this.defaultSettings.message!;
  }

  // Get current season number
  async getCurrentSeason(): Promise<number> {
    const settings = await this.getSettings();
    return settings.currentSeason || 1;
  }

  // Update season number
  async updateSeasonNumber(
    seasonNumber: number,
    modifiedBy: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const currentSettings = await this.getSettings();

      const updateData = {
        current_season: seasonNumber,
        last_modified_by: modifiedBy,
        last_modified_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('registration_settings')
        .update(updateData)
        .eq('id', currentSettings.id || '');

      if (error) {
        console.error('Error updating season number:', error);
        return {
          success: false,
          error: 'Failed to update season number'
        };
      }

      // Dispatch custom event to notify components
      window.dispatchEvent(new CustomEvent('registrationSettingsChanged', {
        detail: { ...currentSettings, ...updateData }
      }));

      return { success: true };
    } catch (error) {
      console.error('Error updating season number:', error);
      return {
        success: false,
        error: 'Failed to update season number'
      };
    }
  }

  // Subscribe to real-time changes
  subscribeToChanges(callback: (settings: RegistrationSettings) => void) {
    const channel = supabase
      .channel('registration_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'registration_settings'
        },
        (payload) => {
          if (payload.new) {
            const data = payload.new as any;
            const settings: RegistrationSettings = {
              id: data.id,
              isEnabled: data.is_enabled,
              superAdminOverride: data.super_admin_override,
              currentSeason: data.current_season || 1,
              lastModifiedBy: data.last_modified_by,
              lastModifiedAt: data.last_modified_at,
              message: data.message
            };
            callback(settings);
          }
        }
      )
      .subscribe();

    return channel;
  }
}

export default new RegistrationService();
