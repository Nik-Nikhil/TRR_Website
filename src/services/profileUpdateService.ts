import { supabase } from '../lib/supabase';

export interface ProfileUpdateRequest {
  id: string;
  playerId: string;
  playerNickname: string;
  timestamp: Date;
  changes: { field: string; oldValue: any; newValue: any }[];
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: Date;
}

const FIELD_MAP: Record<string, string> = {
  bio: 'bio',
  realName: 'real_name',
  currentMMR: 'current_mmr',
  peakMMR: 'peak_mmr',
  roles: 'roles',
  favoriteHeroes: 'favorite_heroes',
  discordUsername: 'discord_username',
  steamUrl: 'steam_url',
  dotabuffUrl: 'dotabuff_url',
};

function mapRow(r: any): ProfileUpdateRequest {
  return {
    id: r.id,
    playerId: r.player_id,
    playerNickname: r.player_nickname,
    timestamp: new Date(r.created_at),
    changes: r.changes || [],
    status: r.status,
    reviewedBy: r.reviewed_by,
    reviewedAt: r.reviewed_at ? new Date(r.reviewed_at) : undefined,
  };
}

class ProfileUpdateService {

  async submitUpdateRequest(
    playerId: string,
    playerNickname: string,
    changes: { field: string; oldValue: any; newValue: any }[]
  ): Promise<ProfileUpdateRequest | null> {
    const { data, error } = await supabase
      .from('profile_update_requests')
      .insert({ player_id: playerId, player_nickname: playerNickname, changes, status: 'pending' })
      .select()
      .single();

    if (error) { console.error('submitUpdateRequest:', error); return null; }
    return mapRow(data);
  }

  async getAllRequests(): Promise<ProfileUpdateRequest[]> {
    const { data, error } = await supabase
      .from('profile_update_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) { console.error('getAllRequests:', error); return []; }
    return (data || []).map(mapRow);
  }

  async getPendingRequests(): Promise<ProfileUpdateRequest[]> {
    const { data, error } = await supabase
      .from('profile_update_requests')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) { console.error('getPendingRequests:', error); return []; }
    return (data || []).map(mapRow);
  }

  async getPlayerRequests(playerId: string): Promise<ProfileUpdateRequest[]> {
    const { data, error } = await supabase
      .from('profile_update_requests')
      .select('*')
      .eq('player_id', playerId)
      .order('created_at', { ascending: false });

    if (error) { console.error('getPlayerRequests:', error); return []; }
    return (data || []).map(mapRow);
  }

  async getPendingCount(): Promise<number> {
    const { count, error } = await supabase
      .from('profile_update_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (error) return 0;
    return count || 0;
  }

  async approveRequest(requestId: string, adminUsername: string): Promise<boolean> {
    // Get the request first
    const { data: req, error: fetchErr } = await supabase
      .from('profile_update_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (fetchErr || !req) return false;

    // Apply changes to players table
    const updates: Record<string, any> = {};
    (req.changes || []).forEach((change: any) => {
      const dbField = FIELD_MAP[change.field] || change.field;
      updates[dbField] = change.newValue;
    });

    if (Object.keys(updates).length > 0) {
      const { error: updateErr } = await supabase
        .from('players')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', req.player_id);

      if (updateErr) { console.error('approveRequest apply:', updateErr); return false; }
    }

    // Mark as approved
    const { error } = await supabase
      .from('profile_update_requests')
      .update({ status: 'approved', reviewed_by: adminUsername, reviewed_at: new Date().toISOString() })
      .eq('id', requestId);

    if (error) { console.error('approveRequest update:', error); return false; }
    return true;
  }

  async rejectRequest(requestId: string, adminUsername: string): Promise<boolean> {
    const { error } = await supabase
      .from('profile_update_requests')
      .update({ status: 'rejected', reviewed_by: adminUsername, reviewed_at: new Date().toISOString() })
      .eq('id', requestId);

    if (error) { console.error('rejectRequest:', error); return false; }
    return true;
  }

  async deleteRequest(requestId: string): Promise<boolean> {
    const { error } = await supabase
      .from('profile_update_requests')
      .delete()
      .eq('id', requestId);

    if (error) { console.error('deleteRequest:', error); return false; }
    return true;
  }
}

export default new ProfileUpdateService();
