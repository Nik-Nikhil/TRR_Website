// Captain Service - Manage captain designations
interface CaptainData {
  playerId: string;
  playerNickname: string;
  teamName: string;
  budget: number;
  assignedAt: string;
  assignedBy: string;
}

class CaptainService {
  private readonly STORAGE_KEY = 'trr_captains';

  // Get all captains
  getCaptains(): CaptainData[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  // Check if player is a captain
  isCaptain(playerId: string): boolean {
    const captains = this.getCaptains();
    return captains.some(c => c.playerId === playerId);
  }

  // Get captain data for a player
  getCaptainData(playerId: string): CaptainData | null {
    const captains = this.getCaptains();
    return captains.find(c => c.playerId === playerId) || null;
  }

  // Assign captain role to a player
  assignCaptain(
    playerId: string,
    playerNickname: string,
    teamName: string,
    budget: number,
    assignedBy: string
  ): boolean {
    try {
      const captains = this.getCaptains();
      
      // Check if already a captain
      if (this.isCaptain(playerId)) {
        return false;
      }

      // Check if team name already exists
      if (captains.some(c => c.teamName.toLowerCase() === teamName.toLowerCase())) {
        return false;
      }

      const newCaptain: CaptainData = {
        playerId,
        playerNickname,
        teamName,
        budget,
        assignedAt: new Date().toISOString(),
        assignedBy
      };

      captains.push(newCaptain);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(captains));

      // Dispatch event for real-time updates
      window.dispatchEvent(new CustomEvent('captainAssigned', { 
        detail: { captain: newCaptain } 
      }));

      return true;
    } catch (error) {
      console.error('Error assigning captain:', error);
      return false;
    }
  }

  // Remove captain role
  removeCaptain(playerId: string): boolean {
    try {
      const captains = this.getCaptains();
      const filtered = captains.filter(c => c.playerId !== playerId);
      
      if (filtered.length === captains.length) {
        return false; // Captain not found
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));

      // Dispatch event for real-time updates
      window.dispatchEvent(new CustomEvent('captainRemoved', { 
        detail: { playerId } 
      }));

      return true;
    } catch (error) {
      console.error('Error removing captain:', error);
      return false;
    }
  }

  // Update captain budget
  updateBudget(playerId: string, newBudget: number): boolean {
    try {
      const captains = this.getCaptains();
      const captain = captains.find(c => c.playerId === playerId);
      
      if (!captain) {
        return false;
      }

      captain.budget = newBudget;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(captains));

      return true;
    } catch (error) {
      console.error('Error updating budget:', error);
      return false;
    }
  }

  // Get all team names
  getTeamNames(): string[] {
    return this.getCaptains().map(c => c.teamName);
  }
}

export default new CaptainService();
