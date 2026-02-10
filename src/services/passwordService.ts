import { supabase } from '../lib/supabase';
import bcrypt from 'bcryptjs';

export type UserType = 'player' | 'admin' | 'superadmin';

interface PasswordRecord {
  id: string;
  user_id: string;
  user_type: UserType;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

class PasswordService {
  private readonly SALT_ROUNDS = 10;

  // Hash a password
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  // Verify a password against a hash
  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Set or update password for a user
  async setPassword(
    userId: string,
    userType: UserType,
    password: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Validation
      if (!password || password.length < 8) {
        return { success: false, error: 'Password must be at least 8 characters long' };
      }

      // Check for at least one uppercase letter
      if (!/[A-Z]/.test(password)) {
        return { success: false, error: 'Password must contain at least one uppercase letter' };
      }

      // Check for at least one number
      if (!/[0-9]/.test(password)) {
        return { success: false, error: 'Password must contain at least one number' };
      }

      // Check for at least one symbol
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        return { success: false, error: 'Password must contain at least one symbol (!@#$%^&* etc.)' };
      }

      const passwordHash = await this.hashPassword(password);

      // Check if password already exists
      const { data: existing } = await supabase
        .from('user_passwords')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        // Update existing password
        const { error } = await supabase
          .from('user_passwords')
          .update({
            password_hash: passwordHash,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);

        if (error) {
          console.error('Error updating password:', error);
          return { success: false, error: error.message };
        }
      } else {
        // Insert new password
        const { error } = await supabase
          .from('user_passwords')
          .insert({
            user_id: userId,
            user_type: userType,
            password_hash: passwordHash
          });

        if (error) {
          console.error('Error creating password:', error);
          return { success: false, error: error.message };
        }
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error in setPassword:', error);
      return { success: false, error: error.message };
    }
  }

  // Verify user password
  async verifyUserPassword(
    userId: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('user_passwords')
        .select('password_hash')
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        return { success: false, error: 'Password not found' };
      }

      const isValid = await this.verifyPassword(password, data.password_hash);

      if (!isValid) {
        return { success: false, error: 'Invalid password' };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error in verifyUserPassword:', error);
      return { success: false, error: error.message };
    }
  }

  // Change password (requires old password verification)
  async changePassword(
    userId: string,
    userType: UserType,
    oldPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Verify old password
      const verification = await this.verifyUserPassword(userId, oldPassword);
      if (!verification.success) {
        return { success: false, error: 'Current password is incorrect' };
      }

      // Set new password
      return await this.setPassword(userId, userType, newPassword);
    } catch (error: any) {
      console.error('Error in changePassword:', error);
      return { success: false, error: error.message };
    }
  }

  // Check if user has a password set
  async hasPassword(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_passwords')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error checking password:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error in hasPassword:', error);
      return false;
    }
  }

  // Admin function: Reset user password (no old password required)
  async resetPassword(
    userId: string,
    userType: UserType,
    newPassword: string,
    adminUsername: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.setPassword(userId, userType, newPassword);
      
      if (result.success) {
        // Log the password reset action
        const event = new CustomEvent('passwordReset', {
          detail: { userId, userType, adminUsername }
        });
        window.dispatchEvent(event);
      }

      return result;
    } catch (error: any) {
      console.error('Error in resetPassword:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new PasswordService();
