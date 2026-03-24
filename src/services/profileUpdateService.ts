// Profile Update Request Service
import { supabase } from '../lib/supabase';

export interface ProfileUpdateRequest {
  id: string;
  playerId: string;
  playerNickname: string;
  timestamp: Date;
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: Date;
}

class ProfileUpdateService {
  private storageKey = 'profileUpdateRequests';

  // Submit a profile update request
  submitUpdateRequest(
    playerId: string,
    playerNickname: string,
    changes: { field: string; oldValue: any; newValue: any }[]
  ): ProfileUpdateRequest {
    const requests = this.getAllRequests();
    
    const newRequest: ProfileUpdateRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      playerId,
      playerNickname,
      timestamp: new Date(),
      changes,
      status: 'pending'
    };

    requests.push(newRequest);
    localStorage.setItem(this.storageKey, JSON.stringify(requests));

    return newRequest;
  }

  // Get all requests
  getAllRequests(): ProfileUpdateRequest[] {
    const data = localStorage.getItem(this.storageKey);
    if (!data) return [];
    
    const requests = JSON.parse(data);
    // Convert timestamp strings back to Date objects
    return requests.map((req: any) => ({
      ...req,
      timestamp: new Date(req.timestamp),
      reviewedAt: req.reviewedAt ? new Date(req.reviewedAt) : undefined
    }));
  }

  // Get pending requests
  getPendingRequests(): ProfileUpdateRequest[] {
    return this.getAllRequests().filter(req => req.status === 'pending');
  }

  // Get requests for a specific player
  getPlayerRequests(playerId: string): ProfileUpdateRequest[] {
    return this.getAllRequests().filter(req => req.playerId === playerId);
  }

  // Approve a request
  async approveRequest(requestId: string, adminUsername: string): Promise<boolean> {
    const requests = this.getAllRequests();
    const request = requests.find(req => req.id === requestId);
    
    if (!request || request.status !== 'pending') {
      return false;
    }

    // Update request status
    request.status = 'approved';
    request.reviewedBy = adminUsername;
    request.reviewedAt = new Date();

    // Build Supabase update object from changes
    const updates: Record<string, any> = {};
    const fieldMap: Record<string, string> = {
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

    request.changes.forEach(change => {
      const dbField = fieldMap[change.field] || change.field;
      updates[dbField] = change.newValue;
    });

    if (Object.keys(updates).length > 0) {
      const { error } = await supabase
        .from('players')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', request.playerId);

      if (error) {
        console.error('Failed to apply profile update to Supabase:', error);
        return false;
      }
    }

    // Save updated requests to localStorage
    localStorage.setItem(this.storageKey, JSON.stringify(requests));
    return true;
  }

  // Reject a request
  rejectRequest(requestId: string, adminUsername: string): boolean {
    const requests = this.getAllRequests();
    const request = requests.find(req => req.id === requestId);
    
    if (!request || request.status !== 'pending') {
      return false;
    }

    request.status = 'rejected';
    request.reviewedBy = adminUsername;
    request.reviewedAt = new Date();

    localStorage.setItem(this.storageKey, JSON.stringify(requests));
    return true;
  }

  // Delete a request
  deleteRequest(requestId: string): boolean {
    const requests = this.getAllRequests();
    const filtered = requests.filter(req => req.id !== requestId);
    
    if (filtered.length === requests.length) {
      return false; // Request not found
    }

    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
    return true;
  }

  // Get count of pending requests
  getPendingCount(): number {
    return this.getPendingRequests().length;
  }
}

export default new ProfileUpdateService();
