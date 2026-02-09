// Captain Service - Manage captain designations with Supabase
import { supabase } from '../lib/supabase';

interface CaptainData {
  id?: string;
  playerId: string;
  playerNickname: string;
  teamName: string;
  budget: number;
  assignedAt: string;
  assignedBy: string;
}

class CaptainService {
  // Get all captains from Supabase
  async getCaptains(): Promise<CaptainData[]> {
    try {
      const { data, error } = await supabase
        .from('captains')
        .select('*')
        .order('assigned_at', { ascending: false });

      if (error) {
        console.error('Error fetching captains:', error);
        return [];
      }

      return (data || []).map(c => ({
        id: c.id,
        playerId: c.player_id,
        playerNickname: c.player_nickname,
        teamName: c.team_name,
        budget: c.budget,
        assignedAt: c.assigned_at,
        assignedBy: c.assigned_by
      }));
    } catch (error) {
      console.error('Error fetching captains:', error);
      return [];
    }
  }

  // Check if player is a captain
  async isCaptain(playerId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('captains')
        .select('id')
        .eq('player_id', playerId)
        .maybeSingle();

      if (error) {
        console.error('Error checking if player is captain:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Exception checking if player is captain:', error);
      return false;
    }
  }

  // Get captain data for a player
  async getCaptainData(playerId: string): Promise<CaptainData | null> {
    try {
      const { data, error } = await supabase
        .from('captains')
        .select('*')
        .eq('player_id', playerId)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return {
        id: data.id,
        playerId: data.player_id,
        playerNickname: data.player_nickname,
        teamName: data.team_name,
        budget: data.budget,
        assignedAt: data.assigned_at,
        assignedBy: data.assigned_by
      };
    } catch (error) {
      console.error('Error fetching captain data:', error);
      return null;
    }
  }

  // Assign captain role to a player
  async assignCaptain(
    playerId: string,
    playerNickname: string,
    teamName: string,
    budget: number,
    assignedBy: string
  ): Promise<boolean> {
    try {
      // Check if already a captain
      const exists = await this.isCaptain(playerId);
      if (exists) {
        console.error('Player is already a captain');
        return false;
      }

      // Check if team name already exists (without .single() to avoid error)
      const { data: existingTeams, error: teamCheckError } = await supabase
        .from('captains')
        .select('id')
        .ilike('team_name', teamName);

      if (teamCheckError) {
        console.error('Error checking team name:', teamCheckError);
        return false;
      }

      if (existingTeams && existingTeams.length > 0) {
        console.error('Team name already exists');
        return false;
      }

      // Insert captain - player_id can be a string (not UUID) since we're using local player data
      const { error } = await supabase
        .from('captains')
        .insert({
          player_id: playerId,
          player_nickname: playerNickname,
          team_name: teamName,
          budget: budget,
          assigned_by: assignedBy
        });

      if (error) {
        console.error('Error assigning captain:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error assigning captain:', error);
      return false;
    }
  }

  // Remove captain role
  async removeCaptain(playerId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('captains')
        .delete()
        .eq('player_id', playerId);

      if (error) {
        console.error('Error removing captain:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error removing captain:', error);
      return false;
    }
  }

  // Update captain budget
  async updateBudget(playerId: string, newBudget: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('captains')
        .update({ budget: newBudget })
        .eq('player_id', playerId);

      if (error) {
        console.error('Error updating budget:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating budget:', error);
      return false;
    }
  }

  // Get all team names
  async getTeamNames(): Promise<string[]> {
    const captains = await this.getCaptains();
    return captains.map(c => c.teamName);
  }

  // Subscribe to captain changes
  subscribeToCaptains(callback: () => void) {
    const channel = supabase
      .channel('captains-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'captains'
        },
        () => {
          callback();
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Subscribed to captain changes');
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('❌ Captain subscription error:', err);
        }
        if (status === 'TIMED_OUT') {
          console.error('⏱️ Captain subscription timed out');
        }
      });

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      }
    };
  }
}

export default new CaptainService();
