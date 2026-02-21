// Admin Service - Manage admins with Supabase
import { supabase } from '../lib/supabase';

export interface Admin {
  id?: string;
  username: string;
  displayName: string;
  realName?: string;
  password?: string; // Only used when creating/updating
  passwordHash?: string;
  role: 'Founder' | 'Admin' | 'Mini Admin';
  avatarUrl?: string;
  description?: string;
  githubUrl?: string;
  twitchUrl?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Simple password hashing (for development - use bcrypt in production)
async function hashPassword(password: string): Promise<string> {
  // For now, we'll store passwords as-is
  // TODO: Implement proper bcrypt hashing in production
  return password;
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  // For now, simple comparison
  // TODO: Implement proper bcrypt verification in production
  return password === hash;
}

class AdminService {
  // Get all admins from Supabase
  async getAdmins(): Promise<Admin[]> {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching admins:', error);
        return [];
      }

      return (data || []).map(a => ({
        id: a.id,
        username: a.username,
        displayName: a.display_name,
        realName: a.real_name,
        passwordHash: a.password_hash,
        role: a.role,
        avatarUrl: a.avatar_url,
        description: a.description,
        githubUrl: a.github_url,
        twitchUrl: a.twitch_url,
        isActive: a.is_active,
        createdAt: a.created_at,
        updatedAt: a.updated_at
      }));
    } catch (error) {
      console.error('Error fetching admins:', error);
      return [];
    }
  }

  // Get admin by username
  async getAdminByUsername(username: string): Promise<Admin | null> {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('username', username)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return {
        id: data.id,
        username: data.username,
        displayName: data.display_name,
        realName: data.real_name,
        passwordHash: data.password_hash,
        role: data.role,
        avatarUrl: data.avatar_url,
        description: data.description,
        githubUrl: data.github_url,
        twitchUrl: data.twitch_url,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Error fetching admin:', error);
      return null;
    }
  }

  // Add new admin
  async addAdmin(admin: Admin): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if username already exists
      const existing = await this.getAdminByUsername(admin.username);
      if (existing) {
        return {
          success: false,
          error: 'Username already exists'
        };
      }

      // Hash password
      if (!admin.password) {
        return {
          success: false,
          error: 'Password is required'
        };
      }

      const passwordHash = await hashPassword(admin.password);

      // Insert admin
      const { error } = await supabase
        .from('admins')
        .insert({
          username: admin.username,
          display_name: admin.displayName,
          real_name: admin.realName,
          password_hash: passwordHash,
          role: admin.role,
          avatar_url: admin.avatarUrl,
          description: admin.description,
          github_url: admin.githubUrl,
          twitch_url: admin.twitchUrl,
          is_active: admin.isActive
        });

      if (error) {
        console.error('Error adding admin:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error adding admin:', error);
      return {
        success: false,
        error: error.message || 'Unknown error'
      };
    }
  }

  // Update admin
  async updateAdmin(
    id: string,
    updates: Partial<Admin>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const updateData: any = {};

      if (updates.displayName) updateData.display_name = updates.displayName;
      if (updates.realName !== undefined) updateData.real_name = updates.realName;
      if (updates.role) updateData.role = updates.role;
      if (updates.avatarUrl !== undefined) updateData.avatar_url = updates.avatarUrl;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.githubUrl !== undefined) updateData.github_url = updates.githubUrl;
      if (updates.twitchUrl !== undefined) updateData.twitch_url = updates.twitchUrl;
      if (updates.isActive !== undefined) updateData.is_active = updates.isActive;

      // Hash new password if provided
      if (updates.password) {
        updateData.password_hash = await hashPassword(updates.password);
      }

      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('admins')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating admin:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error updating admin:', error);
      return {
        success: false,
        error: error.message || 'Unknown error'
      };
    }
  }

  // Delete admin
  async deleteAdmin(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('admins')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting admin:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error deleting admin:', error);
      return {
        success: false,
        error: error.message || 'Unknown error'
      };
    }
  }

  // Verify admin credentials
  async verifyCredentials(
    username: string,
    password: string
  ): Promise<{ valid: boolean; admin?: Admin }> {
    try {
      const admin = await this.getAdminByUsername(username);
      
      if (!admin || !admin.passwordHash) {
        return { valid: false };
      }

      if (!admin.isActive) {
        return { valid: false };
      }

      const isValid = await verifyPassword(password, admin.passwordHash);
      
      if (isValid) {
        return { valid: true, admin };
      }

      return { valid: false };
    } catch (error) {
      console.error('Error verifying credentials:', error);
      return { valid: false };
    }
  }

  // Subscribe to admin changes
  subscribeToAdmins(callback: () => void) {
    const channel = supabase
      .channel('admins-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'admins'
        },
        () => {
          callback();
        }
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      }
    };
  }
}

export default new AdminService();
