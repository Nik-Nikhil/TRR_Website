import { supabase } from '../lib/supabase';

export interface RegistrationRequest {
  id: string;
  player_id: string;
  player_nickname: string;
  player_data: any;
  in_game_name: string;
  discord_username?: string;
  whatsapp_number?: string;
  current_mmr?: number;
  player_type: 'core' | 'support';
  selected_roles: string[];
  ping_range?: string;
  is_captain_available: boolean;
  season_number: number;
  mmr_proof_url?: string;
  mmr_changed: boolean;
  status: 'pending' | 'approved' | 'denied';
  denial_reason?: string;
  denied_at?: string;
  denied_by?: string;
  approved_at?: string;
  approved_by?: string;
  created_at: string;
  updated_at: string;
}

class RegistrationRequestService {
  
  // Submit a new registration request
  async submitRegistration(data: {
    player_id: string;
    player_nickname: string;
    player_data: any;
    in_game_name: string;
    discord_username?: string;
    whatsapp_number?: string;
    current_mmr?: number;
    player_type: 'core' | 'support';
    selected_roles: string[];
    ping_range?: string;
    is_captain_available: boolean;
    season_number: number;
    mmr_proof_url?: string;
    mmr_changed: boolean;
  }): Promise<{ success: boolean; error?: string; data?: any }> {
    try {
      const { data: result, error } = await supabase
        .from('registration_requests')
        .insert([{
          ...data,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Get all registration requests (for admin)
  async getAllRequests(status?: 'pending' | 'approved' | 'denied'): Promise<RegistrationRequest[]> {
    try {
      let query = supabase
        .from('registration_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) {
        return [];
      }

      return data || [];
    } catch (error) {
      return [];
    }
  }

  // Get pending requests count
  async getPendingCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('registration_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (error) {
        return 0;
      }

      return count || 0;
    } catch (error) {
      return 0;
    }
  }

  // Get registration request by player ID
  async getRequestByPlayerId(playerId: string): Promise<RegistrationRequest | null> {
    try {
      const { data, error } = await supabase
        .from('registration_requests')
        .select('*')
        .eq('player_id', playerId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        return null;
      }

      return data;
    } catch (error) {
      return null;
    }
  }

  // Approve a registration request
  async approveRequest(
    requestId: string,
    adminId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('registration_requests')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: adminId
        })
        .eq('id', requestId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Deny a registration request
  async denyRequest(
    requestId: string,
    adminId: string,
    reason: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('registration_requests')
        .update({
          status: 'denied',
          denial_reason: reason,
          denied_at: new Date().toISOString(),
          denied_by: adminId
        })
        .eq('id', requestId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Subscribe to registration requests changes
  subscribeToRequests(callback: (payload: any) => void) {
    const channel = supabase
      .channel('registration_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'registration_requests'
        },
        callback
      )
      .subscribe();

    return channel;
  }

  // Delete a registration request (for resubmission)
  async deleteRequest(requestId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('registration_requests')
        .delete()
        .eq('id', requestId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

export default new RegistrationRequestService();
