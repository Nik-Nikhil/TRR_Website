// Profile Update Request Service
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
  approveRequest(requestId: string, adminUsername: string): boolean {
    const requests = this.getAllRequests();
    const request = requests.find(req => req.id === requestId);
    
    if (!request || request.status !== 'pending') {
      return false;
    }

    // Update request status
    request.status = 'approved';
    request.reviewedBy = adminUsername;
    request.reviewedAt = new Date();

    // Apply changes to player profile
    const players = JSON.parse(localStorage.getItem('players') || '[]');
    const playerIndex = players.findIndex((p: any) => p.id === request.playerId);
    
    if (playerIndex !== -1) {
      request.changes.forEach(change => {
        players[playerIndex][change.field] = change.newValue;
      });
      localStorage.setItem('players', JSON.stringify(players));
    }

    // Save updated requests
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
